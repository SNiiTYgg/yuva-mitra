import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

/**
 * Initiate Google Sign-In via Redirect.
 * Before calling this, persist the selected role/orgType into localStorage
 * so they survive the page reload the redirect causes.
 */
export async function signInWithGoogle() {
  await signInWithRedirect(auth, googleProvider);
  // This function does NOT return — the page will navigate away.
}

/**
 * Call this once on app startup to collect the redirect result.
 * Returns a UserCredential if the user just returned from Google, or null.
 * @returns {Promise<import('firebase/auth').UserCredential | null>}
 */
export async function getGoogleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    return result; // null if no pending redirect
  } catch (error) {
    console.error('[YuvaMitra] getRedirectResult error:', error.code, error.message);
    throw error;
  }
}

/**
 * Sign out the current user.
 */
export async function logoutUser() {
  await signOut(auth);
}

/**
 * Subscribe to Firebase Auth state changes.
 * @param {(user: import('firebase/auth').User | null) => void} callback
 * @returns {import('firebase/auth').Unsubscribe}
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
