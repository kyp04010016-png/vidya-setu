import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Lock,
  CheckCircle2,
  MessageCircle,
  Video,
  Star,
  RotateCcw,
  Shield,
  Trash2,
  Save,
  MapPin,
} from 'lucide-react';
import { TutorItem, ReviewItem } from '../data/seedData';
import { TutorCard } from './TutorCard';

interface TutorProfileViewProps {
  tutor: TutorItem;
  allTutors: TutorItem[];
  reviews: ReviewItem[];
  savedTutorIds: string[];
  isContactUnlocked: boolean;
  unlockFeePrice?: number;
  isAdmin?: boolean;
  onBack: () => void;
  onRequestDemo: (tutor: TutorItem, isOnlineDemo?: boolean) => void;
  onOpenPaymentUnlockModal: (tutor: TutorItem) => void;
  onWhatsAppClick: (tutor: TutorItem) => void;
  onPostTuitionNeeds: () => void;
  onPostProfileForFree: () => void;
  onSelectSimilarTutor: (tutor: TutorItem) => void;
  onToggleSave: (tutorId: string) => void;
  onSubmitReview: (rating: number, comment: string) => void;
  onDeleteTutor?: (tutorId: string) => void;
  onAdminUpdateTutor?: (updatedTutor: TutorItem) => void;
}

