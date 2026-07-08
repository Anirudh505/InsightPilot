import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { env } from '../src/config/env.config.js';
import { User } from '../src/models/user.model.js';
import { Organization } from '../src/models/organization.model.js';
import { Workspace } from '../src/models/workspace.model.js';
import { Project } from '../src/models/project.model.js';
import { ProjectMember } from '../src/models/projectMember.model.js';
import { DailyAnalytics } from '../src/models/dailyAnalytics.model.js';
import { Dashboard } from '../src/models/dashboard.model.js';
import connectDB from '../src/config/db.config.js';
import { generateAccessToken } from '../src/utils/token.util.js';
import { ROLES } from '../src/constants/roles.js';

let server;
let token;
let projectId;
let workspaceId;
let dashboardId;
let widgetId;

beforeAll(async () => {
  await connectDB();
  server = app.listen(env.port + 11);

  const user = await User.create({ fullName: 'Dash Tester', email: 'dash@test.com', password: 'password', status: 'active' });
  token = generateAccessToken(user);

  const org = await Organization.create({ companyName: 'Dash Org', slug: 'dash-org', owner: user._id });
  const ws = await Workspace.create({ name: 'Dash WS', slug: 'dash-ws', owner: user._id, organization: org._id });
  workspaceId = ws._id;
  const project = await Project.create({ name: 'Dash Project', slug: 'dash-proj', workspace: ws._id, owner: user._id });
  projectId = project._id;

  await ProjectMember.create({ project: projectId, user: user._id, role: ROLES.PROJECT_MANAGER });

  // Mock some analytics data for the widgets to fetch
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  await DailyAnalytics.create({
    project: projectId, workspace: workspaceId, day: now, dau: 550, totalEvents: 1200, totalSessions: 600, bounceRate: 20
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await Organization.deleteMany({});
  await Workspace.deleteMany({});
  await Project.deleteMany({});
  await ProjectMember.deleteMany({});
  await DailyAnalytics.deleteMany({});
  await Dashboard.deleteMany({});
  await mongoose.connection.close();
  server.close();
});

describe('Dashboard API Engine', () => {

  it('should create a dashboard', async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/dashboards`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Main Executive Dashboard',
        type: 'Executive',
        isDefault: true
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    dashboardId = res.body.data._id;
  });

  it('should add a KPI widget', async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/dashboards/${dashboardId}/widgets`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'KPICard',
        title: 'Daily Active Users',
        config: { metric: 'dau' },
        layout: { x: 0, y: 0, w: 2, h: 2 }
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.data.widgets.length).toEqual(1);
    widgetId = res.body.data.widgets[0]._id;
  });

  it('should resolve the dashboard overview with populated widget data', async () => {
    const res = await request(app)
      .get(`/api/v1/projects/${projectId}/dashboards/${dashboardId}/overview`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.widgets).toBeDefined();
    expect(res.body.data.widgets.length).toEqual(1);
    
    const widget = res.body.data.widgets[0];
    expect(widget.type).toEqual('KPICard');
    
    // The widget.service.js should have intercepted this request, queried DailyAnalytics, and injected 'data.value = 550'
    expect(widget.data).toBeDefined();
    expect(widget.data.value).toEqual(550);
  });

  it('should fetch realtime overview', async () => {
    const res = await request(app)
      .get(`/api/v1/projects/${projectId}/dashboards/realtime`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.activeUsersRightNow).toBeDefined();
    expect(res.body.data.eventsPerMinute).toBeDefined();
  });
});
