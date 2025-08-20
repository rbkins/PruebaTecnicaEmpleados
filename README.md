# Sistema de Formularios Dinámicos

Este proyecto es una aplicación web desarrollada con Next.js y TypeScript que permite crear y gestionar formularios dinámicos con validaciones personalizables.

## Requisitos Previos

- Node.js (versión 18.0.0 o superior)
- npm o pnpm como gestor de paquetes

## Instalación


1. **Instalar dependencias**
   ```bash
   # Si usas npm
   npm install

   # Si usas pnpm (recomendado)
   pnpm install

   # Tambien para instalar de manera forzada, en caso no funcionen las anteriores
   npm install --legacy-peer-deps
   ```

2. **Iniciar el servidor de desarrollo**
   ```bash
   # Si usas npm
   npm run dev

   # Si usas pnpm
   pnpm dev
   ```

3. **Acceder a la aplicación**
   - Abre tu navegador y visita `http://localhost:3000`

## Estructura del Proyecto

```
├── app/                  # Páginas y rutas de la aplicación
├── components/          # Componentes reutilizables
├── lib/                # Utilidades y funciones auxiliares
├── public/            # Archivos estáticos
└── styles/           # Estilos globales
```

## Características

- Creación de formularios dinámicos mediante configuración JSON
- Panel de administración para modificar campos en tiempo real
- Validaciones personalizables por campo:
  - Campos requeridos
  - Longitud mínima
  - Validación de formato para email y teléfono
- Tabla responsiva para visualizar registros
- Integración con API externa para datos de departamentos
- Interfaz responsiva adaptable a diferentes dispositivos

## Tecnologías Utilizadas

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn/ui
- React Hook Form

## Notas Importantes

1. **node_modules**:
   - La carpeta `node_modules` no está incluida en el archivo comprimido
   - Se generará automáticamente al ejecutar `npm install` o `pnpm install`

2. **Variables de Entorno**:
   - No se requieren variables de entorno para este proyecto

3. **Compatibilidad**:
   - Probado en las últimas versiones de Chrome, Firefox y Edge
   - Soporte para dispositivos móviles y tablets

## Solución de Problemas

Si encuentras algún error durante la instalación:

1. **Error de dependencias**
   ```bash
   # Limpiar caché de npm
   npm cache clean --force
   
   # Eliminar node_modules y package-lock.json
   rm -rf node_modules package-lock.json
   
   # Reinstalar dependencias
   npm install
   ```

2. **Error de puerto en uso**
   - El puerto 3000 debe estar disponible
   - Puedes cambiar el puerto en el comando de inicio:
     ```bash
     npm run dev -- -p 3001
     ```

## Contacto

Si tienes alguna pregunta o encuentras algún problema, no dudes en contactarme:
maganaperazadaniel@gmail.com
