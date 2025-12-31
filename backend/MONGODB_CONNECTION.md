# MongoDB Connection Guide

## ✅ Current Status

- **MongoDB Service**: Running ✅
- **Connection String**: `mongodb://localhost:27017/smart-patient-monitoring`
- **Port**: 27017 (default MongoDB port)

## Verify Connection in MongoDB Compass

1. **Open MongoDB Compass**

2. **Connect using:**
   - Connection String: `mongodb://localhost:27017`
   - Or click "New Connection" and use:
     - Host: `localhost`
     - Port: `27017`
     - Authentication: None (for local setup)

3. **After connecting, you should see:**
   - The database `smart-patient-monitoring` will be created automatically when the backend first connects
   - You can also create it manually in Compass if you want

## Test the Connection

### Option 1: Test from Backend (Recommended)

1. **Start your backend server:**
   ```powershell
   cd backend
   npm run dev
   ```

2. **Look for this message in the console:**
   ```
   ✅ Connected to MongoDB
   ```

3. **If you see an error**, check:
   - MongoDB service is running: `Get-Service MongoDB`
   - Port 27017 is not blocked by firewall
   - Connection string in `.env` is correct

### Option 2: Test in MongoDB Compass

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. You should see your databases listed
4. The `smart-patient-monitoring` database will appear after the backend connects

## Create Database Manually (Optional)

If you want to create the database before starting the backend:

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Click "Create Database"
4. Database Name: `smart-patient-monitoring`
5. Collection Name: `users` (or any name, collections are created automatically)

**Note:** You don't need to do this - the backend will create the database and collections automatically when it first connects.

## Troubleshooting

### MongoDB Service Not Running

**Start the service:**
```powershell
Start-Service MongoDB
```

**Check status:**
```powershell
Get-Service MongoDB
```

### Connection Refused Error

1. **Check if MongoDB is listening on port 27017:**
   ```powershell
   netstat -an | findstr 27017
   ```

2. **Restart MongoDB service:**
   ```powershell
   Restart-Service MongoDB
   ```

### Firewall Issues

If you have firewall enabled, make sure port 27017 is allowed:
- Windows Firewall → Advanced Settings → Inbound Rules
- Allow port 27017 for MongoDB

## Your Backend Configuration

Your `.env` file already has the correct connection string:
```
MONGODB_URI=mongodb://localhost:27017/smart-patient-monitoring
```

This will:
- Connect to MongoDB on localhost
- Use port 27017 (default)
- Create/use database named `smart-patient-monitoring`

## Next Steps

1. ✅ MongoDB is running
2. ✅ Connection string is configured
3. **Start your backend:**
   ```powershell
   cd backend
   npm run dev
   ```

4. **Watch for the connection message:**
   ```
   ✅ Connected to MongoDB
   ```

5. **Verify in MongoDB Compass:**
   - Connect to `mongodb://localhost:27017`
   - You should see `smart-patient-monitoring` database
   - Collections will be created as you use the API

## Collections That Will Be Created

When you start using the API, these collections will be created automatically:
- `users` - User accounts
- `sensordatas` - Sensor readings
- `ecgs` - ECG records
- `appointments` - Appointments
- `medications` - Medications
- `reports` - Medical reports
- `messages` - Messages

You can view all of these in MongoDB Compass once the backend starts and you make API calls!

