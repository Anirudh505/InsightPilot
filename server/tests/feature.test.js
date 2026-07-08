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
import { DailyAnalytics } from '../src/models/dailyAnalytics.model.js';
import { Feature } from '../src/models/feature.model.js';
import { FeatureAdoptionSnapshot } from '../src/models/featureAdoptionSnapshot.model.js';
import connectDB from '../src/config/db.config.js';
import { generateAccessToken } from '../src/utils/token.util.js';
import { ROLES } from '../src/constants/roles.js';
import featureRepository from '../src/repositories/feature.repository.js';

let server;
let token;
let projectId;
let workspaceId;
let featureId;

beforeAll(async () => {
  await connectDB();
  server = app.listen(env.port + 8);

  const user = await User.create({ fullName: 'Feature Tester', email: 'feature@test.com', password: 'password', status: 'active' });
  token = generateAccessToken(user);

  const org = await Organization.create({ companyName: 'Feature Org', slug: 'feature-org', owner: user._id });
  const ws = await Workspace.create({ name: 'Feature WS', slug: 'feature-ws', owner: user._id, organization: org._id });
  workspaceId = ws._id;
  const project = await Project.create({ name: 'Feature Project', slug: 'feature-proj', workspace: ws._id, owner: user._id });
  projectId = project._id;

  await ProjectMember.create({ project: projectId, user: user._id, role: ROLES.PROJECT_MANAGER });

  // Setup Mock Data
  const targetDate = new Date();
  targetDate.setUTCHours(0, 0, 0, 0); // Today

  // Mock Project DAU (from Sprint 6)
  await DailyAnalytics.create({
    project: projectId,
    workspace: workspaceId,
    day: targetDate,
    dau: 10 // Total of 10 active users today
  });

  // Mock Feature Usage Events
  // User 1 used it twice, User 2 used it once
  await Event.insertMany([
    { project: projectId, workspace: workspaceId, anonymousId: 'u1', event: 'Video Played', type: 'track', timestamp: new Date() },
    { project: projectId, workspace: workspaceId, anonymousId: 'u1', event: 'Video Played', type: 'track', timestamp: new Date() },
    { project: projectId, workspace: workspaceId, anonymousId: 'u2', event: 'Video Played', type: 'track', timestamp: new Date() }
  ]);
});

afterAll(async () => {
  await User.deleteMany({});
  await Organization.deleteMany({});
  await Workspace.deleteMany({});
  await Project.deleteMany({});
  await ProjectMember.deleteMany({});
  await Event.deleteMany({});
  await DailyAnalytics.deleteMany({});
  await Feature.deleteMany({});
  await FeatureAdoptionSnapshot.deleteMany({});
  await mongoose.connection.close();
  server.close();
});

describe('Feature Adoption Engine', () => {
  it('should define a new feature', async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/features`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Video Player',
        triggerEvent: 'Video Played'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    featureId = res.body.data._id;
  });

  it('should calculate feature adoption correctly via Repository', async () => {
    const targetDate = new Date();
    targetDate.setUTCHours(0, 0, 0, 0);
    
    // Simulate the cron job
    const snapshot = await featureRepository.calculateDailyFeatureAdoption(featureId, targetDate);

    expect(snapshot).toBeDefined();
    expect(snapshot.projectActiveUsers).toEqual(10); // From DailyAnalytics
    expect(snapshot.activeUsers).toEqual(2); // u1, u2
    expect(snapshot.totalInvocations).toEqual(3); // 2 + 1
    
    // Adoption Rate = (2 / 10) * 100 = 20%
    expect(snapshot.adoptionRate).toEqual(20);
    expect(snapshot.averageInvocationsPerUser).toEqual(1.5);
  });

  it('should fetch adoption metrics via API', async () => {
    const start = new Date();
    start.setDate(start.getDate() - 1);
    const end = new Date();
    end.setDate(end.getDate() + 1);

    const res = await request(app)
      .get(`/api/v1/projects/${projectId}/features/${featureId}/adoption?start_date=${start.toISOString()}&end_date=${end.toISOString()}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.summary.totalInvocations).toEqual(3);
    expect(res.body.data.summary.peakAdoptionRate).toEqual(20);
    expect(res.body.data.trend.length).toEqual(1);
  });
});
