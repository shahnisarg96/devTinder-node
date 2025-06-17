# DevTinder Backend

A Node.js/Express REST API backend for DevTinder — a developer-focused social connection platform inspired by Tinder. This backend handles authentication, user profiles, feed, connection requests, and established connections, using MongoDB for data storage.

---

## 🚀 Features

- **Authentication:**  
  Secure signup, login, and logout with JWT and HTTP-only cookies.
- **User Profiles:**  
  View and edit user profiles, including name, age, gender, about, skills, and profile picture.
- **Feed:**  
  Paginated feed of developers you haven't interacted with yet.
- **Connection Requests:**  
  Send, accept, reject, or ignore connection requests.
- **Connections:**  
  View your accepted connections.
- **Validation:**  
  Robust input validation for signup and profile updates.
- **Session Management:**  
  All endpoints require authentication via cookies (except signup/login).
- **Cron Jobs:**  
  Example cron job setup using node-cron.
- **CORS:**  
  Configured for secure cross-origin requests with frontend.
- **Modular Structure:**  
  Organized routes, models, middlewares, and utilities.

---

## 🛠️ Tech Stack

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB + Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [node-cron](https://www.npmjs.com/package/node-cron)
- [validator](https://www.npmjs.com/package/validator)

---

## 📁 Project Structure

```
devTinder-backend/
├── .env
├── .gitignore
├── apiList.md
├── package.json
├── README.md
└── src/
    ├── app.js
    ├── config/
    │   └── database.js
    ├── middlewares/
    │   └── auth.js
    ├── models/
    │   ├── connections.js
    │   └── user.js
    ├── routes/
    │   ├── auth.js
    │   ├── connections.js
    │   ├── feed.js
    │   └── profile.js
    └── utils/
        ├── cronjob.js
        └── validator.js
```

---

## ⚙️ Setup & Installation

1. **Clone the repository:**
   ```
   git clone <repo-url>
   cd devTinder-backend
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     CLIENT_URL=http://localhost:5173
     NODE_ENV=development
     ```

4. **Start the server:**
   ```
   npm run dev
   ```
   The server will run at [http://localhost:3000](http://localhost:3000) by default.

---

## 🧩 API Endpoints

See [`apiList.md`](apiList.md) for a summary.  
All endpoints (except `/signup` and `/login`) require authentication via HTTP-only cookie.

### **Auth**
- `POST /signup` — Register a new user
- `POST /login` — Login and receive a session cookie
- `POST /logout` — Logout and clear session

### **Profile**
- `GET /profile/view` — View your profile
- `PATCH /profile/edit` — Edit your profile

### **Feed**
- `GET /feed` — Get paginated list of users you haven't interacted with

### **Connections**
- `POST /connection/send/:status/:toUserId` — Send a connection request (`status` = interested/ignored)
- `POST /connection/review/:status/:toUserId` — Accept or reject a request (`status` = accepted/rejected)
- `GET /connection/requests` — View incoming requests
- `GET /connection/sent` — View sent requests
- `GET /connections` — View accepted connections

---

## 📝 Notes

- All passwords are hashed with bcrypt.
- JWT tokens are stored in HTTP-only cookies for security.
- All user input is validated (see [`src/utils/validator.js`](src/utils/validator.js)).
- MongoDB is required for data storage.
- The backend is designed to work with the [DevTinder frontend](../devTinder-frontend/README.md).
- Example cron job is set up in [`src/utils/cronjob.js`](src/utils/cronjob.js).

---

## 📚 References

- [Namaste Node.js](https://namastedev.com/learn/namaste-node)
- [Express Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Guide](https://jwt.io/introduction)

---

## 👨‍💻 Author

Inspired by: **Akshay Saini**  
Project by: **Nisarg Shah**