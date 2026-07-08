import { body } from 'express-validator';
import { ROLE_VALUES } from '../constants/roles.js';

export const addProjectMemberValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('role').isIn(ROLE_VALUES).withMessage(`Role must be one of: ${ROLE_VALUES.join(', ')}`)
];

export const updateProjectRoleValidator = [
  body('role').isIn(ROLE_VALUES).withMessage(`Role must be one of: ${ROLE_VALUES.join(', ')}`)
];
