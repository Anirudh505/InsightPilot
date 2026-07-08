import { verifyAccessToken } from '../utils/token.util.js';
import userRepository from '../repositories/user.repository.js';
import organizationMemberRepository from '../repositories/organizationMember.repository.js';
import { UnauthorizedError, ForbiddenError } from '../utils/ApiError.js';
import AsyncHandler from '../utils/AsyncHandler.js';

/**
 * Middleware to authenticate user via JWT Access Token in Authorization header
 */
export const authenticateUser = AsyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new UnauthorizedError('Not authorized, no token provided');
  }

  try {
    const decoded = verifyAccessToken(token);
    
    // Find user and attach to request
    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      throw new UnauthorizedError('Not authorized, user not found');
    }
    
    if (user.status !== 'active') {
      throw new UnauthorizedError('Not authorized, account is inactive');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new UnauthorizedError('Not authorized, token failed');
  }
});

/**
 * Middleware for optional authentication. 
 * Doesn't throw error if token is missing/invalid, just leaves req.user undefined.
 */
export const optionalAuthentication = AsyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = verifyAccessToken(token);
      const user = await userRepository.findById(decoded.userId);
      if (user && user.status === 'active') {
        req.user = user;
      }
    } catch (error) {
      // Ignore errors for optional auth
    }
  }
  next();
});

/**
 * Middleware to authorize user based on Organization Roles
 * Expects orgId to be in req.params.orgId or req.body.orgId
 * 
 * @param  {...string} roles - List of allowed roles (e.g., ROLES.OWNER, ROLES.ADMIN)
 */
export const authorizeRoles = (...roles) => {
  return AsyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new UnauthorizedError('Not authenticated');
    }

    const orgId = req.params.orgId || req.body.orgId || req.query.orgId;
    if (!orgId) {
      throw new ForbiddenError('Organization ID is required for role authorization');
    }

    const membership = await organizationMemberRepository.findByUserAndOrg(req.user._id, orgId);
    
    if (!membership || membership.status !== 'active') {
      throw new ForbiddenError('Not a member of this organization');
    }

    if (!roles.includes(membership.role)) {
      throw new ForbiddenError(`Role ${membership.role} is not authorized to access this route`);
    }

    // Attach membership to request for downstream use
    req.membership = membership;
    next();
  });
};

/**
 * Middleware to authorize user based on Project Roles
 * Expects projectId to be in req.params.projectId or req.body.projectId
 * 
 * @param  {...string} roles - List of allowed roles
 */
export const authorizeProjectRoles = (...roles) => {
  return AsyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new UnauthorizedError('Not authenticated');
    }

    const projectId = req.params.projectId || req.body.projectId || req.query.projectId;
    if (!projectId) {
      throw new ForbiddenError('Project ID is required for role authorization');
    }

    // Lazy load repository to avoid circular dependencies if any
    const { default: projectMemberRepo } = await import('../repositories/projectMember.repository.js');
    
    const membership = await projectMemberRepo.findByUserAndProject(req.user._id, projectId);
    
    if (!membership || membership.status !== 'active') {
      throw new ForbiddenError('Not a member of this project');
    }

    if (!roles.includes(membership.role)) {
      throw new ForbiddenError(`Role ${membership.role} is not authorized to access this route`);
    }

    req.projectMembership = membership;
    next();
  });
};
