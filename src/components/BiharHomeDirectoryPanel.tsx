import React, { useState, useMemo } from 'react';
import {
  LayoutGrid,
  List,
  Minus,
  Plus,
  UserPlus,
  CheckCircle2,
  X,
  MapPin,
  Video,
  Search,
  Sparkles,
  Shield,
  Trash2,
  Smartphone,
  Mail,
  ShieldCheck,
  Navigation,
  Camera,
  Upload,
} from 'lucide-react';
import {
  TutorItem,
  CityItem,
  TuitionType,
  BIHAR_ALL_38_DISTRICTS,
  UserDirectoryItem,
  RequirementItem,
  PromoOfferItem,
} from '../data/seedData';
import { TutorCard } from './TutorCard';
import { TutorRegistrationDetails, buildAutomatedTutorBio } from './AuthViews';
import { readAndCompressImageFile } from './SocialPlatformIcon';

interface BiharHomeDirectoryPanelProps {
  tutors: TutorItem[];
  cities: CityItem[];
  savedTutorIds: string[];
  whatsappActive: boolean;
  selectedCityId: string;
  onSelectCityId: (cityId: string) => void;
  onToggleSave: (tutorId: string) => void;
  onSelectProfile: (tutor: TutorItem) => void;
  onOpenInquiry: (tutor: TutorItem) => void;
  onWhatsAppClick: (tutor: TutorItem) => void;
  onQuickRegisterTutor: (
    name: string,
    mobile: string,
    email: string,
    details: TutorRegistrationDetails
  ) => Promise<void>;
  quickRegisterOpen: boolean;
  setQuickRegisterOpen: (open: boolean) => void;
  initialOnlineOnly?: boolean;
  // Admin, Offers & Nearby Location Props
  isAdmin?: boolean;
  usersDirectory?: UserDirectoryItem[];
  requirements?: RequirementItem[];
  promoOffers?: PromoOfferItem[];
  onAddPromoOffer?: (offer: Omit<PromoOfferItem, 'id' | 'createdAt'>) => void;
  onTogglePromoOffer?: (offerId: string) => void;
  onDeletePromoOffer?: (offerId: string) => void;
  onDeleteTutor?: (tutorId: string) => void;
  onToggleApproveTutor?: (tutorId: string) => void;
  onToggleFeatureTutor?: (tutorId: string) => void;
  onDeleteUser?: (userId: string) => void;
  onDeleteRequirement?: (reqId: string) => void;
  onOpenAdminConsole?: () => void;
  onOpenAdminPanel?: () => void;
  userSavedLocation?: {
    districtId?: string;
    blockName?: string;
    pincode?: string;
    localityName?: string;
  } | null;
  studentLocation?: {
    districtId?: string;
    districtName?: string;
    blockName?: string;
    pincode?: string;
    localityName?: string;
  } | null;
}

type ExpRangeKey = 'ALL' | '0_2' | '2_5' | '5_10' | 'ABOVE_10';
type PriceRangeKey = 'ALL' | 'UPTO_200' | '201_500' | '501_1000' | 'ABOVE_1000';

const POPULAR_AREAS = [
  { label: 'Danapur (801503)', cityId: 'patna', query: 'Danapur' },
  { label: 'Boring Road (800001)', cityId: 'patna', query: 'Boring Road' },
  { label: 'Patna City (800008)', cityId: 'patna', query: 'Patna city' },
  { label: 'Phulwari Sharif (801505)', cityId: 'patna', query: 'Phulwari' },
  { label: 'Mithila Colony (800018)', cityId: 'patna', query: 'Mithila colony' },
  { label: 'Kumhrar (800026)', cityId: 'patna', query: 'Kumhrar' },
  { label: 'Muzaffarpur (842001)', cityId: 'muzaffarpur', query: '' },
  { label: 'Gaya (823001)', cityId: 'gaya', query: '' },
  { label: 'Bhagalpur (812001)', cityId: 'bhagalpur', query: '' },
  { label: 'Darbhanga (846004)', cityId: 'darbhanga', query: '' },
  { label: 'Purnia (854301)', cityId: 'purnia', query: '' },
  { label: 'Begusarai (851101)', cityId: 'begusarai', query: '' },
];

