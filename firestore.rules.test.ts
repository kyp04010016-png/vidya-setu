/**
 * Firestore Security Rules Test Suite — Dirty Dozen Verification
 * Verifies that all 12 adversarial payloads return PERMISSION_DENIED.
 */

export interface DirtyDozenTestCase {
  id: number;
  name: string;
  collection: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid: string; email: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TESTS: DirtyDozenTestCase[] = [
  {
    id: 1,
    name: 'Self-Assigned ADMIN Role on User Creation',
    collection: '/users/user_1',
    operation: 'create',
    auth: { uid: 'user_1', email: 'attacker@example.com', email_verified: true },
    payload: {
      uid: 'user_1',
      name: 'Attacker',
      role: 'ADMIN',
      isActive: true,
      emailVerified: true,
      phoneVerified: false,
      createdAt: 'SERVER_TIMESTAMP',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Shadow Field Injection on Tutor Creation',
    collection: '/tutors/tutor_1',
    operation: 'create',
    auth: { uid: 'user_1', email: 'tutor@example.com', email_verified: true },
    payload: {
      userId: 'user_1',
      name: 'Tutor One',
      slug: 'tutor-one',
      gender: 'Male',
      experienceYrs: 5,
      qualification: 'M.Sc Mathematics',
      bio: 'Experienced mathematics tutor for high school.',
      hourlyRate: 500,
      cityId: 'patna',
      cityName: 'Patna',
      localityName: 'Boring Road',
      tuitionType: 'HOME_TUITION',
      courses: ['Class 11-12'],
      subjects: ['Mathematics'],
      isFeatured: false,
      isApproved: false,
      ratingAvg: 5,
      reviewCount: 1,
      createdAt: 'SERVER_TIMESTAMP',
      isSuperVerified: true, // Ghost field
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Unverified Email Admin Spoof',
    collection: '/backups/backup_1',
    operation: 'create',
    auth: { uid: 'spoof_admin', email: 'kyp04010016@gmail.com', email_verified: false },
    payload: {
      createdByUid: 'spoof_admin',
      label: 'Spoof Backup',
      recordCount: 10,
      checksum: 'sha256_abc123',
      payloadJson: '{}',
      createdAt: 'SERVER_TIMESTAMP',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Cross-User PII Read on /users/{userId}/private/info',
    collection: '/users/user_1/private/info',
    operation: 'get',
    auth: { uid: 'user_2', email: 'other@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Identity Spoofing on Inquiry Creation',
    collection: '/inquiries/inq_1',
    operation: 'create',
    auth: { uid: 'user_1', email: 'student@example.com', email_verified: true },
    payload: {
      tutorId: 'tutor_1',
      tutorUserId: 'tutor_u1',
      tutorName: 'Dr. Rajesh',
      userId: 'user_999', // Spoofed UID
      name: 'Student',
      email: 'student@example.com',
      mobile: '9876543210',
      message: 'Need home tuition for Physics.',
      status: 'NEW',
      createdAt: 'SERVER_TIMESTAMP',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Client Timestamp Forgery on Review Creation',
    collection: '/reviews/rev_1',
    operation: 'create',
    auth: { uid: 'user_1', email: 'student@example.com', email_verified: true },
    payload: {
      tutorId: 'tutor_1',
      userId: 'user_1',
      reviewerName: 'Student One',
      rating: 5,
      comment: 'Great teacher!',
      isApproved: false,
      createdAt: '2020-01-01T00:00:00Z', // Forged past timestamp
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'ID Poisoning with Special Characters',
    collection: '/tutors/bad$id!@#',
    operation: 'create',
    auth: { uid: 'user_1', email: 'tutor@example.com', email_verified: true },
    payload: {},
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Unbounded Array on Tutor Subjects (>10 items)',
    collection: '/tutors/tutor_1',
    operation: 'create',
    auth: { uid: 'user_1', email: 'tutor@example.com', email_verified: true },
    payload: {
      subjects: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11'],
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Terminal State Unlocking on CLOSED Requirement',
    collection: '/requirements/req_closed',
    operation: 'update',
    auth: { uid: 'user_1', email: 'student@example.com', email_verified: true },
    payload: { status: 'OPEN' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Immutable Owner Mutation on Tutor Update',
    collection: '/tutors/tutor_1',
    operation: 'update',
    auth: { uid: 'user_1', email: 'tutor@example.com', email_verified: true },
    payload: { userId: 'user_2' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Value Poisoning on Tutor Hourly Rate Update',
    collection: '/tutors/tutor_1',
    operation: 'update',
    auth: { uid: 'user_1', email: 'tutor@example.com', email_verified: true },
    payload: { hourlyRate: 'INVALID_STRING_RATE' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Unauthorized Blanket List on Inquiries',
    collection: '/inquiries',
    operation: 'list',
    auth: { uid: 'random_user', email: 'random@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
];
