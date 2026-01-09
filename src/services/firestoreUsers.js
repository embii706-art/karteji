import { collection, doc, getCountFromServer, getDocs, addDoc, setDoc, serverTimestamp, query, orderBy, where, limit } from 'firebase/firestore'
import { db } from '../lib/firebase'

const USERS_COLLECTION = 'users'

export async function getUsersCount() {
  const coll = collection(db, USERS_COLLECTION)
  const snapshot = await getCountFromServer(coll)
  return snapshot.data().count || 0
}

export async function listUsersBasic(max = 100) {
  const coll = collection(db, USERS_COLLECTION)
  const q = query(coll, orderBy('createdAt', 'asc'), limit(max))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function createUser(user) {
  const coll = collection(db, USERS_COLLECTION)
  // Use provided id as doc id for consistency if present
  if (user.id) {
    const ref = doc(db, USERS_COLLECTION, user.id)
    await setDoc(ref, {
      ...user,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { id: ref.id }
  }
  const ref = await addDoc(coll, {
    ...user,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  return { id: ref.id }
}

export async function findUserByEmail(email) {
  const coll = collection(db, USERS_COLLECTION)
  const q = query(coll, where('email', '==', email), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}
