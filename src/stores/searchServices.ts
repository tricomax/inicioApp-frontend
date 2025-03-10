import { defineStore } from 'pinia';
import type { SearchService } from '../types/searchTypes';

const STORAGE_KEY = 'search-services-config';

const defaultServices: SearchService[] = [
  {
    id: 'perplexity',
    name: 'Perplexity',
    url: 'https://www.perplexity.ai/search?q={query}',
    active: false
  },
  {
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com/search?q={query}',
    active: true
  },
  {
    id: 'brave',
    name: 'Brave Search',
    url: 'https://search.brave.com/search?q={query}',
    active: false
  },
  {
    id: 'bing',
    name: 'Bing',
    url: 'https://www.bing.com/search?q={query}',
    active: false
  }

];

const loadFromLocalStorage = (): SearchService[] | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored search services:', e);
      return null;
    }
  }
  return null;
};

export const useSearchStore = defineStore('search', {
  state: () => ({
    services: loadFromLocalStorage() || defaultServices,
    isConfigOpen: false
  }),

  actions: {
    toggleService(id: string) {
      const service = this.services.find(s => s.id === id);
      if (service) {
        service.active = !service.active;
        this.saveConfig();
      }
    },

    toggleConfig() {
      this.isConfigOpen = !this.isConfigOpen;
    },

    saveConfig() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.services));
    },

    executeSearch(query: string) {
      const activeServices = this.services.filter(s => s.active);

      // Abrir todas las pestañas de manera simultánea
      activeServices.forEach(service => {
        const url = service.url.replace('{query}', encodeURIComponent(query));
        window.open(url, '_blank');
      });
    }
  }
});
