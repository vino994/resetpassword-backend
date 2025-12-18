# 🔐 Password Reset Backend (Node.js + Express)

This is the backend service for the **Password Reset Flow** application.  
It handles user authentication, forgot password, reset password, and email logic.

---

## 🚀 Live Backend URL
https://resetpassword-backend-0am7.onrender.com

## 🚀 Live Poatman URL
https://documenter.getpostman.com/view/48630910/2sB3dVP85b

---

## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- bcryptjs
- crypto
- nodemailer
- dotenv

---

## 📌 Features Implemented

- User Registration
- User Login
- Forgot Password
- Secure Token Generation
- Token Expiry Handling
- Password Reset
- Email Notification (Non-blocking)

---

## 🔁 Password Reset Flow

1. User enters registered email
2. Server checks user existence
3. Secure token is generated
4. Token + expiry stored in database
5. Reset link is generated
6. Reset link is returned in API response
7. User sets new password using token

---

## 📡 API Endpoints

### Register
