# inicioApp-frontend

Inicioapp-frontend como su nombre indica es el frontend del servidor inicioapp-backend https://github.com/tricomax/inicioapp-backend

## Estructura del Proyecto

El proyecto está organizado en módulos principales que manejan diferentes aspectos de la aplicación:

### Módulos Principales (src/components/)

- `FavModule.vue`: Gestiona y muestra los marcadores favoritos del usuario.
- `MainModule.vue`: Muestra la lista principal de marcadores y carpetas, permitiendo la navegación entre ellos.
- `ObsoleteModule.vue`: Muestra los marcadores que podrían estar obsoletos o no disponibles.

### Componentes Auxiliares

- `BookmarkComponent.vue`: Componente reutilizable para mostrar un marcador individual.
- `FolderComponent.vue`: Componente para mostrar y gestionar carpetas de marcadores.

### Stores (src/stores/)

- `auth.ts`: Manejo del estado de autenticación.
- `favorites.ts`: Gestión del estado de marcadores favoritos.
- `obsoleteBookmarks.ts`: Gestión de marcadores obsoletos.
- `favicons.ts`: Gestión de iconos personalizados y su sincronización.
- `bookmarks.ts`: Gestión principal de marcadores y su estructura.
- `xbel-reload.ts`: Manejo de la recarga de datos XBEL.

## Funcionalidades

### Sistema de Marcadores
- Visualización de marcadores organizados en carpetas
- Navegación jerárquica entre carpetas
- Previsualización de iconos de sitios web con diseño uniforme
- Personalización de iconos para cada marcador
- Tooltips con información adicional
- Interfaz mejorada con iconos perfectamente centrados

### Gestión de Favoritos
- Marcar/desmarcar marcadores como favoritos
- Vista dedicada de favoritos
- Sincronización automática con el backend

### Detección de Enlaces Obsoletos
- Identificación automática de marcadores potencialmente obsoletos
- Vista separada para marcadores obsoletos
- Interfaz consistente con el resto de la aplicación

## API Endpoints

La aplicación se comunica con el backend a través de los siguientes endpoints:

- `GET /bookmarks`: Obtiene la lista completa de marcadores
- `GET /favorites`: Obtiene los marcadores favoritos
- `POST /favorites`: Añade un marcador a favoritos
- `DELETE /favorites/:url`: Elimina un marcador de favoritos
- `GET /obsolete-bookmarks`: Obtiene la lista de marcadores potencialmente obsoletos
- `POST /favicons/:url`: Sube un favicon personalizado para un marcador específico
- `GET /favicons/:url`: Obtiene el favicon personalizado de un marcador

## Configuración del Proyecto

### Instalación

```sh
pnpm install
```

### Desarrollo

```sh
pnpm dev
```

### Compilación para Producción

```sh
pnpm build
```

### Linting

```sh
pnpm lint
```

## Configuración del IDE Recomendada

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (deshabilitar Vetur).

## Soporte de TypeScript

El proyecto utiliza TypeScript con soporte completo para componentes Vue. Se requiere [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) para el correcto funcionamiento del servicio de lenguaje TypeScript con archivos `.vue`.
