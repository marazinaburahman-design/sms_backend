# AI Features Setup

This backend now includes four authenticated AI endpoints:

- `GET /api/ai/student-performance/:studentId`
- `GET /api/ai/at-risk-students`
- `GET /api/ai/dashboard-insights`
- `GET /api/ai/student-report/:studentId`

## What the AI uses

The current database has students, courses, enrollments, and attendance. It does **not** have marks/grades/exam results, so the performance analyzer and reports must not pretend to measure academic grades. They currently use enrollment and attendance data.

## 1. Create your environment file

Copy `.env.example` to `.env` and keep `.env` out of Git.

Required values:

```env
OPENAI_API_KEY=your_real_key_here
AI_MODEL=gpt-5.6-luna
AI_MAX_OUTPUT_TOKENS=1000
```

Keep your API key only on the backend. Never put it in React/Vite frontend code or commit it to GitHub.

## 2. Install and run

The AI integration uses Node's built-in `fetch`, so no additional AI npm package is required for this implementation. The supplied project already uses Node 18+ compatible APIs.

```bash
npm install
npm run dev
```

## 3. Test in Postman

First log in through the existing authentication endpoint so the `token` HTTP-only cookie is created. Then call the AI endpoint using the same Postman cookie jar.

Example:

```text
GET http://localhost:5000/api/ai/dashboard-insights
GET http://localhost:5000/api/ai/at-risk-students
GET http://localhost:5000/api/ai/student-performance/STUDENT_OBJECT_ID
GET http://localhost:5000/api/ai/student-report/STUDENT_OBJECT_ID
```

For the two student endpoints, replace `STUDENT_OBJECT_ID` with the MongoDB `_id` from the Students API.

## Important data limitation

The system currently cannot provide genuine grade-based academic performance because there is no marks/grades collection. If you want that later, add an academic-results model/collection and include fields such as student, course, assessment type, marks, total marks, and date. Then the AI performance analyzer can use those records too.

## Security

AI routes require the existing `protect` middleware. Do not expose the OpenAI API key to the browser. In production, configure `OPENAI_API_KEY` as a deployment environment variable rather than committing `.env`.
