import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env.config.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'InsightPilot API',
      version: '1.0.0',
      description: 'API documentation for the InsightPilot Product Analytics platform.',
      contact: {
        name: 'API Support',
        email: 'support@insightpilot.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.port}/api/v1`,
        description: 'Development Server',
      },
      {
        url: 'https://api.insightpilot.com/api/v1',
        description: 'Production Server',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/models/*.js'], // Path to API annotations
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
