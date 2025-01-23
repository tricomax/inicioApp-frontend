<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import FolderComponent from "./FolderComponent.vue";
import BookmarkComponent from "./BookmarkComponent.vue";
import { useBookmarksStore } from "../stores/bookmarks";
import type { BookmarkItem } from "../types/bookmarks";

const bookmarksStore = useBookmarksStore();
const currentFolder = ref<BookmarkItem | null>(null);

const displayedItems = computed(() => {
  return currentFolder.value ? currentFolder.value.children : bookmarksStore.items;
});

const sortedDisplayedItems = computed(() => {
  const items = displayedItems.value || [];
  return [
    ...items.filter(item => item.type === 'folder'),
    ...items.filter(item => item.type === 'bookmark')
  ];
});

// Manejador para el evento de actualización
const handleBookmarksUpdated = () => {
  bookmarksStore.fetchBookmarks();
};

onMounted(async () => {
  // Cargar bookmarks inicialmente
  await bookmarksStore.fetchBookmarks();
  // Agregar listener para actualizaciones
  window.addEventListener('bookmarks-updated', handleBookmarksUpdated);
});

onUnmounted(() => {
  // Limpiar el listener cuando el componente se destruye
  window.removeEventListener('bookmarks-updated', handleBookmarksUpdated);
});

const openFolder = (folder: BookmarkItem) => {
  currentFolder.value = folder;
};

const closeFolder = () => {
  currentFolder.value = null;
};
</script>

<template>
  <div class="p-4 bg-gray-900">
    <div v-if="bookmarksStore.error">
      <p class="text-red-500">{{ bookmarksStore.error }}</p>
    </div>
    <div v-else>
      <div v-if="currentFolder" class="folder-header">
        <button @click="closeFolder" class="back-button">
          <span class="mr-2">←</span> Volver
        </button>
        <h2 class="folder-title">{{ currentFolder.title }}</h2>
      </div>

      <div v-if="bookmarksStore.loading" class="loading-state">
        Cargando marcadores...
      </div>
      <div v-else class="folders-grid">
        <template v-for="item in sortedDisplayedItems" :key="item.id">
          <FolderComponent
            v-if="item.type === 'folder'"
            :item="item"
            @open-folder="openFolder"
          />
          <BookmarkComponent
            v-else
            :item="item"
            class="bookmark-item"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.folders-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
  background: #1a1a1a;
  min-height: 100px;
  border: 2px solid #333;
  border-radius: 12px;
  margin-top: 1rem;
}

.folder-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
}

.back-button {
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.2s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.folder-title {
  flex: 1;
  text-align: center;
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  margin-right: 120px; /* Compensa el ancho del botón para un mejor centrado */
}

.bookmark-item {
  width: 90px !important;  /* Ligeramente más pequeño que las carpetas */
  height: 90px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #666;
  font-size: 1.1rem;
}
</style>
