# How to Start the Backend Server

## Quick Start

1. **Navigate to backend directory:**
   ```powershell
   cd backend
   ```

2. **Start the server:**
   ```powershell
   npm run dev
   ```
   
   Or for production mode:
   ```powershell
   npm start
   ```

3. **Verify it's running:**
   - Open browser: http://localhost:5000/api/health
   - You should see: `{"status":"OK","message":"Server is running",...}`

## What's Already Configured

✅ **MongoDB**: Connected to `mongodb://localhost:27017/smart-patient-monitoring`
✅ **JWT Secret**: Secure random key generated and configured
✅ **Port**: Server will run on port 5000
✅ **CORS**: Configured for frontend at `http://localhost:5173`
✅ **Uploads Directory**: Created for ECG file uploads

## Server Endpoints

Once running, your API will be available at:
- Base URL: `http://localhost:5000`
- Health Check: `http://localhost:5000/api/health`
- Auth: `http://localhost:5000/api/auth/*`
- Sensor Data: `http://localhost:5000/api/sensordata`
- ECG: `http://localhost:5000/api/ecg`
- Appointments: `http://localhost:5000/api/appointments`
- And more...

## Troubleshooting

**If MongoDB connection fails:**
- Make sure MongoDB service is running: `Get-Service MongoDB`
- Check if MongoDB is listening on port 27017
- Verify connection string in `.env` file

**If port 5000 is already in use:**
- Change `PORT` in `.env` to a different port (e.g., 5001)
- Update frontend API calls to use the new port

**If you see module errors:**
- Run: `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall

## Next Steps

1. Start the backend server (see Quick Start above)
2. Update your frontend to connect to `http://localhost:5000/api`
3. Test authentication endpoints
4. Connect your frontend components to the backend API

