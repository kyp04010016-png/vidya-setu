export type Role = 'ADMIN' | 'TUTOR' | 'STUDENT';
export type InquiryStatus = 'NEW' | 'READ' | 'REPLIED' | 'CLOSED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type TuitionType = 'HOME_TUITION' | 'AT_TUTOR_HOME' | 'AT_INSTITUTE' | 'ONLINE';

export interface CityItem {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  localities: string[];
}

export interface CourseItem {
  id: string;
  name: string;
  isActive: boolean;
}

export interface SubjectItem {
  id: string;
  name: string;
  isActive: boolean;
}

export interface TutorItem {
  id: string;
  userId: string;
  name: string;
  slug: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  experienceYrs: number;
  qualification: string;
  bio: string;
  hourlyRate: number;
  monthlyRate?: number;
  minDurationMonths?: number;
  country?: string;
  state?: string;
  cityId: string;
  cityName: string;
  blockName?: string;
  localityName: string;
  tuitionType: TuitionType;
  isFeatured: boolean;
  isApproved: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLogin: string;
  createdAt: string;
  courses: string[];
  subjects: string[];
  ratingAvg: number;
  reviewCount: number;
  avatarSvgBg: string;
  initials: string;
  avatarUrl?: string;
  photoUrl?: string;
  tutorNumericId?: string;
  pincode?: string;
  preferredTime?: string;
  memberSince?: string;
  categories?: string;
  phone?: string;
  email?: string;
  address?: string;
  modes?: {
    studentHome: boolean;
    tutorHome: boolean;
    institute: boolean;
    online: boolean;
  };
  // Confidential Bank Account Details (Strictly Visible ONLY to Owner Admin & the Teacher)
  bankAccountHolder?: string;
  bankAccountNumber?: string;
  bankIfscCode?: string;
  bankName?: string;
  upiId?: string;
  // Auto-Generated Account Credentials & Time Slots
  loginUserId?: string;
  loginPassword?: string;
  batchTimeSlots?: string[];
}

export interface InquiryItem {
  id: string;
  tutorId: string;
  tutorUserId: string;
  tutorName: string;
  userId: string;
  name: string;
  email: string;
  mobile: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  tutorId: string;
  tutorName: string;
  userId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface RequirementItem {
  id: string;
  userId: string;
  studentName: string;
  studentPhone?: string;
  cityId: string;
  cityName: string;
  locality: string;
  localityName?: string;
  course: string;
  courseName?: string;
  subjects: string;
  subjectName?: string;
  budget: number;
  message: string;
  notes?: string;
  status: 'OPEN' | 'ASSIGNED' | 'CLOSED';
  studyMode?: 'ONLINE' | 'OFFLINE' | 'BOTH';
  assignedTutorName?: string;
  createdAt: string;
}

export interface PricingPlanItem {
  id: string;
  name: string;
  audience: string;
  price: number;
  durationDays: number;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
}

export interface PaymentItem {
  id: string;
  userId: string;
  userName: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  razorpayId: string;
  createdAt: string;
}

export interface PageCMSItem {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle: string;
  metaDesc: string;
  isActive: boolean;
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  link: string;
  isActive: boolean;
  sortOrder: number;
  imageUrl?: string;
  ctaText?: string;
  ctaAction?: 'find-tutor' | 'join-tutor' | 'online-tuition' | 'post-requirement';
  animationStyle?: 'ken-burns' | 'slide' | 'fade-zoom';
  badgeText?: string;
}

export interface AdminCredentialsItem {
  adminId: string;
  ownerEmail: string;
  adminPassword: string;
}

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  isPublished: boolean;
  createdAt: string;
}

export interface EmailTemplateItem {
  id: string;
  key: string;
  subject: string;
  body: string;
}

export interface UserDirectoryItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  mobile: string;
  role: Role;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  lastActivity: string;
  country?: string;
  state?: string;
  districtId?: string;
  districtName?: string;
  blockName?: string;
  localityName?: string;
  pincode?: string;
  address?: string;
  loginUserId?: string;
  loginPassword?: string;
  isLoginActive?: boolean;
  avatarUrl?: string;
}

export interface SubscribedStudentItem {
  id: string;
  tutorId: string;
  tutorName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentMobile: string;
  districtName: string;
  localityName: string;
  course: string;
  subjects: string;
  batchTiming: string;
  monthlyFee: number;
  isLoginActive: boolean;
  lastSeenText: string;
  attendanceToday: 'PRESENT' | 'ABSENT' | 'UNMARKED';
  presentDaysCount: number;
  absentDaysCount: number;
  studyMode?: 'ONLINE' | 'OFFLINE' | 'BOTH';
  avatarUrl?: string;
  subscribedAt: string;
}

export interface StudentAchieverItem {
  id: string;
  studentName: string;
  studentPhoto: string;
  districtName: string;
  blockName: string;
  className: string;
  achievementTitle: string;
  scoreBadge: string;
  tutorId?: string;
  tutorName: string;
  studyMode: 'ONLINE' | 'OFFLINE' | 'BOTH';
  feedbackText: string;
  rating: number;
  achievedDate: string;
  isApproved: boolean;
  isFeatured: boolean;
}

export interface OnlineClassSessionItem {
  id: string;
  tutorId: string;
  tutorName: string;
  title: string;
  subject: string;
  course: string;
  platform: 'ZOOM' | 'GOOGLE_MEET' | 'GOOGLE_CLASSROOM' | 'IN_APP_LIVE';
  meetingUrl: string;
  meetingId: string;
  passcode: string;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  batchTiming: string;
  status: 'UPCOMING' | 'LIVE_NOW' | 'COMPLETED';
  notifiedCount: number;
  lastBroadcastAt?: string;
  createdAt: string;
}

export interface TutorTaskItem {
  id: string;
  tutorId: string;
  tutorName: string;
  uploadedByRole: 'TUTOR' | 'STUDENT';
  uploadedByName: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  dueTime: string;
  maxMarks: number;
  attachmentUrl?: string;
  submittedStudentIds: string[];
  studentSubmissions: {
    studentId: string;
    studentName: string;
    answerText: string;
    submittedAt: string;
  }[];
  createdAt: string;
}

export interface TeacherPayoutItem {
  id: string;
  tutorId: string;
  tutorName: string;
  bankAccountHolder: string;
  bankName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  upiId?: string;
  amount: number;
  monthLabel: string;
  utrNumber: string;
  status: 'PAID' | 'PENDING';
  paidAt: string;
}

export interface PromoOfferItem {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  couponCode: string;
  discountText: string;
  validUntil: string;
  ctaText: string;
  isActive: boolean;
  createdAt?: string;
}

export interface ActivityEventItem {
  id: string;
  actorName: string;
  actorRole: Role;
  action: string;
  target: string;
  timestamp: string;
  severity: 'NOMINAL' | 'WARNING' | 'SECURITY';
}

export interface AuditLogItem {
  id: string;
  userId: string;
  actorName: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface SecuritySettingItem {
  twoFactorEnabled: boolean;
  loginAttempts: number;
  lockoutMinutes: number;
  sessionTimeout: number;
  ipWhitelist: string[];
  passwordPolicy: string;
  auditLogEnabled: boolean;
  publicRegistrationEnabled: boolean;
  guestInquiriesEnabled: boolean;
  autoApproveReviews: boolean;
  recaptchaEnabled: boolean;
  recaptchaSiteKey: string;
  sslEnforced: boolean;
  rateLimitPerMin: number;
}

export interface SocialLinkItem {
  id: string;
  platform: 'whatsapp' | 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'linkedin' | 'telegram';
  url: string;
  isActive: boolean;
  sortOrder: number;
}

export interface WhatsAppSettingItem {
  number: string;
  defaultMessage: string;
  isActive: boolean;
  showOnPages: string[];
  buttonPosition: 'bottom-right' | 'bottom-left';
  buttonColor: string;
  buttonText: string;
  totalClicks: number;
  clicksByPage: Record<string, number>;
}

export interface CompanyBrandingItem {
  companyName: string;
  tagline: string;
  logoUrl?: string;
  showLogoText?: boolean;
  logoHeightPx?: number;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  footerCopyright: string;
  primaryColor: string;
  accentColor: string;
  darkMode: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

export interface PaymentConfigItem {
  razorpayKeyId: string;
  razorpayKeySecret: string;
  stripePublishableKey: string;
  testMode: boolean;
  currency: 'INR' | 'USD';
  gstPercent: number;
  userContactUnlockPrice: number;
  userUnlimitedPassPrice: number;
  userPassDurationMonths: number;
  studentRegistrationFee: number;
}

export interface SeoSettingItem {
  siteTitle: string;
  siteDesc: string;
  keywords: string;
  gaId: string;
  fbPixel: string;
  gtmId: string;
}

export const INITIAL_ADMIN_CREDENTIALS: AdminCredentialsItem = {
  adminId: 'admin',
  ownerEmail: 'kyp04010016@gmail.com',
  adminPassword: 'admin123',
};

export const INITIAL_BRANDING: CompanyBrandingItem = {
  companyName: 'VidyaSetu',
  tagline: 'Verified 1-on-1 Home & Online Tutor Directory Across Bihar & India',
  logoUrl: '',
  showLogoText: true,
  logoHeightPx: 40,
  contactEmail: 'support@vidyasetu.in',
  contactPhone: '+91 99001 12233',
  officeAddress: '4th Floor, Academic Tower, Boring Road Crossing, Patna & Connaught Place, New Delhi',
  footerCopyright: '© 2026 VidyaSetu Education Pvt. Ltd. All rights reserved.',
  primaryColor: '#084d75',
  accentColor: '#f7941d',
  darkMode: false,
  maintenanceMode: false,
  maintenanceMessage: 'Scheduled database optimization in progress. We will be back online shortly.',
};

export const INITIAL_WHATSAPP_SETTING: WhatsAppSettingItem = {
  number: '919900112233',
  defaultMessage: 'Hello! I need a verified home tutor from VidyaSetu.',
  isActive: true,
  showOnPages: ['home', 'listing', 'profile', 'contact', 'blog'],
  buttonPosition: 'bottom-right',
  buttonColor: '#25D366',
  buttonText: 'Chat on WhatsApp',
  totalClicks: 148,
  clicksByPage: {
    home: 62,
    listing: 34,
    profile: 41,
    contact: 11,
  },
};

export const INITIAL_SOCIAL_LINKS: SocialLinkItem[] = [
  { id: 'soc-1', platform: 'whatsapp', url: 'https://wa.me/919900112233', isActive: true, sortOrder: 1 },
  { id: 'soc-2', platform: 'facebook', url: 'https://facebook.com/vidyasetututors', isActive: true, sortOrder: 2 },
  { id: 'soc-3', platform: 'instagram', url: 'https://instagram.com/vidyasetututors', isActive: true, sortOrder: 3 },
  { id: 'soc-4', platform: 'twitter', url: 'https://x.com/vidyasetu', isActive: true, sortOrder: 4 },
  { id: 'soc-5', platform: 'youtube', url: 'https://youtube.com/@vidyasetu', isActive: true, sortOrder: 5 },
  { id: 'soc-6', platform: 'linkedin', url: 'https://linkedin.com/company/vidyasetu', isActive: true, sortOrder: 6 },
  { id: 'soc-7', platform: 'telegram', url: 'https://t.me/vidyasetututors', isActive: true, sortOrder: 7 },
];

export const INITIAL_SECURITY_SETTINGS: SecuritySettingItem = {
  twoFactorEnabled: true,
  loginAttempts: 5,
  lockoutMinutes: 15,
  sessionTimeout: 30,
  ipWhitelist: ['127.0.0.1', '103.21.244.0/22'],
  passwordPolicy: 'min8_upper_lower_num_special',
  auditLogEnabled: true,
  publicRegistrationEnabled: true,
  guestInquiriesEnabled: true,
  autoApproveReviews: false,
  recaptchaEnabled: true,
  recaptchaSiteKey: '6LcVidyaSetu_v3_SiteKey992',
  sslEnforced: true,
  rateLimitPerMin: 100,
};

export const INITIAL_PAYMENT_CONFIG: PaymentConfigItem = {
  razorpayKeyId: 'rzp_test_VidyaSetu9921X',
  razorpayKeySecret: '••••••••••••••••••••',
  stripePublishableKey: 'pk_test_51VidyaSetuGlobal',
  testMode: true,
  currency: 'INR',
  gstPercent: 18,
  userContactUnlockPrice: 99,
  userUnlimitedPassPrice: 499,
  userPassDurationMonths: 3,
  studentRegistrationFee: 0,
};

export const INITIAL_SEO_SETTINGS: SeoSettingItem = {
  siteTitle: 'VidyaSetu — Find Verified Home Tutors in All 38 Bihar Districts & Across India',
  siteDesc: 'Connect with degree-verified 1-on-1 home and online tutors for CBSE, ICSE, BSEB, IIT-JEE, and NEET. Book a free diagnostic trial session today.',
  keywords: 'home tutor, private tuition, JEE physics tutor, CBSE maths tutor, Patna home tutor, Bihar 38 districts home tutor',
  gaId: 'G-VIDYASETU2026',
  fbPixel: '88291044312',
  gtmId: 'GTM-K99VSETU',
};

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-1',
    userId: 'u-admin-1',
    actorName: 'Super Admin (Owner)',
    action: 'UPDATED_SECURITY_POLICY',
    module: 'Security Control Panel',
    details: 'Enforced Dual-Channel Mobile + Email OTP on Login & Signup',
    ipAddress: '103.21.244.18',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5)',
    createdAt: '2026-10-24T08:15:00Z',
  },
  {
    id: 'aud-2',
    userId: 'u-admin-1',
    actorName: 'Super Admin (Owner)',
    action: 'APPROVED_TUTOR_PROFILE',
    module: 'Tutors Directory',
    details: 'Verified Ph.D. certificate for Dr. Rajeshwar Verma (Patna)',
    ipAddress: '103.21.244.18',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5)',
    createdAt: '2026-10-24T07:50:00Z',
  },
  {
    id: 'aud-3',
    userId: 'u-tutor-2',
    actorName: 'Priya Nair',
    action: 'RAZORPAY_PAYMENT_VERIFIED',
    module: 'Payments & Plans',
    details: 'HMAC-SHA256 verified for Gold Master Mentor (pay_P9yTrW44mK81zL)',
    ipAddress: '49.205.112.94',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4)',
    createdAt: '2026-10-24T06:30:00Z',
  },
  {
    id: 'aud-4',
    userId: 'u-admin-1',
    actorName: 'Super Admin (Owner)',
    action: 'CREATED_ASMUTH_CLOUD_BACKUP',
    module: 'Asmuth Backup Vault',
    details: 'Committed full snapshot sha256_9f84c2e1b704a31d to Firestore',
    ipAddress: '103.21.244.18',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5)',
    createdAt: '2026-10-24T05:10:00Z',
  },
];

