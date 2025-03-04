export interface SearchService {
  id: string;
  name: string;
  url: string;
  icon?: string;
  active: boolean;
}

export interface SearchConfig {
  services: SearchService[];
  isConfigOpen: boolean;
}
