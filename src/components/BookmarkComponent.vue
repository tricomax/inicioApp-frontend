<script setup lang="ts">
import { ref, inject, computed, type PropType } from "vue";
import { useAuthStore } from "../stores/auth";
import { useFavoritesStore } from '../stores/favorites';
import type { AxiosInstance } from "axios";
import type { BookmarkItem } from "../types/bookmarks";
import defaultIcon from "../assets/iconos/default-icon.png"; // Añadir esta importación

const props = defineProps({
  item: {
    type: Object as PropType<BookmarkItem>,
    required: true,
  },
});

const api = inject<AxiosInstance>("api")!;
const authStore = useAuthStore();
const favoritesStore = useFavoritesStore();

const isFavorite = computed(() => favoritesStore.isFavorite(props.item.url || ''));

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
  if (props.item.faviconUrl) {
    return `${import.meta.env.VITE_API_BASE_URL}${props.item.faviconUrl}`;
  }
  return defaultIcon;
});
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
</template>

<style scoped>
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

.bookmark-wrapper {
  position: relative;
  width: 90px;      /* Ajustado a 90px para mantener consistencia */
  height: 90px;     /* Altura igual al ancho para forma cuadrada */
  display: flex;
  flex-direction: column;
}

.bookmark-card:hover {
  background: linear-gradient(145deg, #3a3a3a 0%, #2a2a2a 100%);
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
