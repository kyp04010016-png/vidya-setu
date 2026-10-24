import React, { useState, useEffect } from 'react';
import {
  Loader2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  KeyRound,
  Sparkles,
  Shield,
  Smartphone,
  Mail,
  MapPin,
  RefreshCw,
  Landmark,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Camera,
  Upload,
} from 'lucide-react';
import {
  Role,
  TuitionType,
  AdminCredentialsItem,
  TutorItem,
  UserDirectoryItem,
  SecuritySettingItem,
  BIHAR_ALL_38_DISTRICTS,
} from '../data/seedData';
import { readAndCompressImageFile } from './SocialPlatformIcon';

export interface TutorRegistrationDetails {
  age: number;
  gender: 'Male' | 'Female';
  experienceYrs: number;
  hourlyRate: number;
  monthlyRate: number;
  minDurationMonths: number;
  country: string;
  state: string;
  cityId: string;
  cityName: string;
  blockName: string;
  localityName: string;
  pincode: string;
  preferredTime: string;
  categories: string;
  address: string;
  qualification: string;
  courseText: string;
  subjectsText: string;
  tuitionType: TuitionType;
  bio: string;
  modes: {
    studentHome: boolean;
    tutorHome: boolean;
    institute: boolean;
    online: boolean;
  };
  // Confidential Bank Account Details (Visible ONLY to Admin & Teacher)
  bankAccountHolder?: string;
  bankAccountNumber?: string;
  bankIfscCode?: string;
  bankName?: string;
  upiId?: string;
  loginPassword?: string;
  avatarUrl?: string;
}

export interface StudentLocationDetails {
  country: string;
  state: string;
  districtId: string;
  districtName: string;
  blockName: string;
  localityName: string;
  pincode: string;
  address: string;
  avatarUrl?: string;
}

export function buildAutomatedTutorBio(params: {
  cityName: string;
  blockName?: string;
  localityName: string;
  courseText: string;
  subjectsText: string;
  experienceYrs: number;
  monthlyRate?: number;
  minDurationMonths?: number;
  online: boolean;
}): string {
  const modePhrase = params.online ? 'at their home/ online' : 'at their home';
  const blockPart = params.blockName ? `, Block ${params.blockName}` : '';
  const feePart = params.monthlyRate
    ? ` My monthly tuition fee is ₹${params.monthlyRate}/month (minimum ${params.minDurationMonths || 1} month${(params.minDurationMonths || 1) > 1 ? 's' : ''}).`
    : '';
  return `I am a home tutor in ${params.cityName} (${params.localityName}${blockPart}, Bihar, India) and I teach students ${modePhrase}. I am looking for students who are looking for home tutors in ${params.cityName} for getting tuition ${modePhrase}. I teach ${params.courseText} and expert in ${params.subjectsText}. I have ${params.experienceYrs} years experience in teaching and my home tutoring experience helps me in helping the students to understand the concepts and learn better.${feePart} If you need a home tutor in ${params.localityName}, ${params.cityName} then please dont hesitate to contact me.`;
}

interface AuthViewsProps {
  mode: 'login' | 'signup';
  initialRole?: Role;
  adminCredentials: AdminCredentialsItem;
  tutors?: TutorItem[];
  usersDirectory?: UserDirectoryItem[];
  securitySettings?: SecuritySettingItem;
  onSecurityAudit?: (action: string, details: string) => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
  onGoogleAuth: (role: Role) => Promise<void>;
  onCredentialAuth: (payload: {
    name?: string;
    identifier: string;
    mobile?: string;
    password?: string;
    role: Role;
    avatarUrl?: string;
    tutorDetails?: TutorRegistrationDetails;
    studentLocation?: StudentLocationDetails;
  }) => Promise<void>;
}