export const BIHAR_ALL_38_DISTRICTS: Array<{ id: string; name: string; defaultPincode: string; sampleBlocks: string[] }> = [
  { id: 'patna', name: 'Patna (Bihar)', defaultPincode: '800001', sampleBlocks: ['Patna Sadar', 'Danapur', 'Phulwari Sharif', 'Bihta', 'Sampatchak', 'Maner', 'Barh', 'Fatuha', 'Masaurhi', 'Paliganj', 'Bakhtiyarpur', 'Mokama'] },
  { id: 'araria', name: 'Araria (Bihar)', defaultPincode: '854311', sampleBlocks: ['Araria', 'Forbesganj', 'Jokihat', 'Narpatganj', 'Raniganj', 'Sikti'] },
  { id: 'arwal', name: 'Arwal (Bihar)', defaultPincode: '804401', sampleBlocks: ['Arwal', 'Karpi', 'Kaler', 'Kurtha', 'Sonbhadra Banshi'] },
  { id: 'aurangabad', name: 'Aurangabad (Bihar)', defaultPincode: '824101', sampleBlocks: ['Aurangabad', 'Daudnagar', 'Nabinagar', 'Obra', 'Rafiganj', 'Barun'] },
  { id: 'banka', name: 'Banka (Bihar)', defaultPincode: '813102', sampleBlocks: ['Banka', 'Amarpur', 'Bounsi', 'Belhar', 'Katoria', 'Rajoun'] },
  { id: 'begusarai', name: 'Begusarai (Bihar)', defaultPincode: '851101', sampleBlocks: ['Begusarai', 'Barauni', 'Teghra', 'Ballia', 'Bakhri', 'Matihani'] },
  { id: 'bhagalpur', name: 'Bhagalpur (Bihar)', defaultPincode: '812001', sampleBlocks: ['Jagdishpur (Bhagalpur)', 'Nathnagar', 'Sabour', 'Kahalgaon', 'Sultanganj', 'Naugachhia'] },
  { id: 'bhojpur', name: 'Bhojpur - Ara (Bihar)', defaultPincode: '802301', sampleBlocks: ['Ara Sadar', 'Koilwar', 'Jagdishpur', 'Piro', 'Bihiya', 'Shahpur'] },
  { id: 'buxar', name: 'Buxar (Bihar)', defaultPincode: '802101', sampleBlocks: ['Buxar', 'Dumraon', 'Itarhi', 'Rajpur', 'Simri', 'Brahmpur'] },
  { id: 'darbhanga', name: 'Darbhanga (Bihar)', defaultPincode: '846004', sampleBlocks: ['Darbhanga Sadar', 'Bahadurpur', 'Benipur', 'Jale', 'Keoti', 'Singhwara', 'Biraul'] },
  { id: 'east-champaran', name: 'East Champaran - Motihari (Bihar)', defaultPincode: '845401', sampleBlocks: ['Motihari', 'Raxaul', 'Chakia', 'Areraj', 'Dhaka', 'Pakridayal', 'Sugauli'] },
  { id: 'gaya', name: 'Gaya (Bihar)', defaultPincode: '823001', sampleBlocks: ['Gaya Town CD Block', 'Bodh Gaya', 'Manpur', 'Tekari', 'Sherghati', 'Belaganj', 'Wazirganj'] },
  { id: 'gopalganj', name: 'Gopalganj (Bihar)', defaultPincode: '841428', sampleBlocks: ['Gopalganj', 'Hathua', 'Barauli', 'Kuchaikote', 'Mirganj', 'Thawe'] },
  { id: 'jamui', name: 'Jamui (Bihar)', defaultPincode: '811307', sampleBlocks: ['Jamui', 'Jhajha', 'Sikandra', 'Chakai', 'Gidhaur', 'Khaira'] },
  { id: 'jehanabad', name: 'Jehanabad (Bihar)', defaultPincode: '804408', sampleBlocks: ['Jehanabad', 'Makhdumpur', 'Kako', 'Ghoshi', 'Hulasganj'] },
  { id: 'kaimur', name: 'Kaimur - Bhabua (Bihar)', defaultPincode: '821101', sampleBlocks: ['Bhabua', 'Mohania', 'Ramgarh', 'Chainpur', 'Kudra', 'Durgawati'] },
  { id: 'katihar', name: 'Katihar (Bihar)', defaultPincode: '854105', sampleBlocks: ['Katihar', 'Barari', 'Kadwa', 'Manihari', 'Korha', 'Pranpur'] },
  { id: 'khagaria', name: 'Khagaria (Bihar)', defaultPincode: '851204', sampleBlocks: ['Khagaria', 'Gogri', 'Alauli', 'Parbatta', 'Mansi', 'Chautham'] },
  { id: 'kishanganj', name: 'Kishanganj (Bihar)', defaultPincode: '855107', sampleBlocks: ['Kishanganj', 'Bahadurganj', 'Thakurganj', 'Kochadhaman', 'Pothia'] },
  { id: 'lakhisarai', name: 'Lakhisarai (Bihar)', defaultPincode: '811311', sampleBlocks: ['Lakhisarai', 'Barahiya', 'Surajgarha', 'Halsi', 'Pipariya'] },
  { id: 'madhepura', name: 'Madhepura (Bihar)', defaultPincode: '852113', sampleBlocks: ['Madhepura', 'Murliganj', 'Singheshwar', 'Uda Kishunganj', 'Bihariganj'] },
  { id: 'madhubani', name: 'Madhubani (Bihar)', defaultPincode: '847211', sampleBlocks: ['Rahika (Madhubani)', 'Jhanjharpur', 'Benipatti', 'Jainagar', 'Pandaul', 'Phulparas'] },
  { id: 'munger', name: 'Munger (Bihar)', defaultPincode: '811201', sampleBlocks: ['Munger Sadar', 'Jamalpur', 'Kharagpur', 'Tarapur', 'Bariarpur'] },
  { id: 'muzaffarpur', name: 'Muzaffarpur (Bihar)', defaultPincode: '842001', sampleBlocks: ['Musahari (Muzaffarpur)', 'Kanti', 'Kurhani', 'Motipur', 'Sakra', 'Bochaha', 'Minapur'] },
  { id: 'nalanda', name: 'Nalanda - Bihar Sharif (Bihar)', defaultPincode: '803101', sampleBlocks: ['Bihar Sharif', 'Rajgir', 'Hilsa', 'Islampur', 'Harnaut', 'Noorsarai', 'Silao'] },
  { id: 'nawada', name: 'Nawada (Bihar)', defaultPincode: '805110', sampleBlocks: ['Nawada', 'Rajauli', 'Warsaliganj', 'Hisua', 'Pakribarawan'] },
  { id: 'purnia', name: 'Purnia (Bihar)', defaultPincode: '854301', sampleBlocks: ['Purnia East', 'Kasba', 'Banmankhi', 'Dhamdaha', 'Baisi', 'Rupauli'] },
  { id: 'rohtas', name: 'Rohtas - Sasaram (Bihar)', defaultPincode: '821115', sampleBlocks: ['Sasaram', 'Dehri', 'Bikramganj', 'Nokha', 'Kochas', 'Nasriganj'] },
  { id: 'saharsa', name: 'Saharsa (Bihar)', defaultPincode: '852201', sampleBlocks: ['Kahara (Saharsa)', 'Simri Bakhtiarpur', 'Sonbarsa', 'Saur Bazar', 'Mahishi'] },
  { id: 'samastipur', name: 'Samastipur (Bihar)', defaultPincode: '848101', sampleBlocks: ['Samastipur', 'Dalsinghsarai', 'Rosera', 'Patori', 'Kalyanpur', 'Tajpur', 'Pusa'] },
  { id: 'saran', name: 'Saran - Chapra (Bihar)', defaultPincode: '841301', sampleBlocks: ['Chapra', 'Sonpur', 'Marhaura', 'Dighwara', 'Garkha', 'Revelganj', 'Parsa'] },
  { id: 'sheikhpura', name: 'Sheikhpura (Bihar)', defaultPincode: '811105', sampleBlocks: ['Sheikhpura', 'Barbigha', 'Ariari', 'Shekhopur Sarai', 'Chewara'] },
  { id: 'sheohar', name: 'Sheohar (Bihar)', defaultPincode: '843329', sampleBlocks: ['Sheohar', 'Piprarhi', 'Purnahiya', 'Dumri Katsari', 'Tariani Chowk'] },
  { id: 'sitamarhi', name: 'Sitamarhi (Bihar)', defaultPincode: '843302', sampleBlocks: ['Dumra (Sitamarhi)', 'Pupri', 'Belsand', 'Riga', 'Sursand', 'Runnisaidpur'] },
  { id: 'siwan', name: 'Siwan (Bihar)', defaultPincode: '841226', sampleBlocks: ['Siwan Sadar', 'Maharajganj', 'Mairwa', 'Raghunathpur', 'Barharia', 'Andar'] },
  { id: 'supaul', name: 'Supaul (Bihar)', defaultPincode: '852131', sampleBlocks: ['Supaul', 'Birpur (Basantpur)', 'Triveniganj', 'Nirmali', 'Raghopur', 'Pipra'] },
  { id: 'vaishali', name: 'Vaishali - Hajipur (Bihar)', defaultPincode: '844101', sampleBlocks: ['Hajipur', 'Mahnar', 'Mahua', 'Lalganj', 'Raghopur', 'Bidupur', 'Vaishali'] },
  { id: 'west-champaran', name: 'West Champaran - Bettiah (Bihar)', defaultPincode: '845438', sampleBlocks: ['Bettiah', 'Bagaha', 'Narkatiaganj', 'Chanpatia', 'Lauriya', 'Ramnagar'] },
];

