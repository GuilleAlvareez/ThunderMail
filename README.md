# ThunderMail: Asistente Inteligente de Redacción de Correos

[![Estado del Deploy](https://img.shields.io/website?down_message=offline&label=Vercel&up_message=online&url=https%3A%2F%2Fthunder-mail.vercel.app%2F)](https://thunder-mail.vercel.app/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Licencia](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**ThunderMail** es una aplicación web moderna que revoluciona la forma en que escribes correos electrónicos. Utilizando el poder de la inteligencia artificial, ThunderMail te ayuda a generar borradores de correo electrónico completos y bien estructurados a partir de simples instrucciones. Simplemente indica el destinatario, el propósito del mensaje y el tono deseado (formal, directo, informal o divertido), y deja que la IA haga el resto.

La aplicación no solo genera el contenido, sino que también te permite editarlo y enviarlo directamente desde la interfaz, agilizando tu flujo de trabajo y mejorando tu productividad.

## ✨ Características Principales

- **Redacción Asistida por IA:** Genera borradores de correo electrónico (destinatario, asunto y contenido) a partir de prompts en lenguaje natural.
- **Múltiples Estilos de Tono:** Adapta el lenguaje del correo eligiendo entre estilos: **Formal, Informal, Directo y Divertido**.
- **Autenticación Segura:** Inicio de sesión rápido y seguro con tu cuenta de Google.
- **Gestión de Chats:** Todas tus conversaciones se guardan y se organizan en un historial de chats, con la posibilidad de buscar y eliminar conversaciones.
- **Edición y Envío Integrado:** Edita los borradores generados por la IA directamente en la interfaz y envíalos con un solo clic.
- **Interfaz Moderna y Responsiva:** Una experiencia de usuario limpia, intuitiva y totalmente adaptable a dispositivos móviles y de escritorio.
- **Sistema de Fallback de Modelos:** Arquitectura robusta que reintenta la generación de texto con un modelo de IA secundario si el principal falla, garantizando una alta disponibilidad.

## 🚀 Instalación Local

Sigue estos pasos para configurar y ejecutar ThunderMail en tu máquina local.

### Prerrequisitos

- **Node.js:** Versión 20.x o superior.
- **npm** (o un gestor de paquetes equivalente como yarn o pnpm).
- **PostgreSQL:** Una instancia de base de datos PostgreSQL en ejecución.

---

### 1. Clonar el Repositorio

Primero, clona el repositorio en tu máquina local:```bash
git clone https://github.com/tu-usuario/thunder-mail.git
cd thunder-mail
```

---

### 2. Configuración del Backend

El backend se encarga de la lógica de negocio, la comunicación con la base de datos y la integración con la IA.

**a. Instalar Dependencias**

Navega a la carpeta `Backend` e instala las dependencias necesarias.
```bash
cd Backend
npm install
```

**b. Configurar la Base de Datos PostgreSQL**

Conéctate a tu instancia de PostgreSQL y ejecuta el siguiente script SQL para crear las tablas necesarias. La librería `better-auth` se encargará de crear sus propias tablas (`users`, `sessions`, etc.) automáticamente.

```sql
-- Tabla para almacenar los chats
CREATE TABLE chat (
    idchat SERIAL PRIMARY KEY,
    userid VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para almacenar los mensajes de cada chat
CREATE TABLE messages (
    idmessage SERIAL PRIMARY KEY,
    idchat INT NOT NULL REFERENCES chat(idchat),
    iduser VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant')),
    sendat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para almacenar los correos enviados
CREATE TABLE emailsended (
    idemail SERIAL PRIMARY KEY,
    idchat INT NOT NULL REFERENCES chat(idchat),
    iduser VARCHAR(255) NOT NULL,
    "from" VARCHAR(255) NOT NULL,
    "to" VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sendedat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**c. Crear Archivo de Entorno (`.env`)**

En la raíz del directorio `Backend`, crea un archivo llamado `.env` y añade las siguientes variables:

```env
# Base de Datos
CONECTION_STRING="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Autenticación (better-auth y Google OAuth)
# Genera una cadena secreta segura (puedes usar un generador online)
SECRET="TU_SECRET_SUPER_SEGURO"
GOOGLE_CLIENT_ID="TU_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="TU_GOOGLE_CLIENT_SECRET"

# Envío de Correo (Nodemailer con Gmail)
# IMPORTANTE: Debes usar una "Contraseña de aplicación" de Google, no tu contraseña normal.
EMAIL="tu-correo@gmail.com"
PASSWORD="tu_contraseña_de_aplicacion_de_google"

# Inteligencia Artificial (OpenRouter)
API_KEY="TU_API_KEY_DE_OPENROUTER"
LLM_MODEL="google/gemini-pro"
LLM_MODEL2="mistralai/mistral-7b-instruct" # Modelo de respaldo
```

**d. Ejecutar el Servidor Backend**

Una vez configurado, inicia el servidor de desarrollo:
```bash
npm run dev
```
El backend estará corriendo en `http://localhost:6543`.

---

### 3. Configuración del Frontend

El frontend es la interfaz de usuario construida con React y Vite.

**a. Instalar Dependencias**

Abre una nueva terminal, navega a la carpeta `Frontend` e instala sus dependencias.
```bash
cd Frontend
npm install
```

**b. Crear Archivo de Entorno (`.env`)**

En la raíz del directorio `Frontend`, crea un archivo `.env` y añade las siguientes variables para que se comunique con tu backend local.

```env
VITE_URL_BACKEND="http://localhost:6543"
VITE_URL_CALLBACK="http://localhost:5173"
```

**c. Ejecutar la Aplicación Frontend**

Inicia el servidor de desarrollo de Vite:
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

---

### 4. ¡Listo!

Ahora puedes abrir `http://localhost:5173` en tu navegador y utilizar ThunderMail localmente. ¡Disfruta de la redacción de correos asistida por IA!


## 🛠️ Stack Tecnológico

ThunderMail está construido con una arquitectura de monorepo, separando claramente las responsabilidades del frontend y el backend para una mayor escalabilidad y mantenibilidad.

### Frontend

- **Framework:** [React 19](https://react.dev/) con [Vite](https://vitejs.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [Shadcn UI](https://ui.shadcn.com/) y [Lucide React](https://lucide.dev/) para iconos.
- **Gestión de Estado:** React Context API y hooks personalizados.
- **Notificaciones:** [React Toastify](https://fkhadra.github.io/react-toastify/introduction)

### Backend

- **Framework:** [Node.js](https://nodejs.org/) con [Express](https://expressjs.com/)
- **Lenguaje:** JavaScript (ESM)
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/)
- **Autenticación:** [Better-Auth](https://better-auth.dev/) para la gestión de sesiones y OAuth con Google.
- **Generación de IA:** Integración con [OpenRouter AI](https://openrouter.ai/) para acceder a diversos modelos de lenguaje.
- **Envío de Correos:** [Nodemailer](https://nodemailer.com/)

## 🏗️ Arquitectura y Flujo de Datos

#### Diagrama de Arquitectura

Este diagrama muestra los componentes principales de ThunderMail y cómo interactúan entre sí y con servicios externos.

```mermaid
graph TD;
    %% --- Definición de Estilos ---
    classDef frontendStyle fill:#61DAFB,stroke:#333,stroke-width:2px,color:#333;
    classDef backendStyle fill:#8CC84B,stroke:#333,stroke-width:2px,color:#333;
    classDef dbStyle fill:#FFD43B,stroke:#333,stroke-width:2px,color:#333;
    classDef externalStyle fill:#F5F5F5,stroke:#666,stroke-width:2px,color:#333;

    %% --- Actores y Servicios Externos ---
    User["<fa:fa-user> Usuario"];
    Ext_Google["<fa:fa-google> Google OAuth"];
    Ext_DB["<fa:fa-database> PostgreSQL DB"];
    Ext_AI["<fa:fa-robot> OpenRouter AI"];
    Ext_Gmail["<fa:fa-envelope> Gmail SMTP"];

    %% --- Frontend (Navegador del Usuario) ---
    subgraph User's Browser
        direction LR
        subgraph Frontend [React App]
            direction TB
            FE_UI("Interfaz de Usuario <br/> React Components")
            FE_State("Gestión de Estado <br/> Context / Hooks")
            FE_Services("Servicios del Cliente <br/> API Service")
        end
    end

    %% --- Backend (Servidor Vercel) ---
    subgraph ThunderMail Backend API
        direction TB
        BE_Router{Express Router};
        subgraph Endpoints
            direction LR
            BE_Auth_EP["/api/auth/*"]
            BE_Chat_EP["/chat/*"]
        end
        subgraph Core Logic
            direction LR
            BE_Auth_Logic("Lógica de Auth <br/> better-auth")
            BE_AI_Client("Cliente de IA <br/> OpenRouter")
            BE_DB_Pool("Pool de DB <br/> PostgreSQL")
            BE_Mailer("Servicio de Correo <br/> Nodemailer")
        end
    end

    %% --- Conexiones ---
    User -- Interacts with --> FE_UI;
    FE_UI --> FE_State;
    FE_State --> FE_Services;
    
    FE_Services -- "HTTPS/API Calls" --> BE_Router;
    
    BE_Router --> BE_Auth_EP;
    BE_Router --> BE_Chat_EP;

    BE_Auth_EP --> BE_Auth_Logic;
    BE_Chat_EP --> BE_AI_Client;
    BE_Chat_EP --> BE_DB_Pool;
    BE_Chat_EP --> BE_Mailer;

    BE_Auth_Logic -- "Verifies with" --> Ext_Google;
    BE_DB_Pool -- "Reads/Writes" --> Ext_DB;
    BE_AI_Client -- "Generates text via" --> Ext_AI;
    BE_Mailer -- "Sends email via" --> Ext_Gmail;

    %% --- Aplicar Estilos ---
    class User,Ext_Google,Ext_DB,Ext_AI,Ext_Gmail externalStyle;
    class Frontend,FE_UI,FE_State,FE_Services frontendStyle;
    class BE_Router,BE_Auth_EP,BE_Chat_EP,BE_Auth_Logic,BE_AI_Client,BE_DB_Pool,BE_Mailer backendStyle;
```

#### Flujo: Generación de un Borrador de Correo

Este diagrama de secuencia detalla los pasos que ocurren cuando un usuario solicita la creación de un correo.

```mermaid
sequenceDiagram
    participant User as "<fa:fa-user> Usuario"
    participant Frontend as "Frontend (React App)"
    participant Backend as "Backend (Node.js API)"
    participant OpenRouter as "<fa:fa-robot> OpenRouter AI"
    participant Database as "<fa:fa-database> PostgreSQL"

    User->>Frontend: 1. Ingresa prompt y selecciona estilo
    
    activate Frontend
    Frontend->>Backend: 2. POST /chat/createText (prompt, style, userId)
    deactivate Frontend
    
    activate Backend
    Backend->>OpenRouter: 3. Solicita generación de borrador
    
    activate OpenRouter
    OpenRouter-->>Backend: 4. Devuelve borrador de correo generado
    deactivate OpenRouter
    
    Backend->>Database: 5. Guarda mensaje del usuario
    Backend->>Database: 6. Guarda respuesta del asistente
    
    Backend-->>Frontend: 7. 200 OK (JSON con el borrador)
    deactivate Backend
    
    activate Frontend
    Frontend->>User: 8. Muestra la conversación actualizada en la UI
    deactivate Frontend
```

---
*Desarrollado con ❤️ por [GuilleAlvareez](https://github.com/GuilleAlvareez)*
