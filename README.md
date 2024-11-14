# eCommerce API

An eCommerce API built with Express and MongoDB, designed to manage product listings, user accounts, orders, and more. This API supports basic CRUD operations, user authentication, and integration with a payment gateway.

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## Project Overview

This API provides backend functionality for an eCommerce platform where users can browse products, create an account, add items to their cart, place orders, and make payments. It is built with a modular structure to make it easy to extend and scale.

## Tech Stack
- **Node.js** + **Express.js**: Backend framework
- **MongoDB**: NoSQL database
- **JWT**: For user authentication
- **Docker**: Containerization
- **Swagger**: API documentation
- **Stripe API**: For payment processing

## Features
- **User Authentication**: Register, login, JWT-based authentication
- **Product Management**: CRUD operations for products
- **Order Processing**: Create, view, and manage orders
- **Shopping Cart**: Add and remove products
- **Payments**: Secure payment integration via Stripe
- **Role-Based Access**: Different access levels for users and admins

## Getting Started

### Prerequisites
- **Node.js** v14+ and **npm** installed
- **MongoDB** instance (local or cloud)
- **Docker** (optional, if using Docker for setup)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/username/ecommerce-api.git
   cd ecommerce-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables) below).

4. Start the server:
   ```bash
   npm start
   ```

5. The API will be available at `http://localhost:3000`.

### Running with Docker
1. Ensure Docker is installed and running.
2. Build and run the Docker containers:
   ```bash
   docker-compose up --build
   ```

## Folder Structure

```
ecommerce-api/
├── config/           # Configuration files
├── controllers/      # API route controllers
├── models/           # Mongoose models
├── routes/           # API routes
├── middlewares/      # Custom middleware
├── utils/            # Utility functions
├── .env.example      # Example environment variables
└── README.md         # Documentation
```

## Environment Variables

Create a `.env` file in the root directory based on `.env.example`. Below are the essential variables:

```plaintext
PORT=3000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
STRIPE_SECRET_KEY=<your_stripe_secret_key>
```

## API Endpoints

### Authentication
- **POST** `/api/v1/auth/register` - Register a new user
- **POST** `/api/v1/auth/login` - User login

### Products
- **GET** `/api/v1/products` - Get all products
- **GET** `/api/v1/products/:id` - Get a single product
- **POST** `/api/v1/products` - Add a new product (Admin only)
- **PUT** `/api/v1/products/:id` - Update product details (Admin only)
- **DELETE** `/api/v1/products/:id` - Delete a product (Admin only)

### Cart
- **POST** `/api/v1/cart` - Add an item to the cart
- **DELETE** `/api/v1/cart/:id` - Remove an item from the cart

### Orders
- **POST** `/api/v1/orders` - Place a new order
- **GET** `/api/v1/orders/:userId` - View user orders

### Payments
- **POST** `/api/v1/payments` - Process a payment (Stripe integration)

> **Note**: Full API documentation is available via Swagger at `/api-docs` (if Swagger is integrated).

## Contributing

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request and request a review.
