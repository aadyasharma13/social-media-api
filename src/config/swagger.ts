import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Social Media API',
      version: '1.0.0',
      description: 'A comprehensive RESTful API for social networking with posts, comments, likes, follows, and real-time notifications.',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      },
      {
        url: 'https://api.example.com/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token. Format: Token <your-token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID'
            },
            username: {
              type: 'string',
              description: 'Unique username'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            bio: {
              type: 'string',
              description: 'User biography'
            },
            image: {
              type: 'string',
              format: 'uri',
              description: 'Profile image URL'
            },
            avatarUrl: {
              type: 'string',
              format: 'uri',
              description: 'Avatar image URL'
            },
            location: {
              type: 'string',
              description: 'User location'
            },
            website: {
              type: 'string',
              format: 'uri',
              description: 'User website URL'
            },
            dob: {
              type: 'string',
              format: 'date',
              description: 'Date of birth'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user',
              description: 'User role'
            },
            token: {
              type: 'string',
              description: 'JWT authentication token'
            }
          }
        },
        Post: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Post ID'
            },
            content: {
              type: 'string',
              description: 'Post content'
            },
            imageUrl: {
              type: 'string',
              format: 'uri',
              nullable: true,
              description: 'Post image URL'
            },
            author: {
              $ref: '#/components/schemas/User'
            },
            likesCount: {
              type: 'number',
              default: 0,
              description: 'Number of likes'
            },
            commentsCount: {
              type: 'number',
              default: 0,
              description: 'Number of comments'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Comment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Comment ID'
            },
            content: {
              type: 'string',
              description: 'Comment content'
            },
            user: {
              $ref: '#/components/schemas/User'
            },
            post: {
              type: 'string',
              description: 'Post ID'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            }
          }
        },
        Notification: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Notification ID'
            },
            type: {
              type: 'string',
              enum: ['follow', 'like', 'comment'],
              description: 'Notification type'
            },
            sender: {
              $ref: '#/components/schemas/User'
            },
            post: {
              type: 'object',
              nullable: true,
              description: 'Related post (if applicable)'
            },
            isRead: {
              type: 'boolean',
              default: false,
              description: 'Read status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
              description: 'Total number of items'
            },
            limit: {
              type: 'number',
              description: 'Items per page'
            },
            offset: {
              type: 'number',
              description: 'Number of items skipped'
            },
            hasMore: {
              type: 'boolean',
              description: 'Whether there are more items'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            message: {
              type: 'string',
              description: 'Success message'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            errors: {
              type: 'object',
              description: 'Validation errors'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User registration and authentication'
      },
      {
        name: 'Users',
        description: 'User management and profile operations'
      },
      {
        name: 'Posts',
        description: 'Post CRUD operations, likes, and comments'
      },
      {
        name: 'Comments',
        description: 'Comment management'
      },
      {
        name: 'Feed',
        description: 'Personalized news feed'
      },
      {
        name: 'Profiles',
        description: 'Public user profiles'
      },
      {
        name: 'Notifications',
        description: 'User notifications'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/routes/swagger-docs.ts']
};

export const swaggerSpec = swaggerJsdoc(options);

