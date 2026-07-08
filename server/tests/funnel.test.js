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
import { Funnel } from '../src/models/funnel.model.js';
import { UserJourney } from '../src/models/journey.model.js';
import connectDB from '../src/config/db.config.js';
import { generateAccessToken } from '../src/utils/token.util.js';
import { ROLES } from '../src/constants/roles.js';

let server;
let token;
let projectId;
let workspaceId;
let funnelId;

beforeAll(async () => {
  await connectDB();
  server = app.listen(env.port + 6);

  const user = await User.create({ fullName: 'Behavior Tester', email: 'behavior@test.com', password: 'password', status: 'active' });
  token = generateAccessToken(user);

  const org = await Organization.create({ companyName: 'Behavior Org', slug: 'behavior-org', owner: user._id });
  const ws = await Workspace.create({ name: 'Behavior WS', slug: 'behavior-ws', owner: user._id, organization: org._id });
  workspaceId = ws._id;
  const project = await Project.create({ name: 'Behavior Project', slug: 'behavior-proj', workspace: ws._id, owner: user._id });
  projectId = project._id;

  await ProjectMember.create({ project: projectId, user: user._id, role: ROLES.PROJECT_MANAGER });

  // Create mock events simulating a funnel
  const now = new Date();
  const time1 = new Date(now.getTime() - 10000);
  const time2 = new Date(now.getTime() - 5000);
  const time3 = new Date(now.getTime());

  // User 1 completes all 3 steps
  await Event.insertMany([
    { project: projectId, workspace: workspaceId, anonymousId: 'u1', event: 'Step 1', type: 'track', timestamp: time1 },
    { project: projectId, workspace: workspaceId, anonymousId: 'u1', event: 'Step 2', type: 'track', timestamp: time2 },
    { project: projectId, workspace: workspaceId, anonymousId: 'u1', event: 'Step 3', type: 'track', timestamp: time3 },
  ]);

  // User 2 completes 2 steps
  await Event.insertMany([
    { project: projectId, workspace: workspaceId, anonymousId: 'u2', event: 'Step 1', type: 'track', timestamp: time1 },
    { project: projectId, workspace: workspaceId, anonymousId: 'u2', event: 'Step 2', type: 'track', timestamp: time2 }
  ]);

  // User 3 completes 1 step
  await Event.insertMany([
    { project: projectId, workspace: workspaceId, anonymousId: 'u3', event: 'Step 1', type: 'track', timestamp: time1 }
  ]);
});

afterAll(async () => {
  await User.deleteMany({});
  await Organization.deleteMany({});
  await Workspace.deleteMany({});
  await Project.deleteMany({});
  await ProjectMember.deleteMany({});
  await Event.deleteMany({});
  await Funnel.deleteMany({});
  await UserJourney.deleteMany({});
  await mongoose.connection.close();
  server.close();
});

describe('Funnel Engine', () => {

  it('should create a new funnel', async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/funnels`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Funnel',
        steps: [
          { order: 1, eventName: 'Step 1' },
          { order: 2, eventName: 'Step 2' },
          { order: 3, eventName: 'Step 3' }
        ]
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.name).toEqual('Test Funnel');
    funnelId = res.body.data._id;
  });

  it('should trigger funnel calculation', async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);

    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/funnels/${funnelId}/calculate`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

    expect(res.statusCode).toEqual(202); // Async accepted
    expect(res.body.success).toBeTruthy();
  });

  it('should eventually have calculated results', async () => {
    // Wait for the async job to finish (we used a 100ms timeout in funnel.job.js)
    await new Promise(r => setTimeout(r, 500));

    const res = await request(app)
      .get(`/api/v1/projects/${projectId}/funnels/${funnelId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    const funnel = res.body.data;
    expect(funnel.calculationStatus).toEqual('idle');
    expect(funnel.lastResult).toBeDefined();

    // Verify Math
    const result = funnel.lastResult;
    expect(result.totalUsersStarted).toEqual(3); // 3 users did Step 1
    expect(result.steps[1].usersCompleted).toEqual(2); // 2 users did Step 2
    expect(result.steps[2].usersCompleted).toEqual(1); // 1 user did Step 3
    expect(result.overallConversionRate).toEqual(33.33); // 1/3 completed
  });
});
