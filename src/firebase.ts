import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore at boot as required by skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export const VALIDATION_CONSTRAINTS = {
  ID_PATTERN: /^[a-zA-Z0-9_-]+$/,
  ID_MAX_LEN: 128,
  NAME_MAX_LEN: 100,
  EMAIL_MAX_LEN: 150,
  MOBILE_MAX_LEN: 20,
  BIO_MAX_LEN: 2000,
  MESSAGE_MAX_LEN: 1000,
  QUALIFICATION_MAX_LEN: 160,
  SLUG_MAX_LEN: 120,
} as const;

export function sanitizeString(val: string, maxLen: number, minLen = 1): string {
  const trimmed = val.trim().slice(0, maxLen);
  if (trimmed.length < minLen) {
    return trimmed.padEnd(minLen, '_');
  }
  return trimmed;
}

export function sanitizeId(val: string): string {
  const cleaned = val.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, VALIDATION_CONSTRAINTS.ID_MAX_LEN);
  return cleaned || 'id-default';
}

export async function signInWithGoogleRole(preferredRole: 'STUDENT' | 'TUTOR' = 'STUDENT') {
  const cred = await signInWithPopup(auth, googleProvider);
  const user = cred.user;
  const userDocRef = doc(db, 'users', user.uid);
  const privateDocRef = doc(db, 'users', user.uid, 'private', 'info');

  try {
    const existingSnap = await getDoc(userDocRef);
    const isAdminEmail = user.email === 'kyp04010016@gmail.com';
    if (!existingSnap.exists()) {
      const assignedRole = isAdminEmail ? 'ADMIN' : preferredRole;
      await setDoc(userDocRef, {
        uid: sanitizeId(user.uid),
        name: sanitizeString(user.displayName || user.email?.split('@')[0] || 'Member', 100, 2),
        role: assignedRole,
        isActive: true,
        emailVerified: Boolean(user.emailVerified),
        phoneVerified: false,
        createdAt: serverTimestamp(),
      });
      await setDoc(privateDocRef, {
        uid: sanitizeId(user.uid),
        email: sanitizeString(user.email || 'user@example.com', 150, 5),
        mobile: '9876543210',
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }
  return user;
}

export async function signOutUser() {
  await signOut(auth);
}
