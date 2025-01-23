export interface BookmarkItem {
  id: string;
  title: string;
  type: "bookmark" | "folder";
  url?: string;
  favicon?: string;
  faviconUrl?: string; // URL completa del favicon desde el backend
  children?: BookmarkItem[];
}
