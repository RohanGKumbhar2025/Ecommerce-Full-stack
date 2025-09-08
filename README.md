# NexoShop Frontend 🛍️

[![React](https://img.shields.io/badge/React-18.0+-blue.svg?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-purple.svg?style=flat&logo=vite)](https://vitejs.dev/)

A modern e-commerce application built with React and Vite, featuring a complete shopping experience for customers and a robust admin dashboard for store management. This repository contains the frontend client.

👉 The backend is here: [Backend Repository](https://github.com/RohanGKumbhar2025/Ecommerce-backend)

<br>

## ✨ Features

* **🛒 Complete E-commerce Platform**: A seamless shopping journey including product browsing, a functional shopping cart, secure checkout, and order tracking for users.
* **❤️ Wishlist Functionality**: Users can save their favorite products to a persistent wishlist for later purchases.
* **🔐 User Authentication**: Secure login and signup for users, with clear navigation for guests.
* **⚙️ Admin Dashboard**: A dedicated, role-based dashboard for administrators to efficiently manage product inventory and review customer orders.
* **📱 Fully Responsive Design**: The application is built with Tailwind CSS, ensuring a perfect user experience across all devices and screen sizes.

<br>

## 🛠️ Tech Stack

* **Frontend Framework**: React.js + Vite
* **State Management**: React Context API
* **Styling**: Tailwind CSS
* **Routing**: React Router DOM
* **HTTP Client**: Axios
* **Animations & UI**: Framer Motion, `lucide-react`, `react-toastify`

<br>

## 🚀 Quick Start

Follow these steps to get the development environment running locally.

1.  **Clone the repository and install dependencies:**
    ```bash
    git clone [https://github.com/rohangkumbhar2025/ecommerce-full-stack.git](https://github.com/rohangkumbhar2025/ecommerce-full-stack.git)
    cd ecommerce-full-stack
    npm install
    ```

2.  **Set up environment variables:**
    Create a `.env` file in the project's root directory and add the URL for the backend API.
    ```env
    VITE_API_BASE_URL=[https://nexoshoppinge.onrender.com](https://nexoshoppinge.onrender.com)
    ```

3.  **Run the application:**
    To start the local development server:
    ```bash
    npm run dev
    ```

<br>

## 🔗 API Integration

This repository contains only the frontend of the application. The frontend communicates with a separate RESTful backend API using the base URL specified in the `.env` file. Key endpoints include:
* **Authentication**: `/api/auth/login`, `/api/auth/signup`
* **Products**: `/api/products`, `/api/products/:id`
* **User Data**: `/api/cart`, `/api/cart/wishlist`, `/api/orders`
* **Admin Tools**: `/api/admin/products`, `/api/admin/orders`

The backend repository can be found at: [Backend Repository Link]

<br>
## 🚀 Deployment

The project is configured for easy deployment on platforms like Vercel.

**Steps for Vercel:**
1.  Connect your GitHub repository to Vercel.
2.  Add the `VITE_API_BASE_URL` environment variable to your project settings on Vercel.
3.  Vercel will automatically build and deploy the application.

<br>


## 👨‍💻 Author

**Rohan Kumbhar**
* GitHub: [@rohangkumbhar2025](https://github.com/rohangkumbhar2025)

<br>

---
⭐ **Star this repo if you found it helpful!**
