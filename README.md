
### **Part 1: Engineering Write-Up - Project FileShare**

#### **From Concept to Global Deployment: Building a Secure, Ephemeral File Sharing Service**

As engineers, we often spot gaps in the digital landscape—opportunities where a focused, well-architected tool can provide significant value. I identified such a gap for a minimalist, privacy-first file and text sharing service. Existing solutions are often cluttered with ads, require user accounts, or have ambiguous data retention policies.

This observation led me to ideate and build **FileShare**: a secure, ephemeral sharing application for the public. The core premise is simple: upload content, get a unique link, and have the content automatically and permanently deleted after 24 hours. This project was a solo endeavor to demonstrate a full-stack, product-centric engineering skillset, from initial architecture to a production-ready global deployment.

#### **Architectural Philosophy: Pragmatism and Modern Standards**

The technology stack was chosen with a clear philosophy: leverage modern, robust frameworks to build a secure, scalable, and maintainable application efficiently.

*   **Backend (Spring Boot 3 & Java 21):** The Spring ecosystem was a deliberate choice for its mature security features, excellent data layer abstractions (Spring Data JPA), and powerful dependency injection, which allows for clean, decoupled code. Using Java 21 provided access to modern language features, enhancing conciseness and performance. The backend was designed as a stateless REST API, making it horizontally scalable and straightforward to containerize.

*   **Frontend (React, TypeScript & Vite):** A React frontend built with TypeScript and Vite offered the best-in-class developer experience and performance. TypeScript ensures a robust, type-safe codebase, which is critical for long-term maintainability. Vite provides lightning-fast builds and an optimized development server, maximizing efficiency. The choice of a Single-Page Application (SPA) architecture delivered a fluid, desktop-like user experience.

*   **Storage (Cloudflare R2 & PostgreSQL):** Cloudflare R2 was selected for its S3-compatible API and, crucially, zero egress fees, making it a highly cost-effective choice for a public-facing file-sharing service. For metadata, a PostgreSQL database was chosen for its reliability and rich support for time-based data types (like `TIMESTAMPTZ`), which was essential for the core 24-hour expiration feature.

#### **Navigating and Solving Real-World Deployment Challenges**

Building an application locally is one thing; deploying it securely and reliably for global access is another. This project required solving three distinct, high-stakes challenges that define modern web deployment.

**1. The Challenge: Container Connectivity and Configuration**

The initial deployment involved containerizing the Spring Boot backend and the PostgreSQL database. The challenge was ensuring the application could connect to the database and that all production secrets (like R2 API keys) were managed securely, not hardcoded.

*   **Solution:** I utilized Docker and defined the entire backend stack in a `docker-compose.yml` file for local development. For production, I transitioned to a decoupled `docker run` approach, using a Docker network (`fileshare-net`) to allow the application and database containers to communicate by name. All secrets were injected into the application container at runtime using a `.env` file via Docker's `--env-file` flag. This industry-standard practice ensures a clean separation of configuration from the application image, a core tenet of the Twelve-Factor App methodology.

**2. The Challenge: The SPA Routing Problem**

After deploying the frontend to Vercel, a classic SPA issue emerged. The homepage loaded, but any attempt to access a shared link directly (e.g., `/view/some-id`) resulted in a Vercel 404 error. This is because Vercel, as a static host, was looking for a non-existent file at that path.

*   **Solution:** I implemented a server-side rewrite rule by adding a `vercel.json` configuration file to the frontend project. This rule instructs Vercel to serve the main `index.html` for any request that doesn't match a static file. This passes control back to the client-side React Router, allowing it to correctly render the download page. It’s a clean, efficient solution that preserves the seamless user experience of an SPA.

**3. The Challenge: Securing the API with HTTPS**

The most critical challenge was a browser security violation. The secure HTTPS frontend on Vercel was blocked from communicating with the insecure HTTP backend on EC2, resulting in `ERR_SSL_PROTOCOL_ERROR`.

*   **Solution:** The robust, industry-standard solution is to use a reverse proxy for SSL termination. I installed and configured **Caddy** on the EC2 instance. Caddy sits in front of the Spring Boot container, automatically provisions a Let's Encrypt SSL certificate for the API subdomain (`api-share.nathanasowata.com`), and securely proxies traffic to the backend over the internal Docker network. This architecture offloads all SSL/TLS responsibilities from the application, simplifying the Java code and adhering to best practices for production security.

This project successfully translated a product idea into a fully deployed, secure, and functional web application. It demonstrates a holistic approach to engineering—balancing product requirements, architectural design, and the pragmatic resolution of real-world deployment complexities.

---

### **Part 2: Professional README.md**

# **FileShare - Secure, Ephemeral File Sharing**

FileShare is a minimalist, secure, and temporary file and text sharing web application. It allows users to upload content without an account, receive a unique sharable link, and have that content automatically deleted after 24 hours.

