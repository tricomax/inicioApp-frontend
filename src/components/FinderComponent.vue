<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSearchStore } from '../stores/searchServices';

const searchStore = useSearchStore();
const searchQuery = ref('');
const searchInput = ref<HTMLInputElement | null>(null);

onMounted(() => {
  // Establecer el foco en el input cuando el componente se monta
  searchInput.value?.focus();
});

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    searchStore.executeSearch(searchQuery.value.trim());
    searchQuery.value = '';
  }
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
};
</script>

<template>
  <div class="finder-container" :class="{ 'config-open': searchStore.isConfigOpen }">
    <div class="search-bar">
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        placeholder="Buscar..."
        @keypress="handleKeyPress"
        class="search-input"
      />
      <button @click="handleSearch" class="search-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
      <button @click="searchStore.toggleConfig" class="config-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>
    </div>

    <div v-if="searchStore.isConfigOpen" class="config-panel">
      <h3>Servicios de búsqueda</h3>
      <div class="services-list">
        <label
          v-for="service in searchStore.services"
          :key="service.id"
          class="service-item"
        >
          <input
            type="checkbox"
            :checked="service.active"
            @change="searchStore.toggleService(service.id)"
          />
          <span>{{ service.name }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.finder-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-bar {
  display: flex;
  gap: 8px;
  align-items: center;
  background: #1a1a1a;
  border: 2px solid #7b7265;
  border-radius: 8px;
  padding: 4px;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 8px 12px;
  color: white;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
}

.search-button,
.config-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #7b7265;
  padding: 8px;
  cursor: pointer;
  transition: color 0.2s ease;
  border-radius: 4px;
}

.search-button:hover,
.config-button:hover {
  color: white;
  background: rgba(123, 114, 101, 0.2);
}

.config-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: #1a1a1a;
  border: 2px solid #7b7265;
  border-radius: 8px;
  padding: 16px;
  z-index: 1000;
  animation: slideDown 0.3s ease;
}

.config-panel h3 {
  color: white;
  margin: 0 0 16px 0;
  font-size: 1.1rem;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  cursor: pointer;
}

.service-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Empuja el contenido hacia abajo cuando el panel está abierto */
.config-open + * {
  margin-top: 200px; /* Ajusta este valor según sea necesario */
  transition: margin-top 0.3s ease;
}
</style>
