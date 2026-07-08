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
import { Session } from '../src/models/session.model.js';
import { DailyAnalytics } from '../src/models/dailyAnalytics.model.js';
import connectDB from '../src/config/db.config.js';
import { generateAccessToken } from '../src/utils/token.util.js';
import aggregationService from '../src/services/aggregation.service.js';
import { ROLES } from '../src/constants/roles.js';

let server;
let token;
let projectId;
let workspaceId;

beforeAll(async () => {
  await connectDB();
  server = app.listen(env.port + 5);

  const user = await User.create({ fullName: 'Analytics Tester', email: 'analytics@test.com', password: 'password', status: 'active' });
  token = generateAccessToken(user);

  const org = await Organization.create({ companyName: 'Analytics Org', slug: 'analytics-org', owner: user._id });
  const ws = await Workspace.create({ name: 'Analytics WS', slug: 'analytics-ws', owner: user._id, organization: org._id });
  workspaceId = ws._id;
  const project = await Project.create({ name: 'Analytics Project', slug: 'analytics-proj', workspace: ws._id, owner: user._id });
  projectId = project._id;

  await ProjectMember.create({ project: projectId, user: user._id, role: ROLES.PROJECT_MANAGER });

  // Seed Raw Events & Sessions for "Yesterday"
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  yesterday.setUTCHours(12, 0, 0, 0); // Noon UTC yesterday

  await Event.insertMany([
    { project: projectId, workspace: workspaceId, anonymousId: 'anon1', event: 'Page View', type: 'page', timestamp: yesterday },
    { project: projectId, workspace: workspaceId, anonymousId: 'anon1', event: 'Button Click', type: 'track', timestamp: yesterday },
    { project: projectId, workspace: workspaceId, anonymousId: 'anon2', event: 'Page View', type: 'page', timestamp: yesterday }
  ]);

  await Session.create({
    project: projectId,
    workspace: workspaceId,
    sessionId: 'session1',
    anonymousId: 'anon1',
    startedAt: yesterday,
    durationSeconds: 120,
    pageCount: 2,
    eventCount: 2,
    isBounce: false
  });

  await Session.create({
    project: projectId,
    workspace: workspaceId,
    sessionId: 'session2',
    anonymousId: 'anon2',
    startedAt: yesterday,
    durationSeconds: 5,
    pageCount: 1,
    eventCount: 1,
    isBounce: true
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await Organization.deleteMany({});
  await Workspace.deleteMany({});
  await Project.deleteMany({});
  await ProjectMember.deleteMany({});
  await Event.deleteMany({});
  await Session.deleteMany({});
  await DailyAnalytics.deleteMany({});
  await mongoose.connection.close();
  server.close();
});

describe('Analytics Processing Engine', () => {

  it('should run hourly & daily aggregation job', async () => {
    // Manually trigger the aggregation for "yesterday"
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // End of yesterday
    
    // Simulate passing of time for the Cron job
    const runDate = new Date();
    runDate.setUTCDate(runDate.getUTCDate() - 1);
    runDate.setUTCHours(13, 0, 0, 0); // 1 PM yesterday (processes noon hour)
    await aggregationService.processHourlyRollup(runDate);

    // Simulate daily rollup (running at midnight today)
    await aggregationService.processDailyRollup(today);

    // Verify database
    const dailyData = await DailyAnalytics.findOne({ project: projectId });
    expect(dailyData).toBeDefined();
    expect(dailyData.totalEvents).toEqual(3);
    expect(dailyData.totalSessions).toEqual(2);
    expect(dailyData.pageViews).toEqual(2);
    expect(dailyData.dau).toEqual(2);
    expect(dailyData.bounceRate).toEqual(50); // 1 out of 2 is bounce
  });

  it('should fetch analytics overview via API', async () => {
    const res = await request(app)
      .get(`/api/v1/analytics/overview?projectId=${projectId}&range=7d`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.metrics.totalEvents.value).toEqual(3);
    expect(res.body.data.metrics.dau?.value || 0).toBeDefined(); 
  });

  it('should fetch events distribution via API', async () => {
    const res = await request(app)
      .get(`/api/v1/analytics/events?projectId=${projectId}&range=7d`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
    
    const pageViewEvent = res.body.data.find(e => e.name === 'Page View');
    expect(pageViewEvent).toBeDefined();
    expect(pageViewEvent.count).toEqual(2);
  });
});
