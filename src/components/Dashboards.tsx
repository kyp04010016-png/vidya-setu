import React, { useState } from 'react';
import {
  CheckCircle2,
  CreditCard,
  PlusCircle,
  Loader2,
  ShieldCheck,
  Navigation,
  Video,
  Users,
  Check,
  X,
  Send,
  MessageCircle,
  Mail,
  Smartphone,
  Clock,
  BookOpen,
  Landmark,
  Lock,
  ExternalLink,
  Sparkles,
  FileText,
  Radio,
  Camera,
  Upload,
  Award,
} from 'lucide-react';
import {
  TutorItem,
  InquiryItem,
  PricingPlanItem,
  RequirementItem,
  ReviewItem,
  CityItem,
  CourseItem,
  SubjectItem,
  TuitionType,
  BIHAR_ALL_38_DISTRICTS,
  SubscribedStudentItem,
  OnlineClassSessionItem,
  TutorTaskItem,
  TeacherPayoutItem,
  StudentAchieverItem,
} from '../data/seedData';
import { readAndCompressImageFile } from './SocialPlatformIcon';

interface TutorDashboardProps {
  tutor: TutorItem;
  inquiries: InquiryItem[];
  plans: PricingPlanItem[];
  cities: CityItem[];
  courses: CourseItem[];
  subjects: SubjectItem[];
  subscribedStudents: SubscribedStudentItem[];
  onlineClasses: OnlineClassSessionItem[];
  tutorTasks: TutorTaskItem[];
  teacherPayouts: TeacherPayoutItem[];
  onUpdateTutor: (updated: TutorItem) => Promise<void>;
  onUpdateInquiryStatus: (inquiryId: string, status: InquiryItem['status']) => void;
  onUpgradePlan: (plan: PricingPlanItem) => Promise<void>;
  onMarkAttendance: (studentSubId: string, status: 'PRESENT' | 'ABSENT') => void;
  onToggleStudentActive: (studentSubId: string) => void;
  onAddSubscribedStudent: (student: Omit<SubscribedStudentItem, 'id' | 'subscribedAt'>) => void;
  onCreateOnlineClass: (cls: Omit<OnlineClassSessionItem, 'id' | 'createdAt'>) => void;
  onUpdateOnlineClassStatus: (classId: string, status: OnlineClassSessionItem['status']) => void;
  onBroadcastOnlineClass: (classId: string, channels: ('WHATSAPP' | 'SMS' | 'EMAIL')[]) => void;
  onCreateTutorTask: (task: Omit<TutorTaskItem, 'id' | 'createdAt' | 'submittedStudentIds' | 'studentSubmissions'>) => void;
}