export const BiharHomeDirectoryPanel: React.FC<BiharHomeDirectoryPanelProps> = ({
  tutors,
  cities,
  savedTutorIds,
  whatsappActive,
  selectedCityId,
  onSelectCityId,
  onToggleSave,
  onSelectProfile,
  onOpenInquiry,
  onWhatsAppClick,
  onQuickRegisterTutor,
  quickRegisterOpen,
  setQuickRegisterOpen,
  initialOnlineOnly = false,
  isAdmin = false,
  usersDirectory = [],
  requirements = [],
  promoOffers = [],
  onAddPromoOffer,
  onTogglePromoOffer,
  onDeletePromoOffer,
  onDeleteTutor,
  onToggleApproveTutor,
  onToggleFeatureTutor,
  onDeleteUser,
  onDeleteRequirement,
  onOpenAdminConsole,
  onOpenAdminPanel,
  userSavedLocation,
  studentLocation,
}) => {
  const effectiveLocation = studentLocation || userSavedLocation;
  const openAdminHandler = onOpenAdminConsole || onOpenAdminPanel;

  // Refine Search State (Includes Country India, All 38 Bihar Districts, Block, Locality, Pin Code, Course, Subject)
  const [blockInput, setBlockInput] = useState(effectiveLocation?.blockName || '');
  const [localityInput, setLocalityInput] = useState(effectiveLocation?.pincode || '');
  const [courseInput, setCourseInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'Male' | 'Female'>('ALL');
  const [expFilter, setExpFilter] = useState<ExpRangeKey>('ALL');
  const [priceFilter, setPriceFilter] = useState<PriceRangeKey>('ALL');
  const [tuitionTypeFilter, setTuitionTypeFilter] = useState<'ALL' | TuitionType>(
    initialOnlineOnly ? 'ONLINE' : 'ALL'
  );
  const [nearbyOnly, setNearbyOnly] = useState<boolean>(false);

  // User's Nearby Location Matcher State (Auto-detects teachers in same Pin Code, Block, or District)
  const [myPincode, setMyPincode] = useState<string>(effectiveLocation?.pincode || '801503');
  const [myBlock, setMyBlock] = useState<string>(effectiveLocation?.blockName || 'Danapur');
  const [myDistrictId, setMyDistrictId] = useState<string>(effectiveLocation?.districtId || 'patna');

  // Admin Quick-Delete & Offer Drawer on Home Page
  const [showAdminHomeDrawer, setShowAdminHomeDrawer] = useState<boolean>(false);
  const [adminDrawerTab, setAdminDrawerTab] = useState<'TUTORS' | 'USERS' | 'REQUIREMENTS' | 'OFFERS'>('TUTORS');

  // Quick Offer Creation Fields inside Home Page Admin Drawer
  const [offerTitle, setOfferTitle] = useState('');
  const [offerSubtitle, setOfferSubtitle] = useState('');
  const [offerBadge, setOfferBadge] = useState('FESTIVAL SPECIAL OFFER');
  const [offerCode, setOfferCode] = useState('BIHAR50');
  const [offerDiscount, setOfferDiscount] = useState('Flat 50% OFF');
  const [offerValid, setOfferValid] = useState('30 Nov 2026');

  // Collapsible sections state for Refine Search [-] / [+] buttons
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    district: true,
    block: true,
    locality: true,
    course: true,
    subject: true,
    gender: true,
    experience: true,
    price: true,
    tuitionType: true,
  });

  // Sort & View Mode
  const [sortBy, setSortBy] = useState<'default' | 'nearby' | 'exp' | 'price_asc' | 'recent'>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Complete Automated Teacher Registration Modal State + Dual OTP + Confidential Bank Account
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('Tutor@2026');
  const [regAge, setRegAge] = useState<number>(32);
  const [regGender, setRegGender] = useState<'Male' | 'Female'>('Male');
  const [regExp, setRegExp] = useState<number>(7);
  const [regRate, setRegRate] = useState<number>(300);
  const [regMonthlyRate, setRegMonthlyRate] = useState<number>(3500);
  const [regDurationMonths, setRegDurationMonths] = useState<number>(3);
  const [regCountry, setRegCountry] = useState<string>('India');
  const [regState, setRegState] = useState<string>('Bihar');
  const [regCityId, setRegCityId] = useState<string>('patna');
  const [regBlock, setRegBlock] = useState<string>('Danapur');
  const [regLocality, setRegLocality] = useState<string>('Danapur Gola Road');
  const [regPincode, setRegPincode] = useState<string>('801503');
  const [regPreferredTime, setRegPreferredTime] = useState<string>('AnyTime');
  const [regCategories, setRegCategories] = useState<string>('Class 6 to 10');
  const [regAddress, setRegAddress] = useState<string>('#102, Main Road, Danapur, Patna, Bihar - 801503');
  const [regQualification, setRegQualification] = useState<string>('B.Sc / B.Ed');
  const [regCourse, setRegCourse] = useState<string>('Class 6 to 10 CBSE');
  const [regSubjects, setRegSubjects] = useState<string>('Math, Physics, Chemistry');
  const [regModeStudentHome, setRegModeStudentHome] = useState<boolean>(true);
  const [regModeTutorHome, setRegModeTutorHome] = useState<boolean>(false);
  const [regModeInstitute, setRegModeInstitute] = useState<boolean>(false);
  const [regModeOnline, setRegModeOnline] = useState<boolean>(true);
  const [regBio, setRegBio] = useState<string>('');
  const [regBankHolder, setRegBankHolder] = useState<string>('');
  const [regBankName, setRegBankName] = useState<string>('');
  const [regBankAccount, setRegBankAccount] = useState<string>('');
  const [regBankIfsc, setRegBankIfsc] = useState<string>('');
  const [regUpiId, setRegUpiId] = useState<string>('');
  const [regAvatarUrl, setRegAvatarUrl] = useState<string>('');
  const [regOtpStep, setRegOtpStep] = useState<boolean>(false);
  const [regGeneratedOtp, setRegGeneratedOtp] = useState<string>('');
  const [regEnteredOtp, setRegEnteredOtp] = useState<string>('');
  const [regError, setRegError] = useState<string>('');
  const [regSuccessBanner, setRegSuccessBanner] = useState<string | null>(null);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetAllFilters = () => {
    onSelectCityId('all');
    setBlockInput('');
    setLocalityInput('');
    setCourseInput('');
    setSubjectInput('');
    setGenderFilter('ALL');
    setExpFilter('ALL');
    setPriceFilter('ALL');
    setTuitionTypeFilter('ALL');
    setNearbyOnly(false);
  };

  // Helper to check if a tutor is "Nearby" the user's configured Pin Code / Block / District
  const isTutorNearbyUser = (t: TutorItem): boolean => {
    const cleanPin = myPincode.trim().toLowerCase();
    const cleanBlk = myBlock.trim().toLowerCase();
    if (cleanPin && (t.pincode || '').toLowerCase() === cleanPin) return true;
    if (
      cleanBlk &&
      ((t.blockName || '').toLowerCase().includes(cleanBlk) ||
        t.localityName.toLowerCase().includes(cleanBlk) ||
        (t.address || '').toLowerCase().includes(cleanBlk))
    ) {
      return true;
    }
    if (myDistrictId && myDistrictId !== 'all' && t.cityId === myDistrictId) {
      return true;
    }
    return false;
  };

  const filteredTutors = useMemo(() => {
    return tutors
      .filter((t) => {
        // Admin sees all tutors (including hidden ones so they can approve or delete them), regular visitors see approved tutors
        if (!t.isApproved && !isAdmin) return false;
        if (selectedCityId !== 'all' && t.cityId !== selectedCityId) return false;

        if (nearbyOnly && !isTutorNearbyUser(t)) {
          return false;
        }

        if (blockInput.trim()) {
          const bq = blockInput.trim().toLowerCase();
          const matchBlock = (t.blockName || '').toLowerCase().includes(bq);
          const matchLoc = t.localityName.toLowerCase().includes(bq);
          const matchAddr = (t.address || '').toLowerCase().includes(bq);
          if (!matchBlock && !matchLoc && !matchAddr) return false;
        }

        if (localityInput.trim()) {
          const q = localityInput.trim().toLowerCase();
          const matchLoc = t.localityName.toLowerCase().includes(q);
          const matchBlock = (t.blockName || '').toLowerCase().includes(q);
          const matchCity = t.cityName.toLowerCase().includes(q);
          const matchPin = (t.pincode || '').toLowerCase().includes(q);
          const matchAddr = (t.address || '').toLowerCase().includes(q);
          const matchCountry = (t.country || 'India').toLowerCase().includes(q);
          if (!matchLoc && !matchBlock && !matchCity && !matchPin && !matchAddr && !matchCountry) {
            return false;
          }
        }

        if (
          courseInput.trim() &&
          !t.courses.some((c) => c.toLowerCase().includes(courseInput.trim().toLowerCase())) &&
          !(t.categories || '').toLowerCase().includes(courseInput.trim().toLowerCase())
        ) {
          return false;
        }

        if (
          subjectInput.trim() &&
          !t.subjects.some((s) => s.toLowerCase().includes(subjectInput.trim().toLowerCase())) &&
          !t.name.toLowerCase().includes(subjectInput.trim().toLowerCase())
        ) {
          return false;
        }

        if (genderFilter !== 'ALL' && t.gender !== genderFilter) return false;

        if (expFilter === '0_2' && !(t.experienceYrs >= 0 && t.experienceYrs <= 2)) return false;
        if (expFilter === '2_5' && !(t.experienceYrs >= 2 && t.experienceYrs <= 5)) return false;
        if (expFilter === '5_10' && !(t.experienceYrs >= 5 && t.experienceYrs <= 10)) return false;
        if (expFilter === 'ABOVE_10' && !(t.experienceYrs > 10)) return false;

        if (priceFilter === 'UPTO_200' && !(t.hourlyRate <= 200)) return false;
        if (priceFilter === '201_500' && !(t.hourlyRate >= 201 && t.hourlyRate <= 500)) return false;
        if (priceFilter === '501_1000' && !(t.hourlyRate >= 501 && t.hourlyRate <= 1000)) return false;
        if (priceFilter === 'ABOVE_1000' && !(t.hourlyRate > 1000)) return false;

        if (tuitionTypeFilter !== 'ALL') {
          if (tuitionTypeFilter === 'ONLINE') {
            const supportsOnline = t.tuitionType === 'ONLINE' || Boolean(t.modes?.online);
            if (!supportsOnline) return false;
          } else if (tuitionTypeFilter === 'HOME_TUITION') {
            const supportsHome = t.tuitionType === 'HOME_TUITION' || Boolean(t.modes?.studentHome);
            if (!supportsHome) return false;
          } else if (tuitionTypeFilter === 'AT_TUTOR_HOME') {
            const supportsTutorHome =
              t.tuitionType === 'AT_TUTOR_HOME' || Boolean(t.modes?.tutorHome);
            if (!supportsTutorHome) return false;
          } else if (tuitionTypeFilter === 'AT_INSTITUTE') {
            const supportsInst = t.tuitionType === 'AT_INSTITUTE' || Boolean(t.modes?.institute);
            if (!supportsInst) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'nearby') {
          return Number(isTutorNearbyUser(b)) - Number(isTutorNearbyUser(a));
        }
        if (sortBy === 'exp') return b.experienceYrs - a.experienceYrs;
        if (sortBy === 'price_asc') return a.hourlyRate - b.hourlyRate;
        if (sortBy === 'recent') return b.createdAt.localeCompare(a.createdAt);
        // Default: Nearby + Featured first
        const nearDiff = Number(isTutorNearbyUser(b)) - Number(isTutorNearbyUser(a));
        if (nearDiff !== 0) return nearDiff;
        return Number(b.isFeatured) - Number(a.isFeatured);
      });
  }, [
    tutors,
    isAdmin,
    selectedCityId,
    nearbyOnly,
    myPincode,
    myBlock,
    myDistrictId,
    blockInput,
    localityInput,
    courseInput,
    subjectInput,
    genderFilter,
    expFilter,
    priceFilter,
    tuitionTypeFilter,
    sortBy,
  ]);

  const nearbyCount = useMemo(
    () => tutors.filter((t) => (t.isApproved || isAdmin) && isTutorNearbyUser(t)).length,
    [tutors, isAdmin, myPincode, myBlock, myDistrictId]
  );

  const activePlaceLabel = useMemo(() => {
    if (localityInput.trim()) return `${localityInput.trim()}, Bihar, India`;
    if (blockInput.trim()) return `Block ${blockInput.trim()}, Bihar, India`;
    if (selectedCityId === 'all') return 'Bihar (All 38 Districts, India)';
    const found = cities.find((c) => c.id === selectedCityId);
    return found ? `${found.name.replace(' (Bihar)', '')}, Bihar, India` : 'Bihar, India';
  }, [selectedCityId, cities, localityInput, blockInput]);

  const handleRegCityChange = (newCityId: string) => {
    setRegCityId(newCityId);
    const dist = BIHAR_ALL_38_DISTRICTS.find((d) => d.id === newCityId);
    if (dist) {
      const firstBlock = Array.isArray(dist.sampleBlocks)
        ? dist.sampleBlocks[0]
        : String(dist.sampleBlocks).split(',')[0]?.trim();
      const defaultBlk = firstBlock || `${dist.name} Sadar`;
      setRegBlock(defaultBlk);
      setRegLocality(`${dist.name} Main Road`);
      setRegPincode(dist.defaultPincode);
      setRegAddress(`#102, ${defaultBlk}, ${dist.name}, Bihar, India - ${dist.defaultPincode}`);
    }
  };

  const handleQuickRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!regName.trim()) {
      setRegError('Please enter Teacher Full Name.');
      return;
    }
    if (!regMobile.trim() || regMobile.trim().length < 8) {
      setRegError('Please enter valid Mobile Number for Dual-Channel Single OTP verification.');
      return;
    }

    // Step 1: Send Same Single OTP to Mobile & Email
    if (!regOtpStep) {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      setRegGeneratedOtp(code);
      setRegEnteredOtp('');
      setRegOtpStep(true);
      return;
    }

    // Step 2: Verify OTP
    if (regEnteredOtp.trim() !== regGeneratedOtp) {
      setRegError(`Invalid OTP. Please enter the 6-digit OTP (${regGeneratedOtp}) sent to both your Mobile & Email.`);
      return;
    }

    const distObj = BIHAR_ALL_38_DISTRICTS.find((d) => d.id === regCityId);
    const cleanCityName = distObj ? distObj.name : 'Patna';
    const cleanBlock = regBlock.trim() || `${cleanCityName} Sadar`;
    const cleanLoc = regLocality.trim() || cleanBlock;
    const cleanPin = regPincode.trim() || distObj?.defaultPincode || '801503';
    const cleanCourse = regCourse.trim() || 'Class 6 to 10 CBSE';
    const cleanSubj = regSubjects.trim() || 'Math, Physics, Chemistry';

    const finalBio =
      regBio.trim() ||
      buildAutomatedTutorBio({
        cityName: cleanCityName,
        blockName: cleanBlock,
        localityName: cleanLoc,
        courseText: cleanCourse,
        subjectsText: cleanSubj,
        experienceYrs: Number(regExp) || 0,
        monthlyRate: Number(regMonthlyRate) || 3500,
        minDurationMonths: Number(regDurationMonths) || 3,
        online: regModeOnline,
      });

    const primaryType: TuitionType = regModeStudentHome
      ? 'HOME_TUITION'
      : regModeOnline
      ? 'ONLINE'
      : regModeTutorHome
      ? 'AT_TUTOR_HOME'
      : 'AT_INSTITUTE';

    await onQuickRegisterTutor(
      regName.trim(),
      regMobile.trim() || '+91 94310 58415',
      regEmail.trim() || `${regName.trim().toLowerCase().replace(/\s+/g, '.')}@vidyasetu.in`,
      {
        age: Number(regAge) || 30,
        gender: regGender,
        experienceYrs: Number(regExp) || 0,
        hourlyRate: Number(regRate) || 300,
        monthlyRate: Number(regMonthlyRate) || 3500,
        minDurationMonths: Number(regDurationMonths) || 3,
        country: regCountry.trim() || 'India',
        state: regState.trim() || 'Bihar',
        cityId: regCityId,
        cityName: cleanCityName,
        blockName: cleanBlock,
        localityName: cleanLoc,
        pincode: cleanPin,
        preferredTime: regPreferredTime.trim() || 'AnyTime',
        categories: regCategories.trim() || cleanCourse,
        address: regAddress.trim() || `#102, ${cleanLoc}, Block ${cleanBlock}, ${cleanCityName}, Bihar - ${cleanPin}`,
        qualification: regQualification.trim() || 'B.Sc',
        courseText: cleanCourse,
        subjectsText: cleanSubj,
        tuitionType: primaryType,
        bio: finalBio,
        modes: {
          studentHome: regModeStudentHome,
          tutorHome: regModeTutorHome,
          institute: regModeInstitute,
          online: regModeOnline,
        },
        bankAccountHolder: regBankHolder.trim() || regName.trim(),
        bankName: regBankName.trim(),
        bankAccountNumber: regBankAccount.trim(),
        bankIfscCode: regBankIfsc.trim().toUpperCase(),
        upiId: regUpiId.trim(),
        loginPassword: regPassword.trim() || 'Tutor@2026',
        avatarUrl: regAvatarUrl.trim() || undefined,
      }
    );

    setRegSuccessBanner(
      `${regName.trim()} (${cleanLoc}, Block ${cleanBlock}, ${cleanCityName} - ${cleanPin} | ₹${regMonthlyRate}/Month for ${regDurationMonths} Months) has been OTP-verified, Login ID & Password dispatched to Mobile/Email/WhatsApp, and published at #1 on the Home Page!`
    );
    setQuickRegisterOpen(false);
    setRegOtpStep(false);
    setRegName('');
  };

  const activeOffers = promoOffers.filter((o) => o.isActive);

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-6">
      {/* ==================== PROMINENT HOME PAGE SPECIAL PROMOTIONAL OFFERS BANNER (Controlled from Admin Panel!) ==================== */}
      {activeOffers.length > 0 && (
        <div className="mb-5 space-y-3">
          {activeOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-gradient-to-r from-[#8b0000] via-[#d9381e] to-[#ff6600] text-white rounded-xl p-4 sm:p-5 shadow-md border-2 border-amber-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-300 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider">
                    🔥 {offer.badgeText || 'SPECIAL OFFER'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-white/20 text-white text-xs font-mono font-bold">
                    {offer.discountText}
                  </span>
                  {offer.couponCode && (
                    <span className="px-2.5 py-0.5 rounded bg-slate-950/70 border border-amber-300 text-amber-300 text-xs font-mono font-bold">
                      Code: {offer.couponCode}
                    </span>
                  )}
                  <span className="text-[11px] text-amber-100">
                    Valid till: <strong>{offer.validUntil}</strong>
                  </span>
                </div>
                <h2 className="font-display text-base sm:text-lg md:text-xl font-bold leading-snug">
                  {offer.title}
                </h2>
                <p className="text-xs sm:text-sm text-orange-50">{offer.subtitle}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({ top: 520, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 text-xs font-extrabold uppercase tracking-wide bg-amber-300 hover:bg-white text-slate-950 rounded-lg shadow-sm cursor-pointer"
                >
                  {offer.ctaText || 'Claim Offer Now'}
                </button>
                {isAdmin && onDeletePromoOffer && (
                  <button
                    type="button"
                    onClick={() => onDeletePromoOffer(offer.id)}
                    className="px-2.5 py-2 text-xs font-bold bg-slate-950/70 hover:bg-red-700 text-white rounded-lg cursor-pointer"
                    title="Delete Offer from Home Page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* ==================== OWNER ADMIN HOME PAGE DIRECT CONTROL BAR ==================== */}
      {isAdmin && (
        <div className="mb-5 bg-amber-50 dark:bg-slate-900 border-2 border-[#ff6600] rounded-lg p-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#ff6600] text-white inline-flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#084d75] dark:text-amber-300">
                  Owner Admin Home Page Master Control Active
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Delete or manage any Teacher ({tutors.length}), Student/User ({usersDirectory.length}), or Tuition Requirement ({requirements.length}) directly from the Home Page or Admin Panel.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAdminHomeDrawer((prev) => !prev)}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#084d75] hover:bg-[#063a58] rounded-md cursor-pointer"
              >
                {showAdminHomeDrawer
                  ? 'Hide Home Page Data Manager'
                  : 'Delete / Manage Teachers, Students & Users on Home Page'}
              </button>
              {openAdminHandler && (
                <button
                  type="button"
                  onClick={openAdminHandler}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#ff6600] hover:bg-[#e05500] rounded-md cursor-pointer"
                >
                  Open Full Admin Panel →
                </button>
              )}
            </div>
          </div>

          {showAdminHomeDrawer && (
            <div className="mt-4 pt-3 border-t border-amber-200 dark:border-slate-700 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdminDrawerTab('TUTORS')}
                  className={`px-3 py-1 text-xs font-bold rounded-md cursor-pointer ${
                    adminDrawerTab === 'TUTORS'
                      ? 'bg-[#084d75] text-white'
                      : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  All Teachers ({tutors.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAdminDrawerTab('USERS')}
                  className={`px-3 py-1 text-xs font-bold rounded-md cursor-pointer ${
                    adminDrawerTab === 'USERS'
                      ? 'bg-[#084d75] text-white'
                      : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  All Students &amp; Users ({usersDirectory.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAdminDrawerTab('REQUIREMENTS')}
                  className={`px-3 py-1 text-xs font-bold rounded-md cursor-pointer ${
                    adminDrawerTab === 'REQUIREMENTS'
                      ? 'bg-[#084d75] text-white'
                      : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  Student Tuition Requirements ({requirements.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAdminDrawerTab('OFFERS')}
                  className={`px-3 py-1 text-xs font-bold rounded-md cursor-pointer ${
                    adminDrawerTab === 'OFFERS'
                      ? 'bg-[#ff6600] text-white'
                      : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  🔥 Home Page Special Offers ({promoOffers.length})
                </button>
              </div>

              {adminDrawerTab === 'TUTORS' && (
                <div className="max-h-56 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md divide-y divide-slate-100 dark:divide-slate-700 text-xs">
                  {tutors.map((t) => (
                    <div key={t.id} className="p-2.5 flex items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{t.name}</span>{' '}
                        <span className="text-slate-500">
                          ({t.localityName}, Block {t.blockName || t.localityName}, {t.cityName} - {t.pincode || '800001'}) • ₹{t.monthlyRate || t.hourlyRate * 10}/Mo
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {onToggleApproveTutor && (
                          <button
                            type="button"
                            onClick={() => onToggleApproveTutor(t.id)}
                            className={`px-2 py-0.5 text-[11px] font-bold rounded cursor-pointer ${
                              t.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {t.isApproved ? 'Approved' : 'Hidden'}
                          </button>
                        )}
                        {onDeleteTutor && (
                          <button
                            type="button"
                            onClick={() => onDeleteTutor(t.id)}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 rounded inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete Teacher
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {adminDrawerTab === 'USERS' && (
                <div className="max-h-56 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md divide-y divide-slate-100 dark:divide-slate-700 text-xs">
                  {usersDirectory.map((u) => (
                    <div key={u.id} className="p-2.5 flex items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>{' '}
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700">
                          {u.role}
                        </span>{' '}
                        <span className="text-slate-500 font-mono">
                          {u.email} • {u.phone}
                        </span>
                      </div>
                      {onDeleteUser && u.role !== 'ADMIN' && (
                        <button
                          type="button"
                          onClick={() => onDeleteUser(u.id)}
                          className="px-2.5 py-1 text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 rounded inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete {u.role === 'STUDENT' ? 'Student' : 'User'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {adminDrawerTab === 'REQUIREMENTS' && (
                <div className="max-h-56 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md divide-y divide-slate-100 dark:divide-slate-700 text-xs">
                  {requirements.map((r) => (
                    <div key={r.id} className="p-2.5 flex items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{r.studentName}</span>{' '}
                        <span className="text-slate-500">
                          ({r.courseName} - {r.subjectName} in {r.localityName}, {r.cityName})
                        </span>
                      </div>
                      {onDeleteRequirement && (
                        <button
                          type="button"
                          onClick={() => onDeleteRequirement(r.id)}
                          className="px-2.5 py-1 text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 rounded inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete Requirement
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {adminDrawerTab === 'OFFERS' && (
                <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md space-y-3 text-xs">
                  {onAddPromoOffer && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!offerTitle.trim()) return;
                        onAddPromoOffer({
                          title: offerTitle.trim(),
                          subtitle:
                            offerSubtitle.trim() ||
                            'Special discount on Home Tuition & Live Online Classes across all 38 Bihar districts!',
                          badgeText: offerBadge.trim() || 'SPECIAL OFFER',
                          couponCode: offerCode.trim().toUpperCase(),
                          discountText: offerDiscount.trim() || 'Flat 50% OFF',
                          validUntil: offerValid.trim() || '30 Nov 2026',
                          isActive: true,
                          ctaText: 'Claim Offer Now',
                        });
                        setOfferTitle('');
                        setOfferSubtitle('');
                      }}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-3 border-b border-slate-200 dark:border-slate-700"
                    >
                      <input
                        type="text"
                        required
                        value={offerTitle}
                        onChange={(e) => setOfferTitle(e.target.value)}
                        placeholder="Offer Headline (e.g. Chhath Puja 50% OFF)*"
                        className="px-2.5 py-1.5 border border-slate-300 rounded"
                      />
                      <input
                        type="text"
                        value={offerDiscount}
                        onChange={(e) => setOfferDiscount(e.target.value)}
                        placeholder="Discount (e.g. Flat 50% OFF)"
                        className="px-2.5 py-1.5 border border-slate-300 rounded"
                      />
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={offerCode}
                          onChange={(e) => setOfferCode(e.target.value)}
                          placeholder="Coupon Code"
                          className="flex-1 px-2.5 py-1.5 font-mono border border-slate-300 rounded"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 font-bold text-white bg-[#ff6600] hover:bg-[#e05500] rounded cursor-pointer shrink-0"
                        >
                          + Publish Offer
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-44 overflow-y-auto">
                    {promoOffers.map((of) => (
                      <div key={of.id} className="py-2 flex items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-[#d9381e]">{of.discountText}</span> ·{' '}
                          <span className="font-bold text-slate-900 dark:text-white">{of.title}</span>{' '}
                          <span className="font-mono text-slate-500">({of.couponCode})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {onTogglePromoOffer && (
                            <button
                              type="button"
                              onClick={() => onTogglePromoOffer(of.id)}
                              className={`px-2 py-0.5 text-[11px] font-bold rounded cursor-pointer ${
                                of.isActive
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {of.isActive ? 'Visible on Home' : 'Hidden'}
                            </button>
                          )}
                          {onDeletePromoOffer && (
                            <button
                              type="button"
                              onClick={() => onDeletePromoOffer(of.id)}
                              className="px-2 py-0.5 text-[11px] font-bold text-white bg-red-600 rounded cursor-pointer"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Instant Registration Confirmation Banner */}
      {regSuccessBanner && (
        <div className="mb-5 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-emerald-900 dark:text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{regSuccessBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setRegSuccessBanner(null)}
            className="text-xs text-emerald-700 hover:underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ==================== NEARBY REGISTERED TEACHER RADAR & LOCATION SEARCH BAR ==================== */}
      <div className="mb-4 bg-emerald-50/90 dark:bg-slate-900 border border-emerald-300 dark:border-slate-700 rounded-md p-3.5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="text-xs font-bold text-emerald-950 dark:text-emerald-300">
                Nearby Registered Teacher Finder (India • All 38 Bihar Districts • Block • Pin Code):
              </span>
              <span className="text-[11px] text-emerald-800 dark:text-slate-300 ml-1.5">
                Enter your District, Block, or Pin Code to automatically highlight nearby registered teachers!
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Your Bihar District"
              value={myDistrictId}
              onChange={(e) => {
                const dId = e.target.value;
                setMyDistrictId(dId);
                onSelectCityId(dId);
                const found = BIHAR_ALL_38_DISTRICTS.find((d) => d.id === dId);
                if (found) {
                  setMyPincode(found.defaultPincode);
                  const firstBlk = Array.isArray(found.sampleBlocks)
                    ? found.sampleBlocks[0]
                    : String(found.sampleBlocks).split(',')[0]?.trim();
                  setMyBlock(firstBlk || '');
                }
              }}
              className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-800 border border-emerald-400 rounded-xs"
            >
              <option value="all">All 38 Bihar Districts</option>
              {BIHAR_ALL_38_DISTRICTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={myBlock}
              onChange={(e) => setMyBlock(e.target.value)}
              placeholder="Your Block (e.g. Danapur)"
              className="w-36 px-2.5 py-1 text-xs bg-white dark:bg-slate-800 border border-emerald-400 rounded-xs"
            />

            <input
              type="text"
              maxLength={6}
              value={myPincode}
              onChange={(e) => setMyPincode(e.target.value)}
              placeholder="Pin Code (801503)"
              className="w-28 px-2.5 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-800 border border-emerald-400 rounded-xs"
            />

            <button
              type="button"
              onClick={() => setNearbyOnly((prev) => !prev)}
              className={`px-3 py-1 text-xs font-bold rounded-xs cursor-pointer transition-colors ${
                nearbyOnly
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-emerald-800 border border-emerald-600 hover:bg-emerald-100'
              }`}
            >
              {nearbyOnly
                ? `✓ Showing Nearby Teachers (${nearbyCount})`
                : `Show Nearby Teachers (${nearbyCount} Found)`}
            </button>
          </div>
        </div>
      </div>

      {/* ==================== STUDENT STUDY MODE CHOOSER: ONLINE PADHNA HAI VS OFFLINE PADHNA HAI ==================== */}
      <div className="mb-4 bg-gradient-to-r from-[#062c47] via-[#084d75] to-[#0e5c8a] text-white rounded-xl p-4 sm:p-5 shadow-sm border border-[#1d6fa5]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
              🎓 Student Study Mode Selector — Choose How You Want to Study
            </span>
            <h3 className="font-display text-base sm:text-lg font-bold mt-0.5">
              Online Padhna Hai ya Offline Home Tuition? Choose Your Preferred Mode:
            </h3>
            <p className="text-xs text-slate-200 mt-0.5">
              Select <strong>Online Class</strong> for Live Zoom / Google Classroom sessions, or <strong>Offline Home Tuition</strong> for 1-on-1 study at your home in your Bihar Block &amp; Pin Code.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setTuitionTypeFilter('ONLINE')}
              className={`px-4 py-2.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                tuitionTypeFilter === 'ONLINE'
                  ? 'bg-amber-400 text-slate-950 border-white shadow-md scale-[1.02]'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/25'
              }`}
            >
              <Video className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <span className="block leading-tight">🖥️ Online Padhna Hai</span>
                <span className="block text-[10px] font-normal opacity-85">
                  Zoom / Google Classroom
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTuitionTypeFilter('HOME_TUITION')}
              className={`px-4 py-2.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                tuitionTypeFilter === 'HOME_TUITION'
                  ? 'bg-emerald-400 text-slate-950 border-white shadow-md scale-[1.02]'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/25'
              }`}
            >
              <MapPin className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <span className="block leading-tight">🏠 Offline Padhna Hai</span>
                <span className="block text-[10px] font-normal opacity-85">
                  Home Tuition at Your Address
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTuitionTypeFilter('ALL')}
              className={`px-4 py-2.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                tuitionTypeFilter === 'ALL'
                  ? 'bg-[#ff6600] text-white border-amber-300 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/25'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <span className="block leading-tight">✨ Both (Online + Offline)</span>
                <span className="block text-[10px] font-normal opacity-85">
                  Show All {tutors.filter((t) => t.isApproved || isAdmin).length} Tutors
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ==================== TOP AREA / BLOCK / LOCALITY / ONLINE CLASS FINDER BAR ==================== */}
      <div className="mb-6 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-4 shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* City/District Dropdown (All 38 Bihar Districts + India Cities) */}
          <div className="lg:col-span-3 flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xs">
            <MapPin className="w-4 h-4 text-[#2b729c] shrink-0" />
            <select
              aria-label="Select Tuition City or Bihar District"
              value={selectedCityId}
              onChange={(e) => onSelectCityId(e.target.value)}
              className="w-full text-xs font-semibold text-slate-800 dark:text-slate-100 bg-transparent focus:outline-none"
            >
              <option value="all">All 38 Bihar Districts &amp; India</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Block / Sub-Division Search Input */}
          <div className="lg:col-span-2 flex items-center gap-1.5 px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xs">
            <input
              type="text"
              value={blockInput}
              onChange={(e) => setBlockInput(e.target.value)}
              placeholder="Block (e.g. Danapur, Sadar)..."
              className="w-full text-xs text-slate-800 dark:text-slate-100 bg-transparent focus:outline-none"
            />
            {blockInput && (
              <button
                type="button"
                onClick={() => setBlockInput('')}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Exact Area / Locality / Pincode / Address Input */}
          <div className="lg:col-span-3 flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xs">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={localityInput}
              onChange={(e) => setLocalityInput(e.target.value)}
              placeholder="Pin Code, Locality or Full Address..."
              className="w-full text-xs text-slate-800 dark:text-slate-100 bg-transparent focus:outline-none"
            />
            {localityInput && (
              <button
                type="button"
                onClick={() => setLocalityInput('')}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Subject / Class Search */}
          <div className="lg:col-span-2 flex items-center gap-2 px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xs">
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="Subject / Class..."
              className="w-full text-xs text-slate-800 dark:text-slate-100 bg-transparent focus:outline-none"
            />
          </div>

          {/* Online Class Quick Toggle Button */}
          <div className="lg:col-span-2">
            <button
              type="button"
              onClick={() =>
                setTuitionTypeFilter((prev) => (prev === 'ONLINE' ? 'ALL' : 'ONLINE'))
              }
              className={`w-full py-2 px-3 text-xs font-bold rounded-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                tuitionTypeFilter === 'ONLINE'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-[#2b729c] hover:bg-[#1f597a] text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{tuitionTypeFilter === 'ONLINE' ? 'Online Only ✓' : 'Online Classes'}</span>
            </button>
          </div>
        </div>

        {/* Popular Bihar District & Area Chips + Teacher Register Trigger */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-semibold text-slate-600 dark:text-slate-400">
              Quick Bihar District / Pin Code Search:
            </span>
            {POPULAR_AREAS.map((area) => (
              <button
                key={area.label}
                type="button"
                onClick={() => {
                  onSelectCityId(area.cityId);
                  setLocalityInput(area.query);
                }}
                className={`px-2 py-0.5 rounded-xs border text-[11px] transition-colors cursor-pointer ${
                  selectedCityId === area.cityId &&
                  localityInput.toLowerCase() === area.query.toLowerCase()
                    ? 'bg-[#ff6600] text-white border-[#ff6600] font-semibold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#2b729c]'
                }`}
              >
                {area.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setRegOtpStep(false);
              setRegError('');
              setQuickRegisterOpen(true);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6600] hover:underline cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Teacher Register (Set Monthly Fee &amp; Months + Dual OTP)</span>
          </button>
        </div>
      </div>

      {/* Top Heading Bar: "Home tutors / Online tutors in Bihar" */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-sans text-xl sm:text-2xl font-bold text-[#8a4b08] dark:text-amber-400 tracking-tight">
            {tuitionTypeFilter === 'ONLINE'
              ? `Online Live Tutors & Home Tutors in ${activePlaceLabel}`
              : `Home tutors / Online tutors in ${activePlaceLabel}`}
          </h2>
          {(localityInput.trim() || blockInput.trim()) && (
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
              ✓ Showing verified teachers matching &ldquo;{blockInput.trim() || localityInput.trim()}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Main 2-Column Layout (Left: Refine Search | Right: Sort + Tutor Cards Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ==================== LEFT PANEL: REFINE SEARCH ==================== */}
        <aside className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-t-md shadow-2xs overflow-hidden">
          <div className="bg-[#2b729c] text-white text-center py-2.5 px-4 font-sans text-[16px] font-semibold tracking-wide flex items-center justify-between">
            <span className="mx-auto">Refine Search</span>
            {(localityInput ||
              blockInput ||
              courseInput ||
              subjectInput ||
              genderFilter !== 'ALL' ||
              expFilter !== 'ALL' ||
              priceFilter !== 'ALL' ||
              tuitionTypeFilter !== 'ALL' ||
              nearbyOnly ||
              selectedCityId !== 'all') && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[11px] font-normal underline text-blue-100 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            {/* 1. Bihar District (All 38 Districts) */}
            <div className="p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[13px] text-[#8a4b08] dark:text-amber-400">
                  Bihar District (All 38)
                </span>
                <button
                  type="button"
                  onClick={() => toggleSection('district')}
                  className="w-4 h-4 border border-slate-500 rounded-2xs inline-flex items-center justify-center text-slate-700 dark:text-slate-300"
                >
                  {openSections.district ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </button>
              </div>
              {openSections.district && (
                <select
                  value={selectedCityId}
                  onChange={(e) => onSelectCityId(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xs"
                >
                  <option value="all">All 38 Bihar Districts (India)</option>
                  {BIHAR_ALL_38_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.defaultPincode})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* 2. Block / Sub-Division */}
            <div className="p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[13px] text-[#8a4b08] dark:text-amber-400">
                  Block (प्रखंड / Block)
                </span>
                <button
                  type="button"
                  onClick={() => toggleSection('block')}
                  className="w-4 h-4 border border-slate-500 rounded-2xs inline-flex items-center justify-center text-slate-700 dark:text-slate-300"
                >
                  {openSections.block ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </button>
              </div>
              {openSections.block && (
                <input
                  type="text"
                  value={blockInput}
                  onChange={(e) => setBlockInput(e.target.value)}
                  placeholder="Enter Block (e.g. Danapur, Sadar)"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xs focus:outline-none focus:border-[#2b729c]"
                />
              )}
            </div>

            {/* 3. Locality / Pincode / Full Address */}
            <div className="p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[13px] text-[#8a4b08] dark:text-amber-400">
                  Locality / Pin Code / Address
                </span>
                <button
                  type="button"
                  onClick={() => toggleSection('locality')}
                  aria-label="Toggle Locality Filter"
                  className="w-4 h-4 border border-slate-500 rounded-2xs inline-flex items-center justify-center text-slate-700 dark:text-slate-300"
                >
                  {openSections.locality ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </button>
              </div>
              {openSections.locality && (
                <input
                  type="text"
                  value={localityInput}
                  onChange={(e) => setLocalityInput(e.target.value)}
                  placeholder="Pin Code (801503) or Locality"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xs focus:outline-none focus:border-[#2b729c]"
                />
              )}
            </div>

            {/* 4. Course */}
            <div className="p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[13px] text-[#8a4b08] dark:text-amber-400">
                  Course
                </span>
                <button
                  type="button"
                  onClick={() => toggleSection('course')}
                  aria-label="Toggle Course Filter"
                  className="w-4 h-4 border border-slate-500 rounded-2xs inline-flex items-center justify-center text-slate-700 dark:text-slate-300"
                >
                  {openSections.course ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </button>
              </div>
              {openSections.course && (
                <input
                  type="text"
                  value={courseInput}
                  onChange={(e) => setCourseInput(e.target.value)}
                  placeholder="enter course"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xs focus:outline-none focus:border-[#2b729c]"
                />
              )}
            </div>

            {/* 5. Subject */}
            <div className="p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[13px] text-[#8a4b08] dark:text-amber-400">
                  Subject
                </span>
                <button
                  type="button"
                  onClick={() => toggleSection('subject')}
                  aria-label="Toggle Subject Filter"
                  className="w-4 h-4 border border-slate-500 rounded-2xs inline-flex items-center justify-center text-slate-700 dark:text-slate-300"
                >
                  {openSections.subject ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </button>
              </div>
              {openSections.subject && (
                <input
                  type="text"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  placeholder="enter subject"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xs focus:outline-none focus:border-[#2b729c]"
                />
              )}
            </div>

            {/* 6. Gender */}
            <div className="p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[13px] text-[#8a4b08] dark:text-amber-400">
                  Gender
                </span>
                <button
                  type="button"
                  onClick={() => toggleSection('gender')}
                  aria-label="Toggle Gender Filter"
                  className="w-4 h-4 border border-slate-500 rounded-2xs inline-flex items-center justify-center text-slate-700 dark:text-slate-300"
                >
                  {openSections.gender ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </button>
              </div>
              {openSections.gender && (
                <div className="flex items-center gap-4 pt-0.5 text-[13px] text-slate-800 dark:text-slate-200">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="refine_gender"
                      checked={genderFilter === 'Male'}
                      onChange={() =>
                        setGenderFilter((prev) => (prev === 'Male' ? 'ALL' : 'Male'))
                      }
                      onClick={() => {
                        if (genderFilter === 'Male') setGenderFilter('ALL');
                      }}
                      className="accent-[#2b729c]"
                    />
                    <span>Male</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="refine_gender"
                      checked={genderFilter === 'Female'}
                      onChange={() =>
                        setGenderFilter((prev) => (prev === 'Female' ? 'ALL' : 'Female'))
                      }
                      onClick={() => {
                        if (genderFilter === 'Female') setGenderFilter('ALL');
                      }}
                      className="accent-[#2b729c]"
                    />
                    <span>Female</span>
                  </label>
                </div>
              )}
            </div>

            {/* 7. Experience */}
            <div className="p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[13px] text-[#8a4b08] dark:text-amber-400">
                  Experience
                </span>
                <button
                  type="button"
                  onClick={() => toggleSection('experience')}
                  aria-label="Toggle Experience Filter"
                  className="w-4 h-4 border border-slate-500 rounded-2xs inline-flex items-center justify-center text-slate-700 dark:text-slate-300"
                >
                  {openSections.experience ? (
                    <Minus className="w-3 h-3" />
                  ) : (
                    <Plus className="w-3 h-3" />
                  )}
                </button>
              </div>
              {openSections.experience && (
                <div className="space-y-2 pt-0.5 text-[13px] text-slate-800 dark:text-slate-200">
                  {(
                    [
                      { key: '0_2', label: '0 - 2 years' },
                      { key: '2_5', label: '2 - 5 years' },
                      { key: '5_10', label: '5 - 10 years' },
                      { key: 'ABOVE_10', label: 'Above 10 years' },
                    ] as const
                  ).map((item) => (
                    <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="refine_exp"
                        checked={expFilter === item.key}
                        onChange={() => setExpFilter(item.key)}
                        onClick={() => {
                          if (expFilter === item.key) setExpFilter('ALL');
                        }}
                        className="accent-[#2b729c]"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 8. Hourly Price */}
            <div className="p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[13px] text-[#8a4b08] dark:text-amber-400">
                  Hourly Price
                </span>
                <button
                  type="button"
                  onClick={() => toggleSection('price')}
                  aria-label="Toggle Hourly Price Filter"
                  className="w-4 h-4 border border-slate-500 rounded-2xs inline-flex items-center justify-center text-slate-700 dark:text-slate-300"
                >
                  {openSections.price ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </button>
              </div>
              {openSections.price && (
                <div className="space-y-2 pt-0.5 text-[13px] text-slate-800 dark:text-slate-200">
                  {(
                    [
                      { key: 'UPTO_200', label: 'Upto Rs 200' },
                      { key: '201_500', label: 'Rs 201 - Rs 500' },
                      { key: '501_1000', label: 'Rs 501 - Rs 1000' },
                      { key: 'ABOVE_1000', label: 'Above Rs 1000' },
                    ] as const
                  ).map((item) => (
                    <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="refine_price"
                        checked={priceFilter === item.key}
                        onChange={() => setPriceFilter(item.key)}
                        onClick={() => {
                          if (priceFilter === item.key) setPriceFilter('ALL');
                        }}
                        className="accent-[#2b729c]"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 9. Tuition Type */}
            <div className="p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[13px] text-[#8a4b08] dark:text-amber-400">
                  Tuition Type
                </span>
                <button
                  type="button"
                  onClick={() => toggleSection('tuitionType')}
                  aria-label="Toggle Tuition Type Filter"
                  className="w-4 h-4 border border-slate-500 rounded-2xs inline-flex items-center justify-center text-slate-700 dark:text-slate-300"
                >
                  {openSections.tuitionType ? (
                    <Minus className="w-3 h-3" />
                  ) : (
                    <Plus className="w-3 h-3" />
                  )}
                </button>
              </div>
              {openSections.tuitionType && (
                <div className="space-y-2 pt-0.5 text-[13px] text-slate-800 dark:text-slate-200">
                  {(
                    [
                      { key: 'HOME_TUITION', label: 'Home Tuition' },
                      { key: 'AT_TUTOR_HOME', label: 'At Tutor Home' },
                      { key: 'AT_INSTITUTE', label: 'At Institute' },
                      { key: 'ONLINE', label: 'Online Tuition' },
                    ] as const
                  ).map((item) => (
                    <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="refine_tuition_type"
                        checked={tuitionTypeFilter === item.key}
                        onChange={() => setTuitionTypeFilter(item.key)}
                        onClick={() => {
                          if (tuitionTypeFilter === item.key) setTuitionTypeFilter('ALL');
                        }}
                        className="accent-[#2b729c]"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ==================== RIGHT PANEL: SORT BAR + TUTOR CARDS GRID ==================== */}
        <div className="lg:col-span-9 space-y-5">
          {/* Top Sort By & Grid/List Control Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xs">
            <div className="flex items-center gap-2.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Sort By
              </label>
              <select
                aria-label="Sort Tutors"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-2.5 py-1 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xs text-slate-800 dark:text-slate-200"
              >
                <option value="default">Default (Nearby + Featured First)</option>
                <option value="nearby">Nearest to My Pin Code / Block</option>
                <option value="exp">Experience: High to Low</option>
                <option value="price_asc">Hourly Price: Low to High</option>
                <option value="recent">Newest Registered Teacher</option>
              </select>

              <div className="inline-flex items-center border border-slate-300 dark:border-slate-700 rounded-xs overflow-hidden bg-white dark:bg-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`px-2.5 py-1 inline-flex items-center gap-1 ${
                    viewMode === 'grid'
                      ? 'bg-slate-100 dark:bg-slate-700 text-[#0088cc] font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`px-2.5 py-1 inline-flex items-center gap-1 border-l border-slate-300 dark:border-slate-700 ${
                    viewMode === 'list'
                      ? 'bg-slate-100 dark:bg-slate-700 text-[#0088cc] font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>
              </div>
            </div>

            <span className="text-xs text-slate-500">
              Showing <strong className="text-slate-900 dark:text-white">{filteredTutors.length}</strong>{' '}
              Verified Tutors
            </span>
          </div>

          {/* Tutors Cards Grid */}
          {filteredTutors.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-10 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No tutors found in &ldquo;{localityInput || blockInput || activePlaceLabel}&rdquo; matching those exact filters.
              </p>
              <p className="text-xs text-slate-500">
                Try switching to Online Tuition or clearing the Refine Search filters.
              </p>
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#2b729c] rounded-xs cursor-pointer"
                >
                  Reset All Filters
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLocalityInput('');
                    setBlockInput('');
                    setNearbyOnly(false);
                    setTuitionTypeFilter('ONLINE');
                  }}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 rounded-xs cursor-pointer"
                >
                  Show Online Tutors
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-5 pt-2'
                    : 'space-y-4 pt-2'
                }
              >
                {filteredTutors.slice(0, visibleCount).map((tutor) => (
                  <TutorCard
                    key={tutor.id}
                    tutor={tutor}
                    viewMode={viewMode}
                    isSaved={savedTutorIds.includes(tutor.id)}
                    whatsappActive={whatsappActive}
                    isNearby={isTutorNearbyUser(tutor)}
                    isAdmin={isAdmin}
                    onToggleSave={onToggleSave}
                    onSelectProfile={onSelectProfile}
                    onOpenInquiry={onOpenInquiry}
                    onWhatsAppClick={onWhatsAppClick}
                    onDeleteTutor={onDeleteTutor}
                    onToggleApproveTutor={onToggleApproveTutor}
                    onToggleFeatureTutor={onToggleFeatureTutor}
                  />
                ))}
              </div>

              {visibleCount < filteredTutors.length && (
                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="px-6 py-2 text-xs font-bold uppercase text-white bg-[#2b729c] hover:bg-[#1f597a] rounded-xs cursor-pointer"
                  >
                    Show More Tutors ({filteredTutors.length - visibleCount} more)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* COMPLETE AUTOMATED TEACHER REGISTRATION MODAL (With All 38 Bihar Districts, Block, Pincode, Monthly Fee, Months Duration & Dual OTP) */}
      {quickRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6600]">
                  Bihar All 38 Districts • Teacher Monthly Fee &amp; Duration • Dual OTP Verification
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  Join As Tutor — Complete Profile (Home &amp; Online Tuition)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQuickRegisterOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {regError && (
              <div className="mt-3 p-2.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-md">
                {regError}
              </div>
            )}

            <form onSubmit={handleQuickRegisterSubmit} className="space-y-3.5 pt-4 text-xs">
              {!regOtpStep ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Teacher Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Sanjeev Kumar"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Mobile &amp; WhatsApp No. (Receives OTP) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value)}
                        placeholder="+91 94310 58415"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Email ID (Receives Same OTP) *
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="teacher@example.com"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  {/* Teacher Profile Photo Upload */}
                  <div className="p-3 bg-blue-50/70 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border-2 border-[#084d75] overflow-hidden flex items-center justify-center shrink-0">
                        {regAvatarUrl ? (
                          <img
                            src={regAvatarUrl}
                            alt="Teacher photo preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="w-5 h-5 text-[#084d75]" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#084d75] dark:text-amber-300">
                          👨‍🏫 Upload Teacher Profile Photo (शिक्षक अपना फोटो डालें)
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          Upload from mobile/computer or paste a photo link to display on your Home Page card.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-3 py-1.5 rounded-md bg-[#084d75] hover:bg-[#063a58] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer">
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
                            setRegAvatarUrl(compressed);
                          }}
                        />
                      </label>
                      <input
                        type="text"
                        value={regAvatarUrl.startsWith('data:') ? '' : regAvatarUrl}
                        onChange={(e) => setRegAvatarUrl(e.target.value)}
                        placeholder="Or paste photo URL..."
                        className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md w-44"
                      />
                    </div>
                  </div>

                  {/* Teacher Monthly Fee + Months Duration + Hourly Rate */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 bg-amber-50 dark:bg-slate-800 border border-amber-300 rounded-lg">
                    <div>
                      <label className="block font-bold text-[#084d75] dark:text-amber-300 mb-1">
                        Monthly Fee (₹ / Month) *
                      </label>
                      <input
                        type="number"
                        min={200}
                        max={50000}
                        step={100}
                        required
                        value={regMonthlyRate}
                        onChange={(e) => setRegMonthlyRate(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 font-bold text-[#e66000] border border-amber-400 rounded-md bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#084d75] dark:text-amber-300 mb-1">
                        Duration (Kitna Month Lena Hai) *
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={36}
                        required
                        value={regDurationMonths}
                        onChange={(e) => setRegDurationMonths(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 font-bold text-[#084d75] border border-amber-400 rounded-md bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Hourly Fee (Rs / Hr)
                      </label>
                      <input
                        type="number"
                        min={50}
                        max={10000}
                        step={50}
                        value={regRate}
                        onChange={(e) => setRegRate(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 font-bold border border-slate-300 rounded-md bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>

                  {/* Country India + Bihar All 38 Districts + Self Block + Locality + Pin Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        required
                        value={regCountry}
                        onChange={(e) => setRegCountry(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={regState}
                        onChange={(e) => setRegState(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Bihar District (All 38 Districts) *
                      </label>
                      <select
                        value={regCityId}
                        onChange={(e) => handleRegCityChange(e.target.value)}
                        className="w-full px-2.5 py-1.5 font-semibold border border-slate-300 rounded-md bg-white dark:bg-slate-800"
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
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Enter Block (प्रखंड / Block) *
                      </label>
                      <input
                        type="text"
                        required
                        value={regBlock}
                        onChange={(e) => setRegBlock(e.target.value)}
                        placeholder="e.g. Danapur, Patna Sadar"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Locality / Area / Village *
                      </label>
                      <input
                        type="text"
                        required
                        value={regLocality}
                        onChange={(e) => setRegLocality(e.target.value)}
                        placeholder="e.g. Gola Road, Boring Road"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        6-Digit Pin Code *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={regPincode}
                        onChange={(e) => setRegPincode(e.target.value)}
                        placeholder="e.g. 801503"
                        className="w-full px-2.5 py-1.5 font-mono font-bold border border-slate-300 rounded-md bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Complete Street / Village Address (Hidden Until Student Pays) *
                    </label>
                    <input
                      type="text"
                      required
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder="#102, Main Road, Block Danapur, Patna, Bihar - 801503"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Age (Years)
                      </label>
                      <input
                        type="number"
                        min={18}
                        max={75}
                        value={regAge}
                        onChange={(e) => setRegAge(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Gender
                      </label>
                      <select
                        value={regGender}
                        onChange={(e) => setRegGender(e.target.value as 'Male' | 'Female')}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white dark:bg-slate-800"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Experience (Yrs)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={45}
                        value={regExp}
                        onChange={(e) => setRegExp(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Qualification *
                      </label>
                      <input
                        type="text"
                        required
                        value={regQualification}
                        onChange={(e) => setRegQualification(e.target.value)}
                        placeholder="e.g. B.Sc, M.Sc"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Courses Taught *
                      </label>
                      <input
                        type="text"
                        required
                        value={regCourse}
                        onChange={(e) => setRegCourse(e.target.value)}
                        placeholder="e.g. Class 6 to 10 CBSE"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Subjects Taught *
                      </label>
                      <input
                        type="text"
                        required
                        value={regSubjects}
                        onChange={(e) => setRegSubjects(e.target.value)}
                        placeholder="e.g. Math, Physics, Chemistry"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  {/* Tutoring Mode Checkboxes */}
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regModeStudentHome}
                          onChange={(e) => setRegModeStudentHome(e.target.checked)}
                        />
                        <span>At Student&apos;s Home</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regModeTutorHome}
                          onChange={(e) => setRegModeTutorHome(e.target.checked)}
                        />
                        <span>At Tutor&apos;s Home</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regModeInstitute}
                          onChange={(e) => setRegModeInstitute(e.target.checked)}
                        />
                        <span>At Institute</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold text-emerald-700">
                        <input
                          type="checkbox"
                          checked={regModeOnline}
                          onChange={(e) => setRegModeOnline(e.target.checked)}
                        />
                        <span>Online Tuition</span>
                      </label>
                    </div>
                  </div>

                  {/* Automated Bio */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        About Me (Leave blank for Automatic Bio Generation)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const distObj = BIHAR_ALL_38_DISTRICTS.find((d) => d.id === regCityId);
                          const cleanCity = distObj ? distObj.name : 'Patna';
                          setRegBio(
                            buildAutomatedTutorBio({
                              cityName: cleanCity,
                              blockName: regBlock.trim() || cleanCity,
                              localityName: regLocality.trim() || cleanCity,
                              courseText: regCourse.trim() || 'Class 6 to 10 CBSE',
                              subjectsText: regSubjects.trim() || 'Math, Physics, Chemistry',
                              experienceYrs: Number(regExp) || 0,
                              monthlyRate: Number(regMonthlyRate) || 3500,
                              minDurationMonths: Number(regDurationMonths) || 3,
                              online: regModeOnline,
                            })
                          );
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0088cc] hover:underline"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Auto-Generate About Me</span>
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={regBio}
                      onChange={(e) => setRegBio(e.target.value)}
                      placeholder="Leave blank or click 'Auto-Generate About Me'..."
                      className="w-full p-2 border border-slate-300 rounded-md bg-white dark:bg-slate-800"
                    />
                  </div>

                  {/* Confidential Teacher Bank Account Details (Strictly Admin-Only Payouts) */}
                  <div className="p-3 bg-slate-900 text-white rounded-lg border border-amber-400/50 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                        🔒 Confidential Bank Details for Direct Admin Fee Payout (Visible ONLY to Admin)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                        Never Public
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={regBankHolder}
                        onChange={(e) => setRegBankHolder(e.target.value)}
                        placeholder="Account Holder Name"
                        className="px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded text-white"
                      />
                      <input
                        type="text"
                        value={regBankName}
                        onChange={(e) => setRegBankName(e.target.value)}
                        placeholder="Bank Name (e.g. SBI, HDFC)"
                        className="px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded text-white"
                      />
                      <input
                        type="text"
                        value={regBankAccount}
                        onChange={(e) => setRegBankAccount(e.target.value)}
                        placeholder="Bank Account Number"
                        className="px-2.5 py-1.5 text-xs font-mono bg-slate-800 border border-slate-700 rounded text-white"
                      />
                      <input
                        type="text"
                        value={regBankIfsc}
                        onChange={(e) => setRegBankIfsc(e.target.value.toUpperCase())}
                        placeholder="IFSC Code (e.g. SBIN0001234)"
                        className="px-2.5 py-1.5 text-xs font-mono uppercase bg-slate-800 border border-slate-700 rounded text-white"
                      />
                      <input
                        type="text"
                        value={regUpiId}
                        onChange={(e) => setRegUpiId(e.target.value)}
                        placeholder="UPI ID (Optional)"
                        className="px-2.5 py-1.5 text-xs font-mono bg-slate-800 border border-slate-700 rounded text-white"
                      />
                      <input
                        type="text"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Set Login Password"
                        className="px-2.5 py-1.5 text-xs font-mono bg-slate-800 border border-amber-400/60 rounded text-amber-200"
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Dual-Channel Single OTP Verification Step inside Quick Tutor Registration */
                <div className="p-4 bg-emerald-50 dark:bg-slate-800 border-2 border-emerald-500 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Verify Single OTP Sent to Both Mobile &amp; Email
                    </span>
                    <button
                      type="button"
                      onClick={() => setRegOtpStep(false)}
                      className="text-[11px] underline text-slate-600"
                    >
                      ← Edit Details
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-2.5 bg-white dark:bg-slate-900 border border-emerald-300 rounded flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#ff6600]" />
                      <div>
                        <p className="font-bold">Mobile SMS OTP ({regMobile})</p>
                        <p className="text-emerald-700 font-mono font-bold">OTP: {regGeneratedOtp}</p>
                      </div>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-900 border border-emerald-300 rounded flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#084d75]" />
                      <div>
                        <p className="font-bold">Email OTP ({regEmail})</p>
                        <p className="text-emerald-700 font-mono font-bold">OTP: {regGeneratedOtp}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold">Enter 6-Digit Common OTP *</label>
                      <button
                        type="button"
                        onClick={() => setRegEnteredOtp(regGeneratedOtp)}
                        className="text-[11px] font-bold text-[#084d75] underline cursor-pointer"
                      >
                        Auto-Fill OTP ({regGeneratedOtp})
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={regEnteredOtp}
                      onChange={(e) => setRegEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-3 py-2 text-center text-base font-mono font-bold tracking-widest border-2 border-[#084d75] rounded-md bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setQuickRegisterOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 font-bold uppercase tracking-wide text-white rounded-md cursor-pointer ${
                    regOtpStep ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#ff6600] hover:bg-[#e05500]'
                  }`}
                >
                  {regOtpStep
                    ? 'Verify Common OTP & Publish Tutor Profile'
                    : 'Send Single OTP to Mobile & Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
