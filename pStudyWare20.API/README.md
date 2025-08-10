# pStudyWare20 API

This is the API for the pStudyWare20 application, providing student registration and authentication services.

## Getting Started

### Prerequisites

- .NET 9.0 SDK
- SQL Server (for database connectivity)

### Running the API

1. Navigate to the API project directory:

   ```bash
   cd pStudyWare20.API
   ```

2. Run the API:

   ```bash
   dotnet run
   ```

3. The API will start on:
   - HTTP: http://localhost:5281
   - HTTPS: https://localhost:7146

## Swagger Documentation

Once the API is running, you can access the Swagger UI at:

- http://localhost:5281/swagger
- https://localhost:7146/swagger

### Available Endpoints

#### Test Endpoints

- `GET /api/test/public` - Public endpoint (no authentication required)
- `GET /api/test/cors-test` - CORS test endpoint
- `GET /api/test/protected` - Protected endpoint (authentication required)
- `GET /api/test/admin` - Admin endpoint (admin role required)

#### Authentication Endpoints

- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info (authenticated)
- `GET /api/auth/validate-token` - Validate JWT token
- `POST /api/auth/forgot-password` - Forgot password request
- `POST /api/auth/refresh-token` - Refresh JWT token

#### Student Registration Endpoints

- `POST /api/studentregistration` - Create new student registration
- `GET /api/studentregistration/{id}` - Get registration by ID
- `GET /api/studentregistration` - Get all registrations
- `PUT /api/studentregistration/{id}` - Update registration
- `DELETE /api/studentregistration/{id}` - Delete registration
- `GET /api/studentregistration/parent/{email}` - Get registrations by parent email
- `GET /api/studentregistration/student/{email}` - Get registrations by student email
- `GET /api/studentregistration/session/{session}` - Get registrations by session
- `GET /api/studentregistration/location/{location}` - Get registrations by location

### Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. First, obtain a token by calling the login endpoint
2. Include the token in the Authorization header: `Bearer {token}`

### Testing with Swagger

1. Open the Swagger UI in your browser
2. Click on the "Authorize" button at the top
3. Enter your JWT token in the format: `Bearer {your-token}`
4. Now you can test protected endpoints

### Example Usage

#### Login

```json
POST /api/auth/login
{
  "emailOrUsername": "user@example.com",
  "password": "password123"
}
```

#### Create Student Registration

```json
POST /api/studentregistration
{
  "parentFirstName": "John",
  "parentLastName": "Doe",
  "parentEmail": "john.doe@example.com",
  "parentPhone": "555-123-4567",
  "city": "Phoenix",
  "state": "AZ",
  "country": "USA",
  "studentFirstName": "Jane",
  "studentLastName": "Doe",
  "studentEmail": "jane.doe@example.com",
  "school": "Phoenix High School",
  "grade": 10,
  "session": "Fall2024",
  "location": 1,
  "userNameType": "P",
  "waiverSignature": "John Doe",
  "ruleSignature": "John Doe",
  "picturePermission": true
}
```

## Configuration

The API configuration is stored in `appsettings.json`:

- **ConnectionStrings**: Database connection string
- **JwtSettings**: JWT token configuration
- **Logging**: Logging configuration

## Development

### Building the Project

```bash
dotnet build
```

### Running Tests

```bash
dotnet test
```

### Database Migrations

```bash
dotnet ef migrations add MigrationName
dotnet ef database update
```

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure SQL Server is running and the connection string is correct
2. **CORS Issues**: The API is configured to allow all origins for development
3. **Authentication**: Make sure to include the JWT token in the Authorization header

### Logs

Check the console output for detailed error messages and logs.
