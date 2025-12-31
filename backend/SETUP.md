# Quick Setup Guide

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` and update:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A strong secret key for JWT tokens
   - `FRONTEND_URL` - Your frontend URL (default: http://localhost:5173)

## Step 3: Start MongoDB

**Local MongoDB:**
- Make sure MongoDB is installed and running
- Default connection: `mongodb://localhost:27017/smart-patient-monitoring`

**MongoDB Atlas (Cloud):**
- Create a cluster at https://www.mongodb.com/cloud/atlas
- Get your connection string and update `MONGODB_URI` in `.env`

## Step 4: Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## Step 5: Test the API

Visit `http://localhost:5000/api/health` in your browser. You should see:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "..."
}
```

## Example API Calls

### Register a Patient
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "patient1",
  "email": "patient@example.com",
  "password": "password123",
  "role": "patient",
  "name": "John Doe",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "contactNo": "1234567890",
  "bloodType": "O+"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "patient1",
  "password": "password123"
}
```

### Get Sensor Data (with JWT token)
```bash
GET http://localhost:5000/api/sensordata
Authorization: Bearer <your-jwt-token>
```

## Troubleshooting

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check your `MONGODB_URI` in `.env`
   - Verify network/firewall settings

2. **Port Already in Use:**
   - Change `PORT` in `.env` to a different port
   - Or stop the process using port 5000

3. **Module Not Found:**
   - Run `npm install` again
   - Delete `node_modules` and `package-lock.json`, then reinstall

4. **JWT Errors:**
   - Ensure `JWT_SECRET` is set in `.env`
   - Use a strong, random secret key

## Next Steps

1. Connect your frontend to the backend API
2. Update frontend API calls to use `http://localhost:5000/api`
3. Implement authentication flow in frontend
4. Test all endpoints with your frontend application

