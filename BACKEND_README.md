# Vendor Management System API

A comprehensive RESTful API for managing vendor information, built with Node.js and Express. This system supports multi-tenancy and is designed with future SaaS capabilities in mind.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [Authentication](#authentication)
6. [Multi-tenancy Support](#multi-tenancy-support)
7. [Setup and Installation](#setup-and-installation)
8. [Running the Application](#running-the-application)
9. [Testing](#testing)
10. [Deployment](#deployment)

## Architecture Overview

The Vendor Management System API follows a modular architecture with clean separation of concerns:

- **Express.js**: Web framework for handling HTTP requests
- **In-Memory Database**: For demonstration purposes (can be replaced with PostgreSQL)
- **JWT Authentication**: For securing endpoints (optional in demo mode)
- **RESTful API Design**: Following standard HTTP methods and status codes
- **MVC Pattern**: Models for data, Controllers for business logic, Routes for URL mapping

The application is designed to be scalable, maintainable, and ready for future enhancements.

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
    │   ├── db.js        # Database connection setup
    │   ├── inMemoryDb.js # In-memory database for demo
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

## API Endpoints

The API provides the following endpoints for vendor management:

### Vendor Endpoints

| Method | Endpoint           | Description       | Request Body   | Response                                                              |
| ------ | ------------------ | ----------------- | -------------- | --------------------------------------------------------------------- |
| GET    | `/api/vendors`     | Get all vendors   | N/A            | `{ success: true, count: <number>, data: [...vendors] }`              |
| GET    | `/api/vendors/:id` | Get vendor by ID  | N/A            | `{ success: true, data: <vendor> }`                                   |
| POST   | `/api/vendors`     | Create new vendor | Vendor object  | `{ success: true, data: <new_vendor> }`                               |
| PUT    | `/api/vendors/:id` | Update vendor     | Updated vendor | `{ success: true, data: <updated_vendor> }`                           |
| DELETE | `/api/vendors/:id` | Delete vendor     | N/A            | `{ success: true, message: "Vendor deleted successfully", data: {} }` |

### Authentication Endpoints (for future use)

| Method | Endpoint             | Description       | Request Body          | Response            |
| ------ | -------------------- | ----------------- | --------------------- | ------------------- |
| POST   | `/api/auth/login`    | User login        | `{ email, password }` | `{ token, user }`   |
| POST   | `/api/auth/register` | User registration | User details          | `{ success, user }` |

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

### User Model (for future authentication)

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

## Authentication

The API includes JWT (JSON Web Token) authentication that is configured but optional in the demonstration mode. When enabled:

1. Users register or login to receive a JWT token
2. The token is included in the Authorization header for API requests
3. The auth middleware validates the token and attaches the user to the request
4. Endpoints can use the user information for authorization and multi-tenancy

The authentication flow is:

```
Client → Login with credentials → Server returns JWT → Client includes JWT in subsequent requests
```

## Multi-tenancy Support

The system is designed for multi-tenancy, where:

- Each vendor is associated with a user_id and/or org_id
- When authentication is enabled, requests are scoped to the authenticated user
- Users can only see and modify vendors that belong to them or their organization
- The vendor model methods include user/org filtering to enforce this separation

This design makes the system ready for SaaS deployment with proper data isolation between tenants.

## Setup and Installation

### Prerequisites

- Node.js (v14+)
- npm or yarn package manager
- PostgreSQL (optional, for production use)

### Installation Steps

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd vendor-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   - Copy `.env.example` to `.env`
   - Update the values according to your environment

4. (Optional) Set up PostgreSQL database:
   - Create a database named `vendor_management`
   - Update DB connection details in `.env`
   - Run setup script: `npm run setup-db`

## Running the Application

### Development Mode

```bash
npm run dev
```

This starts the server with nodemon for automatic reloading on code changes.

### Production Mode

```bash
npm start
```

The server will be available at http://localhost:3001 (or the port specified in your .env file).

## Testing

### Testing with API Clients

You can test the API using tools like Postman or curl:

#### Example: Get all vendors

```bash
curl -X GET http://localhost:3001/api/vendors
```

#### Example: Create a vendor

```bash
curl -X POST http://localhost:3001/api/vendors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ACME Corporation",
    "category": "IT Services",
    "contact_email": "contact@acme.com",
    "phone_number": "555-123-4567",
    "address": "123 Business St, Tech City"
  }'
```

## Implementation Details

### In-Memory Database Module

For demonstration purposes, the application uses an in-memory database. The implementation is in `src/config/inMemoryDb.js` and provides:

- `getAllVendors()` - Returns all vendors
- `getVendorById(id)` - Returns a vendor by ID
- `addVendor(vendor)` - Adds a new vendor
- `updateVendor(id, data)` - Updates an existing vendor
- `deleteVendor(id)` - Deletes a vendor

This can be replaced with the PostgreSQL connection for production use.

### Controller Logic

The vendor controller (`src/controllers/vendorController.js`) handles:

1. Parsing request parameters and body
2. Validating input data
3. Calling the appropriate model methods
4. Error handling and response formatting
5. Applying multi-tenancy filters based on authenticated user

### Middleware Functions

The auth middleware (`src/middleware/auth.js`):

1. Extracts JWT token from the Authorization header
2. Verifies the token's validity
3. Decodes the user information
4. Attaches user data to the request object
5. In demonstration mode, allows requests without valid tokens

## Deployment

For production deployment:

1. Configure environment variables for production
2. Set up a PostgreSQL database
3. Update the database connection in `.env`
4. Set `NODE_ENV=production` in `.env`
5. Deploy the application to your hosting provider

Recommended hosting options:

- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run
- Digital Ocean App Platform

## Conclusion

This Vendor Management System API provides a solid foundation for managing vendor information with future-proof design for multi-tenancy and SaaS capabilities. The modular architecture allows for easy extension and maintenance as requirements evolve.
