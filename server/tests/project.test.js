import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { env } from '../src/config/env.config.js';
import { User } from '../src/models/user.model.js';
import { Organization } from '../src/models/organization.model.js';
import { Workspace } from '../src/models/workspace.model.js';
import { Project } from '../src/models/project.model.js';
import { ProjectMember } from '../src/models/projectMember.model.js';
import { ApiKey } from '../src/models/apiKey.model.js';
import connectDB from '../src/config/db.config.js';
import { generateAccessToken } from '../src/utils/token.util.js';

let server;
let user;
let token;
let workspace;
let projectId;

beforeAll(async () => {
  await connectDB();
  server = app.listen(env.port + 3);

  user = await User.create({
    fullName: 'Project Test',
    email: 'project@test.com',
    password: 'password123',
    status: 'active'
  });
  token = generateAccessToken(user);

  const org = await Organization.create({
    companyName: 'Test Org for Proj',
    slug: 'test-org-proj',
    owner: user._id
  });

  workspace = await Workspace.create({
    name: 'Proj Workspace',
    slug: 'proj-ws',
    owner: user._id,
    organization: org._id
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await Organization.deleteMany({});
  await Workspace.deleteMany({});
  await Project.deleteMany({});
  await ProjectMember.deleteMany({});
  await ApiKey.deleteMany({});
  await mongoose.connection.close();
  server.close();
});

describe('Project Management', () => {
  it('should create a new project', async () => {
    const res = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Production Web App',
        slug: 'prod-web-app',
        workspace: workspace._id,
        environment: 'production',
        platform: 'web'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.name).toEqual('Production Web App');
    projectId = res.body.data._id;
  });

  it('should generate an API Key for the project', async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/api-keys`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Backend Microservice Key',
        environment: 'production'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.secretKey).toBeDefined();
    expect(res.body.data.publicKey).toBeDefined();
    expect(res.body.data.secretHash).toBeUndefined(); // Security check
  });

  it('should invite a member to the project', async () => {
    // Need a secondary user to invite
    const invitedUser = await User.create({
      fullName: 'Invited Dev',
      email: 'invited@test.com',
      password: 'password123',
      status: 'active'
    });

    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/members`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'invited@test.com',
        role: 'DEVELOPER'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
  });
});
