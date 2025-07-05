# OnBoarding API

A Node.js/Express REST API for automating employee onboarding, with real-time log streaming via Socket.IO and integration with n8n for workflow automation.

---

## Features

- **User Onboarding:** Create new users with secure, randomly generated passwords (hashed in DB, plain password returned once).
- **Real-Time Logs:** Logs onboarding steps and streams them to connected clients via WebSockets (Socket.IO).
- **n8n Integration:** Triggers n8n workflows for further automation (e.g., sending emails, calendar invites, GitHub org invites).
- **User Authentication:** Login and password update endpoints.
- **MongoDB Storage:** Stores users and logs in MongoDB.

---

## Tech Stack

- Node.js
- Express
- MongoDB & Mongoose
- Socket.IO
- n8n (external workflow automation)
- dotenv for environment variables

---

## Getting Started

### 1. Clone the repository

```sh
git clone <your-repo-url>
cd OnBoarding-API
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/mydatabase
N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/onboarding
```

### 4. Start the server

```sh
npm run dev
```
or
```sh
npm start
```

---

## API Endpoints

### User Onboarding

- **POST** `/api/start-onboarding`  
  Create a new user and trigger onboarding workflow.

  **Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "department": "Engineering",
    "title": "Developer",
    "githubUsername": "johndoe"
  }
  ```

  **Response:**
  ```json
  {
    "message": "User created successfully",
    "user": { ... },
    "password": "plainPassword"
  }
  ```

### Log Onboarding Step

- **POST** `/api/log-onboarding`  
  Log a step in the onboarding process (used by n8n).

  **Body:**
  ```json
  {
    "email": "john@example.com",
    "step": "Calendar Invitation",
    "status": "Sent"
  }
  ```

### Get Logs

- **GET** `/api/logs/:email`  
  Get all logs for a user.

### User Login

- **POST** `/api/login`  
  User login with email and password.

### Update Password

- **PUT** `/api/update-password`  
  Update user password.

---

## Real-Time Log Streaming

- Connect to the Socket.IO server at `ws://localhost:3000` (or your configured port).
- Listen for the `log` event to receive real-time onboarding logs.

**Example (HTML):**
```html
<script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
<script>
  const socket = io('http://localhost:3000');
  socket.on('log', log => console.log(log));
</script>
```

---

## n8n Integration

- The API triggers an n8n webhook after user creation.
- n8n can call `/api/log-onboarding` to log steps, which are then streamed to the frontend in real time.

---

## Development

- Code is organized in `controller/`, `models/`, `routes/`, and `utils/`.
- Uses ES Modules (`"type": "module"` in `package.json`).

---

## License

MIT

---

## Author

Louis Yangga
