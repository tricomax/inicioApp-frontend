export interface BookmarkItem {
  id: string;
  title: string;
  type: "bookmark" | "folder";
  url?: string;
  location?: string; // Ruta al favicon (/favicons/...)
  children?: BookmarkItem[];
}
