import mongoose from 'mongoose';
import connectDB from '../src/config/db.config.js';
import { Project } from '../src/models/project.model.js';
import { Event } from '../src/models/event.model.js';
import { RetentionSnapshot } from '../src/models/retentionSnapshot.model.js';
import retentionRepository from '../src/repositories/retention.repository.js';
import { env } from '../src/config/env.config.js';

let projectId;
let workspaceId = new mongoose.Types.ObjectId();

beforeAll(async () => {
  await connectDB();
  
  const project = await Project.create({ name: 'Retention Project', slug: 'ret-proj', workspace: workspaceId, owner: new mongoose.Types.ObjectId() });
  projectId = project._id;

  const day0 = new Date();
  day0.setUTCDate(day0.getUTCDate() - 7); // 7 days ago
  day0.setUTCHours(12, 0, 0, 0);

  const day1 = new Date(day0);
  day1.setUTCDate(day1.getUTCDate() + 1);

  const day3 = new Date(day0);
  day3.setUTCDate(day3.getUTCDate() + 3);

  // User 1 starts on Day 0, returns Day 1 and Day 3
  await Event.insertMany([
    { project: projectId, workspace: workspaceId, anonymousId: 'u1', event: 'Signup', type: 'track', timestamp: day0 },
    { project: projectId, workspace: workspaceId, anonymousId: 'u1', event: 'Login', type: 'track', timestamp: day1 },
    { project: projectId, workspace: workspaceId, anonymousId: 'u1', event: 'Purchase', type: 'track', timestamp: day3 }
  ]);

  // User 2 starts on Day 0, returns Day 1 only
  await Event.insertMany([
    { project: projectId, workspace: workspaceId, anonymousId: 'u2', event: 'Signup', type: 'track', timestamp: day0 },
    { project: projectId, workspace: workspaceId, anonymousId: 'u2', event: 'Login', type: 'track', timestamp: day1 }
  ]);

  // User 3 starts on Day 0, never returns
  await Event.insertMany([
    { project: projectId, workspace: workspaceId, anonymousId: 'u3', event: 'Signup', type: 'track', timestamp: day0 }
  ]);
});

afterAll(async () => {
  await Project.deleteMany({});
  await Event.deleteMany({});
  await RetentionSnapshot.deleteMany({});
  await mongoose.connection.close();
});

describe('Retention Engine', () => {

  it('should calculate accurate day-N retention', async () => {
    const targetDate = new Date();
    targetDate.setUTCDate(targetDate.getUTCDate() - 7);
    targetDate.setUTCHours(0, 0, 0, 0); // Day 0 boundary

    const snapshot = await retentionRepository.calculateDailyRetention(
      projectId, 
      workspaceId, 
      targetDate, 
      'Signup', 
      'Any Event'
    );

    expect(snapshot).toBeDefined();
    expect(snapshot.cohortSize).toEqual(3); // 3 users signed up on Day 0

    const matrix = snapshot.retentionMatrix;
    
    // Day 1 Retention (u1 and u2)
    expect(matrix.get('1')).toEqual(2);
    
    // Day 3 Retention (u1 only)
    expect(matrix.get('3')).toEqual(1);
    
    // Day 7 hasn't fully passed or no events exist
    expect(matrix.get('7')).toBeDefined();
  });

});
