import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  LogOut,
  Moon,
  Sun,
  Home,
  Users,
  Shield,
  UserCheck,
  ExternalLink,
  X,
  ChevronDown,
  PlayCircle,
  MessageCircle,
  Star,
  Lock,
  CreditCard,
  Loader2,
  Award,
  Upload,
  Camera,
  Phone,
  Mail,
  MapPin,
  Plus,
  Trash2,
} from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import {
  auth,
  db,
  signInWithGoogleRole,
  signOutUser,
  handleFirestoreError,
  OperationType,
  sanitizeId,
  sanitizeString,
} from './firebase';
import {
  INITIAL_CITIES,
  INITIAL_COURSES,
  INITIAL_SUBJECTS,
  INITIAL_TUTORS,
  INITIAL_PLANS,
  INITIAL_INQUIRIES,
  INITIAL_REQUIREMENTS,
  INITIAL_REVIEWS,
  INITIAL_PAYMENTS,
  INITIAL_PAGES,
  INITIAL_BANNERS,
  INITIAL_BLOG_POSTS,
  INITIAL_EMAIL_TEMPLATES,
  INITIAL_USERS_DIRECTORY,
  INITIAL_ACTIVITY_EVENTS,
  INITIAL_BRANDING,
  INITIAL_WHATSAPP_SETTING,
  INITIAL_SOCIAL_LINKS,
  INITIAL_SECURITY_SETTINGS,
  INITIAL_PAYMENT_CONFIG,
  INITIAL_SEO_SETTINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ADMIN_CREDENTIALS,
  INITIAL_SUBSCRIBED_STUDENTS,
  INITIAL_ONLINE_CLASSES,
  INITIAL_TUTOR_TASKS,
  INITIAL_TEACHER_PAYOUTS,
  INITIAL_PROMO_OFFERS,
  TutorItem,
  CityItem,
  CourseItem,
  SubjectItem,
  InquiryItem,
  ReviewItem,
  RequirementItem,
  PricingPlanItem,
  PaymentItem,
  PageCMSItem,
  BannerItem,
  BlogPostItem,
  EmailTemplateItem,
  UserDirectoryItem,
  ActivityEventItem,
  CompanyBrandingItem,
  WhatsAppSettingItem,
  SocialLinkItem,
  SecuritySettingItem,
  PaymentConfigItem,
  SeoSettingItem,
  AuditLogItem,
  AdminCredentialsItem,
  SubscribedStudentItem,
  OnlineClassSessionItem,
  TutorTaskItem,
  TeacherPayoutItem,
  PromoOfferItem,
  StudentAchieverItem,
  INITIAL_STUDENT_ACHIEVERS,
  BIHAR_ALL_38_DISTRICTS,
  Role,
} from './data/seedData';
import {
  SocialPlatformIcon,
  SOCIAL_PLATFORM_META,
  readAndCompressImageFile,
} from './components/SocialPlatformIcon';
import { HomePhotoSlider } from './components/HomePhotoSlider';
import { BiharHomeDirectoryPanel } from './components/BiharHomeDirectoryPanel';
import { TutorProfileView } from './components/TutorProfileView';
import { InquiryModal } from './components/InquiryModal';
import {
  AuthViews,
  TutorRegistrationDetails,
  StudentLocationDetails,
  buildAutomatedTutorBio,
} from './components/AuthViews';
import { TutorDashboard, StudentDashboard } from './components/Dashboards';
import { AdminConsole, BackupSnapshotRecord, AdminModuleKey } from './components/AdminConsole';
import { BlueprintModal } from './components/BlueprintModal';
import { PWAInstallButton, OfflineIndicator } from './components/PWAComponents';

function loadLocalData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

type ScreenKey =
  | 'home'
  | 'listing'
  | 'profile'
  | 'pricing'
  | 'blog'
  | 'cms'
  | 'login'
  | 'signup'
  | 'tutor-dashboard'
  | 'student-dashboard'
  | 'admin';

export interface ActiveSessionUser {
  uid: string;
  name: string;
  email: string;
  mobile: string;
  role: Role;
  avatarUrl?: string;
  location?: StudentLocationDetails;
}