export const TutorProfileView: React.FC<TutorProfileViewProps> = ({
  tutor,
  allTutors,
  reviews,
  savedTutorIds,
  isContactUnlocked,
  unlockFeePrice = 99,
  isAdmin = false,
  onBack,
  onRequestDemo,
  onOpenPaymentUnlockModal,
  onWhatsAppClick,
  onPostTuitionNeeds,
  onPostProfileForFree,
  onSelectSimilarTutor,
  onToggleSave,
  onSubmitReview,
  onDeleteTutor,
  onAdminUpdateTutor,
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');
  const [showSimilar, setShowSimilar] = useState<boolean>(true);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Admin quick-edit states on profile page
  const [editMonthlyRate, setEditMonthlyRate] = useState<number>(
    tutor.monthlyRate || Math.max(1500, tutor.hourlyRate * 10)
  );
  const [editDurationMonths, setEditDurationMonths] = useState<number>(
    tutor.minDurationMonths || 3
  );
  const [editHourlyRate, setEditHourlyRate] = useState<number>(tutor.hourlyRate);
  const [editBlockName, setEditBlockName] = useState<string>(
    tutor.blockName || tutor.localityName
  );
  const [editPincode, setEditPincode] = useState<string>(tutor.pincode || '801503');
  const [adminSavedMsg, setAdminSavedMsg] = useState<string>('');

  const tutorNumericId =
    tutor.tutorNumericId ||
    String(
      1584100 +
        Math.abs(
          tutor.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
        )
    );
  const country = tutor.country || 'India';
  const stateName = tutor.state || 'Bihar';
  const blockName = tutor.blockName || tutor.localityName;
  const pincode = tutor.pincode || '801503';
  const preferredTime = tutor.preferredTime || 'AnyTime';
  const memberSince = tutor.memberSince || 'May 2025';
  const categories = tutor.categories || tutor.courses[0] || 'Class 6 to 10';
  const monthlyRate = tutor.monthlyRate || Math.max(1500, tutor.hourlyRate * 10);
  const minDurationMonths = tutor.minDurationMonths || 3;
  const realPhone = tutor.phone || '+91 94310 58415';
  const realEmail =
    tutor.email || `${tutor.name.toLowerCase().replace(/\s+/g, '.')}@vidyasetu.in`;
  const realAddress =
    tutor.address || `#102, ${tutor.localityName}, Block ${blockName}, ${tutor.cityName}, ${stateName}, ${country} - ${pincode}`;

  const modes = tutor.modes || {
    studentHome: tutor.tuitionType === 'HOME_TUITION',
    tutorHome: tutor.tuitionType === 'AT_TUTOR_HOME',
    institute: tutor.tuitionType === 'AT_INSTITUTE',
    online: tutor.tuitionType === 'ONLINE' || true,
  };

  const tutorReviews = reviews.filter((r) => r.tutorId === tutor.id && r.isApproved);
  const similarTutors = allTutors
    .filter(
      (t) =>
        t.id !== tutor.id &&
        t.isApproved &&
        (t.cityId === tutor.cityId ||
          t.pincode === tutor.pincode ||
          t.localityName.toLowerCase() === tutor.localityName.toLowerCase())
    )
    .slice(0, 4);

  const initialLetter = (tutor.initials || tutor.name || 'T').charAt(0).toUpperCase();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* ==================== OWNER ADMIN DIRECT CONTROL BAR ON PROFILE ==================== */}
      {isAdmin && (
        <div className="mb-5 p-4 bg-amber-50 dark:bg-slate-800 border-2 border-[#ff6600] rounded-lg space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#ff6600]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#084d75] dark:text-amber-300">
                Owner Admin Direct Profile Control — Edit Teacher Fee / Location or Delete Profile
              </span>
            </div>
            <div className="flex items-center gap-2">
              {adminSavedMsg && (
                <span className="text-xs font-bold text-emerald-700">{adminSavedMsg}</span>
              )}
              {onDeleteTutor && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteTutor(tutor.id);
                    onBack();
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete This Teacher Profile</span>
                </button>
              )}
            </div>
          </div>

          {onAdminUpdateTutor && (
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 items-end">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Fee (₹/Month)
                </label>
                <input
                  type="number"
                  value={editMonthlyRate}
                  onChange={(e) => setEditMonthlyRate(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 rounded-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Duration (Months)
                </label>
                <input
                  type="number"
                  value={editDurationMonths}
                  onChange={(e) => setEditDurationMonths(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 rounded-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hourly Rate (₹/Hr)
                </label>
                <input
                  type="number"
                  value={editHourlyRate}
                  onChange={(e) => setEditHourlyRate(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 rounded-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Block (प्रखंड)
                </label>
                <input
                  type="text"
                  value={editBlockName}
                  onChange={(e) => setEditBlockName(e.target.value)}
                  className="w-full px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 rounded-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pin Code
                </label>
                <input
                  type="text"
                  value={editPincode}
                  onChange={(e) => setEditPincode(e.target.value)}
                  className="w-full px-2 py-1 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 rounded-xs"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  onAdminUpdateTutor({
                    ...tutor,
                    monthlyRate: Number(editMonthlyRate) || 3000,
                    minDurationMonths: Number(editDurationMonths) || 3,
                    hourlyRate: Number(editHourlyRate) || 300,
                    blockName: editBlockName.trim() || tutor.localityName,
                    pincode: editPincode.trim() || '801503',
                  });
                  setAdminSavedMsg('✓ Profile Updated!');
                  setTimeout(() => setAdminSavedMsg(''), 2500);
                }}
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#084d75] hover:bg-[#063a58] rounded-xs inline-flex items-center justify-center gap-1 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== TOP HEADER BAR (Matches image_8723163d.png) ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-lg sm:text-[21px] leading-snug text-slate-800 dark:text-slate-100">
            <span className="font-bold text-[#1a75bc] dark:text-sky-400">{tutor.name}</span>{' '}
            <span className="text-slate-700 dark:text-slate-300 font-normal">
              (TutorId:<strong className="font-bold">{tutorNumericId}</strong>)-Home Tutor from{' '}
              {tutor.localityName} (Block: {blockName}) , {tutor.cityName}, {stateName}, {country}
            </span>
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>{tutor.gender}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-[#ff6600]" />
              {tutor.localityName}, Block {blockName}, {tutor.cityName} - {pincode} ({country})
            </span>
            <span className="font-bold text-[#e66000]">
              ₹{monthlyRate.toLocaleString('en-IN')}/Month ({minDurationMonths} Months Course)
            </span>
            <span>{modes.studentHome ? "At Student's Home" : 'Home Tuition'}</span>
            {modes.online && (
              <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                <Video className="w-3.5 h-3.5" />
                <span>Online Live Classes Available</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 self-start">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1a75bc] hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={() => onRequestDemo(tutor, false)}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-white bg-[#ff6600] hover:bg-[#e05500] rounded-xs shadow-2xs transition-colors cursor-pointer"
          >
            REQUEST FREE DEMO
          </button>
        </div>
      </div>

      {/* ==================== MAIN SUMMARY CARD (Matches image_8723163d.png) ==================== */}
      <div className="mt-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xs shadow-2xs p-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Key-Value Rows including District, Block, Pin Code, Monthly Fee & Months Duration */}
          <div className="lg:col-span-5 space-y-2 text-[13px]">
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">
                Age &amp; Gender
              </span>
              <span className="col-span-7 font-bold text-slate-800 dark:text-slate-100">
                {tutor.age} Years &amp; {tutor.gender}
              </span>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">
                Experience
              </span>
              <span className="col-span-7 font-bold text-slate-800 dark:text-slate-100">
                {tutor.experienceYrs} year(s)
              </span>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">
                Qualification
              </span>
              <span className="col-span-7 font-bold text-slate-800 dark:text-slate-100">
                {tutor.qualification}
              </span>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">
                Monthly Tuition Fee
              </span>
              <span className="col-span-7 font-bold text-[#e66000]">
                ₹{monthlyRate.toLocaleString('en-IN')} / Month ({minDurationMonths} Months Min.)
              </span>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">
                Preferred Time
              </span>
              <span className="col-span-7 font-bold text-slate-800 dark:text-slate-100">
                {preferredTime}
              </span>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">
                District &amp; Country
              </span>
              <span className="col-span-7 font-bold text-slate-800 dark:text-slate-100">
                {tutor.cityName}, {stateName} ({country})
              </span>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-5 text-slate-600 dark:text-slate-400 font-medium">
                Block &amp; Locality
              </span>
              <span className="col-span-7 text-slate-800 dark:text-slate-100">
                <strong className="font-bold">Block: {blockName}</strong> ({tutor.localityName}){' '}
                <span className="text-slate-600 dark:text-slate-400 ml-1">Pin:</span>{' '}
                <strong className="font-bold font-mono">{pincode}</strong>
              </span>
            </div>
          </div>

          {/* Center Column: Contact Info Box (Masked until Payment, Unlocks after Payment!) */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-full border border-sky-200 bg-sky-50 text-[#1a75bc] inline-flex items-center justify-center">
                <Phone className="w-3.5 h-3.5" />
              </span>
              <h2 className="text-lg font-medium text-[#1a75bc] dark:text-sky-400">
                Contact Info
              </h2>
            </div>

            <div className="w-full border border-dashed border-slate-400 dark:border-slate-600 bg-[#eeeeee] dark:bg-slate-800/90 p-4 rounded-xs relative min-h-[145px] flex flex-col justify-center">
              {isContactUnlocked || isAdmin ? (
                /* UNLOCKED STATE (After Payment Completed or Admin!) */
                <div className="space-y-2 text-xs text-slate-800 dark:text-slate-100">
                  <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-700 pb-1.5 mb-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {isAdmin ? 'Admin Full Access — Contact Visible' : 'Payment Verified — Contact Unlocked'}
                      </span>
                    </span>
                  </div>
                  <p>
                    <strong className="text-slate-600 dark:text-slate-400">Phone:</strong>{' '}
                    <a
                      href={`tel:${realPhone.replace(/\s+/g, '')}`}
                      className="font-mono font-bold text-[#0088cc] hover:underline"
                    >
                      {realPhone}
                    </a>
                  </p>
                  <p>
                    <strong className="text-slate-600 dark:text-slate-400">Email:</strong>{' '}
                    <span className="font-mono">{realEmail}</span>
                  </p>
                  <p>
                    <strong className="text-slate-600 dark:text-slate-400">Full Address:</strong>{' '}
                    <span>{realAddress}</span>
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => onWhatsAppClick(tutor)}
                      className="w-full py-2 px-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs rounded-xs inline-flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Direct WhatsApp Tutor ({realPhone})</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* LOCKED / BLURRED STATE BEFORE PAYMENT */
                <>
                  <div className="space-y-1.5 text-xs text-slate-500 select-none blur-[2.5px] opacity-75 pointer-events-none">
                    <p>
                      <strong>Phone</strong> +91 98XXXXXX99
                    </p>
                    <p>
                      <strong>WhatsApp</strong> +91 98XXXXXX99
                    </p>
                    <p>
                      <strong>Email</strong> xxxxx@xxx.com
                    </p>
                    <p>
                      <strong>Address</strong> #102, {tutor.localityName}, {tutor.cityName}
                    </p>
                  </div>

                  {/* Overlay Orange Action Buttons */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 p-3">
                    <button
                      type="button"
                      onClick={() => onOpenPaymentUnlockModal(tutor)}
                      className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white bg-[#ff6600] hover:bg-[#e05500] rounded-xs shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Lock className="w-3 h-3" />
                      <span>PAY ₹{unlockFeePrice} TO UNLOCK CONTACT</span>
                    </button>

                    <button
                      type="button"
                      onClick={onPostTuitionNeeds}
                      className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white bg-[#ff6600] hover:bg-[#e05500] rounded-xs shadow-sm cursor-pointer"
                    >
                      POST TUITION NEEDS (FREE)
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Ratings + Large Blue Initial Square with Gold "Featured" Ribbon */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
              {tutorReviews.length > 0 ? (
                <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>
                    {tutor.ratingAvg.toFixed(1)} ({tutorReviews.length} Reviews)
                  </span>
                </span>
              ) : (
                'No Ratings yet'
              )}
            </p>

            <div className="relative p-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xs shadow-xs">
              <div
                className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center text-white font-sans text-5xl font-bold select-none"
                style={{ backgroundColor: tutor.avatarSvgBg || '#4a89dc' }}
              >
                {initialLetter}
              </div>

              {tutor.isFeatured && (
                <div className="absolute -bottom-2 inset-x-1 bg-gradient-to-r from-[#d49b17] via-[#f7ce5b] to-[#d49b17] border border-[#9c6f08] text-[#3b2800] text-center text-xs font-bold py-0.5 shadow-xs">
                  Featured
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Gray Strip inside Summary Box */}
        <div className="mt-6 bg-[#f2f2f2] dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-slate-700 dark:text-slate-300">
            <span>
              Last Login <strong className="font-bold ml-1">{tutor.lastLogin || '24 Oct 2026'}</strong>
            </span>

            <div className="flex items-center gap-1.5">
              <span
                title="Phone OTP Verified"
                className="w-6 h-5 border border-slate-400 bg-white dark:bg-slate-900 rounded-2xs inline-flex items-center justify-center"
              >
                <Phone className="w-3.5 h-3.5 text-[#5cb85c] fill-[#5cb85c]" />
              </span>
              <span
                title={tutor.emailVerified ? 'Email OTP Verified' : 'Email Registered'}
                className="w-6 h-5 border border-slate-400 bg-white dark:bg-slate-900 rounded-2xs inline-flex items-center justify-center"
              >
                <Mail
                  className={`w-3.5 h-3.5 ${
                    tutor.emailVerified ? 'text-[#5cb85c]' : 'text-slate-400'
                  }`}
                />
              </span>
            </div>

            <span>
              Member since <strong className="font-semibold">{memberSince}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {modes.online && (
              <button
                type="button"
                onClick={() => onRequestDemo(tutor, true)}
                className="px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-white bg-[#2b729c] hover:bg-[#1f597a] rounded-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Video className="w-3.5 h-3.5" />
                <span>BOOK ONLINE LIVE CLASS</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onRequestDemo(tutor, false)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wide text-white bg-[#ff6600] hover:bg-[#e05500] rounded-xs cursor-pointer"
            >
              GET FREE DEMO CLASS
            </button>
          </div>
        </div>
      </div>

      {/* ==================== LOWER 2-COLUMN SECTION: ABOUT/REVIEWS TABS + PROMO SIDEBAR ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Left 8 Columns: About & Reviews Tabs */}
        <div className="lg:col-span-8">
          {/* Tab Headers */}
          <div className="flex items-center gap-1 border-b border-slate-300 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`px-5 py-2.5 text-xs font-bold border-t border-x rounded-t-xs -mb-px cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white'
                  : 'bg-[#f2f2f2] dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              About
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`px-5 py-2.5 text-xs font-bold border-t border-x rounded-t-xs -mb-px cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white'
                  : 'bg-[#f2f2f2] dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              Reviews ({tutorReviews.length})
            </button>
          </div>

          {/* Tab Body */}
          <div className="bg-white dark:bg-slate-900 border border-t-0 border-slate-300 dark:border-slate-700 p-6 rounded-b-xs shadow-2xs">
            {activeTab === 'about' ? (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {/* 1. About Me */}
                <div className="pb-5">
                  <h3 className="text-[15px] font-medium text-[#d9531e] mb-2">About Me</h3>
                  <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                    {tutor.bio}
                  </p>
                </div>

                {/* 2. Complete Location (India -> Bihar -> District -> Block -> Locality -> Pin Code) */}
                <div className="py-4">
                  <h3 className="text-[15px] font-medium text-[#d9531e] mb-1.5">
                    Complete Service Location &amp; Pin Code
                  </h3>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100">
                    Locality: {tutor.localityName} • Block: {blockName} • District: {tutor.cityName} • State: {stateName} • Country: {country} • Pin Code: {pincode}
                  </p>
                </div>

                {/* 3. Categories */}
                <div className="py-4">
                  <h3 className="text-[15px] font-medium text-[#d9531e] mb-1.5">Categories</h3>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100">
                    {categories}
                  </p>
                </div>

                {/* 4. Courses */}
                <div className="py-4">
                  <h3 className="text-[15px] font-medium text-[#d9531e] mb-1.5">Courses</h3>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100">
                    {tutor.courses.join(', ')}
                  </p>
                </div>

                {/* 5. Subjects */}
                <div className="py-4">
                  <h3 className="text-[15px] font-medium text-[#d9531e] mb-1.5">Subjects</h3>
                  <p className="text-[13px] text-slate-700 dark:text-slate-300">
                    {tutor.subjects.join(', ')}
                  </p>
                </div>

                {/* 6. Teacher Fee Structure (Monthly Fee, Months Duration, and Hourly Rate) */}
                <div className="py-4">
                  <h3 className="text-[15px] font-medium text-[#d9531e] mb-1.5">
                    Teacher Fee Structure (Monthly Fee, Course Duration &amp; Hourly Rate)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px] mt-2">
                    <div className="p-2.5 bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xs">
                      <span className="block text-[11px] text-slate-500">Monthly Tuition Fee</span>
                      <strong className="text-base font-bold text-[#e66000]">
                        ₹{monthlyRate.toLocaleString('en-IN')} / Month
                      </strong>
                    </div>
                    <div className="p-2.5 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-xs">
                      <span className="block text-[11px] text-slate-500">Course Duration (Months)</span>
                      <strong className="text-base font-bold text-[#084d75] dark:text-sky-300">
                        {minDurationMonths} Month(s) (₹{(monthlyRate * minDurationMonths).toLocaleString('en-IN')} Total)
                      </strong>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xs">
                      <span className="block text-[11px] text-slate-500">Hourly / Demo Price</span>
                      <strong className="text-base font-bold text-slate-800 dark:text-slate-100">
                        Rs {tutor.hourlyRate} / Hour
                      </strong>
                    </div>
                  </div>
                </div>

                {/* 7. Tutoring Mode */}
                <div className="pt-4">
                  <h3 className="text-[15px] font-medium text-[#d9531e] mb-2">Tutoring Mode</h3>
                  <div className="space-y-1.5 text-[13px] font-bold text-slate-800 dark:text-slate-200">
                    <p>At Student&apos;s Home : {modes.studentHome ? 'Yes' : 'No'}</p>
                    <p>At Tutor&apos;s Home : {modes.tutorHome ? 'Yes' : 'No'}</p>
                    <p>At Institute : {modes.institute ? 'Yes' : 'No'}</p>
                    <p>
                      Online Tuition :{' '}
                      <span className={modes.online ? 'text-emerald-700 dark:text-emerald-400' : ''}>
                        {modes.online ? 'Yes (Live Interactive 1-on-1 Classes Available)' : 'No'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Reviews Tab */
              <div className="space-y-6">
                <div>
                  <h3 className="text-[15px] font-medium text-[#d9531e] mb-3">
                    Verified Student &amp; Parent Reviews for {tutor.name}
                  </h3>
                  {tutorReviews.length === 0 ? (
                    <p className="text-xs text-slate-500">
                      No ratings yet for {tutor.name}. Be the first student or parent to write a review below!
                    </p>
                  ) : (
                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                      {tutorReviews.map((rev) => (
                        <div key={rev.id} className="py-3 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {rev.reviewerName}
                            </span>
                            <span className="font-mono font-bold text-amber-600">
                              ★ {rev.rating}.0 / 5.0
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            {rev.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Write a Review Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newComment.trim()) return;
                    onSubmitReview(newRating, newComment.trim());
                    setNewComment('');
                    setReviewSubmitted(true);
                  }}
                  className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 text-xs"
                >
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">
                    Write a Review for {tutor.name}
                  </h4>
                  {reviewSubmitted && (
                    <p className="text-emerald-700 font-semibold">
                      ✓ Thank you! Your review has been recorded.
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    <label className="font-medium text-slate-600">Rating:</label>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="px-2.5 py-1 border border-slate-300 rounded-xs bg-white dark:bg-slate-800"
                    >
                      <option value={5}>5 Stars (Excellent)</option>
                      <option value={4}>4 Stars (Good)</option>
                      <option value={3}>3 Stars (Average)</option>
                    </select>
                  </div>
                  <textarea
                    rows={3}
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={`Share your learning experience with ${tutor.name}...`}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xs bg-white dark:bg-slate-800"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold uppercase text-white bg-[#ff6600] hover:bg-[#e05500] rounded-xs cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Columns: Promotional Sidebar Box */}
        <aside className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-4 rounded-xs shadow-2xs">
          <div className="bg-[#f5f5f5] dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-6 text-center space-y-6">
            {/* Top Half: Looking for Home Tutors? */}
            <div className="space-y-3">
              <p className="text-xs text-slate-700 dark:text-slate-300">
                are you a student / parent
              </p>
              <h3 className="font-serif italic text-xl font-bold text-[#1a75bc] dark:text-sky-400">
                Looking for Home Tutors?
              </h3>

              <div className="w-28 h-28 mx-auto rounded-full bg-[#ff6600] flex items-center justify-center relative overflow-hidden shadow-xs">
                <svg viewBox="0 0 100 100" className="w-24 h-24">
                  <circle cx="72" cy="28" r="12" fill="#ffffff" stroke="#333" strokeWidth="2" />
                  <path d="M72 22 v6 h5" stroke="#333" strokeWidth="2" fill="none" />
                  <circle cx="42" cy="38" r="14" fill="#fcd5b5" stroke="#333" strokeWidth="2" />
                  <path d="M28 34 c5 -12 24 -12 28 0" fill="#2c1810" />
                  <rect x="24" y="52" width="36" height="22" rx="4" fill="#7cb342" stroke="#333" strokeWidth="2" />
                  <rect x="16" y="70" width="56" height="8" fill="#d7ccc8" stroke="#333" strokeWidth="2" />
                </svg>
              </div>

              <button
                type="button"
                onClick={onPostTuitionNeeds}
                className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wide text-white bg-[#ff6600] hover:bg-[#e05500] rounded-xs shadow-xs transition-colors cursor-pointer"
              >
                POST TUITION NEEDS FOR FREE
              </button>
            </div>

            <div className="border-t border-dashed border-slate-400 dark:border-slate-600" />

            {/* Bottom Half: Looking for Students? */}
            <div className="space-y-3">
              <p className="text-xs text-slate-700 dark:text-slate-300">are you a Home Tutor</p>
              <h3 className="font-serif italic text-xl font-bold text-[#1a75bc] dark:text-sky-400">
                Looking for Students?
              </h3>

              <div className="w-28 h-28 mx-auto rounded-full bg-[#ff6600] flex items-center justify-center relative overflow-hidden shadow-xs">
                <svg viewBox="0 0 100 100" className="w-24 h-24">
                  <rect x="46" y="22" width="36" height="26" fill="#2e7d32" stroke="#fff" strokeWidth="2" />
                  <text x="52" y="38" fill="#fff" fontSize="10" fontWeight="bold">
                    A B C
                  </text>
                  <circle cx="34" cy="40" r="13" fill="#fcd5b5" stroke="#333" strokeWidth="2" />
                  <rect x="22" y="54" width="24" height="26" rx="3" fill="#5d4037" stroke="#333" strokeWidth="2" />
                  <line x1="46" y1="58" x2="60" y2="38" stroke="#fff" strokeWidth="2" />
                </svg>
              </div>

              <button
                type="button"
                onClick={onPostProfileForFree}
                className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wide text-white bg-[#ff6600] hover:bg-[#e05500] rounded-xs shadow-xs transition-colors cursor-pointer"
              >
                POST PROFILE FOR FREE
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* ==================== BOTTOM "SIMILAR TUTORS" BUTTON & GRID ==================== */}
      <div className="mt-10 text-center">
        <button
          type="button"
          onClick={() => setShowSimilar((prev) => !prev)}
          className="px-6 py-2 bg-white dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded-xs text-[#8a4b08] dark:text-amber-400 text-base font-medium shadow-2xs hover:bg-slate-50 cursor-pointer"
        >
          Similar &amp; Nearby Tutors in {tutor.cityName}
        </button>

        {showSimilar && similarTutors.length > 0 && (
          <div className="mt-6 text-left grid grid-cols-1 md:grid-cols-2 gap-5">
            {similarTutors.map((sim) => (
              <TutorCard
                key={sim.id}
                tutor={sim}
                viewMode="grid"
                isSaved={savedTutorIds.includes(sim.id)}
                whatsappActive={true}
                isAdmin={isAdmin}
                onToggleSave={onToggleSave}
                onSelectProfile={onSelectSimilarTutor}
                onOpenInquiry={(t) => onRequestDemo(t, false)}
                onWhatsAppClick={onWhatsAppClick}
                onDeleteTutor={onDeleteTutor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
