import React, { useState } from 'react';
import { X, Loader2, CheckCircle2, Lock } from 'lucide-react';
import { TutorItem } from '../data/seedData';

interface InquiryModalProps {
  tutor: TutorItem | null;
  currentUser: { uid: string; name: string; email: string; mobile: string } | null;
  onClose: () => void;
  onSubmitInquiry: (data: {
    tutorId: string;
    tutorUserId: string;
    tutorName: string;
    name: string;
    email: string;
    mobile: string;
    message: string;
  }) => Promise<void>;
  onPromptLogin: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  tutor,
  currentUser,
  onClose,
  onSubmitInquiry,
  onPromptLogin,
}) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [mobile, setMobile] = useState(currentUser?.mobile || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!tutor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!/^[0-9+\-\s]{8,15}$/.test(mobile.trim())) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (message.trim().length < 10) {
      setError('Please describe the student class, subjects, and preferred timings (min 10 chars).');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitInquiry({
        tutorId: tutor.id,
        tutorUserId: tutor.userId,
        tutorName: tutor.name,
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        message: message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 animate-page-transition">
      <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <p className="text-xs text-slate-500">
              Direct Tuition Inquiry · {tutor.cityName} ({tutor.localityName})
            </p>
            <h3 className="font-display text-lg font-semibold text-slate-900 mt-0.5">
              Contact {tutor.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!currentUser && (
          <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <Lock className="w-4 h-4 text-blue-800 shrink-0" />
              <span>Sign in to track tutor replies in your Student Dashboard, or send a guest inquiry below.</span>
            </div>
            <button
              type="button"
              onClick={onPromptLogin}
              className="px-3 py-1.5 text-xs font-medium text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md whitespace-nowrap shrink-0 transition-colors"
            >
              Sign In
            </button>
          </div>
        )}

        {submitted ? (
          <div className="py-8 text-center space-y-3 animate-page-transition">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-display text-base font-semibold text-slate-900">
              Inquiry Sent to {tutor.name}
            </h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Your contact details and tuition requirements have been securely delivered. Expect a response within 4 business hours.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 px-5 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {error && (
              <div className="p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Student / Parent Name *
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rakesh Sharma"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-800"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={20}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                maxLength={150}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Class, Subjects & Preferred Schedule *
              </label>
              <textarea
                rows={3}
                required
                maxLength={1000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hi ${tutor.name}, we need home tuition in ${tutor.localityName} for ${tutor.subjects[0]}...`}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-900 disabled:opacity-60 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending Inquiry...</span>
                  </>
                ) : (
                  <span>Send Direct Inquiry</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