**Live Demo:** [https://share.nathanasowata.com](https://share.nathanasowata.com)

### **Key Features**

*   **Account-Free Uploads:** No registration required to upload files or text.
*   **Secure Links:** A cryptographically secure, random ID is generated for each upload.
*   **Automatic Expiration:** All content is permanently deleted from storage and the database 24 hours after creation.
*   **Privacy Focused:** No user tracking and minimal metadata storage.
*   **Clean UI:** A modern, responsive interface inspired by Microsoft's Fluent Design.
*   **File & Text Support:** Supports both file uploads (up to 25 MB) and text snippets (up to 100,000 characters).

---

### **Technology Stack**

| Component      | Technology                                                                                             |
| :------------- | :----------------------------------------------------------------------------------------------------- |
| **Frontend**   | React 18, TypeScript, Vite, Axios, React Router                                                        |
| **Backend**    | Java 21, Spring Boot 3, Spring Data JPA                                                                |
| **Database**   | PostgreSQL 16                                                                                          |
| **Storage**    | Cloudflare R2 (S3-Compatible Object Storage)                                                           |
| **Deployment** | Docker, AWS EC2 (t4g.small), Vercel (Frontend CDN), Caddy (Reverse Proxy & SSL)                          |

---

### **System Architecture**

```
+----------------+      +-------------------------+      +-----------------------+
|                |      |                         |      |                       |
|  User Browser  |----->|   Vercel Global CDN     |----->|    Frontend (React)   |
|                |      | (share.nathanasowata.com) |      |                       |
+----------------+      +-------------------------+      +-----------------------+
       |                                                            |
       | HTTPS Request (Upload/Download)                            |
       |                                                            |
       v                                                            v
+----------------+      +--------------------------+      +-----------------------+
|                |      |      AWS EC2 Instance    |      |                       |
|      API       |<-----|  Caddy Reverse Proxy     |----->|  Backend (Spring Boot)|
| (api-share...) |      |  (Port 443 -> 8080)      |      |     (Docker Container)|
+----------------+      +--------------------------+      +-----------------------+
                                                                  /       \
                                                                 /         \
                                     +------------------+     +------------------+
                                     | Cloudflare R2    |     | PostgreSQL DB    |
                                     | (File Storage)   |     | (Metadata)       |
                                     |                  |     | (Docker Container) |
                                     +------------------+     +------------------+
```

---

### **Running Locally**

1.  **Clone the Repository**
    ```bash
    git clone <your-repo-url>
    cd <repo-name>
    ```

2.  **Configure Backend**
    *   Navigate to the project root.
    *   Create a local `docker-compose.override.yml` to store your local secrets (this file is in `.gitignore`).
    *   Add your Cloudflare R2 credentials to this override file:
        ```yaml
        version: '3.8'
        services:
          app:
            environment:
              - AWS_S3_ENDPOINT_URL=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
              - AWS_S3_ACCESS_KEY_ID=<YOUR_R2_ACCESS_KEY_ID>
              - AWS_S3_SECRET_ACCESS_KEY=<YOUR_R2_SECRET_ACCESS_KEY>
              - AWS_S3_BUCKET_NAME=<YOUR_R2_BUCKET_NAME>
        ```

3.  **Run Backend Services**
    ```bash
    docker-compose up --build
    ```
    The backend will be available at `http://localhost:8080`.

4.  **Configure Frontend**
    *   In a separate terminal, navigate to the `frontend` directory: `cd frontend`.
    *   Create a `.env.local` file with the local backend URL:
        ```
        VITE_API_BASE_URL=http://localhost:8080
        ```

5.  **Run Frontend**
    ```bash
    npm install
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173`.

---

### **Production Environment Variables**

The following environment variables are required to run the backend container in production.

| Variable                       | Description                                                     | Example                                                              |
| :----------------------------- | :-------------------------------------------------------------- | :------------------------------------------------------------------- |
| `SPRING_DATASOURCE_URL`        | The JDBC URL for the PostgreSQL container.                      | `jdbc:postgresql://fileshare-db:5432/fileshare`                      |
| `SPRING_DATASOURCE_USERNAME`   | The username for the PostgreSQL database.                       | `user`                                                               |
| `SPRING_DATASOURCE_PASSWORD`   | The password for the PostgreSQL database.                       | `password`                                                           |
| `APP_DOMAIN`                   | The public domain of the frontend app (for generating links).   | `https://share.nathanasowata.com`                                    |
| `AWS_S3_ENDPOINT_URL`          | The full endpoint URL for the Cloudflare R2 bucket.               | `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`                        |
| `AWS_S3_ACCESS_KEY_ID`         | The Access Key ID for the R2 bucket.                              | `...`                                                                |
| `AWS_S3_SECRET_ACCESS_KEY`     | The Secret Access Key for the R2 bucket.                          | `...`                                                                |
| `AWS_S3_REGION`                | The region for the R2 bucket (usually `auto`).                  | `auto`                                                               |
| `AWS_S3_BUCKET_NAME`           | The name of the R2 bucket.                                        | `fileshare-prod`                                                     |