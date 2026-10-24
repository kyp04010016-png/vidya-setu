import React, { useState } from 'react';
import {
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  DatabaseBackup,
  RotateCcw,
  RefreshCw,
  Mail,
  Search,
  FileSpreadsheet,
  Shield,
  MessageCircle,
  Palette,
  Smartphone,
  Key,
  LogOut,
  FileText,
  Upload,
  ImagePlus,
  Camera,
  Award,
} from 'lucide-react';
import {
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
  AuditLogItem,
  SecuritySettingItem,
  SocialLinkItem,
  WhatsAppSettingItem,
  CompanyBrandingItem,
  PaymentConfigItem,
  SeoSettingItem,
  AdminCredentialsItem,
  PromoOfferItem,
  TeacherPayoutItem,
  StudentAchieverItem,
  Role,
} from '../data/seedData';
import {
  SocialPlatformIcon,
  SOCIAL_PLATFORM_META,
  readAndCompressImageFile,
} from './SocialPlatformIcon';

export type AdminModuleKey =
  | 'dashboard'
  | 'asmuth'
  | 'tutors'
  | 'students'
  | 'requirements'
  | 'cities'
  | 'localities'
  | 'courses'
  | 'subjects'
  | 'inquiries'
  | 'reviews'
  | 'pages'
  | 'banners'
  | 'plans'
  | 'payments'
  | 'users'
  | 'settings-general'
  | 'settings-social'
  | 'settings-payments'
  | 'settings-smtp'
  | 'settings-seo'
  | 'settings-security'
  | 'settings-appearance'
  | 'settings-api'
  | 'blog'
  | 'templates'
  | 'reports'
  | 'audit-log'
  | 'notifications';

export interface BackupSnapshotRecord {
  id: string;
  label: string;
  recordCount: number;
  checksum: string;
  createdAt: string;
  payloadJson: string;
}

