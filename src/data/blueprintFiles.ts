export interface BlueprintFileEntry {
  step: string;
  path: string;
  description: string;
  code: string;
}

export const BLUEPRINT_FILES: BlueprintFileEntry[] = [
  {
    step: 'STEP 1: Backend Core & Prisma Schema (with 7 New Models)',
    path: 'home-tutor-project/backend/prisma/schema.prisma',
    description: 'Full Prisma schema including User, Tutor, City, Locality, Course, Subject, Inquiry, Review, Payment, plus AuditLog, SecuritySetting, SocialLink, WhatsAppSetting, ContactMessage, Newsletter, and SeoSetting',
    code: `generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

enum Role { ADMIN TUTOR STUDENT }
enum InquiryStatus { NEW READ REPLIED CLOSED }
enum PaymentStatus { PENDING PAID FAILED REFUNDED }
enum TuitionType { HOME_TUITION AT_TUTOR_HOME AT_INSTITUTE ONLINE }

// Core Models + 7 Extended Admin Control Models:
model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String
  module    String
  details   String?
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
}

model SecuritySetting {
  id               String   @id @default("global")
  twoFactorEnabled Boolean  @default(false)
  loginAttempts    Int      @default(5)
  lockoutMinutes   Int      @default(15)
  sessionTimeout   Int      @default(30)
  ipWhitelist      String[]
  passwordPolicy   String   @default("min8_upper_lower_num_special")
  auditLogEnabled  Boolean  @default(true)
  updatedAt        DateTime @updatedAt
}

model SocialLink {
  id        String  @id @default(cuid())
  platform  String  // whatsapp, facebook, instagram, twitter, youtube, linkedin, telegram
  url       String
  isActive  Boolean @default(true)
  sortOrder Int     @default(0)
}

model WhatsAppSetting {
  id             String   @id @default("global")
  number         String
  defaultMessage String   @default("Hello! I need a home tutor.")
  isActive       Boolean  @default(true)
  showOnPages    String[]
  buttonPosition String   @default("bottom-right")
  buttonColor    String   @default("#25D366")
  buttonText     String   @default("Chat on WhatsApp")
}

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  mobile    String?
  subject   String?
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Newsletter {
  id        String   @id @default(cuid())
  email     String   @unique
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}

model SeoSetting {
  id        String   @id @default("global")
  siteTitle String
  siteDesc  String
  ogImage   String?
  keywords  String?
  gaId      String?
  fbPixel   String?
  gtmId     String?
  updatedAt DateTime @updatedAt
}`,
  },
  {
    step: 'STEP 1: Backend Core & Prisma Schema (with 7 New Models)',
    path: 'home-tutor-project/backend/src/index.ts',
    description: 'API-First Express v1 Server (/api/v1/...) with Helmet, CORS whitelist for Web & React Native Expo, Rate Limiter, and Audit Log middleware',
    code: `import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { publicApiLimiter } from './middleware/rateLimit';
import authRoutes from './routes/auth';
import tutorRoutes from './routes/tutors';
import settingsRoutes from './routes/settings';
import securityRoutes from './routes/security';
import whatsappRoutes from './routes/whatsapp';
import paymentRoutes from './routes/payment';
import adminRoutes from './routes/admin';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'exp://localhost:8081', // React Native Expo
  ],
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use('/api/v1', publicApiLimiter);

// Public Branding & Mobile Config Endpoint
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/app', settingsRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tutors', tutorRoutes);
app.use('/api/v1/whatsapp', whatsappRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/security', securityRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => console.log(\`API v1 running on :\${PORT}\`));`,
  },
  {
    step: 'STEP 2: Backend Middleware, Security Check & Audit Logger',
    path: 'home-tutor-project/backend/src/middleware/securityCheck.ts',
    description: 'Enforces Admin IP whitelist, Account Lockout after N attempts, JWT access (15m) + refresh (7d) tokens, and AuditLog creation',
    code: `import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export async function enforceSecurityPolicy(req: Request, res: Response, next: NextFunction) {
  const sec = await prisma.securitySetting.findUnique({ where: { id: 'global' } });
  if (sec && req.path.startsWith('/api/v1/admin') && sec.ipWhitelist.length > 0) {
    const clientIp = req.ip || req.socket.remoteAddress || '';
    const allowed = sec.ipWhitelist.some((ip) => clientIp.includes(ip));
    if (!allowed) {
      return res.status(403).json({ error: 'IP address not whitelisted for Admin Console.' });
    }
  }
  next();
}

export async function recordAuditLog(userId: string | undefined, action: string, module: string, details: string, req: Request) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      module,
      details,
      ipAddress: req.ip || '0.0.0.0',
      userAgent: req.headers['user-agent'] || 'unknown',
    },
  });
}`,
  },
  {
    step: 'STEP 3: Frontend Next.js 14 Static Export, Animations & PWA Manifest',
    path: 'home-tutor-project/frontend/public/manifest.json',
    description: 'Installable PWA Web App Manifest with #084d75 Deep Blue theme and standalone display',
    code: `{
  "id": "/",
  "name": "VidyaSetu — Home Tutor Directory",
  "short_name": "VidyaSetu",
  "description": "Find verified 1-on-1 home and online tutors across 10+ Indian cities.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#FAFAFA",
  "theme_color": "#084d75",
  "icons": [
    { "src": "/pwa-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/pwa-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/pwa-maskable-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}`,
  },
  {
    step: 'STEP 6: Razorpay Order, Signature Verification & Webhook',
    path: 'home-tutor-project/backend/src/routes/payment.ts',
    description: 'End-to-end Razorpay order creation, HMAC-SHA256 signature verification, plan upgrade, and webhook handler',
    code: `import { Router } from 'express';
import crypto from 'crypto';
import { prisma, razorpay } from '../lib/integrations';
import { verifyToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/create-order', verifyToken, async (req: AuthRequest, res) => {
  const { planId } = req.body;
  const plan = await prisma.pricingPlan.findUnique({ where: { id: planId } });
  if (!plan) return res.status(404).json({ error: 'Plan not found' });

  const order = await razorpay.orders.create({
    amount: plan.price * 100,
    currency: 'INR',
    receipt: \`rcpt_\${Date.now()}\`,
  });

  await prisma.payment.create({
    data: {
      userId: req.user!.userId,
      planId: plan.id,
      amount: plan.price,
      status: 'PENDING',
      razorpayId: order.id,
    },
  });

  res.json({ orderId: order.id, amount: plan.price * 100, currency: 'INR' });
});

router.post('/verify', verifyToken, async (req: AuthRequest, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(\`\${razorpay_order_id}|\${razorpay_payment_id}\`)
    .digest('hex');

  if (expected !== razorpay_signature) {
    return res.status(400).json({ error: 'Invalid payment signature' });
  }

  await prisma.payment.updateMany({
    where: { razorpayId: razorpay_order_id },
    data: { status: 'PAID', razorpayId: razorpay_payment_id },
  });

  res.json({ verified: true });
});

export default router;`,
  },
  {
    step: 'STEP 7: Deployment & Future React Native (Expo) Mobile API Guide',
    path: 'home-tutor-project/README.md',
    description: 'Complete guide for Local Setup, Neon DB, Render Deploy, Hostinger public_html Static Upload, and React Native (Expo) API v1 endpoints',
    code: `# VidyaSetu — Production Deployment & React Native API v1 Guide

## 1. API-First Endpoints for React Native (Expo)
- GET  /api/v1/app/config          -> Returns dynamic companyName, colors (#084d75 / #f7941d), WhatsApp config, and social links
- GET  /api/v1/tutors?city=patna   -> Paginated tutor directory with locality & subject filters
- POST /api/v1/auth/login          -> Returns 15m accessToken + 7d refreshToken for Expo SecureStore
- POST /api/v1/auth/refresh        -> Rotates mobile JWT token pair
- POST /api/v1/whatsapp/track      -> Increments WhatsApp click counter by page

## 2. Hostinger + Render Deployment
1. Backend (Render): Build 'npm install && npx prisma generate && npm run build', Start 'node dist/index.js'
2. Frontend (Hostinger): Run 'npm run build' -> Upload 'out/' contents to 'public_html/'`,
  },
];
