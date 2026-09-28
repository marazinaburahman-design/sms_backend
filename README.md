# EduPilot Backend

Express + MongoDB backend for the Student Management System with Groq-powered AI insights.

## Setup

```bash
npm install
npm start
```

Development:

```bash
npm run dev
```

Create `.env` from `.env.example` and provide your own values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_key
AI_MODEL=your_groq_model
```

## Authentication and roles

- Authentication is cookie-based using an httpOnly JWT cookie.
- User roles are `admin` and `staff`.
- Registration creates a `staff` user by default.
- Admin-only mutation endpoints are protected by `authMiddleware` followed by `adminMiddleware`.

### Admin-only mutations

- Students: POST, PUT, DELETE
- Courses: POST, PUT, DELETE
- Enrollments: POST, PUT, DELETE
- Attendance: POST, PUT, DELETE
- Course-instructor assignment/removal

Staff can read protected resources and use the read-only/AI features exposed by the frontend, but mutation requests are rejected with HTTP 403.

## Important

The `.env` file is intentionally not included in the distributable ZIP. Put your own secrets into `.env` locally/deployment settings.
