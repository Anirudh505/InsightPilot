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
import { Segment } from '../src/models/segment.model.js';
import connectDB from '../src/config/db.config.js';
import { generateAccessToken } from '../src/utils/token.util.js';
import { ROLES } from '../src/constants/roles.js';

let server;
let token;
let projectId;
let workspaceId;
let segmentId;

beforeAll(async () => {
  await connectDB();
  server = app.listen(env.port + 9);

  const user = await User.create({ fullName: 'Segment Tester', email: 'segment@test.com', password: 'password', status: 'active' });
  token = generateAccessToken(user);

  const org = await Organization.create({ companyName: 'Segment Org', slug: 'segment-org', owner: user._id });
  const ws = await Workspace.create({ name: 'Segment WS', slug: 'segment-ws', owner: user._id, organization: org._id });
  workspaceId = ws._id;
  const project = await Project.create({ name: 'Segment Project', slug: 'segment-proj', workspace: ws._id, owner: user._id });
  projectId = project._id;

  await ProjectMember.create({ project: projectId, user: user._id, role: ROLES.PROJECT_MANAGER });

  // Mock Events
  // User 1 is from Canada and did a Purchase
  await Event.create({
    project: projectId, workspace: workspaceId, anonymousId: 'u1', event: 'Purchase', type: 'track', 
    context: { location: { country: 'CA' } }, timestamp: new Date()
  });

  // User 2 is from Canada but did NOT purchase
  await Event.create({
    project: projectId, workspace: workspaceId, anonymousId: 'u2', event: 'Page View', type: 'page', 
    context: { location: { country: 'CA' } }, timestamp: new Date()
  });

  // User 3 did a Purchase but is from US
  await Event.create({
    project: projectId, workspace: workspaceId, anonymousId: 'u3', event: 'Purchase', type: 'track', 
    context: { location: { country: 'US' } }, timestamp: new Date()
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await Organization.deleteMany({});
  await Workspace.deleteMany({});
  await Project.deleteMany({});
  await ProjectMember.deleteMany({});
  await Event.deleteMany({});
  await Segment.deleteMany({});
  await mongoose.connection.close();
  server.close();
});

describe('Segmentation Engine', () => {

  it('should create a segment with OR logic (CA users OR Purchasers)', async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/segments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Broad Audience',
        logicOperator: 'OR',
        rules: [
          { type: 'property', key: 'context.location.country', operator: 'eq', value: 'CA' },
          { type: 'event', key: 'Purchase', operator: 'exists' }
        ]
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    segmentId = res.body.data._id;
  });

  it('should trigger segment calculation', async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/segments/${segmentId}/calculate`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(202);
  });

  it('should evaluate the OR logic segment correctly', async () => {
    // Wait for async job
    await new Promise(r => setTimeout(r, 500));

    const res = await request(app)
      .get(`/api/v1/projects/${projectId}/segments/${segmentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    const segment = res.body.data;
    
    expect(segment.calculationStatus).toEqual('idle');
    
    // User 1 meets both (CA + Purchase) -> Included
    // User 2 meets CA -> Included
    // User 3 meets Purchase -> Included
    // Expected: All 3 users.
    expect(segment.lastResult.userCount).toEqual(3);
  });
});