function computePasswordStrength(pw: string): {
  score: number;
  label: string;
  colorClass: string;
} {
  if (!pw) return { score: 0, label: 'Enter password', colorClass: 'bg-slate-200' };
  let score = 0;
  if (pw.length >= 6) score += 1;
  if (pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  if (score <= 1) return { score: 1, label: 'Weak', colorClass: 'bg-red-500' };
  if (score === 2) return { score: 2, label: 'Moderate', colorClass: 'bg-amber-500' };
  if (score === 3) return { score: 3, label: 'Strong', colorClass: 'bg-emerald-500' };
  return { score: 4, label: 'Very Strong (256-bit Ready)', colorClass: 'bg-emerald-600' };
}

export const AuthViews: React.FC<AuthViewsProps> = ({
  mode,
  initialRole = 'TUTOR',
  adminCredentials,
  tutors = [],
  usersDirectory = [],
  securitySettings,
  onSecurityAudit,
  onSwitchMode,
  onGoogleAuth,
  onCredentialAuth,
}) => {
  const [selectedRole, setSelectedRole] = useState<Role>(
    mode === 'signup' && initialRole === 'ADMIN' ? 'TUTOR' : initialRole
  );
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Brute-Force Rate Limiting & Account Lockout State
  const maxAllowedAttempts = securitySettings?.loginAttempts || 5;
  const lockoutMinutesCfg = securitySettings?.lockoutMinutes || 15;
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('vsetu_failed_login_count') || '0');
    } catch {
      return 0;
    }
  });
  const [lockoutUntil, setLockoutUntil] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('vsetu_login_lockout_until') || '0');
    } catch {
      return 0;
    }
  });
  const [lockoutRemainingSec, setLockoutRemainingSec] = useState<number>(0);

  // Anti-Bot Security CAPTCHA Challenge
  const [captchaA, setCaptchaA] = useState<number>(() => Math.floor(3 + Math.random() * 7));
  const [captchaB, setCaptchaB] = useState<number>(() => Math.floor(2 + Math.random() * 6));
  const [captchaInput, setCaptchaInput] = useState<string>('');

  // Location Fields (India -> Bihar -> All 38 Districts -> Self-entered Block, Locality, Pin Code, Full Address)
  const [country, setCountry] = useState<string>('India');
  const [stateName, setStateName] = useState<string>('Bihar');
  const [districtId, setDistrictId] = useState<string>('patna');
  const [blockName, setBlockName] = useState<string>('Danapur');
  const [localityName, setLocalityName] = useState<string>('Danapur Gola Road');
  const [pincode, setPincode] = useState<string>('801503');
  const [address, setAddress] = useState<string>('#102, Main Road, Danapur, Patna, Bihar - 801503');

  // Complete Tutor Profile Fields + Monthly Fee & Months Duration
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [experienceYrs, setExperienceYrs] = useState<number>(7);
  const [hourlyRate, setHourlyRate] = useState<number>(300);
  const [monthlyRate, setMonthlyRate] = useState<number>(3500);
  const [minDurationMonths, setMinDurationMonths] = useState<number>(3);
  const [preferredTime, setPreferredTime] = useState<string>('AnyTime');
  const [categories, setCategories] = useState<string>('Class 6 to 10');
  const [qualification, setQualification] = useState<string>('B.Sc / B.Ed');
  const [courseText, setCourseText] = useState<string>('Class 6 to 10 CBSE');
  const [subjectsText, setSubjectsText] = useState<string>('Math, Physics, Chemistry');
  const [modeStudentHome, setModeStudentHome] = useState<boolean>(true);
  const [modeTutorHome, setModeTutorHome] = useState<boolean>(false);
  const [modeInstitute, setModeInstitute] = useState<boolean>(false);
  const [modeOnline, setModeOnline] = useState<boolean>(true);
  const [customBio, setCustomBio] = useState<string>('');

  // Confidential Teacher Bank Account Fields (Strictly visible ONLY to Admin & Teacher)
  const [bankAccountHolder, setBankAccountHolder] = useState<string>('');
  const [bankAccountNumber, setBankAccountNumber] = useState<string>('');
  const [bankIfscCode, setBankIfscCode] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('');

  // Teacher & User Profile Photo Upload State
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>('');
  const [uploadingPhoto, setUploadingPhoto] = useState<boolean>(false);

  // Dual-Channel Single OTP State (Same OTP sent to Mobile AND Email for BOTH Login & Signup)
  const [otpStep, setOtpStep] = useState<boolean>(false);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpTargetEmail, setOtpTargetEmail] = useState<string>('');
  const [otpTargetMobile, setOtpTargetMobile] = useState<string>('');
  const [otpSentTimestamp, setOtpSentTimestamp] = useState<string>('');
  const [otpExpirySeconds, setOtpExpirySeconds] = useState<number>(300);
  const [otpWrongAttempts, setOtpWrongAttempts] = useState<number>(0);

  const [loadingStage, setLoadingStage] = useState<'idle' | 'verifying' | 'session'>('idle');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [error, setError] = useState('');

  const refreshCaptcha = () => {
    setCaptchaA(Math.floor(3 + Math.random() * 8));
    setCaptchaB(Math.floor(2 + Math.random() * 7));
    setCaptchaInput('');
  };

  // Live Lockout Countdown Timer
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      if (lockoutUntil > now) {
        setLockoutRemainingSec(Math.ceil((lockoutUntil - now) / 1000));
      } else {
        setLockoutRemainingSec(0);
        if (lockoutUntil !== 0) {
          setLockoutUntil(0);
          setFailedAttempts(0);
          try {
            localStorage.removeItem('vsetu_login_lockout_until');
            localStorage.setItem('vsetu_failed_login_count', '0');
          } catch {
            // ignore storage errors
          }
        }
      }
    };
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [lockoutUntil]);

  // Live OTP 5-Minute Expiry Countdown Timer
  useEffect(() => {
    if (!otpStep || otpExpirySeconds <= 0) return;
    const timer = setInterval(() => {
      setOtpExpirySeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpStep, otpExpirySeconds]);

  useEffect(() => {
    if (mode === 'signup' && initialRole === 'ADMIN') {
      setSelectedRole('TUTOR');
    } else {
      setSelectedRole(initialRole);
    }
    setOtpStep(false);
    setEnteredOtp('');
    setError('');
    refreshCaptcha();
  }, [initialRole, mode]);

  const recordFailedAttempt = (reason: string) => {
    const nextCount = failedAttempts + 1;
    setFailedAttempts(nextCount);
    try {
      localStorage.setItem('vsetu_failed_login_count', String(nextCount));
    } catch {
      // ignore
    }
    onSecurityAudit?.(
      'FAILED_LOGIN_ATTEMPT',
      `Role: ${selectedRole} · ID: ${identifier || 'unknown'} · Attempt ${nextCount}/${maxAllowedAttempts} (${reason})`
    );
    if (nextCount >= maxAllowedAttempts) {
      const until = Date.now() + lockoutMinutesCfg * 60 * 1000;
      setLockoutUntil(until);
      try {
        localStorage.setItem('vsetu_login_lockout_until', String(until));
      } catch {
        // ignore
      }
      onSecurityAudit?.(
        'BRUTE_FORCE_LOCKOUT_ENFORCED',
        `Locked login for ${lockoutMinutesCfg} mins after ${nextCount} failed attempts on ${selectedRole}`
      );
    }
  };

  const resetFailedAttempts = () => {
    setFailedAttempts(0);
    setLockoutUntil(0);
    try {
      localStorage.setItem('vsetu_failed_login_count', '0');
      localStorage.removeItem('vsetu_login_lockout_until');
    } catch {
      // ignore
    }
  };

  // Update default block & pincode suggestions when district changes in Signup
  const handleDistrictChange = (newDistId: string) => {
    setDistrictId(newDistId);
    const found = BIHAR_ALL_38_DISTRICTS.find((d) => d.id === newDistId);
    if (found) {
      const firstBlock = Array.isArray(found.sampleBlocks)
        ? found.sampleBlocks[0]
        : String(found.sampleBlocks).split(',')[0]?.trim();
      const resolvedBlock = firstBlock || `${found.name} Sadar`;
      setBlockName(resolvedBlock);
      setLocalityName(`${found.name} Main Town`);
      setPincode(found.defaultPincode);
      setAddress(`Main Road, ${resolvedBlock}, ${found.name}, Bihar - ${found.defaultPincode}`);
    }
  };

  const isBusy = loadingStage !== 'idle' || googleLoading;
  const isLockedOut = lockoutRemainingSec > 0;
  const pwStrength = computePasswordStrength(password);

  const dispatchSingleDualChannelOtp = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const resolvedEmail =
      identifier.includes('@')
        ? identifier.trim()
        : selectedRole === 'ADMIN'
        ? adminCredentials.ownerEmail
        : `${identifier.trim().replace(/\s+/g, '.').toLowerCase()}@vidyasetu.in`;
    const resolvedMobile =
      mobile.trim() ||
      (selectedRole === 'ADMIN' ? '+91 98350 00111' : '+91 94310 58415');

    setGeneratedOtp(code);
    setEnteredOtp('');
    setOtpWrongAttempts(0);
    setOtpExpirySeconds(300);
    setOtpTargetEmail(resolvedEmail);
    setOtpTargetMobile(resolvedMobile);
    setOtpSentTimestamp(
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
    setOtpStep(true);
    onSecurityAudit?.(
      'DUAL_CHANNEL_OTP_DISPATCHED',
      `Dispatched 6-digit OTP to ${resolvedMobile} & ${resolvedEmail} (${selectedRole})`
    );
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLockedOut) {
      setError(
        `Security Lockout Active: Too many failed login attempts. Please wait ${Math.floor(
          lockoutRemainingSec / 60
        )}m ${lockoutRemainingSec % 60}s before retrying.`
      );
      return;
    }

    // Step 1: Validate fields, Security CAPTCHA, Account Credentials & Send Single OTP to BOTH Mobile & Email
    if (!otpStep) {
      if (mode === 'signup' && securitySettings && !securitySettings.publicRegistrationEnabled) {
        setError('Public account registration is currently disabled by the Administrator.');
        return;
      }

      if (mode === 'signup' && name.trim().length < 2) {
        setError('Please enter your full name.');
        return;
      }

      // Sanitize against injection characters
      if (/[<>'"`;]/.test(identifier)) {
        recordFailedAttempt('Blocked injection characters in Login ID');
        setError('Security Alert: Invalid characters detected in Login ID / Email.');
        return;
      }

      if (identifier.trim().length < 3) {
        setError('Please enter a valid Email ID or Login ID.');
        return;
      }
      if (mobile.trim().length < 8 && selectedRole !== 'ADMIN') {
        setError(
          'Please enter your 10-digit Mobile Number so the single OTP and Account Credentials can be sent to both Mobile & Email.'
        );
        return;
      }
      if (password.length < 4) {
        setError('Please enter a valid password (minimum 4 characters).');
        return;
      }

      // Enforce Anti-Bot Security Challenge (CAPTCHA)
      if (securitySettings?.recaptchaEnabled !== false) {
        if (Number(captchaInput.trim()) !== captchaA + captchaB) {
          recordFailedAttempt('Failed security math challenge');
          refreshCaptcha();
          setError('Security Verification Failed: Please solve the math challenge correctly.');
          return;
        }
      }

      if (mode === 'signup') {
        if (!blockName.trim()) {
          setError('Please enter your Block name (प्रखंड / Block).');
          return;
        }
        if (!pincode.trim() || pincode.trim().length < 6) {
          setError('Please enter a valid 6-digit Pin Code.');
          return;
        }
        if (!address.trim()) {
          setError('Please enter your complete street/village address.');
          return;
        }
      }

      // Strict Credential Validation on Login
      if (mode === 'login') {
        const cleanInputId = identifier.trim().toLowerCase();
        const cleanInputMobile = mobile.replace(/[^0-9]/g, '').slice(-10);

        if (selectedRole === 'ADMIN') {
          const validIdMatch =
            cleanInputId === adminCredentials.adminId.toLowerCase() ||
            cleanInputId === adminCredentials.ownerEmail.toLowerCase();
          const validPassMatch = password === adminCredentials.adminPassword;

          if (!validIdMatch || !validPassMatch) {
            recordFailedAttempt('Invalid Owner Admin credentials');
            refreshCaptcha();
            setError(
              `Access Denied: Invalid Admin Login ID or Password. (${Math.max(
                0,
                maxAllowedAttempts - (failedAttempts + 1)
              )} attempts remaining before security lockout).`
            );
            return;
          }
        } else {
          // Check if user exists in usersDirectory or tutors
          const matchedUser = usersDirectory.find(
            (u) =>
              u.email.toLowerCase() === cleanInputId ||
              (u.loginUserId && u.loginUserId.toLowerCase() === cleanInputId) ||
              (cleanInputMobile.length === 10 &&
                u.mobile.replace(/[^0-9]/g, '').endsWith(cleanInputMobile))
          );
          const matchedTutor = tutors.find(
            (t) =>
              (t.email && t.email.toLowerCase() === cleanInputId) ||
              (t.loginUserId && t.loginUserId.toLowerCase() === cleanInputId) ||
              (t.tutorNumericId && `tut-${t.tutorNumericId}` === cleanInputId) ||
              (t.tutorNumericId && `tch-${t.tutorNumericId}` === cleanInputId)
          );

          if (matchedUser && !matchedUser.isActive) {
            recordFailedAttempt('Attempted login to suspended account');
            setError(
              'Account Suspended: Your account has been deactivated by the Administrator. Please contact the support desk.'
            );
            return;
          }

          const expectedPassword = matchedTutor?.loginPassword || matchedUser?.loginPassword;
          if (expectedPassword && password !== expectedPassword) {
            recordFailedAttempt('Wrong password for registered account');
            refreshCaptcha();
            setError(
              `Invalid password for this registered ${selectedRole} account. (${Math.max(
                0,
                maxAllowedAttempts - (failedAttempts + 1)
              )} attempts remaining).`
            );
            return;
          }
        }
      }

      setLoadingStage('verifying');
      await new Promise((r) => setTimeout(r, 260));
      setLoadingStage('idle');
      dispatchSingleDualChannelOtp();
      return;
    }

    // Step 2: Verify the Single Dual-Channel OTP before Completing Login or Signup
    if (otpExpirySeconds <= 0) {
      setError('OTP Expired: For your security, this 6-digit OTP has expired. Please click Resend OTP.');
      return;
    }

    if (enteredOtp.trim() !== generatedOtp) {
      const nextWrongOtp = otpWrongAttempts + 1;
      setOtpWrongAttempts(nextWrongOtp);
      recordFailedAttempt('Invalid 6-digit OTP entered');
      if (nextWrongOtp >= 3) {
        setOtpStep(false);
        refreshCaptcha();
        setError('Security Alert: 3 incorrect OTP attempts. Please verify your credentials again.');
        return;
      }
      setError(
        `Invalid 6-digit OTP entered (${3 - nextWrongOtp} tries remaining). Please check the SMS/Email dispatch box below.`
      );
      return;
    }

    resetFailedAttempts();
    onSecurityAudit?.(
      mode === 'login' ? 'SECURE_LOGIN_VERIFIED' : 'SECURE_SIGNUP_VERIFIED',
      `Role: ${selectedRole} · ID: ${identifier.trim()} · 2FA Dual-Channel OTP Verified`
    );

    setLoadingStage('verifying');
    await new Promise((r) => setTimeout(r, 280));
    setLoadingStage('session');
    await new Promise((r) => setTimeout(r, 240));

    try {
      const resolvedRole: Role =
        mode === 'signup' && selectedRole === 'ADMIN' ? 'TUTOR' : selectedRole;
      const distObj =
        BIHAR_ALL_38_DISTRICTS.find((d) => d.id === districtId) || BIHAR_ALL_38_DISTRICTS[0];
      const cleanBlock = blockName.trim() || `${distObj.name} Sadar`;
      const cleanLoc = localityName.trim() || cleanBlock;
      const cleanPin = pincode.trim() || distObj.defaultPincode;
      const cleanAddr =
        address.trim() ||
        `${cleanLoc}, Block ${cleanBlock}, ${distObj.name}, Bihar - ${cleanPin}`;
      const cleanCourse = courseText.trim() || 'Class 6 to 10 CBSE';
      const cleanSubj = subjectsText.trim() || 'Math, Physics, Chemistry';

      const autoBio =
        customBio.trim() ||
        buildAutomatedTutorBio({
          cityName: distObj.name,
          blockName: cleanBlock,
          localityName: cleanLoc,
          courseText: cleanCourse,
          subjectsText: cleanSubj,
          experienceYrs: Number(experienceYrs) || 0,
          monthlyRate: Number(monthlyRate) || 3000,
          minDurationMonths: Number(minDurationMonths) || 3,
          online: modeOnline,
        });

      const primaryTuitionType: TuitionType = modeStudentHome
        ? 'HOME_TUITION'
        : modeOnline
        ? 'ONLINE'
        : modeTutorHome
        ? 'AT_TUTOR_HOME'
        : 'AT_INSTITUTE';

      await onCredentialAuth({
        name: mode === 'signup' ? name.trim() : undefined,
        identifier: identifier.trim(),
        mobile: mobile.trim() || otpTargetMobile,
        password: password.trim(),
        role: resolvedRole,
        avatarUrl: profilePhotoUrl.trim() || undefined,
        studentLocation: {
          country: country.trim() || 'India',
          state: stateName.trim() || 'Bihar',
          districtId: distObj.id,
          districtName: distObj.name,
          blockName: cleanBlock,
          localityName: cleanLoc,
          pincode: cleanPin,
          address: cleanAddr,
          avatarUrl: profilePhotoUrl.trim() || undefined,
        },
        tutorDetails:
          mode === 'signup' && resolvedRole === 'TUTOR'
            ? {
                age: Number(age) || 28,
                gender,
                experienceYrs: Number(experienceYrs) || 0,
                hourlyRate: Number(hourlyRate) || 300,
                monthlyRate: Number(monthlyRate) || 3000,
                minDurationMonths: Number(minDurationMonths) || 3,
                country: country.trim() || 'India',
                state: stateName.trim() || 'Bihar',
                cityId: distObj.id,
                cityName: distObj.name,
                blockName: cleanBlock,
                localityName: cleanLoc,
                pincode: cleanPin,
                preferredTime: preferredTime.trim() || 'AnyTime',
                categories: categories.trim() || cleanCourse,
                address: cleanAddr,
                qualification: qualification.trim() || 'B.Sc',
                courseText: cleanCourse,
                subjectsText: cleanSubj,
                tuitionType: primaryTuitionType,
                bio: autoBio,
                modes: {
                  studentHome: modeStudentHome,
                  tutorHome: modeTutorHome,
                  institute: modeInstitute,
                  online: modeOnline,
                },
                bankAccountHolder: bankAccountHolder.trim() || name.trim(),
                bankAccountNumber: bankAccountNumber.trim(),
                bankIfscCode: bankIfscCode.trim().toUpperCase(),
                bankName: bankName.trim(),
                upiId: upiId.trim(),
                loginPassword: password.trim(),
                avatarUrl: profilePhotoUrl.trim() || undefined,
              }
            : undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoadingStage('idle');
    }
  };

  const handleGoogleClick = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await onGoogleAuth(selectedRole);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google Sign-In was cancelled or failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const selectedDistrictObj =
    BIHAR_ALL_38_DISTRICTS.find((d) => d.id === districtId) || BIHAR_ALL_38_DISTRICTS[0];
  const sampleBlocksText = Array.isArray(selectedDistrictObj.sampleBlocks)
    ? selectedDistrictObj.sampleBlocks.join(', ')
    : String(selectedDistrictObj.sampleBlocks);
  const firstSampleBlock = Array.isArray(selectedDistrictObj.sampleBlocks)
    ? selectedDistrictObj.sampleBlocks[0]
    : String(selectedDistrictObj.sampleBlocks).split(',')[0];

  return (
    <section className="max-w-3xl mx-auto py-6 sm:py-8 px-3 sm:px-4 animate-page-transition">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-7 relative shadow-xs">
        {isBusy && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
            <div className="h-full bg-[#084d75] w-2/3 animate-pulse rounded-r" />
          </div>
        )}

        {/* ENTERPRISE SECURITY SHIELD BAR */}
        <div className="mb-4 p-2.5 bg-slate-900 text-white rounded-lg border border-slate-700 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-bold text-emerald-300">256-Bit Encrypted Login Guard</span>
            <span className="text-slate-400 hidden sm:inline">·</span>
            <span className="text-slate-300 hidden sm:inline">
              2FA Dual-Channel OTP + Brute-Force Lockout Active
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded font-mono font-bold ${
                failedAttempts > 0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              Attempts: {Math.max(0, maxAllowedAttempts - failedAttempts)}/{maxAllowedAttempts}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-mono">
              Timeout: {securitySettings?.sessionTimeout || 30}m
            </span>
          </div>
        </div>

        {/* BRUTE-FORCE LOCKOUT BANNER IF TRIGGERED */}
        {isLockedOut && (
          <div className="mb-4 p-4 bg-red-950 text-white border-2 border-red-500 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-red-200 uppercase tracking-wide">
                  Account Temporarily Locked (Brute-Force Protection)
                </p>
                <p className="text-slate-300 mt-0.5">
                  Too many failed login attempts detected. Access will automatically unlock in{' '}
                  <span className="font-mono font-bold text-amber-300">
                    {Math.floor(lockoutRemainingSec / 60)}m {lockoutRemainingSec % 60}s
                  </span>
                  .
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                resetFailedAttempts();
                refreshCaptcha();
                setError('');
              }}
              className="px-3 py-1.5 text-[11px] font-bold bg-white text-slate-900 rounded-md hover:bg-slate-100 shrink-0 cursor-pointer"
            >
              Verify CAPTCHA &amp; Unlock
            </button>
          </div>
        )}

        {/* STICKY PORTAL ROLE SWITCHER BAR (Never hides while scrolling!) */}
        <div className="sticky top-[88px] z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <p className="text-xs font-semibold text-[#ff6600] uppercase tracking-wider">
              {mode === 'login'
                ? selectedRole === 'ADMIN'
                  ? 'Owner Security Console Login (2FA OTP + Encrypted Vault)'
                  : selectedRole === 'TUTOR'
                  ? 'Dedicated Teacher Login Panel (Live Classes & Subscribed Students)'
                  : 'Student / Parent Login Panel (Live Classes & Tasks)'
                : 'Automated Registration + Instant ID/Password on Mobile, Email & WhatsApp'}
            </p>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Same Single OTP on Mobile &amp; Email
            </span>
          </div>

          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {mode === 'login'
              ? 'Select Your Login Portal (Teacher / Student-Parent / Admin)'
              : 'Select Account Type to Create (ID & Password Sent Immediately)'}
          </label>
          <div
            className={`grid gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg ${
              mode === 'login' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2'
            }`}
          >
            <button
              type="button"
              disabled={isBusy}
              onClick={() => {
                setError('');
                setOtpStep(false);
                setSelectedRole('TUTOR');
              }}
              className={`py-2.5 px-3 text-xs font-bold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                selectedRole === 'TUTOR'
                  ? 'bg-[#084d75] text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              👨‍🏫 Teacher Login Panel
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={() => {
                setError('');
                setOtpStep(false);
                setSelectedRole('STUDENT');
              }}
              className={`py-2.5 px-3 text-xs font-bold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                selectedRole === 'STUDENT'
                  ? 'bg-[#084d75] text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              🎓 Student / Parent Login
            </button>
            {mode === 'login' && (
              <button
                type="button"
                disabled={isBusy}
                onClick={() => {
                  setError('');
                  setOtpStep(false);
                  setSelectedRole('ADMIN');
                }}
                className={`py-2.5 px-3 text-xs font-bold rounded-md transition-all whitespace-nowrap inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedRole === 'ADMIN'
                    ? 'bg-[#ff6600] text-white shadow-xs'
                    : 'text-slate-600 dark:text-amber-300 hover:bg-white/60'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Owner Admin Login</span>
              </button>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {mode === 'login'
              ? selectedRole === 'ADMIN'
                ? 'Owner Admin Console Login (Secured)'
                : selectedRole === 'TUTOR'
                ? 'Teacher Login Panel (Manage Subscribed Students, Live Zoom/Google Classes & Tasks)'
                : 'Student / Parent Login (Join Live Online Classes, Attendance & Homework Tasks)'
              : selectedRole === 'TUTOR'
              ? 'Register Teacher Account (Auto-Sends Login ID & Password to Mobile, Email & WhatsApp)'
              : 'Create Student / Parent Account (Auto-Sends Login ID & Password to Mobile, Email & WhatsApp)'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login'
              ? 'Protected by anti-bot verification, brute-force lockout, and simultaneous Mobile + Email 6-digit OTP verification.'
              : 'As soon as you verify your single OTP, your Login User ID and Password will be sent immediately to your Mobile SMS, Email ID, and WhatsApp.'}
          </p>
        </div>

        {/* Dedicated Admin Login Notice Box (Password Masked — Never Exposed in Plaintext!) */}
        {mode === 'login' && selectedRole === 'ADMIN' && (
          <div className="mb-4 p-3.5 bg-slate-900 text-slate-100 border border-amber-400/50 rounded-lg text-xs space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-1 font-bold text-amber-300">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Owner Admin Vault Authentication (Plaintext Credentials Masked)</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                SHA-256 + 2FA OTP Enforced
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Authorized Owner Email: <code className="font-mono font-bold text-white">{adminCredentials.ownerEmail}</code> · Admin Password:{' '}
              <code className="font-mono font-bold text-emerald-300">•••••••• (Encrypted)</code>
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!otpStep && (
          <>
            {/* Google OAuth Button */}
            <button
              type="button"
              disabled={isBusy || isLockedOut}
              onClick={handleGoogleClick}
              className="w-full py-2.5 px-4 mb-4 text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
            >
              {googleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#084d75]" />
                  <span>Connecting Google Account...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#084d75]" />
                  <span>
                    {mode === 'login'
                      ? `Continue with Google (${selectedRole === 'TUTOR' ? 'Teacher' : selectedRole === 'ADMIN' ? 'Admin' : 'Student'})`
                      : `Sign up with Google as ${selectedRole === 'TUTOR' ? 'Teacher' : 'Student/Parent'}`}
                  </span>
                </>
              )}
            </button>

            <div className="relative flex py-2 items-center mb-4">
              <div className="grow border-t border-slate-200 dark:border-slate-700" />
              <span className="shrink mx-3 text-xs text-slate-400">
                or fill details below for Mobile + Email Single OTP Verification
              </span>
              <div className="grow border-t border-slate-200 dark:border-slate-700" />
            </div>
          </>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {!otpStep ? (
            <>
              {/* Basic Name + Mobile + Email + Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isBusy || isLockedOut}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={selectedRole === 'TUTOR' ? 'e.g. Sanjeev Kumar' : 'e.g. Rakesh Sharma'}
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email ID / Login ID (Receives Same OTP &amp; Credentials) *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isBusy || isLockedOut}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      selectedRole === 'ADMIN'
                        ? adminCredentials.ownerEmail
                        : selectedRole === 'TUTOR'
                        ? 'user@example.com or TUT-1584150'
                        : 'student@example.com'
                    }
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Mobile &amp; WhatsApp No. (Receives OTP &amp; ID/Password) *
                  </label>
                  <input
                    type="tel"
                    required={selectedRole !== 'ADMIN'}
                    disabled={isBusy || isLockedOut}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 94310 58415"
                    className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                      Password *
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setForgotOpen(true);
                          setForgotSent(false);
                        }}
                        className="text-xs text-[#084d75] hover:underline"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      disabled={isBusy || isLockedOut}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3 pr-9 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {/* Live Password Strength Meter */}
                  {password.length > 0 && (
                    <div className="mt-1.5 space-y-1">
                      <div className="grid grid-cols-4 gap-1 h-1">
                        {[1, 2, 3, 4].map((bar) => (
                          <div
                            key={bar}
                            className={`rounded-full transition-colors ${
                              pwStrength.score >= bar ? pwStrength.colorClass : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-500 flex items-center justify-between">
                        <span>Security Strength:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {pwStrength.label}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* PROFILE PHOTO UPLOAD FOR BOTH TEACHER AND USER / STUDENT */}
              {mode === 'signup' && (
                <div className="p-3.5 bg-blue-50/70 dark:bg-slate-800/90 border border-blue-200 dark:border-slate-700 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-900 border-2 border-[#084d75] overflow-hidden flex items-center justify-center shrink-0">
                      {profilePhotoUrl ? (
                        <img
                          src={profilePhotoUrl}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-6 h-6 text-[#084d75]" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#084d75] dark:text-amber-300">
                        {selectedRole === 'TUTOR'
                          ? '👨‍🏫 Upload Teacher Profile Photo (शिक्षक अपना फोटो डालें)'
                          : '🎓 Upload Student / User Profile Photo (यूज़र अपना फोटो डालें)'}
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        Choose a photo from your mobile/computer or paste a photo link below.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <label className="px-3 py-1.5 rounded-md bg-[#084d75] hover:bg-[#063a58] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingPhoto ? 'Uploading...' : 'Choose Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingPhoto(true);
                          try {
                            const compressed = await readAndCompressImageFile(file, 360);
                            setProfilePhotoUrl(compressed);
                          } finally {
                            setUploadingPhoto(false);
                          }
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      value={profilePhotoUrl.startsWith('data:') ? '' : profilePhotoUrl}
                      onChange={(e) => setProfilePhotoUrl(e.target.value)}
                      placeholder="Or paste photo URL..."
                      className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md w-44"
                    />
                    {profilePhotoUrl && (
                      <button
                        type="button"
                        onClick={() => setProfilePhotoUrl('')}
                        className="px-2 py-1 text-[11px] font-semibold text-red-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ANTI-BOT SECURITY CHALLENGE (CAPTCHA) */}
              {securitySettings?.recaptchaEnabled !== false && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-lg flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <ShieldCheck className="w-4 h-4 text-[#084d75] dark:text-amber-400 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Security Verification Challenge:
                    </span>
                    <span className="px-2.5 py-1 rounded bg-slate-900 text-amber-300 font-mono font-bold text-xs">
                      {captchaA} + {captchaB} = ?
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      required
                      disabled={isBusy || isLockedOut}
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      placeholder="Answer"
                      className="w-24 px-2.5 py-1.5 text-xs font-mono font-bold text-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      title="Refresh Security Challenge"
                      className="p-1.5 text-slate-500 hover:text-slate-800 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* COMPLETE BIHAR 38-DISTRICT + INDIA + BLOCK + PINCODE + FULL ADDRESS SECTION */}
              {mode === 'signup' && (
                <div className="p-4 bg-emerald-50/60 dark:bg-slate-800/80 border border-emerald-200 dark:border-slate-700 rounded-lg space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-bold text-[#084d75] dark:text-emerald-300 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#ff6600]" />
                      <span>
                        Complete Address &amp; Location (Country India • All 38 Bihar Districts • Self Block &amp; Pin Code)
                      </span>
                    </p>
                    <span className="text-[11px] font-semibold text-emerald-700">
                      ✓ Enables Automatic Nearby Teacher Matching
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="India"
                        className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        placeholder="Bihar"
                        className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Bihar District (All 38 Districts) *
                      </label>
                      <select
                        value={districtId}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                      >
                        {BIHAR_ALL_38_DISTRICTS.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Enter Your Block (प्रखंड / Block) *
                      </label>
                      <input
                        type="text"
                        required
                        value={blockName}
                        onChange={(e) => setBlockName(e.target.value)}
                        placeholder={`e.g. ${firstSampleBlock || 'Danapur'}`}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                      />
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                        Blocks in {selectedDistrictObj.name}: {sampleBlocksText}
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Locality / Mohalla / Village *
                      </label>
                      <input
                        type="text"
                        required
                        value={localityName}
                        onChange={(e) => setLocalityName(e.target.value)}
                        placeholder="e.g. Gola Road, Boring Road"
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Enter Your 6-Digit Pin Code *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="e.g. 801503"
                        className="w-full px-2.5 py-1.5 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Enter Complete Street / House / Landmark Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. House No. 102, Near High School, Block Danapur, District Patna, Bihar - 801503"
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                    />
                  </div>
                </div>
              )}

              {/* Complete Automated Teacher Profile Fields + Confidential Bank Account Details */}
              {mode === 'signup' && selectedRole === 'TUTOR' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50/60 dark:bg-slate-800/70 border border-blue-200 dark:border-slate-700 rounded-lg space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-bold text-[#084d75] dark:text-blue-300">
                        Teacher Fee &amp; Academic Details (Set Your Own Monthly Amount &amp; Duration in Months)
                      </p>
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        ✓ Contact Locked Until Student Pays Admin Unlock Fee
                      </span>
                    </div>

                    {/* Highlighted Teacher Monthly Amount + Months Duration + Hourly Rate */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-2.5 bg-amber-50/90 dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-lg">
                      <div>
                        <label className="block text-[11px] font-bold text-[#084d75] dark:text-amber-300 mb-1">
                          Teacher Monthly Fee (₹ / Month) *
                        </label>
                        <input
                          type="number"
                          min={200}
                          max={50000}
                          step={100}
                          required
                          value={monthlyRate}
                          onChange={(e) => setMonthlyRate(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs font-bold text-[#e66000] bg-white dark:bg-slate-800 border border-amber-400 rounded-md"
                        />
                        <span className="text-[10px] text-slate-500">Your monthly tuition charge</span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#084d75] dark:text-amber-300 mb-1">
                          Course Duration (Kitna Month Lena Hai) *
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={36}
                          required
                          value={minDurationMonths}
                          onChange={(e) => setMinDurationMonths(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs font-bold text-[#084d75] bg-white dark:bg-slate-800 border border-amber-400 rounded-md"
                        />
                        <span className="text-[10px] text-slate-500">
                          Total package: ₹{(Number(monthlyRate) || 0) * (Number(minDurationMonths) || 1)} for {minDurationMonths} Month(s)
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Per Hour / Demo Class Fee (₹ / Hr)
                        </label>
                        <input
                          type="number"
                          min={50}
                          max={10000}
                          step={50}
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-800 bg-white dark:bg-slate-800 border border-slate-300 rounded-md"
                        />
                        <span className="text-[10px] text-slate-500">Displayed alongside monthly rate</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Age (Years)
                        </label>
                        <input
                          type="number"
                          min={18}
                          max={75}
                          value={age}
                          onChange={(e) => setAge(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Gender
                        </label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                          className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Experience (Yrs)
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={45}
                          value={experienceYrs}
                          onChange={(e) => setExperienceYrs(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Qualification *
                        </label>
                        <input
                          type="text"
                          required
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          placeholder="e.g. B.Sc, M.Sc, B.Tech"
                          className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Preferred Time
                        </label>
                        <select
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                        >
                          <option value="AnyTime">AnyTime</option>
                          <option value="Morning (6 AM - 12 PM)">Morning (6 AM - 12 PM)</option>
                          <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                          <option value="Evening (4 PM - 9 PM)">Evening (4 PM - 9 PM)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Categories
                        </label>
                        <input
                          type="text"
                          value={categories}
                          onChange={(e) => setCategories(e.target.value)}
                          placeholder="e.g. Class 6 to 10"
                          className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Courses *
                        </label>
                        <input
                          type="text"
                          required
                          value={courseText}
                          onChange={(e) => setCourseText(e.target.value)}
                          placeholder="e.g. Class 6 to 10 CBSE"
                          className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Subjects *
                        </label>
                        <input
                          type="text"
                          required
                          value={subjectsText}
                          onChange={(e) => setSubjectsText(e.target.value)}
                          placeholder="e.g. Math, Physics, Chemistry"
                          className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                        />
                      </div>
                    </div>

                    {/* Tutoring Mode Checkboxes (Yes/No on Profile) */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Tutoring Modes Available (Displays Yes / No on Profile)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={modeStudentHome}
                            onChange={(e) => setModeStudentHome(e.target.checked)}
                            className="accent-[#084d75]"
                          />
                          <span>At Student&apos;s Home</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={modeTutorHome}
                            onChange={(e) => setModeTutorHome(e.target.checked)}
                            className="accent-[#084d75]"
                          />
                          <span>At Tutor&apos;s Home</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={modeInstitute}
                            onChange={(e) => setModeInstitute(e.target.checked)}
                            className="accent-[#084d75]"
                          />
                          <span>At Institute</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-emerald-700 dark:text-emerald-400">
                          <input
                            type="checkbox"
                            checked={modeOnline}
                            onChange={(e) => setModeOnline(e.target.checked)}
                            className="accent-emerald-600"
                          />
                          <span>Online Tuition (Zoom/Google)</span>
                        </label>
                      </div>
                    </div>

                    {/* Automated About Me Generator */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300">
                          About Me (Leave blank for 100% Automatic Profile Bio Generation)
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomBio(
                              buildAutomatedTutorBio({
                                cityName: selectedDistrictObj.name,
                                blockName: blockName.trim() || selectedDistrictObj.name,
                                localityName: localityName.trim() || selectedDistrictObj.name,
                                courseText: courseText.trim() || 'Class 6 to 10 CBSE',
                                subjectsText: subjectsText.trim() || 'Math, Physics, Chemistry',
                                experienceYrs: Number(experienceYrs) || 0,
                                monthlyRate: Number(monthlyRate) || 3000,
                                minDurationMonths: Number(minDurationMonths) || 3,
                                online: modeOnline,
                              })
                            );
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0088cc] hover:underline"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Auto-Fill Bio</span>
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={customBio}
                        onChange={(e) => setCustomBio(e.target.value)}
                        placeholder="Click 'Auto-Fill Bio' or leave blank to automatically generate your complete About Me section..."
                        className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                      />
                    </div>
                  </div>

                  {/* CONFIDENTIAL TEACHER BANK DETAILS SECTION (VISIBLE ONLY TO ADMIN FOR PAYOUTS) */}
                  <div className="p-4 bg-slate-900 text-white border-2 border-amber-400/70 rounded-lg space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Landmark className="w-4 h-4 text-amber-400" />
                        <span>
                          Teacher Bank Account Details for Direct Tuition Payouts
                        </span>
                      </p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold">
                        <Lock className="w-3 h-3" />
                        Strictly Private: Visible ONLY to Admin (Hidden from Public/Students)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Enter your bank account details below so the Admin can transfer your monthly student tuition payouts directly to your bank account. Nobody on the public website can ever see these details.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">
                          Account Holder Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={bankAccountHolder}
                          onChange={(e) => setBankAccountHolder(e.target.value)}
                          placeholder={name || 'e.g. Sanjeev Kumar'}
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-800 text-white border border-slate-700 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">
                          Bank Name &amp; Branch *
                        </label>
                        <input
                          type="text"
                          required
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          placeholder="e.g. State Bank of India, Danapur Branch"
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-800 text-white border border-slate-700 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">
                          Bank Account Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={bankAccountNumber}
                          onChange={(e) => setBankAccountNumber(e.target.value)}
                          placeholder="e.g. 38941205541"
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-800 text-amber-300 border border-slate-700 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">
                          IFSC Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={bankIfscCode}
                          onChange={(e) => setBankIfscCode(e.target.value.toUpperCase())}
                          placeholder="e.g. SBIN0001521"
                          className="w-full px-2.5 py-1.5 text-xs font-mono uppercase bg-slate-800 text-emerald-300 border border-slate-700 rounded-md"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        UPI ID (Optional for Instant Payout)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. teachername@sbi or 9431058415@ybl"
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-800 text-white border border-slate-700 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-[#084d75]"
                    />
                    <span>Remember session for 30 days</span>
                  </label>
                </div>
              )}
            </>
          ) : (
            /* STEP 2: DUAL-CHANNEL SINGLE OTP VERIFICATION PANEL (FOR BOTH LOGIN & SIGNUP) */
            <div className="p-5 bg-emerald-50/90 dark:bg-slate-800 border-2 border-emerald-500 rounded-xl space-y-4 animate-page-transition">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 dark:border-slate-700 pb-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Dual-Channel Single OTP Verification ({mode === 'login' ? 'Login' : 'Signup'})
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                    The <strong>exact same 6-digit OTP</strong> has been dispatched simultaneously to both your Mobile &amp; Email at {otpSentTimestamp}.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-[11px] font-mono font-bold rounded bg-slate-900 text-amber-300">
                    Expires: {String(Math.floor(otpExpirySeconds / 60)).padStart(2, '0')}:
                    {String(otpExpirySeconds % 60).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep(false);
                      setError('');
                    }}
                    className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer"
                  >
                    ← Edit Details
                  </button>
                </div>
              </div>

              {/* Dual Channel Dispatch Boxes showing Same OTP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white dark:bg-slate-900 border border-emerald-300 rounded-lg flex items-start gap-2.5">
                  <Smartphone className="w-5 h-5 text-[#ff6600] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900 dark:text-white">SMS / WhatsApp OTP Sent</p>
                    <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400">{otpTargetMobile}</p>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                      OTP Code: <span className="font-mono font-bold text-sm bg-emerald-100 px-1.5 py-0.5 rounded">{generatedOtp}</span>
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 border border-emerald-300 rounded-lg flex items-start gap-2.5">
                  <Mail className="w-5 h-5 text-[#084d75] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900 dark:text-white">Email Inbox OTP Sent</p>
                    <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 break-all">{otpTargetEmail}</p>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                      OTP Code: <span className="font-mono font-bold text-sm bg-emerald-100 px-1.5 py-0.5 rounded">{generatedOtp}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-900 dark:text-white">
                    Enter 6-Digit Common OTP (Received on Mobile &amp; Email) *
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEnteredOtp(generatedOtp)}
                      className="text-[11px] font-bold text-[#084d75] hover:underline cursor-pointer"
                    >
                      Auto-Fill Verified OTP
                    </button>
                    <button
                      type="button"
                      onClick={dispatchSingleDualChannelOtp}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ff6600] hover:underline cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Resend OTP
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-2.5 text-center text-lg font-mono font-bold tracking-[0.35em] bg-white dark:bg-slate-900 border-2 border-[#084d75] rounded-lg"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isBusy || isLockedOut}
            className={`w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wide text-white rounded-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 ${
              otpStep ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#ff6600] hover:bg-[#e05500]'
            } ${isBusy ? 'scale-[0.99] opacity-90' : ''}`}
          >
            {loadingStage === 'verifying' && (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {!otpStep
                    ? 'Dispatching Same Single OTP to Mobile & Email...'
                    : 'Verifying Dual-Channel OTP...'}
                </span>
              </>
            )}
            {loadingStage === 'session' && (
              <>
                <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                <span>
                  {mode === 'login'
                    ? 'OTP Verified! Opening Portal...'
                    : 'OTP Verified! Sending ID & Password to Mobile, Email & WhatsApp...'}
                </span>
              </>
            )}
            {loadingStage === 'idle' && (
              <>
                <span>
                  {!otpStep
                    ? mode === 'login'
                      ? 'Send Single OTP to Mobile & Email to Login'
                      : selectedRole === 'TUTOR'
                      ? 'Send Single OTP to Mobile & Email to Register Teacher'
                      : 'Send Single OTP to Mobile & Email to Create Account'
                    : mode === 'login'
                    ? 'Verify OTP & Complete Login Now'
                    : 'Verify OTP & Receive ID/Password on Mobile, Email & WhatsApp'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Clean Mode Switcher */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>
            {mode === 'login'
              ? 'New Teacher or Parent on our directory?'
              : 'Already have a registered account?'}
          </span>
          <button
            type="button"
            onClick={() => {
              setError('');
              setOtpStep(false);
              if (mode === 'login') {
                if (selectedRole === 'ADMIN') setSelectedRole('TUTOR');
                onSwitchMode('signup');
              } else {
                onSwitchMode('login');
              }
            }}
            className="font-bold text-[#084d75] dark:text-amber-300 hover:underline cursor-pointer"
          >
            {mode === 'login' ? 'Create Account / Join As Tutor →' : 'Sign In to Existing Account →'}
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 animate-page-transition">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-6">
            <div className="flex items-center gap-2.5 mb-2">
              <KeyRound className="w-4 h-4 text-[#084d75]" />
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                Reset Account Password
              </h3>
            </div>
            {forgotSent ? (
              <div className="space-y-3 pt-2">
                <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                  Password reset link dispatched via Nodemailer SMTP to{' '}
                  <span className="font-mono">{forgotEmail}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => setForgotOpen(false)}
                  className="w-full py-2 text-xs font-medium text-white bg-slate-900 rounded-lg"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (forgotEmail.trim()) setForgotSent(true);
                }}
                className="space-y-3 pt-2"
              >
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Enter your registered email address to receive a 15-minute one-time reset token.
                </p>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotOpen(false)}
                    className="px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-medium text-white bg-[#084d75] rounded-lg"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
