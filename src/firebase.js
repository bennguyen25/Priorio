import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBfHzn2wT6hWN4aZV1ehP6TyDYqMMsHrpo',
  authDomain: 'priorio-info.firebaseapp.com',
  projectId: 'priorio-info',
  storageBucket: 'priorio-info.firebasestorage.app',
  messagingSenderId: '518074442765',
  appId: '1:518074442765:web:19b306ede6c875b2312144',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
