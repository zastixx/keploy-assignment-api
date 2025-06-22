# Vendor Management System API

A comprehensive RESTful API for managing vendor information, built with Node.js and Express. This system supports multi-tenancy and is designed with future SaaS capabilities in mind.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [API Endpoints](#api-endpoints)
6. [Data Models](#data-models)
7. [Authentication](#authentication)
8. [Multi-tenancy Support](#multi-tenancy-support)
9. [Setup and Installation](#setup-and-installation)
10. [Running the Application](#running-the-application)
11. [Implementation Details](#implementation-details)
12. [Testing](#testing)
13. [Deployment](#deployment)

## Overview

The Vendor Management API provides a robust backend for managing vendor information with a focus on scalability and multi-tenancy. Perfect for businesses that need to track suppliers, contractors, and service providers, it can function as a standalone application or as part of a larger SaaS ecosystem.

## Features

- **Complete CRUD Operations**: Create, read, update, and delete vendor records
- **In-Memory Database**: For easy demonstration (can be switched to PostgreSQL)
- **Multi-tenancy Design**: Built for SaaS with data isolation between users/organizations
- **JWT Authentication**: Optional security layer for protecting endpoints
- **RESTful API Design**: Following standard HTTP methods and status codes
- **Well-structured Codebase**: Organized using the MVC pattern
- **Comprehensive Error Handling**: Clear error messages and appropriate HTTP status codes
- **API Documentation**: Complete endpoint documentation with request/response examples

## Prerequisites

- Node.js (v14+)
- npm or yarn package manager
- PostgreSQL (optional, for production use)

## Architecture

The system follows a clean, modular architecture:

- **Express.js**: Handles HTTP requests, routing, and middleware
- **Data Layer**: In-memory database (demo) with PostgreSQL support for production
- **Business Logic Layer**: Controller functions for processing vendor operations
- **Authentication Layer**: JWT-based authentication middleware
- **API Routes**: RESTful endpoints following standard conventions

## Project Structure

```
vendor-api/
├── .env                 # Environment variables configuration
├── .env.example         # Example environment configuration
├── .gitignore           # Git ignore file
├── index.js             # Application entry point
├── package.json         # Project dependencies and scripts
├── README.md            # Project documentation
└── src/
    ├── config/          # Configuration files
    │   ├── db.js        # PostgreSQL database connection setup
    │   ├── inMemoryDb.js # In-memory database for demonstration
    │   ├── seedDb.js    # Database seeding script
    │   └── setupDb.js   # Database tables setup
    ├── controllers/     # Request handlers
    │   └── vendorController.js # Vendor-related operations
    ├── middleware/      # Express middlewares
    │   └── auth.js      # JWT authentication middleware
    ├── models/          # Data models
    │   ├── user.js      # User model (for authentication)
    │   └── vendor.js    # Vendor model
    ├── routes/          # API routes
    │   └── vendorRoutes.js # Vendor endpoint definitions
    ├── utils/           # Utility functions
    └── server.js        # Express application setup
```

## Setup and Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd vendor-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory by copying the `.env.example` file:

```bash
cp .env.example .env
```

Update the `.env` file with your specific configuration:

```
# Server configuration
PORT=3001
NODE_ENV=development

# Database configuration (for PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=vendor_management

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=24h
```

### 4. (Optional) Set Up PostgreSQL Database

```bash
# Create database
psql -U postgres -c "CREATE DATABASE vendor_management"

# Run setup and seed scripts
npm run setup-db
npm run seed-db
```

### 5. Start the Server

For development (with nodemon for auto-reload):

```bash
npm run dev
```

For production:

```bash
npm start
```

The API will be running at `http://localhost:3001` (or the port specified in your .env file).

## API Endpoints

### Vendor Management

| Method | Endpoint           | Description       | Auth Required | Request Body   | Response                                                              |
| ------ | ------------------ | ----------------- | ------------- | -------------- | --------------------------------------------------------------------- |
| GET    | `/api/vendors`     | Get all vendors   | Optional      | N/A            | `{ success: true, count: <number>, data: [...vendors] }`              |
| GET    | `/api/vendors/:id` | Get vendor by ID  | Optional      | N/A            | `{ success: true, data: <vendor> }`                                   |
| POST   | `/api/vendors`     | Create new vendor | Optional      | Vendor object  | `{ success: true, data: <new_vendor> }`                               |
| PUT    | `/api/vendors/:id` | Update vendor     | Optional      | Updated vendor | `{ success: true, data: <updated_vendor> }`                           |
| DELETE | `/api/vendors/:id` | Delete vendor     | Optional      | N/A            | `{ success: true, message: "Vendor deleted successfully", data: {} }` |

### Authentication Endpoints (for future implementation)

| Method | Endpoint             | Description         | Auth Required | Request Body          | Response                                              |
| ------ | -------------------- | ------------------- | ------------- | --------------------- | ----------------------------------------------------- |
| POST   | `/api/auth/register` | Register a new user | No            | User details          | `{ success: true, user: <user> }`                     |
| POST   | `/api/auth/login`    | User login          | No            | `{ email, password }` | `{ success: true, token: <jwt_token>, user: <user> }` |

## Data Models

### Vendor Model

The core data entity in the system is the Vendor model with the following properties:

```javascript
{
  id: Number,              // Unique identifier
  name: String,            // Vendor name (required)
  category: String,        // Vendor category (required)
  contact_email: String,   // Contact email address
  phone_number: String,    // Phone number
  address: String,         // Physical address
  created_at: Date,        // Creation timestamp
  user_id: Number,         // Owner user ID (for multi-tenancy)
  org_id: Number           // Owner org ID (for multi-tenancy)
}
```

#### Validation Rules:

- `name`: Required, string
- `category`: Required, string
- `contact_email`: Optional, valid email format
- `phone_number`: Optional, string
- `address`: Optional, string

### User Model (for authentication)

```javascript
{
  id: Number,              // Unique identifier
  email: String,           // User email (unique, required)
  password: String,        // Hashed password (required)
  name: String,            // User's name
  role: String,            // User role (default: 'user')
  org_id: Number,          // Organization ID
  created_at: Date         // Creation timestamp
}
```

## Implementation Details

### In-Memory Database Module

For demonstration purposes, the application uses an in-memory database (`src/config/inMemoryDb.js`) with the following methods:

- `getAllVendors(user_id, org_id)`: Gets vendors filtered by user/org
- `getVendorById(id, user_id, org_id)`: Gets a specific vendor if authorized
- `addVendor(vendor)`: Creates a new vendor
- `updateVendor(id, data, user_id, org_id)`: Updates a vendor if authorized
- `deleteVendor(id, user_id, org_id)`: Deletes a vendor if authorized

### Controller Logic

The vendor controller (`src/controllers/vendorController.js`) implements:

1. Request validation and parameter extraction
2. Business logic for CRUD operations
3. Error handling and appropriate HTTP responses
4. Multi-tenancy filtering based on authenticated user
5. Response formatting for consistent API behavior

### Middleware Functions

The authentication middleware (`src/middleware/auth.js`):

1. Extracts JWT from the Authorization header (Bearer token)
2. Verifies token validity using JWT secret
3. Decodes user information
4. Attaches user object to the request for controllers to use
5. Allows bypassing in demo mode for easier testing

## Authentication

The API includes JWT (JSON Web Token) authentication that is configured but optional in the demonstration mode:

### Authentication Flow

1. Client sends credentials to login endpoint
2. Server validates credentials and returns a JWT token
3. Client includes JWT in the Authorization header of subsequent requests
4. Auth middleware validates the token and attaches user info to the request
5. Protected endpoints check for user authentication before processing

### Example with Authentication

```bash
# First, login to get a token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Use the returned token in subsequent requests
curl -X GET http://localhost:3001/api/vendors \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Multi-tenancy Support

The system is designed for multi-tenancy, enabling it to serve multiple users or organizations while keeping their data isolated:

### Key Multi-tenancy Features

- Each vendor record includes `user_id` and `org_id` fields
- When authentication is enabled, all vendor operations are scoped to the current user
- Database queries automatically filter results based on the authenticated user
- Organizations can share vendors across multiple users with the same `org_id`
- Admin users can override filters to view all vendors (configurable)

### Data Isolation

When a user is authenticated, the system automatically:

1. Adds their `user_id` and `org_id` to new vendors they create
2. Filters GET requests to only show vendors they own
3. Prevents modification of vendors belonging to other users
4. Maintains complete separation between different tenants

## Testing

### Manual API Testing

You can test the API using tools like Postman, curl, or any HTTP client:

#### Get All Vendors

```bash
curl -X GET http://localhost:3001/api/vendors
```

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "ABC Supplies",
      "category": "Office Supplies",
      "contact_email": "info@abcsupplies.com",
      "phone_number": "123-456-7890",
      "address": "123 Main St, City, Country",
      "created_at": "2023-06-21T12:00:00Z",
      "user_id": null,
      "org_id": null
    },
    {
      "id": 2,
      "name": "XYZ Technologies",
      "category": "IT Services",
      "contact_email": "contact@xyztech.com",
      "phone_number": "987-654-3210",
      "address": "456 Tech Ave, City, Country",
      "created_at": "2023-06-21T12:30:00Z",
      "user_id": null,
      "org_id": null
    }
  ]
}
```

#### Create a Vendor

```bash
curl -X POST http://localhost:3001/api/vendors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Vendor Inc",
    "category": "Consulting",
    "contact_email": "info@newvendor.com",
    "phone_number": "555-123-4567",
    "address": "789 Business Rd, City, Country"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "New Vendor Inc",
    "category": "Consulting",
    "contact_email": "info@newvendor.com",
    "phone_number": "555-123-4567",
    "address": "789 Business Rd, City, Country",
    "created_at": "2023-06-21T15:45:00Z",
    "user_id": null,
    "org_id": null
  }
}
```

#### Update a Vendor

```bash
curl -X PUT http://localhost:3001/api/vendors/3 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Vendor Inc",
    "category": "Professional Consulting",
    "contact_email": "support@updatedvendor.com",
    "phone_number": "555-123-4567",
    "address": "789 Business Rd, City, Country"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "Updated Vendor Inc",
    "category": "Professional Consulting",
    "contact_email": "support@updatedvendor.com",
    "phone_number": "555-123-4567",
    "address": "789 Business Rd, City, Country",
    "created_at": "2023-06-21T15:45:00Z",
    "user_id": null,
    "org_id": null
  }
}
```

#### Delete a Vendor

```bash
curl -X DELETE http://localhost:3001/api/vendors/3
```

**Response:**

```json
{
  "success": true,
  "message": "Vendor deleted successfully",
  "data": {}
}
```

### Error Handling

The API provides clear error messages with appropriate HTTP status codes:

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Authentication issues
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side issues

## Deployment

For production deployment:

1. **Environment Setup**:

   - Configure production environment variables
   - Set `NODE_ENV=production` in `.env`
   - Use a strong, unique `JWT_SECRET`

2. **Database Setup**:

   - Set up a production PostgreSQL database
   - Update database connection details in `.env`
   - Run setup scripts: `npm run setup-db && npm run seed-db`

3. **Deployment Options**:

   - **Heroku**: Use Procfile with `web: npm start`
   - **AWS Elastic Beanstalk**: Configure for Node.js environments
   - **Docker**: Use the provided Dockerfile or create your own
   - **Traditional VPS**: Configure with nginx as a reverse proxy

4. **Production Best Practices**:
   - Set up proper logging
   - Configure rate limiting
   - Enable CORS for specific origins only
   - Use HTTPS for all communications
   - Implement database connection pooling

## Conclusion

This Vendor Management System API provides a solid foundation for managing vendor information with a future-proof design for multi-tenancy and SaaS capabilities. The modular architecture allows for easy extension and maintenance as requirements evolve.

For questions or support, please contact the development team.

## License

[MIT License](LICENSE)
