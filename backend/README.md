# Smart Patient Monitoring System - Backend API

Backend API built with Express.js, MongoDB, and JWT authentication for the Smart Patient Monitoring System.

## Features

- 🔐 JWT-based authentication and authorization
- 👥 Multi-role support (Patient, Doctor, Nurse, Admin)
- 📊 Real-time sensor data management
- ❤️ ECG analysis and management
- 📅 Appointment scheduling
- 💊 Medication management
- 📋 Medical reports
- 💬 Messaging system
- 🔒 Role-based access control

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/smart-patient-monitoring
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

5. **Create uploads directory:**
   ```bash
   mkdir -p uploads/ecg
   ```

6. **Start MongoDB** (if using local MongoDB):
   ```bash
   # Windows
   mongod

   # macOS/Linux
   sudo systemctl start mongod
   ```

## Running the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout (requires auth)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)
- `GET /api/users/role/patient` - Get all patients
- `GET /api/users/role/doctor` - Get all doctors

### Sensor Data
- `GET /api/sensordata` - Get sensor data
- `GET /api/sensordata/latest/:patientId` - Get latest sensor data
- `POST /api/sensordata` - Create sensor data
- `GET /api/sensordata/alerts/critical` - Get critical alerts (doctor/nurse/admin)

### ECG
- `GET /api/ecg` - Get all ECG records
- `GET /api/ecg/:id` - Get ECG by ID
- `POST /api/ecg/analyze` - Upload and analyze ECG (doctor/admin)
- `PUT /api/ecg/:id/review` - Review ECG (doctor/admin)
- `GET /api/ecg/alerts/critical` - Get critical ECG alerts

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `PUT /api/appointments/:id/confirm` - Confirm appointment (doctor/admin)
- `PUT /api/appointments/:id/cancel` - Cancel appointment

### Medications
- `GET /api/medications` - Get all medications
- `GET /api/medications/:id` - Get medication by ID
- `POST /api/medications` - Prescribe medication (doctor/nurse/admin)
- `PUT /api/medications/:id` - Update medication
- `PUT /api/medications/:id/discontinue` - Discontinue medication

### Reports
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get report by ID
- `POST /api/reports` - Create report (doctor/nurse/admin)
- `PUT /api/reports/:id` - Update report

### Messages
- `GET /api/messages` - Get messages
- `GET /api/messages/unread/count` - Get unread count
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark message as read
- `PUT /api/messages/read/all` - Mark all messages as read

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## User Roles

- **patient** - Can view and manage their own data
- **doctor** - Can view patient data, create appointments, prescribe medications
- **nurse** - Similar to doctor with limited permissions
- **admin** - Full access to all resources

## Database Models

- **User** - User accounts with role-based fields
- **SensorData** - Real-time vital signs data
- **ECG** - ECG records and analysis
- **Appointment** - Medical appointments
- **Medication** - Prescribed medications
- **Report** - Medical reports
- **Message** - User messages

## Error Handling

The API returns standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation
- CORS configuration
- Environment variable protection

## Development

### Project Structure
```
backend/
├── config/
│   └── database.js
├── middleware/
│   └── auth.middleware.js
├── models/
│   ├── User.js
│   ├── SensorData.js
│   ├── ECG.js
│   ├── Appointment.js
│   ├── Medication.js
│   ├── Report.js
│   └── Message.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── sensorData.routes.js
│   ├── ecg.routes.js
│   ├── appointment.routes.js
│   ├── medication.routes.js
│   ├── report.routes.js
│   └── message.routes.js
├── utils/
│   └── generateToken.js
├── uploads/
│   └── ecg/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## License

ISC

