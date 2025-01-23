module.exports = {
  // ... otras configuraciones de ESLint ...
  plugins: [
    // ... otros plugins ...
    'tailwindcss',
  ],
  extends: [
    // ... otras extensiones ...
    'plugin:tailwindcss/recommended', // Extiende la configuración recomendada del plugin
  ],
  rules: {
    // ... otras reglas ...
    // Puedes configurar reglas específicas de tailwindcss aquí si lo necesitas
    // 'tailwindcss/no-custom-classname': 'off', // Desactiva la regla si quieres usar clases personalizadas
  },
  settings: {
    tailwindcss: {
      // These settings are equivalent to the default config
      callees: ['classnames', 'clsx', 'ctl'], // Nombres de las funciones que se usan para condicionales (puedes necesitar ctl si usas esa librería)
      config: 'tailwind.config.js', // Archivo de configuración de Tailwind CSS (si no está en la raíz del proyecto)
      cssFiles: [
        '**/*.css',
        '!**/node_modules',
        '!**/.*',
        '!**/dist',
        '!**/build',
      ], // Patrones de archivos CSS para analizar (asegúrate de que incluye tus archivos CSS)
      cssPath: 'styles.css', // Si no usas index.css como la ruta del css generado
      removeDuplicates: true, // Elimina clases duplicadas
      skipClassAttribute: false, // Analizar el atributo class
      whitelist: [], // Lista blanca de clases personalizadas
      tags: [], // Etiquetas personalizadas
    },
  },

};
