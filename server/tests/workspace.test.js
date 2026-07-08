import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { env } from '../src/config/env.config.js';
import { User } from '../src/models/user.model.js';
import { Organization } from '../src/models/organization.model.js';
import { OrganizationMember } from '../src/models/organizationMember.model.js';
import { Workspace } from '../src/models/workspace.model.js';
import connectDB from '../src/config/db.config.js';
import { generateAccessToken } from '../src/utils/token.util.js';
import { ROLES } from '../src/constants/roles.js';

let server;
let user;
let token;
let organization;
let workspaceId;

beforeAll(async () => {
  await connectDB();
  server = app.listen(env.port + 2); // Avoid port collisions

  user = await User.create({
    fullName: 'Workspace Test',
    email: 'workspace@test.com',
    password: 'password123',
    status: 'active'
  });
  token = generateAccessToken(user);

  organization = await Organization.create({
    companyName: 'Test Org',
    slug: 'test-org-ws',
    owner: user._id
  });

  await OrganizationMember.create({
    organization: organization._id,
    user: user._id,
    role: ROLES.OWNER
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await Organization.deleteMany({});
  await OrganizationMember.deleteMany({});
  await Workspace.deleteMany({});
  await mongoose.connection.close();
  server.close();
});

describe('Workspace Management', () => {
  it('should create a new workspace', async () => {
    const res = await request(app)
      .post('/api/v1/workspaces')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'My Workspace',
        slug: 'my-workspace',
        organization: organization._id
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.name).toEqual('My Workspace');
    workspaceId = res.body.data._id;
  });

  it('should fetch workspaces by organization', async () => {
    const res = await request(app)
      .get(`/api/v1/workspaces?orgId=${organization._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should fetch workspace details', async () => {
    const res = await request(app)
      .get(`/api/v1/workspaces/${workspaceId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.name).toEqual('My Workspace');
  });
});
