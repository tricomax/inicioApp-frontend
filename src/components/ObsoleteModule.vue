<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useObsoleteStore } from "../stores/obsolete";
import defaultIcon from "../assets/iconos/default-icon.png";

const obsoleteStore = useObsoleteStore();

const handleBookmarksUpdated = () => {
  obsoleteStore.fetchObsoleteBookmarks();
};

onMounted(async () => {
  // Cargar bookmarks obsoletos inicialmente
  await obsoleteStore.fetchObsoleteBookmarks();
  // Agregar listener para actualizaciones
  window.addEventListener('bookmarks-updated', handleBookmarksUpdated);
});

onUnmounted(() => {
  // Limpiar el listener cuando el componente se destruye
  window.removeEventListener('bookmarks-updated', handleBookmarksUpdated);
});

const getIconUrl = (faviconUrl: string | undefined) => {
  if (faviconUrl) {
    return `${import.meta.env.VITE_API_BASE_URL}${faviconUrl}`;
  }
  return defaultIcon;
};
</script>

<template>
  <div class="obsolete-container">
    <div v-if="obsoleteStore.loading" class="loading-state">
      Cargando marcadores obsoletos...
    </div>
    <div v-else-if="obsoleteStore.error" class="error-message">
      {{ obsoleteStore.error }}
    </div>
    <div v-else-if="obsoleteStore.items.length > 0">
      <h3 class="obsolete-title">Marcadores Obsoletos</h3>
      <div class="folders-grid">
        <div
          v-for="item in obsoleteStore.items"
          :key="item.url"
          class="bookmark-wrapper"
        >
          <div class="bookmark-card">
            <a
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
              class="bookmark-content"
            >
              <div class="icon-container">
                <img
                  :src="getIconUrl(item.location)"
                  :alt="item.title"
                  class="bookmark-icon"
                  @error="($event.target as HTMLImageElement).src = defaultIcon"
                />
              </div>
            </a>
          </div>
          <div class="bookmark-title">
            {{ item.title }}
          </div>
          <div class="tooltip">{{ item.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.obsolete-container {
  padding: 1rem;
}

.obsolete-title {
  font-size: 1.2rem;
  color: #888;
  margin-bottom: 1rem;
  padding-left: 1rem;
}

.folders-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
  background: #1a1a1a;
  min-height: 100px;
  border: 2px solid #333;
  border-radius: 12px;
}

.bookmark-wrapper {
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  flex-direction: column;
}

.bookmark-card {
  position: relative;
  width: 100px;
  height: 100px;
  background: linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%);
  border: 2px solid #444;
  border-radius: 12px;
  overflow: hidden;
}

.bookmark-content {
  height: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  color: white;
}

.bookmark-title {
  font-size: 11px;
  text-align: center;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 4px;
  padding-bottom: 4px;
}

.icon-container {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px 0;
}

.bookmark-icon {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.bookmark-card:hover {
  background: linear-gradient(145deg, #3a3a3a 0%, #2a2a2a 100%);
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #666;
  font-size: 1.1rem;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  padding: 1rem;
}

.tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) scale(0.95);
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  border: 1px solid #444;
  z-index: 20;
}

.tooltip::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid rgba(0, 0, 0, 0.9);
}

.bookmark-wrapper:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}
</style>
