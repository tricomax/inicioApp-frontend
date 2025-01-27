<script setup lang="ts">
import { ref, inject, computed, type PropType } from "vue";
import { useAuthStore } from "../stores/auth";
import { useFavoritesStore } from '../stores/favorites';
import { useFaviconsStore } from '../stores/favicons';
import type { AxiosInstance } from "axios";
import type { BookmarkItem } from "../types/bookmarks";
import defaultIcon from "../assets/iconos/default-icon.png";

const props = defineProps({
  item: {
    type: Object as PropType<BookmarkItem>,
    required: true,
  },
});

const api = inject<AxiosInstance>("api")!;
const authStore = useAuthStore();
const favoritesStore = useFavoritesStore();
const faviconsStore = useFaviconsStore();

const isFavorite = computed(() => favoritesStore.isFavorite(props.item.url || ''));
const isUploading = computed(() => faviconsStore.uploading);
const uploadError = computed(() => faviconsStore.error);

const toggleFavorite = async (event: Event) => {
  event.stopPropagation();
  if (authStore.user) {
    if (isFavorite.value) {
      await favoritesStore.removeFavorite(props.item);
    } else {
      await favoritesStore.addFavorite(props.item);
    }
  }
};

const getIconUrl = computed(() => {
  console.log('Datos del bookmark:', {
    url: props.item.url,
    location: props.item.location
  });

  // Si tenemos una ruta al favicon, la usamos
  if (props.item.location && props.item.location.startsWith('/')) {
    const url = `${import.meta.env.VITE_API_BASE_URL}${props.item.location}`;
    console.log('Usando location:', url);
    return url;
  }

  console.log('Usando icono por defecto');
  return defaultIcon;
});

const fileInputRef = ref<HTMLInputElement | null>(null);

const handleEditClick = (event: Event) => {
  event.stopPropagation();
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file && props.item.url) {
    try {
      await faviconsStore.saveCustomFavicon(props.item.url, file);
    } catch (error) {
      console.error('Error al guardar el favicon:', error);
    } finally {
      // Limpiar el input para permitir subir el mismo archivo nuevamente
      if (fileInputRef.value) {
        fileInputRef.value.value = '';
      }
    }
  }
};
</script>

<template>
  <div class="bookmark-wrapper">
    <div class="bookmark-card">
      <button
        class="favorite-button"
        @click.stop="toggleFavorite"
        :class="{ 'is-favorite': isFavorite }"
      >
        ★
      </button>
      <a
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        class="bookmark-content"
      >
        <div class="icon-container">
          <img
            :src="getIconUrl"
            :alt="item.title"
            class="bookmark-icon"
            :class="{ 'uploading': isUploading }"
            @error="(e) => {
              console.error('❌ Icono no encontrado:', {
                url_marcador: item.url,
                titulo: item.title,
                icono_fallido: (e.target as HTMLImageElement).src
              });
              (e.target as HTMLImageElement).src = defaultIcon;
            }"
          />
        </div>
      </a>
      <div class="edit-controls">
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden-input"
          @change="handleFileSelect"
        />
        <button
          v-if="!isUploading"
          class="edit-button"
          @click="handleEditClick"
          title="Cambiar icono"
        >
          ✏️
        </button>
        <div v-else class="loading-indicator" title="Subiendo icono...">
          ⌛
        </div>
      </div>
    </div>
    <div class="bookmark-title">
      {{ item.title }}
    </div>
    <div v-if="uploadError" class="error-tooltip">
      {{ uploadError }}
    </div>
    <div class="tooltip">{{ item.title }}</div>
  </div>
</template>

<style scoped>
.bookmark-card {
  position: relative;
  width: 90px;
  height: 90px;
  background: linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%);
  border: 2px solid #7b7265;
  border-radius: 12px;
  overflow: hidden;
}

.bookmark-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: white;
  padding: 4px;
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
  width: 60%;
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
}

.bookmark-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: opacity 0.2s ease;
  padding: 4px;
}

.bookmark-icon.uploading {
  opacity: 0.5;
}

.bookmark-wrapper {
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  flex-direction: column;
}

.bookmark-card:hover {
  background: #7b7265;
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

.favorite-button {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: #666;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.favorite-button:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.favorite-button.is-favorite {
  color: #ffd700;
  text-shadow: 0 0 2px rgba(0,0,0,0.5);
}

.edit-controls {
  position: absolute;
  bottom: 4px;
  left: 4px;
  display: flex;
  gap: 4px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.bookmark-wrapper:hover .edit-controls {
  opacity: 1;
}

.edit-button {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.edit-button:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.hidden-input {
  display: none;
}

.loading-indicator {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.tooltip, .error-tooltip {
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

.error-tooltip {
  background: rgba(231, 76, 60, 0.9);
  border-color: #c0392b;
}

.tooltip::after, .error-tooltip::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
}

.tooltip::after {
  border-top: 5px solid rgba(0, 0, 0, 0.9);
}

.error-tooltip::after {
  border-top: 5px solid rgba(231, 76, 60, 0.9);
}

.bookmark-wrapper:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

.error-tooltip {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}
</style>
