# Proyecto de Editor de Temas

Este proyecto es un editor de texto que permite gestionar y editar elementos dentro de temas específicos para indicar su estado sentimental y su acto del habla. Proporciona una interfaz intuitiva para agregar, eliminar y editar elementos, así como una vista bonita para visualizar los temas y sus elementos.

## Mapa de Componentes

### Componentes Principales

1.  **App.js**:
    
    -   **Función:** Componente principal que inicializa la aplicación.
    -   **Componentes Relacionados:**
        -   EditorView
2.  **EditorView**:
    
    -   **Función:** Muestra la vista principal del editor de temas.
    -   **Componentes Relacionados:**
        -   TemaDetails
3.  **TemaDetails**:
    
    -   **Función:** Muestra los detalles de un tema específico, incluidos sus elementos.
    -   **Componentes Relacionados:**
        -   DraggableElement
4.  **DraggableElement**:
    
    -   **Función:** Permite la manipulación y edición de un elemento específico dentro de un tema.
    -   **Componentes Relacionados:**
        -   EditModal
5.  **EditModal**:
    
    -   **Función:** Proporciona un modal para editar un elemento dentro de un tema.
    -   **Componentes Relacionados:** N/A

### Componentes Auxiliares

1.  **VistaBonita**:
    -   **Función:** Muestra una vista bonita de los elementos de un tema para fines de visualización.
    -   **Componentes Relacionados:** N/A

## Requisitos

Asegúrate de tener instalado Node.js en tu sistema con una versión igual o superior a la 16. Puedes descargarlo desde [nodejs.org](https://nodejs.org/).

## Configuración del Proyecto

Para ejecutar este proyecto en tu entorno local, sigue estos pasos:

1.  Clona este repositorio en tu máquina local.
2. Clona el repositorio de backend [ms-editor-texto](https://github.com/pipetboy2001/ms-editor-texto)
3.  Instala las dependencias necesarias ejecutando `yarn install` en tu terminal.
4.  Ejecuta el servidor de desarrollo con `yarn start`.
5.  Abre tu navegador y accede a [http://localhost:3011](http://localhost:3011/) para ver la aplicación en funcionamiento.
