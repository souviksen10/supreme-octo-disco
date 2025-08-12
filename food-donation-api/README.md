# Food Donation API

A RESTful API built with Node.js and Express for managing food donations, connecting donors with organizations to reduce food waste.

## Features

- 🍕 **CRUD Operations** for food donations
- 🔍 **Advanced Filtering** by status, food type, and location
- 📊 **Statistics** and analytics endpoints
- 🛡️ **Security** with Helmet.js
- 🌐 **CORS** support for cross-origin requests
- 📝 **Request Logging** with Morgan
- ⚡ **Compression** for optimized responses
- 🚨 **Error Handling** with custom middleware

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **UUID** - Unique identifier generation
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **Compression** - Response compression
- **dotenv** - Environment variable management

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd food-donation-api
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Donations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/donations` | Get all donations with optional filtering |
| GET | `/donations/:id` | Get single donation by ID |
| POST | `/donations` | Create new donation |
| PUT | `/donations/:id` | Update donation |
| PATCH | `/donations/:id/status` | Update donation status only |
| DELETE | `/donations/:id` | Delete donation |
| GET | `/donations/stats/summary` | Get donation statistics |

### Query Parameters

#### GET `/donations`
- `status` - Filter by status (`available`, `reserved`, `collected`)
- `foodType` - Filter by food type (case insensitive search)
- `location` - Filter by location (case insensitive search)

Example:
```
GET /api/v1/donations?status=available&foodType=bread&location=downtown
```

### Request/Response Examples

#### Create Donation
```http
POST /api/v1/donations
Content-Type: application/json

{
  "donorName": "John Doe",
  "contact": "john@example.com",
  "foodType": "Fresh Vegetables",
  "quantity": 10,
  "unit": "kg",
  "expiryDate": "2024-01-15",
  "location": "123 Main St, Downtown",
  "notes": "Organic vegetables from local farm"
}
```

#### Response
```json
{
  "success": true,
  "message": "Donation created successfully",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "donorName": "John Doe",
    "contact": "john@example.com",
    "foodType": "Fresh Vegetables",
    "quantity": 10,
    "unit": "kg",
    "expiryDate": "2024-01-15",
    "location": "123 Main St, Downtown",
    "notes": "Organic vegetables from local farm",
    "status": "available",
    "createdAt": "2024-01-10T10:30:00.000Z",
    "updatedAt": "2024-01-10T10:30:00.000Z"
  }
}
```

#### Update Status
```http
PATCH /api/v1/donations/:id/status
Content-Type: application/json

{
  "status": "reserved"
}
```

#### Get Statistics
```http
GET /api/v1/donations/stats/summary
```

Response:
```json
{
  "success": true,
  "data": {
    "totalDonations": 25,
    "statusBreakdown": {
      "available": 15,
      "reserved": 7,
      "collected": 3
    },
    "foodTypeDistribution": {
      "Fresh Vegetables": 8,
      "Cooked Meals": 5,
      "Bread": 4,
      "Fruits": 8
    }
  }
}
```

## Data Model

### Donation Schema
```javascript
{
  id: String,           // UUID
  donorName: String,    // Required
  contact: String,      // Required
  foodType: String,     // Required
  quantity: Number,     // Required, positive number
  unit: String,         // Required (meals, kg, boxes, etc.)
  expiryDate: String,   // Required, ISO date string
  location: String,     // Required
  notes: String,        // Optional
  status: String,       // available | reserved | collected
  createdAt: String,    // ISO date string
  updatedAt: String     // ISO date string
}
```

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error description"
  },
  "timestamp": "2024-01-10T10:30:00.000Z"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Health Check

Check API health:
```http
GET /health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-10T10:30:00.000Z",
  "uptime": 3600.123,
  "environment": "development"
}
```

## Security Features

- **Helmet.js** - Sets various HTTP headers for security
- **CORS** - Configurable cross-origin resource sharing
- **Input Validation** - Server-side validation for all inputs
- **Error Sanitization** - Prevents sensitive data leakage

## Development

### Project Structure
```
food-donation-api/
├── src/
│   ├── models/
│   │   └── Donation.js
│   ├── routes/
│   │   └── donations.js
│   └── middleware/
│       └── errorMiddleware.js
├── server.js
├── package.json
└── README.md
```

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented yet)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License

## Support

For questions or issues, please open a GitHub issue or contact the development team. 