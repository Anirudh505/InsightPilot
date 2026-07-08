import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { env } from '../src/config/env.config.js';
import { User } from '../src/models/user.model.js';
import { RefreshToken } from '../src/models/refreshToken.model.js';
import connectDB from '../src/config/db.config.js';

let server;

beforeAll(async () => {
  // Override DB for tests if necessary, here we just use the default test DB or env
  await connectDB();
  server = app.listen(env.port + 1); // run on different port
});

afterAll(async () => {
  await User.deleteMany({});
  await RefreshToken.deleteMany({});
  await mongoose.connection.close();
  server.close();
});

describe('Authentication Flow', () => {
  const testUser = {
    fullName: 'Test User',
    email: 'test@insightpilot.com',
    password: 'Password123',
  };

  let accessToken = '';
  let cookie = '';

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.user.email).toEqual(testUser.email);
    expect(res.body.data.user.password).toBeUndefined();
    expect(res.body.data.accessToken).toBeDefined();
    
    // Check if refresh token cookie is set
    expect(res.headers['set-cookie']).toBeDefined();
    cookie = res.headers['set-cookie'][0];
  });

  it('should not register a user with duplicate email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.statusCode).toEqual(409); // Conflict
    expect(res.body.success).toBeFalsy();
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.accessToken).toBeDefined();
    
    accessToken = res.body.data.accessToken;
    cookie = res.headers['set-cookie'][0]; // Capture new cookie
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword123',
      });

    expect(res.statusCode).toEqual(401); // Unauthorized
    expect(res.body.success).toBeFalsy();
  });

  it('should access protected route with valid token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.user.email).toEqual(testUser.email);
  });

  it('should fail to access protected route without token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me');

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBeFalsy();
  });

  it('should refresh the access token using cookie', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh-token')
      .set('Cookie', cookie);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.accessToken).not.toEqual(accessToken); // Should be a new token
    
    // Capture the newly rotated cookie
    cookie = res.headers['set-cookie'][0];
  });

  it('should fail to refresh token without cookie', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh-token');

    expect(res.statusCode).toEqual(401);
  });

  it('should logout the user and clear cookie', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set('Cookie', cookie);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
    
    // Cookie should be cleared (maxAge=0 or empty)
    const setCookieHeader = res.headers['set-cookie'][0];
    expect(setCookieHeader).toMatch(/refreshToken=;/);
  });
});
