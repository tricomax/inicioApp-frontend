import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  type User,
} from 'firebase/auth';
import { useAuthStore } from '../stores/auth';
import { auth } from '../firebase/config';

/**
 * Proveedor de autenticación de Google para Firebase.
 * Se configura una única instancia para su reutilización.
 */
const provider = new GoogleAuthProvider();

/**
 * Servicio que gestiona la autenticación de usuarios mediante Firebase.
 * Proporciona funcionalidades para iniciar sesión con Google, cerrar sesión
 * y mantener el estado de autenticación sincronizado.
 */
export const authService = {
  /**
   * Inicializa el observador del estado de autenticación.
   * Mantiene sincronizado el estado de la aplicación con Firebase Auth.
   */
  init() {
    const store = useAuthStore();

    onAuthStateChanged(auth, (user: User | null) => {
      store.setUser(user);
      if (user) {
        console.log('Usuario autenticado:', user.uid);
      } else {
        console.log('Usuario ha cerrado sesión');
      }
    });
  },

  /**
   * Inicia el proceso de autenticación con Google mediante una ventana emergente.
   *
   * @returns Promise<User | undefined> - Usuario autenticado o undefined si falla la autenticación
   */
  async login(): Promise<User | undefined> {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Inicio de sesión exitoso:', user.uid);
      return user;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error durante el inicio de sesión:', error.message);
      } else {
        console.error('Error desconocido durante el inicio de sesión');
      }
      return undefined;
    }
  },

  /**
   * Cierra la sesión del usuario actual.
   * Gestiona errores que puedan ocurrir durante el proceso.
   */
  async logout() {
    try {
      await signOut(auth);
      console.log('Sesión cerrada correctamente');
    } catch (error) {
      let errorMessage = 'Error desconocido al cerrar sesión';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Error al cerrar sesión:', errorMessage);
      throw new Error(errorMessage);
    }
  },
};
