import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

/* ==========================================================================
   ERROR CLASSIFICATION
   ========================================================================== */

/**
 * Returns true if this error is a Firestore network/offline failure.
 * This is NOT the same as "document not found".
 */
function isOfflineError(error) {
  return (
    error?.code === 'unavailable' ||
    error?.message?.toLowerCase().includes('client is offline') ||
    error?.message?.toLowerCase().includes('failed to get document because the client is offline')
  );
}

/* ==========================================================================
   USERS COLLECTION
   ========================================================================== */

/**
 * Get User Profile from Firestore users/{uid}
 *
 * Returns:
 *   { found: true,  data: {...} }  — document exists
 *   { found: false, data: null }   — document does not exist (new user)
 *   throws FirebaseError            — network/offline/permission error
 *
 * NEVER confuses "offline" with "not found".
 *
 * @param {string} uid
 */
export async function getUserProfile(uid) {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { found: true, data: { id: docSnap.id, ...docSnap.data() } };
    }
    // Document doesn't exist — this is a NEW user, not an error
    return { found: false, data: null };
  } catch (error) {
    if (isOfflineError(error)) {
      console.error('[YuvaMitra] Firestore offline — cannot fetch users/', uid, error.code);
      // Re-throw with a clear user-facing message attached
      const enhanced = new Error(
        'Unable to connect to YuvaMitra database. Please check your internet connection and try again.'
      );
      enhanced.code = 'firestore/offline';
      enhanced.original = error;
      throw enhanced;
    }
    if (error?.code === 'permission-denied') {
      console.error('[YuvaMitra] Firestore permission denied for users/', uid);
      const enhanced = new Error(
        'You do not have permission to access this profile. Please sign in again.'
      );
      enhanced.code = 'firestore/permission-denied';
      throw enhanced;
    }
    console.error('[YuvaMitra] Unexpected error fetching users/', uid, error);
    throw error;
  }
}

/**
 * Create or merge User Profile in Firestore users/{uid}
 * @param {string} uid
 * @param {Object} userData
 */