interface AdminConsoleProps {
  tutors: TutorItem[];
  setTutors: React.Dispatch<React.SetStateAction<TutorItem[]>>;
  cities: CityItem[];
  setCities: React.Dispatch<React.SetStateAction<CityItem[]>>;
  courses: CourseItem[];
  setCourses: React.Dispatch<React.SetStateAction<CourseItem[]>>;
  subjects: SubjectItem[];
  setSubjects: React.Dispatch<React.SetStateAction<SubjectItem[]>>;
  inquiries: InquiryItem[];
  setInquiries: React.Dispatch<React.SetStateAction<InquiryItem[]>>;
  reviews: ReviewItem[];
  setReviews: React.Dispatch<React.SetStateAction<ReviewItem[]>>;
  requirements: RequirementItem[];
  setRequirements: React.Dispatch<React.SetStateAction<RequirementItem[]>>;
  plans: PricingPlanItem[];
  setPlans: React.Dispatch<React.SetStateAction<PricingPlanItem[]>>;
  payments: PaymentItem[];
  setPayments: React.Dispatch<React.SetStateAction<PaymentItem[]>>;
  pages: PageCMSItem[];
  setPages: React.Dispatch<React.SetStateAction<PageCMSItem[]>>;
  banners: BannerItem[];
  setBanners: React.Dispatch<React.SetStateAction<BannerItem[]>>;
  blogPosts: BlogPostItem[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPostItem[]>>;
  emailTemplates: EmailTemplateItem[];
  setEmailTemplates: React.Dispatch<React.SetStateAction<EmailTemplateItem[]>>;
  usersDirectory: UserDirectoryItem[];
  setUsersDirectory: React.Dispatch<React.SetStateAction<UserDirectoryItem[]>>;
  activityEvents: ActivityEventItem[];
  onLogActivity: (action: string, target: string, severity?: ActivityEventItem['severity']) => void;
  backups: BackupSnapshotRecord[];
  onCreateCloudBackup: (label: string) => Promise<void>;
  onRestoreBackup: (snapshot: BackupSnapshotRecord) => void;
  branding: CompanyBrandingItem;
  setBranding: React.Dispatch<React.SetStateAction<CompanyBrandingItem>>;
  whatsappSetting: WhatsAppSettingItem;
  setWhatsappSetting: React.Dispatch<React.SetStateAction<WhatsAppSettingItem>>;
  socialLinks: SocialLinkItem[];
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLinkItem[]>>;
  securitySettings: SecuritySettingItem;
  setSecuritySettings: React.Dispatch<React.SetStateAction<SecuritySettingItem>>;
  paymentConfig: PaymentConfigItem;
  setPaymentConfig: React.Dispatch<React.SetStateAction<PaymentConfigItem>>;
  seoSettings: SeoSettingItem;
  setSeoSettings: React.Dispatch<React.SetStateAction<SeoSettingItem>>;
  auditLogs: AuditLogItem[];
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditLogItem[]>>;
  adminCredentials: AdminCredentialsItem;
  setAdminCredentials: React.Dispatch<React.SetStateAction<AdminCredentialsItem>>;
  promoOffers?: PromoOfferItem[];
  setPromoOffers?: React.Dispatch<React.SetStateAction<PromoOfferItem[]>>;
  teacherPayouts?: TeacherPayoutItem[];
  setTeacherPayouts?: React.Dispatch<React.SetStateAction<TeacherPayoutItem[]>>;
  studentAchievers?: StudentAchieverItem[];
  setStudentAchievers?: React.Dispatch<React.SetStateAction<StudentAchieverItem[]>>;
  onDeleteTutor?: (tutorId: string) => void;
  initialModule?: AdminModuleKey;
}

const MODULE_LIST: Array<{
  key: AdminModuleKey;
  num: string;
  label: string;
  category:
    | 'Core Directory & Users'
    | 'Locations & Academics'
    | 'Finance, Offers & Payouts'
    | 'CMS, Slider & Marketing'
    | 'System, Security & API';
}> = [
  { key: 'dashboard', num: '01', label: 'Dashboard & Analytics', category: 'Core Directory & Users' },
  { key: 'asmuth', num: '02', label: 'File Import/Export & Backup', category: 'Core Directory & Users' },
  { key: 'tutors', num: '03', label: 'Tutors Directory & Bank Info', category: 'Core Directory & Users' },
  { key: 'students', num: '04', label: 'Students & Parents', category: 'Core Directory & Users' },
  { key: 'requirements', num: '05', label: 'Tuition Requirements', category: 'Core Directory & Users' },
  { key: 'users', num: '16', label: 'Users & Sub-Admins', category: 'Core Directory & Users' },
  { key: 'cities', num: '06', label: 'Cities & 38 Bihar Districts', category: 'Locations & Academics' },
  { key: 'localities', num: '07', label: 'Localities & Blocks Mapping', category: 'Locations & Academics' },
  { key: 'courses', num: '08', label: 'Courses Master', category: 'Locations & Academics' },
  { key: 'subjects', num: '09', label: 'Subjects Master', category: 'Locations & Academics' },
  { key: 'banners', num: '13', label: 'Home Photo Slider & Offers', category: 'Finance, Offers & Payouts' },
  { key: 'plans', num: '14', label: 'Pricing Plans', category: 'Finance, Offers & Payouts' },
  { key: 'payments', num: '15', label: 'Payments & Teacher Payouts', category: 'Finance, Offers & Payouts' },
  { key: 'settings-payments', num: '19', label: 'Payment Gateways & Fees', category: 'Finance, Offers & Payouts' },
  { key: 'inquiries', num: '10', label: 'Inquiries & Email Reply', category: 'CMS, Slider & Marketing' },
  { key: 'reviews', num: '11', label: 'Achievers & Reviews', category: 'CMS, Slider & Marketing' },
  { key: 'pages', num: '12', label: 'Pages / CMS Editor', category: 'CMS, Slider & Marketing' },
  { key: 'blog', num: '25', label: 'Blog Articles', category: 'CMS, Slider & Marketing' },
  { key: 'templates', num: '26', label: '7 Email Templates', category: 'CMS, Slider & Marketing' },
  { key: 'notifications', num: '29', label: 'SMS & Email Broadcast', category: 'CMS, Slider & Marketing' },
  { key: 'settings-general', num: '17', label: 'Website Logo & Branding', category: 'System, Security & API' },
  { key: 'settings-social', num: '18', label: 'WhatsApp & Social Links', category: 'System, Security & API' },
  { key: 'settings-smtp', num: '20', label: 'SMTP & Email Server', category: 'System, Security & API' },
  { key: 'settings-seo', num: '21', label: 'SEO & Analytics', category: 'System, Security & API' },
  { key: 'settings-security', num: '22', label: 'Security & Admin Login ID', category: 'System, Security & API' },
  { key: 'settings-appearance', num: '23', label: 'Appearance & Theme', category: 'System, Security & API' },
  { key: 'settings-api', num: '24', label: 'Mobile App API v1', category: 'System, Security & API' },
  { key: 'reports', num: '27', label: 'CSV Data Reports', category: 'System, Security & API' },
  { key: 'audit-log', num: '28', label: 'Security Audit Logs', category: 'System, Security & API' },
];

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  tutors,
  setTutors,
  cities,
  setCities,
  courses,
  setCourses,
  subjects,
  setSubjects,
  inquiries,
  setInquiries,
  reviews,
  setReviews,
  requirements,
  setRequirements,
  plans,
  setPlans,
  payments,
  setPayments,
  pages,
  setPages,
  banners,
  setBanners,
  blogPosts,
  setBlogPosts,
  emailTemplates,
  setEmailTemplates,
  usersDirectory,
  setUsersDirectory,
  activityEvents,
  onLogActivity,
  backups,
  onCreateCloudBackup,
  onRestoreBackup,
  branding,
  setBranding,
  whatsappSetting,
  setWhatsappSetting,
  socialLinks,
  setSocialLinks,
  securitySettings,
  setSecuritySettings,
  paymentConfig,
  setPaymentConfig,
  seoSettings,
  setSeoSettings,
  auditLogs,
  setAuditLogs,
  adminCredentials,
  setAdminCredentials,
  promoOffers = [],
  setPromoOffers,
  teacherPayouts = [],
  setTeacherPayouts,
  studentAchievers = [],
  setStudentAchievers,
  onDeleteTutor,
  initialModule = 'dashboard',
}) => {
  const [activeModule, setActiveModule] = useState<AdminModuleKey>(initialModule);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuFilterQuery, setMenuFilterQuery] = useState('');
  const [backupLabel, setBackupLabel] = useState('Scheduled Full Registry Backup');
  const [backupBusy, setBackupBusy] = useState(false);
  const [notice, setNotice] = useState('');

  // Local states for CRUD forms
  const [newCityName, setNewCityName] = useState('');
  const [selectedCityForLocality, setSelectedCityForLocality] = useState(cities[0]?.id || 'patna');
  const [newLocalityName, setNewLocalityName] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedPageId, setSelectedPageId] = useState(pages[0]?.id || 'page-about');
  const [selectedTemplateId, setSelectedTemplateId] = useState(emailTemplates[0]?.id || 'tpl-1');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<Role>('ADMIN');

  // Home Page Photo Slider Upload States
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerImageUrl, setNewBannerImageUrl] = useState('');
  const [newBannerBadge, setNewBannerBadge] = useState('VERIFIED HOME & ONLINE TUTORS');
  const [newBannerCtaText, setNewBannerCtaText] = useState('Search Area Tutors');
  const [newBannerCtaAction, setNewBannerCtaAction] = useState<
    'find-tutor' | 'join-tutor' | 'online-tuition' | 'post-requirement'
  >('find-tutor');
  const [newBannerAnim, setNewBannerAnim] = useState<'ken-burns' | 'fade-zoom' | 'slide'>(
    'ken-burns'
  );

  // Home Page Special Promotional Offer States
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferSubtitle, setNewOfferSubtitle] = useState('');
  const [newOfferBadge, setNewOfferBadge] = useState('LIMITED TIME OFFER');
  const [newOfferDiscount, setNewOfferDiscount] = useState('Flat 50% OFF');
  const [newOfferCoupon, setNewOfferCoupon] = useState('BIHAR50');
  const [newOfferValid, setNewOfferValid] = useState('30 Nov 2026');

  // Admin Student Achiever & Feedback Creation States
  const [achStudentName, setAchStudentName] = useState('');
  const [achStudentPhoto, setAchStudentPhoto] = useState('');
  const [achDistrictName, setAchDistrictName] = useState('Patna (Bihar)');
  const [achBlockName, setAchBlockName] = useState('Danapur');
  const [achClassName, setAchClassName] = useState('Class 10 CBSE Board');
  const [achTitle, setAchTitle] = useState('');
  const [achScoreBadge, setAchScoreBadge] = useState('97.5% Marks');
  const [achTutorName, setAchTutorName] = useState(tutors[0]?.name || 'Sanjeet');
  const [achStudyMode, setAchStudyMode] = useState<'ONLINE' | 'OFFLINE' | 'BOTH'>('BOTH');
  const [achFeedback, setAchFeedback] = useState('');
  const [achRating, setAchRating] = useState(5);

  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogCategory, setNewBlogCategory] = useState('Academic Guide');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [newIpInput, setNewIpInput] = useState('');
  const [mobileApiKey, setMobileApiKey] = useState('vsetu_live_rn_expo_98a7bc654321fe');
  const [smtpConfig, setSmtpConfig] = useState({
    host: 'smtp.hostinger.com',
    port: '587',
    user: 'notifications@vidyasetu.in',
    pass: '••••••••••••',
    fromName: branding.companyName,
  });

  const appendAudit = (action: string, moduleName: string, details: string) => {
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        userId: 'u-admin-1',
        actorName: 'Super Admin (Owner)',
        action,
        module: moduleName,
        details,
        ipAddress: '103.21.244.18',
        userAgent: navigator.userAgent.slice(0, 48),
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3500);
  };

  const downloadCsv = (filename: string, headers: string[], rows: string[][]) => {
    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    onLogActivity(`Exported CSV report: ${filename}`, `${rows.length} rows`, 'NOMINAL');
    appendAudit('EXPORT_CSV_REPORT', 'Reports', `Exported ${filename} (${rows.length} rows)`);
    showToast(`Downloaded ${filename} (${rows.length} records).`);
  };

  const downloadFullJsonBackup = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      branding,
      adminCredentials,
      banners,
      whatsappSetting,
      socialLinks,
      securitySettings,
      paymentConfig,
      seoSettings,
      usersDirectory,
      tutors,
      cities,
      courses,
      subjects,
      inquiries,
      requirements,
      reviews,
      plans,
      payments,
      pages,
      blogPosts,
      emailTemplates,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vidyasetu-admin-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onLogActivity(
      'Exported editable Admin Data JSON file',
      `${tutors.length} tutors, ${banners.length} slider photos`,
      'SECURITY'
    );
    appendAudit('FULL_JSON_DATA_EXPORT', 'File Import/Export', 'Exported complete editable JSON archive');
    showToast('Downloaded editable Admin Data JSON file! You can edit this file and upload it back anytime.');
  };

  // Import JSON or CSV file to update Admin Panel & Website Data directly from user's file
  const handleImportAdminDataFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = String(event.target?.result || '');
      try {
        if (file.name.toLowerCase().endsWith('.csv')) {
          // Parse CSV file to bulk import/update Tutors
          const lines = content
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter(Boolean);
          if (lines.length < 2) {
            showToast('CSV file is empty or missing rows.');
            return;
          }
          const importedTutors: TutorItem[] = [];
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i]
              .split(',')
              .map((c) => c.replace(/^"|"$/g, '').trim());
            const name = cols[0] || `Verified Tutor ${i}`;
            const cityName = cols[1] || 'Patna';
            const localityName = cols[2] || 'Danapur';
            const pincode = cols[3] || '801503';
            const hourlyRate = Number(cols[4]) || 300;
            const qualification = cols[5] || 'M.Sc / B.Ed';
            const subjectsText = cols[6] || 'Mathematics, Science';
            const phone = cols[7] || '+91 94310 58415';
            const tutorIdNum = String(1584300 + i);
            importedTutors.push({
              id: `tutor-csv-${Date.now()}-${i}`,
              userId: `u-csv-${Date.now()}-${i}`,
              name,
              slug: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`,
              age: 30,
              gender: 'Male',
              experienceYrs: 6,
              qualification,
              bio: `I am a home tutor in ${cityName} (${localityName}) and I teach students at their home/ online. I teach CBSE/ICSE/BSEB classes and expert in ${subjectsText}.`,
              hourlyRate,
              cityId: cityName.toLowerCase().replace(/[^a-z0-9]+/g, ''),
              cityName,
              localityName,
              tuitionType: 'HOME_TUITION',
              isFeatured: true,
              isApproved: true,
              emailVerified: true,
              phoneVerified: true,
              lastLogin: 'Today',
              createdAt: new Date().toISOString(),
              courses: ['Class 6 to 10 CBSE', 'Class 11 & 12'],
              subjects: subjectsText.split(/;|\/|\|/).map((s) => s.trim()),
              ratingAvg: 5.0,
              reviewCount: 5,
              avatarSvgBg: '#4a89dc',
              initials: name.charAt(0).toUpperCase(),
              tutorNumericId: tutorIdNum,
              pincode,
              preferredTime: 'AnyTime',
              memberSince: 'Oct 2026',
              categories: 'Class 6 to 12',
              phone,
              email: `${name.toLowerCase().replace(/\s+/g, '.')}@vidyasetu.in`,
              address: `#102, ${localityName}, ${cityName}`,
              modes: {
                studentHome: true,
                tutorHome: true,
                institute: false,
                online: true,
              },
            });
          }
          setTutors((prev) => [...importedTutors, ...prev]);
          appendAudit('IMPORT_CSV_TUTORS', 'File Import/Export', `Imported ${importedTutors.length} tutors from ${file.name}`);
          showToast(`Successfully imported ${importedTutors.length} tutors from CSV file "${file.name}"!`);
        } else {
          // Parse JSON file to update all Admin Panel & Website Data
          const parsed = JSON.parse(content);
          let updatedSections: string[] = [];

          if (parsed.branding && typeof parsed.branding === 'object') {
            setBranding((prev) => ({ ...prev, ...parsed.branding }));
            updatedSections.push('Branding');
          }
          if (parsed.adminCredentials && typeof parsed.adminCredentials === 'object') {
            setAdminCredentials((prev) => ({ ...prev, ...parsed.adminCredentials }));
            updatedSections.push('Admin Login Credentials');
          }
          if (Array.isArray(parsed.banners)) {
            setBanners(parsed.banners);
            updatedSections.push(`${parsed.banners.length} Slider Photos/Banners`);
          }
          if (Array.isArray(parsed.tutors)) {
            setTutors(parsed.tutors);
            updatedSections.push(`${parsed.tutors.length} Tutors`);
          }
          if (Array.isArray(parsed.cities)) {
            setCities(parsed.cities);
            updatedSections.push(`${parsed.cities.length} Cities`);
          }
          if (Array.isArray(parsed.courses)) {
            setCourses(parsed.courses);
            updatedSections.push('Courses');
          }
          if (Array.isArray(parsed.subjects)) {
            setSubjects(parsed.subjects);
            updatedSections.push('Subjects');
          }
          if (Array.isArray(parsed.plans)) {
            setPlans(parsed.plans);
            updatedSections.push('Pricing Plans');
          }
          if (Array.isArray(parsed.pages)) {
            setPages(parsed.pages);
            updatedSections.push('CMS Pages');
          }
          if (parsed.whatsappSetting && typeof parsed.whatsappSetting === 'object') {
            setWhatsappSetting((prev) => ({ ...prev, ...parsed.whatsappSetting }));
            updatedSections.push('WhatsApp Settings');
          }
          if (Array.isArray(parsed.socialLinks)) {
            setSocialLinks(parsed.socialLinks);
            updatedSections.push('Social Links');
          }
          if (parsed.securitySettings && typeof parsed.securitySettings === 'object') {
            setSecuritySettings((prev) => ({ ...prev, ...parsed.securitySettings }));
            updatedSections.push('Security Settings');
          }
          if (parsed.paymentConfig && typeof parsed.paymentConfig === 'object') {
            setPaymentConfig((prev) => ({ ...prev, ...parsed.paymentConfig }));
            updatedSections.push('Payment Config');
          }
          if (parsed.seoSettings && typeof parsed.seoSettings === 'object') {
            setSeoSettings((prev) => ({ ...prev, ...parsed.seoSettings }));
            updatedSections.push('SEO Settings');
          }
          if (Array.isArray(parsed.usersDirectory)) {
            setUsersDirectory(parsed.usersDirectory);
            updatedSections.push('Users');
          }
          if (Array.isArray(parsed.inquiries)) {
            setInquiries(parsed.inquiries);
          }
          if (Array.isArray(parsed.requirements)) {
            setRequirements(parsed.requirements);
          }
          if (Array.isArray(parsed.reviews)) {
            setReviews(parsed.reviews);
          }
          if (Array.isArray(parsed.blogPosts)) {
            setBlogPosts(parsed.blogPosts);
          }

          appendAudit(
            'IMPORT_ADMIN_DATA_FILE',
            'File Import/Export',
            `Imported ${file.name} (${updatedSections.join(', ')})`
          );
          onLogActivity(
            `Updated Admin Panel Data from File: ${file.name}`,
            updatedSections.join(', ') || 'All Data Synced',
            'SECURITY'
          );
          showToast(
            `Admin Data Updated from "${file.name}"! Updated: ${
              updatedSections.join(', ') || 'Configuration'
            }.`
          );
        }
      } catch (err) {
        showToast(
          `Could not parse "${file.name}". Please upload a valid .json Admin Data file or .csv Tutor file.`
        );
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Upload Photo File from computer/phone for Home Page Slider
  const handleBannerPhotoFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetBannerId?: string
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (targetBannerId) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = String(ev.target?.result || '');
        if (!dataUrl) return;
        setBanners((prev) =>
          prev.map((b) => (b.id === targetBannerId ? { ...b, imageUrl: dataUrl } : b))
        );
        appendAudit('UPDATE_SLIDER_PHOTO', 'Home Photo Slider', `Updated photo for slide ${targetBannerId}`);
        showToast(`Updated slide photo from "${file.name}"! It is now live on the Home Page slider.`);
      };
      reader.readAsDataURL(file);
    } else {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = String(ev.target?.result || '');
        if (!dataUrl) return;
        setNewBannerImageUrl(dataUrl);
        showToast(`Loaded photo "${file.name}". Click "Publish Photo Slide to Home Page" or use Instant Upload!`);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Instant Multi-Photo Upload to Home Page Slider
  const handleInstantMultiPhotoSlideUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = String(ev.target?.result || '');
        if (!dataUrl) return;
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
        setBanners((prev) => [
          ...prev,
          {
            id: `ban-photo-${Date.now()}-${index}`,
            title:
              newBannerTitle.trim() ||
              `Verified Home & Online Tutors — ${cleanName.charAt(0).toUpperCase() + cleanName.slice(1)}`,
            subtitle:
              newBannerSubtitle.trim() ||
              '1-on-1 Personalized Home Tuition & Live Online Classes in Your Locality. Book a Free Demo Class Today.',
            link: '/search',
            isActive: true,
            sortOrder: prev.length + 1,
            imageUrl: dataUrl,
            ctaText: newBannerCtaText || 'Search Area Tutors',
            ctaAction: newBannerCtaAction,
            animationStyle: newBannerAnim,
            badgeText: newBannerBadge || 'FEATURED SLIDE',
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    appendAudit(
      'UPLOAD_HOME_SLIDER_PHOTOS',
      'Home Photo Slider',
      `Uploaded ${files.length} photo slide(s) to Home Page`
    );
    showToast(`Added ${files.length} new photo slide(s) to the Home Page Photo Slider with animation!`);
    e.target.value = '';
  };

  const totalRevenue = payments
    .filter((p) => p.status === 'PAID')
    .reduce((acc, p) => acc + p.amount, 0);

  const getModuleCountBadge = (key: AdminModuleKey): string | null => {
    switch (key) {
      case 'tutors':
        return String(tutors.length);
      case 'students':
        return String(usersDirectory.filter((u) => u.role === 'STUDENT').length);
      case 'requirements':
        return String(requirements.length);
      case 'cities':
        return String(cities.length);
      case 'courses':
        return String(courses.length);
      case 'subjects':
        return String(subjects.length);
      case 'banners':
        return `${banners.length}+${promoOffers.length}`;
      case 'plans':
        return String(plans.length);
      case 'payments':
        return `${payments.length}/${teacherPayouts.length}`;
      case 'inquiries':
        return String(inquiries.length);
      case 'reviews':
        return String(reviews.length);
      case 'users':
        return String(usersDirectory.length);
      case 'blog':
        return String(blogPosts.length);
      case 'audit-log':
        return String(auditLogs.length);
      default:
        return null;
    }
  };

  const categoriesOrder: Array<typeof MODULE_LIST[number]['category']> = [
    'Core Directory & Users',
    'Locations & Academics',
    'Finance, Offers & Payouts',
    'CMS, Slider & Marketing',
    'System, Security & API',
  ];

  const filteredSidebarModules = MODULE_LIST.filter(
    (m) =>
      !menuFilterQuery.trim() ||
      m.label.toLowerCase().includes(menuFilterQuery.trim().toLowerCase()) ||
      m.num.includes(menuFilterQuery.trim()) ||
      m.category.toLowerCase().includes(menuFilterQuery.trim().toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col lg:flex-row bg-[#F4F7FA] dark:bg-slate-950 animate-page-transition">
      {/* 290px Executive List-by-List Sidebar Navigation */}
      <aside className="w-full lg:w-72 shrink-0 bg-gradient-to-b from-[#041e30] via-[#062c47] to-[#083b5c] text-white border-b lg:border-b-0 lg:border-r border-slate-800 p-4 flex flex-col">
        {/* Owner Master Identity Card + Quick Logo Upload */}
        <div className="mb-3 p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950">
              👑 Owner Super Admin
            </span>
            <span className="text-[11px] font-mono text-emerald-300">🟢 29 Modules</span>
          </div>
          <div className="flex items-center gap-2.5">
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={branding.companyName}
                className="w-10 h-10 rounded-lg object-contain bg-white p-1 border border-amber-300 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-[#ff6600] text-slate-950 font-display font-extrabold text-base flex items-center justify-center shrink-0">
                {branding.companyName.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <h2 className="font-display text-sm font-bold text-white truncate">
                {branding.companyName} Control Center
              </h2>
              <p className="text-[10px] text-slate-300">
                List-by-List Menu · Full Control
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <label className="flex-1 px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-extrabold inline-flex items-center justify-center gap-1 cursor-pointer transition-colors">
              <Camera className="w-3.5 h-3.5" />
              <span>Upload Website Logo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const compressed = await readAndCompressImageFile(file, 480, true);
                  if (compressed) {
                    setBranding((prev) => ({ ...prev, logoUrl: compressed }));
                    appendAudit('UPLOAD_WEBSITE_LOGO', 'Branding & Logo', file.name);
                    showToast('Website Logo uploaded and live on Header & Footer!');
                  }
                  e.target.value = '';
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => setActiveModule('settings-general')}
              className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold cursor-pointer"
              title="Open Logo & Branding Settings"
            >
              Logo Settings
            </button>
          </div>
        </div>

        {/* Quick Menu Filter Search */}
        <div className="mb-3 relative">
          <Search className="w-3.5 h-3.5 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={menuFilterQuery}
            onChange={(e) => setMenuFilterQuery(e.target.value)}
            placeholder="Search 29 menu modules..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900/80 text-white placeholder-slate-400 border border-white/15 rounded-lg focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Categorized List-by-List Menu */}
        <nav
          aria-label="Admin Console List-by-List Navigation"
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-1"
        >
          {categoriesOrder.map((categoryName) => {
            const itemsInCat = filteredSidebarModules.filter((m) => m.category === categoryName);
            if (itemsInCat.length === 0) return null;
            return (
              <div key={categoryName} className="space-y-1">
                <p className="px-2.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-300/90">
                  {categoryName}
                </p>
                <div className="space-y-1">
                  {itemsInCat.map((mod) => {
                    const badge = getModuleCountBadge(mod.key);
                    const isSelected = activeModule === mod.key;
                    return (
                      <button
                        key={mod.key}
                        type="button"
                        onClick={() => setActiveModule(mod.key)}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#ff6600] to-[#e05500] text-white shadow-sm'
                            : 'text-slate-200 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${
                              isSelected
                                ? 'bg-slate-950/30 text-amber-200 font-bold'
                                : 'bg-white/10 text-amber-300'
                            }`}
                          >
                            {mod.num}
                          </span>
                          <span className="truncate">{mod.label}</span>
                        </div>
                        {badge && (
                          <span
                            className={`font-mono text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                              isSelected
                                ? 'bg-white text-slate-950 font-bold'
                                : 'bg-slate-900/80 text-slate-300'
                            }`}
                          >
                            {badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Workspace Viewport */}
      <main className="flex-1 p-5 sm:p-6 lg:p-8 max-w-6xl">
        {/* Executive Top Banner + Action Bar */}
        <div className="bg-gradient-to-r from-[#062c47] via-[#084d75] to-[#0d6296] text-white rounded-2xl p-5 sm:p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase text-amber-300">
                <span>🛡️ {branding.companyName} Master Admin Console</span>
                <span>·</span>
                <span>
                  {MODULE_LIST.find((m) => m.key === activeModule)?.category}
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold mt-1">
                {MODULE_LIST.find((m) => m.key === activeModule)?.num}.{' '}
                {MODULE_LIST.find((m) => m.key === activeModule)?.label}
              </h1>
              <p className="text-xs text-slate-200 mt-1">
                Total Tutors: <strong>{tutors.length}</strong> · Students/Users:{' '}
                <strong>{usersDirectory.length}</strong> · Requirements:{' '}
                <strong>{requirements.length}</strong> · Active Offers:{' '}
                <strong>{promoOffers.filter((o) => o.isActive).length}</strong> · Bank Payouts:{' '}
                <strong>{teacherPayouts.length}</strong>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveModule('settings-general')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg whitespace-nowrap cursor-pointer shadow-2xs"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>🖼️ Website Logo &amp; Brand</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModule('banners')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg whitespace-nowrap cursor-pointer"
              >
                <ImagePlus className="w-3.5 h-3.5" />
                <span>Slider &amp; Offers ({banners.filter((b) => b.isActive).length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModule('payments')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#ff6600] hover:bg-[#e05500] rounded-lg whitespace-nowrap cursor-pointer"
              >
                <span>🏦 Teacher Bank Payouts ({teacherPayouts.length})</span>
              </button>
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-white/15 border border-white/25 rounded-lg hover:bg-white/25 whitespace-nowrap cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Import (.json/.csv)</span>
                <input
                  type="file"
                  accept=".json,.csv"
                  onChange={handleImportAdminDataFile}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={downloadFullJsonBackup}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg whitespace-nowrap cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Data (.json)</span>
              </button>
            </div>
          </div>
        </div>

        {notice && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* MODULE 01: OVERVIEW DASHBOARD */}
        {activeModule === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                <p className="text-xs text-slate-500">Verified Tutors</p>
                <p className="font-mono text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
                  {tutors.filter((t) => t.isApproved).length} / {tutors.length}
                </p>
                <p className="text-xs text-emerald-700 mt-1">Across {cities.length} active cities</p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                <p className="text-xs text-slate-500">WhatsApp Clicks Tracked</p>
                <p className="font-mono text-2xl font-bold text-[#25D366] mt-1 tabular-nums">
                  {whatsappSetting.totalClicks}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Profile: {whatsappSetting.clicksByPage.profile || 0} · Home:{' '}
                  {whatsappSetting.clicksByPage.home || 0}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                <p className="text-xs text-slate-500">Inquiries & Requirements</p>
                <p className="font-mono text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
                  {inquiries.length + requirements.length}
                </p>
                <p className="text-xs text-[#084d75] dark:text-[#f7941d] mt-1">
                  {inquiries.filter((i) => i.status === 'NEW').length} new inquiries awaiting reply
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                <p className="text-xs text-slate-500">Plan Subscription Revenue</p>
                <p className="font-mono text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  {payments.filter((p) => p.status === 'PAID').length} verified Razorpay settlements
                </p>
              </div>
            </div>

            {/* Quick Owner Jump Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
              <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Quick Owner Controls (Photo Slider, File Import &amp; Branding)
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModule('banners')}
                  className="px-3.5 py-2 text-xs font-bold bg-[#ff6600] text-white rounded-lg hover:bg-[#e05500] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ImagePlus className="w-3.5 h-3.5" />
                  <span>Upload Home Slider Photos ({banners.length} Slides)</span>
                </button>
                <label className="px-3.5 py-2 text-xs font-bold bg-[#084d75] text-white rounded-lg hover:opacity-95 inline-flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Change Admin Data from File (.json / .csv)</span>
                  <input
                    type="file"
                    accept=".json,.csv"
                    onChange={handleImportAdminDataFile}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setActiveModule('settings-general')}
                  className="px-3.5 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-200"
                >
                  Change Company Name ({branding.companyName})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModule('settings-social')}
                  className="px-3.5 py-2 text-xs font-medium bg-[#25D366]/10 text-emerald-800 dark:text-emerald-300 rounded-lg hover:bg-[#25D366]/20"
                >
                  Configure WhatsApp Highlight (+{whatsappSetting.number})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModule('settings-security')}
                  className="px-3.5 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-200"
                >
                  Change Admin Login ID &amp; Password ({adminCredentials.adminId})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white mb-4">
                  City-Wise Tutor Distribution
                </h3>
                <div className="space-y-3">
                  {cities.slice(0, 6).map((city) => {
                    const count = tutors.filter((t) => t.cityId === city.id).length;
                    const pct = Math.min(100, Math.max(15, count * 35));
                    return (
                      <div key={city.id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {city.name}
                          </span>
                          <span className="font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                            {count} tutors ({city.localities.length} localities)
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#084d75] rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                    Real-Time Activity Stream (Asmuth Monitor)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveModule('asmuth')}
                    className="text-xs font-medium text-[#084d75] dark:text-[#f7941d] hover:underline"
                  >
                    Open Asmuth Panel
                  </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activityEvents.slice(0, 5).map((ev) => (
                    <div key={ev.id} className="py-2.5 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          {ev.actorName} ({ev.actorRole}) — {ev.action}
                        </p>
                        <p className="text-xs text-slate-500">{ev.target}</p>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 shrink-0">
                        {ev.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 02: FILE IMPORT/EXPORT & ASMUTH BACKUP */}
        {activeModule === 'asmuth' && (
          <div className="space-y-6">
            {/* File-Based Admin Data Updater Card */}
            <div className="bg-white dark:bg-slate-900 border-2 border-[#084d75]/30 rounded-xl p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6600]">
                    Direct File-Based Admin Data Control
                  </span>
                  <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    Update Admin Panel &amp; Website Data from Your File (.json or .csv)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Step 1: Click &ldquo;Download Editable Admin Data File (.json)&rdquo; · Step 2: Edit Company Name, Tutors, Cities, Plans, Slider Photos, or Admin Password in the file · Step 3: Upload your file below to apply changes immediately!
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={downloadFullJsonBackup}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#084d75] rounded-lg hover:opacity-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>1. Download Editable Admin File (.json)</span>
                  </button>
                  <label className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#ff6600] hover:bg-[#e05500] rounded-lg cursor-pointer shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>2. Upload File to Update Data (.json / .csv)</span>
                    <input
                      type="file"
                      accept=".json,.csv"
                      onChange={handleImportAdminDataFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-slate-900 dark:text-white">Full JSON Configuration File</p>
                  <p className="text-slate-500 mt-1">
                    Updates Branding, Admin ID/Password, Home Photo Slider, Tutors, Cities, Courses, Subjects, Plans &amp; Security in one click.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-slate-900 dark:text-white">Excel / CSV Tutor Bulk Import</p>
                  <p className="text-slate-500 mt-1">
                    Upload any `.csv` with columns: <code className="font-mono">Name,City,Locality,Pincode,HourlyRate,Qualification,Subjects,Phone</code>.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-slate-900 dark:text-white">Auto-Saved Locally &amp; Cloud</p>
                  <p className="text-slate-500 mt-1">
                    All imported file changes and uploaded slider photos persist automatically across browser refreshes.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    Asmuth Cloud Snapshot &amp; Disaster Recovery Vault
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Create immutable SHA-256 cloud snapshots of all user profiles, tutors, inquiries, and settings in Firestore (`/backups`).
                  </p>
                </div>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setBackupBusy(true);
                  try {
                    await onCreateCloudBackup(backupLabel.trim() || 'Manual Admin Snapshot');
                    appendAudit('CREATE_CLOUD_BACKUP', 'Asmuth Vault', backupLabel);
                    showToast('Cloud backup snapshot committed to Firestore /backups collection.');
                  } finally {
                    setBackupBusy(false);
                  }
                }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
              >
                <input
                  type="text"
                  value={backupLabel}
                  onChange={(e) => setBackupLabel(e.target.value)}
                  placeholder="Snapshot label (e.g. Pre-Deployment User Backup)"
                  className="flex-1 px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
                />
                <button
                  type="submit"
                  disabled={backupBusy}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#084d75] rounded-lg hover:opacity-95 whitespace-nowrap"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${backupBusy ? 'animate-spin' : ''}`} />
                  <span>{backupBusy ? 'Encrypting & Saving...' : 'Create Cloud Backup Snapshot'}</span>
                </button>
              </form>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-slate-500">
                      <th className="py-2.5 pr-4 font-medium">Snapshot Label</th>
                      <th className="py-2.5 px-4 font-medium">Records</th>
                      <th className="py-2.5 px-4 font-medium">SHA-256 Checksum</th>
                      <th className="py-2.5 px-4 font-medium">Created At</th>
                      <th className="py-2.5 pl-4 text-right font-medium">Recovery Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {backups.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="py-3 pr-4 font-medium text-slate-900">{b.label}</td>
                        <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                          {b.recordCount} items
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">{b.checksum}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">
                          {b.createdAt.slice(0, 19).replace('T', ' ')}
                        </td>
                        <td className="py-3 pl-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              onRestoreBackup(b);
                              appendAudit('RESTORE_BACKUP', 'Asmuth Vault', b.label);
                              showToast(`Restored system state from snapshot "${b.label}".`);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#084d75] bg-blue-50 hover:bg-blue-100 rounded-md"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Restore State</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 17: SETTINGS — GENERAL (WEBSITE LOGO & COMPANY BRANDING) */}
        {activeModule === 'settings-general' && (
          <div className="space-y-6">
            {/* DEDICATED WEBSITE LOGO UPLOAD & LIVE PREVIEW PANEL */}
            <div className="bg-white dark:bg-slate-900 border-2 border-[#084d75] rounded-xl p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ff6600]">
                    Admin Website Logo Control (वेबसाइट का लोगो यहाँ से डालें या बदलें)
                  </span>
                  <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[#084d75]" />
                    <span>Website Logo Upload, Size &amp; Live Header/Footer Preview</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload your custom PNG, SVG, JPG, or WebP logo from your phone/computer or paste a logo URL. Updates Header, Footer, Login &amp; Admin Panel immediately.
                  </p>
                </div>
                {branding.logoUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setBranding((prev) => ({ ...prev, logoUrl: '' }));
                      appendAudit('REMOVE_CUSTOM_LOGO', 'Branding Settings', 'Reverted to default brand emblem');
                      showToast('Removed custom logo image and restored default brand emblem.');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Custom Logo</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left: Upload File + Paste URL + Height & Text Toggle */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="px-4 py-2.5 rounded-xl bg-[#ff6600] hover:bg-[#e05500] text-white text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer shadow-xs transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Upload Logo Image from Device (PNG / JPG / SVG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const compressed = await readAndCompressImageFile(file, 480, true);
                          if (compressed) {
                            setBranding((prev) => ({ ...prev, logoUrl: compressed }));
                            appendAudit('UPLOAD_WEBSITE_LOGO', 'Branding Settings', file.name);
                            showToast('Website Logo uploaded! Live across Header, Footer & Panels.');
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Or Paste Direct Logo Image URL
                    </label>
                    <input
                      type="text"
                      value={branding.logoUrl?.startsWith('data:') ? '' : branding.logoUrl || ''}
                      onChange={(e) => setBranding((prev) => ({ ...prev, logoUrl: e.target.value }))}
                      placeholder="https://example.com/my-logo.png (or use Upload button above)"
                      className="w-full px-3.5 py-2 text-xs font-mono border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Header Logo Height Size
                      </label>
                      <select
                        value={branding.logoHeightPx || 40}
                        onChange={(e) =>
                          setBranding((prev) => ({
                            ...prev,
                            logoHeightPx: Number(e.target.value) || 40,
                          }))
                        }
                        className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                      >
                        <option value={32}>Compact (32px height)</option>
                        <option value={40}>Standard (40px height)</option>
                        <option value={48}>Large (48px height)</option>
                        <option value={56}>Extra Large (56px height)</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <label className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between gap-2 cursor-pointer bg-slate-50 dark:bg-slate-800/60">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Show Brand Name Next to Logo
                        </span>
                        <input
                          type="checkbox"
                          checked={branding.showLogoText !== false}
                          onChange={(e) =>
                            setBranding((prev) => ({ ...prev, showLogoText: e.target.checked }))
                          }
                          className="rounded border-slate-300"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right: Live Header & Footer Logo Preview Box */}
                <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    Live Header &amp; Footer Logo Preview
                  </p>
                  <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center gap-3 shadow-2xs">
                    {branding.logoUrl ? (
                      <img
                        src={branding.logoUrl}
                        alt={branding.companyName}
                        style={{ height: `${branding.logoHeightPx || 40}px` }}
                        className="w-auto max-w-[160px] object-contain shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b6ef5] to-[#084d75] text-white flex items-center justify-center font-display font-extrabold text-lg shadow-xs shrink-0">
                        {branding.companyName.charAt(0)}
                      </div>
                    )}
                    {(branding.showLogoText !== false || !branding.logoUrl) && (
                      <div>
                        <p className="font-display text-lg font-extrabold text-[#084d75] dark:text-white leading-tight">
                          {branding.companyName}
                        </p>
                        <p className="text-[10px] text-slate-500 line-clamp-1">
                          {branding.tagline}
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    ✓ {branding.logoUrl ? 'Custom Uploaded Logo Active' : 'Default Brand Emblem Active (Upload an image to replace)'}
                  </p>
                </div>
              </div>
            </div>

            {/* COMPANY IDENTITY & CONTACT DETAILS */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
              <div>
                <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                  Company Branding &amp; Contact Identity (Live Sync via `/api/v1/settings/public`)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Changing the Company Name, Tagline, or Contact details updates the Header, Footer, Meta Title, and Invoices immediately without rebuild.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Company / Brand Name
                  </label>
                  <input
                    type="text"
                    value={branding.companyName}
                    onChange={(e) => setBranding((p) => ({ ...p, companyName: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={branding.tagline}
                    onChange={(e) => setBranding((p) => ({ ...p, tagline: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={branding.contactEmail}
                    onChange={(e) => setBranding((p) => ({ ...p, contactEmail: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Helpline Phone
                  </label>
                  <input
                    type="text"
                    value={branding.contactPhone}
                    onChange={(e) => setBranding((p) => ({ ...p, contactPhone: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Registered Office Address
                  </label>
                  <input
                    type="text"
                    value={branding.officeAddress}
                    onChange={(e) => setBranding((p) => ({ ...p, officeAddress: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Footer Copyright Notice
                  </label>
                  <input
                    type="text"
                    value={branding.footerCopyright}
                    onChange={(e) => setBranding((p) => ({ ...p, footerCopyright: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  appendAudit('UPDATE_COMPANY_BRANDING', 'Branding Settings', branding.companyName);
                  showToast(`Saved Logo & Company Branding for "${branding.companyName}".`);
                }}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#084d75] rounded-lg cursor-pointer"
              >
                Save Logo &amp; Branding Changes
              </button>
            </div>
          </div>
        )}

        {/* MODULE 18: SETTINGS — WHATSAPP HIGHLIGHT & SOCIAL LINKS */}
        {activeModule === 'settings-social' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  <div>
                    <h2 className="font-display text-base font-semibold text-slate-900">
                      WhatsApp Highlight & Click Analytics Control
                    </h2>
                    <p className="text-xs text-slate-500">
                      Configure the floating WhatsApp button, default message, button position, and track conversions.
                    </p>
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whatsappSetting.isActive}
                    onChange={(e) =>
                      setWhatsappSetting((p) => ({ ...p, isActive: e.target.checked }))
                    }
                    className="rounded border-slate-300"
                  />
                  <span>Enable WhatsApp Highlight</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    WhatsApp Number (with country code)
                  </label>
                  <input
                    type="text"
                    value={whatsappSetting.number}
                    onChange={(e) =>
                      setWhatsappSetting((p) => ({ ...p, number: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Floating Button Label
                  </label>
                  <input
                    type="text"
                    value={whatsappSetting.buttonText}
                    onChange={(e) =>
                      setWhatsappSetting((p) => ({ ...p, buttonText: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Floating Position
                  </label>
                  <select
                    value={whatsappSetting.buttonPosition}
                    onChange={(e) =>
                      setWhatsappSetting((p) => ({
                        ...p,
                        buttonPosition: e.target.value as 'bottom-right' | 'bottom-left',
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Pre-filled Default WhatsApp Message
                  </label>
                  <input
                    type="text"
                    value={whatsappSetting.defaultMessage}
                    onChange={(e) =>
                      setWhatsappSetting((p) => ({ ...p, defaultMessage: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  appendAudit('UPDATE_WHATSAPP_CONFIG', 'WhatsApp & Social', whatsappSetting.number);
                  showToast('WhatsApp highlight settings updated.');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#25D366] rounded-lg"
              >
                Save WhatsApp Configuration
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                    Social Media Platform Icons &amp; Links (WhatsApp, Facebook, Instagram, Twitter, YouTube, LinkedIn, Telegram)
                  </h3>
                  <p className="text-xs text-slate-500">
                    All 7 social media brand icons are displayed in the themed Footer and Contact page.
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {socialLinks.filter((s) => s.isActive).length} / 7 Icons Active
                </span>
              </div>
              <div className="space-y-3">
                {socialLinks.map((soc) => {
                  const meta = SOCIAL_PLATFORM_META[soc.platform];
                  return (
                    <div key={soc.id} className="flex flex-col sm:flex-row items-center gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                      <div className="flex items-center gap-2.5 w-40 shrink-0">
                        <span
                          style={{ backgroundColor: meta?.brandColor || '#084d75' }}
                          className="w-8 h-8 rounded-full text-white flex items-center justify-center shrink-0 shadow-xs"
                        >
                          <SocialPlatformIcon platform={soc.platform} className="w-4 h-4" />
                        </span>
                        <span className="text-xs font-bold capitalize text-slate-800 dark:text-slate-100">
                          {meta?.label || soc.platform}
                        </span>
                      </div>
                      <input
                        type="url"
                        value={soc.url}
                        onChange={(e) =>
                          setSocialLinks((prev) =>
                            prev.map((item) =>
                              item.id === soc.id ? { ...item, url: e.target.value } : item
                            )
                          )
                        }
                        className="flex-1 px-3 py-1.5 text-xs font-mono border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg w-full"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setSocialLinks((prev) =>
                            prev.map((item) =>
                              item.id === soc.id ? { ...item, isActive: !item.isActive } : item
                            )
                          )
                        }
                        className={`px-3 py-1.5 text-xs font-bold rounded-md cursor-pointer shrink-0 ${
                          soc.isActive
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {soc.isActive ? '✓ Icon Visible' : 'Hidden'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MODULE 19: SETTINGS — PAYMENTS (RAZORPAY + STRIPE + GST) */}
        {activeModule === 'settings-payments' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="font-display text-base font-semibold text-slate-900">
                  Payment Gateway Configuration (Razorpay Primary + Stripe International)
                </h2>
                <p className="text-xs text-slate-500">
                  Manage API keys, webhook HMAC secrets, test/live environment toggle, currency, and GST percentage.
                </p>
              </div>
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentConfig.testMode}
                  onChange={(e) =>
                    setPaymentConfig((p) => ({ ...p, testMode: e.target.checked }))
                  }
                />
                <span>Sandbox / Test Mode Active</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Razorpay Key ID
                </label>
                <input
                  type="text"
                  value={paymentConfig.razorpayKeyId}
                  onChange={(e) =>
                    setPaymentConfig((p) => ({ ...p, razorpayKeyId: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Razorpay Key Secret (Webhook HMAC-SHA256)
                </label>
                <input
                  type="password"
                  value={paymentConfig.razorpayKeySecret}
                  onChange={(e) =>
                    setPaymentConfig((p) => ({ ...p, razorpayKeySecret: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Stripe Publishable Key (Optional International)
                </label>
                <input
                  type="text"
                  value={paymentConfig.stripePublishableKey}
                  onChange={(e) =>
                    setPaymentConfig((p) => ({ ...p, stripePublishableKey: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Currency</label>
                  <select
                    value={paymentConfig.currency}
                    onChange={(e) =>
                      setPaymentConfig((p) => ({
                        ...p,
                        currency: e.target.value as 'INR' | 'USD',
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    GST / Tax (%)
                  </label>
                  <input
                    type="number"
                    value={paymentConfig.gstPercent}
                    onChange={(e) =>
                      setPaymentConfig((p) => ({ ...p, gstPercent: Number(e.target.value) }))
                    }
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Dedicated User / Student Payment Amounts Controlled by Admin */}
            <div className="p-4 bg-amber-50 dark:bg-slate-800 border-2 border-[#ff6600] rounded-xl space-y-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6600]">
                  Admin-Controlled User &amp; Student Payment Amounts
                </span>
                <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  Set Contact Unlock Amount &amp; Pass Amount for Users / Students
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  These exact amounts are charged to students/parents when unlocking any Teacher&apos;s Phone, WhatsApp, and Full Address on the Tutor Profile page.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#084d75] dark:text-amber-300 mb-1">
                    Single Tutor Contact Unlock (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={paymentConfig.userContactUnlockPrice}
                    onChange={(e) =>
                      setPaymentConfig((p) => ({
                        ...p,
                        userContactUnlockPrice: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 text-sm font-mono font-bold text-[#e66000] bg-white dark:bg-slate-900 border border-amber-400 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#084d75] dark:text-amber-300 mb-1">
                    Unlimited User Pass Amount (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={paymentConfig.userUnlimitedPassPrice}
                    onChange={(e) =>
                      setPaymentConfig((p) => ({
                        ...p,
                        userUnlimitedPassPrice: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 text-sm font-mono font-bold text-[#084d75] bg-white dark:bg-slate-900 border border-amber-400 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    User Pass Validity (Months)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={36}
                    value={paymentConfig.userPassDurationMonths}
                    onChange={(e) =>
                      setPaymentConfig((p) => ({
                        ...p,
                        userPassDurationMonths: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 text-sm font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Student Registration Fee (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={paymentConfig.studentRegistrationFee}
                    onChange={(e) =>
                      setPaymentConfig((p) => ({
                        ...p,
                        studentRegistrationFee: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 text-sm font-mono bg-white dark:bg-slate-900 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                appendAudit(
                  'UPDATE_PAYMENT_GATEWAY',
                  'Payment Settings',
                  `User Unlock: ₹${paymentConfig.userContactUnlockPrice}, Pass: ₹${paymentConfig.userUnlimitedPassPrice} (${paymentConfig.userPassDurationMonths}M)`
                );
                showToast(
                  `Saved Payment Settings! User Contact Unlock: ₹${paymentConfig.userContactUnlockPrice} | Unlimited Pass: ₹${paymentConfig.userUnlimitedPassPrice}.`
                );
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#084d75] rounded-lg cursor-pointer"
            >
              Save Payment &amp; User Unlock Amounts
            </button>
          </div>
        )}

        {/* MODULE 20: SETTINGS — SMTP / EMAIL */}
        {activeModule === 'settings-smtp' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
            <h2 className="font-display text-base font-semibold text-slate-900">
              Nodemailer SMTP Server Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">SMTP Host</label>
                <input
                  type="text"
                  value={smtpConfig.host}
                  onChange={(e) => setSmtpConfig((p) => ({ ...p, host: e.target.value }))}
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">SMTP Port</label>
                <input
                  type="text"
                  value={smtpConfig.port}
                  onChange={(e) => setSmtpConfig((p) => ({ ...p, port: e.target.value }))}
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">SMTP User</label>
                <input
                  type="text"
                  value={smtpConfig.user}
                  onChange={(e) => setSmtpConfig((p) => ({ ...p, user: e.target.value }))}
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Sender Display Name
                </label>
                <input
                  type="text"
                  value={smtpConfig.fromName}
                  onChange={(e) => setSmtpConfig((p) => ({ ...p, fromName: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => showToast('SMTP settings saved.')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#084d75] rounded-lg"
              >
                Save SMTP Config
              </button>
              <button
                type="button"
                onClick={() =>
                  showToast(`Dispatched test email via ${smtpConfig.host}:${smtpConfig.port}.`)
                }
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg"
              >
                Send Test Email
              </button>
            </div>
          </div>
        )}

        {/* MODULE 21: SETTINGS — SEO & ANALYTICS */}
        {activeModule === 'settings-seo' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="font-display text-base font-semibold text-slate-900">
              Global SEO Metadata, Google Analytics 4, GTM & Meta Pixel
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Default Site Meta Title
                </label>
                <input
                  type="text"
                  value={seoSettings.siteTitle}
                  onChange={(e) => setSeoSettings((p) => ({ ...p, siteTitle: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Default Meta Description
                </label>
                <textarea
                  rows={2}
                  value={seoSettings.siteDesc}
                  onChange={(e) => setSeoSettings((p) => ({ ...p, siteDesc: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Google Analytics 4 ID
                </label>
                <input
                  type="text"
                  value={seoSettings.gaId}
                  onChange={(e) => setSeoSettings((p) => ({ ...p, gaId: e.target.value }))}
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Google Tag Manager ID
                </label>
                <input
                  type="text"
                  value={seoSettings.gtmId}
                  onChange={(e) => setSeoSettings((p) => ({ ...p, gtmId: e.target.value }))}
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                document.title = seoSettings.siteTitle;
                showToast('SEO & Analytics tags updated.');
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#084d75] rounded-lg"
            >
              Save SEO Settings
            </button>
          </div>
        )}

        {/* MODULE 22: ADMIN SECURITY CONTROL PANEL & OWNER LOGIN CREDENTIALS */}
        {activeModule === 'settings-security' && (
          <div className="space-y-6">
            {/* Dedicated Owner Admin Login ID & Password Configuration */}
            <div className="bg-white dark:bg-slate-900 border-2 border-[#ff6600]/40 rounded-xl p-6 space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6600]">
                  Dedicated Admin Panel Login Credentials
                </span>
                <h2 className="font-display text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Owner Admin Login ID, Email &amp; Password Control
                </h2>
                <p className="text-xs text-slate-500">
                  Update your Admin Panel Login ID and Password used on the dedicated &ldquo;Admin Panel Login&rdquo; tab.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Admin Login ID / Username
                  </label>
                  <input
                    type="text"
                    value={adminCredentials.adminId}
                    onChange={(e) =>
                      setAdminCredentials((prev) => ({ ...prev, adminId: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Owner Admin Email
                  </label>
                  <input
                    type="email"
                    value={adminCredentials.ownerEmail}
                    onChange={(e) =>
                      setAdminCredentials((prev) => ({ ...prev, ownerEmail: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Admin Panel Password
                  </label>
                  <input
                    type="text"
                    value={adminCredentials.adminPassword}
                    onChange={(e) =>
                      setAdminCredentials((prev) => ({ ...prev, adminPassword: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  appendAudit(
                    'UPDATE_ADMIN_LOGIN_CREDENTIALS',
                    'Security Center',
                    `Admin ID: ${adminCredentials.adminId}`
                  );
                  showToast('Saved new Owner Admin Panel Login ID & Password!');
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#ff6600] hover:bg-[#e05500] rounded-lg cursor-pointer"
              >
                Save Admin Login Credentials
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="font-display text-base font-bold text-slate-900">
                    Enterprise Security & Access Control Center
                  </h2>
                  <p className="text-xs text-slate-500">
                    Configure 2FA, login attempt lockouts, session timeouts, IP whitelisting, reCAPTCHA v3, and global session revocation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    appendAudit('FORCE_LOGOUT_ALL_SESSIONS', 'Security Center', 'Revoked all active refresh tokens');
                    showToast('All active user & tutor JWT sessions have been invalidated.');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg whitespace-nowrap"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Force Logout All Sessions</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    key: 'twoFactorEnabled' as const,
                    label: 'Two-Factor Authentication (2FA OTP)',
                  },
                  {
                    key: 'publicRegistrationEnabled' as const,
                    label: 'Allow Public Signup',
                  },
                  {
                    key: 'guestInquiriesEnabled' as const,
                    label: 'Allow Guest Inquiries',
                  },
                  {
                    key: 'autoApproveReviews' as const,
                    label: 'Auto-Approve Student Reviews',
                  },
                  {
                    key: 'recaptchaEnabled' as const,
                    label: 'Google reCAPTCHA v3 Protection',
                  },
                  {
                    key: 'sslEnforced' as const,
                    label: 'Strict HTTPS / SSL Enforcement',
                  },
                ].map((toggle) => (
                  <label
                    key={toggle.key}
                    className="p-3.5 border border-slate-200 rounded-lg flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50"
                  >
                    <span className="text-xs font-medium text-slate-800">{toggle.label}</span>
                    <input
                      type="checkbox"
                      checked={securitySettings[toggle.key]}
                      onChange={(e) => {
                        setSecuritySettings((p) => ({
                          ...p,
                          [toggle.key]: e.target.checked,
                        }));
                        appendAudit(
                          `TOGGLE_${toggle.key.toUpperCase()}`,
                          'Security Center',
                          `Set to ${e.target.checked}`
                        );
                      }}
                      className="rounded border-slate-300"
                    />
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={15}
                    value={securitySettings.loginAttempts}
                    onChange={(e) =>
                      setSecuritySettings((p) => ({
                        ...p,
                        loginAttempts: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Lockout Duration (Mins)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={securitySettings.lockoutMinutes}
                    onChange={(e) =>
                      setSecuritySettings((p) => ({
                        ...p,
                        lockoutMinutes: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Session Timeout (Mins)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={240}
                    value={securitySettings.sessionTimeout}
                    onChange={(e) =>
                      setSecuritySettings((p) => ({
                        ...p,
                        sessionTimeout: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    API Rate Limit (req/min)
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={500}
                    value={securitySettings.rateLimitPerMin}
                    onChange={(e) =>
                      setSecuritySettings((p) => ({
                        ...p,
                        rateLimitPerMin: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Admin IP Whitelist */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Admin Login IP Whitelist ({securitySettings.ipWhitelist.length} ranges)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newIpInput}
                    onChange={(e) => setNewIpInput(e.target.value)}
                    placeholder="Add CIDR or IP (e.g. 49.205.112.10)"
                    className="flex-1 max-w-xs px-3 py-1.5 text-xs font-mono border border-slate-200 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newIpInput.trim()) return;
                      setSecuritySettings((p) => ({
                        ...p,
                        ipWhitelist: [...p.ipWhitelist, newIpInput.trim()],
                      }));
                      setNewIpInput('');
                      showToast('Added IP to admin whitelist.');
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#084d75] rounded-lg"
                  >
                    Add IP
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {securitySettings.ipWhitelist.map((ip) => (
                    <span
                      key={ip}
                      className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono bg-slate-100 rounded-md"
                    >
                      {ip}
                      <button
                        type="button"
                        onClick={() =>
                          setSecuritySettings((p) => ({
                            ...p,
                            ipWhitelist: p.ipWhitelist.filter((item) => item !== ip),
                          }))
                        }
                        className="text-red-600 hover:underline"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 23: SETTINGS — APPEARANCE & MAINTENANCE MODE */}
        {activeModule === 'settings-appearance' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2.5">
              <Palette className="w-5 h-5 text-[#084d75]" />
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                Theme Palette, Dark Mode & Maintenance Mode
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Primary Brand Color (Default: Deep Blue #084d75)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding((p) => ({ ...p, primaryColor: e.target.value }))}
                    className="w-10 h-10 rounded cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding((p) => ({ ...p, primaryColor: e.target.value }))}
                    className="flex-1 px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Accent Highlight Color (Default: Vibrant Orange #f7941d)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.accentColor}
                    onChange={(e) => setBranding((p) => ({ ...p, accentColor: e.target.value }))}
                    className="w-10 h-10 rounded cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={branding.accentColor}
                    onChange={(e) => setBranding((p) => ({ ...p, accentColor: e.target.value }))}
                    className="flex-1 px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <label className="p-4 border border-slate-200 rounded-lg flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-slate-900">Enable Dark Mode Theme</p>
                  <p className="text-[11px] text-slate-500">Applies dark slate surfaces across the app</p>
                </div>
                <input
                  type="checkbox"
                  checked={branding.darkMode}
                  onChange={(e) => setBranding((p) => ({ ...p, darkMode: e.target.checked }))}
                />
              </label>

              <label className="p-4 border border-amber-200 bg-amber-50/50 rounded-lg flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-amber-900">Maintenance Mode Banner</p>
                  <p className="text-[11px] text-amber-700">Shows maintenance notice to visitors</p>
                </div>
                <input
                  type="checkbox"
                  checked={branding.maintenanceMode}
                  onChange={(e) =>
                    setBranding((p) => ({ ...p, maintenanceMode: e.target.checked }))
                  }
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Maintenance Mode Message
              </label>
              <input
                type="text"
                value={branding.maintenanceMessage}
                onChange={(e) =>
                  setBranding((p) => ({ ...p, maintenanceMessage: e.target.value }))
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* MODULE 24: MOBILE APP & API v1 KEYS (REACT NATIVE EXPO READY) */}
        {activeModule === 'settings-api' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-[#084d75]" />
                <div>
                  <h2 className="font-display text-base font-semibold text-slate-900">
                    API-First Mobile Configuration (`/api/v1/app/config`)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Provision API keys and inspect the live JSON payload consumed by the React Native (Expo) mobile application.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextKey = `vsetu_live_rn_expo_${Math.random().toString(36).slice(2, 12)}`;
                  setMobileApiKey(nextKey);
                  appendAudit('ROTATE_MOBILE_API_KEY', 'Mobile API v1', nextKey);
                  showToast('Generated new React Native API key.');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#084d75] rounded-lg"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Rotate Expo API Key</span>
              </button>
            </div>

            <div className="p-3.5 bg-slate-100 rounded-lg flex items-center justify-between text-xs font-mono">
              <span>X-Mobile-App-Key: {mobileApiKey}</span>
              <span className="text-emerald-700 font-sans font-medium">JWT Refresh Token Flow Enabled</span>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-700 mb-1.5">
                Live Response Preview: `GET /api/v1/app/config`
              </p>
              <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto">
                {JSON.stringify(
                  {
                    apiVersion: 'v1',
                    branding: {
                      companyName: branding.companyName,
                      tagline: branding.tagline,
                      primaryColor: branding.primaryColor,
                      accentColor: branding.accentColor,
                      darkMode: branding.darkMode,
                    },
                    whatsapp: {
                      number: whatsappSetting.number,
                      defaultMessage: whatsappSetting.defaultMessage,
                      buttonColor: whatsappSetting.buttonColor,
                    },
                    socialLinks: socialLinks.filter((s) => s.isActive),
                    security: {
                      twoFactorEnabled: securitySettings.twoFactorEnabled,
                      sessionTimeoutMins: securitySettings.sessionTimeout,
                    },
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        )}

        {/* MODULE 28: SECURITY AUDIT LOG VIEWER */}
        {activeModule === 'audit-log' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-slate-900">
                Immutable Admin & Security Audit Log ({auditLogs.length} events)
              </h2>
              <button
                type="button"
                onClick={() =>
                  downloadCsv(
                    'vidyasetu-audit-log.csv',
                    ['ID', 'Actor', 'Action', 'Module', 'Details', 'IP', 'Timestamp'],
                    auditLogs.map((a) => [
                      a.id,
                      a.actorName,
                      a.action,
                      a.module,
                      a.details,
                      a.ipAddress,
                      a.createdAt,
                    ])
                  )
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export Audit CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 pr-3">Action</th>
                    <th className="py-2.5 px-3">Module</th>
                    <th className="py-2.5 px-3">Details</th>
                    <th className="py-2.5 px-3">IP Address</th>
                    <th className="py-2.5 pl-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-3 pr-3 font-mono font-semibold text-[#084d75]">
                        {log.action}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">{log.module}</td>
                      <td className="py-3 px-3 text-slate-600">{log.details}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">{log.ipAddress}</td>
                      <td className="py-3 pl-3 text-right font-mono text-slate-400">
                        {log.createdAt.slice(0, 19).replace('T', ' ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 03: TUTORS MANAGEMENT (Full Inline Fee/Months/Location Edit + Delete) */}
        {activeModule === 'tutors' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tutors by name, district, block, pincode, or subject..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg"
                />
              </div>
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                Showing {tutors.length} registered tutors
              </span>
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-lg border border-amber-400/50 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-bold text-amber-300">
                  🔒 Confidential Teacher Bank Account &amp; Direct Payout Control (Admin-Only Visibility):
                </span>{' '}
                <span className="text-slate-300">
                  Teacher Account Number, IFSC Code, Bank Name &amp; UPI ID are strictly hidden from all public visitors and students. Only you (Owner Admin) can view and pay teachers directly below.
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-500">
                    <th className="py-2.5 pr-3 font-medium">Educator &amp; Login ID</th>
                    <th className="py-2.5 px-2 font-medium">District, Block &amp; Pin Code</th>
                    <th className="py-2.5 px-2 font-medium">Monthly Fee &amp; Months</th>
                    <th className="py-2.5 px-2 font-medium">
                      🔒 Confidential Bank Details (Admin-Only)
                    </th>
                    <th className="py-2.5 px-2 font-medium">Direct Bank Payout</th>
                    <th className="py-2.5 px-2 font-medium">Approval / Featured</th>
                    <th className="py-2.5 pl-2 text-right font-medium">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {tutors
                    .filter(
                      (t) =>
                        !searchQuery ||
                        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (t.blockName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (t.pincode || '').toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="py-3 pr-3">
                          <p className="font-semibold text-slate-900">{t.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {t.qualification} · {t.phone || '+91 94310 58415'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <img
                              src={t.photoUrl || t.avatarUrl}
                              alt={t.name}
                              className="w-7 h-7 rounded-full object-cover border border-slate-300 shrink-0"
                            />
                            <label className="px-2 py-0.5 rounded bg-blue-50 text-[#084d75] border border-blue-200 text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer">
                              <Camera className="w-3 h-3" />
                              <span>Change Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const compressed = await readAndCompressImageFile(file, 360);
                                  setTutors((prev) =>
                                    prev.map((item) =>
                                      item.id === t.id
                                        ? { ...item, avatarUrl: compressed, photoUrl: compressed }
                                        : item
                                    )
                                  );
                                  showToast(`Updated profile photo for Teacher ${t.name}!`);
                                }}
                              />
                            </label>
                          </div>
                          <p className="text-[10px] font-mono text-[#084d75] mt-0.5">
                            ID: {t.loginUserId || `TUT-${t.tutorNumericId || '1584150'}`} | Pass:{' '}
                            {t.loginPassword || 'Tutor@2026'}
                          </p>
                        </td>
                        <td className="py-3 px-2 text-slate-600">
                          <div className="font-medium text-slate-900">
                            {t.cityName} · {t.localityName}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <input
                              type="text"
                              value={t.blockName || t.localityName}
                              onChange={(e) =>
                                setTutors((prev) =>
                                  prev.map((item) =>
                                    item.id === t.id ? { ...item, blockName: e.target.value } : item
                                  )
                                )
                              }
                              placeholder="Block"
                              className="w-24 px-1.5 py-0.5 text-[11px] border border-slate-200 rounded"
                            />
                            <input
                              type="text"
                              value={t.pincode || '800001'}
                              onChange={(e) =>
                                setTutors((prev) =>
                                  prev.map((item) =>
                                    item.id === t.id ? { ...item, pincode: e.target.value } : item
                                  )
                                )
                              }
                              placeholder="Pin"
                              className="w-16 px-1.5 py-0.5 text-[11px] font-mono border border-slate-200 rounded"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={t.monthlyRate || Math.max(1500, t.hourlyRate * 10)}
                              onChange={(e) =>
                                setTutors((prev) =>
                                  prev.map((item) =>
                                    item.id === t.id
                                      ? { ...item, monthlyRate: Number(e.target.value) }
                                      : item
                                  )
                                )
                              }
                              className="w-20 px-1.5 py-1 text-xs font-mono font-bold text-[#e66000] border border-slate-200 rounded"
                              title="Monthly Fee (₹)"
                            />
                            <input
                              type="number"
                              min={1}
                              max={36}
                              value={t.minDurationMonths || 3}
                              onChange={(e) =>
                                setTutors((prev) =>
                                  prev.map((item) =>
                                    item.id === t.id
                                      ? { ...item, minDurationMonths: Number(e.target.value) }
                                      : item
                                  )
                                )
                              }
                              className="w-12 px-1.5 py-1 text-xs font-mono font-bold text-[#084d75] border border-slate-200 rounded"
                              title="Duration (Months)"
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            ₹{t.hourlyRate}/hr · {t.minDurationMonths || 3} Months
                          </p>
                        </td>
                        <td className="py-3 px-2">
                          <div className="p-2 bg-slate-900 text-white rounded-md border border-slate-700 space-y-1 min-w-[210px]">
                            <div className="grid grid-cols-2 gap-1">
                              <input
                                type="text"
                                value={t.bankName || 'SBI Bank'}
                                onChange={(e) =>
                                  setTutors((prev) =>
                                    prev.map((item) =>
                                      item.id === t.id ? { ...item, bankName: e.target.value } : item
                                    )
                                  )
                                }
                                placeholder="Bank Name"
                                className="px-1.5 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded text-amber-300 font-semibold"
                              />
                              <input
                                type="text"
                                value={t.bankIfscCode || 'SBIN0001234'}
                                onChange={(e) =>
                                  setTutors((prev) =>
                                    prev.map((item) =>
                                      item.id === t.id
                                        ? { ...item, bankIfscCode: e.target.value.toUpperCase() }
                                        : item
                                    )
                                  )
                                }
                                placeholder="IFSC Code"
                                className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 border border-slate-700 rounded text-emerald-300"
                              />
                            </div>
                            <input
                              type="text"
                              value={t.bankAccountNumber || '38910482910'}
                              onChange={(e) =>
                                setTutors((prev) =>
                                  prev.map((item) =>
                                    item.id === t.id
                                      ? { ...item, bankAccountNumber: e.target.value }
                                      : item
                                  )
                                )
                              }
                              placeholder="Account Number"
                              className="w-full px-1.5 py-0.5 text-[11px] font-mono bg-slate-800 border border-slate-700 rounded text-white"
                            />
                            <div className="text-[10px] text-slate-400 flex items-center justify-between">
                              <span>Holder: {t.bankAccountHolder || t.name}</span>
                              {t.upiId && <span className="font-mono text-sky-300">{t.upiId}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <button
                            type="button"
                            onClick={() => {
                              const payoutAmt = t.monthlyRate || Math.max(1500, t.hourlyRate * 10);
                              const utr = `UTR${Date.now().toString().slice(-9)}`;
                              if (setTeacherPayouts) {
                                setTeacherPayouts((prev) => [
                                  {
                                    id: `payout-${Date.now()}`,
                                    tutorId: t.id,
                                    tutorName: t.name,
                                    bankAccountHolder: t.bankAccountHolder || t.name,
                                    bankName: t.bankName || 'State Bank of India',
                                    bankAccountNumber: t.bankAccountNumber || '38910482910',
                                    bankIfscCode: t.bankIfscCode || 'SBIN0001234',
                                    upiId: t.upiId,
                                    amount: payoutAmt,
                                    monthLabel: 'Oct 2026',
                                    utrNumber: utr,
                                    status: 'PAID',
                                    paidAt: new Date().toISOString().slice(0, 10),
                                  },
                                  ...prev,
                                ]);
                              }
                              appendAudit(
                                'PAY_TEACHER_BANK_ACCOUNT',
                                'Teacher Payouts',
                                `Paid ₹${payoutAmt} to ${t.name} (${t.bankName || 'SBI'} A/C ${
                                  t.bankAccountNumber || '38910482910'
                                }, IFSC: ${t.bankIfscCode || 'SBIN0001234'}) · Ref: ${utr}`
                              );
                              showToast(
                                `Transferred ₹${payoutAmt} directly to ${t.name}'s Bank Account (${
                                  t.bankName || 'SBI'
                                } • A/C: ${t.bankAccountNumber || '38910482910'} • IFSC: ${
                                  t.bankIfscCode || 'SBIN0001234'
                                })! Ref: ${utr}`
                              );
                            }}
                            className="px-2.5 py-1.5 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md cursor-pointer whitespace-nowrap shadow-2xs"
                          >
                            💸 Pay ₹{t.monthlyRate || Math.max(1500, t.hourlyRate * 10)} to Bank
                          </button>
                        </td>
                        <td className="py-3 px-2 space-y-1">
                          <button
                            type="button"
                            onClick={() => {
                              setTutors((prev) =>
                                prev.map((item) =>
                                  item.id === t.id ? { ...item, isApproved: !item.isApproved } : item
                                )
                              );
                              appendAudit('TOGGLE_TUTOR_APPROVAL', 'Tutors', t.name);
                              showToast(`Updated approval status for ${t.name}.`);
                            }}
                            className={`block w-full px-2 py-0.5 rounded font-medium cursor-pointer text-[11px] ${
                              t.isApproved
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {t.isApproved ? 'Approved' : 'Hidden'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTutors((prev) =>
                                prev.map((item) =>
                                  item.id === t.id ? { ...item, isFeatured: !item.isFeatured } : item
                                )
                              );
                              showToast(`Updated featured status for ${t.name}.`);
                            }}
                            className={`block w-full px-2 py-0.5 rounded font-medium cursor-pointer text-[11px] ${
                              t.isFeatured
                                ? 'bg-blue-50 text-[#084d75]'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {t.isFeatured ? 'Featured ★' : 'Standard'}
                          </button>
                        </td>
                        <td className="py-3 pl-2 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (onDeleteTutor) {
                                onDeleteTutor(t.id);
                              } else {
                                setTutors((prev) => prev.filter((item) => item.id !== t.id));
                              }
                              appendAudit('DELETE_TUTOR', 'Tutors', t.name);
                              showToast(`Permanently deleted tutor ${t.name} from Home Page & Directory.`);
                            }}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-md inline-flex items-center gap-1 cursor-pointer"
                            title="Delete Tutor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 04: STUDENTS & PARENTS (With Block/Unblock + Permanent Delete) */}
        {activeModule === 'students' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="font-display text-base font-semibold text-slate-900 mb-4">
              Registered Students &amp; Parents ({usersDirectory.filter((u) => u.role === 'STUDENT').length})
            </h2>
            <div className="divide-y divide-slate-100">
              {usersDirectory
                .filter((u) => u.role === 'STUDENT')
                .map((stu) => (
                  <div key={stu.id} className="py-3.5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          stu.avatarUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                        }
                        alt={stu.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{stu.name}</p>
                        <p className="text-xs text-slate-500">
                          {stu.email} · <span className="font-mono">{stu.phone || stu.mobile}</span> ·{' '}
                          {stu.districtName || 'Patna'}, Block: {stu.blockName || 'Danapur'} ({stu.pincode || '801503'}) · {stu.lastActivity}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-2.5 py-1.5 text-xs font-bold text-[#084d75] bg-blue-50 border border-blue-200 rounded-lg inline-flex items-center gap-1 cursor-pointer">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const compressed = await readAndCompressImageFile(file, 360);
                            setUsersDirectory((prev) =>
                              prev.map((u) =>
                                u.id === stu.id ? { ...u, avatarUrl: compressed } : u
                              )
                            );
                            showToast(`Updated profile photo for ${stu.name}.`);
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setUsersDirectory((prev) =>
                            prev.map((u) => (u.id === stu.id ? { ...u, isActive: !u.isActive } : u))
                          );
                          showToast(`Toggled access for ${stu.name}.`);
                        }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer ${
                          stu.isActive
                            ? 'bg-slate-100 text-slate-800 hover:bg-amber-100'
                            : 'bg-amber-600 text-white'
                        }`}
                      >
                        {stu.isActive ? 'Active (Block)' : 'Blocked (Unblock)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUsersDirectory((prev) => prev.filter((u) => u.id !== stu.id));
                          appendAudit('DELETE_STUDENT', 'Students', stu.name);
                          showToast(`Permanently deleted student ${stu.name}.`);
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Student</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* MODULE 05: TUITION REQUIREMENTS (Assign Tutor + Delete Requirement) */}
        {activeModule === 'requirements' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="font-display text-base font-semibold text-slate-900">
              Parent Tuition Requirements &amp; Tutor Assignment ({requirements.length})
            </h2>
            <div className="divide-y divide-slate-100">
              {requirements.map((req) => (
                <div
                  key={req.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-xs text-slate-500">
                      {req.cityName} · {req.localityName || req.locality} · Budget:{' '}
                      <span className="font-mono font-semibold text-slate-900">{req.budget}</span>
                    </p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                      {req.studentName} ({req.studentPhone}) — {req.courseName || req.course} ({req.subjectName || req.subjects})
                    </p>
                    <p className="text-xs text-slate-600 mt-1">{req.notes || req.message}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={req.assignedTutorName || ''}
                      onChange={(e) => {
                        const tutorName = e.target.value;
                        setRequirements((prev) =>
                          prev.map((r) =>
                            r.id === req.id
                              ? { ...r, assignedTutorName: tutorName, status: 'ASSIGNED' }
                              : r
                          )
                        );
                        showToast(`Assigned ${tutorName} to requirement ${req.id}.`);
                      }}
                      className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="">Assign Verified Tutor...</option>
                      {tutors.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name} ({t.cityName})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        setRequirements((prev) => prev.filter((r) => r.id !== req.id));
                        appendAudit('DELETE_REQUIREMENT', 'Requirements', req.studentName);
                        showToast(`Deleted tuition requirement from ${req.studentName}.`);
                      }}
                      className="px-2.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 06: CITIES / BIHAR DISTRICTS CRUD (With Delete) */}
        {activeModule === 'cities' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCityName.trim()) return;
                const slug = newCityName.trim().toLowerCase().replace(/\s+/g, '-');
                setCities((prev) => [
                  ...prev,
                  { id: slug, name: newCityName.trim(), slug, isActive: true, localities: ['Main Town', 'Sadar Block'] },
                ]);
                setNewCityName('');
                showToast('Added new city/district to directory.');
              }}
              className="flex gap-3"
            >
              <input
                type="text"
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                placeholder="Add new Bihar District or Indian City (e.g. Ranchi)"
                className="flex-1 px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#084d75] rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add City / District</span>
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {cities.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 border border-slate-200 rounded-lg flex items-center justify-between gap-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-500">
                      /{c.slug} · {c.localities.length} blocks/localities
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setCities((prev) =>
                          prev.map((item) =>
                            item.id === c.id ? { ...item, isActive: !item.isActive } : item
                          )
                        )
                      }
                      className={`px-2 py-1 text-xs rounded-md font-medium cursor-pointer ${
                        c.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Hidden'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCities((prev) => prev.filter((item) => item.id !== c.id));
                        showToast(`Deleted ${c.name}.`);
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                      title="Delete City/District"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 07: LOCALITIES & BLOCKS CRUD (With Delete Locality Chip) */}
        {activeModule === 'localities' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newLocalityName.trim()) return;
                setCities((prev) =>
                  prev.map((c) =>
                    c.id === selectedCityForLocality
                      ? { ...c, localities: [...c.localities, newLocalityName.trim()] }
                      : c
                  )
                );
                setNewLocalityName('');
                showToast('Added Block/Locality to District.');
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <select
                value={selectedCityForLocality}
                onChange={(e) => setSelectedCityForLocality(e.target.value)}
                className="px-3.5 py-2 text-sm border border-slate-200 rounded-lg bg-white"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newLocalityName}
                onChange={(e) => setNewLocalityName(e.target.value)}
                placeholder="New Block or Locality name (e.g. Phulwari Block)"
                className="flex-1 px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#084d75] rounded-lg cursor-pointer"
              >
                Add Block / Locality
              </button>
            </form>

            <div className="space-y-3">
              {cities.map((c) => (
                <div key={c.id} className="p-4 border border-slate-200 rounded-lg">
                  <p className="text-xs font-semibold text-slate-900 mb-2">{c.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {c.localities.map((loc) => (
                      <span
                        key={loc}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-100 text-slate-700 rounded-md"
                      >
                        <span>{loc}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setCities((prev) =>
                              prev.map((item) =>
                                item.id === c.id
                                  ? {
                                      ...item,
                                      localities: item.localities.filter((l) => l !== loc),
                                    }
                                  : item
                              )
                            )
                          }
                          className="text-red-600 font-bold hover:underline cursor-pointer"
                          title="Delete Locality"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 08 & 09: COURSES & SUBJECTS (With Delete) */}
        {(activeModule === 'courses' || activeModule === 'subjects') && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (activeModule === 'courses' && newCourseName.trim()) {
                  setCourses((prev) => [
                    ...prev,
                    { id: `c-${Date.now()}`, name: newCourseName.trim(), isActive: true },
                  ]);
                  setNewCourseName('');
                  showToast('Course added.');
                } else if (activeModule === 'subjects' && newSubjectName.trim()) {
                  setSubjects((prev) => [
                    ...prev,
                    { id: `s-${Date.now()}`, name: newSubjectName.trim(), isActive: true },
                  ]);
                  setNewSubjectName('');
                  showToast('Subject added.');
                }
              }}
              className="flex gap-3"
            >
              <input
                type="text"
                value={activeModule === 'courses' ? newCourseName : newSubjectName}
                onChange={(e) =>
                  activeModule === 'courses'
                    ? setNewCourseName(e.target.value)
                    : setNewSubjectName(e.target.value)
                }
                placeholder={
                  activeModule === 'courses'
                    ? 'Add new Course (e.g. Olympiad Foundation)'
                    : 'Add new Subject (e.g. Statistics)'
                }
                className="flex-1 px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#084d75] rounded-lg cursor-pointer"
              >
                Add {activeModule === 'courses' ? 'Course' : 'Subject'}
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(activeModule === 'courses' ? courses : subjects).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 border border-slate-200 rounded-lg flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-slate-900">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-700 font-medium">Active</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (activeModule === 'courses') {
                          setCourses((prev) => prev.filter((c) => c.id !== item.id));
                        } else {
                          setSubjects((prev) => prev.filter((s) => s.id !== item.id));
                        }
                        showToast(`Deleted ${item.name}.`);
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 10: INQUIRIES (With Reply + Delete) */}
        {activeModule === 'inquiries' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="font-display text-base font-semibold text-slate-900">
              All Student-to-Tutor Inquiries &amp; Direct Email Dispatch ({inquiries.length})
            </h2>
            <div className="divide-y divide-slate-100">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-xs text-slate-500">
                      From: <span className="font-semibold text-slate-900">{inq.name}</span> (
                      {inq.mobile}) → Tutor:{' '}
                      <span className="font-semibold text-[#084d75]">{inq.tutorName}</span>
                    </p>
                    <p className="text-sm text-slate-700 mt-1">{inq.message}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setInquiries((prev) =>
                          prev.map((i) => (i.id === inq.id ? { ...i, status: 'REPLIED' } : i))
                        );
                        showToast(`Dispatched email reply to ${inq.email} via Nodemailer.`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#084d75] rounded-lg cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send Email Reply ({inq.status})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInquiries((prev) => prev.filter((i) => i.id !== inq.id));
                        showToast(`Deleted inquiry from ${inq.name}.`);
                      }}
                      className="px-2.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 11: STUDENT ACHIEVERS SHOWCASE & REVIEWS MODERATION */}
        {activeModule === 'reviews' && (
          <div className="space-y-6">
            {/* Admin Student Achiever + Feedback Creator & Manager (Visible on Home Page!) */}
            <div className="bg-white dark:bg-slate-900 border-2 border-amber-400 rounded-xl p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6600]">
                    Home Page Student Achievers &amp; Feedback Control
                  </span>
                  <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                    <Award className="w-5 h-5 text-[#ff6600]" />
                    <span>Add &amp; Manage Star Student Achievers + Feedback (होम पेज पर अचीवर छात्र का फोटो, डिटेल्स और फीडबैक दिखाएं)</span>
                  </h2>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {(studentAchievers || []).length} Achievers on Home Page
                </span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!achStudentName.trim() || !achTitle.trim() || !achFeedback.trim()) return;
                  if (setStudentAchievers) {
                    setStudentAchievers((prev) => [
                      {
                        id: `ach-${Date.now()}`,
                        studentName: achStudentName.trim(),
                        studentPhoto:
                          achStudentPhoto.trim() ||
                          'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
                        districtName: achDistrictName.trim() || 'Patna (Bihar)',
                        blockName: achBlockName.trim() || 'Danapur',
                        className: achClassName.trim() || 'Class 10 CBSE',
                        achievementTitle: achTitle.trim(),
                        scoreBadge: achScoreBadge.trim() || 'Star Achiever',
                        tutorName: achTutorName.trim() || 'Sanjeet',
                        studyMode: achStudyMode,
                        feedbackText: achFeedback.trim(),
                        rating: Number(achRating) || 5,
                        achievedDate: new Date().toISOString().slice(0, 10),
                        isApproved: true,
                        isFeatured: true,
                      },
                      ...prev,
                    ]);
                  }
                  appendAudit(
                    'ADD_STUDENT_ACHIEVER',
                    'Achievers & Feedback',
                    `${achStudentName.trim()} — ${achScoreBadge.trim()}`
                  );
                  setAchStudentName('');
                  setAchTitle('');
                  setAchFeedback('');
                  showToast('Published Student Achiever & Feedback to the Home Page!');
                }}
                className="p-4 bg-amber-50/70 dark:bg-slate-800 border border-amber-300 rounded-xl space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={achStudentName}
                      onChange={(e) => setAchStudentName(e.target.value)}
                      placeholder="e.g. Ananya Kumari"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      District (Bihar / India) *
                    </label>
                    <input
                      type="text"
                      required
                      value={achDistrictName}
                      onChange={(e) => setAchDistrictName(e.target.value)}
                      placeholder="e.g. Patna (Bihar)"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Block / Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={achBlockName}
                      onChange={(e) => setAchBlockName(e.target.value)}
                      placeholder="e.g. Danapur"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Class / Exam *
                    </label>
                    <input
                      type="text"
                      required
                      value={achClassName}
                      onChange={(e) => setAchClassName(e.target.value)}
                      placeholder="e.g. Class 10 CBSE / JEE"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Achievement Details (Score / Rank / Selection Details) *
                    </label>
                    <input
                      type="text"
                      required
                      value={achTitle}
                      onChange={(e) => setAchTitle(e.target.value)}
                      placeholder="e.g. Scored 98.2% in Class 10 Board Exam (100/100 in Maths)"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Highlight Score Badge *
                    </label>
                    <input
                      type="text"
                      required
                      value={achScoreBadge}
                      onChange={(e) => setAchScoreBadge(e.target.value)}
                      placeholder="e.g. 98.2% Topper"
                      className="w-full px-3 py-1.5 text-xs font-bold text-[#e66000] bg-white border border-amber-400 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mentored By Teacher
                    </label>
                    <input
                      type="text"
                      value={achTutorName}
                      onChange={(e) => setAchTutorName(e.target.value)}
                      placeholder="e.g. Sanjeet"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student Photo (Upload or URL)
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-lg bg-[#084d75] text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer shrink-0">
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
                            setAchStudentPhoto(compressed);
                          }}
                        />
                      </label>
                      <input
                        type="text"
                        value={achStudentPhoto.startsWith('data:') ? '' : achStudentPhoto}
                        onChange={(e) => setAchStudentPhoto(e.target.value)}
                        placeholder="Or paste photo URL..."
                        className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Study Mode
                    </label>
                    <select
                      value={achStudyMode}
                      onChange={(e) =>
                        setAchStudyMode(e.target.value as 'ONLINE' | 'OFFLINE' | 'BOTH')
                      }
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                    >
                      <option value="ONLINE">Online Tuition</option>
                      <option value="OFFLINE">Offline Home Tuition</option>
                      <option value="BOTH">Online + Offline Both</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Star Rating
                    </label>
                    <select
                      value={achRating}
                      onChange={(e) => setAchRating(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                    >
                      <option value={5}>5 Stars (★★★★★)</option>
                      <option value={4}>4 Stars (★★★★)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student / Parent Feedback Quote (Shown on Home Page) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={achFeedback}
                    onChange={(e) => setAchFeedback(e.target.value)}
                    placeholder="Write the student's feedback about how the teacher helped them succeed..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#ff6600] hover:bg-[#e05500] rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Achiever Details &amp; Feedback to Home Page</span>
                </button>
              </form>

              {/* Existing Achievers List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(studentAchievers || []).map((ach) => (
                  <div
                    key={ach.id}
                    className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl flex items-start justify-between gap-3 bg-slate-50/60 dark:bg-slate-800/50"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={ach.studentPhoto}
                        alt={ach.studentName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#084d75] shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {ach.studentName}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400 text-slate-950 rounded-full">
                            {ach.scoreBadge}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#084d75] dark:text-amber-300">
                          {ach.achievementTitle}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                          &ldquo;{ach.feedbackText}&rdquo;
                        </p>
                        <p className="text-[11px] text-slate-400">
                          📍 {ach.blockName}, {ach.districtName} · Teacher: {ach.tutorName}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStudentAchievers?.((prev) => prev.filter((item) => item.id !== ach.id));
                        showToast(`Deleted achiever ${ach.studentName} from Home Page.`);
                      }}
                      className="px-2.5 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="font-display text-base font-semibold text-slate-900">
              Student Reviews Moderation Queue
            </h2>
            <div className="divide-y divide-slate-100">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-xs text-slate-500">
                      Reviewer: <span className="font-semibold text-slate-900">{rev.reviewerName}</span>{' '}
                      · Tutor: <span className="font-semibold text-slate-900">{rev.tutorName}</span> ·{' '}
                      <span className="font-mono text-amber-600">{rev.rating}/5</span>
                    </p>
                    <p className="text-sm text-slate-700 mt-1">{rev.comment}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setReviews((prev) =>
                          prev.map((r) =>
                            r.id === rev.id ? { ...r, isApproved: !r.isApproved } : r
                          )
                        );
                        showToast('Review approval updated.');
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer ${
                        rev.isApproved
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-[#084d75] text-white'
                      }`}
                    >
                      {rev.isApproved ? 'Approved' : 'Approve Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviews((prev) => prev.filter((r) => r.id !== rev.id))}
                      className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        )}

        {/* MODULE 12: PAGES / CMS EDITOR */}
        {activeModule === 'pages' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-100">
              {pages.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPageId(p.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg ${
                    selectedPageId === p.id
                      ? 'bg-[#084d75] text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  /{p.slug} — {p.title}
                </button>
              ))}
            </div>

            {pages
              .filter((p) => p.id === selectedPageId)
              .map((page) => (
                <div key={page.id} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        SEO Meta Title
                      </label>
                      <input
                        type="text"
                        value={page.metaTitle}
                        onChange={(e) =>
                          setPages((prev) =>
                            prev.map((item) =>
                              item.id === page.id ? { ...item, metaTitle: e.target.value } : item
                            )
                          )
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        SEO Meta Description
                      </label>
                      <input
                        type="text"
                        value={page.metaDesc}
                        onChange={(e) =>
                          setPages((prev) =>
                            prev.map((item) =>
                              item.id === page.id ? { ...item, metaDesc: e.target.value } : item
                            )
                          )
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Rich Page Content (Sanitized with DOMPurify)
                    </label>
                    <textarea
                      rows={7}
                      value={page.content}
                      onChange={(e) =>
                        setPages((prev) =>
                          prev.map((item) =>
                            item.id === page.id ? { ...item, content: e.target.value } : item
                          )
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg leading-relaxed"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast(`Published CMS changes to /${page.slug}.`)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#084d75] rounded-lg"
                  >
                    Save & Publish Page
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* MODULE 13: HOME PAGE PHOTO SLIDER & PROMOTIONAL BANNERS + SPECIAL OFFERS */}
        {activeModule === 'banners' && (
          <div className="space-y-6">
            {/* Home Page Special Promotional Offers Manager (Displayed Clearly at Top of Home Page!) */}
            {setPromoOffers && (
              <div className="bg-white dark:bg-slate-900 border-2 border-[#ff6600] rounded-xl p-6 space-y-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6600]">
                    🔥 Home Page Special Promotional Offers Control
                  </span>
                  <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    Publish Time-to-Time Special Offers Clearly on the Home Page
                  </h2>
                  <p className="text-xs text-slate-500">
                    Any offer added here is displayed in a high-visibility banner right at the top of the Home Page directory.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newOfferTitle.trim()) return;
                    setPromoOffers((prev) => [
                      {
                        id: `offer-${Date.now()}`,
                        title: newOfferTitle.trim(),
                        subtitle:
                          newOfferSubtitle.trim() ||
                          'Unlock Verified Bihar Home & Online Tutors with Special Festival Discount!',
                        badgeText: newOfferBadge.trim() || 'SPECIAL OFFER',
                        couponCode: newOfferCoupon.trim().toUpperCase(),
                        discountText: newOfferDiscount.trim() || 'Flat 50% OFF',
                        validUntil: newOfferValid.trim() || '30 Nov 2026',
                        isActive: true,
                        ctaText: 'Claim Offer Now',
                      },
                      ...prev,
                    ]);
                    setNewOfferTitle('');
                    setNewOfferSubtitle('');
                    appendAudit('ADD_HOME_PROMO_OFFER', 'Banners & Offers', newOfferTitle);
                    showToast('Published new Special Promotional Offer to the Home Page!');
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
                >
                  <input
                    type="text"
                    required
                    value={newOfferTitle}
                    onChange={(e) => setNewOfferTitle(e.target.value)}
                    placeholder="Offer Title (e.g. Chhath & Exam Special 50% OFF)*"
                    className="px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    value={newOfferSubtitle}
                    onChange={(e) => setNewOfferSubtitle(e.target.value)}
                    placeholder="Offer Subtitle / Details"
                    className="px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    value={newOfferDiscount}
                    onChange={(e) => setNewOfferDiscount(e.target.value)}
                    placeholder="Discount Highlight (e.g. Flat 50% OFF)"
                    className="px-3 py-2 text-xs font-bold text-[#ff6600] border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    value={newOfferCoupon}
                    onChange={(e) => setNewOfferCoupon(e.target.value.toUpperCase())}
                    placeholder="Coupon Code (e.g. BIHAR50)"
                    className="px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    value={newOfferValid}
                    onChange={(e) => setNewOfferValid(e.target.value)}
                    placeholder="Valid Until (e.g. 30 Nov 2026)"
                    className="px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold uppercase text-white bg-[#ff6600] hover:bg-[#e05500] rounded-lg cursor-pointer"
                  >
                    + Publish Offer to Home Page
                  </button>
                </form>

                <div className="divide-y divide-slate-100 text-xs">
                  {promoOffers.map((of) => (
                    <div key={of.id} className="py-2.5 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                          {of.discountText}
                        </span>{' '}
                        <span className="font-bold text-slate-900 dark:text-white">{of.title}</span>{' '}
                        <span className="font-mono text-slate-500">
                          (Code: {of.couponCode} · Valid: {of.validUntil})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setPromoOffers((prev) =>
                              prev.map((item) =>
                                item.id === of.id ? { ...item, isActive: !item.isActive } : item
                              )
                            )
                          }
                          className={`px-2.5 py-1 rounded font-bold cursor-pointer ${
                            of.isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {of.isActive ? 'Visible on Home Page' : 'Hidden'}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPromoOffers((prev) => prev.filter((item) => item.id !== of.id))
                          }
                          className="px-2.5 py-1 rounded font-bold text-white bg-red-600 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instant Photo Upload & Custom Slide Creator */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6600]">
                    Home Page Animated Photo Slider Control
                  </span>
                  <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    Upload Photos from Your Device &amp; Configure Slide Animations
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Any photo you upload here automatically slides on the Home Page with your chosen animation effect (Ken Burns Zoom, Smooth Fade-Zoom, or Horizontal Slide).
                  </p>
                </div>

                {/* One-Click Multi-Photo Upload from Device */}
                <label className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#ff6600] hover:bg-[#e05500] rounded-lg shadow-sm cursor-pointer shrink-0">
                  <ImagePlus className="w-4 h-4" />
                  <span>Instant Upload Photo(s) from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleInstantMultiPhotoSlideUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newBannerTitle.trim() && !newBannerImageUrl.trim()) {
                    showToast('Please enter a slide headline or upload a photo first.');
                    return;
                  }
                  setBanners((prev) => [
                    ...prev,
                    {
                      id: `ban-${Date.now()}`,
                      title:
                        newBannerTitle.trim() ||
                        'Verified Home & Online Tutors in Your Locality',
                      subtitle:
                        newBannerSubtitle.trim() ||
                        'Book a free 1-on-1 trial session at your home or online with verified degree-holder teachers.',
                      link: '/search',
                      isActive: true,
                      sortOrder: prev.length + 1,
                      imageUrl: newBannerImageUrl.trim() || prev[0]?.imageUrl,
                      ctaText: newBannerCtaText.trim() || 'Search Area Tutors',
                      ctaAction: newBannerCtaAction,
                      animationStyle: newBannerAnim,
                      badgeText: newBannerBadge.trim() || 'FEATURED SLIDE',
                    },
                  ]);
                  setNewBannerTitle('');
                  setNewBannerSubtitle('');
                  setNewBannerImageUrl('');
                  appendAudit('ADD_HOME_SLIDER_PHOTO', 'Home Photo Slider', newBannerTitle);
                  showToast('Published new animated photo slide to the Home Page!');
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Slide Headline *
                    </label>
                    <input
                      type="text"
                      value={newBannerTitle}
                      onChange={(e) => setNewBannerTitle(e.target.value)}
                      placeholder="e.g. Best Home & Online Tutors in Patna & Bihar"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Slide Subtitle / Description
                    </label>
                    <input
                      type="text"
                      value={newBannerSubtitle}
                      onChange={(e) => setNewBannerSubtitle(e.target.value)}
                      placeholder="e.g. Search by Locality or Pincode for Class 1 to 12, JEE & NEET"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Select Photo File from Computer/Phone
                    </label>
                    <label className="w-full px-3 py-2 text-xs font-semibold text-[#084d75] bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer hover:bg-blue-100">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{newBannerImageUrl ? '✓ Photo Loaded (Change)' : 'Choose Photo File...'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleBannerPhotoFileUpload(e)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Or Paste Photo URL
                    </label>
                    <input
                      type="text"
                      value={newBannerImageUrl}
                      onChange={(e) => setNewBannerImageUrl(e.target.value)}
                      placeholder="https://... or upload file"
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Slide Animation Effect
                    </label>
                    <select
                      value={newBannerAnim}
                      onChange={(e) =>
                        setNewBannerAnim(e.target.value as 'ken-burns' | 'fade-zoom' | 'slide')
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="ken-burns">Ken Burns (Smooth Zoom + Pan)</option>
                      <option value="fade-zoom">Fade + Scale Crossfade</option>
                      <option value="slide">Directional Horizontal Slide</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Button Action on Click
                    </label>
                    <select
                      value={newBannerCtaAction}
                      onChange={(e) =>
                        setNewBannerCtaAction(
                          e.target.value as
                            | 'find-tutor'
                            | 'join-tutor'
                            | 'online-tuition'
                            | 'post-requirement'
                        )
                      }
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="find-tutor">Scroll to Area Tutor Search</option>
                      <option value="join-tutor">Open Join As Tutor Modal</option>
                      <option value="online-tuition">Open Online Tuitions</option>
                      <option value="post-requirement">Open Post Tuition Requirement</option>
                    </select>
                  </div>
                </div>

                {newBannerImageUrl && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-4">
                    <img
                      src={newBannerImageUrl}
                      alt="New Slide Preview"
                      className="w-32 h-20 object-cover rounded-md border border-slate-300"
                    />
                    <div className="text-xs text-slate-600">
                      <p className="font-bold text-slate-900">Ready to Publish Slide Preview</p>
                      <p>Animation: {newBannerAnim} · Click below to add to Home Page</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white bg-[#084d75] hover:bg-[#063a58] rounded-lg inline-flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Photo Slide to Home Page</span>
                </button>
              </form>
            </div>

            {/* Active & Saved Photo Slides List */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Manage Home Page Slider Photos ({banners.length} Slides)
              </h3>
              <div className="space-y-4">
                {banners
                  .slice()
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((b) => (
                    <div
                      key={b.id}
                      className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/40"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                        <div className="w-full sm:w-44 h-28 rounded-lg overflow-hidden border border-slate-300 bg-slate-900 shrink-0 relative">
                          {b.imageUrl ? (
                            <img
                              src={b.imageUrl}
                              alt={b.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-white">
                              No Photo
                            </div>
                          )}
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 text-[10px] font-bold bg-slate-950/80 text-white rounded">
                            #{b.sortOrder} · {b.animationStyle || 'ken-burns'}
                          </span>
                        </div>

                        <div className="space-y-1.5 flex-1 w-full">
                          <input
                            type="text"
                            value={b.title}
                            onChange={(e) =>
                              setBanners((prev) =>
                                prev.map((item) =>
                                  item.id === b.id ? { ...item, title: e.target.value } : item
                                )
                              )
                            }
                            className="w-full px-2.5 py-1 text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md"
                          />
                          <input
                            type="text"
                            value={b.subtitle}
                            onChange={(e) =>
                              setBanners((prev) =>
                                prev.map((item) =>
                                  item.id === b.id ? { ...item, subtitle: e.target.value } : item
                                )
                              )
                            }
                            className="w-full px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md"
                          />
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <select
                              value={b.animationStyle || 'ken-burns'}
                              onChange={(e) =>
                                setBanners((prev) =>
                                  prev.map((item) =>
                                    item.id === b.id
                                      ? {
                                          ...item,
                                          animationStyle: e.target.value as
                                            | 'ken-burns'
                                            | 'fade-zoom'
                                            | 'slide',
                                        }
                                      : item
                                  )
                                )
                              }
                              className="px-2 py-1 text-[11px] border border-slate-200 rounded bg-white text-slate-700"
                            >
                              <option value="ken-burns">Animation: Ken Burns Zoom</option>
                              <option value="fade-zoom">Animation: Fade + Zoom</option>
                              <option value="slide">Animation: Horizontal Slide</option>
                            </select>

                            <label className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#084d75] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded cursor-pointer">
                              <Upload className="w-3 h-3" />
                              <span>Change Photo from File</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleBannerPhotoFileUpload(e, b.id)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          type="button"
                          onClick={() =>
                            setBanners((prev) =>
                              prev.map((item) =>
                                item.id === b.id ? { ...item, isActive: !item.isActive } : item
                              )
                            )
                          }
                          className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                            b.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {b.isActive ? 'Active on Home' : 'Hidden'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBanners((prev) => prev.filter((item) => item.id !== b.id));
                            showToast('Removed slide from Home Page.');
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* MODULE 14: PRICING PLANS */}
        {activeModule === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((p) => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                <p className="text-xs text-slate-500">{p.audience}</p>
                <h3 className="font-display text-lg font-bold text-slate-900">{p.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">Price (₹):</span>
                  <input
                    type="number"
                    value={p.price}
                    onChange={(e) =>
                      setPlans((prev) =>
                        prev.map((item) =>
                          item.id === p.id ? { ...item, price: Number(e.target.value) } : item
                        )
                      )
                    }
                    className="w-28 px-2.5 py-1 text-sm font-mono border border-slate-200 rounded-md"
                  />
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                  {p.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* MODULE 15: PAYMENTS */}
        {activeModule === 'payments' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="font-display text-base font-semibold text-slate-900 mb-4">
              Razorpay Transactions, GST Invoices & Refund Control
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 pr-3">Educator</th>
                    <th className="py-2.5 px-3">Plan</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Razorpay Ref</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 pl-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((pay) => (
                    <tr key={pay.id}>
                      <td className="py-3 pr-3 font-medium text-slate-900">{pay.userName}</td>
                      <td className="py-3 px-3 text-slate-600">{pay.planName}</td>
                      <td className="py-3 px-3 font-mono tabular-nums font-semibold">
                        ₹{pay.amount}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500">{pay.razorpayId}</td>
                      <td className="py-3 px-3 font-medium">{pay.status}</td>
                      <td className="py-3 pl-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() =>
                            showToast(
                              `Generated GST Invoice (${paymentConfig.gstPercent}% GST) for ${pay.razorpayId}.`
                            )
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-md"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Invoice</span>
                        </button>
                        {pay.status === 'PAID' && (
                          <button
                            type="button"
                            onClick={() => {
                              setPayments((prev) =>
                                prev.map((item) =>
                                  item.id === pay.id ? { ...item, status: 'REFUNDED' } : item
                                )
                              );
                              appendAudit('RAZORPAY_REFUND', 'Payments', pay.razorpayId);
                              showToast(`Refunded payment ${pay.razorpayId}.`);
                            }}
                            className="px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-50 rounded-md"
                          >
                            Refund
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Confidential Teacher Bank Payouts Ledger (Admin-to-Teacher Direct Bank Settlements) */}
            <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  🔒 Confidential Admin-to-Teacher Bank Account Settlements
                </span>
                <h3 className="font-display text-base font-bold text-slate-900 mt-0.5">
                  Teacher Bank Account Payout Ledger ({teacherPayouts.length} Settlements)
                </h3>
                <p className="text-xs text-slate-500">
                  All direct NEFT / IMPS / UPI payouts transferred by Admin to verified Teachers&apos; bank accounts.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 pr-3">Teacher</th>
                      <th className="py-2 px-3">Amount Paid</th>
                      <th className="py-2 px-3">🔒 Bank Name, A/C No. &amp; IFSC</th>
                      <th className="py-2 px-3">UTR Reference</th>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 pl-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {teacherPayouts.map((tp) => (
                      <tr key={tp.id}>
                        <td className="py-2.5 pr-3 font-semibold text-slate-900">{tp.tutorName}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                          ₹{tp.amount}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700">
                          {tp.bankName} · A/C: {tp.bankAccountNumber} · IFSC: {tp.bankIfscCode}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{tp.utrNumber}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{tp.paidAt}</td>
                        <td className="py-2.5 pl-3 text-right">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                            {tp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 16: USERS, STUDENTS, TUTORS & SUB-ADMINS (With Role Switch & Delete) */}
        {activeModule === 'users' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newAdminName.trim() || !newAdminEmail.trim()) return;
                setUsersDirectory((prev) => [
                  {
                    id: `u-admin-${Date.now()}`,
                    name: newAdminName.trim(),
                    email: newAdminEmail.trim(),
                    phone: '+91 98001 12233',
                    mobile: '+91 98001 12233',
                    role: newAdminRole,
                    isActive: true,
                    emailVerified: true,
                    phoneVerified: true,
                    createdAt: new Date().toISOString(),
                    lastActivity: 'Just provisioned by Owner',
                  },
                  ...prev,
                ]);
                setNewAdminName('');
                setNewAdminEmail('');
                showToast('Provisioned new user account.');
              }}
              className="grid grid-cols-1 md:grid-cols-4 gap-3"
            >
              <input
                type="text"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                placeholder="Full Name"
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="Email Address"
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
              <select
                value={newAdminRole}
                onChange={(e) => setNewAdminRole(e.target.value as Role)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="ADMIN">ADMIN (Full Control)</option>
                <option value="TUTOR">TUTOR</option>
                <option value="STUDENT">STUDENT</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#084d75] rounded-lg cursor-pointer"
              >
                Create User / Sub-Admin
              </button>
            </form>

            <div className="divide-y divide-slate-100">
              {usersDirectory.map((u) => (
                <div key={u.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-900">{u.name}</span> · {u.email} ·{' '}
                    <span className="font-mono text-slate-500">{u.phone || u.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        setUsersDirectory((prev) =>
                          prev.map((item) =>
                            item.id === u.id ? { ...item, role: e.target.value as Role } : item
                          )
                        )
                      }
                      className="px-2 py-1 text-xs font-mono font-semibold text-[#084d75] border border-slate-200 rounded bg-white"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="TUTOR">TUTOR</option>
                      <option value="STUDENT">STUDENT</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        setUsersDirectory((prev) => prev.filter((item) => item.id !== u.id));
                        appendAudit('DELETE_USER', 'Users', u.name);
                        showToast(`Deleted user ${u.name}.`);
                      }}
                      className="px-2.5 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 25: BLOG (With Delete Article) */}
        {activeModule === 'blog' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newBlogTitle.trim()) return;
                setBlogPosts((prev) => [
                  {
                    id: `blog-${Date.now()}`,
                    slug: newBlogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    title: newBlogTitle.trim(),
                    excerpt: newBlogContent.slice(0, 120) + '...',
                    content: newBlogContent.trim() || 'Full article content.',
                    category: newBlogCategory,
                    readTime: '5 min read',
                    isPublished: true,
                    createdAt: new Date().toISOString(),
                  },
                  ...prev,
                ]);
                setNewBlogTitle('');
                setNewBlogContent('');
                showToast('Published new blog article.');
              }}
              className="space-y-3 pb-5 border-b border-slate-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newBlogTitle}
                  onChange={(e) => setNewBlogTitle(e.target.value)}
                  placeholder="Article Headline"
                  className="md:col-span-2 px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
                <input
                  type="text"
                  value={newBlogCategory}
                  onChange={(e) => setNewBlogCategory(e.target.value)}
                  placeholder="Category"
                  className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
              <textarea
                rows={3}
                value={newBlogContent}
                onChange={(e) => setNewBlogContent(e.target.value)}
                placeholder="Write article body..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#084d75] rounded-lg cursor-pointer"
              >
                Publish Article
              </button>
            </form>

            <div className="space-y-3">
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 border border-slate-200 rounded-lg flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{post.title}</p>
                    <p className="text-xs text-slate-500">
                      {post.category} · {post.readTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setBlogPosts((prev) =>
                          prev.map((item) =>
                            item.id === post.id
                              ? { ...item, isPublished: !item.isPublished }
                              : item
                          )
                        )
                      }
                      className="px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-md cursor-pointer"
                    >
                      {post.isPublished ? 'Published' : 'Draft'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBlogPosts((prev) => prev.filter((item) => item.id !== post.id));
                        showToast(`Deleted blog post "${post.title}".`);
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 26: 7 EMAIL TEMPLATES */}
        {activeModule === 'templates' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-wrap gap-1.5 pb-3 border-b border-slate-100">
              {emailTemplates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg ${
                    selectedTemplateId === tpl.id
                      ? 'bg-[#084d75] text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {tpl.key}
                </button>
              ))}
            </div>
            {emailTemplates
              .filter((t) => t.id === selectedTemplateId)
              .map((tpl) => (
                <div key={tpl.id} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      value={tpl.subject}
                      onChange={(e) =>
                        setEmailTemplates((prev) =>
                          prev.map((item) =>
                            item.id === tpl.id ? { ...item, subject: e.target.value } : item
                          )
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Template Body
                    </label>
                    <textarea
                      rows={5}
                      value={tpl.body}
                      onChange={(e) =>
                        setEmailTemplates((prev) =>
                          prev.map((item) =>
                            item.id === tpl.id ? { ...item, body: e.target.value } : item
                          )
                        )
                      }
                      className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast(`Saved template ${tpl.key}.`)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#084d75] rounded-lg"
                  >
                    Save Email Template
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* MODULE 27: CSV DATA REPORTS */}
        {activeModule === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="font-display text-sm font-semibold text-slate-900">
                  Tutors Directory CSV Report
                </h3>
                <p className="text-xs text-slate-500">{tutors.length} verified & pending records</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  downloadCsv(
                    'vidyasetu-tutors-report.csv',
                    ['ID', 'Name', 'City', 'Locality', 'HourlyRate', 'Approved'],
                    tutors.map((t) => [
                      t.id,
                      t.name,
                      t.cityName,
                      t.localityName,
                      String(t.hourlyRate),
                      String(t.isApproved),
                    ])
                  )
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Download CSV</span>
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="font-display text-sm font-semibold text-slate-900">
                  Razorpay Payments Ledger CSV
                </h3>
                <p className="text-xs text-slate-500">{payments.length} transactions</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  downloadCsv(
                    'vidyasetu-payments-report.csv',
                    ['ID', 'Educator', 'Plan', 'Amount', 'Status', 'RazorpayID'],
                    payments.map((p) => [
                      p.id,
                      p.userName,
                      p.planName,
                      String(p.amount),
                      p.status,
                      p.razorpayId,
                    ])
                  )
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Download CSV</span>
              </button>
            </div>
          </div>
        )}

        {/* MODULE 29: NOTIFICATIONS */}
        {activeModule === 'notifications' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="font-display text-base font-semibold text-slate-900">
              Dispatch Bulk Email, MSG91 SMS & WhatsApp Broadcast
            </h2>
            <input
              type="text"
              value={broadcastSubject}
              onChange={(e) => setBroadcastSubject(e.target.value)}
              placeholder="Notification Subject"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
            <textarea
              rows={4}
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Write SMS / Email / WhatsApp announcement for all active educators and parents..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
            <button
              type="button"
              onClick={() => {
                setBroadcastSubject('');
                setBroadcastMessage('');
                showToast('Notification queued for all active users.');
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#084d75] rounded-lg"
            >
              Send Broadcast Alert
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
