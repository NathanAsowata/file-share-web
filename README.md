# FileShare - Frontend (Web)

FileShare is a minimalist, secure, and temporary file and text sharing web application. This repository contains the **frontend** client, built with React and TypeScript.

**Live Application:** [https://share.nathanasowata.com](https://share.nathanasowata.com)

This application is designed to communicate with the corresponding backend API, available at the [file-share (backend) repository](https://github.com/your-username/file-share).

---

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn

---

### Getting Started (Local Development)

To run the frontend development server locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/file-share-web.git
    cd file-share-web
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    The application needs to know the URL of the backend API. Create a `.env.local` file in the root of the project:
    ```bash
    touch .env.local
    ```
    Add the following line to the file. This points to the default address of the local backend instance.
    ```env
    VITE_API_BASE_URL=http://localhost:8080
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the next available port).

### Core Libraries Used

-   **React & TypeScript:** For building the user interface with type safety.
-   **Vite:** For a fast and modern development and build process.
-   **Axios:** For making HTTP requests to the backend API.
-   **React Router:** For handling client-side routing (`/` and `/view/:shortId`).
-   **React Dropzone:** For the file drag-and-drop component.
-   **Phosphor Icons:** For the icon set.

### Connecting to the Backend

For the application to be fully functional, the backend service from the `file-share` repository **must be running**. The `VITE_API_BASE_URL` environment variable connects this frontend to that service.