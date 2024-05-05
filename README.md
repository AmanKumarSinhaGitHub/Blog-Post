# Simple Blog Application

This is a simple blog application built with Node.js, Express.js, EJS, and MongoDB.

## Features

- User authentication (registration and login)
- Create, edit, and delete posts
- View all posts by a user

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd <project-directory>
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the application:

   ```bash
   npm start
   ```

   or

   ```bash
   npx nodemon .\app.js
   ```

5. Open your web browser and go to `http://localhost:3000` to access the application.

## Dependencies

- Express.js: Web framework for Node.js
- EJS: Templating engine for rendering views
- Mongoose: MongoDB object modeling tool
- Bcrypt: Password hashing library
- Jsonwebtoken: Library for generating and verifying JSON web tokens
- Cookie-parser: Middleware for parsing cookies

## Configuration

Before running the application, make sure to configure the MongoDB connection string in `app.js`:

```javascript
mongoose.connect("mongodb://localhost:27017/blog");
```