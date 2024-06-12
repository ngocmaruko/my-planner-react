import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // Import Firestore if you're using Firestore

const firebaseConfig = {
  // Your Firebase config object here
  apiKey: "AIzaSyCDxhpG81hPEgNcolagqLWaPXdiRS1PUGU",
  authDomain: "journal-b6da5.firebaseapp.com",
  projectId: "journal-b6da5",
  storageBucket: "journal-b6da5.appspot.com",
  messagingSenderId: "17329351384",
  appId: "1:17329351384:web:5f47076639fe5d848705ad"
};

const app = initializeApp(firebaseConfig);

// Export Firestore instance if you're using Firestore
export const firestore = getFirestore(app);
