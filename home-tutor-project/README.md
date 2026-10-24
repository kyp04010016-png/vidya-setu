# Home Tutor Directory + 20-Module Admin & Asmuth Console

Complete full-stack architecture and deployment guide for **VidyaSetu Home Tutor Directory**.

---

## 1. Architecture Overview
- **Frontend (`frontend/`)**: Next.js 14 (App Router, TypeScript, static export `output: 'export'`, `images.unoptimized: true`, `trailingSlash: true`) + Tailwind CSS + shadcn/ui + TipTap + DOMPurify.
- **Backend (`backend/`)**: Node.js + Express + TypeScript + Prisma ORM + Zod + JWT (`jsonwebtoken`) + `bcryptjs` (12 salt rounds) + Helmet + Express-Rate-Limit + Cloudinary + Razorpay + Nodemailer.
- **Live Cloud Persistence**: Provisioned with Firebase Firestore + Google OAuth + Zero-Trust ABAC Security Rules (`firestore.rules`) + Asmuth Admin Real-Time Activity & Backup Engine.

---

## 2. Local Development Setup

### Step A: Database (Neon / Supabase PostgreSQL)
1. Create a PostgreSQL 16 database on [Neon.tech](https://neon.tech) or Supabase.
2. Copy the pooled connection URI into `backend/.env`.

### Step B: Backend Setup (`:5000`)
```bash
cd home-tutor-project/backend
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

### Step C: Frontend Setup (`:3000`)
```bash
cd home-tutor-project/frontend
npm install
npm run dev
```

---

## 3. Production Deployment Flow

### Backend Deploy (Render.com / Railway)
- **Root Directory**: `backend`
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `node dist/index.js`
- **Environment Variables**:
  - `PORT=5000`
  - `JWT_SECRET=<64-char-random-hex>`
  - `FRONTEND_URL=https://yourdomain.com`
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
  - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

### Frontend Deploy (Hostinger Shared Hosting Static Export)
1. Set `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api` in `frontend/.env.production`.
2. Build static bundle:
   ```bash
   cd home-tutor-project/frontend
   npm run build
   ```
3. Upload the generated `out/` folder contents directly to Hostinger `public_html/` via File Manager or FTP.
4. Add `.htaccess` in `public_html/` for clean trailing-slash fallback routing and HTTPS enforcement.

---

## 4. Default Seed Credentials
- **Super Admin**: `admin@example.com` / `Admin@123`
- **Sample Tutor**: `rajeshwar.verma@example.com` / `Tutor@123`
- **Sample Student/Parent**: `rakesh.sharma@example.com` / `Student@123`

---

## 5. Security & Testing Checklist
- [x] `bcryptjs` password hashing with 12 salt rounds
- [x] Role-based JWT verification (`verifyToken` + `checkRole(['ADMIN', 'TUTOR', 'STUDENT'])`)
- [x] Rate limiting (`5 req/min` on `/api/auth/login`, `100 req/min` on public APIs)
- [x] Zod request body & query validation across all endpoints
- [x] Razorpay HMAC-SHA256 webhook & payment signature verification
- [x] Cloudinary signed upload presets with MIME/size validation (`<= 2MB`)
- [x] Asmuth Admin Panel with real-time user activity stream & SHA-256 JSON/CSV data backup and restore