export const TutorDashboard: React.FC<TutorDashboardProps> = ({
  tutor,
  inquiries,
  plans,
  cities,
  courses,
  subjects,
  subscribedStudents,
  onlineClasses,
  tutorTasks,
  teacherPayouts,
  onUpdateTutor,
  onUpdateInquiryStatus,
  onUpgradePlan,
  onMarkAttendance,
  onToggleStudentActive,
  onAddSubscribedStudent,
  onCreateOnlineClass,
  onUpdateOnlineClassStatus,
  onBroadcastOnlineClass,
  onCreateTutorTask,
}) => {
  const [activeTab, setActiveTab] = useState<
    'students' | 'online-class' | 'tasks' | 'schedule' | 'bank' | 'profile' | 'inquiries' | 'plan'
  >('students');

  // Profile & Fee State
  const [name, setName] = useState(tutor.name);
  const [avatarUrl, setAvatarUrl] = useState(tutor.photoUrl || tutor.avatarUrl || '');
  const [qualification, setQualification] = useState(tutor.qualification);
  const [experienceYrs, setExperienceYrs] = useState(tutor.experienceYrs);
  const [hourlyRate, setHourlyRate] = useState(tutor.hourlyRate);
  const [monthlyRate, setMonthlyRate] = useState(
    tutor.monthlyRate || Math.max(1500, tutor.hourlyRate * 10)
  );
  const [minDurationMonths, setMinDurationMonths] = useState(tutor.minDurationMonths || 3);
  const [country, setCountry] = useState(tutor.country || 'India');
  const [stateName, setStateName] = useState(tutor.state || 'Bihar');
  const [cityId, setCityId] = useState(tutor.cityId);
  const [blockName, setBlockName] = useState(tutor.blockName || tutor.localityName);
  const [localityName, setLocalityName] = useState(tutor.localityName);
  const [pincode, setPincode] = useState(tutor.pincode || '801503');
  const [address, setAddress] = useState(
    tutor.address ||
      `#102, ${tutor.localityName}, Block ${tutor.blockName || tutor.localityName}, ${tutor.cityName}, Bihar - ${tutor.pincode || '801503'}`
  );
  const [tuitionType, setTuitionType] = useState<TuitionType>(tutor.tuitionType);
  const [bio, setBio] = useState(tutor.bio);
  const [selectedCourses, setSelectedCourses] = useState<string[]>(tutor.courses);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(tutor.subjects);

  // Confidential Bank Account State (Visible ONLY to Admin & this Teacher)
  const [bankAccountHolder, setBankAccountHolder] = useState(tutor.bankAccountHolder || tutor.name);
  const [bankName, setBankName] = useState(tutor.bankName || 'State Bank of India');
  const [bankAccountNumber, setBankAccountNumber] = useState(tutor.bankAccountNumber || '');
  const [bankIfscCode, setBankIfscCode] = useState(tutor.bankIfscCode || '');
  const [upiId, setUpiId] = useState(tutor.upiId || '');
  const [bankSavedNotice, setBankSavedNotice] = useState('');

  // Batch Time Slots State
  const [batchSlots, setBatchSlots] = useState<string[]>(
    tutor.batchTimeSlots || [
      '07:00 AM - 08:30 AM (Morning Batch)',
      '04:00 PM - 05:30 PM (Evening Batch 1)',
      '06:00 PM - 07:30 PM (Evening Batch 2 - Online Zoom/Google)',
    ]
  );
  const [newSlotText, setNewSlotText] = useState('');
  const [preferredTime, setPreferredTime] = useState(tutor.preferredTime || 'AnyTime');

  // New Subscribed Student Modal / Form State
  const [newStuName, setNewStuName] = useState('');
  const [newStuMobile, setNewStuMobile] = useState('');
  const [newStuEmail, setNewStuEmail] = useState('');
  const [newStuCourse, setNewStuCourse] = useState('Class 10 CBSE');
  const [newStuBatch, setNewStuBatch] = useState('04:00 PM - 05:30 PM (Mon-Sat)');
  const [newStuStudyMode, setNewStuStudyMode] = useState<'ONLINE' | 'OFFLINE' | 'BOTH'>('ONLINE');
  const [studentModeFilter, setStudentModeFilter] = useState<'ALL' | 'ONLINE' | 'OFFLINE'>('ALL');

  // New Online Class Form State (Zoom / Google Classroom / Google Meet / In-App Live)
  const [clsTitle, setClsTitle] = useState('');
  const [clsSubject, setClsSubject] = useState(tutor.subjects[0] || 'Mathematics & Physics');
  const [clsCourse, setClsCourse] = useState(tutor.courses[0] || 'Class 10 CBSE');
  const [clsPlatform, setClsPlatform] = useState<OnlineClassSessionItem['platform']>('ZOOM');
  const [clsDate, setClsDate] = useState('2026-10-25');
  const [clsTime, setClsTime] = useState('04:00 PM');
  const [clsDuration, setClsDuration] = useState(60);
  const [clsBatch, setClsBatch] = useState('04:00 PM - 05:00 PM (Evening Batch)');
  const [clsMeetingUrl, setClsMeetingUrl] = useState('');
  const [clsPasscode, setClsPasscode] = useState('VS2026');
  const [broadcastBanner, setBroadcastBanner] = useState<string | null>(null);
  const [activeInAppClass, setActiveInAppClass] = useState<OnlineClassSessionItem | null>(null);

  // New Task / Homework Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState(tutor.subjects[0] || 'Mathematics');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('2026-10-27');
  const [taskDueTime, setTaskDueTime] = useState('05:00 PM');
  const [taskMarks, setTaskMarks] = useState(25);
  const [taskAttachment, setTaskAttachment] = useState('');
  const [taskNotice, setTaskNotice] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [payingPlanId, setPayingPlanId] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState('');

  // Filter records belonging to this tutor (or show sample if newly created tutor)
  const myStudents = subscribedStudents.filter(
    (s) => s.tutorId === tutor.id || s.tutorName.toLowerCase() === tutor.name.toLowerCase() || s.tutorId === 'tutor-bihar-1'
  );
  const myClasses = onlineClasses.filter(
    (c) => c.tutorId === tutor.id || c.tutorName.toLowerCase() === tutor.name.toLowerCase() || c.tutorId === 'tutor-bihar-1'
  );
  const myPayouts = teacherPayouts.filter(
    (p) => p.tutorId === tutor.id || p.tutorName.toLowerCase() === tutor.name.toLowerCase()
  );
  const tutorInquiries = inquiries.filter(
    (inq) => inq.tutorId === tutor.id || inq.tutorName === tutor.name
  );

  const activeLoginCount = myStudents.filter((s) => s.isLoginActive).length;
  const presentTodayCount = myStudents.filter((s) => s.attendanceToday === 'PRESENT').length;
  const absentTodayCount = myStudents.filter((s) => s.attendanceToday === 'ABSENT').length;

  const currentCity =
    cities.find((c) => c.id === cityId) ||
    BIHAR_ALL_38_DISTRICTS.find((d) => d.id === cityId) ||
    cities[0];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage('');
    try {
      const cleanCityName = currentCity.name.replace(' (Bihar)', '');
      await onUpdateTutor({
        ...tutor,
        name: name.trim(),
        avatarUrl: avatarUrl.trim() || tutor.avatarUrl,
        photoUrl: avatarUrl.trim() || tutor.photoUrl || tutor.avatarUrl,
        qualification: qualification.trim(),
        experienceYrs: Number(experienceYrs),
        hourlyRate: Number(hourlyRate),
        monthlyRate: Number(monthlyRate) || 3000,
        minDurationMonths: Number(minDurationMonths) || 3,
        country: country.trim() || 'India',
        state: stateName.trim() || 'Bihar',
        cityId,
        cityName: cleanCityName,
        blockName: blockName.trim() || localityName.trim(),
        localityName: localityName.trim(),
        pincode: pincode.trim() || '801503',
        address: address.trim(),
        tuitionType,
        bio: bio.trim(),
        preferredTime,
        batchTimeSlots: batchSlots,
        bankAccountHolder: bankAccountHolder.trim(),
        bankName: bankName.trim(),
        bankAccountNumber: bankAccountNumber.trim(),
        bankIfscCode: bankIfscCode.trim().toUpperCase(),
        upiId: upiId.trim(),
        courses: selectedCourses.length > 0 ? selectedCourses : tutor.courses,
        subjects: selectedSubjects.length > 0 ? selectedSubjects : tutor.subjects,
      });
      setSaveMessage(
        '✓ Teacher Profile, Monthly Fee, Schedule & Confidential Bank Details Saved!'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBankDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateTutor({
      ...tutor,
      bankAccountHolder: bankAccountHolder.trim() || tutor.name,
      bankName: bankName.trim(),
      bankAccountNumber: bankAccountNumber.trim(),
      bankIfscCode: bankIfscCode.trim().toUpperCase(),
      upiId: upiId.trim(),
    });
    setBankSavedNotice(
      '🔒 Confidential Bank Account Details Saved! Strictly visible ONLY to Owner Admin for your tuition fee payouts.'
    );
  };

  const handleCreateClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clsTitle.trim()) return;
    const defaultUrl =
      clsPlatform === 'ZOOM'
        ? `https://zoom.us/j/${Math.floor(81000000000 + Math.random() * 9000000000)}?pwd=${clsPasscode || 'VS2026'}`
        : clsPlatform === 'GOOGLE_CLASSROOM' || clsPlatform === 'GOOGLE_MEET'
        ? `https://meet.google.com/vsetu-${tutor.slug.slice(0, 8)}-live`
        : `https://vidyasetu.in/live-room/${tutor.id}`;
    const finalUrl = clsMeetingUrl.trim() || defaultUrl;
    const meetingId =
      clsPlatform === 'ZOOM'
        ? `${Math.floor(810 + Math.random() * 180)} ${Math.floor(1000 + Math.random() * 8999)} ${Math.floor(1000 + Math.random() * 8999)}`
        : `vsetu-${tutor.slug.slice(0, 6)}-live`;

    onCreateOnlineClass({
      tutorId: tutor.id,
      tutorName: tutor.name,
      title: clsTitle.trim(),
      subject: clsSubject.trim(),
      course: clsCourse.trim(),
      platform: clsPlatform,
      meetingUrl: finalUrl,
      meetingId,
      passcode: clsPasscode.trim() || 'VS2026',
      scheduledDate: clsDate,
      scheduledTime: clsTime,
      durationMinutes: Number(clsDuration) || 60,
      batchTiming: clsBatch,
      status: 'LIVE_NOW',
      notifiedCount: myStudents.length,
      lastBroadcastAt: `Auto-Notified ${myStudents.length} Subscribed Students via WhatsApp, SMS & Email`,
    });

    setBroadcastBanner(
      `✅ Live ${clsPlatform.replace('_', ' ')} Class "${clsTitle.trim()}" created for ${clsDate} at ${clsTime}! Automatically visible on all ${myStudents.length} subscribed students' dashboards and broadcast via WhatsApp, SMS & Email.`
    );
    setClsTitle('');
  };

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDesc.trim()) return;
    onCreateTutorTask({
      tutorId: tutor.id,
      tutorName: tutor.name,
      uploadedByRole: 'TUTOR',
      uploadedByName: `${tutor.name} (Teacher)`,
      title: taskTitle.trim(),
      subject: taskSubject.trim(),
      description: taskDesc.trim(),
      dueDate: taskDueDate,
      dueTime: taskDueTime,
      maxMarks: Number(taskMarks) || 25,
      attachmentUrl: taskAttachment.trim() || undefined,
    });
    setTaskTitle('');
    setTaskDesc('');
    setTaskAttachment('');
    setTaskNotice('✓ Task / Homework uploaded and immediately visible to all Subscribed Students!');
  };

  const handlePlanCheckout = async (plan: PricingPlanItem) => {
    setPayingPlanId(plan.id);
    setPaymentSuccess('');
    try {
      await new Promise((r) => setTimeout(r, 450));
      await onUpgradePlan(plan);
      setPaymentSuccess(
        `Razorpay Signature Verified (HMAC-SHA256) — ${plan.name} activated for ${plan.durationDays} days.`
      );
    } finally {
      setPayingPlanId(null);
    }
  };

  const tutorMenuModules: Array<{
    id: typeof activeTab;
    num: string;
    label: string;
    badge?: string;
    category: string;
  }> = [
    {
      id: 'students',
      num: '01',
      label: 'Subscribed Students & Attendance',
      badge: String(myStudents.length),
      category: 'Classroom & Students',
    },
    {
      id: 'online-class',
      num: '02',
      label: 'Live Classes (Zoom / Google)',
      badge: String(myClasses.length),
      category: 'Classroom & Students',
    },
    {
      id: 'tasks',
      num: '03',
      label: 'Tasks & Homework Board',
      badge: String(tutorTasks.length),
      category: 'Classroom & Students',
    },
    {
      id: 'schedule',
      num: '04',
      label: 'Time & Batch Schedule',
      badge: String(batchSlots.length),
      category: 'Schedule & Finance',
    },
    {
      id: 'bank',
      num: '05',
      label: 'Bank Account & Payouts',
      badge: String(myPayouts.length),
      category: 'Schedule & Finance',
    },
    {
      id: 'profile',
      num: '06',
      label: 'Edit Profile & Monthly Fee',
      category: 'Account & Inquiries',
    },
    {
      id: 'inquiries',
      num: '07',
      label: 'Student Inquiries & Demos',
      badge: String(tutorInquiries.length),
      category: 'Account & Inquiries',
    },
    {
      id: 'plan',
      num: '08',
      label: 'Teacher Membership Plan',
      category: 'Account & Inquiries',
    },
  ];

  const displayedStudents = myStudents.filter((s) => {
    if (studentModeFilter === 'ALL') return true;
    const mode = s.studyMode || (s.batchTiming.toLowerCase().includes('online') ? 'ONLINE' : 'OFFLINE');
    return mode === studentModeFilter || mode === 'BOTH';
  });

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col lg:flex-row bg-[#F4F7FA] dark:bg-slate-950 animate-page-transition">
      {/* 280px TEACHER PANEL LIST-BY-LIST SIDEBAR MENU */}
      <aside className="w-full lg:w-72 shrink-0 bg-gradient-to-b from-[#041e30] via-[#062c47] to-[#083b5c] text-white border-b lg:border-b-0 lg:border-r border-slate-800 p-4 flex flex-col">
        <div className="mb-4 p-3.5 rounded-xl bg-white/10 border border-white/15">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950">
              👨‍🏫 Teacher Panel
            </span>
            <span className="text-[11px] font-mono text-emerald-300">🟢 Active</span>
          </div>
          <div className="flex items-center gap-3 mt-2.5">
            <div className="relative w-12 h-12 rounded-full border-2 border-amber-400 overflow-hidden bg-slate-900 shrink-0">
              <img
                src={avatarUrl || tutor.photoUrl || tutor.avatarUrl}
                alt={tutor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-base font-bold text-white truncate">{tutor.name}</h2>
              <p className="text-[11px] font-mono text-amber-200 truncate">
                ID: {tutor.loginUserId || `TCH-${tutor.tutorNumericId || '1584150'}`}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-[11px] text-slate-300 truncate">
              📍 {tutor.localityName}, {tutor.cityName} · ₹{(tutor.monthlyRate || monthlyRate).toLocaleString('en-IN')}/Mo
            </p>
            <label className="px-2 py-1 rounded bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-amber-200 text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer shrink-0">
              <Camera className="w-3 h-3" />
              <span>Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const compressed = await readAndCompressImageFile(file, 360);
                  setAvatarUrl(compressed);
                  await onUpdateTutor({
                    ...tutor,
                    avatarUrl: compressed,
                    photoUrl: compressed,
                  });
                }}
              />
            </label>
          </div>
        </div>

        <nav aria-label="Teacher Panel List-by-List Menu" className="space-y-4 flex-1">
          {['Classroom & Students', 'Schedule & Finance', 'Account & Inquiries'].map((cat) => (
            <div key={cat} className="space-y-1">
              <p className="px-2.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-300/90">
                {cat}
              </p>
              <div className="space-y-1">
                {tutorMenuModules
                  .filter((m) => m.category === cat)
                  .map((tab) => {
                    const isSelected = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
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
                            {tab.num}
                          </span>
                          <span className="truncate">{tab.label}</span>
                        </div>
                        {tab.badge && (
                          <span
                            className={`font-mono text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                              isSelected
                                ? 'bg-white text-slate-950 font-bold'
                                : 'bg-slate-900/80 text-slate-300'
                            }`}
                          >
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* TEACHER PANEL MAIN WORKSPACE */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl">
        {/* DEDICATED TEACHER LOGIN PANEL HEADER */}
        <div className="bg-gradient-to-r from-[#062c47] via-[#084d75] to-[#0d6296] text-white rounded-xl p-5 sm:p-6 shadow-md mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                <span>👨‍🏫 Dedicated Teacher Login Panel</span>
                <span>·</span>
                <span className="font-mono bg-white/15 px-2 py-0.5 rounded text-white">
                  Login ID: {tutor.loginUserId || `TCH-${tutor.tutorNumericId || '1584150'}`}
                </span>
                <span>·</span>
                <span className="text-emerald-300">🟢 Teacher Online &amp; Active</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold mt-1">
                {tutorMenuModules.find((m) => m.id === activeTab)?.num}.{' '}
                {tutorMenuModules.find((m) => m.id === activeTab)?.label}
              </h1>
              <p className="text-xs text-slate-200 mt-1">
                {tutor.qualification} · {tutor.localityName} (Block: {tutor.blockName || tutor.localityName}, Pin: {tutor.pincode || '801503'}), {tutor.cityName}, Bihar · Monthly Fee: ₹{(tutor.monthlyRate || monthlyRate).toLocaleString('en-IN')}/Mo ({tutor.minDurationMonths || minDurationMonths} Months)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('online-class')}
                className="px-4 py-2 text-xs font-bold uppercase bg-[#ff6600] hover:bg-[#e05500] text-white rounded-lg inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>Launch Zoom / Google Class</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bank')}
                className="px-3.5 py-2 text-xs font-bold bg-white/15 hover:bg-white/25 text-amber-300 border border-amber-300/40 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Landmark className="w-4 h-4" />
                <span>Bank &amp; Payouts</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5">
            <p className="text-[11px] text-slate-500">Subscribed Students</p>
            <p className="font-mono text-xl font-bold text-[#084d75] dark:text-white mt-0.5">
              {myStudents.length}
            </p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5">
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
              🟢 Login Active Now
            </p>
            <p className="font-mono text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
              {activeLoginCount} Active / {myStudents.length - activeLoginCount} Inactive
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-3.5">
            <p className="text-[11px] text-blue-800 dark:text-blue-300 font-semibold">
              Today&apos;s Attendance
            </p>
            <p className="font-mono text-sm font-bold text-blue-900 dark:text-blue-300 mt-1">
              ✓ {presentTodayCount} Present · ✗ {absentTodayCount} Absent
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3.5">
            <p className="text-[11px] text-slate-600 dark:text-amber-200">Monthly Tuition Fee</p>
            <p className="font-mono text-base font-bold text-[#e66000] mt-1">
              ₹{(tutor.monthlyRate || monthlyRate).toLocaleString('en-IN')}/Mo
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5">
            <p className="text-[11px] text-slate-500">Live Online Classes</p>
            <p className="font-mono text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {myClasses.length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5">
            <p className="text-[11px] text-slate-500">Shared Tasks</p>
            <p className="font-mono text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {tutorTasks.length}
            </p>
          </div>
        </div>

        {/* ==================== TAB 1: SUBSCRIBED STUDENTS + LOGIN ACTIVE/INACTIVE + PRESENT/ABSENT ==================== */}
        {activeTab === 'students' && (
          <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#084d75]" />
                  <span>
                    Students Subscribed to {tutor.name} ({myStudents.length}) — Live Login Status &amp; Daily Attendance
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  See which subscribed students are currently <strong>Login Active (Online)</strong> vs <strong>Login Inactive (Offline)</strong> and mark daily <strong>Present / Absent</strong> attendance.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setStudentModeFilter('ALL')}
                  className={`px-2.5 py-1 rounded-md font-bold cursor-pointer ${
                    studentModeFilter === 'ALL'
                      ? 'bg-[#084d75] text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  All ({myStudents.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStudentModeFilter('ONLINE')}
                  className={`px-2.5 py-1 rounded-md font-bold cursor-pointer ${
                    studentModeFilter === 'ONLINE'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}
                >
                  🖥️ Online Study
                </button>
                <button
                  type="button"
                  onClick={() => setStudentModeFilter('OFFLINE')}
                  className={`px-2.5 py-1 rounded-md font-bold cursor-pointer ${
                    studentModeFilter === 'OFFLINE'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  🏠 Offline Study
                </button>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  🟢 {activeLoginCount} Active
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                    <th className="py-3 px-3 font-bold">Student Name &amp; Contact</th>
                    <th className="py-3 px-3 font-bold">Course, Mode &amp; Batch Time</th>
                    <th className="py-3 px-3 font-bold">Live Login Status</th>
                    <th className="py-3 px-3 font-bold">Today&apos;s Attendance</th>
                    <th className="py-3 px-3 font-bold">Total Present / Absent</th>
                    <th className="py-3 px-3 font-bold text-right">Mark Present / Absent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {displayedStudents.map((stu) => {
                    const totalDays = stu.presentDaysCount + stu.absentDaysCount || 1;
                    const pct = Math.round((stu.presentDaysCount / totalDays) * 100);
                    const effMode =
                      stu.studyMode ||
                      (stu.batchTiming.toLowerCase().includes('online') ? 'ONLINE' : 'OFFLINE');
                    return (
                      <tr key={stu.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                        <td className="py-3.5 px-3">
                          <p className="font-bold text-slate-900 dark:text-white">{stu.studentName}</p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {stu.studentMobile} · {stu.studentEmail}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            📍 {stu.localityName}, {stu.districtName}
                          </p>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                effMode === 'ONLINE'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {effMode === 'ONLINE' ? '🖥️ ONLINE STUDY' : '🏠 OFFLINE HOME'}
                            </span>
                            <span className="font-semibold text-[#084d75] dark:text-sky-300">
                              {stu.course}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400">{stu.subjects}</p>
                          <p className="text-[11px] font-mono text-amber-700 dark:text-amber-300 mt-0.5">
                            ⏰ {stu.batchTiming}
                          </p>
                        </td>
                        <td className="py-3.5 px-3">
                          <button
                            type="button"
                            onClick={() => onToggleStudentActive(stu.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                              stu.isLoginActive
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-100 text-slate-600 border border-slate-300'
                            }`}
                            title="Click to toggle Login Active / Inactive simulation"
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                stu.isLoginActive ? 'bg-emerald-600 animate-ping' : 'bg-slate-400'
                              }`}
                            />
                            <span>{stu.isLoginActive ? 'LOGIN ACTIVE' : 'LOGIN INACTIVE'}</span>
                          </button>
                          <p className="text-[10px] text-slate-500 mt-1">{stu.lastSeenText}</p>
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                              stu.attendanceToday === 'PRESENT'
                                ? 'bg-emerald-600 text-white'
                                : stu.attendanceToday === 'ABSENT'
                                ? 'bg-red-600 text-white'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {stu.attendanceToday === 'PRESENT'
                              ? '✓ PRESENT (उपस्थित)'
                              : stu.attendanceToday === 'ABSENT'
                              ? '✗ ABSENT (अनुपस्थित)'
                              : 'UNMARKED'}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-mono">
                          <span className="text-emerald-700 font-bold">{stu.presentDaysCount} P</span>
                          {' / '}
                          <span className="text-red-600 font-bold">{stu.absentDaysCount} A</span>
                          <span className="ml-1.5 text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {pct}%
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onMarkAttendance(stu.id, 'PRESENT')}
                              className={`px-2.5 py-1.5 rounded-md text-xs font-bold inline-flex items-center gap-1 cursor-pointer ${
                                stu.attendanceToday === 'PRESENT'
                                  ? 'bg-emerald-700 text-white'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Present</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onMarkAttendance(stu.id, 'ABSENT')}
                              className={`px-2.5 py-1.5 rounded-md text-xs font-bold inline-flex items-center gap-1 cursor-pointer ${
                                stu.attendanceToday === 'ABSENT'
                                  ? 'bg-red-700 text-white'
                                  : 'bg-red-50 text-red-700 border border-red-300 hover:bg-red-100'
                              }`}
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Absent</span>
                            </button>
                            <a
                              href={`https://wa.me/91${stu.studentMobile.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(
                                `Hello ${stu.studentName}, this is your teacher ${tutor.name}. Your attendance today is marked as ${stu.attendanceToday}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded-md text-xs font-bold bg-[#25D366] text-white hover:bg-[#1ebe5d] inline-flex items-center gap-1"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add New Subscribed Student to Batch */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newStuName.trim() || !newStuMobile.trim()) return;
              onAddSubscribedStudent({
                tutorId: tutor.id,
                tutorName: tutor.name,
                studentId: `u-stu-${Date.now()}`,
                studentName: newStuName.trim(),
                studentMobile: newStuMobile.trim(),
                studentEmail:
                  newStuEmail.trim() ||
                  `${newStuName.trim().toLowerCase().replace(/\s+/g, '.')}@example.com`,
                districtName: tutor.cityName,
                localityName: tutor.localityName,
                course: newStuCourse,
                subjects: tutor.subjects.join(', '),
                batchTiming: newStuBatch,
                monthlyFee: tutor.monthlyRate || 2500,
                isLoginActive: true,
                lastSeenText: 'Online Now · Newly Enrolled',
                attendanceToday: 'PRESENT',
                presentDaysCount: 1,
                absentDaysCount: 0,
                studyMode: newStuStudyMode,
              });
              setNewStuName('');
              setNewStuMobile('');
              setNewStuEmail('');
            }}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3"
          >
            <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
              + Enroll / Add Subscribed Student to Your Batch (Online or Offline)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-2.5 text-xs">
              <input
                type="text"
                required
                value={newStuName}
                onChange={(e) => setNewStuName(e.target.value)}
                placeholder="Student Name *"
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 rounded-md"
              />
              <input
                type="tel"
                required
                value={newStuMobile}
                onChange={(e) => setNewStuMobile(e.target.value)}
                placeholder="Mobile / WhatsApp *"
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 rounded-md font-mono"
              />
              <input
                type="email"
                value={newStuEmail}
                onChange={(e) => setNewStuEmail(e.target.value)}
                placeholder="Student Email"
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 rounded-md"
              />
              <input
                type="text"
                value={newStuCourse}
                onChange={(e) => setNewStuCourse(e.target.value)}
                placeholder="Class / Course"
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 rounded-md"
              />
              <select
                value={newStuStudyMode}
                onChange={(e) =>
                  setNewStuStudyMode(e.target.value as 'ONLINE' | 'OFFLINE' | 'BOTH')
                }
                className="px-2.5 py-2 font-bold bg-white dark:bg-slate-800 border border-slate-300 rounded-md"
              >
                <option value="ONLINE">🖥️ Online Study</option>
                <option value="OFFLINE">🏠 Offline Home</option>
                <option value="BOTH">✨ Both Modes</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 font-bold text-white bg-[#084d75] hover:bg-[#063a58] rounded-md cursor-pointer"
              >
                + Add Student
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== TAB 2: LIVE ONLINE CLASS (ZOOM / GOOGLE CLASSROOM / GOOGLE MEET + 1-CLICK BULK WHATSAPP/SMS/EMAIL) ==================== */}
      {activeTab === 'online-class' && (
        <div className="space-y-6">
          {broadcastBanner && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-xl text-xs font-bold text-emerald-900 flex items-center justify-between gap-3">
              <span>{broadcastBanner}</span>
              <button
                type="button"
                onClick={() => setBroadcastBanner(null)}
                className="text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Create & Schedule Online Class on Zoom / Google Classroom / Google Meet */}
          <form
            onSubmit={handleCreateClassSubmit}
            className="bg-white dark:bg-slate-900 border-2 border-[#084d75] rounded-xl p-6 space-y-4 shadow-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6600]">
                  Zoom App · Google Classroom · Google Meet · In-Panel Live Video
                </span>
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  Create Live Online Class &amp; Notify All Subscribed Students (WhatsApp + SMS + Email)
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Auto-Syncs to {myStudents.length} Subscribed Students&apos; IDs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Online Class Topic / Title *
                </label>
                <input
                  type="text"
                  required
                  value={clsTitle}
                  onChange={(e) => setClsTitle(e.target.value)}
                  placeholder="e.g. Chapter 5: Quadratic Equations & Live Doubt Solving"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Online Class App *
                </label>
                <select
                  value={clsPlatform}
                  onChange={(e) =>
                    setClsPlatform(e.target.value as OnlineClassSessionItem['platform'])
                  }
                  className="w-full px-3 py-2 font-bold text-[#084d75] bg-blue-50 dark:bg-slate-800 border border-blue-300 rounded-lg"
                >
                  <option value="ZOOM">📹 Zoom App Live Class</option>
                  <option value="GOOGLE_CLASSROOM">🎓 Google Classroom Live</option>
                  <option value="GOOGLE_MEET">🟢 Google Meet Live Class</option>
                  <option value="IN_APP_LIVE">🖥️ In-Panel Live Classroom</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={clsSubject}
                  onChange={(e) => setClsSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Class Date *
                </label>
                <input
                  type="date"
                  required
                  value={clsDate}
                  onChange={(e) => setClsDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Start Time *
                </label>
                <input
                  type="text"
                  required
                  value={clsTime}
                  onChange={(e) => setClsTime(e.target.value)}
                  placeholder="04:00 PM"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min={15}
                  max={240}
                  value={clsDuration}
                  onChange={(e) => setClsDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Batch Timing
                </label>
                <select
                  value={clsBatch}
                  onChange={(e) => setClsBatch(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                >
                  {batchSlots.map((slot, i) => (
                    <option key={i} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Zoom / Google Classroom Link (Leave blank to auto-generate instant link)
                </label>
                <input
                  type="text"
                  value={clsMeetingUrl}
                  onChange={(e) => setClsMeetingUrl(e.target.value)}
                  placeholder="https://zoom.us/j/... or https://meet.google.com/... (Auto-generated if empty)"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Class Passcode
                </label>
                <input
                  type="text"
                  value={clsPasscode}
                  onChange={(e) => setClsPasscode(e.target.value)}
                  placeholder="VS2026"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] text-slate-500">
                ✓ Appears immediately on all subscribed students&apos; dashboards and sends bulk WhatsApp, SMS &amp; Email alert.
              </p>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white bg-[#ff6600] hover:bg-[#e05500] rounded-lg inline-flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>Create Online Class &amp; Notify All Students</span>
              </button>
            </div>
          </form>

          {/* Scheduled & Live Online Classes List + 1-Click Bulk Broadcast */}
          <div className="space-y-4">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
              Your Scheduled &amp; Live Online Classes ({myClasses.length})
            </h3>
            {myClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase ${
                        cls.status === 'LIVE_NOW'
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {cls.status === 'LIVE_NOW' ? '🔴 LIVE NOW' : cls.status}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold text-[#084d75] dark:text-amber-300">
                      {cls.platform === 'ZOOM'
                        ? '📹 Zoom App'
                        : cls.platform === 'GOOGLE_CLASSROOM'
                        ? '🎓 Google Classroom'
                        : cls.platform === 'GOOGLE_MEET'
                        ? '🟢 Google Meet'
                        : '🖥️ In-Panel Classroom'}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      📅 {cls.scheduledDate} · ⏰ {cls.scheduledTime} ({cls.durationMinutes} mins)
                    </span>
                  </div>

                  <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    {cls.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {cls.course} · {cls.subject} · Batch: {cls.batchTiming}
                  </p>
                  <p className="text-xs font-mono text-emerald-700 dark:text-emerald-400">
                    Link: {cls.meetingUrl} · ID: {cls.meetingId} · Passcode: {cls.passcode}
                  </p>
                  {cls.lastBroadcastAt && (
                    <p className="text-[11px] text-slate-500">
                      📢 Last Broadcast: <strong>{cls.lastBroadcastAt}</strong>
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {/* Launch In-Panel Classroom */}
                  <button
                    type="button"
                    onClick={() => setActiveInAppClass(cls)}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-[#084d75] hover:bg-[#063a58] rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Radio className="w-3.5 h-3.5 text-amber-300" />
                    <span>Take Live Class in Panel</span>
                  </button>

                  {/* Open External Zoom / Google Classroom App */}
                  <a
                    href={cls.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg inline-flex items-center gap-1.5"
                  >
                    <span>Open {cls.platform === 'ZOOM' ? 'Zoom' : 'Google'} App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* 1-CLICK BULK BROADCAST TO ALL SUBSCRIBED STUDENTS (WHATSAPP + SMS + EMAIL) */}
                  <button
                    type="button"
                    onClick={() => {
                      onBroadcastOnlineClass(cls.id, ['WHATSAPP', 'SMS', 'EMAIL']);
                      setBroadcastBanner(
                        `📢 Bulk Alert Dispatched! Sent "${cls.title}" (${cls.scheduledDate} at ${cls.scheduledTime}) + ${cls.platform} Link to all ${myStudents.length} Subscribed Students simultaneously via WhatsApp, SMS & Email!`
                      );
                    }}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#1ebe5d] rounded-lg inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Bulk WhatsApp + SMS + Email ({myStudents.length})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 3: STUDENT TASKS & HOMEWORK UPLOAD ==================== */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <form
            onSubmit={handleCreateTaskSubmit}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#ff6600]" />
                  <span>Upload Daily Task / Homework / Assignment for Subscribed Students</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Every task uploaded here or by any student is immediately visible to all subscribed users.
                </p>
              </div>
              {taskNotice && (
                <span className="text-xs font-bold text-emerald-700">{taskNotice}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Task / Homework Title *
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Solve 20 Trigonometry Questions from NCERT Ex 8.4"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={taskSubject}
                  onChange={(e) => setTaskSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Submission Time *
                </label>
                <input
                  type="text"
                  required
                  value={taskDueTime}
                  onChange={(e) => setTaskDueTime(e.target.value)}
                  placeholder="05:00 PM"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Max Marks
                </label>
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={taskMarks}
                  onChange={(e) => setTaskMarks(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Task Instructions &amp; Questions *
              </label>
              <textarea
                rows={3}
                required
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Write step-by-step instructions or questions for students..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold uppercase text-white bg-[#084d75] hover:bg-[#063a58] rounded-lg cursor-pointer"
            >
              Publish Task to All Subscribed Users
            </button>
          </form>

          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
              All Shared Classroom Tasks (Teacher &amp; Student Uploads — {tutorTasks.length})
            </h3>
            {tutorTasks.map((tItem) => (
              <div
                key={tItem.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span
                    className={`px-2.5 py-0.5 rounded font-bold ${
                      tItem.uploadedByRole === 'TUTOR'
                        ? 'bg-[#084d75] text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    Uploaded by {tItem.uploadedByName}
                  </span>
                  <span className="font-mono text-slate-500">
                    Due: {tItem.dueDate} at {tItem.dueTime} · Max Marks: {tItem.maxMarks}
                  </span>
                </div>
                <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  {tItem.title} ({tItem.subject})
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">{tItem.description}</p>
                {tItem.studentSubmissions.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                    <p className="text-[11px] font-bold text-emerald-700">
                      ✓ Student Submissions ({tItem.studentSubmissions.length}):
                    </p>
                    {tItem.studentSubmissions.map((sub, idx) => (
                      <p key={idx} className="text-xs text-slate-600">
                        <strong>{sub.studentName}:</strong> &ldquo;{sub.answerText}&rdquo; ({sub.submittedAt})
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: TIME & BATCH SCHEDULE MANAGER ==================== */}
      {activeTab === 'schedule' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#084d75]" />
                <span>Manage Your Teaching Time &amp; Batch Schedule</span>
              </h2>
              <p className="text-xs text-slate-500">
                Add or update your available home tuition and online class batch timings from your Teacher ID.
              </p>
            </div>
            {saveMessage && (
              <span className="text-xs font-bold text-emerald-700">{saveMessage}</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Primary Preferred Teaching Time
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 rounded-lg"
              >
                <option value="AnyTime">AnyTime (Morning + Afternoon + Evening)</option>
                <option value="Morning (6 AM - 12 PM)">Morning (6 AM - 12 PM)</option>
                <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                <option value="Evening (4 PM - 9 PM)">Evening (4 PM - 9 PM)</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Add New Batch Time Slot
                </label>
                <input
                  type="text"
                  value={newSlotText}
                  onChange={(e) => setNewSlotText(e.target.value)}
                  placeholder="e.g. 07:30 PM - 09:00 PM (Night Doubt Batch)"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 rounded-lg"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!newSlotText.trim()) return;
                  setBatchSlots((prev) => [...prev, newSlotText.trim()]);
                  setNewSlotText('');
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#ff6600] rounded-lg cursor-pointer"
              >
                + Add Slot
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Active Batch Time Slots ({batchSlots.length}):
            </p>
            {batchSlots.map((slot, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between text-xs"
              >
                <span className="font-mono font-semibold text-[#084d75] dark:text-amber-300">
                  ⏰ {slot}
                </span>
                <button
                  type="button"
                  onClick={() => setBatchSlots((prev) => prev.filter((_, i) => i !== idx))}
                  className="text-red-600 hover:underline font-bold"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSaveProfile}
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#084d75] hover:bg-[#063a58] rounded-lg cursor-pointer"
          >
            Save Time Schedule to My Teacher ID
          </button>
        </div>
      )}

      {/* ==================== TAB 5: CONFIDENTIAL BANK ACCOUNT & ADMIN PAYOUTS ==================== */}
      {activeTab === 'bank' && (
        <div className="space-y-6">
          <form
            onSubmit={handleSaveBankDetails}
            className="bg-slate-900 text-white border-2 border-amber-400 rounded-xl p-6 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase text-emerald-400">
                  <Lock className="w-3.5 h-3.5" />
                  Strictly Confidential — Visible ONLY to Owner Admin &amp; You
                </span>
                <h2 className="font-display text-lg font-bold text-amber-300 mt-0.5">
                  Teacher Bank Account Details for Direct Tuition Payouts
                </h2>
                <p className="text-xs text-slate-300">
                  The Owner Admin transfers your monthly student tuition fees directly to this bank account. Your Account Number and IFSC Code are completely hidden from students and public visitors.
                </p>
              </div>
            </div>

            {bankSavedNotice && (
              <div className="p-3 bg-emerald-950 border border-emerald-500 rounded-lg text-xs font-bold text-emerald-300">
                {bankSavedNotice}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  required
                  value={bankAccountHolder}
                  onChange={(e) => setBankAccountHolder(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Bank Name &amp; Branch *
                </label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. State Bank of India, Danapur Branch"
                  className="w-full px-3 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Bank Account Number *
                </label>
                <input
                  type="text"
                  required
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="e.g. 38941205541"
                  className="w-full px-3 py-2 font-mono font-bold text-amber-300 bg-slate-800 border border-slate-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  IFSC Code *
                </label>
                <input
                  type="text"
                  required
                  value={bankIfscCode}
                  onChange={(e) => setBankIfscCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SBIN0001521"
                  className="w-full px-3 py-2 font-mono font-bold uppercase text-emerald-300 bg-slate-800 border border-slate-700 rounded-lg"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-slate-300 mb-1">
                UPI ID (Optional)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="teacher@sbi"
                className="w-full px-3 py-2 font-mono bg-slate-800 text-white border border-slate-700 rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold uppercase text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg cursor-pointer"
            >
              Save Confidential Bank Account Details
            </button>
          </form>

          {/* Payouts Received from Admin */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
              Tuition Fee Payouts Transferred to Your Bank Account by Admin ({myPayouts.length})
            </h3>
            {myPayouts.length === 0 ? (
              <p className="text-xs text-slate-500">
                No bank payouts recorded yet. Once the Admin releases your monthly tuition payout, the UTR reference will appear here.
              </p>
            ) : (
              <div className="space-y-2.5">
                {myPayouts.map((pay) => (
                  <div
                    key={pay.id}
                    className="p-4 bg-emerald-50/60 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{pay.monthLabel}</p>
                      <p className="text-slate-600 dark:text-slate-300 font-mono mt-0.5">
                        Bank: {pay.bankName} · A/C: {pay.bankAccountNumber} · IFSC: {pay.bankIfscCode}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        UTR Ref: {pay.utrNumber} · Paid on {pay.paidAt.slice(0, 10)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-lg font-bold text-emerald-700">
                        ₹{pay.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[10px] font-bold uppercase text-emerald-800">
                        ✓ CREDITED TO BANK
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 6: EDIT PUBLIC PROFILE & MONTHLY FEE ==================== */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                Edit Public Tutor Profile, Monthly Fee, Course Months &amp; Bihar Location
              </h2>
              <p className="text-xs text-slate-500">
                Set your own Monthly Tuition Fee, Course Duration in Months (Kitna Month Lena Hai), Block, Pin Code, and Full Address.
              </p>
            </div>
            {saveMessage && (
              <span className="text-xs font-bold text-emerald-700">{saveMessage}</span>
            )}
          </div>

          {/* TEACHER PROFILE PHOTO UPLOAD & PREVIEW */}
          <div className="p-4 bg-blue-50/70 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={avatarUrl || tutor.photoUrl || tutor.avatarUrl}
                alt={name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#084d75]"
              />
              <div>
                <h3 className="font-display text-sm font-bold text-[#084d75] dark:text-amber-300">
                  👨‍🏫 Teacher Profile Photo (शिक्षक अपना फोटो बदलें / अपलोड करें)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Your uploaded photo is shown on all Home Page tutor cards and your full profile page.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="px-3.5 py-2 rounded-lg bg-[#084d75] hover:bg-[#063a58] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photo from Device</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const compressed = await readAndCompressImageFile(file, 360);
                    setAvatarUrl(compressed);
                  }}
                />
              </label>
              <input
                type="text"
                value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Or paste photo URL..."
                className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 rounded-lg w-48"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-amber-50/80 dark:bg-slate-800 border border-amber-300 rounded-xl">
            <div>
              <label className="block text-xs font-bold text-[#084d75] dark:text-amber-300 mb-1">
                Your Monthly Tuition Fee (₹ / Month) *
              </label>
              <input
                type="number"
                min={200}
                max={50000}
                step={100}
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono font-bold text-[#e66000] bg-white border border-amber-400 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#084d75] dark:text-amber-300 mb-1">
                Course Duration in Months (Kitna Month Lena Hai) *
              </label>
              <input
                type="number"
                min={1}
                max={36}
                value={minDurationMonths}
                onChange={(e) => setMinDurationMonths(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono font-bold text-[#084d75] bg-white border border-amber-400 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Hourly / Demo Class Rate (₹ / Hr)
              </label>
              <input
                type="number"
                min={50}
                max={10000}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono font-bold bg-white border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Qualifications</label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Experience (Years)</label>
              <input
                type="number"
                min={0}
                max={50}
                value={experienceYrs}
                onChange={(e) => setExperienceYrs(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">State</label>
              <input
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Bihar District (All 38 Districts)
              </label>
              <select
                value={cityId}
                onChange={(e) => {
                  const nextId = e.target.value;
                  setCityId(nextId);
                  const dist = BIHAR_ALL_38_DISTRICTS.find((d) => d.id === nextId);
                  if (dist) {
                    const firstBlk = Array.isArray(dist.sampleBlocks)
                      ? dist.sampleBlocks[0]
                      : String(dist.sampleBlocks).split(',')[0]?.trim();
                    setBlockName(firstBlk || dist.name);
                    setLocalityName(`${dist.name} Main Road`);
                    setPincode(dist.defaultPincode);
                  }
                }}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
              >
                {BIHAR_ALL_38_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Block (प्रखंड / Block)
              </label>
              <input
                type="text"
                value={blockName}
                onChange={(e) => setBlockName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Locality / Area / Village
              </label>
              <input
                type="text"
                value={localityName}
                onChange={(e) => setLocalityName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                6-Digit Pin Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono font-bold border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Complete Street / Village Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Academic Biography &amp; Methodology
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-800 rounded-lg hover:bg-blue-900 inline-flex items-center gap-2 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>Save Tutor Profile &amp; Monthly Fee</span>
            </button>
          </div>
        </form>
      )}

      {/* ==================== TAB 7: INQUIRIES ==================== */}
      {activeTab === 'inquiries' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="font-display text-base font-semibold text-slate-900 mb-4">
            Student &amp; Parent Inquiries ({tutorInquiries.length})
          </h2>
          {tutorInquiries.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">No inquiries received yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {tutorInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-900">{inq.name}</span>
                      <span>·</span>
                      <span className="font-mono">{inq.mobile}</span>
                      <span>·</span>
                      <span>{inq.email}</span>
                      <span>·</span>
                      <span>Status: {inq.status}</span>
                    </div>
                    <p className="text-sm text-slate-700 mt-1.5">{inq.message}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onUpdateInquiryStatus(inq.id, 'REPLIED')}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-900"
                    >
                      Mark Replied
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateInquiryStatus(inq.id, 'CLOSED')}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 8: MEMBERSHIP PLAN ==================== */}
      {activeTab === 'plan' && (
        <div className="space-y-4">
          {paymentSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{paymentSuccess}</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs text-slate-500">{plan.audience}</p>
                  <h3 className="font-display text-lg font-bold text-slate-900 mt-1">
                    {plan.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1 tabular-nums">
                    <span className="font-mono text-2xl font-bold text-slate-900">
                      ₹{plan.price}
                    </span>
                    <span className="text-xs text-slate-500">/ {plan.durationDays} days</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  disabled={payingPlanId === plan.id || plan.price === 0}
                  onClick={() => handlePlanCheckout(plan)}
                  className="mt-6 w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-500 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  {payingPlanId === plan.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying Razorpay Order...</span>
                    </>
                  ) : plan.price === 0 ? (
                    <span>Included Base Plan</span>
                  ) : (
                    <>
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Upgrade via Razorpay (₹{plan.price})</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IN-PANEL INTERACTIVE LIVE CLASSROOM MODAL (ZOOM / GOOGLE CLASSROOM EMBED) */}
      {activeInAppClass && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-2xl max-w-4xl w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded bg-red-600 text-white text-xs font-bold animate-pulse">
                  🔴 LIVE CLASSROOM ACTIVE
                </span>
                <div>
                  <h3 className="font-display text-base font-bold">{activeInAppClass.title}</h3>
                  <p className="text-xs text-slate-400">
                    Host: {tutor.name} · Platform: {activeInAppClass.platform} · Meeting ID: {activeInAppClass.meetingId}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveInAppClass(null)}
                className="px-3 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
              >
                End / Leave Class
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center min-h-[260px] text-center space-y-3">
                <Video className="w-12 h-12 text-amber-400" />
                <p className="text-base font-bold">
                  {activeInAppClass.platform.replace('_', ' ')} Live Stream &amp; Whiteboard Ready
                </p>
                <p className="text-xs text-slate-400 max-w-md">
                  {activeLoginCount} subscribed students are currently Login Active. Mark Present/Absent on the right or launch the external {activeInAppClass.platform} window.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href={activeInAppClass.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg inline-flex items-center gap-1.5"
                  >
                    <span>Open Full {activeInAppClass.platform} App Window</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      onBroadcastOnlineClass(activeInAppClass.id, ['WHATSAPP', 'SMS', 'EMAIL']);
                    }}
                    className="px-4 py-2 text-xs font-bold bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Remind All Students on WhatsApp/SMS/Email</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-amber-300 uppercase">
                  Live Student Attendance ({myStudents.length})
                </p>
                <div className="space-y-2 max-h-[230px] overflow-y-auto">
                  {myStudents.map((s) => (
                    <div
                      key={s.id}
                      className="p-2.5 bg-slate-900 rounded-lg flex items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <p className="font-bold">{s.studentName}</p>
                        <p className="text-[10px] text-slate-400">
                          {s.isLoginActive ? '🟢 Login Active' : '⚪ Offline'} · {s.attendanceToday}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onMarkAttendance(s.id, 'PRESENT')}
                          className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                            s.attendanceToday === 'PRESENT'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          P
                        </button>
                        <button
                          type="button"
                          onClick={() => onMarkAttendance(s.id, 'ABSENT')}
                          className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                            s.attendanceToday === 'ABSENT'
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          A
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
};

interface StudentDashboardProps {
  currentUser: { uid: string; name: string; email: string; mobile: string; avatarUrl?: string };
  savedTutorIds: string[];
  tutors: TutorItem[];
  requirements: RequirementItem[];
  inquiries: InquiryItem[];
  reviews: ReviewItem[];
  cities: CityItem[];
  courses: CourseItem[];
  subscribedStudents: SubscribedStudentItem[];
  onlineClasses: OnlineClassSessionItem[];
  tutorTasks: TutorTaskItem[];
  studentAchievers?: StudentAchieverItem[];
  onPostRequirement: (req: Omit<RequirementItem, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  onSubmitReview: (rev: { tutorId: string; tutorName: string; rating: number; comment: string }) => Promise<void>;
  onSelectTutor: (tutor: TutorItem) => void;
  onRemoveSaved: (tutorId: string) => void;
  onUploadStudentTask: (task: Omit<TutorTaskItem, 'id' | 'createdAt' | 'submittedStudentIds' | 'studentSubmissions'>) => void;
  onSubmitTaskSolution: (taskId: string, answerText: string) => void;
  onUpdateUserPhoto?: (photoUrl: string) => void;
  onAddStudentAchiever?: (achiever: Omit<StudentAchieverItem, 'id'>) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  savedTutorIds,
  tutors,
  requirements,
  inquiries,
  reviews,
  courses,
  subscribedStudents,
  onlineClasses,
  tutorTasks,
  studentAchievers = [],
  onPostRequirement,
  onSubmitReview,
  onSelectTutor,
  onRemoveSaved,
  onUploadStudentTask,
  onSubmitTaskSolution,
  onUpdateUserPhoto,
  onAddStudentAchiever,
}) => {
  const [tab, setTab] = useState<
    'study-mode' | 'my-classes' | 'tasks' | 'nearby' | 'post' | 'saved' | 'history' | 'reviews'
  >('study-mode');
  const [userPhoto, setUserPhoto] = useState<string>(
    currentUser.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  );
  const [preferredStudyMode, setPreferredStudyMode] = useState<'ONLINE' | 'OFFLINE' | 'BOTH'>('ONLINE');
  const [country, setCountry] = useState('India');
  const [stateName, setStateName] = useState('Bihar');
  const [cityId, setCityId] = useState('patna');
  const [blockName, setBlockName] = useState('Danapur');
  const [locality, setLocality] = useState('Danapur Gola Road');
  const [pincode, setPincode] = useState('801503');
  const [fullAddress, setFullAddress] = useState('#102, Main Road, Danapur, Patna, Bihar - 801503');
  const [course, setCourse] = useState(courses[2]?.name || 'Class 9 & 10 (CBSE / ICSE)');
  const [subjectsInput, setSubjectsInput] = useState('Physics, Mathematics');
  const [budget, setBudget] = useState(3500);
  const [reqStudyMode, setReqStudyMode] = useState<'ONLINE' | 'OFFLINE' | 'BOTH'>('ONLINE');
  const [message, setMessage] = useState('');
  const [posting, setPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState('');

  // Student Task Upload & Solution Submission State
  const [stuTaskTitle, setStuTaskTitle] = useState('');
  const [stuTaskSubject, setStuTaskSubject] = useState('Mathematics');
  const [stuTaskDesc, setStuTaskDesc] = useState('');
  const [stuTaskNotice, setStuTaskNotice] = useState('');
  const [solutionTextById, setSolutionTextById] = useState<Record<string, string>>({});

  const [reviewTutorId, setReviewTutorId] = useState(tutors[0]?.id || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewNotice, setReviewNotice] = useState('');

  // Student Achievement & Feedback Form State (Appears on Home Page!)
  const [achTitle, setAchTitle] = useState('');
  const [achScoreBadge, setAchScoreBadge] = useState('96.5% Marks');
  const [achClass, setAchClass] = useState('Class 10 CBSE Board');
  const [achPhoto, setAchPhoto] = useState('');
  const [achFeedback, setAchFeedback] = useState('');
  const [achNotice, setAchNotice] = useState('');

  const savedTutors = tutors.filter((t) => savedTutorIds.includes(t.id));
  const selectedDistrict =
    BIHAR_ALL_38_DISTRICTS.find((d) => d.id === cityId) || BIHAR_ALL_38_DISTRICTS[0];

  const mySubscriptionRecords = subscribedStudents;

  // Tutors filtered by Student's Chosen Study Mode (ONLINE vs OFFLINE vs BOTH)
  const studyModeMatchingTutors = tutors.filter((t) => {
    if (!t.isApproved) return false;
    if (preferredStudyMode === 'ONLINE') {
      return t.tuitionType === 'ONLINE' || Boolean(t.modes?.online);
    }
    if (preferredStudyMode === 'OFFLINE') {
      return (
        t.tuitionType === 'HOME_TUITION' ||
        t.tuitionType === 'AT_TUTOR_HOME' ||
        t.tuitionType === 'AT_INSTITUTE' ||
        Boolean(t.modes?.studentHome) ||
        Boolean(t.modes?.tutorHome) ||
        Boolean(t.modes?.institute)
      );
    }
    return true;
  });

  // Live Nearby Tutors Matching Student's Pin Code, Block, or District
  const nearbyMatchingTutors = tutors.filter((t) => {
    if (!t.isApproved) return false;
    const matchPin = pincode.trim() && (t.pincode || '') === pincode.trim();
    const matchBlock =
      blockName.trim() &&
      ((t.blockName || '').toLowerCase().includes(blockName.trim().toLowerCase()) ||
        t.localityName.toLowerCase().includes(blockName.trim().toLowerCase()));
    const matchDist = t.cityId === cityId;
    return matchPin || matchBlock || matchDist;
  });

  const handleCreateRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    setPostSuccess('');
    try {
      const modeTag =
        reqStudyMode === 'ONLINE'
          ? '[ONLINE STUDY - Zoom/Google Class]'
          : reqStudyMode === 'OFFLINE'
          ? '[OFFLINE HOME TUITION]'
          : '[ONLINE + OFFLINE BOTH]';
      await onPostRequirement({
        userId: currentUser.uid,
        studentName: currentUser.name,
        cityId,
        cityName: selectedDistrict.name,
        locality: `${locality.trim()} (Block: ${blockName.trim()}, Pin: ${pincode.trim()})`,
        course,
        subjects: subjectsInput.trim(),
        budget: Number(budget) || 3000,
        studyMode: reqStudyMode,
        message: `${modeTag} ${
          message.trim() ||
          `Address: ${fullAddress.trim()}, Block ${blockName.trim()}, ${selectedDistrict.name}, ${stateName}, ${country} - ${pincode.trim()}. Subjects: ${subjectsInput}.`
        }`,
      });
      setMessage('');
      setPostSuccess(
        `✓ ${reqStudyMode} Tuition Requirement published for ${locality}, Block ${blockName}, ${selectedDistrict.name} (${pincode})! ${nearbyMatchingTutors.length} matching tutors have been notified.`
      );
    } finally {
      setPosting(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetTutor = tutors.find((t) => t.id === reviewTutorId);
    if (!targetTutor || comment.trim().length < 5) return;
    await onSubmitReview({
      tutorId: targetTutor.id,
      tutorName: targetTutor.name,
      rating,
      comment: comment.trim(),
    });
    setComment('');
    setReviewNotice('Review submitted and published.');
  };

  const studentMenuModules: Array<{
    id: typeof tab;
    num: string;
    label: string;
    badge?: string;
    category: string;
  }> = [
    {
      id: 'study-mode',
      num: '01',
      label: 'Choose Online vs Offline Study',
      badge: preferredStudyMode,
      category: 'Study Mode & Live Classroom',
    },
    {
      id: 'my-classes',
      num: '02',
      label: 'Live Online Classes & Attendance',
      badge: String(onlineClasses.length),
      category: 'Study Mode & Live Classroom',
    },
    {
      id: 'tasks',
      num: '03',
      label: 'Classroom Tasks & Upload Task',
      badge: String(tutorTasks.length),
      category: 'Study Mode & Live Classroom',
    },
    {
      id: 'nearby',
      num: '04',
      label: 'Nearby Tutors (Block & Pin)',
      badge: String(nearbyMatchingTutors.length),
      category: 'Find Tutors & Requirements',
    },
    {
      id: 'post',
      num: '05',
      label: 'Post Requirement (Online/Offline)',
      badge: String(requirements.length),
      category: 'Find Tutors & Requirements',
    },
    {
      id: 'saved',
      num: '06',
      label: 'Saved / Bookmarked Tutors',
      badge: String(savedTutors.length),
      category: 'My Account & Feedback',
    },
    {
      id: 'history',
      num: '07',
      label: 'Sent Inquiries & Responses',
      badge: String(inquiries.length),
      category: 'My Account & Feedback',
    },
    {
      id: 'reviews',
      num: '08',
      label: 'Write & View Tutor Reviews',
      badge: String(reviews.length),
      category: 'My Account & Feedback',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col lg:flex-row bg-[#F4F7FA] dark:bg-slate-950 animate-page-transition">
      {/* 280px STUDENT / USER PANEL LIST-BY-LIST SIDEBAR MENU */}
      <aside className="w-full lg:w-72 shrink-0 bg-gradient-to-b from-[#041e30] via-[#062c47] to-[#083b5c] text-white border-b lg:border-b-0 lg:border-r border-slate-800 p-4 flex flex-col">
        <div className="mb-4 p-3.5 rounded-xl bg-white/10 border border-white/15">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950">
              🎓 Student / User Panel
            </span>
            <span className="text-[11px] font-mono text-emerald-300">🟢 Active</span>
          </div>
          <div className="flex items-center gap-3 mt-2.5">
            <div className="w-12 h-12 rounded-full border-2 border-amber-400 overflow-hidden bg-slate-900 shrink-0">
              <img
                src={userPhoto}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-base font-bold text-white truncate">
                {currentUser.name}
              </h2>
              <p className="text-[11px] text-amber-200 truncate">
                Mode: {preferredStudyMode === 'ONLINE' ? '🖥️ Online Study' : preferredStudyMode === 'OFFLINE' ? '🏠 Offline Home' : '✨ Online + Offline'}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-[11px] text-slate-300 truncate">
              📍 Block {blockName}, {selectedDistrict.name} ({pincode})
            </p>
            <label className="px-2 py-1 rounded bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-amber-200 text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer shrink-0">
              <Camera className="w-3 h-3" />
              <span>Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const compressed = await readAndCompressImageFile(file, 360);
                  setUserPhoto(compressed);
                  onUpdateUserPhoto?.(compressed);
                }}
              />
            </label>
          </div>
        </div>

        <nav aria-label="Student Panel List-by-List Menu" className="space-y-4 flex-1">
          {['Study Mode & Live Classroom', 'Find Tutors & Requirements', 'My Account & Feedback'].map(
            (cat) => (
              <div key={cat} className="space-y-1">
                <p className="px-2.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-300/90">
                  {cat}
                </p>
                <div className="space-y-1">
                  {studentMenuModules
                    .filter((m) => m.category === cat)
                    .map((tItem) => {
                      const isSelected = tab === tItem.id;
                      return (
                        <button
                          key={tItem.id}
                          type="button"
                          onClick={() => setTab(tItem.id)}
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
                              {tItem.num}
                            </span>
                            <span className="truncate">{tItem.label}</span>
                          </div>
                          {tItem.badge && (
                            <span
                              className={`font-mono text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                                isSelected
                                  ? 'bg-white text-slate-950 font-bold'
                                  : 'bg-slate-900/80 text-slate-300'
                              }`}
                            >
                              {tItem.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            )
          )}
        </nav>
      </aside>

      {/* STUDENT / USER PANEL MAIN WORKSPACE */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl">
        <div className="bg-gradient-to-r from-[#084d75] to-[#12689c] text-white rounded-xl p-5 sm:p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase text-amber-300">
                <span>🎓 Student &amp; Parent Portal</span>
                <span>·</span>
                <span className="text-emerald-300">🟢 Login Status: Active</span>
                <span>·</span>
                <span>{selectedDistrict.name}, Bihar, India</span>
              </div>
              <h1 className="font-display text-2xl font-bold mt-1">
                {studentMenuModules.find((m) => m.id === tab)?.num}.{' '}
                {studentMenuModules.find((m) => m.id === tab)?.label}
              </h1>
            </div>

            {/* Quick Top Study Mode Switcher inside Student Panel */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPreferredStudyMode('ONLINE');
                  setTab('study-mode');
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer border ${
                  preferredStudyMode === 'ONLINE'
                    ? 'bg-amber-400 text-slate-950 border-white shadow-xs'
                    : 'bg-white/10 text-white border-white/25 hover:bg-white/20'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>🖥️ Online Padhna Hai</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPreferredStudyMode('OFFLINE');
                  setTab('study-mode');
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer border ${
                  preferredStudyMode === 'OFFLINE'
                    ? 'bg-emerald-400 text-slate-950 border-white shadow-xs'
                    : 'bg-white/10 text-white border-white/25 hover:bg-white/20'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>🏠 Offline Padhna Hai</span>
              </button>
            </div>
          </div>
        </div>

        {/* ==================== TAB 0: CHOOSE ONLINE STUDY VS OFFLINE HOME TUITION ==================== */}
        {tab === 'study-mode' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border-2 border-[#084d75] rounded-2xl p-6 space-y-5 shadow-xs">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#ff6600]">
                  Step 1: Select How You Want to Study
                </span>
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Agar Online Padhna Hai to Online Choose Karein, Aur Offline Padhna Hai to Offline Choose Karein
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Switch anytime between <strong>Live Online Classes (Zoom / Google Classroom)</strong> and <strong>1-on-1 Offline Home Tuition</strong> at your residence in Bihar.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setPreferredStudyMode('ONLINE')}
                  className={`p-5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    preferredStudyMode === 'ONLINE'
                      ? 'border-[#084d75] bg-blue-50/80 dark:bg-slate-800 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-[#084d75] text-white text-xs font-bold">
                      🖥️ ONLINE MODE
                    </span>
                    {preferredStudyMode === 'ONLINE' && (
                      <span className="text-xs font-bold text-emerald-700">✓ Selected</span>
                    )}
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mt-3">
                    Online Padhna Hai (Live Zoom / Google Class)
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Study live from home via Zoom App, Google Classroom, or Google Meet with interactive whiteboard &amp; digital homework.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPreferredStudyMode('OFFLINE')}
                  className={`p-5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    preferredStudyMode === 'OFFLINE'
                      ? 'border-emerald-600 bg-emerald-50/80 dark:bg-slate-800 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-emerald-700 text-white text-xs font-bold">
                      🏠 OFFLINE MODE
                    </span>
                    {preferredStudyMode === 'OFFLINE' && (
                      <span className="text-xs font-bold text-emerald-700">✓ Selected</span>
                    )}
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mt-3">
                    Offline Padhna Hai (Home Tuition at Your House)
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Verified nearby teacher from your Bihar District, Block &amp; Pin Code visits your home or teaches face-to-face.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPreferredStudyMode('BOTH')}
                  className={`p-5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    preferredStudyMode === 'BOTH'
                      ? 'border-[#ff6600] bg-amber-50/80 dark:bg-slate-800 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-[#ff6600] text-white text-xs font-bold">
                      ✨ BOTH MODES
                    </span>
                    {preferredStudyMode === 'BOTH' && (
                      <span className="text-xs font-bold text-emerald-700">✓ Selected</span>
                    )}
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mt-3">
                    Hybrid (Online + Offline Both)
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Combine offline home tuition visits with live online doubt-solving classes before exams.
                  </p>
                </button>
              </div>
            </div>

            {/* Matching Tutors for Student's Selected Mode */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    {preferredStudyMode === 'ONLINE'
                      ? `🖥️ Verified Online Tutors (Zoom / Google Classroom) — ${studyModeMatchingTutors.length} Available`
                      : preferredStudyMode === 'OFFLINE'
                      ? `🏠 Verified Offline Home Tuition Teachers — ${studyModeMatchingTutors.length} Available`
                      : `✨ All Online & Offline Tutors — ${studyModeMatchingTutors.length} Available`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Click any teacher below to view full profile, monthly fee, and unlock phone/WhatsApp or book a demo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setReqStudyMode(preferredStudyMode);
                    setTab('post');
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#ff6600] hover:bg-[#e05500] rounded-lg cursor-pointer"
                >
                  + Post {preferredStudyMode} Tuition Requirement
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studyModeMatchingTutors.slice(0, 8).map((t) => (
                  <div
                    key={t.id}
                    className="p-4 border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            preferredStudyMode === 'ONLINE'
                              ? 'bg-blue-600 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {preferredStudyMode === 'ONLINE'
                            ? '🖥️ Online Zoom / Google'
                            : preferredStudyMode === 'OFFLINE'
                            ? '🏠 Offline Home Tuition'
                            : '✨ Online & Offline'}
                        </span>
                        <span className="text-xs font-bold text-[#084d75] dark:text-amber-300">
                          {t.name} ({t.qualification})
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        📍 {t.localityName}, Block {t.blockName || t.localityName}, {t.cityName} ({t.pincode || '801503'})
                      </p>
                      <p className="text-xs font-bold text-[#e66000]">
                        ₹{(t.monthlyRate || t.hourlyRate * 10).toLocaleString('en-IN')}/Month ({t.minDurationMonths || 3} Months) · ₹{t.hourlyRate}/Hr
                      </p>
                      <p className="text-[11px] text-slate-500">{t.subjects.join(', ')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectTutor(t)}
                      className="px-3.5 py-2 text-xs font-bold text-white bg-[#084d75] hover:bg-[#063a58] rounded-lg shrink-0 cursor-pointer"
                    >
                      Select Tutor →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      {/* ==================== TAB 1: MY LIVE ONLINE CLASSES (ZOOM / GOOGLE CLASSROOM) & ATTENDANCE ==================== */}
      {tab === 'my-classes' && (
        <div className="space-y-6">
          {/* Subscribed Teachers & Daily Attendance Status */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Your Subscribed Teachers &amp; Attendance Record (Present / Absent)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mySubscriptionRecords.slice(0, 2).map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      🟢 Subscribed Teacher: {sub.tutorName}
                    </span>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">
                      {sub.course} — {sub.subjects}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 font-mono">
                      ⏰ Batch Timing: {sub.batchTiming}
                    </p>
                    <p className="text-slate-500">
                      Present: <strong className="text-emerald-700">{sub.presentDaysCount} Days</strong> · Absent:{' '}
                      <strong className="text-red-600">{sub.absentDaysCount} Days</strong>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-3 py-1 rounded-md text-xs font-bold ${
                        sub.attendanceToday === 'PRESENT'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      Today: {sub.attendanceToday}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live & Upcoming Zoom / Google Classroom Sessions */}
          <div className="bg-white dark:bg-slate-900 border-2 border-[#084d75] rounded-xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#ff6600]">
                  Synced Automatically from Your Subscribed Teacher&apos;s Panel
                </span>
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  Live Online Classes (Zoom App &amp; Google Classroom — {onlineClasses.length})
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {onlineClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="p-4 bg-blue-50/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px]">
                        {cls.status === 'LIVE_NOW' ? '🔴 LIVE NOW' : cls.status}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#084d75] text-white font-bold text-[10px]">
                        {cls.platform.replace('_', ' ')}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-white">
                        Teacher: {cls.tutorName}
                      </span>
                      <span className="font-mono text-slate-600 dark:text-slate-300">
                        📅 {cls.scheduledDate} at {cls.scheduledTime}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                      {cls.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      {cls.course} · {cls.subject} · Batch: {cls.batchTiming}
                    </p>
                    <p className="font-mono text-emerald-700 dark:text-emerald-400">
                      Meeting ID: {cls.meetingId} · Passcode: {cls.passcode}
                    </p>
                  </div>

                  <a
                    href={cls.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 text-xs font-bold uppercase text-white bg-[#ff6600] hover:bg-[#e05500] rounded-lg inline-flex items-center gap-2 shrink-0 shadow-xs"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join {cls.platform === 'ZOOM' ? 'Zoom' : 'Google'} Live Class Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: SHARED STUDENT & TEACHER TASKS (UPLOAD YOUR TASK SO ALL USERS SEE IT) ==================== */}
      {tab === 'tasks' && (
        <div className="space-y-6">
          {/* Student Can Upload Their Own Task / Doubt / Assignment Visible to All Users */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!stuTaskTitle.trim() || !stuTaskDesc.trim()) return;
              onUploadStudentTask({
                tutorId: tutors[0]?.id || 'tutor-bihar-1',
                tutorName: tutors[0]?.name || 'Sanjeet',
                uploadedByRole: 'STUDENT',
                uploadedByName: `${currentUser.name} (Student)`,
                title: stuTaskTitle.trim(),
                subject: stuTaskSubject.trim(),
                description: stuTaskDesc.trim(),
                dueDate: '2026-10-27',
                dueTime: '06:00 PM',
                maxMarks: 20,
              });
              setStuTaskTitle('');
              setStuTaskDesc('');
              setStuTaskNotice(
                '✓ Your Task / Assignment has been uploaded and is now visible to all students and your teacher!'
              );
            }}
            className="bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-xl p-6 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span>Upload Your Own Task / Homework / Study Sheet (Visible to All Users &amp; Teacher)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  When you upload a task, doubt question, or study note here, all subscribed users and the teacher can view and solve it together.
                </p>
              </div>
              {stuTaskNotice && (
                <span className="text-xs font-bold text-emerald-700">{stuTaskNotice}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Task / Question Title *
                </label>
                <input
                  type="text"
                  required
                  value={stuTaskTitle}
                  onChange={(e) => setStuTaskTitle(e.target.value)}
                  placeholder="e.g. Important Physics Numerical Sheet — Electricity Chapter"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={stuTaskSubject}
                  onChange={(e) => setStuTaskSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Task Details / Questions / Solution Notes *
              </label>
              <textarea
                rows={3}
                required
                value={stuTaskDesc}
                onChange={(e) => setStuTaskDesc(e.target.value)}
                placeholder="Write the task details or homework questions so all users and the teacher can see it..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold uppercase text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
            >
              Upload Task to Shared Classroom Board
            </button>
          </form>

          {/* Shared Tasks Feed */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
              All Classroom Tasks &amp; Homework ({tutorTasks.length})
            </h3>
            {tutorTasks.map((tItem) => (
              <div
                key={tItem.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span
                    className={`px-2.5 py-0.5 rounded font-bold ${
                      tItem.uploadedByRole === 'TUTOR'
                        ? 'bg-[#084d75] text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    Uploaded by {tItem.uploadedByName}
                  </span>
                  <span className="font-mono text-slate-500">
                    Due: {tItem.dueDate} at {tItem.dueTime} · {tItem.maxMarks} Marks
                  </span>
                </div>
                <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  {tItem.title} ({tItem.subject})
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">{tItem.description}</p>

                {/* Submit Solution */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2 text-xs">
                  <input
                    type="text"
                    value={solutionTextById[tItem.id] || ''}
                    onChange={(e) =>
                      setSolutionTextById((prev) => ({ ...prev, [tItem.id]: e.target.value }))
                    }
                    placeholder="Write your homework answer or completion note..."
                    className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const ans = (solutionTextById[tItem.id] || '').trim();
                      if (!ans) return;
                      onSubmitTaskSolution(tItem.id, ans);
                      setSolutionTextById((prev) => ({ ...prev, [tItem.id]: '' }));
                    }}
                    className="px-4 py-1.5 font-bold text-white bg-[#084d75] rounded-md cursor-pointer"
                  >
                    Submit My Answer
                  </button>
                </div>

                {tItem.studentSubmissions.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                    <p className="font-bold text-emerald-700">
                      Submitted Answers ({tItem.studentSubmissions.length}):
                    </p>
                    {tItem.studentSubmissions.map((sub, i) => (
                      <p key={i} className="text-slate-600 dark:text-slate-300">
                        <strong>{sub.studentName}:</strong> {sub.answerText} ({sub.submittedAt})
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 3: NEARBY REGISTERED TEACHERS ==================== */}
      {tab === 'nearby' && (
        <div className="space-y-5">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-700" />
              <div>
                <h2 className="font-display text-base font-bold text-slate-900">
                  Set Your Exact Bihar District, Block, Pin Code &amp; Address to See Nearby Registered Teachers
                </h2>
                <p className="text-xs text-slate-600">
                  Any teacher registered in your Pin Code, Block, or District appears automatically below.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Bihar District (All 38)
                </label>
                <select
                  value={cityId}
                  onChange={(e) => {
                    setCityId(e.target.value);
                    const found = BIHAR_ALL_38_DISTRICTS.find((d) => d.id === e.target.value);
                    if (found) {
                      const firstBlk = Array.isArray(found.sampleBlocks)
                        ? found.sampleBlocks[0]
                        : String(found.sampleBlocks).split(',')[0]?.trim();
                      setBlockName(firstBlk || found.name);
                      setPincode(found.defaultPincode);
                    }
                  }}
                  className="w-full px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-md"
                >
                  {BIHAR_ALL_38_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Your Block (प्रखंड)
                </label>
                <input
                  type="text"
                  value={blockName}
                  onChange={(e) => setBlockName(e.target.value)}
                  placeholder="e.g. Danapur"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Your Pin Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="801503"
                  className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Locality / Village
                </label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="Gola Road"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="font-display text-base font-bold text-slate-900 mb-4">
              Registered Teachers Near Block {blockName}, {selectedDistrict.name} ({pincode}) — {nearbyMatchingTutors.length} Found
            </h3>

            {nearbyMatchingTutors.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No teachers registered in this exact district yet. Post a tuition requirement in the next tab so nearby teachers can contact you!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyMatchingTutors.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 border border-emerald-200 bg-emerald-50/30 rounded-lg flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded mb-1">
                        📍 Nearby Registered Teacher
                      </span>
                      <p className="font-bold text-sm text-[#084d75]">{t.name}</p>
                      <p className="text-xs text-slate-600">
                        {t.localityName}, Block: {t.blockName || t.localityName}, {t.cityName} - {t.pincode || '801503'}
                      </p>
                      <p className="text-xs font-bold text-[#e66000] mt-0.5">
                        ₹{(t.monthlyRate || t.hourlyRate * 10).toLocaleString('en-IN')}/Month ({t.minDurationMonths || 3} Months) • ₹{t.hourlyRate}/hr
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{t.subjects.join(', ')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectTutor(t)}
                      className="px-3.5 py-2 text-xs font-bold text-white bg-[#ff6600] hover:bg-[#e05500] rounded-md shrink-0 cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: POST TUITION REQUIREMENT ==================== */}
      {tab === 'post' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            onSubmit={handleCreateRequirement}
            className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-blue-800" />
              <h2 className="font-display text-base font-semibold text-slate-900">
                Post a New Home / Online Tuition Requirement (All 38 Bihar Districts)
              </h2>
            </div>

            {postSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-800">
                {postSuccess}
              </div>
            )}

            {/* Explicit Student Online vs Offline Mode Choice inside Post Requirement */}
            <div className="p-4 bg-blue-50/70 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-xl space-y-2">
              <label className="block text-xs font-extrabold text-[#084d75] dark:text-amber-300">
                Choose Tuition Mode (Online Padhna Hai ya Offline?) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setReqStudyMode('ONLINE')}
                  className={`py-2.5 px-3 rounded-lg font-bold border text-center cursor-pointer ${
                    reqStudyMode === 'ONLINE'
                      ? 'bg-[#084d75] text-white border-[#084d75]'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  🖥️ Online Class (Zoom / Google)
                </button>
                <button
                  type="button"
                  onClick={() => setReqStudyMode('OFFLINE')}
                  className={`py-2.5 px-3 rounded-lg font-bold border text-center cursor-pointer ${
                    reqStudyMode === 'OFFLINE'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  🏠 Offline Home Tuition
                </button>
                <button
                  type="button"
                  onClick={() => setReqStudyMode('BOTH')}
                  className={`py-2.5 px-3 rounded-lg font-bold border text-center cursor-pointer ${
                    reqStudyMode === 'BOTH'
                      ? 'bg-[#ff6600] text-white border-[#ff6600]'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  ✨ Both (Online + Offline)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Country *</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Bihar District (All 38) *
                </label>
                <select
                  value={cityId}
                  onChange={(e) => {
                    setCityId(e.target.value);
                    const d = BIHAR_ALL_38_DISTRICTS.find((item) => item.id === e.target.value);
                    if (d) {
                      const firstBlk = Array.isArray(d.sampleBlocks)
                        ? d.sampleBlocks[0]
                        : String(d.sampleBlocks).split(',')[0]?.trim();
                      setBlockName(firstBlk || d.name);
                      setPincode(d.defaultPincode);
                    }
                  }}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                >
                  {BIHAR_ALL_38_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Enter Your Block (प्रखंड) *
                </label>
                <input
                  type="text"
                  required
                  value={blockName}
                  onChange={(e) => setBlockName(e.target.value)}
                  placeholder="e.g. Danapur"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Locality / Village *
                </label>
                <input
                  type="text"
                  required
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Gola Road"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  6-Digit Pin Code *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="801503"
                  className="w-full px-3 py-2 text-sm font-mono font-bold border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Complete Home / Street Address *
              </label>
              <input
                type="text"
                required
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="House No., Street, Landmark, Block, District, Pin Code"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Class / Course *
                </label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Monthly Budget (₹) *
                </label>
                <input
                  type="number"
                  min={500}
                  max={50000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Subjects Required *
              </label>
              <input
                type="text"
                required
                value={subjectsInput}
                onChange={(e) => setSubjectsInput(e.target.value)}
                placeholder="e.g. Mathematics, Physics, Chemistry"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Specific Timing &amp; Tutor Preferences *
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe preferred days per week, board (CBSE/ICSE/BSEB), and preferred time slot..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={posting}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-800 rounded-lg hover:bg-blue-900 inline-flex items-center gap-2 cursor-pointer"
            >
              {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>Publish Tuition Requirement</span>
            </button>
          </form>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="font-display text-base font-semibold text-slate-900">
              Your Posted Requirements ({requirements.length})
            </h3>
            <div className="space-y-3">
              {requirements.map((req) => (
                <div key={req.id} className="p-3.5 border border-slate-200 rounded-lg space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {req.cityName} · {req.locality}
                    </span>
                    <span className="font-mono font-semibold text-slate-900">₹{req.budget}/mo</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900">
                    {req.course} — {req.subjects}
                  </p>
                  <p className="text-xs text-slate-600">{req.message}</p>
                  <p className="text-xs text-blue-800 font-medium pt-1">
                    Status: {req.status}
                    {req.assignedTutorName ? ` · Assigned to ${req.assignedTutorName}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 5: SAVED TUTORS ==================== */}
      {tab === 'saved' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="font-display text-base font-semibold text-slate-900 mb-4">
            Bookmarked Home Tutors ({savedTutors.length})
          </h2>
          {savedTutors.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">
              You haven&apos;t bookmarked any tutors yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedTutors.map((t) => (
                <div
                  key={t.id}
                  className="p-4 border border-slate-200 rounded-lg flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-xs text-slate-500">
                      {t.cityName} · {t.localityName} · ₹{t.monthlyRate || t.hourlyRate * 10}/Mo (₹{t.hourlyRate}/hr)
                    </p>
                    <button
                      type="button"
                      onClick={() => onSelectTutor(t)}
                      className="font-display text-sm font-semibold text-slate-900 hover:text-blue-800"
                    >
                      {t.name}
                    </button>
                    <p className="text-xs text-slate-600">{t.subjects.join(' · ')}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveSaved(t.id)}
                    className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 6: CONTACT HISTORY ==================== */}
      {tab === 'history' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="font-display text-base font-semibold text-slate-900 mb-4">
            Sent Inquiries &amp; Tutor Responses
          </h2>
          <div className="divide-y divide-slate-100">
            {inquiries.map((inq) => (
              <div key={inq.id} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-500">
                    To: <span className="font-semibold text-slate-900">{inq.tutorName}</span> · Status:{' '}
                    <span className="font-medium text-blue-800">{inq.status}</span>
                  </p>
                  <p className="text-sm text-slate-700 mt-1">{inq.message}</p>
                </div>
                <span className="text-xs font-mono text-slate-400 shrink-0">
                  {inq.createdAt.slice(0, 10)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 7: REVIEWS & STUDENT ACHIEVEMENT SHOWCASE ==================== */}
      {tab === 'reviews' && (
        <div className="space-y-6">
          {/* Student Achievement & Feedback Upload (Shows on Home Page to Everyone!) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!achTitle.trim() || !achFeedback.trim()) return;
              const targetTutor = tutors.find((t) => t.id === reviewTutorId) || tutors[0];
              onAddStudentAchiever?.({
                studentName: currentUser.name,
                studentPhoto: achPhoto.trim() || userPhoto,
                districtName: selectedDistrict.name,
                blockName: blockName.trim() || 'Patna Sadar',
                className: achClass.trim() || course,
                achievementTitle: achTitle.trim(),
                scoreBadge: achScoreBadge.trim() || 'Star Achiever',
                tutorId: targetTutor?.id,
                tutorName: targetTutor?.name || 'Sanjeet',
                studyMode: preferredStudyMode,
                feedbackText: achFeedback.trim(),
                rating,
                achievedDate: new Date().toISOString().slice(0, 10),
                isApproved: true,
                isFeatured: true,
              });
              setAchTitle('');
              setAchFeedback('');
              setAchNotice(
                '🎉 Congratulations! Your Achievement, Photo & Feedback have been published on the Home Page for everyone to see!'
              );
            }}
            className="bg-gradient-to-r from-amber-50 via-white to-emerald-50 border-2 border-amber-400 rounded-xl p-6 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#ff6600]" />
                <h2 className="font-display text-base font-bold text-[#084d75]">
                  🏆 Share Your Exam Achievement, Photo &amp; Feedback on Home Page (अपनी उपलब्धि और फीडबैक होम पेज पर दिखाएं)
                </h2>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-emerald-600 text-white">
                Visible on Home Page ({studentAchievers.length} Achievers)
              </span>
            </div>

            {achNotice && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-900">
                {achNotice}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Exam / Class (e.g. Class 10 CBSE, JEE, NEET) *
                </label>
                <input
                  type="text"
                  required
                  value={achClass}
                  onChange={(e) => setAchClass(e.target.value)}
                  placeholder="e.g. Class 10 CBSE Board"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Score / Rank Badge (e.g. 97.4% Marks, AIR 450) *
                </label>
                <input
                  type="text"
                  required
                  value={achScoreBadge}
                  onChange={(e) => setAchScoreBadge(e.target.value)}
                  placeholder="e.g. 97.4% Marks"
                  className="w-full px-3 py-2 text-xs font-bold text-[#e66000] bg-white border border-amber-400 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mentored By Teacher *
                </label>
                <select
                  value={reviewTutorId}
                  onChange={(e) => setReviewTutorId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                >
                  {tutors.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.cityName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Achievement Details (क्या उपलब्धि हासिल की?) *
                </label>
                <input
                  type="text"
                  required
                  value={achTitle}
                  onChange={(e) => setAchTitle(e.target.value)}
                  placeholder="e.g. Scored 97.4% in Class 10 Board Exam (100/100 in Maths)"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload Your Photo (अपना फोटो डालें)
                </label>
                <div className="flex items-center gap-2">
                  <img
                    src={achPhoto || userPhoto}
                    alt="Student preview"
                    className="w-9 h-9 rounded-full object-cover border border-[#084d75] shrink-0"
                  />
                  <label className="px-3 py-1.5 rounded-lg bg-[#084d75] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shrink-0">
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
                        setAchPhoto(compressed);
                        setUserPhoto(compressed);
                        onUpdateUserPhoto?.(compressed);
                      }}
                    />
                  </label>
                  <input
                    type="text"
                    value={achPhoto.startsWith('data:') ? '' : achPhoto}
                    onChange={(e) => setAchPhoto(e.target.value)}
                    placeholder="Or paste photo URL..."
                    className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Feedback &amp; Experience (आपका फीडबैक जो होम पेज पर दिखेगा) *
              </label>
              <textarea
                rows={2}
                required
                value={achFeedback}
                onChange={(e) => setAchFeedback(e.target.value)}
                placeholder="Write how your teacher helped you achieve this score..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#ff6600] hover:bg-[#e05500] rounded-lg inline-flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Publish Achievement &amp; Feedback on Home Page</span>
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={handleAddReview} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="font-display text-base font-semibold text-slate-900">
              Write a Verified Tutor Review
            </h2>
            {reviewNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                {reviewNotice}
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Select Tutor</label>
              <select
                value={reviewTutorId}
                onChange={(e) => setReviewTutorId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
              >
                {tutors.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.cityName})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Rating (1 to 5)</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg bg-white"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Stars
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Detailed Feedback *
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share concrete improvements in conceptual clarity and exam scores..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-800 rounded-lg hover:bg-blue-900"
            >
              Submit Review
            </button>
          </form>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <h3 className="font-display text-base font-semibold text-slate-900">
              Recent Reviews
            </h3>
            {reviews.map((r) => (
              <div key={r.id} className="p-3.5 border border-slate-200 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-900">{r.tutorName}</span>
                  <span className="font-mono text-amber-600">{r.rating}.0 / 5.0</span>
                </div>
                <p className="text-xs text-slate-600">{r.comment}</p>
                <p className="text-[11px] text-slate-400">
                  By {r.reviewerName} · {r.isApproved ? 'Approved' : 'Pending Approval'}
                </p>
              </div>
            ))}
          </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
};