export const INITIAL_CITIES: CityItem[] = [
  ...BIHAR_ALL_38_DISTRICTS.map((dist) => ({
    id: dist.id,
    name: dist.name,
    slug: dist.id,
    isActive: true,
    localities:
      dist.id === 'patna'
        ? [
            'Danapur',
            'Patna',
            'Patna city',
            'Mithila colony',
            'Kumhrar',
            'Phulwari',
            'Boring Road',
            'Kankarbagh',
            'Bailey Road',
            'Rajendra Nagar',
            'Patliputra Colony',
            'Bihta',
            'Sampatchak',
          ]
        : dist.sampleBlocks,
  })),
  { id: 'delhi', name: 'Delhi (India)', slug: 'delhi', isActive: true, localities: ['South Extension', 'Dwarka', 'Rohini', 'Vasant Kunj', 'Lajpat Nagar'] },
  { id: 'mumbai', name: 'Mumbai (India)', slug: 'mumbai', isActive: true, localities: ['Andheri West', 'Bandra', 'Powai', 'Juhu', 'Dadar'] },
  { id: 'bengaluru', name: 'Bengaluru (India)', slug: 'bengaluru', isActive: true, localities: ['Indiranagar', 'Koramangala', 'Whitefield', 'Jayanagar', 'HSR Layout'] },
  { id: 'kolkata', name: 'Kolkata (India)', slug: 'kolkata', isActive: true, localities: ['Salt Lake', 'Ballygunge', 'New Town', 'Park Street', 'Alipore'] },
  { id: 'pune', name: 'Pune (India)', slug: 'pune', isActive: true, localities: ['Kothrud', 'Viman Nagar', 'Baner', 'Wakad', 'Aundh'] },
  { id: 'lucknow', name: 'Lucknow (India)', slug: 'lucknow', isActive: true, localities: ['Gomti Nagar', 'Hazratganj', 'Indira Nagar', 'Aliganj', 'Mahanagar'] },
  { id: 'jaipur', name: 'Jaipur (India)', slug: 'jaipur', isActive: true, localities: ['Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'C-Scheme', 'Raja Park'] },
  { id: 'hyderabad', name: 'Hyderabad (India)', slug: 'hyderabad', isActive: true, localities: ['Banjara Hills', 'Madhapur', 'Gachibowli', 'Jubilee Hills', 'Kukatpally'] },
  { id: 'chennai', name: 'Chennai (India)', slug: 'chennai', isActive: true, localities: ['Adyar', 'Anna Nagar', 'T. Nagar', 'Velachery', 'Mylapore'] },
];

export const INITIAL_COURSES: CourseItem[] = [
  { id: 'c1', name: 'Class 1 to 5 (Primary)', isActive: true },
  { id: 'c2', name: 'Class 6 to 8 (Middle School)', isActive: true },
  { id: 'c3', name: 'Class 9 & 10 (CBSE / ICSE)', isActive: true },
  { id: 'c4', name: 'Class 11 & 12 (Science - PCM/PCB)', isActive: true },
  { id: 'c5', name: 'Class 11 & 12 (Commerce & Humanities)', isActive: true },
  { id: 'c6', name: 'IIT-JEE Main & Advanced', isActive: true },
  { id: 'c7', name: 'NEET UG Medical Prep', isActive: true },
  { id: 'c8', name: 'B.Tech / Engineering Subjects', isActive: true },
  { id: 'c9', name: 'CUET & Competitive Exams', isActive: true },
  { id: 'c10', name: 'Spoken English & IELTS', isActive: true },
];

export const INITIAL_SUBJECTS: SubjectItem[] = [
  { id: 's1', name: 'Mathematics', isActive: true },
  { id: 's2', name: 'Physics', isActive: true },
  { id: 's3', name: 'Chemistry', isActive: true },
  { id: 's4', name: 'Biology', isActive: true },
  { id: 's5', name: 'English Literature & Grammar', isActive: true },
  { id: 's6', name: 'Computer Science & Python', isActive: true },
  { id: 's7', name: 'Accountancy', isActive: true },
  { id: 's8', name: 'Economics', isActive: true },
  { id: 's9', name: 'Hindi & Sanskrit', isActive: true },
  { id: 's10', name: 'History & Political Science', isActive: true },
  { id: 's11', name: 'Geography', isActive: true },
  { id: 's12', name: 'Business Studies', isActive: true },
  { id: 's13', name: 'Quantitative Aptitude', isActive: true },
  { id: 's14', name: 'French & Foreign Languages', isActive: true },
];

export const INITIAL_TUTORS: TutorItem[] = [
  {
    id: 'tutor-bihar-1',
    userId: 'u-bihar-1',
    name: 'Sanjeev Kumar',
    slug: 'sanjeev-kumar-danapur-patna',
    age: 41,
    gender: 'Male',
    experienceYrs: 7,
    qualification: 'Bsc',
    bio: 'I am a home tutor in Patna and I teach students at their home/ online. I am looking for students who are looking for home tutors in Patna for getting tuition at their home or online. I teach Class 6 to 10 CBSE and expert in Math, physics, chemistry . I have 7 years experience in teaching and my home tutoring experience helps me in helping the students to understand the concepts and learn better. If you need a home tutor in Patna then please dont hesitate to contact me.',
    hourlyRate: 300,
    monthlyRate: 3500,
    minDurationMonths: 3,
    country: 'India',
    state: 'Bihar',
    cityId: 'patna',
    cityName: 'Patna',
    blockName: 'Danapur',
    localityName: 'Danapur',
    tuitionType: 'HOME_TUITION',
    isFeatured: true,
    isApproved: true,
    emailVerified: false,
    phoneVerified: true,
    lastLogin: '24-Oct-26',
    createdAt: '2026-10-23T09:00:00Z',
    courses: ['Class 6 to 10 CBSE'],
    subjects: ['Math, physics, chemistry'],
    ratingAvg: 4.9,
    reviewCount: 28,
    avatarSvgBg: '#4a89dc',
    initials: 'S',
    tutorNumericId: '1584150',
    pincode: '801503',
    preferredTime: 'AnyTime',
    memberSince: 'May 2025',
    categories: 'Class 6 to 10',
    phone: '+91 94310 58415',
    email: 'sanjeev.danapur@vidyasetu.in',
    address: '#102, Gola Road Crossing, Danapur, Patna - 801503',
    modes: {
      studentHome: true,
      tutorHome: false,
      institute: false,
      online: true,
    },
    bankAccountHolder: 'Sanjeev Kumar',
    bankAccountNumber: '38941205541',
    bankIfscCode: 'SBIN0001521',
    bankName: 'State Bank of India (Danapur Branch)',
    upiId: 'sanjeev.danapur@sbi',
    loginUserId: 'TCH-1584150',
    batchTimeSlots: [
      '07:00 AM - 08:30 AM (Morning Batch)',
      '04:00 PM - 05:30 PM (Evening Batch 1)',
      '06:00 PM - 07:30 PM (Evening Batch 2 - Online Zoom)',
    ],
  },
  {
    id: 'tutor-bihar-2',
    userId: 'u-bihar-2',
    name: 'Pramjeet Singh',
    slug: 'pramjeet-singh-patna',
    age: 25,
    gender: 'Male',
    experienceYrs: 5,
    qualification: 'Bsc',
    bio: 'I am a home tutor in Patna and I teach students at their home/ online. I am looking for students who are looking for home tutors in Patna for getting tuition at their home or online. I teach Class 7th to 10th and expert in All subject . I have 5 years experience in teaching and my home tutoring experience helps me in helping the students to understand the concepts and learn better.',
    hourlyRate: 300,
    monthlyRate: 3200,
    minDurationMonths: 3,
    country: 'India',
    state: 'Bihar',
    cityId: 'patna',
    cityName: 'Patna',
    blockName: 'Patna Sadar',
    localityName: 'Patna',
    tuitionType: 'HOME_TUITION',
    isFeatured: true,
    isApproved: true,
    emailVerified: true,
    phoneVerified: true,
    lastLogin: '23-Oct-26',
    createdAt: '2026-10-23T08:30:00Z',
    courses: ['Class 7th to 10th'],
    subjects: ['All subject'],
    ratingAvg: 4.8,
    reviewCount: 19,
    avatarSvgBg: '#4a89dc',
    initials: 'P',
    tutorNumericId: '1584151',
    pincode: '800001',
    preferredTime: 'AnyTime',
    memberSince: 'June 2025',
    categories: 'Class 7th to 10th',
    phone: '+91 98352 44110',
    email: 'pramjeet.patna@vidyasetu.in',
    address: '#44, Exhibition Road, Patna - 800001',
    modes: {
      studentHome: true,
      tutorHome: true,
      institute: false,
      online: true,
    },
    bankAccountHolder: 'Pramjeet Singh',
    bankAccountNumber: '5010048291042',
    bankIfscCode: 'HDFC0000186',
    bankName: 'HDFC Bank (Exhibition Road Patna)',
    upiId: 'pramjeet.patna@hdfcbank',
    loginUserId: 'TCH-1584151',
    batchTimeSlots: [
      '08:00 AM - 09:30 AM (Morning Batch)',
      '05:00 PM - 06:30 PM (Evening Batch - Google Classroom)',
    ],
  },
  {
    id: 'tutor-bihar-3',
    userId: 'u-bihar-3',
    name: 'Rahul Kumar',
    slug: 'rahul-kumar-patna-city',
    age: 28,
    gender: 'Male',
    experienceYrs: 6,
    qualification: 'M.Sc',
    bio: 'I am a home tutor in Patna City and I teach students at their home/ online. I teach Class 5 to 12 and expert in Math and Science. I have 6 years experience in teaching and help students understand concepts and score high in board exams.',
    hourlyRate: 250,
    monthlyRate: 3000,
    minDurationMonths: 6,
    country: 'India',
    state: 'Bihar',
    cityId: 'patna',
    cityName: 'Patna',
    blockName: 'Patna City',
    localityName: 'Patna city',
    tuitionType: 'HOME_TUITION',
    isFeatured: true,
    isApproved: true,
    emailVerified: true,
    phoneVerified: true,
    lastLogin: '23-Oct-26',
    createdAt: '2026-10-23T08:00:00Z',
    courses: ['Class 5 to 12'],
    subjects: ['Math and Science'],
    ratingAvg: 4.9,
    reviewCount: 24,
    avatarSvgBg: '#4a89dc',
    initials: 'R',
    tutorNumericId: '1584152',
    pincode: '800008',
    preferredTime: 'Evening (4 PM - 9 PM)',
    memberSince: 'April 2025',
    categories: 'Class 5 to 12',
    phone: '+91 91234 55678',
    email: 'rahul.patnacity@vidyasetu.in',
    address: '#18, Chowk Shikarpur, Patna City - 800008',
    modes: {
      studentHome: true,
      tutorHome: false,
      institute: false,
      online: true,
    },
  },
  {
    id: 'tutor-bihar-4',
    userId: 'u-bihar-4',
    name: 'Bharti Kumari',
    slug: 'bharti-kumari-mithila-colony-patna',
    age: 28,
    gender: 'Female',
    experienceYrs: 0,
    qualification: 'BA(Hons.) English Literature',
    bio: 'I am a female home tutor in Mithila Colony, Patna and I teach primary students at their home or online. I teach Class I to V covering all main subjects with special attention to English reading, grammar, and daily homework.',
    hourlyRate: 250,
    monthlyRate: 2500,
    minDurationMonths: 3,
    country: 'India',
    state: 'Bihar',
    cityId: 'patna',
    cityName: 'Patna',
    blockName: 'Danapur',
    localityName: 'Mithila colony',
    tuitionType: 'HOME_TUITION',
    isFeatured: true,
    isApproved: true,
    emailVerified: false,
    phoneVerified: true,
    lastLogin: '23-Oct-26',
    createdAt: '2026-10-23T07:30:00Z',
    courses: ['Class I to v'],
    subjects: ['all main subjects'],
    ratingAvg: 4.8,
    reviewCount: 15,
    avatarSvgBg: '#4a89dc',
    initials: 'B',
    tutorNumericId: '1584153',
    pincode: '800018',
    preferredTime: 'Afternoon / Evening',
    memberSince: 'July 2025',
    categories: 'Class I to V',
    phone: '+91 93041 88219',
    email: 'bharti.mithila@vidyasetu.in',
    address: '#12, Road No. 4, Mithila Colony, Danapur, Patna - 800018',
    modes: {
      studentHome: true,
      tutorHome: true,
      institute: false,
      online: true,
    },
  },
  {
    id: 'tutor-bihar-5',
    userId: 'u-bihar-5',
    name: 'Rohit Raj',
    slug: 'rohit-raj-kumhrar-patna',
    age: 28,
    gender: 'Male',
    experienceYrs: 1,
    qualification: 'Pg',
    bio: 'I am a postgraduate CBSE home tutor in Kumhrar, Patna providing daily home and online tuition across all school subjects with weekly parent feedback.',
    hourlyRate: 100,
    monthlyRate: 2000,
    minDurationMonths: 2,
    country: 'India',
    state: 'Bihar',
    cityId: 'patna',
    cityName: 'Patna',
    blockName: 'Patna Sadar',
    localityName: 'Kumhrar',
    tuitionType: 'HOME_TUITION',
    isFeatured: true,
    isApproved: true,
    emailVerified: true,
    phoneVerified: true,
    lastLogin: '22-Oct-26',
    createdAt: '2026-10-22T15:00:00Z',
    courses: ['CBSE'],
    subjects: ['All subject'],
    ratingAvg: 4.7,
    reviewCount: 14,
    avatarSvgBg: '#4a89dc',
    initials: 'R',
    tutorNumericId: '1584154',
    pincode: '800026',
    preferredTime: 'AnyTime',
    memberSince: 'August 2025',
    categories: 'Class 1 to 10 CBSE',
    phone: '+91 79034 11290',
    email: 'rohit.kumhrar@vidyasetu.in',
    address: '#55, Sandalpur Road, Kumhrar, Patna - 800026',
    modes: {
      studentHome: true,
      tutorHome: false,
      institute: false,
      online: true,
    },
  },
  {
    id: 'tutor-bihar-6',
    userId: 'u-bihar-6',
    name: 'Kundan',
    slug: 'kundan-phulwari-patna',
    age: 26,
    gender: 'Male',
    experienceYrs: 5,
    qualification: 'Gradguate',
    bio: 'I am an experienced CBSE tutor in Phulwari, Patna specializing in Math, Science, and English for school students at their home or online.',
    hourlyRate: 4000,
    monthlyRate: 4000,
    minDurationMonths: 4,
    country: 'India',
    state: 'Bihar',
    cityId: 'patna',
    cityName: 'Patna',
    blockName: 'Phulwari Sharif',
    localityName: 'Phulwari',
    tuitionType: 'HOME_TUITION',
    isFeatured: true,
    isApproved: true,
    emailVerified: true,
    phoneVerified: true,
    lastLogin: '21-Oct-26',
    createdAt: '2026-10-21T12:00:00Z',
    courses: ['Cbse'],
    subjects: ['Math, science, english'],
    ratingAvg: 4.8,
    reviewCount: 18,
    avatarSvgBg: '#4a89dc',
    initials: 'K',
    tutorNumericId: '1584155',
    pincode: '801505',
    preferredTime: 'AnyTime',
    memberSince: 'May 2025',
    categories: 'Class 6 to 10 CBSE',
    phone: '+91 82104 99312',
    email: 'kundan.phulwari@vidyasetu.in',
    address: '#09, AIIMS Road, Phulwari Sharif, Patna - 801505',
    modes: {
      studentHome: true,
      tutorHome: false,
      institute: false,
      online: true,
    },
  },
  {
    id: 'tutor-1',
    userId: 'u-tutor-1',
    name: 'Dr. Rajeshwar Verma',
    slug: 'dr-rajeshwar-verma-patna',
    age: 38,
    gender: 'Male',
    experienceYrs: 14,
    qualification: 'Ph.D. in Physics (NIT Patna), M.Sc. Gold Medalist',
    bio: 'Former senior faculty for JEE Main & Advanced with 14+ years of personalized home mentoring across Boring Road and Bailey Road. Specializes in conceptual mechanics, electrodynamics, and calculus-backed problem solving.',
    hourlyRate: 850,
    monthlyRate: 6500,
    minDurationMonths: 6,
    country: 'India',
    state: 'Bihar',
    cityId: 'patna',
    cityName: 'Patna',
    blockName: 'Patna Sadar',
    localityName: 'Boring Road',
    tuitionType: 'HOME_TUITION',
    isFeatured: true,
    isApproved: true,
    emailVerified: true,
    phoneVerified: true,
    lastLogin: '24-Oct-26',
    createdAt: '2025-11-10T10:00:00Z',
    courses: ['Class 11 & 12 (Science - PCM/PCB)', 'IIT-JEE Main & Advanced'],
    subjects: ['Physics', 'Mathematics'],
    ratingAvg: 4.9,
    reviewCount: 42,
    avatarSvgBg: '#084d75',
    initials: 'RV',
  },
  {
    id: 'tutor-2',
    userId: 'u-tutor-2',
    name: 'Priya Nair',
    slug: 'priya-nair-bengaluru',
    age: 31,
    gender: 'Female',
    experienceYrs: 8,
    qualification: 'M.Sc. Mathematics (IISc Alumni), B.Ed.',
    bio: 'Dedicated mathematics and coding mentor for ICSE, CBSE, and IB curriculum students in Indiranagar and Koramangala. Focuses on Olympiad foundations, structured proof writing, and board exam mastery.',
    hourlyRate: 950,
    cityId: 'bengaluru',
    cityName: 'Bengaluru',
    localityName: 'Indiranagar',
    tuitionType: 'HOME_TUITION',
    isFeatured: true,
    isApproved: true,
    emailVerified: true,
    phoneVerified: true,
    lastLogin: '2026-10-24T08:10:00Z',
    createdAt: '2025-12-01T10:00:00Z',
    courses: ['Class 9 & 10 (CBSE / ICSE)', 'Class 11 & 12 (Science - PCM/PCB)'],
    subjects: ['Mathematics', 'Computer Science & Python'],
    ratingAvg: 5.0,
    reviewCount: 37,
    avatarSvgBg: '#0F172A',
    initials: 'PN',
  },
  {
    id: 'tutor-3',
    userId: 'u-tutor-3',
    name: 'Siddharth Malhotra',
    slug: 'siddharth-malhotra-delhi',
    age: 34,
    gender: 'Male',
    experienceYrs: 10,
    qualification: 'M.Com (SRCC, Delhi University), UGC-NET Qualified',
    bio: 'Specialist in Class 11-12 Accountancy, Microeconomics, and CUET Commerce preparation. Helped over 180 students score 95%+ in CBSE Board examinations across South Delhi.',
    hourlyRate: 900,
    cityId: 'delhi',
    cityName: 'Delhi',
    localityName: 'South Extension',
    tuitionType: 'HOME_TUITION',
    isFeatured: true,
    isApproved: true,
    emailVerified: true,
    phoneVerified: true,
    lastLogin: '2026-10-23T19:30:00Z',
    createdAt: '2026-01-12T10:00:00Z',
    courses: ['Class 11 & 12 (Commerce & Humanities)', 'CUET & Competitive Exams'],
    subjects: ['Accountancy', 'Economics', 'Business Studies'],
    ratingAvg: 4.8,
    reviewCount: 29,
    avatarSvgBg: '#084d75',
    initials: 'SM',
  },
  {
    id: 'tutor-4',
    userId: 'u-tutor-4',
    name: 'Ananya Chatterjee',
    slug: 'ananya-chatterjee-kolkata',
    age: 29,
    gender: 'Female',
    experienceYrs: 6,
    qualification: 'M.A. English Literature (Jadavpur University)',
    bio: 'Passionate educator for ICSE/ISC English Literature, academic essay writing, and IELTS band 8+ coaching. Conducts interactive 1-on-1 home sessions in Salt Lake and Ballygunge.',
    hourlyRate: 650,
    cityId: 'kolkata',
    cityName: 'Kolkata',
    localityName: 'Salt Lake',
    tuitionType: 'HOME_TUITION',
    isFeatured: true,
    isApproved: true,
    emailVerified: true,
    phoneVerified: true,
    lastLogin: '2026-10-24T06:20:00Z',
    createdAt: '2026-01-20T10:00:00Z',
    courses: ['Class 9 & 10 (CBSE / ICSE)', 'Spoken English & IELTS'],
    subjects: ['English Literature & Grammar', 'History & Political Science'],
    ratingAvg: 4.9,
    reviewCount: 24,
    avatarSvgBg: '#1E293B',
    initials: 'AC',
  },
  {
    id: 'tutor-5',
    userId: 'u-tutor-5',
    name: 'Dr. Farhan Qureshi',
    slug: 'dr-farhan-qureshi-mumbai',
    age: 36,
    gender: 'Male',
    experienceYrs: 11,
    qualification: 'M.B.B.S., M.D. Biochemistry (Grant Medical College)',
    bio: 'Dedicated NEET UG Biology and Organic Chemistry mentor. Uses NCERT line-by-line mastery, visual mnemonics, and weekly OMR test diagnostics for medical aspirants in Mumbai.',
    hourlyRate: 1200,
    cityId: 'mumbai',
    cityName: 'Mumbai',
    localityName: 'Andheri West',
    tuitionType: 'ONLINE',
    isFeatured: true,
    isApproved: true,
    emailVerified: true,
    phoneVerified: true,
    lastLogin: '2026-10-24T05:00:00Z',
    createdAt: '2026-02-02T10:00:00Z',
    courses: ['Class 11 & 12 (Science - PCM/PCB)', 'NEET UG Medical Prep'],
    subjects: ['Biology', 'Chemistry'],
    ratingAvg: 4.9,
    reviewCount: 51,
    avatarSvgBg: '#084d75',
    initials: 'FQ',
  },
  {
    id: 'tutor-6',
    userId: 'u-tutor-6',
    name: 'Meenakshi Sundaram',
    slug: 'meenakshi-sundaram-chennai',
    age: 41,
    gender: 'Female',
    experienceYrs: 16,
    qualification: 'M.Sc. Chemistry, M.Phil. (Madras Christian College)',
    bio: 'Senior Chemistry and Middle/High School Science home tutor in Adyar and Anna Nagar. Known for patient foundational teaching and structured lab-concept clarity.',
    hourlyRate: 750,
    cityId: 'chennai',
    cityName: 'Chennai',
    localityName: 'Adyar',
    tuitionType: 'HOME_TUITION',
    isFeatured: false,
    isApproved: true,
    emailVerified: true,
    phoneVerified: true,
    lastLogin: '2026-10-22T17:15:00Z',
    createdAt: '2026-02-14T10:00:00Z',
    courses: ['Class 9 & 10 (CBSE / ICSE)', 'Class 11 & 12 (Science - PCM/PCB)'],
    subjects: ['Chemistry', 'Biology'],
    ratingAvg: 4.7,
    reviewCount: 19,
    avatarSvgBg: '#0F172A',
    initials: 'MS',
  },
  {
    id: 'tutor-7',
    userId: 'u-tutor-7',
    name: 'Vikramaditya Deshmukh',
    slug: 'vikramaditya-deshmukh-pune',
    age: 32,
    gender: 'Male',
    experienceYrs: 9,
    qualification: 'B.E. Computer Engineering (COEP Pune)',
    bio: 'Teaches B.Tech Data Structures, Python, AP Computer Science, and Class 11-12 Mathematics in Kothrud and Baner. Hands-on code reviews and algorithmic problem solving.',
    hourlyRate: 800,
    cityId: 'pune',
    cityName: 'Pune',
    localityName: 'Kothrud',
    tuitionType: 'AT_TUTOR_HOME',
    isFeatured: false,
    isApproved: true,
    emailVerified: true,
    phoneVerified: true,
    lastLogin: '2026-10-23T14:10:00Z',
    createdAt: '2026-03-01T10:00:00Z',
    courses: ['Class 11 & 12 (Science - PCM/PCB)', 'B.Tech / Engineering Subjects'],
    subjects: ['Computer Science & Python', 'Mathematics'],
    ratingAvg: 4.8,
    reviewCount: 22,
    avatarSvgBg: '#1E293B',
    initials: 'VD',
  },
  {
    id: 'tutor-8',
    userId: 'u-tutor-8',
    name: 'Kavita Rathore',
    slug: 'kavita-rathore-jaipur',
    age: 28,
    gender: 'Female',
    experienceYrs: 5,
    qualification: 'B.A. B.Ed. (University of Rajasthan), CTET Qualified',
    bio: 'Caring primary and middle-school all-subjects home tutor in Vaishali Nagar and Malviya Nagar. Builds strong reading, mental math, and homework discipline for Class 1 to 8.',
    hourlyRate: 450,
    cityId: 'jaipur',
    cityName: 'Jaipur',
    localityName: 'Vaishali Nagar',
    tuitionType: 'HOME_TUITION',
    isFeatured: false,
    isApproved: true,
    emailVerified: true,
    phoneVerified: true,
    lastLogin: '2026-10-24T04:50:00Z',
    createdAt: '2026-03-15T10:00:00Z',
    courses: ['Class 1 to 5 (Primary)', 'Class 6 to 8 (Middle School)'],
    subjects: ['Mathematics', 'English Literature & Grammar', 'Hindi & Sanskrit'],
    ratingAvg: 4.9,
    reviewCount: 31,
    avatarSvgBg: '#084d75',
    initials: 'KR',
  },
  {
    id: 'tutor-9',
    userId: 'u-tutor-9',
    name: 'Abhishek Srivastava',
    slug: 'abhishek-srivastava-lucknow',
    age: 35,
    gender: 'Male',
    experienceYrs: 12,
    qualification: 'M.Sc. Physics (Lucknow University)',
    bio: 'Experienced Physics and Quantitative Aptitude educator in Gomti Nagar and Hazratganj. Known for structured weekly progress reports for parents and board exam mock papers.',
    hourlyRate: 600,
    cityId: 'lucknow',
    cityName: 'Lucknow',
    localityName: 'Gomti Nagar',
    tuitionType: 'HOME_TUITION',
    isFeatured: false,
    isApproved: true,
    emailVerified: true,
    phoneVerified: true,
    lastLogin: '2026-10-21T16:40:00Z',
    createdAt: '2026-04-02T10:00:00Z',
    courses: ['Class 9 & 10 (CBSE / ICSE)', 'CUET & Competitive Exams'],
    subjects: ['Physics', 'Mathematics', 'Quantitative Aptitude'],
    ratingAvg: 4.7,
    reviewCount: 16,
    avatarSvgBg: '#334155',
    initials: 'AS',
  },
  {
    id: 'tutor-10',
    userId: 'u-tutor-10',
    name: 'Sowmya Reddy',
    slug: 'sowmya-reddy-hyderabad',
    age: 30,
    gender: 'Female',
    experienceYrs: 7,
    qualification: 'M.Tech (IIIT Hyderabad)',
    bio: 'Mentors high school and engineering students in Banjara Hills and Gachibowli in Calculus, Linear Algebra, and Python programming. Offers both in-home and live interactive online sessions.',
    hourlyRate: 900,
    cityId: 'hyderabad',
    cityName: 'Hyderabad',
    localityName: 'Gachibowli',
    tuitionType: 'ONLINE',
    isFeatured: true,
    isApproved: true,
    emailVerified: true,
    phoneVerified: true,
    lastLogin: '2026-10-24T07:10:00Z',
    createdAt: '2026-04-18T10:00:00Z',
    courses: ['IIT-JEE Main & Advanced', 'B.Tech / Engineering Subjects'],
    subjects: ['Mathematics', 'Computer Science & Python'],
    ratingAvg: 5.0,
    reviewCount: 28,
    avatarSvgBg: '#0F172A',
    initials: 'SR',
  },
  {
    id: 'tutor-11',
    userId: 'u-tutor-11',
    name: 'Ashutosh Kumar Sinha',
    slug: 'ashutosh-kumar-sinha-patna',
    age: 33,
    gender: 'Male',
    experienceYrs: 9,
    qualification: 'M.A. History & Political Science (Patna University)',
    bio: 'Humanities, NCERT Social Studies, and foundation civil services mentor in Kankarbagh and Rajendra Nagar. Makes history, polity, and geography memorable through maps and timelines.',
    hourlyRate: 550,
    cityId: 'patna',
    cityName: 'Patna',
    localityName: 'Kankarbagh',
    tuitionType: 'HOME_TUITION',
    isFeatured: false,
    isApproved: true,
    emailVerified: true,
    phoneVerified: true,
    lastLogin: '2026-10-23T11:25:00Z',
    createdAt: '2026-05-05T10:00:00Z',
    courses: ['Class 9 & 10 (CBSE / ICSE)', 'Class 11 & 12 (Commerce & Humanities)'],
    subjects: ['History & Political Science', 'Geography', 'Economics'],
    ratingAvg: 4.8,
    reviewCount: 21,
    avatarSvgBg: '#084d75',
    initials: 'AK',
  },
  {
    id: 'tutor-12',
    userId: 'u-tutor-12',
    name: 'Neha Kapoor',
    slug: 'neha-kapoor-delhi',
    age: 27,
    gender: 'Female',
    experienceYrs: 5,
    qualification: 'DELF B2 Certified (Alliance Française de Delhi), B.A. Honours',
    bio: 'Certified French language and English communication home tutor in Dwarka and Vasant Kunj. Prepares CBSE/ICSE school students and working professionals for DELF A1-B2 exams.',
    hourlyRate: 700,
    cityId: 'delhi',
    cityName: 'Delhi',
    localityName: 'Vasant Kunj',
    tuitionType: 'AT_INSTITUTE',
    isFeatured: false,
    isApproved: false,
    emailVerified: true,
    phoneVerified: false,
    lastLogin: '2026-10-24T03:15:00Z',
    createdAt: '2026-06-01T10:00:00Z',
    courses: ['Class 6 to 8 (Middle School)', 'Spoken English & IELTS'],
    subjects: ['French & Foreign Languages', 'English Literature & Grammar'],
    ratingAvg: 4.6,
    reviewCount: 11,
    avatarSvgBg: '#1E293B',
    initials: 'NK',
  },
];

export const INITIAL_PLANS: PricingPlanItem[] = [
  {
    id: 'plan-free',
    name: 'Free Starter',
    audience: 'For new tutors building their initial local profile',
    price: 0,
    durationDays: 30,
    features: [
      'Public directory profile in 1 city & 2 localities',
      'Up to 3 course & 3 subject listings',
      'Receive up to 3 direct student inquiries / month',
      'Standard email inquiry notifications',
    ],
    isPopular: false,
    isActive: true,
  },
  {
    id: 'plan-silver',
    name: 'Silver Educator',
    audience: 'For active home tutors expanding student batches',
    price: 499,
    durationDays: 30,
    features: [
      'Verified educator badge after ID & degree check',
      'Up to 25 student inquiries / month + direct phone & WhatsApp access',
      'Priority ranking in city & locality search results',
      'Instant SMS & email alerts on new parent requirements',
    ],
    isPopular: true,
    isActive: true,
  },
  {
    id: 'plan-gold',
    name: 'Gold Master Mentor',
    audience: 'For full-time educators & competitive exam mentors',
    price: 999,
    durationDays: 30,
    features: [
      'Homepage & city-top Featured Tutor placement',
      'Unlimited student inquiries & direct tuition requirement unlocks',
      'Dedicated profile SEO optimization & JSON-LD rich snippet',
      'Priority relationship manager & quarterly performance analytics',
    ],
    isPopular: false,
    isActive: true,
  },
];

export const INITIAL_INQUIRIES: InquiryItem[] = [
  {
    id: 'inq-101',
    tutorId: 'tutor-1',
    tutorUserId: 'u-tutor-1',
    tutorName: 'Dr. Rajeshwar Verma',
    userId: 'u-student-1',
    name: 'Rakesh Sharma (Parent)',
    email: 'rakesh.sharma@example.com',
    mobile: '9835011223',
    message: 'Looking for 4 days/week home tuition in Boring Road for my son in Class 11 (Physics & Maths JEE Mains prep).',
    status: 'NEW',
    createdAt: '2026-10-23T15:30:00Z',
  },
  {
    id: 'inq-102',
    tutorId: 'tutor-2',
    tutorUserId: 'u-tutor-2',
    tutorName: 'Priya Nair',
    userId: 'u-student-2',
    name: 'Deepika Menon',
    email: 'deepika.m@example.com',
    mobile: '9845099881',
    message: 'Need ICSE Class 10 Mathematics home tutor near 100 Feet Road, Indiranagar for evening slot (5 PM - 6:30 PM).',
    status: 'REPLIED',
    createdAt: '2026-10-22T11:15:00Z',
  },
  {
    id: 'inq-103',
    tutorId: 'tutor-5',
    tutorUserId: 'u-tutor-5',
    tutorName: 'Dr. Farhan Qureshi',
    userId: 'u-student-3',
    name: 'Aarav Kulkarni',
    email: 'aarav.k@example.com',
    mobile: '9820144556',
    message: 'Requesting a 1-on-1 diagnostic session for NEET UG Biology genetics and human physiology modules.',
    status: 'READ',
    createdAt: '2026-10-21T18:45:00Z',
  },
];

export const INITIAL_REQUIREMENTS: RequirementItem[] = [
  {
    id: 'req-201',
    userId: 'u-student-1',
    studentName: 'Rakesh Sharma (Parent of Class 11 Student)',
    cityId: 'patna',
    cityName: 'Patna',
    locality: 'Boring Road',
    course: 'Class 11 & 12 (Science - PCM/PCB)',
    subjects: 'Physics, Mathematics',
    budget: 8000,
    message: 'Need an experienced IIT-JEE Physics and Mathematics home tutor 4 days a week at Boring Road Crossing.',
    status: 'OPEN',
    createdAt: '2026-10-24T04:10:00Z',
  },
  {
    id: 'req-202',
    userId: 'u-student-2',
    studentName: 'Deepika Menon',
    cityId: 'bengaluru',
    cityName: 'Bengaluru',
    locality: 'Indiranagar',
    course: 'Class 9 & 10 (CBSE / ICSE)',
    subjects: 'Mathematics, Computer Science & Python',
    budget: 9500,
    message: 'Looking for a female ICSE Class 10 tutor for board exam preparation.',
    status: 'ASSIGNED',
    assignedTutorName: 'Priya Nair',
    createdAt: '2026-10-22T09:20:00Z',
  },
  {
    id: 'req-203',
    userId: 'u-student-4',
    studentName: 'Sanjay Gupta',
    cityId: 'delhi',
    cityName: 'Delhi',
    locality: 'South Extension',
    course: 'Class 11 & 12 (Commerce & Humanities)',
    subjects: 'Accountancy, Economics',
    budget: 10000,
    message: 'Urgent requirement for CBSE Class 12 Accountancy & Economics home tutor before pre-boards.',
    status: 'OPEN',
    createdAt: '2026-10-20T14:00:00Z',
  },
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-301',
    tutorId: 'tutor-1',
    tutorName: 'Dr. Rajeshwar Verma',
    userId: 'u-student-1',
    reviewerName: 'Rakesh Sharma (Parent, Patna)',
    rating: 5,
    comment: 'Dr. Verma transformed my son’s confidence in Rotational Mechanics and Electrostatics. His score jumped from 68% to 96% in Class 12 CBSE Physics and 99.1 percentile in JEE Main.',
    isApproved: true,
    createdAt: '2026-10-15T10:30:00Z',
  },
  {
    id: 'rev-302',
    tutorId: 'tutor-2',
    tutorName: 'Priya Nair',
    userId: 'u-student-2',
    reviewerName: 'Deepika Menon (Parent, Bengaluru)',
    rating: 5,
    comment: 'Priya ma’am is remarkably patient and structured. Her weekly worksheet drills helped my daughter achieve 98/100 in ICSE Class 10 Mathematics.',
    isApproved: true,
    createdAt: '2026-10-18T16:10:00Z',
  },
  {
    id: 'rev-303',
    tutorId: 'tutor-3',
    tutorName: 'Siddharth Malhotra',
    userId: 'u-student-4',
    reviewerName: 'Sanjay Gupta (Parent, New Delhi)',
    rating: 5,
    comment: 'Crystal clear explanations of Balance Sheet adjustments and Partnership Accounts. Highly punctual and disciplined.',
    isApproved: true,
    createdAt: '2026-10-19T12:00:00Z',
  },
  {
    id: 'rev-304',
    tutorId: 'tutor-12',
    tutorName: 'Neha Kapoor',
    userId: 'u-student-3',
    reviewerName: 'Aarav Kulkarni (Student)',
    rating: 4,
    comment: 'Great conversational French practice sessions and grammar worksheets for DELF A2.',
    isApproved: false,
    createdAt: '2026-10-23T19:00:00Z',
  },
];

export const INITIAL_PAYMENTS: PaymentItem[] = [
  {
    id: 'pay-501',
    userId: 'u-tutor-1',
    userName: 'Dr. Rajeshwar Verma',
    planId: 'plan-gold',
    planName: 'Gold Master Mentor',
    amount: 999,
    currency: 'INR',
    status: 'PAID',
    razorpayId: 'pay_P9xLmK82vN10qR',
    createdAt: '2026-10-01T09:15:00Z',
  },
  {
    id: 'pay-502',
    userId: 'u-tutor-2',
    userName: 'Priya Nair',
    planId: 'plan-gold',
    planName: 'Gold Master Mentor',
    amount: 999,
    currency: 'INR',
    status: 'PAID',
    razorpayId: 'pay_P9yTrW44mK81zL',
    createdAt: '2026-10-05T14:22:00Z',
  },
  {
    id: 'pay-503',
    userId: 'u-tutor-6',
    userName: 'Meenakshi Sundaram',
    planId: 'plan-silver',
    planName: 'Silver Educator',
    amount: 499,
    currency: 'INR',
    status: 'PAID',
    razorpayId: 'pay_PA1vBn90pL33xQ',
    createdAt: '2026-10-12T11:05:00Z',
  },
  {
    id: 'pay-504',
    userId: 'u-tutor-12',
    userName: 'Neha Kapoor',
    planId: 'plan-silver',
    planName: 'Silver Educator',
    amount: 499,
    currency: 'INR',
    status: 'PENDING',
    razorpayId: 'order_PB7mJk12cR09wE',
    createdAt: '2026-10-23T17:40:00Z',
  },
];

export const INITIAL_PAGES: PageCMSItem[] = [
  {
    id: 'page-about',
    slug: 'about',
    title: 'About VidyaSetu Home Tutor Directory',
    metaTitle: 'About Us | VidyaSetu Verified Home Tutors Across India',
    metaDesc: 'Learn how VidyaSetu verifies academic credentials and connects parents with trusted 1-on-1 home tutors across 10 major Indian cities.',
    isActive: true,
    content: `VidyaSetu was founded with a singular mission: bringing rigorous academic mentorship directly to the student's study table. Unlike unmoderated classified boards, every educator listed in our directory undergoes multi-step credential verification, academic qualification checks, and locality mapping across 10 major Indian cities.

Whether a student requires foundational reading and arithmetic support in Class 3, structured CBSE/ICSE board preparation in Class 10, or intensive calculus and physics problem-solving for IIT-JEE and NEET, personalized 1-on-1 instruction eliminates classroom hesitation and adapts to the learner's exact pace.`,
  },
  {
    id: 'page-faqs',
    slug: 'faqs',
    title: 'Frequently Asked Questions',
    metaTitle: 'FAQs for Parents, Students & Tutors | VidyaSetu',
    metaDesc: 'Answers to common questions about booking trial classes, tutor background verification, hourly tuition fees, and membership plans.',
    isActive: true,
    content: `Q1: How does VidyaSetu verify home tutors?
Every tutor submits government photo identification, highest university degree certificates, and phone/email verification before our academic moderation team approves their public profile.

Q2: Is there any registration charge for parents and students?
Posting a tuition requirement and browsing verified tutor profiles is completely free for students and parents. You pay tuition fees directly to the educator after a satisfactory trial class.

Q3: Can I chat directly on WhatsApp before booking a demo?
Yes. Every tutor profile and contact page includes an instant WhatsApp connect button alongside our direct inquiry form.`,
  },
  {
    id: 'page-privacy',
    slug: 'privacy',
    title: 'Privacy Policy & Data Protection',
    metaTitle: 'Privacy Policy | VidyaSetu Home Tutor Directory',
    metaDesc: 'How we protect student, parent, and tutor contact details with split-collection PII isolation and encrypted backups.',
    isActive: true,
    content: `We enforce strict zero-trust data isolation for all personally identifiable information (PII). Parent and student phone numbers and email addresses are never exposed on public pages; they are shared solely with verified educators assigned to your specific inquiry or requirement. All database records are protected with role-based access control and automated administrative snapshot backups.`,
  },
  {
    id: 'page-terms',
    slug: 'terms',
    title: 'Terms of Service & Code of Conduct',
    metaTitle: 'Terms of Service | VidyaSetu',
    metaDesc: 'Terms governing tutor memberships, Razorpay payments, academic integrity, and home tuition safety guidelines.',
    isActive: true,
    content: `1. Academic Integrity: Tutors must provide accurate degree qualifications and teaching experience. Misrepresentation results in immediate account termination.
2. Safe Learning Environment: For home tuition sessions, we recommend a parent or guardian be present on the premises during instructional hours for minor students.
3. Subscription & Refund Policy: Tutor Silver and Gold membership upgrades are processed via Razorpay with 256-bit signature verification. Unused plan pro-rata refunds may be requested within 7 days if zero inquiries were unlocked.`,
  },
];

const SLIDE_SVG_1 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 450" width="1200" height="450">
  <defs>
    <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#062c47"/>
      <stop offset="55%" stop-color="#084d75"/>
      <stop offset="100%" stop-color="#146b9c"/>
    </linearGradient>
    <linearGradient id="accent1" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ff6600"/>
      <stop offset="100%" stop-color="#f7941d"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="450" fill="url(#bg1)"/>
  <circle cx="1020" cy="110" r="240" fill="#ffffff" fill-opacity="0.05"/>
  <circle cx="920" cy="340" r="180" fill="#f7941d" fill-opacity="0.12"/>
  <g transform="translate(700, 55)">
    <rect x="0" y="0" width="430" height="330" rx="18" fill="#0d3b5c" stroke="#38bdf8" stroke-opacity="0.35" stroke-width="2"/>
    <rect x="24" y="24" width="382" height="190" rx="10" fill="#07243b"/>
    <text x="48" y="72" fill="#38bdf8" font-family="monospace" font-size="18" font-weight="bold">∫ f(x) dx = F(b) - F(a)</text>
    <text x="48" y="108" fill="#fbbf24" font-family="sans-serif" font-size="16" font-weight="bold">✓ 1-on-1 Home Tuition in Patna &amp; Bihar</text>
    <text x="48" y="142" fill="#e2e8f0" font-family="sans-serif" font-size="14">Danapur · Boring Road · Kankarbagh · Phulwari</text>
    <text x="48" y="176" fill="#4ade80" font-family="sans-serif" font-size="14" font-weight="bold">★ 100% Degree &amp; Background Verified Tutors</text>
    <rect x="24" y="234" width="180" height="68" rx="10" fill="#114b73"/>
    <text x="42" y="262" fill="#94a3b8" font-family="sans-serif" font-size="12">EXPERIENCED MENTORS</text>
    <text x="42" y="288" fill="#ffffff" font-family="monospace" font-size="22" font-weight="bold">5,000+ Tutors</text>
    <rect x="222" y="234" width="184" height="68" rx="10" fill="url(#accent1)"/>
    <text x="240" y="262" fill="#fff7ed" font-family="sans-serif" font-size="12">FREE DEMO CLASS</text>
    <text x="240" y="288" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="bold">At Your Home</text>
  </g>
</svg>
`)}`;

const SLIDE_SVG_2 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 450" width="1200" height="450">
  <defs>
    <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e3a5f"/>
      <stop offset="100%" stop-color="#0d5c75"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="450" fill="url(#bg2)"/>
  <circle cx="980" cy="220" r="220" fill="#10b981" fill-opacity="0.1"/>
  <g transform="translate(690, 50)">
    <rect x="0" y="0" width="440" height="340" rx="18" fill="#1e293b" stroke="#10b981" stroke-opacity="0.4" stroke-width="2"/>
    <rect x="24" y="24" width="392" height="200" rx="12" fill="#0f172a"/>
    <circle cx="52" cy="50" r="7" fill="#ef4444"/>
    <circle cx="74" cy="50" r="7" fill="#f59e0b"/>
    <circle cx="96" cy="50" r="7" fill="#10b981"/>
    <text x="125" y="55" fill="#34d399" font-family="monospace" font-size="13" font-weight="bold">● LIVE INTERACTIVE ONLINE CLASSROOM</text>
    <text x="46" y="102" fill="#ffffff" font-family="sans-serif" font-size="19" font-weight="bold">Digital Whiteboard + 1-on-1 Audio/Video</text>
    <text x="46" y="136" fill="#cbd5e1" font-family="sans-serif" font-size="14">CBSE · ICSE · BSEB · IIT-JEE · NEET · Spoken English</text>
    <text x="46" y="172" fill="#fbbf24" font-family="sans-serif" font-size="14" font-weight="bold">✓ Flexible Morning &amp; Evening Batches</text>
    <rect x="24" y="244" width="392" height="68" rx="10" fill="#065f46"/>
    <text x="46" y="274" fill="#a7f3d0" font-family="sans-serif" font-size="12">INSTANT ONLINE BOOKING</text>
    <text x="46" y="298" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">Learn From Top Tutors Anywhere in India</text>
  </g>
</svg>
`)}`;

const SLIDE_SVG_3 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 450" width="1200" height="450">
  <defs>
    <linearGradient id="bg3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3b1d06"/>
      <stop offset="50%" stop-color="#6b2e07"/>
      <stop offset="100%" stop-color="#084d75"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="450" fill="url(#bg3)"/>
  <circle cx="1050" cy="140" r="210" fill="#f7941d" fill-opacity="0.16"/>
  <g transform="translate(700, 55)">
    <rect x="0" y="0" width="430" height="330" rx="18" fill="#1e293b" stroke="#fbbf24" stroke-opacity="0.45" stroke-width="2"/>
    <text x="34" y="56" fill="#fbbf24" font-family="sans-serif" font-size="15" font-weight="bold">★ TEACHER AUTOMATION PORTAL</text>
    <text x="34" y="96" fill="#ffffff" font-family="sans-serif" font-size="22" font-weight="bold">Join As Home / Online Tutor</text>
    <text x="34" y="132" fill="#cbd5e1" font-family="sans-serif" font-size="14">• Auto-Generated Tutor ID &amp; Profile Bio</text>
    <text x="34" y="162" fill="#cbd5e1" font-family="sans-serif" font-size="14">• Instant Listing on Home Page &amp; Area Search</text>
    <text x="34" y="192" fill="#cbd5e1" font-family="sans-serif" font-size="14">• Phone &amp; WhatsApp Protected Until Payment</text>
    <rect x="34" y="226" width="362" height="72" rx="12" fill="#ff6600"/>
    <text x="58" y="256" fill="#fff7ed" font-family="sans-serif" font-size="12">ZERO COMMISSION ON TUITION FEES</text>
    <text x="58" y="282" fill="#ffffff" font-family="sans-serif" font-size="19" font-weight="bold">Create Free Teacher Profile Today →</text>
  </g>
</svg>
`)}`;

export const INITIAL_BANNERS: BannerItem[] = [
  {
    id: 'ban-1',
    title: 'Find Verified Home Tutors & Online Tutors in Your Exact Area',
    subtitle: 'Search by Locality or Pincode (Danapur 801503, Boring Road, Kankarbagh, Patna City & 15+ Districts). Book a free trial class today.',
    link: '/search',
    isActive: true,
    sortOrder: 1,
    imageUrl: SLIDE_SVG_1,
    ctaText: 'Search Area Tutors',
    ctaAction: 'find-tutor',
    animationStyle: 'ken-burns',
    badgeText: '1-ON-1 HOME TUITION',
  },
  {
    id: 'ban-2',
    title: 'Interactive Live 1-on-1 Online Tuition Classes Across Bihar & India',
    subtitle: 'Study Mathematics, Physics, Chemistry, Biology, English & Coding from the comfort of home with verified degree-holder educators.',
    link: '/online',
    isActive: true,
    sortOrder: 2,
    imageUrl: SLIDE_SVG_2,
    ctaText: 'Explore Online Tutors',
    ctaAction: 'online-tuition',
    animationStyle: 'fade-zoom',
    badgeText: 'LIVE ONLINE CLASSES',
  },
  {
    id: 'ban-3',
    title: 'Are You a Teacher? Register Your Full Profile & Appear Live on Home Page',
    subtitle: '100% automated Tutor ID and bio generation. Your Mobile & WhatsApp numbers remain safely locked until verified parents complete payment.',
    link: '/signup',
    isActive: true,
    sortOrder: 3,
    imageUrl: SLIDE_SVG_3,
    ctaText: 'Join As Tutor (Free)',
    ctaAction: 'join-tutor',
    animationStyle: 'slide',
    badgeText: 'FOR TEACHERS & EDUCATORS',
  },
];

export const INITIAL_BLOG_POSTS: BlogPostItem[] = [
  {
    id: 'blog-1',
    slug: 'how-1-on-1-home-tuition-improves-board-exam-scores',
    title: 'How 1-on-1 Diagnostic Home Tuition Improves Class 10 & 12 Board Scores by 24%',
    excerpt: 'An empirical look at why personalized error-log tracking and chapter-wise timed testing outperform crowded 80-student coaching batches.',
    category: 'Academic Research',
    readTime: '6 min read',
    isPublished: true,
    createdAt: '2026-10-12T08:00:00Z',
    content: `In a conventional coaching classroom of 80 to 120 students, a learner who misunderstands a foundational step in Trigonometry or Organic Reaction Mechanisms rarely stops the lecture to ask a follow-up question. Within three weeks, that small conceptual gap compounds into exam anxiety.

Personalized 1-on-1 home tuition reverses this dynamic. By dedicating the first 15 minutes of every session to inspecting the student's written steps line-by-line, an experienced home tutor pinpoints whether errors stem from conceptual misunderstanding, algebraic carelessness, or time-management pressure.`,
  },
  {
    id: 'blog-2',
    slug: 'parent-checklist-selecting-right-home-tutor',
    title: 'A Parent’s 5-Point Checklist for Selecting the Right Home Tutor in Your Locality',
    excerpt: 'From verifying university degrees to structuring the first 45-minute diagnostic demo session—here is how to evaluate a mentor.',
    category: 'Parent Guide',
    readTime: '5 min read',
    isPublished: true,
    createdAt: '2026-10-19T10:30:00Z',
    content: `Selecting a home tutor is one of the highest-leverage educational decisions a family makes. Rather than focusing solely on hourly rate, evaluate candidates across five concrete dimensions: subject-specific degree depth, familiarity with your child's specific board (CBSE, ICSE, IB, or State Board), proximity to your locality for punctuality, structured monthly testing habits, and communication clarity during the trial lesson.`,
  },
];

export const INITIAL_EMAIL_TEMPLATES: EmailTemplateItem[] = [
  {
    id: 'tpl-1',
    key: 'WELCOME_USER',
    subject: 'Welcome to {{company_name}}, {{name}} — Verify Your Account',
    body: 'Hello {{name}},\n\nWelcome to {{company_name}}. Your {{role}} account has been created. Please click {{verification_link}} to verify your email address.',
  },
  {
    id: 'tpl-2',
    key: 'TUTOR_APPROVED',
    subject: 'Congratulations {{name}}! Your Tutor Profile is Live on {{company_name}}',
    body: 'Dear {{name}},\n\nOur academic moderation team has verified your credentials and approved your public profile ({{profile_url}}). You can now receive direct student inquiries in {{city}}.',
  },
  {
    id: 'tpl-3',
    key: 'NEW_INQUIRY_ALERT',
    subject: 'New Student Inquiry from {{student_name}} in {{locality}}',
    body: 'Hi {{tutor_name}},\n\nYou have received a new tuition inquiry from {{student_name}} ({{mobile}}) for {{subjects}}.\n\nMessage: "{{message}}"\n\nLog in to your Tutor Dashboard to reply.',
  },
  {
    id: 'tpl-4',
    key: 'INQUIRY_REPLY_NOTIFICATION',
    subject: 'Tutor {{tutor_name}} Replied to Your Tuition Inquiry',
    body: 'Hello {{student_name}},\n\n{{tutor_name}} has responded to your inquiry:\n\n"{{reply_message}}"\n\nYou can contact them directly or schedule your trial session.',
  },
  {
    id: 'tpl-5',
    key: 'PAYMENT_RECEIPT',
    subject: 'Payment Receipt {{razorpay_id}} — {{plan_name}} Activated',
    body: 'Dear {{name}},\n\nThank you for upgrading to {{plan_name}}. Your payment of INR {{amount}} (Ref: {{razorpay_id}}) is confirmed and valid for {{duration_days}} days.',
  },
  {
    id: 'tpl-6',
    key: 'PASSWORD_RESET',
    subject: 'Reset Your {{company_name}} Password',
    body: 'Hello {{name}},\n\nWe received a request to reset your password. Use this one-time secure link within 15 minutes: {{reset_link}}',
  },
  {
    id: 'tpl-7',
    key: 'REQUIREMENT_MATCHED',
    subject: 'Verified Tutor Matched for Your {{course}} Requirement in {{city}}',
    body: 'Dear {{student_name}},\n\nYour requirement for {{subjects}} in {{locality}} has been matched with verified educator {{tutor_name}}.',
  },
];

export const INITIAL_USERS_DIRECTORY: UserDirectoryItem[] = [
  {
    id: 'u-admin-1',
    name: 'Super Admin (Owner)',
    email: 'admin@example.com',
    mobile: '9900112233',
    role: 'ADMIN',
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2025-10-01T09:00:00Z',
    lastActivity: '2 mins ago · Reviewed security backup snapshot',
  },
  {
    id: 'u-tutor-1',
    name: 'Dr. Rajeshwar Verma',
    email: 'rajeshwar.verma@example.com',
    mobile: '9431011223',
    role: 'TUTOR',
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2025-11-10T10:00:00Z',
    lastActivity: '8 mins ago · Updated JEE Physics batch availability',
  },
  {
    id: 'u-tutor-2',
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    mobile: '9845012345',
    role: 'TUTOR',
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2025-12-01T10:00:00Z',
    lastActivity: '14 mins ago · Replied to inquiry #inq-102',
  },
  {
    id: 'u-student-1',
    name: 'Rakesh Sharma',
    email: 'rakesh.sharma@example.com',
    mobile: '9835011223',
    role: 'STUDENT',
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2026-01-05T11:30:00Z',
    lastActivity: '22 mins ago · Posted Class 11 PCM requirement in Patna',
  },
  {
    id: 'u-student-2',
    name: 'Deepika Menon',
    email: 'deepika.m@example.com',
    mobile: '9845099881',
    role: 'STUDENT',
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2026-02-11T14:20:00Z',
    lastActivity: '1 hour ago · Submitted 5-star review for Priya Nair',
  },
  {
    id: 'u-tutor-12',
    name: 'Neha Kapoor',
    email: 'neha.kapoor@example.com',
    mobile: '9811223344',
    role: 'TUTOR',
    isActive: true,
    emailVerified: true,
    phoneVerified: false,
    createdAt: '2026-06-01T10:00:00Z',
    lastActivity: '3 hours ago · Uploaded DELF B2 degree certificate',
  },
];

export const INITIAL_ACTIVITY_EVENTS: ActivityEventItem[] = [
  {
    id: 'act-1',
    actorName: 'Rakesh Sharma',
    actorRole: 'STUDENT',
    action: 'Posted new Tuition Requirement (#req-201)',
    target: 'Patna · Boring Road (Physics, Maths)',
    timestamp: 'Just now',
    severity: 'NOMINAL',
  },
  {
    id: 'act-2',
    actorName: 'Priya Nair',
    actorRole: 'TUTOR',
    action: 'Responded to parent inquiry (#inq-102)',
    target: 'Deepika Menon · Indiranagar',
    timestamp: '12m ago',
    severity: 'NOMINAL',
  },
  {
    id: 'act-3',
    actorName: 'Neha Kapoor',
    actorRole: 'TUTOR',
    action: 'Initiated Silver Plan Checkout (Order Pending)',
    target: 'order_PB7mJk12cR09wE · INR 499',
    timestamp: '38m ago',
    severity: 'WARNING',
  },
  {
    id: 'act-4',
    actorName: 'Super Admin',
    actorRole: 'ADMIN',
    action: 'Verified SHA-256 Asmuth User Data Backup Snapshot',
    target: 'Full Registry (12 Tutors, 6 Users, 4 Pages)',
    timestamp: '1h ago',
    severity: 'SECURITY',
  },
];

export const INITIAL_SUBSCRIBED_STUDENTS: SubscribedStudentItem[] = [
  {
    id: 'sub-stu-1',
    tutorId: 'tutor-bihar-1',
    tutorName: 'Sanjeet',
    studentId: 'u-student-1',
    studentName: 'Rakesh Sharma',
    studentEmail: 'rakesh.sharma@example.com',
    studentMobile: '9835011223',
    districtName: 'Patna',
    localityName: 'Danapur',
    course: 'Class 9 & 10 CBSE',
    subjects: 'Mathematics, Physics, Chemistry',
    batchTiming: '04:00 PM - 05:30 PM (Mon-Sat)',
    monthlyFee: 2500,
    isLoginActive: true,
    lastSeenText: 'Online Now · Active in Live Classroom',
    attendanceToday: 'PRESENT',
    presentDaysCount: 22,
    absentDaysCount: 1,
    subscribedAt: '2026-10-01',
  },
  {
    id: 'sub-stu-2',
    tutorId: 'tutor-bihar-1',
    tutorName: 'Sanjeet',
    studentId: 'u-student-2',
    studentName: 'Ananya Kumari',
    studentEmail: 'ananya.kumari@example.com',
    studentMobile: '9431088776',
    districtName: 'Patna',
    localityName: 'Boring Road',
    course: 'Class 10 CBSE Board',
    subjects: 'Mathematics, Science',
    batchTiming: '06:00 PM - 07:30 PM (Mon-Sat)',
    monthlyFee: 2500,
    isLoginActive: true,
    lastSeenText: 'Online Now · Viewing Daily Task',
    attendanceToday: 'PRESENT',
    presentDaysCount: 20,
    absentDaysCount: 2,
    subscribedAt: '2026-10-04',
  },
  {
    id: 'sub-stu-3',
    tutorId: 'tutor-bihar-1',
    tutorName: 'Sanjeet',
    studentId: 'u-student-3',
    studentName: 'AaravSinha',
    studentEmail: 'aarav.sinha@example.com',
    studentMobile: '9123456780',
    districtName: 'Patna',
    localityName: 'Kankarbagh',
    course: 'Class 8 ICSE',
    subjects: 'Physics, Chemistry, Biology',
    batchTiming: '07:30 AM - 09:00 AM (Mon-Fri)',
    monthlyFee: 2200,
    isLoginActive: false,
    lastSeenText: 'Offline · Last login 2 hours ago',
    attendanceToday: 'ABSENT',
    presentDaysCount: 18,
    absentDaysCount: 4,
    subscribedAt: '2026-10-08',
  },
  {
    id: 'sub-stu-4',
    tutorId: 'tutor-bihar-2',
    tutorName: 'Satyam',
    studentId: 'u-student-1',
    studentName: 'Rakesh Sharma',
    studentEmail: 'rakesh.sharma@example.com',
    studentMobile: '9835011223',
    districtName: 'Patna',
    localityName: 'Patna City',
    course: 'Class 9 & 10 CBSE',
    subjects: 'Mathematics, Science',
    batchTiming: '05:00 PM - 06:30 PM',
    monthlyFee: 2200,
    isLoginActive: true,
    lastSeenText: 'Online Now',
    attendanceToday: 'PRESENT',
    presentDaysCount: 19,
    absentDaysCount: 1,
    subscribedAt: '2026-10-10',
  },
];

export const INITIAL_ONLINE_CLASSES: OnlineClassSessionItem[] = [
  {
    id: 'cls-live-1',
    tutorId: 'tutor-bihar-1',
    tutorName: 'Sanjeet',
    title: 'Quadratic Equations & Electricity Numericals — Live Doubt Session',
    subject: 'Mathematics & Physics',
    course: 'Class 10 CBSE / Bihar Board',
    platform: 'ZOOM',
    meetingUrl: 'https://zoom.us/j/89451203941?pwd=VidyaSetuLive',
    meetingId: '894 5120 3941',
    passcode: 'VS2026',
    scheduledDate: '2026-10-25',
    scheduledTime: '04:00 PM',
    durationMinutes: 60,
    batchTiming: '04:00 PM - 05:00 PM (Evening Batch)',
    status: 'LIVE_NOW',
    notifiedCount: 3,
    lastBroadcastAt: 'Today, 03:45 PM via WhatsApp, SMS & Email',
    createdAt: '2026-10-24T10:00:00Z',
  },
  {
    id: 'cls-live-2',
    tutorId: 'tutor-bihar-1',
    tutorName: 'Sanjeet',
    title: 'Carbon & Its Compounds + Trigonometry Revision Batch',
    subject: 'Chemistry & Mathematics',
    course: 'Class 10 CBSE',
    platform: 'GOOGLE_CLASSROOM',
    meetingUrl: 'https://meet.google.com/vsetu-bihar-pcm',
    meetingId: 'vsetu-bihar-pcm',
    passcode: 'OPEN-CLASS',
    scheduledDate: '2026-10-26',
    scheduledTime: '06:00 PM',
    durationMinutes: 90,
    batchTiming: '06:00 PM - 07:30 PM (Evening Batch)',
    status: 'UPCOMING',
    notifiedCount: 3,
    lastBroadcastAt: 'Today, 11:20 AM via WhatsApp, SMS & Email',
    createdAt: '2026-10-24T11:20:00Z',
  },
];

export const INITIAL_TUTOR_TASKS: TutorTaskItem[] = [
  {
    id: 'task-1',
    tutorId: 'tutor-bihar-1',
    tutorName: 'Sanjeet',
    uploadedByRole: 'TUTOR',
    uploadedByName: 'Sanjeet (Teacher)',
    title: 'Chapter 4: Quadratic Equations — 15 Board Exam Questions Worksheet',
    subject: 'Mathematics',
    description:
      'Solve all 15 questions from NCERT Exercise 4.3 & RD Sharma Sheet. Show complete step-by-step factorization and formula method before tomorrow 4:00 PM online class.',
    dueDate: '2026-10-26',
    dueTime: '04:00 PM',
    maxMarks: 30,
    attachmentUrl: 'https://vidyasetu.in/worksheets/class10-quadratic-sheet.pdf',
    submittedStudentIds: ['u-student-1'],
    studentSubmissions: [
      {
        studentId: 'u-student-1',
        studentName: 'Rakesh Sharma',
        answerText: 'Completed all 15 questions in notebook and verified roots for Q1 to Q15.',
        submittedAt: '24 Oct 2026, 02:15 PM',
      },
    ],
    createdAt: '2026-10-24T08:30:00Z',
  },
  {
    id: 'task-2',
    tutorId: 'tutor-bihar-1',
    tutorName: 'Sanjeet',
    uploadedByRole: 'STUDENT',
    uploadedByName: 'Rakesh Sharma (Student)',
    title: 'Doubt Task Upload: Ray Optics Numerical Q.12 & Q.14 From HC Verma',
    subject: 'Physics',
    description:
      'Uploaded my solution attempt for Concave Mirror magnification problem. Please review in the 4:00 PM Zoom class.',
    dueDate: '2026-10-25',
    dueTime: '06:00 PM',
    maxMarks: 10,
    submittedStudentIds: ['u-student-1', 'u-student-2'],
    studentSubmissions: [],
    createdAt: '2026-10-24T12:10:00Z',
  },
];

export const INITIAL_TEACHER_PAYOUTS: TeacherPayoutItem[] = [
  {
    id: 'payout-1',
    tutorId: 'tutor-bihar-1',
    tutorName: 'Sanjeet',
    bankAccountHolder: 'Sanjeet Kumar',
    bankName: 'State Bank of India (Danapur Branch)',
    bankAccountNumber: '38941205541',
    bankIfscCode: 'SBIN0001521',
    upiId: 'sanjeet.tutor@sbi',
    amount: 7200,
    monthLabel: 'October 2026 Tuition Payout (3 Subscribed Students)',
    utrNumber: 'SBIN261024889120',
    status: 'PAID',
    paidAt: '2026-10-24T09:30:00Z',
  },
  {
    id: 'payout-2',
    tutorId: 'tutor-bihar-2',
    tutorName: 'Satyam',
    bankAccountHolder: 'Satyam Prakash',
    bankName: 'HDFC Bank (Patna City Branch)',
    bankAccountNumber: '5010048291042',
    bankIfscCode: 'HDFC0000186',
    upiId: 'satyam.patna@hdfcbank',
    amount: 4400,
    monthLabel: 'October 2026 Tuition Payout',
    utrNumber: 'HDFC261023441098',
    status: 'PAID',
    paidAt: '2026-10-23T15:45:00Z',
  },
];

export const INITIAL_PROMO_OFFERS: PromoOfferItem[] = [
  {
    id: 'offer-bihar-fest',
    title: 'Bihar Board & CBSE Special Tuition Offer — Flat 50% OFF on Contact Unlock Pass!',
    subtitle:
      'Connect directly with verified Home Tutors & Online Zoom/Google Classroom Teachers across all 38 Districts of Bihar. Zero commission!',
    badgeText: 'LIMITED TIME OFFER',
    couponCode: 'BIHAR50',
    discountText: '50% OFF + Free 1st Demo Class',
    validUntil: '30 Nov 2026',
    ctaText: 'Claim Offer & Unlock Teacher Contact',
    isActive: true,
    createdAt: '2026-10-24T06:00:00Z',
  },
];

export const INITIAL_STUDENT_ACHIEVERS: StudentAchieverItem[] = [
  {
    id: 'ach-1',
    studentName: 'Ananya Kumari',
    studentPhoto:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    districtName: 'Patna (Bihar)',
    blockName: 'Danapur',
    className: 'Class 10 CBSE Board Exam',
    achievementTitle: 'Scored 97.8% in Class 10 Board (100/100 in Mathematics & 99 in Science)',
    scoreBadge: '97.8% Board Topper',
    tutorId: 'tutor-bihar-1',
    tutorName: 'Sanjeet',
    studyMode: 'BOTH',
    feedbackText:
      'Sanjeet sir taught me both at home in Danapur and via live Zoom doubt classes. His daily NCERT & RD Sharma worksheets helped me score 100/100 in Maths!',
    rating: 5,
    achievedDate: '2026-05-18',
    isApproved: true,
    isFeatured: true,
  },
  {
    id: 'ach-2',
    studentName: 'Rohan Raj Sinha',
    studentPhoto:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    districtName: 'Patna (Bihar)',
    blockName: 'Patna Sadar',
    className: 'IIT-JEE Main & Class 12 PCM',
    achievementTitle: 'Secured 99.42 Percentile in JEE Mains & District Rank 2 in Class 12 Science',
    scoreBadge: '99.42%ile JEE Main',
    tutorId: 'tutor-1',
    tutorName: 'Dr. Rajeshwar Verma',
    studyMode: 'OFFLINE',
    feedbackText:
      'Dr. Rajeshwar Verma sir’s 1-on-1 Physics and Calculus sessions at Boring Road transformed my problem-solving speed. Best home tuition platform in Bihar!',
    rating: 5,
    achievedDate: '2026-06-10',
    isApproved: true,
    isFeatured: true,
  },
  {
    id: 'ach-3',
    studentName: 'Priyanshu Kumar',
    studentPhoto:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    districtName: 'Muzaffarpur (Bihar)',
    blockName: 'Musahari (Muzaffarpur)',
    className: 'BSEB Class 12 Science (Bihar Board)',
    achievementTitle: 'Scored 95.2% in Bihar Board Inter Science (District Merit List)',
    scoreBadge: '95.2% BSEB Topper',
    tutorId: 'tutor-bihar-2',
    tutorName: 'Satyam',
    studyMode: 'ONLINE',
    feedbackText:
      'I attended Satyam sir’s evening Online Google Classroom batch from Muzaffarpur. Every single numerical doubt was solved live on screen.',
    rating: 5,
    achievedDate: '2026-04-22',
    isApproved: true,
    isFeatured: true,
  },
  {
    id: 'ach-4',
    studentName: 'Sneha झा (Jha)',
    studentPhoto:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    districtName: 'Darbhanga (Bihar)',
    blockName: 'Darbhanga Sadar',
    className: 'NEET UG Medical Entrance',
    achievementTitle: 'Qualified NEET UG with 675/720 Marks — Selected for Govt. Medical College',
    scoreBadge: '675/720 NEET UG',
    tutorId: 'tutor-bihar-4',
    tutorName: 'Chandan Kumar',
    studyMode: 'ONLINE',
    feedbackText:
      'Getting 1-on-1 Biology and Chemistry test series guidance from home in Darbhanga saved my travel time and helped me score 675/720 in NEET!',
    rating: 5,
    achievedDate: '2026-06-14',
    isApproved: true,
    isFeatured: true,
  },
];


