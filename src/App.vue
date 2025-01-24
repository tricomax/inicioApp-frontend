<script setup lang="ts">
import { useAuthStore } from "./stores/auth";
import { useXbelReloadStore } from "./stores/xbel-reload";
import FavModule from "./components/FavModule.vue";
import MainModule from "./components/MainModule.vue";
import ObsoleteModule from "./components/ObsoleteModule.vue";

const authStore = useAuthStore();
const xbelReloadStore = useXbelReloadStore();

const handleXbelReload = async () => {
  await xbelReloadStore.reloadXbel();
};
</script>

<template>
  <div v-if="authStore.isAuthenticated">
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
      >
        <span v-if="xbelReloadStore.isReloading">Recargando XBEL...</span>
        <span v-else>Recargar XBEL</span>
      </button>
    </div>
  </div>
</template>

<style>
body {
  background-color: black;
  color: white;
}

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
  transition: background 0.2s ease;
}

.reload-button:hover:not(:disabled) {
  background: #34495e;
}

.reload-button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  margin-bottom: 0.5rem;
}
</style>
