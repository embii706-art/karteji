import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// ==================== Users ====================
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// ==================== Events / Activities ====================
export const getEvents = async (limit = 10) => {
  try {
    const q = query(
      collection(db, 'events'),
      where('status', '==', 'active'),
      orderBy('date', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.slice(0, limit).map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting events:', error);
    throw error;
  }
};

export const getEventById = async (eventId) => {
  try {
    const eventDoc = await getDoc(doc(db, 'events', eventId));
    if (eventDoc.exists()) {
      return { id: eventDoc.id, ...eventDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting event:', error);
    throw error;
  }
};

export const registerEventAttendance = async (eventId, userId) => {
  try {
    const attendanceRef = collection(db, 'events', eventId, 'attendees');
    await addDoc(attendanceRef, {
      userId,
      registeredAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error registering attendance:', error);
    throw error;
  }
};

// ==================== Announcements ====================
export const getAnnouncements = async (limit = 5) => {
  try {
    const q = query(
      collection(db, 'announcements'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.slice(0, limit).map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting announcements:', error);
    throw error;
  }
};

// ==================== Voting / Musyawarah ====================
export const getActiveVoting = async () => {
  try {
    const q = query(
      collection(db, 'voting'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting voting:', error);
    throw error;
  }
};

export const getVotingById = async (votingId) => {
  try {
    const votingDoc = await getDoc(doc(db, 'voting', votingId));
    if (votingDoc.exists()) {
      return { id: votingDoc.id, ...votingDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting voting:', error);
    throw error;
  }
};

export const submitVote = async (votingId, userId, candidateId) => {
  try {
    const voteRef = collection(db, 'voting', votingId, 'votes');
    await addDoc(voteRef, {
      userId,
      candidateId,
      votedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error submitting vote:', error);
    throw error;
  }
};

export const getVotingResults = async (votingId) => {
  try {
    const votesSnapshot = await getDocs(
      collection(db, 'voting', votingId, 'votes')
    );
    
    const results = {};
    votesSnapshot.docs.forEach((doc) => {
      const { candidateId } = doc.data();
      results[candidateId] = (results[candidateId] || 0) + 1;
    });
    
    return results;
  } catch (error) {
    console.error('Error getting voting results:', error);
    throw error;
  }
};

// ==================== Finance / Keuangan ====================
export const getFinanceSummary = async () => {
  try {
    const summaryDoc = await getDoc(doc(db, 'finance', 'summary'));
    if (summaryDoc.exists()) {
      return summaryDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting finance summary:', error);
    throw error;
  }
};

export const getTransactions = async (limit = 20) => {
  try {
    const q = query(
      collection(db, 'transactions'),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.slice(0, limit).map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
};

export const getMonthlyFinance = async (year, month) => {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const q = query(
      collection(db, 'transactions'),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate))
    );

    const querySnapshot = await getDocs(q);
    const transactions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Calculate totals
    const income = transactions
      .filter((t) => t.type === 'in')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const expenses = transactions
      .filter((t) => t.type === 'out')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return {
      transactions,
      income,
      expenses,
      balance: income - expenses,
    };
  } catch (error) {
    console.error('Error getting monthly finance:', error);
    throw error;
  }
};

// ==================== Members ====================
export const getAllMembers = async (limit = 50) => {
  try {
    const q = query(
      collection(db, 'users'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.slice(0, limit).map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting members:', error);
    throw error;
  }
};

// ==================== User Attendance ====================
export const getUserAttendance = async (userId, month = new Date().getMonth() + 1) => {
  try {
    const year = new Date().getFullYear();
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const q = query(
      collection(db, 'attendance'),
      where('userId', '==', userId),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate))
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting user attendance:', error);
    throw error;
  }
};

// ==================== User Activity Points ====================
export const getUserActivityPoints = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().activityPoints || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error getting user activity points:', error);
    throw error;
  }
};

export const updateUserActivityPoints = async (userId, points) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      activityPoints: points,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating activity points:', error);
    throw error;
  }
};
