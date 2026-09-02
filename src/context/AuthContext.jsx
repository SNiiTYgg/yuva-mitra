import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { onAuthChange, signInWithGoogle, getGoogleRedirectResult, logoutUser } from '../firebase/auth';
import { getUserProfile, createUserProfile, updateUserProfile } from '../firebase/firestore';

// Keys for localStorage (survive page reload from redirect)
const LS_PENDING_ROLE = 'ym_pending_role';
const LS_PENDING_ORG = 'ym_pending_org';
const LS_DEMO_MODE = 'ym_demo_mode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // 'idle' | 'offline' | 'permission-denied' | 'unknown'
  const [firestoreError, setFirestoreError] = useState(null);

  // ─── Demo Mode ────────────────────────────────────────────────────────────
  // Demo mode is a local-only showcase mode. It never touches Firebase.
  const [demoMode, setDemoMode] = useState(() => {
    return localStorage.getItem(LS_DEMO_MODE) === 'true';
  });

  // Flag so onAuthStateChanged doesn't double-process when redirect result
  // already handled the user profile fetch.
  const redirectHandledRef = useRef(false);

  /**
   * Given an authenticated Firebase user, fetch/return their Firestore profile.
   * Handles all Firestore error cases correctly.
   *
   * Returns: { profile, isNewUser }
   *   profile  = full Firestore document (if found)
   *   isNewUser = true if Firestore doc does not yet exist
   */
  async function resolveUserProfile(firebaseUser) {
    setFirestoreError(null);
    try {
      const result = await getUserProfile(firebaseUser.uid);

      if (result.found) {
        const profile = {
          ...result.data,
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || result.data.photoURL || '',
          isProfileComplete: true,
        };
        return { profile, isNewUser: false };
      }

      // Document not found — new user
      const pendingRole = localStorage.getItem(LS_PENDING_ROLE) || 'student';
      const pendingOrg = localStorage.getItem(LS_PENDING_ORG) || 'Industry / Company';

      const profile = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email || 'User',
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL || '',
        role: pendingRole,
        organizationType: pendingOrg,
        providerType: pendingOrg === 'Industry / Company' ? 'industry' : 'academia',
        status: pendingRole === 'student' ? 'active' : 'pending',
        isProfileComplete: false,
      };
      return { profile, isNewUser: true };

    } catch (error) {
      // Classify the error
      if (error.code === 'firestore/offline') {
        setFirestoreError('offline');
        console.error('[AuthContext] Firestore offline:', error.message);
      } else if (error.code === 'firestore/permission-denied') {
        setFirestoreError('permission-denied');
        console.error('[AuthContext] Firestore permission denied:', error.message);
      } else {
        setFirestoreError('unknown');
        console.error('[AuthContext] Unexpected Firestore error:', error);
      }
      // Re-throw so callers can handle it in UI
      throw error;
    }
  }

  // ─── Step 1: Handle redirect result on app start ──────────────────────────
  // This runs BEFORE onAuthStateChanged processes the user.
  useEffect(() => {
    // Skip Firebase redirect processing in demo mode
    if (demoMode) return;

    let cancelled = false;

    async function handleRedirect() {
      try {
        const redirectResult = await getGoogleRedirectResult();
        if (cancelled) return;

        if (redirectResult && redirectResult.user) {
          // User just returned from Google redirect
          redirectHandledRef.current = true;
          const { profile, isNewUser } = await resolveUserProfile(redirectResult.user);
          setCurrentUser(profile);
          // Navigation handled in LoginPage via onAuthStateChanged watcher below
        }
      } catch (error) {
        if (cancelled) return;
        // Error is already classified in resolveUserProfile; state is set.
        // Don't crash the app — setLoading(false) will still be called by onAuthStateChanged.
        console.error('[AuthContext] Redirect result error:', error.message);
      }
    }

    handleRedirect();
    return () => { cancelled = true; };
  }, [demoMode]);

  // ─── Step 2: Persistent Auth State Listener ───────────────────────────────
  useEffect(() => {
    // In demo mode, skip Firebase auth listener and just resolve loading
    if (demoMode) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (!firebaseUser) {
        setCurrentUser(null);
        setFirestoreError(null);
        setLoading(false);
        return;
      }

      // If redirect already resolved the profile, skip a duplicate fetch.
      if (redirectHandledRef.current) {
        redirectHandledRef.current = false;
        setLoading(false);
        return;
      }

      try {
        const { profile } = await resolveUserProfile(firebaseUser);
        setCurrentUser(profile);
      } catch {
        // Error state already set inside resolveUserProfile
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [demoMode]);

  // ─── Public: trigger Google redirect ─────────────────────────────────────
  /**
   * Call before redirecting to Google. Persists role so it survives reload.
   * @param {'student'|'provider'} selectedRole
   * @param {string} organizationType
   */
  function initiateGoogleLogin(selectedRole, organizationType) {
    localStorage.setItem(LS_PENDING_ROLE, selectedRole);
    localStorage.setItem(LS_PENDING_ORG, organizationType);
    signInWithGoogle(); // navigates away — no await
  }

  // ─── Demo Mode: Switch Role ───────────────────────────────────────────────
  /**
   * Switch to a demo persona. Sets currentUser to the provided demo user object.
   * This ONLY works in demo mode and never touches Firebase.
   */
  function switchRole(demoUser) {
    setDemoMode(true);
    localStorage.setItem(LS_DEMO_MODE, 'true');
    setCurrentUser(demoUser);
    setFirestoreError(null);
    setLoading(false);
  }

  /**
   * Exit demo mode and return to real auth state.
   */
  function exitDemoMode() {
    setDemoMode(false);
    localStorage.removeItem(LS_DEMO_MODE);
    setCurrentUser(null);
    setLoading(true);
    // onAuthStateChanged will re-fire and resolve loading
  }

  // ─── Profile Completion ───────────────────────────────────────────────────
  async function completeStudentProfile(profileData) {
    if (!currentUser?.uid) throw new Error('No authenticated user');

    const payload = {
      name: profileData.name || currentUser.name,
      email: currentUser.email,
      photoURL: currentUser.photoURL || '',
      phone: profileData.phone || '',
      college: profileData.college || '',
      course: profileData.course || '',
      yearOfStudy: profileData.yearOfStudy || '3rd Year',
      graduationYear: profileData.graduationYear || '2027',
      skills: profileData.skills || '',
      role: 'student',
      status: 'active',
      isProfileComplete: true,
    };

    await createUserProfile(currentUser.uid, payload);
    const updated = { ...currentUser, ...payload };
    setCurrentUser(updated);
    localStorage.removeItem(LS_PENDING_ROLE);
    localStorage.removeItem(LS_PENDING_ORG);
    return updated;
  }

  async function completeProviderProfile(profileData) {
    if (!currentUser?.uid) throw new Error('No authenticated user');

    const payload = {
      name: profileData.name || currentUser.name,
      organizationName: profileData.organizationName || '',
      organizationType: profileData.organizationType || 'Industry / Company',
      providerType: profileData.organizationType === 'Industry / Company' ? 'industry' : 'academia',
      officialEmail: currentUser.email,
      email: currentUser.email,
      photoURL: currentUser.photoURL || '',
      phone: profileData.phone || '',
      website: profileData.website || '',
      description: profileData.description || '',
      role: 'provider',
      status: 'pending',
      rejectionReason: '',
      isProfileComplete: true,
    };

    await createUserProfile(currentUser.uid, payload);
    const updated = { ...currentUser, ...payload };
    setCurrentUser(updated);
    localStorage.removeItem(LS_PENDING_ROLE);
    localStorage.removeItem(LS_PENDING_ORG);
    return updated;
  }

  async function updateProfile(updatedFields) {
    if (!currentUser?.uid) return;
    // In demo mode, only update local state
    if (demoMode) {
      setCurrentUser((prev) => ({ ...prev, ...updatedFields }));
      return;
    }
    await updateUserProfile(currentUser.uid, updatedFields);
    setCurrentUser((prev) => ({ ...prev, ...updatedFields }));
  }

  async function logout() {
    if (demoMode) {
      exitDemoMode();
      return;
    }
    await logoutUser();
    setCurrentUser(null);
    setFirestoreError(null);
    localStorage.removeItem(LS_PENDING_ROLE);
    localStorage.removeItem(LS_PENDING_ORG);
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loading,
        firestoreError,
        demoMode,
        initiateGoogleLogin,
        switchRole,
        exitDemoMode,
        completeStudentProfile,
        completeProviderProfile,
        updateProfile,
        logout,
        isAuthenticated: !!currentUser && currentUser.isProfileComplete,
        isStudent: currentUser?.role === 'student',
        isProvider: currentUser?.role === 'provider',
        isAdmin: currentUser?.role === 'admin',
        isPendingProvider: currentUser?.role === 'provider' && currentUser?.status === 'pending',
        isApprovedProvider: currentUser?.role === 'provider' && currentUser?.status === 'approved',
        isRejectedProvider: currentUser?.role === 'provider' && currentUser?.status === 'rejected',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
