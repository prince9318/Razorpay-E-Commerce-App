# Razorpay E-Commerce App

A full-stack e-commerce application built with Node.js, Express, React, and TypeScript, integrated with Razorpay for payment processing.

## Features

- User authentication and registration
- Product catalog with admin management
- Shopping cart functionality
- Order management for users and admins
- Secure payment processing via Razorpay
- Responsive frontend with modern UI

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB (assumed from models)
- JWT for authentication
- Razorpay SDK for payments

### Frontend

- React 18
- TypeScript
- Vite for build tooling
- Context API for state management

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB database
- Razorpay account and API keys

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd razorpay
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:

   Create a `.env` file in the `backend` directory with:

   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   RAZORPAY_KEY_ID=<your-razorpay-key-id>
   RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
   ```

## Running the Application

1. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

   The backend will run on `http://localhost:5000`.

2. Start the frontend development server:

   ```bash
   cd frontend
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` (default Vite port).

3. (Optional) Seed the database:
   ```bash
   cd backend
   node seed.js
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product (admin)
- `PUT /api/products/:id` - Update a product (admin)
- `DELETE /api/products/:id` - Delete a product (admin)

### Orders

- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/admin` - Get all orders (admin)

### Payments

- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment

## Usage

1. Register or login as a user.
2. Browse products on the homepage.
3. Add items to cart and proceed to checkout.
4. Complete payment via Razorpay.
5. View orders in the user dashboard.
6. Admins can manage products and view all orders.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit changes: `git commit -am 'Add feature'`.
4. Push to branch: `git push origin feature-name`.
5. Submit a pull request.

## License

This project is licensed under the MIT License.
