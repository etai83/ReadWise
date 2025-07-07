# Product Requirements Document (PRD)

## Reading Comprehension Practice Web App

## 1. Purpose
Help users strengthen reading‑comprehension skills by uploading PDFs, answering auto‑generated multiple‑choice questions, and monitoring long‑term progress.

## 2. Target Users
- Students (middle school → university)
- Language learners (ESL/second‑language)
- Teachers & tutors creating practice material
- Professionals preparing for reading‑heavy exams (TOEFL, IELTS, GMAT, etc.)

## 3. Core Features

| # | Feature | Description |
|---|---------|-------------|
| A | PDF Upload | Drag‑and‑drop PDF (≤ 10 MB) → extract clean text. |
| B | Question Generation | Create 5 comprehension questions per upload, each with 4 options (1 correct). |
| C | Quiz Interface | User answers MCQs; optional per‑question explanations/snippets. |
| D | Scoring & Feedback | Instant score (0‑5) + breakdown of correct/incorrect answers. |
| E | Authentication (NEW) | Sign in / sign up with Clerk.js (email + social providers). |
| F | Personal Development Dashboard (NEW) | Logged‑in users see a timeline of all past quizzes: document title, date, score. Clicking an entry opens a detailed quiz review (questions, chosen answer, correct answer, supporting text). |
| G | Data Persistence (OPT‑IN) | Store PDFs, generated quizzes, and answers per user (encrypted at rest). |


## 4. User Flow
1. Visit Site → 2. Sign In / Sign Up (Clerk) → 3. Upload PDF
2. Quiz Generated & Displayed → 5. User Answers → 6. Score Shown
3. Dashboard updates instantly with the new quiz entry; user can inspect history anytime.

## 5. Technical Requirements

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | Next.js 13+ App Router | TypeScript, TailwindCSS, shadcn/ui. File upload, quiz UI, dashboard. |
| Auth | Clerk.js | Out‑of‑the‑box sign‑in, sign‑up, session management, user object. |
| Backend / API Routes | Next.js Route Handlers (app/api/*) | /generate-quiz, /submit-quiz, /dashboard-data. |
| LLM | OpenAI, Ollama, or hosted model | Prompt engineering to produce questions + distractors. |
| PDF Parsing | pdf-parse / pdfplumber / pdf.js | Strips images, keeps text. |
| DB | Supabase Postgres + Prisma | Tables: users, documents, quizzes, questions, answers. Foreign keys tie data to Clerk user_id. |
| Security & Privacy | File‑type validation, size limit, role‑based access (Clerk), optional auto‑deletion of PDFs after parsing. | |
| Performance | Generate quiz ≤ 10 s; dashboard API ≤ 300 ms. | |
| Accessibility | WCAG 2.1 AA: keyboard navigation, ARIA labels. | |




## 6. Non‑Functional Requirements
- Responsive across desktop, tablet, mobile.
- Localization‑ready (i18n) for future languages.
- Scalable: horizontal scaling via Vercel / Fly.io.
- Observability: metrics & error tracking via PostHog + Sentry.

## 7. Success Metrics
- First‑quiz completion rate ≥ 80 %.
- Return‑user 7‑day retention ≥ 40 %.
- Average score improvement for active users over 30 days.
- NPS / qualitative feedback on quiz relevance (target ≥ 4 / 5).

## 8. Stretch Goals
- OCR for scanned PDFs.
- Adaptive difficulty and spaced‑repetition scheduling.
- Teacher cohort accounts (assign docs, track class progress).
- Export quiz to PDF/CSV.
- Progress‑trend charts in dashboard (rolling average, heat map).



## 9. 📁 Reference File Structure (Next.js 13 + Clerk.js)

```
reading-comprehension-app/
├── app/
│   ├── layout.tsx                # Global shell
│   ├── page.tsx                  # Landing (CTA → SignIn)
│   ├── sign-in/                  # Clerk-hosted but composable
│   │   └── page.tsx              # <SignIn> component
│   ├── dashboard/                # Personal progress area
│   │   └── page.tsx              # Quiz history list
│   ├── quiz/                     # Quiz experience
│   │   ├── [quizId]/page.tsx     # Live quiz
│   │   └── [quizId]/review.tsx   # Post‑submission review
│   ├── upload/
│   │   └── page.tsx              # PDF upload & parse preview
│   └── api/
│       ├── generate-quiz/route.ts # POST: create quiz
│       ├── submit-quiz/route.ts   # POST: store answers + score
│       └── dashboard/route.ts     # GET: aggregated history
│
├── components/
│   ├── FileUploader.tsx
│   ├── QuestionCard.tsx
│   ├── ScoreSummary.tsx
│   ├── QuizHistoryTable.tsx
│   └── ProtectedRoute.tsx        # Redirects unauthenticated users
│
├── lib/
│   ├── pdf.ts
│   ├── questions.ts
│   ├── scoring.ts
│   └── clerk.ts                  # Clerk helper (getAuth, currentUser)
│
├── prisma/
│   └── schema.prisma
├── public/
├── styles/
│   └── globals.css
├── .env
├── next.config.js
├── tailwind.config.ts
├── shadcn.config.ts
├── tsconfig.json
└── README.md
```


## 10. Data Model Snapshot (Prisma)

```prisma
model User {
  id          String   @id @default(uuid())
  clerkId     String   @unique            // Clerk's user ID
  quizzes     Quiz[]
  createdAt   DateTime @default(now())
}

model Document {
  id          String   @id @default(uuid())
  user        User     @relation(fields: [userId], references: [id])
  userId      String
  title       String
  text        String
  createdAt   DateTime @default(now())
  quizzes     Quiz[]
}

model Quiz {
  id          String   @id @default(uuid())
  document    Document @relation(fields: [documentId], references: [id])
  documentId  String
  score       Int
  createdAt   DateTime @default(now())
  questions   Question[]
}

model Question {
  id          String   @id @default(uuid())
  quiz        Quiz     @relation(fields: [quizId], references: [id])
  quizId      String
  prompt      String
  correct     String
  optionA     String
  optionB     String
  optionC     String
  optionD     String
  userAnswer  String?
}
```


## 11. API Contract Highlights

| Endpoint | Method | Auth | Body / Params | Returns |
|----------|--------|------|---------------|----------|
| /api/generate-quiz | POST | Required | { documentId } | { quizId } once questions are stored |
| /api/submit-quiz | POST | Required | { quizId, answers: {questionId: "A", "B", ...} } | { score, feedback } |
| /api/dashboard | GET | Required | none | [ { quizId, docTitle, score, createdAt } ] |

## 12. Open Questions / Risks
- Cost control for LLM calls — impose token limit or use batching.
- Large PDFs — consider chunking + summarization before question generation.
- Plagiarism / copyright — clarify terms for storing user‑uploaded text.

