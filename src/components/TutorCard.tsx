import React from 'react';
import {
  MapPin,
  GraduationCap,
  FileText,
  BookOpen,
  Calendar,
  Phone,
  Mail,
  Bookmark,
  MessageCircle,
  Trash2,
  Shield,
  Star,
  Eye,
  EyeOff,
} from 'lucide-react';
import { TutorItem } from '../data/seedData';

interface TutorCardProps {
  tutor: TutorItem;
  viewMode: 'grid' | 'list';
  isSaved: boolean;
  whatsappActive: boolean;
  isNearby?: boolean;
  isAdmin?: boolean;
  onToggleSave: (tutorId: string) => void;
  onSelectProfile: (tutor: TutorItem) => void;
  onOpenInquiry: (tutor: TutorItem) => void;
  onWhatsAppClick: (tutor: TutorItem) => void;
  onDeleteTutor?: (tutorId: string) => void;
  onToggleApproveTutor?: (tutorId: string) => void;
  onToggleFeatureTutor?: (tutorId: string) => void;
}

function formatLastLoginDate(raw: string): string {
  if (!raw) return '24-Oct-26';
  if (/^\d{2}-[A-Za-z]{3}-\d{2}$/.test(raw)) return raw;
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw.slice(0, 10);
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mon = months[d.getMonth()];
    const yr = String(d.getFullYear()).slice(-2);
    return `${day}-${mon}-${yr}`;
  } catch {
    return '24-Oct-26';
  }
}

