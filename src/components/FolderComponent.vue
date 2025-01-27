<script setup lang="ts">
import { ref, computed, type PropType } from "vue";
import type { BookmarkItem } from "../types/bookmarks";
import folderIcon from "../assets/iconos/folder-icon.png";
import defaultIcon from "../assets/iconos/default-icon.png";

const props = defineProps({
  item: {
    type: Object as PropType<BookmarkItem>,
    required: true,
  },
});

const hasChildren = computed(() => {
  return props.item.children && props.item.children.length > 0;
});

const emit = defineEmits(['open-folder']);

const openFolder = () => {
  if (props.item.type === "folder") {
    emit('open-folder', props.item);
  }
};

const displayedChildren = computed(() => {
  // Show up to 9 items in a 3x3 grid
  return props.item.children ? props.item.children.slice(0, 9) : [];
});

const getItemIcon = (item: BookmarkItem) => {
  if (item.type === 'bookmark') {
    // Si tenemos una ruta al favicon, la usamos
    if (item.location && item.location.startsWith('/')) {
      return `${import.meta.env.VITE_API_BASE_URL}${item.location}`;
    }
    return defaultIcon;
  }
  return folderIcon;
};
</script>

<template>
  <div class="folder" @click="openFolder">
    <!-- Vista previa del contenido si hay elementos -->
    <div v-if="hasChildren" class="folder-preview-grid">
      <div v-for="child in displayedChildren"
           :key="child.id"
           class="preview-item">
        <img
          :src="getItemIcon(child)"
          :alt="child.title"
          class="preview-icon"
          @error="($event.target as HTMLImageElement).src = defaultIcon"
          loading="lazy"
          decoding="async"
          referrerpolicy="no-referrer"
        />
      </div>
    </div>
    <!-- Icono predeterminado si está vacía -->
    <img v-else :src="folderIcon" alt="Empty Folder" class="folder-icon" />
    <span class="folder-name">{{ item.title }}</span>
  </div>
</template>

<style scoped>
.folder-wrapper {
  background-color: #2a2a2a;
  padding: 0.5rem;
  border-radius: 8px;
  width: 100px;
  cursor: pointer;
  border: 2px solid #7b7265;
}

.folder-container {
  width: 80px;
  height: 80px;
  background-color: #3a3a3a;
  border-radius: 12px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.folder-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
}

.folder-title {
  color: white;
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.folder-preview {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.folder-content-preview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.125rem;
  padding: 0.375rem;
  width: 100%;
  height: 100%;
}

.preview-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-icon {
  width: 1rem;
  height: 1rem;
}

/* Add subtle inner shadow for depth */
.folder-container::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 1rem;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1),
              inset 0 -1px 1px rgba(0, 0, 0, 0.1);
}

/* Optional hover effect */
.folder-container:hover {
  background-color: rgba(55, 65, 81, 0.8);
}

.folder {
  width: 200px;
  height: 200px;
  background: linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%);
  border: 2px solid #7b7265;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  cursor: pointer;
  overflow: hidden;
}

.folder-preview-grid {
  width: 100%;
  height: 70%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 2px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.preview-item {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.preview-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  opacity: 0.9;
}

.folder-icon {
  width: 48px;
  height: 48px;
  margin: 4px 0;
}

.folder-name {
  color: white;
  font-size: 20px;
  text-align: center;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 4px;
}

/* Efecto hover */
.folder:hover {
  background: #7b7265;
  transform: translateY(-1px);
  transition: all 0.2s ease;
}
</style>
