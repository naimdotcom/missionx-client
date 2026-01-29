import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);

  const idToken = await result.user.getIdToken();
  console.log("Firebase ID Token:", idToken);

  // Send this token to FastAPI
  return idToken;
}
