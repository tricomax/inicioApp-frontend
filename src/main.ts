import '@/assets/style.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import axios from 'axios';
import App from './App.vue';
import { authService } from './services/authService';
import { auth } from './firebase/config';

const app = createApp(App);
const pinia = createPinia();

// Crea una instancia de Axios con la URL base de tu API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Interceptor para incluir el token en las peticiones
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Incluye la instancia de axios en la app
app.provide('api', api);

app.use(pinia);

// Inicializa el servicio de autenticación para que comience a escuchar los cambios de estado
authService.init();

app.mount('#app');
