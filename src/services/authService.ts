import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  type User,
} from 'firebase/auth';
import { useAuthStore } from '../stores/auth';
import { auth } from '../firebase/config';
import router from '../router';

const provider = new GoogleAuthProvider();

export const authService = {
  init() {
    const store = useAuthStore();

    onAuthStateChanged(auth, (user: User | null) => {
      store.setUser(user);
      if (user) {
        // Usuario ha iniciado sesión
        console.log('Usuario logueado:', user.uid);
      } else {
        // Usuario ha cerrado sesión
        console.log('Usuario ha cerrado sesión');
        router.push('/'); // Redirige a la página de inicio
      }
    });
  },
  async login(): Promise<User | undefined> {
    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential!.accessToken;  // No es necesario por ahora, pero puede servirte para acceder a las apis de google
      // The signed-in user info.
      const user = result.user;
      console.log('Usuario logueado:', user.uid);
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      return user;
    } catch (error) {
      // Handle Errors here.
      if (error instanceof Error) {
        console.error('Error during login:', error.message);
      } else {
        console.error('An unknown error occurred during login');
      }
      return undefined;
    }
  },
  async logout() {
    try {
      await signOut(auth);
      console.log('Sesión cerrada correctamente');
      router.push('/'); // Redirige a la página de inicio
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al cerrar sesión:', error.message);
      } else {
        console.error('An unknown error occurred while logging out');
      }
    }
  },
};
