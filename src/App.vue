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
  await xbelReloadStore.reloadXbel();
};

const handleLogin = async () => {
  try {
    await authService.login();
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
  }
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
    <!-- Pantalla de bienvenida para usuarios no autenticados -->
    <div v-if="!authStore.isAuthenticated" class="welcome-screen">
      <h1>Bienvenido a la Aplicación de Marcadores</h1>
      <p>Inicia sesión para acceder a tus marcadores</p>
      <button @click="handleLogin" class="login-button">
        Iniciar sesión con Google
      </button>
    </div>

    <!-- Contenido principal para usuarios autenticados -->
    <div v-else>
      <!-- Botón de logout -->
      <div class="logout-container">
        <button @click="handleLogout" class="logout-button">
          Cerrar sesión
        </button>
      </div>

      <div>
        <FavModule />
      </div>
      <div>
        <MainModule />
      </div>
      <div>
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

<style>
body {
  background-color: black;
  color: white;
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.app-container {
  min-height: 100vh;
}

/* Estilos para la pantalla de bienvenida */
.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 2rem;
}

.welcome-screen h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #fff;
}

.welcome-screen p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #ccc;
}

.login-button {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button:hover {
  background: #357abd;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}

/* Estilos para el botón de logout */
.logout-container {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 100;
}

.logout-button {
  padding: 0.5rem 1rem;
  background: transparent;
  color: #ccc;
  border: 1px solid #666;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.logout-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: #999;
}

/* Estilos existentes */
.reload-section {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.reload-button {
  padding: 0.75rem 1.5rem;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reload-button:hover:not(:disabled) {
  background: #34495e;
  transform: translateY(-1px);
}

.reload-button:disabled {
  background: #34495e;
  cursor: progress;
  opacity: 0.8;
}

.reload-button.is-reloading {
  padding-right: 2rem;
}

.spin-icon {
  display: inline-block;
  animation: spin 2s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #e74c3c;
  text-align: center;
  margin-bottom: 0.5rem;
}
</style>
