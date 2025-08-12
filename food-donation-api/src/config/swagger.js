const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Food Donation API',
      version: '1.0.0',
      description: 'A comprehensive REST API for managing food donations in a community platform',
      contact: {
        name: 'Food Donation Team',
        email: 'support@fooddonation.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.fooddonation.com',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        Donation: {
          type: 'object',
          required: ['donorName', 'contact', 'foodType', 'quantity', 'unit', 'expiryDate', 'location'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the donation',
              example: 'b9190f43-b928-49b1-bae4-c7f7f01cf259'
            },
            donorName: {
              type: 'string',
              description: 'Name of the person making the donation',
              example: 'John Smith'
            },
            contact: {
              type: 'string',
              description: 'Contact information (email or phone)',
              example: 'john.smith@email.com'
            },
            foodType: {
              type: 'string',
              description: 'Type of food being donated',
              example: 'Fresh vegetables'
            },
            quantity: {
              type: 'integer',
              minimum: 1,
              description: 'Quantity of food',
              example: 5
            },
            unit: {
              type: 'string',
              enum: ['meals', 'kg', 'boxes', 'pieces', 'liters', 'portions'],
              description: 'Unit of measurement',
              example: 'kg'
            },
            notes: {
              type: 'string',
              description: 'Additional notes about the donation',
              example: 'Please collect before evening'
            },
            expiryDate: {
              type: 'string',
              format: 'date',
              description: 'Expiry date of the food',
              example: '2024-12-31'
            },
            location: {
              type: 'string',
              description: 'Pickup location',
              example: '123 Main Street, Downtown'
            },
            status: {
              type: 'string',
              enum: ['available', 'reserved', 'collected'],
              description: 'Current status of the donation',
              example: 'available'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time when donation was created',
              example: '2024-08-11T10:58:39.880Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time when donation was last updated',
              example: '2024-08-11T11:42:53.473Z'
            }
          }
        },
        DonationInput: {
          type: 'object',
          required: ['donorName', 'contact', 'foodType', 'quantity', 'unit', 'expiryDate', 'location'],
          properties: {
            donorName: {
              type: 'string',
              description: 'Name of the person making the donation',
              example: 'John Smith'
            },
            contact: {
              type: 'string',
              description: 'Contact information (email or phone)',
              example: 'john.smith@email.com'
            },
            foodType: {
              type: 'string',
              description: 'Type of food being donated',
              example: 'Fresh vegetables'
            },
            quantity: {
              type: 'integer',
              minimum: 1,
              description: 'Quantity of food',
              example: 5
            },
            unit: {
              type: 'string',
              enum: ['meals', 'kg', 'boxes', 'pieces', 'liters', 'portions'],
              description: 'Unit of measurement',
              example: 'kg'
            },
            notes: {
              type: 'string',
              description: 'Additional notes about the donation',
              example: 'Please collect before evening'
            },
            expiryDate: {
              type: 'string',
              format: 'date',
              description: 'Expiry date of the food',
              example: '2024-12-31'
            },
            location: {
              type: 'string',
              description: 'Pickup location',
              example: '123 Main Street, Downtown'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the request was successful'
            },
            message: {
              type: 'string',
              description: 'Response message'
            },
            data: {
              description: 'Response data'
            },
            count: {
              type: 'integer',
              description: 'Number of items returned (for list endpoints)'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Error message'
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when error occurred'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
}; 