export default function App() {
  const [screen, setScreen] = useState<ScreenKey>('home');
  const [cmsSlug, setCmsSlug] = useState<'about' | 'faqs' | 'privacy' | 'terms' | 'contact'>('about');

  // Application State (Persisted in localStorage + Live Firestore Synced)
  const [cities, setCities] = useState<CityItem[]>(() =>
    loadLocalData('vsetu_cities_v3', INITIAL_CITIES)
  );
  const [courses, setCourses] = useState<CourseItem[]>(() =>
    loadLocalData('vsetu_courses_v3', INITIAL_COURSES)
  );
  const [subjects, setSubjects] = useState<SubjectItem[]>(() =>
    loadLocalData('vsetu_subjects_v3', INITIAL_SUBJECTS)
  );
  const [deletedTutorIds, setDeletedTutorIds] = useState<string[]>(() =>
    loadLocalData('vsetu_deleted_tutors_v3', [])
  );
  const [tutors, setTutors] = useState<TutorItem[]>(() =>
    loadLocalData('vsetu_tutors_v3', INITIAL_TUTORS)
  );
  const [plans, setPlans] = useState<PricingPlanItem[]>(() =>
    loadLocalData('vsetu_plans_v3', INITIAL_PLANS)
  );
  const [inquiries, setInquiries] = useState<InquiryItem[]>(() =>
    loadLocalData('vsetu_inquiries_v3', INITIAL_INQUIRIES)
  );
  const [requirements, setRequirements] = useState<RequirementItem[]>(() =>
    loadLocalData('vsetu_requirements_v3', INITIAL_REQUIREMENTS)
  );
  const [reviews, setReviews] = useState<ReviewItem[]>(() =>
    loadLocalData('vsetu_reviews_v3', INITIAL_REVIEWS)
  );
  const [payments, setPayments] = useState<PaymentItem[]>(() =>
    loadLocalData('vsetu_payments_v3', INITIAL_PAYMENTS)
  );
  const [pages, setPages] = useState<PageCMSItem[]>(() =>
    loadLocalData('vsetu_pages_v3', INITIAL_PAGES)
  );
  const [banners, setBanners] = useState<BannerItem[]>(() =>
    loadLocalData('vsetu_banners_v3', INITIAL_BANNERS)
  );
  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>(() =>
    loadLocalData('vsetu_blogs_v3', INITIAL_BLOG_POSTS)
  );
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplateItem[]>(
    INITIAL_EMAIL_TEMPLATES
  );
  const [usersDirectory, setUsersDirectory] = useState<UserDirectoryItem[]>(() =>
    loadLocalData('vsetu_users_v3', INITIAL_USERS_DIRECTORY)
  );
  const [activityEvents, setActivityEvents] = useState<ActivityEventItem[]>(
    INITIAL_ACTIVITY_EVENTS
  );

  // Admin Branding, Credentials, WhatsApp, Social, Security, Payment, SEO & Audit State
  const [branding, setBranding] = useState<CompanyBrandingItem>(() =>
    loadLocalData('vsetu_branding_v3', INITIAL_BRANDING)
  );
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentialsItem>(() =>
    loadLocalData('vsetu_admin_creds_v3', INITIAL_ADMIN_CREDENTIALS)
  );
  const [whatsappSetting, setWhatsappSetting] = useState<WhatsAppSettingItem>(() =>
    loadLocalData('vsetu_whatsapp_v3', INITIAL_WHATSAPP_SETTING)
  );
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(() =>
    loadLocalData('vsetu_social_v4', INITIAL_SOCIAL_LINKS)
  );
  const [securitySettings, setSecuritySettings] = useState<SecuritySettingItem>(() =>
    loadLocalData('vsetu_security_v3', INITIAL_SECURITY_SETTINGS)
  );
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfigItem>(() =>
    loadLocalData('vsetu_payment_cfg_v3', INITIAL_PAYMENT_CONFIG)
  );
  const [seoSettings, setSeoSettings] = useState<SeoSettingItem>(() =>
    loadLocalData('vsetu_seo_v3', INITIAL_SEO_SETTINGS)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  // Teacher Login Panel States: Subscribed Students, Live Online Classes, Shared Tasks, Teacher Bank Payouts, Home Page Offers & Student Achievers
  const [subscribedStudents, setSubscribedStudents] = useState<SubscribedStudentItem[]>(() =>
    loadLocalData('vsetu_sub_students_v3', INITIAL_SUBSCRIBED_STUDENTS)
  );
  const [onlineClasses, setOnlineClasses] = useState<OnlineClassSessionItem[]>(() =>
    loadLocalData('vsetu_online_classes_v3', INITIAL_ONLINE_CLASSES)
  );
  const [tutorTasks, setTutorTasks] = useState<TutorTaskItem[]>(() =>
    loadLocalData('vsetu_tutor_tasks_v3', INITIAL_TUTOR_TASKS)
  );
  const [teacherPayouts, setTeacherPayouts] = useState<TeacherPayoutItem[]>(() =>
    loadLocalData('vsetu_teacher_payouts_v3', INITIAL_TEACHER_PAYOUTS)
  );
  const [promoOffers, setPromoOffers] = useState<PromoOfferItem[]>(() =>
    loadLocalData('vsetu_promo_offers_v3', INITIAL_PROMO_OFFERS)
  );
  const [studentAchievers, setStudentAchievers] = useState<StudentAchieverItem[]>(() =>
    loadLocalData('vsetu_student_achievers_v1', INITIAL_STUDENT_ACHIEVERS)
  );

  // Home Page Add Student Achievement & Feedback Modal State
  const [achieverModalOpen, setAchieverModalOpen] = useState<boolean>(false);
  const [newAchName, setNewAchName] = useState<string>('');
  const [newAchPhoto, setNewAchPhoto] = useState<string>('');
  const [newAchDistrict, setNewAchDistrict] = useState<string>('Patna (Bihar)');
  const [newAchBlock, setNewAchBlock] = useState<string>('Danapur');
  const [newAchClass, setNewAchClass] = useState<string>('Class 10 CBSE Board');
  const [newAchTitle, setNewAchTitle] = useState<string>('');
  const [newAchBadge, setNewAchBadge] = useState<string>('97.5% Marks');
  const [newAchTutor, setNewAchTutor] = useState<string>('Sanjeet');
  const [newAchMode, setNewAchMode] = useState<'ONLINE' | 'OFFLINE' | 'BOTH'>('BOTH');
  const [newAchRating, setNewAchRating] = useState<number>(5);
  const [newAchFeedback, setNewAchFeedback] = useState<string>('');

  // Instant Account Credentials Dispatched Modal (Sent to Mobile SMS, Email & WhatsApp upon Signup)
  const [dispatchedCredentialsModal, setDispatchedCredentialsModal] = useState<{
    role: Role;
    name: string;
    userId: string;
    password: string;
    mobile: string;
    email: string;
  } | null>(null);

  // Persist Admin & Website Data to localStorage whenever updated via Home Page or Admin Panel
  useEffect(() => {
    try {
      localStorage.setItem('vsetu_banners_v3', JSON.stringify(banners));
      localStorage.setItem('vsetu_branding_v3', JSON.stringify(branding));
      localStorage.setItem('vsetu_admin_creds_v3', JSON.stringify(adminCredentials));
      localStorage.setItem('vsetu_tutors_v3', JSON.stringify(tutors));
      localStorage.setItem('vsetu_deleted_tutors_v3', JSON.stringify(deletedTutorIds));
      localStorage.setItem('vsetu_users_v3', JSON.stringify(usersDirectory));
      localStorage.setItem('vsetu_inquiries_v3', JSON.stringify(inquiries));
      localStorage.setItem('vsetu_requirements_v3', JSON.stringify(requirements));
      localStorage.setItem('vsetu_reviews_v3', JSON.stringify(reviews));
      localStorage.setItem('vsetu_payments_v3', JSON.stringify(payments));
      localStorage.setItem('vsetu_blogs_v3', JSON.stringify(blogPosts));
      localStorage.setItem('vsetu_cities_v3', JSON.stringify(cities));
      localStorage.setItem('vsetu_courses_v3', JSON.stringify(courses));
      localStorage.setItem('vsetu_subjects_v3', JSON.stringify(subjects));
      localStorage.setItem('vsetu_plans_v3', JSON.stringify(plans));
      localStorage.setItem('vsetu_pages_v3', JSON.stringify(pages));
      localStorage.setItem('vsetu_whatsapp_v3', JSON.stringify(whatsappSetting));
      localStorage.setItem('vsetu_social_v4', JSON.stringify(socialLinks));
      localStorage.setItem('vsetu_security_v3', JSON.stringify(securitySettings));
      localStorage.setItem('vsetu_payment_cfg_v3', JSON.stringify(paymentConfig));
      localStorage.setItem('vsetu_seo_v3', JSON.stringify(seoSettings));
      localStorage.setItem('vsetu_sub_students_v3', JSON.stringify(subscribedStudents));
      localStorage.setItem('vsetu_online_classes_v3', JSON.stringify(onlineClasses));
      localStorage.setItem('vsetu_tutor_tasks_v3', JSON.stringify(tutorTasks));
      localStorage.setItem('vsetu_teacher_payouts_v3', JSON.stringify(teacherPayouts));
      localStorage.setItem('vsetu_promo_offers_v3', JSON.stringify(promoOffers));
      localStorage.setItem('vsetu_student_achievers_v1', JSON.stringify(studentAchievers));
    } catch {
      // ignore localStorage quota limits
    }
  }, [
    banners,
    branding,
    adminCredentials,
    tutors,
    deletedTutorIds,
    usersDirectory,
    inquiries,
    requirements,
    reviews,
    payments,
    blogPosts,
    cities,
    courses,
    subjects,
    plans,
    pages,
    whatsappSetting,
    socialLinks,
    securitySettings,
    paymentConfig,
    seoSettings,
    subscribedStudents,
    onlineClasses,
    tutorTasks,
    teacherPayouts,
    promoOffers,
    studentAchievers,
  ]);

  // Payment-Gated Contact & WhatsApp Unlock State (Phone & WhatsApp stay hidden until payment!)
  const [unlockedTutorIds, setUnlockedTutorIds] = useState<string[]>([]);
  const [unlockedAllContacts, setUnlockedAllContacts] = useState<boolean>(false);
  const [paymentUnlockTutor, setPaymentUnlockTutor] = useState<{
    tutor: TutorItem;
    openWhatsAppAfter: boolean;
  } | null>(null);
  const [selectedUnlockPlan, setSelectedUnlockPlan] = useState<'single' | 'unlimited'>('single');
  const [selectedStudyMode, setSelectedStudyMode] = useState<'ONLINE' | 'OFFLINE'>('ONLINE');
  const [unlockProcessing, setUnlockProcessing] = useState<boolean>(false);

  // Sub-modals, Login Role Tab & Admin Initial Module
  const [quickRegisterOpen, setQuickRegisterOpen] = useState(false);
  const [onlineModeDefault, setOnlineModeDefault] = useState(false);
  const [explainerModal, setExplainerModal] = useState<'student' | 'tutor' | null>(null);
  const [explainerDropdownOpen, setExplainerDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [loginInitialRole, setLoginInitialRole] = useState<Role>('TUTOR');
  const [adminInitialModule, setAdminInitialModule] = useState<AdminModuleKey>('dashboard');

  // WhatsApp interactive preview drawer
  const [activeWhatsAppDrawer, setActiveWhatsAppDrawer] = useState<{
    title: string;
    phone: string;
    message: string;
    waUrl: string;
  } | null>(null);

  const [backups, setBackups] = useState<BackupSnapshotRecord[]>([
    {
      id: 'snap-initial-seed',
      label: 'Initial Production Seed Snapshot (v1.0)',
      recordCount: INITIAL_TUTORS.length + INITIAL_USERS_DIRECTORY.length + INITIAL_PAGES.length,
      checksum: 'sha256_9f84c2e1b704a31d',
      createdAt: '2026-10-24T01:00:00Z',
      payloadJson: JSON.stringify({
        tutors: INITIAL_TUTORS,
        usersDirectory: INITIAL_USERS_DIRECTORY,
        cities: INITIAL_CITIES,
      }),
    },
  ]);

  // Session & Saved Tutors
  const [currentUser, setCurrentUser] = useState<ActiveSessionUser | null>(null);
  const [savedTutorIds, setSavedTutorIds] = useState<string[]>(['tutor-bihar-1', 'tutor-1']);
  const [selectedTutor, setSelectedTutor] = useState<TutorItem>(
    () => tutors[0] || INITIAL_TUTORS[0]
  );
  const [inquiryModalTutor, setInquiryModalTutor] = useState<TutorItem | null>(null);
  const [blueprintOpen, setBlueprintOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  // Listing / Search Filters
  const [filterCity, setFilterCity] = useState<string>('all');

  // Sync Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const isOwnerAdmin = fbUser.email === 'kyp04010016@gmail.com';
        setCurrentUser((prev) => ({
          uid: fbUser.uid,
          name: fbUser.displayName || prev?.name || fbUser.email?.split('@')[0] || 'Member',
          email: fbUser.email || prev?.email || 'member@example.com',
          mobile: prev?.mobile || '9835011223',
          role: isOwnerAdmin ? 'ADMIN' : prev?.role || 'STUDENT',
          location: prev?.location,
        }));
      }
    });
    return () => unsub();
  }, []);

  // Attach Firestore listener for approved public tutors (respecting deletedTutorIds)
  useEffect(() => {
    const q = query(collection(db, 'tutors'), where('isApproved', '==', true));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteTutors: TutorItem[] = [];
          snapshot.forEach((docSnap) => {
            if (deletedTutorIds.includes(docSnap.id)) return;
            const d = docSnap.data();
            const cityName = d.cityName || 'Patna';
            const localityName = d.localityName || 'Danapur';
            const coursesArr = Array.isArray(d.courses) ? d.courses : ['Class 6 to 10 CBSE'];
            const subjectsArr = Array.isArray(d.subjects) ? d.subjects : ['Mathematics'];
            const expYrs = d.experienceYrs || 5;
            remoteTutors.push({
              id: docSnap.id,
              userId: d.userId,
              name: d.name,
              slug: d.slug,
              age: d.age || 30,
              gender: d.gender || 'Male',
              experienceYrs: expYrs,
              qualification: d.qualification || 'Bsc',
              bio:
                d.bio ||
                buildAutomatedTutorBio({
                  cityName,
                  localityName,
                  courseText: coursesArr[0] || 'Class 6 to 10 CBSE',
                  subjectsText: subjectsArr.join(', '),
                  experienceYrs: expYrs,
                  online: true,
                }),
              hourlyRate: d.hourlyRate || 300,
              monthlyRate: d.monthlyRate || 2500,
              minDurationMonths: d.minDurationMonths || 6,
              country: d.country || 'India',
              state: d.state || 'Bihar',
              blockName: d.blockName || localityName,
              cityId: d.cityId || 'patna',
              cityName,
              localityName,
              tuitionType: d.tuitionType || 'HOME_TUITION',
              isFeatured: Boolean(d.isFeatured),
              isApproved: Boolean(d.isApproved),
              emailVerified: true,
              phoneVerified: true,
              lastLogin: '24-Oct-26',
              createdAt: new Date().toISOString(),
              courses: coursesArr,
              subjects: subjectsArr,
              ratingAvg: Number(d.ratingAvg || 4.9),
              reviewCount: Number(d.reviewCount || 12),
              avatarSvgBg: '#4a89dc',
              initials: String(d.name || 'T').charAt(0).toUpperCase(),
              tutorNumericId: String(
                1584200 +
                  Math.abs(
                    docSnap.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
                  )
              ),
              pincode: d.pincode || '801503',
              preferredTime: 'AnyTime',
              memberSince: 'Oct 2026',
              categories: coursesArr[0] || 'Class 6 to 10',
              phone: '+91 94310 58415',
              email: `${String(d.name || 'tutor').toLowerCase().replace(/\s+/g, '.')}@vidyasetu.in`,
              address: `#102, ${localityName}, ${cityName}`,
              modes: {
                studentHome: true,
                tutorHome: false,
                institute: false,
                online: true,
              },
            });
          });
          setTutors((prev) => {
            const map = new Map<string, TutorItem>();
            prev.forEach((item) => {
              if (!deletedTutorIds.includes(item.id)) map.set(item.id, item);
            });
            remoteTutors.forEach((rt) => {
              if (!deletedTutorIds.includes(rt.id) && !map.has(rt.id)) {
                map.set(rt.id, rt);
              }
            });
            return Array.from(map.values());
          });
        }
      },
      () => {
        // Fallback to local state when Firestore listener is offline or restricted
      }
    );
    return () => unsub();
  }, [deletedTutorIds]);

  const logActivity = (
    action: string,
    target: string,
    severity: ActivityEventItem['severity'] = 'NOMINAL'
  ) => {
    setActivityEvents((prev) => [
      {
        id: `act-${Date.now()}`,
        actorName: currentUser?.name || 'Visitor',
        actorRole: currentUser?.role || 'STUDENT',
        action,
        target,
        timestamp: 'Just now',
        severity,
      },
      ...prev,
    ]);
  };

  // Master Delete Tutor Handler (Works from Home Page Card, Home Page Admin Bar, Profile Page, or Admin Panel)
  const handleDeleteTutor = async (tutorId: string) => {
    const target = tutors.find((t) => t.id === tutorId);
    setDeletedTutorIds((prev) => (prev.includes(tutorId) ? prev : [...prev, tutorId]));
    setTutors((prev) => {
      const remaining = prev.filter((t) => t.id !== tutorId);
      if (selectedTutor?.id === tutorId && remaining.length > 0) {
        setSelectedTutor(remaining[0]);
      }
      return remaining;
    });
    if (target?.userId) {
      setUsersDirectory((prev) => prev.filter((u) => u.id !== target.userId));
    }
    if (screen === 'profile' && selectedTutor?.id === tutorId) {
      setScreen('home');
    }
    logActivity(
      `Deleted Teacher Profile from Directory: ${target?.name || tutorId}`,
      target ? `${target.localityName}, ${target.cityName}` : tutorId,
      'WARNING'
    );

    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'tutors', sanitizeId(tutorId)));
      } catch {
        // Remote tutor delete skipped when not owner/admin in cloud
      }
    }
  };

  const handleDeleteUser = (userId: string) => {
    const targetUser = usersDirectory.find((u) => u.id === userId);
    setUsersDirectory((prev) => prev.filter((u) => u.id !== userId));
    // Also remove any linked tutor profile if this user is a TUTOR
    const linkedTutor = tutors.find((t) => t.userId === userId);
    if (linkedTutor) {
      handleDeleteTutor(linkedTutor.id);
    }
    logActivity(
      `Deleted User / Student Record: ${targetUser?.name || userId}`,
      targetUser?.email || userId,
      'WARNING'
    );
  };

  const handleDeleteRequirement = (reqId: string) => {
    const targetReq = requirements.find((r) => r.id === reqId);
    setRequirements((prev) => prev.filter((r) => r.id !== reqId));
    logActivity(
      `Deleted Student Tuition Requirement: ${targetReq?.studentName || reqId}`,
      targetReq ? `${targetReq.course} in ${targetReq.cityName}` : reqId,
      'WARNING'
    );
  };

  const isTutorContactUnlocked = (tutorId: string) => {
    if (currentUser?.role === 'ADMIN') return true;
    return unlockedAllContacts || unlockedTutorIds.includes(tutorId);
  };

  // Register a new Teacher with 100% Automated Profile Generation & Immediate Home Page Listing
  const handleRegisterNewTutorOnHomePage = async (
    name: string,
    mobile: string,
    email: string,
    details?: TutorRegistrationDetails
  ) => {
    const newTutorId = `tutor-live-${Date.now()}`;
    const userId = auth.currentUser?.uid || `u-tutor-${Date.now()}`;
    const cleanCountry = details?.country || 'India';
    const cleanState = details?.state || 'Bihar';
    const cleanCityName = details?.cityName || 'Patna';
    const cleanBlockName = details?.blockName || details?.localityName || 'Danapur Block';
    const cleanLocality = details?.localityName || 'Danapur';
    const cleanCourse = details?.courseText || 'Class 6 to 10 CBSE';
    const cleanSubjects = details?.subjectsText || 'Math, physics, chemistry';
    const expYrs = details?.experienceYrs ?? 5;
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${cleanLocality
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const autoBio =
      details?.bio ||
      buildAutomatedTutorBio({
        cityName: cleanCityName,
        localityName: cleanLocality,
        courseText: cleanCourse,
        subjectsText: cleanSubjects,
        experienceYrs: expYrs,
        online: details?.modes?.online ?? true,
      });

    const generatedNumericId = String(1584156 + tutors.length);
    const generatedLoginUserId = `TUT-${generatedNumericId}`;
    const generatedLoginPassword =
      details?.loginPassword || `Tutor@${generatedNumericId.slice(-4)}`;

    const newTutor: TutorItem = {
      id: newTutorId,
      userId,
      name,
      slug,
      age: details?.age ?? 30,
      gender: details?.gender ?? 'Male',
      experienceYrs: expYrs,
      qualification: details?.qualification || 'Bsc',
      bio: autoBio,
      hourlyRate: details?.hourlyRate ?? 300,
      monthlyRate: details?.monthlyRate ?? 2500,
      minDurationMonths: details?.minDurationMonths ?? 6,
      country: cleanCountry,
      state: cleanState,
      blockName: cleanBlockName,
      cityId: details?.cityId || 'patna',
      cityName: cleanCityName,
      localityName: cleanLocality,
      tuitionType: details?.tuitionType || 'HOME_TUITION',
      isFeatured: true,
      isApproved: true,
      emailVerified: true,
      phoneVerified: true,
      lastLogin: '24 Oct 2026',
      createdAt: new Date().toISOString(),
      courses: [cleanCourse],
      subjects: [cleanSubjects],
      ratingAvg: 5.0,
      reviewCount: 0,
      avatarUrl:
        details?.avatarUrl ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      photoUrl:
        details?.avatarUrl ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      avatarSvgBg: '#4a89dc',
      initials: name.charAt(0).toUpperCase() || 'T',
      tutorNumericId: generatedNumericId,
      pincode: details?.pincode || '801503',
      preferredTime: details?.preferredTime || 'AnyTime',
      memberSince: 'Oct 2026',
      categories: details?.categories || cleanCourse,
      phone: mobile || '+91 94310 58415',
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@vidyasetu.in`,
      address:
        details?.address ||
        `#102, ${cleanLocality}, Block: ${cleanBlockName}, ${cleanCityName}, ${cleanState}, ${cleanCountry} - ${
          details?.pincode || '801503'
        }`,
      modes: details?.modes || {
        studentHome: true,
        tutorHome: false,
        institute: false,
        online: true,
      },
      // Confidential Bank Details (Visible ONLY to Admin & Teacher)
      bankAccountHolder: details?.bankAccountHolder || name,
      bankName: details?.bankName || 'State Bank of India',
      bankAccountNumber: details?.bankAccountNumber || '',
      bankIfscCode: details?.bankIfscCode || '',
      upiId: details?.upiId || '',
      loginUserId: generatedLoginUserId,
      loginPassword: generatedLoginPassword,
      batchTimeSlots: [
        'Morning Batch: 07:00 AM – 08:30 AM',
        'Evening Batch: 05:00 PM – 06:30 PM',
        'Online Live Batch: 08:00 PM – 09:00 PM',
      ],
    };

    // Prepend to tutors state so the newly registered teacher immediately shows at #1 on the Home Page
    setTutors((prev) => [newTutor, ...prev]);
    setSelectedTutor(newTutor);

    // Immediately show Instant Account Credentials Dispatched Modal (Sent to Mobile, Email & WhatsApp)
    setDispatchedCredentialsModal({
      role: 'TUTOR',
      name,
      userId: generatedLoginUserId,
      password: generatedLoginPassword,
      mobile: newTutor.phone || mobile,
      email: newTutor.email || email,
    });

    // Also add to usersDirectory with full Bihar District, Block, Pin Code & Address for Admin visibility
    setUsersDirectory((prev) => [
      {
        id: userId,
        name,
        email: newTutor.email || email,
        phone: newTutor.phone || mobile,
        mobile: newTutor.phone || mobile,
        role: 'TUTOR',
        isActive: true,
        emailVerified: true,
        phoneVerified: true,
        country: cleanCountry,
        state: cleanState,
        districtId: newTutor.cityId,
        districtName: cleanCityName,
        blockName: cleanBlockName,
        localityName: cleanLocality,
        pincode: newTutor.pincode,
        address: newTutor.address,
        loginUserId: generatedLoginUserId,
        loginPassword: generatedLoginPassword,
        isLoginActive: true,
        createdAt: new Date().toISOString(),
        lastActivity: `Just now · Login ID:${generatedLoginUserId} in ${cleanLocality} (Block: ${cleanBlockName}, Pin: ${newTutor.pincode}), ${cleanCityName} · ₹${newTutor.monthlyRate}/month (${newTutor.minDurationMonths} Months)`,
      },
      ...prev,
    ]);

    logActivity(
      `Automated Teacher Profile Created (TutorId:${generatedNumericId}): ${name}`,
      `${cleanLocality} (${cleanBlockName}), ${cleanCityName} · ₹${newTutor.monthlyRate}/mo (${newTutor.minDurationMonths} Months)`
    );

    if (auth.currentUser?.emailVerified) {
      try {
        await setDoc(doc(db, 'tutors', sanitizeId(newTutorId)), {
          userId: sanitizeId(auth.currentUser.uid),
          name: sanitizeString(name, 100, 2),
          slug: sanitizeString(slug, 140, 2),
          age: Math.min(80, Math.max(18, newTutor.age)),
          gender: newTutor.gender,
          experienceYrs: Math.min(50, Math.max(0, newTutor.experienceYrs)),
          qualification: sanitizeString(newTutor.qualification, 200, 2),
          bio: sanitizeString(newTutor.bio, 1500, 10),
          hourlyRate: Math.min(20000, Math.max(50, newTutor.hourlyRate)),
          cityId: sanitizeId(newTutor.cityId),
          cityName: sanitizeString(newTutor.cityName, 80, 2),
          localityName: sanitizeString(newTutor.localityName, 100, 2),
          tuitionType: newTutor.tuitionType,
          isFeatured: true,
          isApproved: true,
          courses: newTutor.courses.slice(0, 10).map((c) => sanitizeString(c, 80, 1)),
          subjects: newTutor.subjects.slice(0, 15).map((s) => sanitizeString(s, 80, 1)),
          ratingAvg: 5.0,
          reviewCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch {
        // Tutor cloud sync skipped for non-Firebase local session
      }
    }
  };

  // Open WhatsApp Drawer ONLY if Paid (or if clicking general Support Desk)
  const openDirectWhatsAppDrawer = (pageKey: string, tutor?: TutorItem) => {
    const rawPhone = tutor?.phone || whatsappSetting.number;
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '') || '919900112233';
    const message = tutor
      ? `Hi ${tutor.name} (TutorId:${tutor.tutorNumericId || '1584150'})! I unlocked your contact on ${branding.companyName} and want to start tuition in ${tutor.localityName}, ${tutor.cityName} for ${tutor.subjects.join(', ')}.`
      : whatsappSetting.defaultMessage.replace('VidyaSetu', branding.companyName);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    setWhatsappSetting((prev) => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      clicksByPage: {
        ...prev.clicksByPage,
        [pageKey]: (prev.clicksByPage[pageKey] || 0) + 1,
      },
    }));

    logActivity(
      tutor
        ? `Opened Unlocked WhatsApp Chat with ${tutor.name}`
        : `Clicked Support WhatsApp Desk (${pageKey})`,
      `+${cleanPhone}`
    );

    setActiveWhatsAppDrawer({
      title: tutor
        ? `Unlocked WhatsApp Direct Chat — ${tutor.name}`
        : `${branding.companyName} WhatsApp Support Desk`,
      phone: tutor?.phone || `+${cleanPhone}`,
      message,
      waUrl,
    });
  };

  // Payment-Gated WhatsApp Handler: If clicking a Tutor's WhatsApp before payment, open Payment Modal first!
  const handleWhatsAppClick = (pageKey: string, tutor?: TutorItem) => {
    if (tutor && !isTutorContactUnlocked(tutor.id)) {
      setPaymentUnlockTutor({ tutor, openWhatsAppAfter: true });
      return;
    }
    openDirectWhatsAppDrawer(pageKey, tutor);
  };

  // Complete Payment to Unlock Teacher's Contact Number & WhatsApp (Amounts controlled from Admin Panel!)
  const handleConfirmContactUnlockPayment = async () => {
    if (!paymentUnlockTutor) return;
    setUnlockProcessing(true);
    await new Promise((r) => setTimeout(r, 600));

    const targetTutor = paymentUnlockTutor.tutor;
    const openWa = paymentUnlockTutor.openWhatsAppAfter;
    const singlePrice = paymentConfig.userContactUnlockPrice || 99;
    const unlimitedPrice = paymentConfig.userUnlimitedPassPrice || 499;
    const passMonths = paymentConfig.userPassDurationMonths || 3;

    const amount = selectedUnlockPlan === 'single' ? singlePrice : unlimitedPrice;
    const planName =
      selectedUnlockPlan === 'single'
        ? `Single Tutor Contact & WhatsApp Unlock (${targetTutor.name})`
        : `Gold Parent Pass (${passMonths} Months Unlimited Tutor Contacts & WhatsApp)`;

    if (selectedUnlockPlan === 'unlimited') {
      setUnlockedAllContacts(true);
    } else {
      setUnlockedTutorIds((prev) =>
        prev.includes(targetTutor.id) ? prev : [...prev, targetTutor.id]
      );
    }

    const newPayment: PaymentItem = {
      id: `pay-${Date.now()}`,
      userId: currentUser?.uid || 'guest-parent',
      userName: currentUser?.name || 'Verified Parent / Student',
      planId: selectedUnlockPlan === 'single' ? 'plan-contact-single' : 'plan-gold-unlimited',
      planName,
      amount,
      currency: 'INR',
      status: 'PAID',
      razorpayId: `pay_Rzp${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Also auto-subscribe this Student/Parent to the Teacher so they appear in Teacher's Subscribed Students Panel & receive Online Class links!
    setSubscribedStudents((prev) => {
      const stuUserId = currentUser?.uid || 'u-student-1';
      const alreadySub = prev.some(
        (s) => s.tutorId === targetTutor.id && s.studentId === stuUserId
      );
      if (alreadySub) return prev;
      return [
        {
          id: `sub-${Date.now()}`,
          tutorId: targetTutor.id,
          tutorName: targetTutor.name,
          studentId: stuUserId,
          studentName: currentUser?.name || 'Verified Student',
          studentEmail: currentUser?.email || 'student@vidyasetu.in',
          studentMobile: currentUser?.mobile || '+91 91234 56780',
          districtName: currentUser?.location?.districtName || targetTutor.cityName,
          localityName: currentUser?.location?.localityName || targetTutor.localityName || 'Sadar',
          course: targetTutor.courses[0] || 'Class 10 CBSE',
          subjects: targetTutor.subjects.join(', ') || 'Mathematics, Science',
          batchTiming: targetTutor.batchTimeSlots?.[0] || 'Evening 05:00 PM – 06:30 PM',
          monthlyFee: targetTutor.monthlyRate || 2500,
          isLoginActive: true,
          lastSeenText: 'Online Now (Active)',
          attendanceToday: 'PRESENT',
          presentDaysCount: 1,
          absentDaysCount: 0,
          studyMode: selectedStudyMode,
          subscribedAt: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ];
    });

    logActivity(
      `Completed Payment (₹${amount}) to Unlock Contact & Subscribe to ${targetTutor.name}`,
      newPayment.razorpayId,
      'NOMINAL'
    );

    setUnlockProcessing(false);
    setPaymentUnlockTutor(null);

    if (openWa) {
      openDirectWhatsAppDrawer('profile', targetTutor);
    }
  };

  const handleToggleSaveTutor = (tutorId: string) => {
    setSavedTutorIds((prev) =>
      prev.includes(tutorId) ? prev.filter((id) => id !== tutorId) : [...prev, tutorId]
    );
  };

  const handleSendInquiry = async (data: {
    tutorId: string;
    tutorUserId: string;
    tutorName: string;
    name: string;
    email: string;
    mobile: string;
    message: string;
  }) => {
    const newId = `inq-${Date.now()}`;
    const newInquiry: InquiryItem = {
      id: newId,
      tutorId: data.tutorId,
      tutorUserId: data.tutorUserId,
      tutorName: data.tutorName,
      userId: currentUser?.uid || 'guest-student',
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      message: data.message,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };
    setInquiries((prev) => [newInquiry, ...prev]);
    logActivity(`Sent Demo Class / Tuition Request to ${data.tutorName}`, `${data.name} (${data.mobile})`);

    if (auth.currentUser?.emailVerified) {
      try {
        await setDoc(doc(db, 'inquiries', sanitizeId(newId)), {
          tutorId: sanitizeId(data.tutorId),
          tutorUserId: sanitizeId(data.tutorUserId),
          tutorName: sanitizeString(data.tutorName, 100, 1),
          userId: sanitizeId(auth.currentUser.uid),
          name: sanitizeString(data.name, 100, 2),
          email: sanitizeString(data.email, 150, 3),
          mobile: sanitizeString(data.mobile, 20, 5),
          message: sanitizeString(data.message, 1000, 5),
          status: 'NEW',
          createdAt: serverTimestamp(),
        });
      } catch {
        // Inquiry cloud sync skipped for guest session
      }
    }
  };

  const handleCreateCloudBackup = async (label: string) => {
    const backupId = `backup-${Date.now()}`;
    const serialized = JSON.stringify({
      tutors,
      usersDirectory,
      cities,
      inquiries,
      requirements,
      branding,
      whatsappSetting,
      securitySettings,
      paymentConfig,
    }).slice(0, 480000);
    const checksum = `sha256_${Math.abs(
      serialized.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
    ).toString(16)}`;
    const recordCount = tutors.length + usersDirectory.length + inquiries.length + requirements.length;

    const snapshotRecord: BackupSnapshotRecord = {
      id: backupId,
      label: sanitizeString(label, 120, 2),
      recordCount,
      checksum,
      createdAt: new Date().toISOString(),
      payloadJson: serialized,
    };

    setBackups((prev) => [snapshotRecord, ...prev]);
    logActivity(`Created Asmuth User Data Backup Snapshot: ${label}`, `Checksum ${checksum}`, 'SECURITY');

    if (auth.currentUser && auth.currentUser.email === 'kyp04010016@gmail.com') {
      try {
        await setDoc(doc(db, 'backups', sanitizeId(backupId)), {
          createdByUid: sanitizeId(auth.currentUser.uid),
          label: sanitizeString(label, 120, 2),
          recordCount,
          checksum: sanitizeString(checksum, 64, 6),
          payloadJson: serialized,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `backups/${backupId}`);
      }
    }
  };

  const handleRestoreBackup = (snapshot: BackupSnapshotRecord) => {
    try {
      const parsed = JSON.parse(snapshot.payloadJson);
      if (Array.isArray(parsed.tutors)) setTutors(parsed.tutors);
      if (Array.isArray(parsed.usersDirectory)) setUsersDirectory(parsed.usersDirectory);
      if (Array.isArray(parsed.cities)) setCities(parsed.cities);
      if (parsed.branding) setBranding(parsed.branding);
      if (parsed.paymentConfig) setPaymentConfig(parsed.paymentConfig);
      logActivity(`Restored User & Directory State from Snapshot`, snapshot.label, 'SECURITY');
    } catch {
      // Ignore malformed backup JSON
    }
  };

  // JSON-LD Structured Data for Tutor Profile SEO
  const tutorJsonLd = useMemo(() => {
    return JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: selectedTutor.name,
        jobTitle: 'Verified Home Tutor',
        description: selectedTutor.bio,
        address: {
          '@type': 'PostalAddress',
          addressLocality: selectedTutor.localityName,
          addressRegion: selectedTutor.cityName,
          postalCode: selectedTutor.pincode || '801503',
          addressCountry: 'IN',
        },
        makesOffer: {
          '@type': 'Offer',
          price: selectedTutor.monthlyRate || selectedTutor.hourlyRate,
          priceCurrency: 'INR',
        },
      },
      null,
      2
    );
  }, [selectedTutor]);

  const showFloatingWhatsApp =
    whatsappSetting.isActive &&
    (whatsappSetting.showOnPages.includes(screen) ||
      (screen === 'cms' && whatsappSetting.showOnPages.includes(cmsSlug)));

  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <div
      className={`min-h-screen flex flex-col pb-14 md:pb-0 transition-colors ${
        branding.darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F5F7FA] text-[#0F172A]'
      }`}
    >
      {/* PWA Offline Indicator */}
      <OfflineIndicator />

      {/* Maintenance Mode Notice (Admin-Toggleable) */}
      {branding.maintenanceMode && (
        <div className="bg-amber-500 text-slate-950 px-6 py-2 text-xs font-semibold flex items-center justify-between gap-4">
          <span>⚠️ Maintenance Mode Active: {branding.maintenanceMessage}</span>
          <button
            type="button"
            onClick={() => setBranding((prev) => ({ ...prev, maintenanceMode: false }))}
            className="underline font-bold shrink-0"
          >
            Disable Maintenance
          </button>
        </div>
      )}

      {/* STICKY TOP BRAND HEADER + NAVIGATION BAR (Never Hides When Scrolling & Public Admin Login Button Hidden!) */}
      <div className="sticky top-0 z-50 shadow-sm">
        <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setScreen('home')}
              className="inline-flex items-center gap-2.5 font-display text-lg sm:text-xl font-bold tracking-tight text-[#084d75] dark:text-white whitespace-nowrap shrink-0 cursor-pointer"
            >
              {branding.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt={branding.companyName}
                  style={{ height: `${branding.logoHeightPx || 40}px` }}
                  className="w-auto max-w-[160px] object-contain shrink-0"
                />
              ) : (
                <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-[#3b6ef5] to-[#084d75] text-white flex items-center justify-center font-display font-extrabold text-sm sm:text-base shadow-2xs shrink-0">
                  {branding.companyName.charAt(0)}
                </span>
              )}
              {(branding.showLogoText !== false || !branding.logoUrl) && (
                <span>{branding.companyName}</span>
              )}
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setAdminInitialModule('settings-general');
                  setScreen('admin');
                }}
                title="Upload or Change Website Logo in Admin Panel"
                className="px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/70 text-[#e66000] dark:text-amber-300 text-[10px] font-extrabold inline-flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Camera className="w-3 h-3" />
                <span className="hidden sm:inline">Change Logo</span>
              </button>
            )}
            <span className="hidden lg:inline-block text-xs text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700 pl-3">
              Home Tutors &amp; Online Tutors in All 38 Bihar Districts &amp; India
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <PWAInstallButton />
            <button
              type="button"
              onClick={() => setBranding((prev) => ({ ...prev, darkMode: !prev.darkMode }))}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              {branding.darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser.role === 'ADMIN') setScreen('admin');
                    else if (currentUser.role === 'TUTOR') setScreen('tutor-dashboard');
                    else setScreen('student-dashboard');
                  }}
                  className="px-3 sm:px-3.5 py-1.5 text-xs font-bold text-white bg-[#084d75] rounded-md hover:bg-[#063a58] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {currentUser.role === 'TUTOR'
                    ? `👨‍🏫 Teacher Panel (${currentUser.name.split(' ')[0]})`
                    : currentUser.role === 'ADMIN'
                    ? `🛡️ Admin Console`
                    : `🎓 Student Panel (${currentUser.name.split(' ')[0]})`}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginInitialRole('TUTOR');
                    setScreen('login');
                  }}
                  className="px-2.5 sm:px-3.5 py-1.5 text-xs font-bold text-white bg-[#084d75] hover:bg-[#063a58] rounded-md transition-colors whitespace-nowrap cursor-pointer"
                >
                  👨‍🏫 Teacher / User Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginInitialRole('TUTOR');
                    setScreen('signup');
                  }}
                  className="px-2.5 sm:px-3.5 py-1.5 text-xs font-bold text-white bg-[#ff6600] rounded-md hover:bg-[#e05500] transition-colors whitespace-nowrap cursor-pointer"
                >
                  Sign Up (OTP)
                </button>
              </div>
            )}
          </div>
        </header>

        {/* CLASSIC BLUE TEXTURED NAVIGATION BAR (Matches image_28d37d83.png) */}
        <nav
          aria-label="Primary Directory Navigation"
          className="bg-[#2b5d80] border-b-2 border-[#1b3f59] text-white shadow-sm"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 0), linear-gradient(180deg, #2f668c 0%, #234e6d 100%)',
            backgroundSize: '16px 16px, 100% 100%',
          }}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-6 flex flex-wrap items-center justify-center md:justify-between gap-x-5 gap-y-1 py-2 text-[13px] sm:text-[14px] font-semibold">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
              {/* 1. Home */}
              <button
                type="button"
                onClick={() => {
                  setOnlineModeDefault(false);
                  setFilterCity('all');
                  setScreen('home');
                }}
                className={`inline-flex items-center gap-1.5 py-1 hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer ${
                  screen === 'home' && !onlineModeDefault
                    ? 'text-amber-300 underline underline-offset-4'
                    : 'text-white'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>

              {/* 2. How It Works */}
              <button
                type="button"
                onClick={() => {
                  setScreen('home');
                  setTimeout(() => {
                    document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                }}
                className="py-1 hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer"
              >
                How It Works
              </button>

              {/* 3. Explainer Videos Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setExplainerDropdownOpen((prev) => !prev);
                    setMoreDropdownOpen(false);
                  }}
                  className="inline-flex items-center gap-1 py-1 hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Explainer Videos</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {explainerDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg py-1.5 z-50 text-xs text-slate-800 dark:text-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setExplainerDropdownOpen(false);
                        setExplainerModal('student');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <PlayCircle className="w-4 h-4 text-[#ff6600]" />
                      <span>For Students / Parents</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExplainerDropdownOpen(false);
                        setExplainerModal('tutor');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <PlayCircle className="w-4 h-4 text-[#0088cc]" />
                      <span>For Home / Online Tutors</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 4. I Need A Tutor */}
              <button
                type="button"
                onClick={() => {
                  setScreen('student-dashboard');
                }}
                className={`py-1 hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer ${
                  screen === 'student-dashboard' ? 'text-amber-300 underline underline-offset-4' : ''
                }`}
              >
                I Need A Tutor
              </button>

              {/* 5. Join As Tutor */}
              <button
                type="button"
                onClick={() => {
                  setScreen('home');
                  setQuickRegisterOpen(true);
                }}
                className="py-1 text-amber-300 hover:text-white transition-colors whitespace-nowrap cursor-pointer font-bold"
              >
                Join As Tutor
              </button>

              {/* 6. Online Tuitions */}
              <button
                type="button"
                onClick={() => {
                  setOnlineModeDefault(true);
                  setScreen('listing');
                }}
                className={`py-1 hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer ${
                  screen === 'listing' && onlineModeDefault ? 'text-amber-300 underline underline-offset-4' : ''
                }`}
              >
                Online Tuitions
              </button>

              {/* 7. Pricing */}
              <button
                type="button"
                onClick={() => setScreen('pricing')}
                className={`py-1 hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer ${
                  screen === 'pricing' ? 'text-amber-300 underline underline-offset-4' : ''
                }`}
              >
                Pricing
              </button>

              {/* 8. Teacher Login Panel */}
              <button
                type="button"
                onClick={() => {
                  if (currentUser?.role === 'TUTOR') {
                    setScreen('tutor-dashboard');
                  } else {
                    setLoginInitialRole('TUTOR');
                    setScreen('login');
                  }
                }}
                className={`py-1 hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer ${
                  screen === 'tutor-dashboard' ? 'text-amber-300 underline underline-offset-4 font-bold' : ''
                }`}
              >
                Teacher Panel
              </button>

              {/* 9. More Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setMoreDropdownOpen((prev) => !prev);
                    setExplainerDropdownOpen(false);
                  }}
                  className="inline-flex items-center gap-1 py-1 hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>More</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {moreDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg py-1.5 z-50 text-xs text-slate-800 dark:text-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        setScreen('tutor-dashboard');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-[#084d75]"
                    >
                      👨‍🏫 Teacher Classroom &amp; Live Panel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        setScreen('student-dashboard');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-emerald-700"
                    >
                      🎓 Student Live Classes &amp; Tasks
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        setBlueprintOpen(true);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Master Blueprint (Step 1–7 Code)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        setScreen('blog');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Academic Blog
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        setCmsSlug('contact');
                        setScreen('cms');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Contact &amp; WhatsApp Desk
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setAdminInitialModule('dashboard');
                  setScreen('admin');
                }}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-amber-400 text-slate-950 text-xs font-bold whitespace-nowrap cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Owner Admin Panel</span>
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Sub-navigation bar when signed in */}
      {currentUser && (
        <div className="bg-slate-900 text-slate-100 px-6 py-1.5 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">
              Signed in as <strong>{currentUser.name}</strong> ({currentUser.role})
              {currentUser.location && (
                <span className="ml-2 text-amber-300">
                  · 📍 {currentUser.location.localityName}, Block: {currentUser.location.blockName},{' '}
                  {currentUser.location.districtName} ({currentUser.location.pincode})
                </span>
              )}
              {unlockedAllContacts && (
                <span className="ml-2 text-emerald-300 font-semibold">
                  · ✓ Gold Contact Pass Active
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setAdminInitialModule('dashboard');
                  setScreen('admin');
                }}
                className="text-amber-300 hover:text-white font-bold underline whitespace-nowrap"
              >
                Open Full Admin Console
              </button>
            )}
            <button
              type="button"
              onClick={() => setBlueprintOpen(true)}
              className="text-amber-300 hover:text-white underline whitespace-nowrap"
            >
              Inspect Step 1–7 Code
            </button>
            <button
              type="button"
              onClick={async () => {
                await signOutUser();
                setCurrentUser(null);
                setScreen('home');
              }}
              className="inline-flex items-center gap-1 text-slate-200 hover:text-white whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT WITH SMOOTH PAGE TRANSITIONS */}
      <div key={screen + cmsSlug + String(onlineModeDefault)} className="flex-1 animate-page-transition">
        {/* ==================== PUBLIC HOME PAGE ==================== */}
        {screen === 'home' && (
          <div>
            {/* ANIMATED HOME PAGE PHOTO SLIDER (Controlled from Admin Panel Module 13) */}
            <HomePhotoSlider
              banners={banners}
              isAdmin={isAdmin}
              onFindTutorClick={() => {
                window.scrollTo({ top: 380, behavior: 'smooth' });
              }}
              onJoinTutorClick={() => {
                setQuickRegisterOpen(true);
              }}
              onOnlineTuitionClick={() => {
                setOnlineModeDefault(true);
                setScreen('listing');
              }}
              onPostRequirementClick={() => {
                setScreen('student-dashboard');
              }}
              onOpenAdminBannerManager={() => {
                setAdminInitialModule('banners');
                setScreen('admin');
              }}
            />

            {/* PRIMARY DIRECTORY PANEL ON HOME PAGE: "Home tutors / Online tutors in Bihar" + All 38 Bihar Districts + Nearby Finder + Owner Admin Direct Control */}
            <BiharHomeDirectoryPanel
              tutors={tutors}
              cities={cities}
              savedTutorIds={savedTutorIds}
              whatsappActive={whatsappSetting.isActive}
              selectedCityId={filterCity}
              onSelectCityId={setFilterCity}
              onToggleSave={handleToggleSaveTutor}
              onSelectProfile={(t) => {
                setSelectedTutor(t);
                setScreen('profile');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenInquiry={(t) => setInquiryModalTutor(t)}
              onWhatsAppClick={(t) => handleWhatsAppClick('home', t)}
              onQuickRegisterTutor={async (name, mobile, email, details) => {
                await handleRegisterNewTutorOnHomePage(name, mobile, email, details);
              }}
              quickRegisterOpen={quickRegisterOpen}
              setQuickRegisterOpen={setQuickRegisterOpen}
              initialOnlineOnly={false}
              isAdmin={isAdmin}
              onDeleteTutor={handleDeleteTutor}
              onToggleApproveTutor={(tutorId) => {
                setTutors((prev) =>
                  prev.map((t) => (t.id === tutorId ? { ...t, isApproved: !t.isApproved } : t))
                );
                logActivity(`Toggled Teacher Approval on Home Page`, tutorId);
              }}
              onToggleFeatureTutor={(tutorId) => {
                setTutors((prev) =>
                  prev.map((t) => (t.id === tutorId ? { ...t, isFeatured: !t.isFeatured } : t))
                );
                logActivity(`Toggled Teacher Featured Badge on Home Page`, tutorId);
              }}
              usersDirectory={usersDirectory}
              requirements={requirements}
              onDeleteUser={handleDeleteUser}
              onDeleteRequirement={handleDeleteRequirement}
              onOpenAdminPanel={() => {
                setAdminInitialModule('dashboard');
                setScreen('admin');
              }}
              promoOffers={promoOffers}
              onAddPromoOffer={(offerData) => {
                setPromoOffers((prev) => [{ id: `offer-${Date.now()}`, ...offerData }, ...prev]);
                logActivity(`Published Home Page Promotional Offer: ${offerData.title}`, offerData.discountText);
              }}
              onTogglePromoOffer={(offerId) => {
                setPromoOffers((prev) =>
                  prev.map((o) => (o.id === offerId ? { ...o, isActive: !o.isActive } : o))
                );
              }}
              onDeletePromoOffer={(offerId) => {
                setPromoOffers((prev) => prev.filter((o) => o.id !== offerId));
              }}
              studentLocation={
                currentUser?.location
                  ? {
                      districtId: currentUser.location.districtId,
                      districtName: currentUser.location.districtName,
                      blockName: currentUser.location.blockName,
                      localityName: currentUser.location.localityName,
                      pincode: currentUser.location.pincode,
                    }
                  : null
              }
            />

            {/* ==================== STAR STUDENT ACHIEVERS & VERIFIED FEEDBACK SHOWCASE (VISIBLE TO ALL ON HOME PAGE) ==================== */}
            <section
              id="achievers-showcase-section"
              className="bg-gradient-to-b from-slate-50 via-white to-blue-50/40 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-t border-slate-200 dark:border-slate-800 py-14"
            >
              <div className="max-w-7xl mx-auto px-6 space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-[#e66000] dark:text-amber-300 text-xs font-extrabold uppercase tracking-wider">
                      <Award className="w-3.5 h-3.5" />
                      <span>Star Student Achievers &amp; Verified Feedback</span>
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#084d75] dark:text-white mt-2">
                      Our Top Achiever Students &amp; Their Feedback (हमारे होनहार छात्र और उनका फीडबैक)
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                      Real board exam toppers, IIT-JEE &amp; NEET qualifiers mentored by verified home and online teachers across all 38 districts of Bihar &amp; India.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setNewAchName(currentUser?.name || '');
                        setNewAchPhoto(currentUser?.avatarUrl || '');
                        setAchieverModalOpen(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#ff6600] hover:bg-[#e05500] text-white text-xs font-extrabold inline-flex items-center gap-2 shadow-sm cursor-pointer transition-transform hover:scale-[1.01]"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Student Achievement &amp; Feedback (अपनी उपलब्धि और फीडबैक जोड़ें)</span>
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setAdminInitialModule('reviews');
                          setScreen('admin');
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-[#084d75] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Manage in Admin Panel</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Achievers & Feedback Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {studentAchievers
                    .filter((ach) => ach.isApproved || isAdmin)
                    .map((ach) => (
                      <article
                        key={ach.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
                      >
                        <div className="space-y-3.5">
                          {/* Student Photo + Score Badge + Name */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  ach.studentPhoto ||
                                  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80'
                                }
                                alt={ach.studentName}
                                className="w-14 h-14 rounded-full object-cover border-2 border-[#084d75] shadow-xs shrink-0"
                              />
                              <div>
                                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white leading-snug">
                                  {ach.studentName}
                                </h3>
                                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                  📍 {ach.blockName}, {ach.districtName}
                                </p>
                                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#ff6600] to-[#f7941d] text-white text-[10px] font-extrabold tracking-wide shadow-2xs">
                                  🏆 {ach.scoreBadge}
                                </span>
                              </div>
                            </div>

                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => {
                                  setStudentAchievers((prev) =>
                                    prev.filter((item) => item.id !== ach.id)
                                  );
                                  logActivity(
                                    `Deleted Student Achiever from Home Page: ${ach.studentName}`,
                                    ach.scoreBadge
                                  );
                                }}
                                title="Delete Achiever Card"
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer shrink-0"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Achievement Details Box */}
                          <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#084d75] dark:text-amber-300">
                              {ach.className}
                            </p>
                            <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                              {ach.achievementTitle}
                            </p>
                          </div>

                          {/* Verified Feedback Quote */}
                          <blockquote className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                            &ldquo;{ach.feedbackText}&rdquo;
                          </blockquote>
                        </div>

                        {/* Footer: Star Rating + Teacher Name + Study Mode */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-[11px]">
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {Array.from({ length: ach.rating || 5 }).map((_, idx) => (
                              <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-[#084d75] dark:text-amber-300">
                              Teacher: {ach.tutorName}
                            </span>
                            <span className="ml-1.5 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                              {ach.studyMode === 'ONLINE'
                                ? 'Online'
                                : ach.studyMode === 'OFFLINE'
                                ? 'Offline'
                                : 'Online+Home'}
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                </div>
              </div>
            </section>

            {/* How It Works + Parent Testimonials Section Below Directory */}
            <section
              id="how-it-works-section"
              className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-14"
            >
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-6 space-y-6">
                    <div>
                      <p className="text-xs font-semibold text-[#f7941d] uppercase tracking-wider">
                        38 Bihar Districts · Self-Entered Block &amp; Pin Code · Dual OTP Security
                      </p>
                      <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        How {branding.companyName} Works for Bihar &amp; India Families
                      </h2>
                    </div>

                    <div className="space-y-5">
                      <div className="pb-5 border-b border-slate-200 dark:border-slate-800">
                        <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                          01. Search by Bihar District, Block, Pin Code or Nearby Location
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                          Select any of the 38 districts of Bihar (Country: India), enter your Block, Pin Code, and Full Address, and immediately discover nearby registered teachers around your area.
                        </p>
                      </div>
                      <div className="pb-5 border-b border-slate-200 dark:border-slate-800">
                        <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                          02. Teacher Monthly Tuition Fee &amp; Admin-Controlled Contact Unlock
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                          Every teacher sets their own Monthly Tuition Fee (₹/Month) and Course Duration (in Months), while the Admin Panel controls the user contact unlock fee (₹{paymentConfig.userContactUnlockPrice}).
                        </p>
                      </div>
                      <div>
                        <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                          03. Single Dual-Channel OTP Verification on Login &amp; Signup
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                          Both Login and Signup require verifying a single 6-digit OTP dispatched simultaneously to both the user&apos;s Mobile Number and Email ID.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Attributable Parent Testimonials */}
                  <div className="lg:col-span-6 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-[#f7941d] uppercase tracking-wider">
                        Verified Outcomes
                      </p>
                      <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        Parent &amp; Student Reviews
                      </h2>
                    </div>

                    {reviews
                      .filter((r) => r.isApproved)
                      .slice(0, 3)
                      .map((rev) => (
                        <blockquote
                          key={rev.id}
                          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-2"
                        >
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            &ldquo;{rev.comment}&rdquo;
                          </p>
                          <footer className="text-xs text-slate-500 pt-1 flex items-center justify-between">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {rev.reviewerName}
                            </span>
                            <span>Mentored by {rev.tutorName}</span>
                          </footer>
                        </blockquote>
                      ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ==================== TUTOR PROFILE PAGE (Matches image_8723163d.png!) ==================== */}
        {screen === 'profile' && (
          <div>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: tutorJsonLd }}
            />
            <TutorProfileView
              tutor={selectedTutor}
              allTutors={tutors}
              reviews={reviews}
              savedTutorIds={savedTutorIds}
              isContactUnlocked={isTutorContactUnlocked(selectedTutor.id)}
              unlockFeePrice={paymentConfig.userContactUnlockPrice || 99}
              isAdmin={isAdmin}
              onDeleteTutor={handleDeleteTutor}
              onAdminUpdateTutor={(updated) => {
                setTutors((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
                setSelectedTutor(updated);
                logActivity(
                  `Admin Updated Teacher Profile (${updated.name})`,
                  `Monthly: ₹${updated.monthlyRate}/mo · ${updated.minDurationMonths} Months`
                );
              }}
              onBack={() => setScreen('home')}
              onRequestDemo={(t) => setInquiryModalTutor(t)}
              onOpenPaymentUnlockModal={(t) =>
                setPaymentUnlockTutor({ tutor: t, openWhatsAppAfter: false })
              }
              onWhatsAppClick={(t) => handleWhatsAppClick('profile', t)}
              onPostTuitionNeeds={() => {
                setScreen('student-dashboard');
              }}
              onPostProfileForFree={() => {
                setScreen('home');
                setQuickRegisterOpen(true);
              }}
              onSelectSimilarTutor={(sim) => {
                setSelectedTutor(sim);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onToggleSave={handleToggleSaveTutor}
              onSubmitReview={(rating, comment) => {
                const newRev: ReviewItem = {
                  id: `rev-${Date.now()}`,
                  tutorId: selectedTutor.id,
                  tutorName: selectedTutor.name,
                  userId: currentUser?.uid || 'u-student-1',
                  reviewerName: currentUser?.name || 'Verified Parent',
                  rating,
                  comment,
                  isApproved: true,
                  createdAt: new Date().toISOString(),
                };
                setReviews((prev) => [newRev, ...prev]);
                logActivity(`Submitted ${rating}-star review for ${selectedTutor.name}`, comment);
              }}
            />
          </div>
        )}

        {/* ==================== PRICING PAGE (From Navbar "Pricing" Link) ==================== */}
        {screen === 'pricing' && (
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-xs font-semibold text-[#ff6600] uppercase tracking-wider">
                Admin-Configured User &amp; Teacher Membership Plans
              </p>
              <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white mt-1">
                Tutor &amp; Parent Contact Unlock Plans
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                Single Teacher Contact Unlock: <strong>₹{paymentConfig.userContactUnlockPrice}</strong> · Unlimited Pass ({paymentConfig.userPassDurationMonths} Months): <strong>₹{paymentConfig.userUnlimitedPassPrice}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans
                .filter((p) => p.isActive)
                .map((plan) => (
                  <div
                    key={plan.id}
                    className={`bg-white dark:bg-slate-900 rounded-xl p-7 border flex flex-col justify-between ${
                      plan.isPopular
                        ? 'border-2 border-[#ff6600] shadow-md'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-[#0088cc]">
                          {plan.audience}
                        </span>
                        {plan.isPopular && (
                          <span className="px-2.5 py-0.5 text-[11px] font-bold bg-[#ff6600] text-white rounded-xs">
                            MOST POPULAR
                          </span>
                        )}
                      </div>
                      <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mt-2">
                        {plan.name}
                      </h2>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="font-mono text-3xl font-bold text-slate-900 dark:text-white">
                          ₹{plan.price}
                        </span>
                        <span className="text-xs text-slate-500">/ {plan.durationDays} days</span>
                      </div>

                      <ul className="mt-6 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (plan.audience.toLowerCase().includes('parent')) {
                          setPaymentUnlockTutor({
                            tutor: selectedTutor,
                            openWhatsAppAfter: false,
                          });
                        } else {
                          setScreen('tutor-dashboard');
                        }
                      }}
                      className="mt-8 w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wide text-white bg-[#2c7a9b] hover:bg-[#1f5c77] rounded-xs transition-colors cursor-pointer"
                    >
                      Select {plan.name}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ==================== TUTOR LISTING & ONLINE TUITIONS PAGE ==================== */}
        {screen === 'listing' && (
          <BiharHomeDirectoryPanel
            tutors={tutors}
            cities={cities}
            savedTutorIds={savedTutorIds}
            whatsappActive={whatsappSetting.isActive}
            selectedCityId={filterCity}
            onSelectCityId={setFilterCity}
            onToggleSave={handleToggleSaveTutor}
            onSelectProfile={(t) => {
              setSelectedTutor(t);
              setScreen('profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenInquiry={(t) => setInquiryModalTutor(t)}
            onWhatsAppClick={(t) => handleWhatsAppClick('listing', t)}
            onQuickRegisterTutor={handleRegisterNewTutorOnHomePage}
            quickRegisterOpen={quickRegisterOpen}
            setQuickRegisterOpen={setQuickRegisterOpen}
            initialOnlineOnly={onlineModeDefault}
            isAdmin={isAdmin}
            onDeleteTutor={handleDeleteTutor}
            onToggleApproveTutor={(tutorId) => {
              setTutors((prev) =>
                prev.map((t) => (t.id === tutorId ? { ...t, isApproved: !t.isApproved } : t))
              );
            }}
            onToggleFeatureTutor={(tutorId) => {
              setTutors((prev) =>
                prev.map((t) => (t.id === tutorId ? { ...t, isFeatured: !t.isFeatured } : t))
              );
            }}
            usersDirectory={usersDirectory}
            requirements={requirements}
            onDeleteUser={handleDeleteUser}
            onDeleteRequirement={handleDeleteRequirement}
            onOpenAdminPanel={() => {
              setAdminInitialModule('dashboard');
              setScreen('admin');
            }}
            promoOffers={promoOffers}
            onAddPromoOffer={(offerData) => {
              setPromoOffers((prev) => [{ id: `offer-${Date.now()}`, ...offerData }, ...prev]);
            }}
            onTogglePromoOffer={(offerId) => {
              setPromoOffers((prev) =>
                prev.map((o) => (o.id === offerId ? { ...o, isActive: !o.isActive } : o))
              );
            }}
            onDeletePromoOffer={(offerId) => {
              setPromoOffers((prev) => prev.filter((o) => o.id !== offerId));
            }}
            studentLocation={
              currentUser?.location
                ? {
                    districtId: currentUser.location.districtId,
                    districtName: currentUser.location.districtName,
                    blockName: currentUser.location.blockName,
                    localityName: currentUser.location.localityName,
                    pincode: currentUser.location.pincode,
                  }
                : null
            }
          />
        )}

        {/* ==================== BLOG PAGE (/blog) ==================== */}
        {screen === 'blog' && (
          <div className="max-w-5xl mx-auto px-6 py-10">
            <div className="pb-6 border-b border-slate-200 dark:border-slate-800 mb-8">
              <p className="text-xs font-semibold text-[#f7941d] uppercase tracking-wider">
                Editorial &amp; Exam Strategy
              </p>
              <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {branding.companyName} Academic Journal
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts
                .filter((b) => b.isPublished)
                .map((post) => (
                  <article
                    key={post.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{post.category}</span>
                        <span>·</span>
                        <span>{post.readTime}</span>
                        <span>·</span>
                        <span>{post.createdAt.slice(0, 10)}</span>
                      </div>
                      <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mt-2">
                        {post.title}
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                        {selectedBlogId === post.id ? post.content : post.excerpt}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedBlogId(selectedBlogId === post.id ? null : post.id)
                      }
                      className="text-xs font-semibold text-[#084d75] dark:text-blue-400 hover:underline self-start"
                    >
                      {selectedBlogId === post.id ? 'Show Less' : 'Read Full Article →'}
                    </button>
                  </article>
                ))}
            </div>
          </div>
        )}

        {/* ==================== CMS PAGES (About, FAQs, Privacy, Terms, Contact) ==================== */}
        {screen === 'cms' && (
          <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="flex flex-wrap gap-2 mb-6">
              {(['about', 'faqs', 'privacy', 'terms', 'contact'] as const).map((slug) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => setCmsSlug(slug)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg capitalize ${
                    cmsSlug === slug
                      ? 'bg-[#084d75] text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {slug}
                </button>
              ))}
            </div>

            {cmsSlug === 'contact' ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-7 space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                    Contact {branding.companyName} Support Desk
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Have questions regarding tutor background verification, Bihar home tuition, or membership plans? Reach our academic desk below or connect via WhatsApp.
                  </p>
                </div>

                {whatsappSetting.isActive && (
                  <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                        Instant WhatsApp Helpline (Priority Response)
                      </p>
                      <p className="text-sm text-emerald-950 dark:text-emerald-100 font-semibold mt-1">
                        +{whatsappSetting.number} · {whatsappSetting.defaultMessage}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleWhatsAppClick('contact')}
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#1ebe5d] rounded-lg inline-flex items-center gap-2 shrink-0"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{whatsappSetting.buttonText}</span>
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <p className="font-semibold text-slate-900 dark:text-white">Helpline Phone</p>
                    <p className="font-mono text-slate-600 dark:text-slate-300 mt-1">
                      {branding.contactPhone}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <p className="font-semibold text-slate-900 dark:text-white">Official Support Email</p>
                    <p className="font-mono text-slate-600 dark:text-slate-300 mt-1">
                      {branding.contactEmail}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <p className="font-semibold text-slate-900 dark:text-white">Academic Offices</p>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">
                      {branding.officeAddress}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              pages
                .filter((p) => p.slug === cmsSlug)
                .map((page) => (
                  <article
                    key={page.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 space-y-4"
                  >
                    <p className="text-xs text-slate-400 font-mono">CMS Page: /{page.slug}</p>
                    <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                      {page.title}
                    </h1>
                    <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {page.content}
                    </div>
                  </article>
                ))
            )}
          </div>
        )}

        {/* ==================== AUTH SCREENS (LOGIN & SIGNUP WITH DUAL-CHANNEL SINGLE OTP) ==================== */}
        {(screen === 'login' || screen === 'signup') && (
          <AuthViews
            mode={screen}
            initialRole={loginInitialRole}
            adminCredentials={adminCredentials}
            tutors={tutors}
            usersDirectory={usersDirectory}
            securitySettings={securitySettings}
            onSecurityAudit={(action, details) => {
              if (!securitySettings.auditLogEnabled) return;
              setAuditLogs((prev) => [
                {
                  id: `aud-${Date.now()}`,
                  userId: currentUser?.uid || 'auth-guard',
                  actorName: currentUser?.name || 'Login Security Guard',
                  action,
                  module: 'Authentication & Security Guard',
                  details,
                  ipAddress: '103.21.244.18',
                  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 80) : 'Web Browser',
                  createdAt: new Date().toISOString(),
                },
                ...prev,
              ]);
            }}
            onSwitchMode={(m) => setScreen(m)}
            onGoogleAuth={async (role) => {
              const fbUser = await signInWithGoogleRole(role === 'ADMIN' ? 'TUTOR' : role);
              const isAdminEmail =
                fbUser.email?.toLowerCase() === adminCredentials.ownerEmail.toLowerCase() ||
                fbUser.email === 'kyp04010016@gmail.com';
              const assignedRole: Role = isAdminEmail ? 'ADMIN' : role === 'ADMIN' ? 'TUTOR' : role;
              setCurrentUser({
                uid: fbUser.uid,
                name: fbUser.displayName || 'Verified Member',
                email: fbUser.email || 'user@example.com',
                mobile: '9835011223',
                role: assignedRole,
              });
              if (assignedRole === 'TUTOR') {
                await handleRegisterNewTutorOnHomePage(
                  fbUser.displayName || 'Verified Bihar Tutor',
                  '+91 98350 11223',
                  fbUser.email || 'tutor@vidyasetu.in'
                );
                setScreen('profile');
              } else if (assignedRole === 'ADMIN') {
                setScreen('admin');
              } else {
                setScreen('student-dashboard');
              }
            }}
            onCredentialAuth={async ({
              name,
              identifier,
              mobile,
              password,
              role,
              avatarUrl,
              tutorDetails,
              studentLocation,
            }) => {
              const cleanId = identifier.trim().toLowerCase();
              const matchedTutor = tutors.find(
                (t) =>
                  (t.email && t.email.toLowerCase() === cleanId) ||
                  (t.loginUserId && t.loginUserId.toLowerCase() === cleanId) ||
                  (t.tutorNumericId && `tut-${t.tutorNumericId}` === cleanId) ||
                  (t.tutorNumericId && `tch-${t.tutorNumericId}` === cleanId)
              );
              if (matchedTutor && role === 'TUTOR') {
                setSelectedTutor(matchedTutor);
              }

              const uid = matchedTutor?.userId || `u-${role.toLowerCase()}-${Date.now()}`;
              const userObj: ActiveSessionUser = {
                uid,
                name:
                  name ||
                  matchedTutor?.name ||
                  (role === 'ADMIN'
                    ? 'Owner Admin'
                    : identifier.includes('@')
                    ? identifier.split('@')[0]
                    : identifier),
                email:
                  matchedTutor?.email ||
                  (identifier.includes('@') ? identifier : `${identifier}@vidyasetu.in`),
                mobile: mobile || matchedTutor?.phone || '+91 98350 11223',
                role,
                avatarUrl: avatarUrl || matchedTutor?.photoUrl || matchedTutor?.avatarUrl,
                location: studentLocation,
              };
              setCurrentUser(userObj);
              logActivity(
                `Verified Dual-Channel Single OTP & Signed in to ${role} portal`,
                `${userObj.email} / ${userObj.mobile}`,
                'SECURITY'
              );

              if (screen === 'signup' && role === 'TUTOR') {
                await handleRegisterNewTutorOnHomePage(
                  userObj.name,
                  userObj.mobile,
                  userObj.email,
                  tutorDetails
                );
                setScreen('profile');
                return;
              }

              // If Student/Parent signed up or logged in with location, record in usersDirectory & auto-filter Home Page nearby teachers
              if (role === 'STUDENT' && studentLocation) {
                setFilterCity(studentLocation.districtId);
                const genStudentId = `STU-${Date.now().toString().slice(-6)}`;
                const genStudentPass = password || `Stu@${Date.now().toString().slice(-4)}`;
                if (screen === 'signup') {
                  setDispatchedCredentialsModal({
                    role: 'STUDENT',
                    name: userObj.name,
                    userId: genStudentId,
                    password: genStudentPass,
                    mobile: userObj.mobile,
                    email: userObj.email,
                  });
                }
                setUsersDirectory((prev) => {
                  const exists = prev.some(
                    (u) => u.email.toLowerCase() === userObj.email.toLowerCase()
                  );
                  if (exists) return prev;
                  return [
                    {
                      id: uid,
                      name: userObj.name,
                      email: userObj.email,
                      phone: userObj.mobile,
                      mobile: userObj.mobile,
                      role: 'STUDENT',
                      isActive: true,
                      emailVerified: true,
                      phoneVerified: true,
                      country: studentLocation.country,
                      state: studentLocation.state,
                      districtId: studentLocation.districtId,
                      districtName: studentLocation.districtName,
                      blockName: studentLocation.blockName,
                      localityName: studentLocation.localityName,
                      pincode: studentLocation.pincode,
                      address: studentLocation.address,
                      loginUserId: genStudentId,
                      loginPassword: genStudentPass,
                      isLoginActive: true,
                      avatarUrl: avatarUrl || studentLocation.avatarUrl,
                      createdAt: new Date().toISOString(),
                      lastActivity: `ID: ${genStudentId} · ${studentLocation.localityName}, Block: ${studentLocation.blockName}, ${studentLocation.districtName} (${studentLocation.pincode})`,
                    },
                    ...prev,
                  ];
                });
              }

              if (role === 'ADMIN') setScreen('admin');
              else if (role === 'TUTOR') setScreen('tutor-dashboard');
              else setScreen('student-dashboard');
            }}
          />
        )}

        {/* ==================== DEDICATED TEACHER LOGIN PANEL (TUTOR DASHBOARD) ==================== */}
        {screen === 'tutor-dashboard' && (
          <TutorDashboard
            tutor={selectedTutor || tutors[0]}
            inquiries={inquiries}
            plans={plans}
            cities={cities}
            courses={courses}
            subjects={subjects}
            subscribedStudents={subscribedStudents}
            onlineClasses={onlineClasses}
            tutorTasks={tutorTasks}
            teacherPayouts={teacherPayouts}
            onMarkAttendance={(studentSubId, status) => {
              setSubscribedStudents((prev) =>
                prev.map((s) => {
                  if (s.id !== studentSubId) return s;
                  const wasPresent = s.attendanceToday === 'PRESENT';
                  const wasAbsent = s.attendanceToday === 'ABSENT';
                  return {
                    ...s,
                    attendanceToday: status,
                    presentDaysCount:
                      status === 'PRESENT'
                        ? wasPresent
                          ? s.presentDaysCount
                          : s.presentDaysCount + 1
                        : wasPresent
                        ? Math.max(0, s.presentDaysCount - 1)
                        : s.presentDaysCount,
                    absentDaysCount:
                      status === 'ABSENT'
                        ? wasAbsent
                          ? s.absentDaysCount
                          : s.absentDaysCount + 1
                        : wasAbsent
                        ? Math.max(0, s.absentDaysCount - 1)
                        : s.absentDaysCount,
                  };
                })
              );
              logActivity(`Marked Student Attendance (${status})`, studentSubId);
            }}
            onToggleStudentActive={(studentSubId) => {
              setSubscribedStudents((prev) =>
                prev.map((s) =>
                  s.id === studentSubId
                    ? {
                        ...s,
                        isLoginActive: !s.isLoginActive,
                        lastSeenText: !s.isLoginActive ? 'Online Now (Active)' : 'Offline (10m ago)',
                      }
                    : s
                )
              );
            }}
            onAddSubscribedStudent={(studentData) => {
              const newSub: SubscribedStudentItem = {
                ...studentData,
                id: `sub-${Date.now()}`,
                subscribedAt: new Date().toISOString().slice(0, 10),
              };
              setSubscribedStudents((prev) => [newSub, ...prev]);
              logActivity(`Added Subscribed Student: ${studentData.studentName}`, studentData.course);
            }}
            onCreateOnlineClass={(clsData) => {
              const newCls: OnlineClassSessionItem = {
                ...clsData,
                id: `cls-${Date.now()}`,
                createdAt: new Date().toISOString(),
              };
              setOnlineClasses((prev) => [newCls, ...prev]);
              logActivity(
                `Scheduled Live ${clsData.platform} Online Class: ${clsData.title}`,
                `${clsData.scheduledDate} · ${clsData.scheduledTime}`
              );
            }}
            onUpdateOnlineClassStatus={(classId, status) => {
              setOnlineClasses((prev) =>
                prev.map((c) => (c.id === classId ? { ...c, status } : c))
              );
            }}
            onBroadcastOnlineClass={(classId, channels) => {
              setOnlineClasses((prev) =>
                prev.map((c) =>
                  c.id === classId
                    ? {
                        ...c,
                        notifiedCount: (c.notifiedCount || 0) + 1,
                        lastBroadcastAt: new Date().toLocaleTimeString(),
                      }
                    : c
                )
              );
              logActivity(
                `Bulk Broadcasted Online Class (${classId}) via ${channels.join(' + ')}`,
                `Sent to all subscribed students`
              );
            }}
            onCreateTutorTask={(taskData) => {
              const newTask: TutorTaskItem = {
                ...taskData,
                id: `task-${Date.now()}`,
                submittedStudentIds: [],
                studentSubmissions: [],
                createdAt: new Date().toISOString().slice(0, 10),
              };
              setTutorTasks((prev) => [newTask, ...prev]);
              logActivity(`Uploaded Classroom Task: ${taskData.title}`, taskData.subject);
            }}
            onUpdateTutor={async (updated) => {
              setTutors((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
              setSelectedTutor(updated);
              logActivity(
                `Updated Tutor Profile (${updated.name})`,
                `Monthly: ₹${updated.monthlyRate}/mo (${updated.minDurationMonths} Months) · Block: ${updated.blockName}`
              );
            }}
            onUpdateInquiryStatus={(inqId, status) => {
              setInquiries((prev) =>
                prev.map((i) => (i.id === inqId ? { ...i, status } : i))
              );
              logActivity(`Marked inquiry ${inqId} as ${status}`, (selectedTutor || tutors[0]).name);
            }}
            onUpgradePlan={async (plan) => {
              const activeTut = selectedTutor || tutors[0];
              const newPay: PaymentItem = {
                id: `pay-${Date.now()}`,
                userId: activeTut.userId,
                userName: activeTut.name,
                planId: plan.id,
                planName: plan.name,
                amount: plan.price,
                currency: 'INR',
                status: 'PAID',
                razorpayId: `pay_Rzp${Date.now().toString().slice(-8)}`,
                createdAt: new Date().toISOString(),
              };
              setPayments((prev) => [newPay, ...prev]);
              logActivity(`Upgraded to ${plan.name} via Razorpay`, `₹${plan.price}`);
            }}
          />
        )}

        {/* ==================== STUDENT / PARENT DASHBOARD ==================== */}
        {screen === 'student-dashboard' && (
          <StudentDashboard
            currentUser={
              currentUser || {
                uid: 'u-student-1',
                name: 'Rohan Sinha',
                email: 'rohan.sinha@gmail.com',
                mobile: '+91 91234 56780',
              }
            }
            savedTutorIds={savedTutorIds}
            tutors={tutors}
            requirements={requirements}
            inquiries={inquiries}
            reviews={reviews}
            cities={cities}
            courses={courses}
            subscribedStudents={subscribedStudents}
            onlineClasses={onlineClasses}
            tutorTasks={tutorTasks}
            studentAchievers={studentAchievers}
            onUpdateUserPhoto={(photoUrl) => {
              if (currentUser) {
                setCurrentUser({ ...currentUser, avatarUrl: photoUrl });
                setUsersDirectory((prev) =>
                  prev.map((u) =>
                    u.id === currentUser.uid || u.email === currentUser.email
                      ? { ...u, avatarUrl: photoUrl }
                      : u
                  )
                );
              }
            }}
            onAddStudentAchiever={(achData) => {
              setStudentAchievers((prev) => [
                {
                  id: `ach-${Date.now()}`,
                  ...achData,
                },
                ...prev,
              ]);
              logActivity(
                `Published Student Achiever & Feedback on Home Page: ${achData.studentName}`,
                achData.scoreBadge
              );
            }}
            onUploadStudentTask={(taskData) => {
              const newTask: TutorTaskItem = {
                ...taskData,
                id: `task-stu-${Date.now()}`,
                submittedStudentIds: [],
                studentSubmissions: [],
                createdAt: new Date().toISOString().slice(0, 10),
              };
              setTutorTasks((prev) => [newTask, ...prev]);
              logActivity(
                `Student Uploaded Shared Classroom Task: ${taskData.title}`,
                `Visible to all users & ${taskData.tutorName}`
              );
            }}
            onSubmitTaskSolution={(taskId, answerText) => {
              const stuName = currentUser?.name || 'Rohan Sinha';
              const stuId = currentUser?.uid || 'u-student-1';
              setTutorTasks((prev) =>
                prev.map((tk) =>
                  tk.id === taskId
                    ? {
                        ...tk,
                        submittedStudentIds: tk.submittedStudentIds.includes(stuId)
                          ? tk.submittedStudentIds
                          : [...tk.submittedStudentIds, stuId],
                        studentSubmissions: [
                          ...tk.studentSubmissions,
                          {
                            studentId: stuId,
                            studentName: stuName,
                            answerText,
                            submittedAt: new Date().toISOString().slice(0, 10),
                          },
                        ],
                      }
                    : tk
                )
              );
              logActivity(`Submitted Task Solution (${stuName})`, taskId);
            }}
            onPostRequirement={async (reqData) => {
              const newReq: RequirementItem = {
                ...reqData,
                id: `req-${Date.now()}`,
                status: 'OPEN',
                createdAt: new Date().toISOString(),
              };
              setRequirements((prev) => [newReq, ...prev]);
              logActivity(
                `Posted new Tuition Requirement in ${reqData.cityName}`,
                `${reqData.course} (${reqData.subjects})`
              );
            }}
            onSubmitReview={async ({ tutorId, tutorName, rating, comment }) => {
              const newRev: ReviewItem = {
                id: `rev-${Date.now()}`,
                tutorId,
                tutorName,
                userId: currentUser?.uid || 'guest-parent',
                reviewerName: currentUser?.name || 'Verified Parent',
                rating,
                comment,
                isApproved: securitySettings.autoApproveReviews,
                createdAt: new Date().toISOString(),
              };
              setReviews((prev) => [newRev, ...prev]);
              logActivity(`Submitted ${rating}-star review for ${tutorName}`, comment.slice(0, 40));
            }}
            onSelectTutor={(t) => {
              setSelectedTutor(t);
              setScreen('profile');
            }}
            onRemoveSaved={handleToggleSaveTutor}
          />
        )}

        {/* ==================== 29-MODULE ADMIN & ASMUTH CONSOLE ==================== */}
        {screen === 'admin' && (
          <AdminConsole
            tutors={tutors}
            setTutors={setTutors}
            onDeleteTutor={handleDeleteTutor}
            cities={cities}
            setCities={setCities}
            courses={courses}
            setCourses={setCourses}
            subjects={subjects}
            setSubjects={setSubjects}
            inquiries={inquiries}
            setInquiries={setInquiries}
            reviews={reviews}
            setReviews={setReviews}
            requirements={requirements}
            setRequirements={setRequirements}
            plans={plans}
            setPlans={setPlans}
            payments={payments}
            setPayments={setPayments}
            pages={pages}
            setPages={setPages}
            banners={banners}
            setBanners={setBanners}
            blogPosts={blogPosts}
            setBlogPosts={setBlogPosts}
            emailTemplates={emailTemplates}
            setEmailTemplates={setEmailTemplates}
            usersDirectory={usersDirectory}
            setUsersDirectory={setUsersDirectory}
            activityEvents={activityEvents}
            onLogActivity={logActivity}
            backups={backups}
            onCreateCloudBackup={handleCreateCloudBackup}
            onRestoreBackup={handleRestoreBackup}
            branding={branding}
            setBranding={setBranding}
            whatsappSetting={whatsappSetting}
            setWhatsappSetting={setWhatsappSetting}
            socialLinks={socialLinks}
            setSocialLinks={setSocialLinks}
            securitySettings={securitySettings}
            setSecuritySettings={setSecuritySettings}
            paymentConfig={paymentConfig}
            setPaymentConfig={setPaymentConfig}
            seoSettings={seoSettings}
            setSeoSettings={setSeoSettings}
            auditLogs={auditLogs}
            setAuditLogs={setAuditLogs}
            adminCredentials={adminCredentials}
            setAdminCredentials={setAdminCredentials}
            promoOffers={promoOffers}
            setPromoOffers={setPromoOffers}
            teacherPayouts={teacherPayouts}
            setTeacherPayouts={setTeacherPayouts}
            studentAchievers={studentAchievers}
            setStudentAchievers={setStudentAchievers}
            initialModule={adminInitialModule}
          />
        )}
      </div>

      {/* ==================== THEMED MULTI-COLUMN FOOTER WITH ALL 7 SOCIAL ICONS (Matches Reference Image!) ==================== */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-8 pb-12 px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Top Rounded Royal-Blue Callout Pill Banner (Inspired by reference image_41f8af24.png) */}
          <div className="bg-gradient-to-r from-[#3b6ef5] via-[#4f7df3] to-[#2563eb] rounded-2xl px-6 py-5 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <p className="font-display text-base sm:text-lg font-bold tracking-tight">
                Find Verified Home &amp; Online Tutors Across All 38 Bihar Districts &amp; India
              </p>
              <p className="text-xs text-blue-100">
                Choose Online Zoom/Google Classes or Offline Home Tuition · Share Student Achievements &amp; Feedback on Home Page
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setScreen('home');
                  setQuickRegisterOpen(true);
                }}
                className="px-4 py-2 rounded-lg bg-white text-[#1d4ed8] text-xs font-extrabold hover:bg-blue-50 transition-colors cursor-pointer shadow-2xs"
              >
                Join As Teacher
              </button>
              <button
                type="button"
                onClick={() => setAchieverModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-amber-400 text-slate-950 text-xs font-extrabold hover:bg-amber-300 transition-colors cursor-pointer shadow-2xs"
              >
                + Add Achiever &amp; Feedback
              </button>
            </div>
          </div>

          {/* Main 5-Column Footer Grid (Brand + Social Icons Left | Company | Support | Links | Contact Us Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pt-2">
            {/* Left Column: Brand Mark + Title + Description + All 7 Social Media Icons */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                {branding.logoUrl ? (
                  <img
                    src={branding.logoUrl}
                    alt={branding.companyName}
                    style={{ height: `${Math.min(52, (branding.logoHeightPx || 40) + 4)}px` }}
                    className="w-auto max-w-[175px] object-contain shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3b6ef5] to-[#084d75] text-white flex items-center justify-center font-display font-extrabold text-lg shadow-xs shrink-0">
                    {branding.companyName.charAt(0)}
                  </div>
                )}
                {(branding.showLogoText !== false || !branding.logoUrl) && (
                  <span className="font-display text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {branding.companyName}
                  </span>
                )}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setAdminInitialModule('settings-general');
                      setScreen('admin');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-[#084d75] dark:text-amber-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Edit Logo</span>
                  </button>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                {branding.tagline}. Connect directly with background-verified teachers for CBSE, ICSE, Bihar Board (BSEB), IIT-JEE &amp; NEET in your Block &amp; Pin Code.
              </p>

              {/* All 7 Social Media Brand Icons (WhatsApp, Facebook, Instagram, Twitter, YouTube, LinkedIn, Telegram) */}
              <div className="pt-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                  Follow &amp; Connect With Us
                </p>
                <div className="flex flex-wrap items-center gap-2.5">
                  {socialLinks
                    .filter((s) => s.isActive)
                    .map((soc) => {
                      const meta = SOCIAL_PLATFORM_META[soc.platform];
                      return (
                        <a
                          key={soc.id}
                          href={soc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            if (soc.platform === 'whatsapp') {
                              e.preventDefault();
                              openDirectWhatsAppDrawer('footer');
                            }
                          }}
                          title={`${meta?.label || soc.platform} (${soc.url})`}
                          aria-label={meta?.label || soc.platform}
                          className={`w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center transition-all hover:scale-110 shadow-2xs ${
                            meta?.hoverBgClass || 'hover:bg-[#3b6ef5]'
                          }`}
                        >
                          <SocialPlatformIcon platform={soc.platform} className="w-4 h-4" />
                        </a>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Column 1: Company */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                Company
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setCmsSlug('about');
                      setScreen('cms');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#3b6ef5] transition-colors cursor-pointer"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setOnlineModeDefault(false);
                      setScreen('listing');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#3b6ef5] transition-colors cursor-pointer"
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setScreen('home');
                      setTimeout(() => {
                        document
                          .getElementById('achievers-showcase-section')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }, 60);
                    }}
                    className="hover:text-[#3b6ef5] transition-colors cursor-pointer"
                  >
                    Community &amp; Achievers
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setScreen('home');
                      setTimeout(() => {
                        document
                          .getElementById('how-it-works-section')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }, 60);
                    }}
                    className="hover:text-[#3b6ef5] transition-colors cursor-pointer"
                  >
                    Testimonial
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Support */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                Support
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setCmsSlug('faqs');
                      setScreen('cms');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#3b6ef5] transition-colors cursor-pointer"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openDirectWhatsAppDrawer('footer')}
                    className="hover:text-[#3b6ef5] transition-colors cursor-pointer"
                  >
                    Tweet / Chat @ Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setOnlineModeDefault(true);
                      setScreen('listing');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#3b6ef5] transition-colors cursor-pointer"
                  >
                    Webinars &amp; Live Classes
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setAchieverModalOpen(true)}
                    className="hover:text-[#3b6ef5] transition-colors cursor-pointer font-semibold text-[#084d75] dark:text-amber-300"
                  >
                    Feedback &amp; Achievers
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Links */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                Links
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setScreen('listing');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#3b6ef5] transition-colors cursor-pointer"
                  >
                    Courses
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setScreen('home');
                      setQuickRegisterOpen(true);
                    }}
                    className="hover:text-[#3b6ef5] transition-colors cursor-pointer"
                  >
                    Become Teacher
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setScreen('pricing');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#3b6ef5] transition-colors cursor-pointer"
                  >
                    Service &amp; Pricing
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setScreen('student-dashboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#3b6ef5] transition-colors cursor-pointer"
                  >
                    All in One Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact Us */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                Contact Us
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#3b6ef5] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </span>
                  <span className="font-mono font-semibold text-xs">{branding.contactPhone}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#3b6ef5] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </span>
                  <span className="text-xs break-all">{branding.contactEmail}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-slate-800 text-[#25D366] flex items-center justify-center shrink-0 mt-0.5">
                    <SocialPlatformIcon platform="whatsapp" className="w-4 h-4" />
                  </span>
                  <button
                    type="button"
                    onClick={() => openDirectWhatsAppDrawer('footer')}
                    className="text-left text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    WhatsApp Support Desk
                  </button>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#3b6ef5] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {branding.officeAddress}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Divider Bar: Copyright Left + Privacy Policy, Terms of Use, Legal, Site Map Right */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
            <p className="font-medium text-slate-700 dark:text-slate-300">
              {branding.footerCopyright}
            </p>
            <div className="flex flex-wrap items-center gap-6 font-medium text-slate-700 dark:text-slate-300">
              <button
                type="button"
                onClick={() => {
                  setCmsSlug('privacy');
                  setScreen('cms');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#3b6ef5] transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => {
                  setCmsSlug('terms');
                  setScreen('cms');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#3b6ef5] transition-colors cursor-pointer"
              >
                Terms of Use
              </button>
              <button
                type="button"
                onClick={() => {
                  setCmsSlug('terms');
                  setScreen('cms');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#3b6ef5] transition-colors cursor-pointer"
              >
                Legal
              </button>
              <button
                type="button"
                onClick={() => {
                  setScreen('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#3b6ef5] transition-colors cursor-pointer"
              >
                Site Map
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ==================== ADD STUDENT ACHIEVER & FEEDBACK MODAL (OPENS FROM HOME PAGE OR FOOTER) ==================== */}
      {achieverModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border-2 border-[#084d75] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#ff6600] flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    Add Student Achievement, Photo &amp; Feedback
                  </h3>
                  <p className="text-xs text-slate-500">
                    अचीवर छात्र का फोटो, उपलब्धि की जानकारी और फीडबैक होम पेज पर सभी को दिखाएं
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAchieverModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newAchName.trim() || !newAchTitle.trim() || !newAchFeedback.trim()) return;
                const created: StudentAchieverItem = {
                  id: `ach-${Date.now()}`,
                  studentName: newAchName.trim(),
                  studentPhoto:
                    newAchPhoto.trim() ||
                    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
                  districtName: newAchDistrict.trim() || 'Patna (Bihar)',
                  blockName: newAchBlock.trim() || 'Danapur',
                  className: newAchClass.trim() || 'Class 10 CBSE Board',
                  achievementTitle: newAchTitle.trim(),
                  scoreBadge: newAchBadge.trim() || 'Star Achiever',
                  tutorName: newAchTutor.trim() || 'Sanjeet',
                  studyMode: newAchMode,
                  feedbackText: newAchFeedback.trim(),
                  rating: Number(newAchRating) || 5,
                  achievedDate: new Date().toISOString().slice(0, 10),
                  isApproved: true,
                  isFeatured: true,
                };
                setStudentAchievers((prev) => [created, ...prev]);
                logActivity(
                  `Added Student Achiever & Feedback on Home Page: ${created.studentName}`,
                  created.scoreBadge
                );
                setNewAchTitle('');
                setNewAchFeedback('');
                setAchieverModalOpen(false);
              }}
              className="space-y-3.5 text-xs"
            >
              {/* Student Photo Upload */}
              <div className="p-3 bg-blue-50/70 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-[#084d75] overflow-hidden flex items-center justify-center shrink-0">
                    {newAchPhoto ? (
                      <img
                        src={newAchPhoto}
                        alt="Student preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-5 h-5 text-[#084d75]" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-[#084d75] dark:text-amber-300">
                      🎓 Student / User Photo (अपना फोटो डालें)
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Upload photo from mobile/computer or paste a photo link.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="px-3 py-1.5 rounded-lg bg-[#084d75] text-white font-bold inline-flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const compressed = await readAndCompressImageFile(file, 360);
                        setNewAchPhoto(compressed);
                      }}
                    />
                  </label>
                  <input
                    type="text"
                    value={newAchPhoto.startsWith('data:') ? '' : newAchPhoto}
                    onChange={(e) => setNewAchPhoto(e.target.value)}
                    placeholder="Or paste photo URL..."
                    className="px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 rounded-lg w-40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Student Name (छात्र का नाम) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAchName}
                    onChange={(e) => setNewAchName(e.target.value)}
                    placeholder="e.g. Ananya Kumari"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Class / Exam (कक्षा / परीक्षा) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAchClass}
                    onChange={(e) => setNewAchClass(e.target.value)}
                    placeholder="e.g. Class 10 CBSE / JEE / NEET"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bihar District / City *
                  </label>
                  <select
                    value={newAchDistrict}
                    onChange={(e) => setNewAchDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white dark:bg-slate-800"
                  >
                    {BIHAR_ALL_38_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Block / Locality (प्रखंड / मोहल्ला) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAchBlock}
                    onChange={(e) => setNewAchBlock(e.target.value)}
                    placeholder="e.g. Danapur, Boring Road"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Score / Rank Badge (e.g. 97.8% Topper) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAchBadge}
                    onChange={(e) => setNewAchBadge(e.target.value)}
                    placeholder="e.g. 97.8% Board Topper"
                    className="w-full px-3 py-2 font-bold text-[#e66000] border border-amber-400 rounded-lg bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mentored By Teacher *
                  </label>
                  <select
                    value={newAchTutor}
                    onChange={(e) => setNewAchTutor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white dark:bg-slate-800"
                  >
                    {tutors.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.cityName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Achievement Details (क्या उपलब्धि हासिल की?) *
                </label>
                <input
                  type="text"
                  required
                  value={newAchTitle}
                  onChange={(e) => setNewAchTitle(e.target.value)}
                  placeholder="e.g. Scored 97.8% in Class 10 Board (100/100 in Mathematics)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Study Mode
                  </label>
                  <select
                    value={newAchMode}
                    onChange={(e) =>
                      setNewAchMode(e.target.value as 'ONLINE' | 'OFFLINE' | 'BOTH')
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white dark:bg-slate-800"
                  >
                    <option value="ONLINE">Online Tuition</option>
                    <option value="OFFLINE">Offline Home Tuition</option>
                    <option value="BOTH">Online + Offline Both</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Star Rating
                  </label>
                  <select
                    value={newAchRating}
                    onChange={(e) => setNewAchRating(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white dark:bg-slate-800"
                  >
                    <option value={5}>5 Stars (★★★★★)</option>
                    <option value={4}>4 Stars (★★★★)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Student / Parent Feedback (आपका फीडबैक जो होम पेज पर सभी को दिखेगा) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newAchFeedback}
                  onChange={(e) => setNewAchFeedback(e.target.value)}
                  placeholder="Share how your teacher helped you achieve this milestone..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white dark:bg-slate-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAchieverModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-extrabold text-white bg-[#ff6600] hover:bg-[#e05500] rounded-lg cursor-pointer"
                >
                  Publish on Home Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING WHATSAPP HIGHLIGHT BUTTON */}
      {showFloatingWhatsApp && (
        <div
          className={`fixed bottom-16 md:bottom-6 z-40 ${
            whatsappSetting.buttonPosition === 'bottom-left' ? 'left-6' : 'right-6'
          }`}
        >
          <button
            type="button"
            onClick={() => openDirectWhatsAppDrawer(screen)}
            style={{ backgroundColor: whatsappSetting.buttonColor || '#25D366' }}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full text-white text-xs font-semibold shadow-lg hover:scale-105 transition-transform cursor-pointer"
          >
            <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none" />
            <MessageCircle className="w-4 h-4 relative z-10 shrink-0" />
            <span className="relative z-10 whitespace-nowrap">{whatsappSetting.buttonText}</span>
          </button>
        </div>
      )}

      {/* ==================== RAZORPAY PAYMENT MODAL TO UNLOCK TUTOR CONTACT & WHATSAPP (Admin-Controlled Prices!) ==================== */}
      {paymentUnlockTutor && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-[#ff6600]/10 border border-[#ff6600]/30 text-[#ff6600] flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6600]">
                    Payment Required to View Contact
                  </span>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    Unlock {paymentUnlockTutor.tutor.name}&apos;s Phone &amp; WhatsApp
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPaymentUnlockTutor(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">
                {paymentUnlockTutor.tutor.name} (TutorId:{' '}
                {paymentUnlockTutor.tutor.tutorNumericId || '1584150'})
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                {paymentUnlockTutor.tutor.qualification} · {paymentUnlockTutor.tutor.localityName}
                {paymentUnlockTutor.tutor.blockName
                  ? ` (Block: ${paymentUnlockTutor.tutor.blockName})`
                  : ''}
                , {paymentUnlockTutor.tutor.cityName}
              </p>
              <p className="text-emerald-700 dark:text-emerald-300 font-semibold">
                Teacher Fee: ₹{paymentUnlockTutor.tutor.monthlyRate || 2500}/Month · Duration:{' '}
                {paymentUnlockTutor.tutor.minDurationMonths || 6} Months (₹
                {paymentUnlockTutor.tutor.hourlyRate}/hr)
              </p>
              <p className="text-slate-500">
                Phone: <span className="font-mono">+91 94XXXXXX15 (Locked)</span> · WhatsApp:{' '}
                <span className="font-mono">Locked</span>
              </p>
            </div>

            {/* Student Study Mode Choice: Online Padhna Hai vs Offline Padhna Hai */}
            <div className="space-y-1.5 text-xs">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Choose How You Want to Study with {paymentUnlockTutor.tutor.name}:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudyMode('ONLINE')}
                  className={`py-2 px-3 rounded-lg font-bold border text-left cursor-pointer ${
                    selectedStudyMode === 'ONLINE'
                      ? 'bg-[#084d75] text-white border-[#084d75]'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300'
                  }`}
                >
                  🖥️ Online Padhna Hai (Zoom / Google Class)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStudyMode('OFFLINE')}
                  className={`py-2 px-3 rounded-lg font-bold border text-left cursor-pointer ${
                    selectedStudyMode === 'OFFLINE'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300'
                  }`}
                >
                  🏠 Offline Padhna Hai (Home Tuition)
                </button>
              </div>
            </div>

            {/* Plan Options (Amounts Controlled by Admin Panel Module 19) */}
            <div className="space-y-2.5 text-xs">
              <label
                onClick={() => setSelectedUnlockPlan('single')}
                className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-colors ${
                  selectedUnlockPlan === 'single'
                    ? 'border-2 border-[#ff6600] bg-orange-50/40 dark:bg-slate-800'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="unlock_plan"
                    checked={selectedUnlockPlan === 'single'}
                    onChange={() => setSelectedUnlockPlan('single')}
                    className="accent-[#ff6600]"
                  />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      Unlock {paymentUnlockTutor.tutor.name}&apos;s Contact &amp; WhatsApp
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Instant access to direct Mobile Number, WhatsApp, Email &amp; Full Address
                    </p>
                  </div>
                </div>
                <span className="font-mono text-base font-bold text-[#ff6600]">
                  ₹{paymentConfig.userContactUnlockPrice || 99}
                </span>
              </label>

              <label
                onClick={() => setSelectedUnlockPlan('unlimited')}
                className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-colors ${
                  selectedUnlockPlan === 'unlimited'
                    ? 'border-2 border-[#ff6600] bg-orange-50/40 dark:bg-slate-800'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="unlock_plan"
                    checked={selectedUnlockPlan === 'unlimited'}
                    onChange={() => setSelectedUnlockPlan('unlimited')}
                    className="accent-[#ff6600]"
                  />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      Unlimited All-Tutors Contact &amp; WhatsApp Pass
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Unlock phone numbers &amp; WhatsApp for all verified teachers for{' '}
                      {paymentConfig.userPassDurationMonths || 3} months
                    </p>
                  </div>
                </div>
                <span className="font-mono text-base font-bold text-[#ff6600]">
                  ₹{paymentConfig.userUnlimitedPassPrice || 499}
                </span>
              </label>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPaymentUnlockTutor(null)}
                className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={unlockProcessing}
                onClick={handleConfirmContactUnlockPayment}
                className="flex-1 py-2.5 px-4 text-xs font-bold uppercase tracking-wide text-white bg-[#25D366] hover:bg-[#1ebe5d] rounded-md inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
              >
                {unlockProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Payment...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>
                      Pay ₹
                      {selectedUnlockPlan === 'single'
                        ? paymentConfig.userContactUnlockPrice || 99
                        : paymentConfig.userUnlimitedPassPrice || 499}{' '}
                      &amp; Reveal Contact Now
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPLAINER VIDEO MODAL */}
      {explainerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                {explainerModal === 'student'
                  ? 'How Students & Parents Find Verified Tutors in Bihar'
                  : 'How Teachers Register & Get Home Tuition Leads in Bihar'}
              </h3>
              <button
                type="button"
                onClick={() => setExplainerModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-slate-900 text-white rounded-lg p-6 text-center space-y-3">
              <PlayCircle className="w-12 h-12 text-[#ff6600] mx-auto" />
              <p className="text-sm font-semibold">
                {explainerModal === 'student'
                  ? 'Step 1: Search District/Block/Pincode → Step 2: Unlock Contact or Book Demo → Step 3: Start Home/Online Tuition'
                  : 'Step 1: Click Join As Tutor → Step 2: Enter Block, Pincode, Monthly Fee & Verify OTP → Step 3: Auto-Listed on Home Page!'}
              </p>
              <p className="text-xs text-slate-300">
                0% commission charged from parents. Direct phone and WhatsApp verification.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setExplainerModal(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setExplainerModal(null);
                  if (explainerModal === 'tutor') setQuickRegisterOpen(true);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#ff6600] rounded-md"
              >
                {explainerModal === 'tutor' ? 'Join As Tutor Now' : 'Browse Tutors'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP INTERACTIVE CLICK PREVIEW DRAWER */}
      {activeWhatsAppDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                    {activeWhatsAppDrawer.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">{activeWhatsAppDrawer.phone}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveWhatsAppDrawer(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Pre-filled WhatsApp Message
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                &ldquo;{activeWhatsAppDrawer.message}&rdquo;
              </p>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Click tracked in Admin WhatsApp Analytics</span>
              <span className="font-mono font-semibold text-emerald-700">
                Total Clicks: {whatsappSetting.totalClicks}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setActiveWhatsAppDrawer(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <a
                href={activeWhatsAppDrawer.waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActiveWhatsAppDrawer(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#1ebe5d] rounded-lg inline-flex items-center gap-1.5"
              >
                <span>Open WhatsApp Web / App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* INSTANT ACCOUNT CREDENTIALS DISPATCHED MODAL (Sent to Mobile SMS, Email & WhatsApp upon Account Creation!) */}
      {dispatchedCredentialsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Account Created &amp; Credentials Dispatched
                  </span>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    Login ID &amp; Password Sent to Mobile, Email &amp; WhatsApp!
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDispatchedCredentialsModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-xl border border-amber-400/50 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Account Holder:</span>
                <span className="font-bold text-white">
                  {dispatchedCredentialsModal.name} ({dispatchedCredentialsModal.role})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Login User ID:</span>
                <span className="font-mono text-sm font-extrabold text-amber-300">
                  {dispatchedCredentialsModal.userId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Login Password:</span>
                <span className="font-mono text-sm font-extrabold text-emerald-300">
                  {dispatchedCredentialsModal.password}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs bg-emerald-50 dark:bg-slate-800 p-3 rounded-lg border border-emerald-200 dark:border-slate-700">
              <p className="font-bold text-emerald-900 dark:text-emerald-300">
                ✓ Automatically Dispatched On All 3 Channels:
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                📱 <strong>Mobile SMS:</strong> Sent to {dispatchedCredentialsModal.mobile}
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                📧 <strong>Email ID:</strong> Sent to {dispatchedCredentialsModal.email}
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                💬 <strong>WhatsApp:</strong> Instant Login Credentials Message Ready
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <a
                href={`https://wa.me/${dispatchedCredentialsModal.mobile.replace(
                  /[^0-9]/g,
                  ''
                )}?text=${encodeURIComponent(
                  `Welcome to ${branding.companyName}, ${dispatchedCredentialsModal.name}! Your ${dispatchedCredentialsModal.role} Account is active.\nLogin User ID: ${dispatchedCredentialsModal.userId}\nPassword: ${dispatchedCredentialsModal.password}\nRegistered Email: ${dispatchedCredentialsModal.email}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 text-xs font-bold text-white bg-[#25D366] hover:bg-[#1ebe5d] rounded-lg inline-flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Receive on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => setDispatchedCredentialsModal(null)}
                className="px-4 py-2.5 text-xs font-bold text-white bg-[#084d75] hover:bg-[#063a58] rounded-lg cursor-pointer"
              >
                Continue to Portal →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR (PWA App Experience, Public Admin Button Hidden) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-t border-slate-200 dark:border-slate-800 px-3 py-2 grid grid-cols-5 gap-1 text-[11px] font-medium">
        <button
          type="button"
          onClick={() => setScreen('home')}
          className={`flex flex-col items-center gap-0.5 py-1 rounded-lg ${
            screen === 'home' ? 'text-[#084d75] dark:text-white font-semibold' : 'text-slate-500'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          type="button"
          onClick={() => setQuickRegisterOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 rounded-lg text-[#ff6600] font-semibold"
        >
          <Users className="w-4 h-4" />
          <span>Join Tutor</span>
        </button>
        <button
          type="button"
          onClick={() => setScreen('student-dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 rounded-lg ${
            screen === 'student-dashboard'
              ? 'text-[#084d75] dark:text-white font-semibold'
              : 'text-slate-500'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Student</span>
        </button>
        <button
          type="button"
          onClick={() => setScreen('tutor-dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 rounded-lg ${
            screen === 'tutor-dashboard'
              ? 'text-[#084d75] dark:text-white font-semibold'
              : 'text-slate-500'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Teacher</span>
        </button>
        <button
          type="button"
          onClick={() => {
            if (isAdmin) {
              setAdminInitialModule('dashboard');
              setScreen('admin');
            } else {
              setLoginInitialRole('TUTOR');
              setScreen('login');
            }
          }}
          className={`flex flex-col items-center gap-0.5 py-1 rounded-lg ${
            screen === 'login' || screen === 'admin'
              ? 'text-[#084d75] dark:text-white font-semibold'
              : 'text-slate-500'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>{isAdmin ? 'Admin' : 'Login'}</span>
        </button>
      </nav>

      {/* Modals */}
      <InquiryModal
        tutor={inquiryModalTutor}
        currentUser={currentUser}
        onClose={() => setInquiryModalTutor(null)}
        onSubmitInquiry={handleSendInquiry}
        onPromptLogin={() => {
          setInquiryModalTutor(null);
          setScreen('login');
        }}
      />

      <BlueprintModal open={blueprintOpen} onClose={() => setBlueprintOpen(false)} />
    </div>
  );
}
