<script setup lang="ts">
import { useAuthStore } from "./stores/auth";
import { useXbelReloadStore } from "./stores/xbel-reload";
import { authService } from "./services/authService";
import FavModule from "./components/FavModule.vue";
import MainModule from "./components/MainModule.vue";
import ObsoleteModule from "./components/ObsoleteModule.vue";

const authStore = useAuthStore();
const xbelReloadStore = useXbelReloadStore();

const handleXbelReload = async () => {
  if (!authStore.isAuthenticated) {
    try {
      await authService.login();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return;
    }
  }
  await xbelReloadStore.reloadXbel();
};

const handleLogout = async () => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};
</script>

<template>
  <div class="app-container">
    <div class="app-content">
      <div class="header-container">
        <h3 class="fav-title">Favoritos</h3>
        <div v-if="authStore.isAuthenticated" class="logout-container">
          <button @click="handleLogout" class="logout-button">
            Cerrar sesión
          </button>
        </div>
      </div>

      <div class="module-container">
        <FavModule />
      </div>
      <div class="module-container">
        <MainModule />
      </div>
      <div class="module-container">
        <ObsoleteModule />
      </div>
      <div class="reload-section">
        <div v-if="xbelReloadStore.error" class="error-message">
          {{ xbelReloadStore.error }}
        </div>
        <button
          @click="handleXbelReload"
          :disabled="xbelReloadStore.isReloading"
          class="reload-button"
          :class="{ 'is-reloading': xbelReloadStore.isReloading }"
        >
          <span v-if="xbelReloadStore.isReloading">
            <span class="spin-icon">⌛</span>
            Recargando XBEL...
          </span>
          <span v-else>↻ Recargar XBEL</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.app-container {
  min-height: 100vh;
}

.app-container .header-container {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0 0 0;
}

.app-container .fav-title {
  font-size: 1.2rem;
  color: white;
  margin: 0;
  padding-left: 1rem;
  height: 28px;
}

.app-container .logout-container {
  display: flex;
  align-items: flex-end;
}

.app-container .logout-button {
  margin-right: 1rem;
  padding: 0.3rem 1rem;
  background: transparent;
  color: #ccc;
  border: 2px solid #7b7265;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.logout-button:hover {
  background: #7b7265;
  color: white;
}

/* Estilos existentes */
.reload-section {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.app-container .reload-button {
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: white;
  border: 2px solid #7b7265;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.app-container .reload-button:hover:not(:disabled) {
  background: #7b7265;
  transform: translateY(-1px);
}

.app-container .reload-button:disabled {
  background: #34495e;
  cursor: progress;
  opacity: 0.8;
}

.app-container .reload-button.is-reloading {
  padding-right: 2rem;
}

.app-container .spin-icon {
  display: inline-block;
  animation: spin 2s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.app-container .error-message {
  color: #e74c3c;
  text-align: center;
  margin-bottom: 0.5rem;
}

.app-container .app-content {
  width: 95%;
  margin: 0 auto;
}

.app-container .module-container {
  width: 100%;
}
</style>
