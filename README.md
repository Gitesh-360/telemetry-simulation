# Real-Time Robotics Telemetry Dashboard (MERN + AWS)

A scalable, secure, and real-time dashboard to monitor a fleet of autonomous mobile robots (AMRs).  
Built using the **MERN stack** and deployed with **AWS cloud services**.

---

## 🚀 Tech Stack
- **Frontend:** React (Hooks, Context API), Axios, Socket.IO client
- **Backend:** Node.js, Express, Socket.IO, JWT authentication
- **Database:** MongoDB (MongoDB Atlas on AWS or AWS DocumentDB)
- **Cloud Services:** AWS EC2, S3, CloudFront, IAM, Security Groups
- **Authentication:** JSON Web Tokens (JWT)
- **Communication:** REST APIs + WebSockets (real-time telemetry)

---

## ⚙️ Setup & Run Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/robotics-telemetry-dashboard.git
cd robotics-telemetry-dashboard
```

## Setup Backend (Server)
- cd server
- npm install
- npm run dev

## Setup Frontend (Client)
- cd client
- npm install
- npm start


## High-Frequency Data Sink (Task 1.1)
For ingesting high-frequency robot telemetry (IMU, LiDAR, camera metadata), we cannot directly write into MongoDB due to throughput and scaling limits.

### We propose:
- AWS Kinesis Data Streams for ingestion (handles millions of events per second, scalable, real-time).
- Optionally, Amazon Timestream for time-series optimized storage (e.g., storing telemetry by timestamp).
- Process data from Kinesis → batch insert summarized data into MongoDB for dashboard queries.

### This ensures:
- High throughput (100+ robots sending data continuously).
- Scalability (auto-sharding, streaming).
- Cost-efficiency (pay-per-use).

## Authentication Strategy (JWT)
- Login → User sends credentials via POST /api/auth/login.
- Backend → Validates credentials, generates JWT signed with secret key.
- REST APIs → JWT sent in the Authorization: Bearer <token> header.
- WebSocket → Client passes JWT during handshake, server validates before upgrade.
- Expiry → Tokens expire (e.g., 1h), refresh via login.


## Deployment Steps (Conceptual)

### Frontend Deployment (React)
- Run npm run build inside client/.
- Upload the build/ folder to an AWS S3 bucket.
- Enable Static Website Hosting on S3.
- Configure CloudFront as CDN for global content delivery.
- Set proper CORS rules and Bucket Policy for public read.

### Backend Deployment (Node.js)
- Package the backend (server/) as a Node.js app.
- Deploy to AWS EC2 instance (Ubuntu AMI) OR Elastic Beanstalk for managed scaling.
    - EC2 → Full control, must configure Node, PM2, Nginx.
    - Elastic Beanstalk → Simplified deployment, auto-scaling, managed environments.
- Configure Environment Variables:
    - DB_URI for MongoDB Atlas/DocumentDB
    - JWT_SECRET for authentication
    - PORT for backend
- Set up Security Groups to allow only HTTPS traffic (443).
- Use AWS Certificate Manager (ACM) to configure SSL/TLS.