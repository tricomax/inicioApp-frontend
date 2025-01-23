<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import { useUpdateStore } from "../stores/update";
import FavModule from "../components/FavModule.vue";
import MainModule from "../components/MainModule.vue";
import ObsoleteModule from "../components/ObsoleteModule.vue";

const authStore = useAuthStore();
const updateStore = useUpdateStore();

const handleUpdate = async () => {
  await updateStore.updateServer();
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
    <div class="update-section">
      <div v-if="updateStore.error" class="error-message">
        {{ updateStore.error }}
      </div>
      <button
        @click="handleUpdate"
        :disabled="updateStore.isUpdating"
        class="update-button"
      >
        <span v-if="updateStore.isUpdating">Actualizando...</span>
        <span v-else>Actualizar servidor</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.update-section {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.update-button {
  padding: 0.75rem 1.5rem;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s ease;
}

.update-button:hover:not(:disabled) {
  background: #34495e;
}

.update-button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  margin-bottom: 0.5rem;
}
</style>
