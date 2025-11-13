<div align="center">
  <img src="public/logo.png" alt="Traugutt.net Logo" width="150">
  <h1 align="center">Traugutt.net</h1>
  <p align="center">
    The official web portal for the Traugutt community. <br />
    A modern, feature-rich platform for students, teachers, and staff.
  </p>
</div>

---

## 🚀 Introduction

Traugutt.net is more than just a school website; it's a digital ecosystem designed to connect, inform, and engage our community. Built with modern technologies, this platform serves as a central hub for announcements, school life, academic resources, and much more. Our goal is to provide a seamless and profound digital experience that reflects the spirit of our institution.

## ✨ Features

This platform is packed with features to serve the needs of our community:

-   **👤 User Authentication:** Secure sign-in for students and staff using LDAP, with a robust role-based access system.
-   **🖥️ Dashboard:** A personalized dashboard for every user, providing quick access to relevant information.
-   **📢 Announcements:** A dedicated section for school-wide announcements, ensuring everyone stays up-to-date.
-   **📅 Calendar:** An interactive school calendar with events, holidays, and important dates.
-   **📝 Posts & Articles:** A space for news, articles, and stories about school life.
-   **👨‍🏫 Teacher Profiles:** A directory of our esteemed faculty with their profiles and contact information.
-   **🎲 Lucky Numbers:** A fun, daily lucky numbers feature.
-   **🔍 Search:** A powerful search engine to easily find posts, events, and other information.
-   **🔔 Notifications:** A system to keep users notified about important updates.
-   **📄 MDX Content:** Static pages are written in MDX, allowing for rich and dynamic content.

## 🛠️ Tech Stack

This project is built with a modern and powerful technology stack:

-   **Framework:** [Next.js](https://nextjs.org/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Database ORM:** [Prisma](https://www.prisma.io/)
-   **Authentication:** [Next-Auth](https://next-auth.js.org/) with an LDAP provider.
-   **Content:** [MDX](https://mdxjs.com/) for rich content pages.
-   **Deployment:** [Docker](https://www.docker.com/) & [Nginx](https://www.nginx.com/)

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v20.x or later)
-   npm or yarn
-   A running PostgreSQL or other compatible database.
-   Access to an LDAP server for authentication.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd Traugutt.net
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the necessary environment variables. See the `.env.example` section below.

4.  **Run database migrations:**
    ```sh
    npx prisma db push
    ```

### Running the Development Server

Once the setup is complete, you can run the development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### `.env.example`

Your `.env` file should look something like this:

```env
# Prisma
DATABASE_URL="postgresql://user:password@host:port/database"

# Next-Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="a-very-secret-string"

# LDAP
LDAP_URI="ldap://your-ldap-server.com"
LDAP_BIND_DN="cn=admin,dc=example,dc=com"
LDAP_BIND_PASSWORD="admin-password"
LDAP_SEARCH_BASE="ou=users,dc=example,dc=com"

# Other
NEXT_PUBLIC_URL="http://localhost:3000"
```

## 🚀 Deployment

This application is configured for deployment with Docker.

1.  **Build the Docker image:**
    ```sh
    docker build -t traugutt-net .
    ```

2.  **Run the Docker container:**
    ```sh
    docker run -p 3000:3000 traugutt-net
    ```

The `nginx.conf` file is also provided for setting up a reverse proxy if needed.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information. (Note: A `LICENSE` file should be added to the repository).

---

<div align="center">
  Made with ❤️ by the Traugutt.net Team
</div>