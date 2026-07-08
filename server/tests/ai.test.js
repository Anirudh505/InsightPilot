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
import { Insight } from '../src/models/insight.model.js';
import { CopilotConversation } from '../src/models/copilot.model.js';
import connectDB from '../src/config/db.config.js';
import { generateAccessToken } from '../src/utils/token.util.js';
import { ROLES } from '../src/constants/roles.js';
import aiJob from '../src/jobs/ai.job.js';

let server;
let token;
let projectId;
let workspaceId;
let conversationId;

beforeAll(async () => {
  await connectDB();
  server = app.listen(env.port + 10);

  const user = await User.create({ fullName: 'AI Tester', email: 'ai@test.com', password: 'password', status: 'active' });
  token = generateAccessToken(user);

  const org = await Organization.create({ companyName: 'AI Org', slug: 'ai-org', owner: user._id });
  const ws = await Workspace.create({ name: 'AI WS', slug: 'ai-ws', owner: user._id, organization: org._id });
  workspaceId = ws._id;
  const project = await Project.create({ name: 'AI Project', slug: 'ai-proj', workspace: ws._id, owner: user._id });
  projectId = project._id;

  await ProjectMember.create({ project: projectId, user: user._id, role: ROLES.PROJECT_MANAGER });

  // Mock 14 days of DailyAnalytics to simulate a DAU Drop
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);

  const dailyData = [];
  for (let i = 1; i <= 14; i++) {
    const day = new Date(now);
    day.setUTCDate(day.getUTCDate() - i);
    
    // Week 1 (Previous): DAU is around 1000
    // Week 2 (Recent): DAU is around 500 (A massive 50% drop)
    const dau = i > 7 ? 1000 : 500;
    
    dailyData.push({
      project: projectId,
      workspace: workspaceId,
      day: day,
      dau: dau,
      totalEvents: dau * 10,
      totalSessions: dau,
      bounceRate: 40
    });
  }
  await DailyAnalytics.insertMany(dailyData);
});

afterAll(async () => {
  await User.deleteMany({});
  await Organization.deleteMany({});
  await Workspace.deleteMany({});
  await Project.deleteMany({});
  await ProjectMember.deleteMany({});
  await DailyAnalytics.deleteMany({});
  await Insight.deleteMany({});
  await CopilotConversation.deleteMany({});
  await mongoose.connection.close();
  server.close();
});

describe('AI Insights & Copilot Engine', () => {

  it('should deterministically detect a DAU Drop and generate an Insight', async () => {
    // Run the AI Background Job
    await aiJob.generateDailyInsights();

    // Verify it detected the drop
    const insights = await Insight.find({ project: projectId });
    expect(insights.length).toBeGreaterThan(0);
    
    const riskInsight = insights.find(i => i.type === 'Retention Risk');
    expect(riskInsight).toBeDefined();
    
    // It should have identified a 50% drop (1000 -> 500)
    expect(riskInsight.sourceMetadata.percentageChange).toEqual(-50);
    
    // It should have hit the Mock AI Provider and generated a recommendation
    expect(riskInsight.recommendations.length).toBeGreaterThan(0);
    expect(riskInsight.recommendations[0].priority).toEqual('medium');
  });

  it('should interact with the AI Copilot API', async () => {
    const res = await request(app)
      .post(`/api/v1/projects/${projectId}/ai/copilot/chat`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: "Why is my retention dropping?"
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.reply).toBeDefined();
    expect(res.body.data.conversationId).toBeDefined();
    
    conversationId = res.body.data.conversationId;
  });

  it('should fetch Copilot chat history', async () => {
    const res = await request(app)
      .get(`/api/v1/projects/${projectId}/ai/copilot/history`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]._id.toString()).toEqual(conversationId.toString());
  });

});
