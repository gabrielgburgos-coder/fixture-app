import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCi-dfco_Cj9XtrYcVfUxdi0i5NOajxSM4",
  authDomain: "fixture-60083.firebaseapp.com",
  projectId: "fixture-60083",
  storageBucket: "fixture-60083.firebasestorage.app",
  messagingSenderId: "146063947441",
  appId: "1:146063947441:web:b7c2c777098eaf3f98d490"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app)