import { defineStore } from 'pinia';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useFavoritesStore } from './favorites';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
  }),
  actions: {
    async setUser(user: User | null) {
      this.user = user;
      this.isAuthenticated = !!user;

      // Si el usuario está autenticado, cargamos sus favoritos
      if (this.isAuthenticated) {
        const favoritesStore = useFavoritesStore();
        await favoritesStore.fetchFavorites();
      }
    }
  },
});
