import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from 'firebase/auth';
import { useFavoritesStore } from './favorites';

/**
 * Interface que define el estado de autenticación del usuario.
 * @property user - Usuario actual de Firebase o null si no está autenticado
 * @property isAuthenticated - Indicador booleano del estado de autenticación
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

/**
 * Store que gestiona el estado de autenticación de la aplicación.
 * Mantiene el estado del usuario actual y su estado de autenticación,
 * además de gestionar la carga automática de datos relacionados como los favoritos.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);

  /**
   * Actualiza el estado de autenticación con un nuevo usuario.
   * Si el usuario está autenticado, carga automáticamente sus favoritos.
   *
   * @param newUser - El nuevo usuario a establecer o null para indicar desconexión
   */
  const setUser = async (newUser: User | null) => {
    user.value = newUser;
    isAuthenticated.value = !!newUser;

    // Si el usuario está autenticado, cargamos sus favoritos
    if (isAuthenticated.value) {
      const favoritesStore = useFavoritesStore();
      await favoritesStore.fetchFavorites();
    }
  };

  return {
    user,
    isAuthenticated,
    setUser
  };
});
