# MongoDB Setup Guide for ERP Sanjeevan

This guide explains how to set up MongoDB locally for the ERP Sanjeevan project.

## Option 1: Using Docker Compose (Recommended - Easiest)

### Prerequisites
- Install **Docker Desktop**: https://www.docker.com/products/docker-desktop
- Requires ~2GB disk space

### Steps

1. **Start MongoDB and Mongo Express:**
   ```bash
   cd "ERP_Sanjeevan (Community)"
   docker-compose up -d
   ```
   
   This will start:
   - **MongoDB** on `localhost:27017`
   - **Mongo Express** (web UI) on `http://localhost:8081`

2. **Verify MongoDB is Running:**
   ```bash
   docker ps
   ```
   You should see `erp_sanjeevan_mongodb` and `erp_mongo_express` containers running.

3. **Access Mongo Express (Optional):**
   - Open: http://localhost:8081
   - Username: `admin`
   - Password: `password123`
   - You can browse and manage data here

4. **Backend Connection Details:**
   - Host: `localhost`
   - Port: `27017`
   - Username: `erpsanjeevan`
   - Password: `erpsanjeevan123`
   - Database: `erp_sanjeevan`
   - URI (in `.env`): `mongodb://erpsanjeevan:erpsanjeevan123@localhost:27017/erp_sanjeevan?authSource=erp_sanjeevan`

5. **Start the Backend:**
   ```bash
   cd backend
   npm run dev
   ```

6. **Stop MongoDB:**
   ```bash
   docker-compose down
   ```

---

## Option 2: Manual MongoDB Installation

### Windows

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Download Windows MSI installer
   - Run the installer, select "Install MongoDB as a Service"

2. **Start MongoDB Service:**
   ```bash
   net start MongoDB
   ```

3. **Verify it's running:**
   ```bash
   netstat -ano | findstr ":27017"
   ```

4. **Backend Connection:**
   - Update `.env`:
     ```
     MONGODB_URI=mongodb://erpsanjeevan:erpsanjeevan123@localhost:27017/erp_sanjeevan?authSource=erp_sanjeevan
     ```

5. **Create User (first time only):**
   ```bash
   mongo
   ```
   Then paste:
   ```javascript
   use admin
   db.createUser({
     user: "admin",
     pwd: "password123",
     roles: ["root"]
   })
   
   use erp_sanjeevan
   db.createUser({
     user: "erpsanjeevan",
     pwd: "erpsanjeevan123",
     roles: [{ role: "readWrite", db: "erp_sanjeevan" }]
   })
   ```

---

## Option 3: MongoDB Atlas (Cloud - No Installation Needed)

1. **Sign up:** https://www.mongodb.com/cloud/atlas
2. **Create free M0 cluster**
3. **Create database user:**
   - Username: `erpsanjeevan`
   - Password: `YourPassword`
4. **Get connection string:** `mongodb+srv://erpsanjeevan:YourPassword@cluster0.xxxxx.mongodb.net/erp_sanjeevan?retryWrites=true&w=majority`
5. **Update `.env` with the connection string**

---

## Testing the Connection

Once MongoDB is running and backend is started:

```bash
# Test health endpoint
Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing | ConvertFrom-Json

# Create a leave request
$body = @{
    applicantType = "staff"
    applicantId = "staff001"
    applicantName = "Dr. Sarah"
    department = "CS"
    leaveType = "Sick Leave"
    startDate = "2024-12-28"
    endDate = "2024-12-30"
    days = 3
    reason = "Medical"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/leaves" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Connection refused" | Make sure MongoDB is running on port 27017 |
| "Authentication failed" | Check username/password in `.env` matches MongoDB user |
| Docker not working | Install Docker Desktop or use Option 2 |
| Port 27017 already in use | Kill existing process: `netstat -ano \| findstr ":27017"` |

---

## Collections Created

The initialization script automatically creates:
- `users` - User accounts
- `leaves` - Leave requests
- `notifications` - Notifications
- `events` - Events/Holidays

Indexes are also created for optimal query performance.

---

## Useful MongoDB Commands

```javascript
// Connect to MongoDB
mongo -u erpsanjeevan -p erpsanjeevan123 --authenticationDatabase erp_sanjeevan

// View all databases
show dbs

// Use a database
use erp_sanjeevan

// View collections
show collections

// View documents
db.leaves.find()

// Count documents
db.leaves.countDocuments()

// Clear a collection
db.leaves.deleteMany({})
```

---

## Next Steps

1. ✅ Start MongoDB (Docker or Manual)
2. ✅ Start Backend: `npm run dev` in `backend` folder
3. ✅ Start Frontend: `npm run dev` in root folder
4. ✅ Test the APIs
5. ✅ Build your ERP system!

Happy coding! 🚀