export async function createUserProfile(uid, userData) {
  try {
    const docRef = doc(db, 'users', uid);
    const payload = {
      ...userData,
      uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(docRef, payload, { merge: true });
    return { id: uid, ...payload };
  } catch (error) {
    if (isOfflineError(error)) {
      const enhanced = new Error(
        'Unable to save your profile — no database connection. Please check your internet and try again.'
      );
      enhanced.code = 'firestore/offline';
      throw enhanced;
    }
    console.error('[YuvaMitra] Error creating user profile:', error);
    throw error;
  }
}

/**
 * Update User Profile
 * @param {string} uid
 * @param {Object} updates
 */
export async function updateUserProfile(uid, updates) {
  try {
    const docRef = doc(db, 'users', uid);
    const payload = { ...updates, updatedAt: serverTimestamp() };
    await updateDoc(docRef, payload);
    return payload;
  } catch (error) {
    if (isOfflineError(error)) {
      const enhanced = new Error(
        'Unable to update your profile — no database connection. Please try again.'
      );
      enhanced.code = 'firestore/offline';
      throw enhanced;
    }
    console.error('[YuvaMitra] Error updating user profile:', error);
    throw error;
  }
}

/**
 * Get providers for Admin oversight
 * @param {string} [statusFilter] 'all' | 'pending' | 'approved' | 'rejected'
 */
export async function getProviders(statusFilter = 'all') {
  try {
    const usersRef = collection(db, 'users');
    let q;
    if (statusFilter !== 'all') {
      q = query(usersRef, where('role', '==', 'provider'), where('status', '==', statusFilter));
    } else {
      q = query(usersRef, where('role', '==', 'provider'));
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('[YuvaMitra] Error fetching providers:', error);
    return [];
  }
}

/**
 * Admin: Approve Provider
 */
export async function approveProviderAccount(uid) {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, { status: 'approved', rejectionReason: '', updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('[YuvaMitra] Error approving provider:', error);
    throw error;
  }
}

/**
 * Admin: Reject Provider
 */
export async function rejectProviderAccount(uid, reason) {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      status: 'rejected',
      rejectionReason: reason || 'Registration criteria not met',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('[YuvaMitra] Error rejecting provider:', error);
    throw error;
  }
}

/* ==========================================================================
   OPPORTUNITIES COLLECTION
   ========================================================================== */

export async function getActiveOpportunities() {
  try {
    const q = query(collection(db, 'opportunities'), where('status', '==', 'active'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('[YuvaMitra] Error fetching active opportunities:', error);
    return [];
  }
}

export async function getAllOpportunities() {
  try {
    const snap = await getDocs(collection(db, 'opportunities'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('[YuvaMitra] Error fetching all opportunities:', error);
    return [];
  }
}

export async function getProviderOpportunities(providerUid) {
  try {
    const q = query(collection(db, 'opportunities'), where('providerId', '==', providerUid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('[YuvaMitra] Error fetching provider opportunities:', error);
    return [];
  }
}

export async function getOpportunityById(id) {
  try {
    const snap = await getDoc(doc(db, 'opportunities', id));
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    return null;
  } catch (error) {
    console.error('[YuvaMitra] Error fetching opportunity by ID:', error);
    throw error;
  }
}

export async function createOpportunityInFirestore(oppData, providerUser) {
  try {
    const payload = {
      ...oppData,
      providerId: providerUser.uid,
      organization: providerUser.organizationName || oppData.organization || 'Partner Organization',
      providerType: providerUser.providerType || 'industry',
      status: 'active',
      postedDate: new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docSnap = await addDoc(collection(db, 'opportunities'), payload);
    return { id: docSnap.id, ...payload };
  } catch (error) {
    console.error('[YuvaMitra] Error creating opportunity:', error);
    throw error;
  }
}

export async function toggleOpportunityStatusInFirestore(id, currentStatus) {
  try {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';
    await updateDoc(doc(db, 'opportunities', id), { status: newStatus, updatedAt: serverTimestamp() });
    return newStatus;
  } catch (error) {
    console.error('[YuvaMitra] Error toggling opportunity status:', error);
    throw error;
  }
}

/* ==========================================================================
   APPLICATIONS COLLECTION
   ========================================================================== */

export async function checkHasStudentApplied(opportunityId, studentUid) {
  try {
    const q = query(
      collection(db, 'applications'),
      where('opportunityId', '==', opportunityId),
      where('studentId', '==', studentUid)
    );
    const snap = await getDocs(q);
    return !snap.empty;
  } catch (error) {
    console.error('[YuvaMitra] Error checking duplicate application:', error);
    return false;
  }
}

export async function applyToOpportunityInFirestore(opportunity, studentUser) {
  const alreadyApplied = await checkHasStudentApplied(opportunity.id, studentUser.uid);
  if (alreadyApplied) {
    throw new Error('You have already applied to this opportunity.');
  }
  try {
    const payload = {
      opportunityId: opportunity.id,
      opportunityTitle: opportunity.title,
      organization: opportunity.organization,
      providerId: opportunity.providerId,
      studentId: studentUser.uid,
      studentName: studentUser.name || 'Student Applicant',
      studentEmail: studentUser.email,
      studentCollege: studentUser.college || studentUser.institution || '',
      studentCourse: studentUser.course || '',
      studentSkills: studentUser.skills || '',
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docSnap = await addDoc(collection(db, 'applications'), payload);
    return { id: docSnap.id, ...payload };
  } catch (error) {
    console.error('[YuvaMitra] Error applying to opportunity:', error);
    throw error;
  }
}

export async function getStudentApplications(studentUid) {
  try {
    const q = query(collection(db, 'applications'), where('studentId', '==', studentUid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('[YuvaMitra] Error fetching student applications:', error);
    return [];
  }
}

export async function getProviderApplications(providerUid) {
  try {
    const q = query(collection(db, 'applications'), where('providerId', '==', providerUid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('[YuvaMitra] Error fetching provider applications:', error);
    return [];
  }
}

export async function getAllApplications() {
  try {
    const snap = await getDocs(collection(db, 'applications'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('[YuvaMitra] Error fetching all applications:', error);
    return [];
  }
}

export async function updateApplicationStatusInFirestore(applicationId, newStatus) {
  try {
    await updateDoc(doc(db, 'applications', applicationId), {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('[YuvaMitra] Error updating application status:', error);
    throw error;
  }
}
