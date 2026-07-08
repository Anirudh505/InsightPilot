import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { env } from '../src/config/env.config.js';
import { User } from '../src/models/user.model.js';
import { Organization } from '../src/models/organization.model.js';
import { Workspace } from '../src/models/workspace.model.js';
import { Project } from '../src/models/project.model.js';
import { ApiKey } from '../src/models/apiKey.model.js';
import { Event } from '../src/models/event.model.js';
import { Session } from '../src/models/session.model.js';
import connectDB from '../src/config/db.config.js';

let server;
let publicKey;
let projectId;

beforeAll(async () => {
  await connectDB();
  server = app.listen(env.port + 4);

  const user = await User.create({ fullName: 'SDK Tester', email: 'sdk@test.com', password: 'password', status: 'active' });
  const org = await Organization.create({ companyName: 'SDK Org', slug: 'sdk-org', owner: user._id });
  const ws = await Workspace.create({ name: 'SDK WS', slug: 'sdk-ws', owner: user._id, organization: org._id });
  const project = await Project.create({ name: 'SDK Project', slug: 'sdk-proj', workspace: ws._id, owner: user._id });
  projectId = project._id;

  const apiKey = await ApiKey.create({
    name: 'Frontend Key',
    project: project._id,
    publicKey: 'pk_test_12345',
    secretHash: 'hashedsecret',
    environment: 'development',
    createdBy: user._id
  });

  publicKey = apiKey.publicKey;
});

afterAll(async () => {
  await User.deleteMany({});
  await Organization.deleteMany({});
  await Workspace.deleteMany({});
  await Project.deleteMany({});
  await ApiKey.deleteMany({});
  await Event.deleteMany({});
  await Session.deleteMany({});
  await mongoose.connection.close();
  server.close();
});

describe('SDK Event Ingestion', () => {
  const payload = {
    anonymousId: 'anon-1234',
    event: 'Button Clicked',
    type: 'track',
    properties: { button_color: 'blue' },
    context: {
      sessionId: 'session-1234',
      page: { url: 'http://localhost:3000/home' },
      browser: { name: 'Chrome', version: '100' }
    }
  };

  it('should reject requests without a public key', async () => {
    const res = await request(app).post('/api/v1/events/collect').send(payload);
    expect(res.statusCode).toEqual(401);
  });

  it('should reject requests with an invalid public key', async () => {
    const res = await request(app)
      .post('/api/v1/events/collect')
      .set('x-api-key', 'pk_invalid_key')
      .send(payload);
    expect(res.statusCode).toEqual(401);
  });

  it('should successfully ingest a single event', async () => {
    const res = await request(app)
      .post('/api/v1/events/collect')
      .set('x-api-key', publicKey)
      .send(payload);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();

    // Verify DB
    const event = await Event.findOne({ 'properties.button_color': 'blue' });
    expect(event).toBeDefined();
    expect(event.project.toString()).toEqual(projectId.toString());
  });

  it('should successfully ingest a batch of events', async () => {
    const batchPayload = {
      events: [
        { ...payload, event: 'First Event' },
        { ...payload, event: 'Second Event' }
      ]
    };

    const res = await request(app)
      .post('/api/v1/events/batch')
      .set('x-api-key', publicKey)
      .send(batchPayload);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.processed).toEqual(2);
  });
});
