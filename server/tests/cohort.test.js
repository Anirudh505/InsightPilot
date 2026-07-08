import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { env } from '../src/config/env.config.js';
import { User } from '../src/models/user.model.js';
import { Organization } from '../src/models/organization.model.js';
import { Workspace } from '../src/models/workspace.model.js';
import { Project } from '../src/models/project.model.js';
import { ProjectMember } from '../src/models/projectMember.model.js';
import { Event } from '../src/models/event.model.js';
import { Cohort } from '../src/models/cohort.model.js';
import connectDB from '../src/config/db.config.js';
import { generateAccessToken } from '../src/utils/token.util.js';
import { ROLES } from '../src/constants/roles.js';

let server;
let token;
let projectId;
let workspaceId;
let cohortId;

beforeAll(async () => {
  await connectDB();
  server = app.listen(env.port + 7);

  const user = await User.create({ fullName: 'Cohort Tester', email: 'cohort@test.com', password: 'password', status: 'active' });
  token = generateAccessToken(user);

  const org = await Organization.create({ companyName: 'Cohort Org', slug: 'cohort-org', owner: user._id });
  const ws = await Workspace.create({ name: 'Cohort WS', slug: 'cohort-ws', owner: user._id, organization: org._id });
  workspaceId = ws._id;
  const project = await Project.create({ name: 'Cohort Project', slug: 'cohort-proj', workspace: ws._id, owner: user._id });
  projectId = project._id;

  await ProjectMember.create({ project: projectId, user: user._id, role: ROLES.PROJECT_MANAGER });

  // Mock Events
  // User 1 is from US and did a Purchase
  await Event.create({
    project: projectId, workspace: workspaceId, anonymousId: 'u1', event: 'Purchase', type: 'track', 
    context: { location: { country: 'US' } }, timestamp: new Date()
  });

  // User 2 is from US but did NOT purchase
  await Event.create({
    project: projectId, workspace: workspaceId, anonymousId: 'u2', event: 'Page View', type: 'page', 
    context: { location: { country: 'US' } }, timestamp: new Date()
  });

  // User 3 did a Purchase but is from UK
  await Event.create({
    project: projectId, workspace: workspaceId, anonymousId: 'u3', event: 'Purchase', type: 'track', 
    context: { location: { country: 'UK' } }, timestamp: new Date()
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await Organization.deleteMany({});
  await Workspace.deleteMany({});
  await Project.deleteMany({});
  await ProjectMember.deleteMany({});
  await Event.deleteMany({});
  await Cohort.deleteMany({});
  await mongoose.connection.close();
  server.close();
});

describe('Cohort Engine', () => {

  it('should create a cohort for US Purchasers', async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/cohorts`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'US Purchasers',
        rules: [
          { type: 'property', property: 'country', operator: 'eq', value: 'US' },
          { type: 'event', event: 'Purchase', operator: 'exists' }
        ]
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    cohortId = res.body.data._id;
  });

  it('should trigger cohort calculation', async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/cohorts/${cohortId}/calculate`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(202);
  });

  it('should evaluate the cohort correctly', async () => {
    // Wait for async job
    await new Promise(r => setTimeout(r, 500));

    const res = await request(app)
      .get(`/api/v1/projects/${projectId}/cohorts/${cohortId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    const cohort = res.body.data;
    
    expect(cohort.calculationStatus).toEqual('idle');
    expect(cohort.lastResult).toBeDefined();
    
    // Only 'u1' meets both criteria
    expect(cohort.lastResult.userCount).toEqual(1);
    expect(cohort.lastResult.users).toContain('u1');
  });
});
