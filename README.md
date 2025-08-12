# Food Donation App

A full-stack web application that connects food donors with recipients, helping reduce food waste while supporting those in need.

## 🚀 Features

- **Food Donation Management**: Create, view, edit, and delete food donations
- **Real-time Updates**: Live tracking of donation status
- **User-friendly Interface**: Modern, responsive design built with Angular
- **RESTful API**: Robust backend with Node.js and Express
- **Data Persistence**: SQLite database for reliable data storage
- **API Documentation**: Swagger/OpenAPI documentation

## 🛠️ Tech Stack

### Frontend
- **Angular** - Modern web framework
- **TypeScript** - Type-safe development
- **SCSS** - Enhanced styling capabilities
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **SQLite** - Lightweight database
- **Swagger** - API documentation

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Angular CLI](https://angular.io/cli) (optional, for development)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/food-donation-app.git
cd food-donation-app
```

### 2. Backend Setup

```bash
# Navigate to the API directory
cd food-donation-api

# Install dependencies
npm install

# Start the server
npm start
```

The API server will be running on `http://localhost:3000`

### 3. Frontend Setup

Open a new terminal and run:

```bash
# Navigate to the frontend directory
cd food-donation

# Install dependencies
npm install

# Start the development server
npm start
```

The Angular application will be available at `http://localhost:4200`

## 📖 API Documentation

Once the backend server is running, you can access the API documentation at:
- Swagger UI: `http://localhost:3000/api-docs`

### Available Endpoints

- `GET /api/donations` - Get all donations
- `GET /api/donations/:id` - Get donation by ID
- `POST /api/donations` - Create new donation
- `PUT /api/donations/:id` - Update donation
- `DELETE /api/donations/:id` - Delete donation

## 🗄️ Database

The application uses SQLite for data storage. The database file is located at:
- `food-donation-api/database/donations.db`

### Sample Data

To populate the database with sample data:

```bash
cd food-donation-api
node scripts/seed-data.js
```

## 🎨 Project Structure

```
food-donation-app/
├── food-donation/          # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/      # Application pages
│   │   │   └── services/   # Angular services
│   │   └── assets/         # Static assets
│   └── package.json
├── food-donation-api/      # Node.js backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Data models
│   │   └── routes/         # API routes
│   ├── database/           # SQLite database
│   └── package.json
└── README.md
```

## 🔧 Development

### Running Tests

Frontend tests:
```bash
cd food-donation
npm test
```

### Building for Production

Frontend build:
```bash
cd food-donation
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who help make this project better
- Special thanks to the open-source community for the amazing tools and libraries

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Made with ❤️ to help reduce food waste and support communities in need.** 