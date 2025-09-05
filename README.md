
# **Scalable Chat App**

**Scalable Chat App** is a real-time messaging application built to connect users seamlessly. It supports **user authentication, chat rooms, and presence status**, providing a foundation for scalable chat platforms.

**Live Demo**

**Frontend:** [Chat App Frontend](https://chat-app-ten-beige-30.vercel.app/)
**Backend API:** [Chat App Backend](https://chat-app-ejxv.onrender.com)

---

## **Features**

### **1. User Authentication**

* Users can **sign up and log in** securely using **JWT-based authentication**.
* Passwords are **hashed using bcrypt** for security.

### **2. Real-Time Chat**

* Users can **send and receive messages instantly** using **Socket.IO**.
* Messages are persisted in **MongoDB**.
* **Undelivered messages** are stored and delivered when users reconnect.

### **3. Presence & Online Status**

* Tracks **online/offline status** of users in real-time.
* Uses **Redis (Upstash free tier)** to manage presence efficiently.
* Supports horizontal scaling architecture for future enhancements.

---

## **Tech Stack**

* **Frontend:** React, TypeScript, Tailwind CSS
* **Backend:** Node.js, Express.js, Socket.IO
* **Database:** MongoDB Atlas (free tier)
* **Cache / Presence:** Upstash Redis (free tier)
* **Authentication:** JWT (Access & Refresh tokens)

---

## **Setup Instructions**

### **Backend**

1. Navigate to the `Backend` directory:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Add a `.env` file with keys:

```
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
REDIS_URL=redis://<your-upstash-endpoint>:<port>?password=<your-password>
```

4. Start the backend server:

```bash
npm start
```

---

### **Frontend**

1. Navigate to the `Frontend` directory:

```bash
cd Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Add a `.env` file with keys:

```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

4. Start the development server:

```bash
npm run dev
```

---

## **Deployment**

* **Frontend deployed:** Vercel free tier
* **Backend deployed:** Render free tier
* Docker can be used for **containerized deployment** locally or on servers.

---

## **Future Enhancements**

* **Media Storage & File Uploads:** Integrate S3/Cloudinary for chat media.
* **Monitoring & Analytics:** Add Prometheus/Grafana dashboards.
* **Load Testing & Scalability:** Validate performance for 500–1000 concurrent users using Artillery.

---

## **Usage**

* Access the app via the frontend URL.
* Sign up or log in to **start chatting in real-time**.
* Observe **presence status** for online/offline users.

---

## **Contributing**

* Contributions are welcome! Fork the repo and submit pull requests.

---

## **License**

* MIT License