export const TutorCard: React.FC<TutorCardProps> = ({
  tutor,
  viewMode,
  isSaved,
  whatsappActive,
  isNearby = false,
  isAdmin = false,
  onToggleSave,
  onSelectProfile,
  onOpenInquiry,
  onWhatsAppClick,
  onDeleteTutor,
  onToggleApproveTutor,
  onToggleFeatureTutor,
}) => {
  const formattedLogin = formatLastLoginDate(tutor.lastLogin);
  const monthlyFee = tutor.monthlyRate || Math.max(1500, tutor.hourlyRate * 10);
  const durationMonths = tutor.minDurationMonths || 3;

  return (
    <article
      className={`relative bg-white dark:bg-slate-900 border ${
        isNearby
          ? 'border-emerald-500 ring-1 ring-emerald-500/30'
          : 'border-slate-300 dark:border-slate-700'
      } rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-md transition-all duration-150 pt-5 pb-4 px-4 ${
        viewMode === 'list' ? 'flex flex-col md:flex-row md:items-center md:justify-between gap-4' : 'flex flex-col justify-between'
      }`}
    >
      {/* Top-Left Angled "Featured" Ribbon Tag */}
      {tutor.isFeatured && (
        <div
          className="absolute -top-2.5 left-3 z-10 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs border border-[#9c6f08] bg-gradient-to-b from-[#ffe58f] via-[#f7c948] to-[#e0a816] text-[#3b2800] text-[11px] font-semibold shadow-2xs -rotate-6 select-none"
          title="Featured Verified Tutor"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white border border-[#7c5806]" />
          <span>Featured</span>
        </div>
      )}

      {/* Nearby Badge if matching user's Pincode / Block / District */}
      {isNearby && (
        <div
          className="absolute -top-2.5 right-8 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-emerald-600 text-white text-[10px] font-bold shadow-2xs select-none"
          title="Registered Teacher Near Your Location"
        >
          <MapPin className="w-2.5 h-2.5" />
          <span>Nearby Teacher</span>
        </div>
      )}

      {/* Bookmark button in top-right corner */}
      <button
        type="button"
        onClick={() => onToggleSave(tutor.id)}
        aria-label={isSaved ? 'Remove from saved tutors' : 'Save tutor'}
        title={isSaved ? 'Saved' : 'Save Tutor'}
        className={`absolute top-1.5 right-1.5 p-1 rounded-xs transition-colors ${
          isSaved
            ? 'text-[#ff6600]'
            : 'text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400'
        }`}
      >
        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
      </button>

      <div className="flex-1 min-w-0">
        {/* Top Header: Silhouette Avatar + Name/Age/Gender/Exp + Price & Verification Icons */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {/* Classic Light-Blue Silhouette Avatar Box */}
            <button
              type="button"
              onClick={() => onSelectProfile(tutor)}
              className="w-14 h-14 rounded-xs bg-[#e3f2fd] border border-[#bbdefb] flex items-end justify-center overflow-hidden shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
              aria-label={`View profile of ${tutor.name}`}
            >
              <svg
                viewBox="0 0 64 64"
                className="w-12 h-12 text-[#90caf9]"
                fill="currentColor"
                aria-hidden="true"
              >
                <circle cx="32" cy="22" r="12" />
                <path d="M10 58c0-11.5 9.8-20 22-20s22 8.5 22 20H10z" />
              </svg>
            </button>

            <div className="min-w-0 pt-0.5">
              <button
                type="button"
                onClick={() => onSelectProfile(tutor)}
                className="text-left font-sans text-[16px] font-bold text-[#0088cc] hover:underline truncate block max-w-full cursor-pointer"
              >
                {tutor.name}
              </button>
              <p className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                Age: {tutor.age}Y, {tutor.gender}, Exp:{tutor.experienceYrs} Y
              </p>
              <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                ₹{monthlyFee.toLocaleString('en-IN')}/Mo • {durationMonths} Months Course
              </p>
            </div>
          </div>

          {/* Right Column: Hourly Rate + Monthly Badge + Phone/Email/WhatsApp Verification Badges */}
          <div className="flex flex-col items-end shrink-0 pr-2">
            <div className="inline-flex items-center gap-1 text-xs tabular-nums">
              <span className="w-4 h-4 rounded-full border border-slate-400 text-slate-500 inline-flex items-center justify-center text-[10px] font-bold">
                ₹
              </span>
              <span className="font-bold text-sm text-[#e66000]">{tutor.hourlyRate}</span>
              <span className="text-[11px] font-semibold text-[#e66000]">/ H</span>
            </div>

            <div className="flex items-center gap-1 mt-1.5">
              <span
                title={tutor.phoneVerified ? 'Phone OTP Verified' : 'Phone Pending'}
                className="w-6 h-5 border border-slate-300 dark:border-slate-700 rounded-xs bg-white dark:bg-slate-800 inline-flex items-center justify-center"
              >
                <Phone
                  className={`w-3.5 h-3.5 ${
                    tutor.phoneVerified ? 'text-[#5cb85c] fill-[#5cb85c]' : 'text-slate-400'
                  }`}
                />
              </span>
              <span
                title={tutor.emailVerified ? 'Email OTP Verified' : 'Email Verified Status'}
                className={`w-6 h-5 border border-slate-300 dark:border-slate-700 rounded-xs inline-flex items-center justify-center ${
                  tutor.emailVerified
                    ? 'bg-white dark:bg-slate-800'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <Mail
                  className={`w-3.5 h-3.5 ${
                    tutor.emailVerified ? 'text-[#5cb85c]' : 'text-slate-600 dark:text-slate-400'
                  }`}
                />
              </span>
              {whatsappActive && (
                <button
                  type="button"
                  onClick={() => onWhatsAppClick(tutor)}
                  title={`WhatsApp ${tutor.name}`}
                  className="w-6 h-5 border border-emerald-500 rounded-xs bg-[#25D366] text-white inline-flex items-center justify-center hover:opacity-90 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4 Dotted Metadata Rows: Full Location (Locality, Block, District, Pincode, India), Qualification, Course, Subjects */}
        <div className="mt-3 divide-y divide-dotted divide-slate-300 dark:divide-slate-700 text-[13px] text-slate-700 dark:text-slate-300">
          <div className="py-1.5 flex items-center gap-2 truncate" title={`${tutor.address || ''} (${tutor.localityName}, Block: ${tutor.blockName || tutor.localityName}, ${tutor.cityName}, Bihar, India - ${tutor.pincode || ''})`}>
            <MapPin className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
            <span className="truncate">
              {tutor.localityName}
              {tutor.blockName && tutor.blockName.toLowerCase() !== tutor.localityName.toLowerCase()
                ? `, Block: ${tutor.blockName}`
                : ''}{' '}
              , {tutor.cityName}
              {tutor.pincode ? ` (${tutor.pincode})` : ''}
            </span>
          </div>

          <div className="py-1.5 flex items-center gap-2 truncate">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{tutor.qualification}</span>
          </div>

          <div className="py-1.5 flex items-center gap-2 truncate">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{tutor.courses.join(', ')}</span>
          </div>

          <div className="py-1.5 flex items-center gap-2 truncate">
            <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{tutor.subjects.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Footer: Last Login Date + VIEW PROFILE & GET FREE DEMO Buttons + Direct Admin Controls */}
      <div className={viewMode === 'list' ? 'md:w-56 shrink-0' : 'mt-1 pt-2 border-t border-dotted border-slate-300 dark:border-slate-700'}>
        <div className="flex items-center justify-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400 mb-2.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Last Login:</span>
          <span className="font-bold text-[#2e7d32] dark:text-emerald-400">{formattedLogin}</span>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onSelectProfile(tutor)}
            className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white bg-[#2c7a9b] hover:bg-[#1f5c77] rounded-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            VIEW PROFILE
          </button>
          <button
            type="button"
            onClick={() => onOpenInquiry(tutor)}
            className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white bg-[#ff6600] hover:bg-[#e05500] rounded-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            GET FREE DEMO
          </button>
        </div>

        {/* DIRECT HOME PAGE ADMIN CONTROLS (Delete, Approve/Hide, Feature) */}
        {isAdmin && (
          <div className="mt-2.5 pt-2 border-t border-amber-300 dark:border-amber-700 bg-amber-50/80 dark:bg-slate-800/90 px-2 py-1.5 rounded-xs flex flex-wrap items-center justify-between gap-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#084d75] dark:text-amber-300">
              <Shield className="w-3 h-3 text-[#ff6600]" />
              Admin:
            </span>
            <div className="flex items-center gap-1">
              {onToggleApproveTutor && (
                <button
                  type="button"
                  onClick={() => onToggleApproveTutor(tutor.id)}
                  title={tutor.isApproved ? 'Hide Tutor from Public' : 'Approve Tutor'}
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-xs inline-flex items-center gap-0.5 cursor-pointer ${
                    tutor.isApproved
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-amber-200 text-amber-900 hover:bg-amber-300'
                  }`}
                >
                  {tutor.isApproved ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                  <span>{tutor.isApproved ? 'Live' : 'Hidden'}</span>
                </button>
              )}
              {onToggleFeatureTutor && (
                <button
                  type="button"
                  onClick={() => onToggleFeatureTutor(tutor.id)}
                  title="Toggle Featured Ribbon"
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-xs inline-flex items-center gap-0.5 cursor-pointer ${
                    tutor.isFeatured
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <Star className="w-2.5 h-2.5" />
                  <span>Feat</span>
                </button>
              )}
              {onDeleteTutor && (
                <button
                  type="button"
                  onClick={() => onDeleteTutor(tutor.id)}
                  title="Permanently Delete Teacher from Home Page & Directory"
                  className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-600 hover:bg-red-700 rounded-xs inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
