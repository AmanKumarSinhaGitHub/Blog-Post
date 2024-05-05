# Simple Blog Application

This is a simple blog application built with Node.js, Express.js, EJS, and MongoDB.

## Features

- User authentication (registration and login)
- Create, edit, and delete posts
- View all posts by a user
- Upload and update profile images
- Like and unlike posts

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AmanKumarSinhaGitHub/Blog-Post
   ```

2. Navigate to the project directory:

   ```bash
   cd Blog-Post
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the application:

   ```bash
   nodemon .\app.js
   ```

5. Open your web browser and go to `http://localhost:3000` to access the application.

## Dependencies

- Express.js: Web framework for Node.js
- EJS: Templating engine for rendering views
- Mongoose: MongoDB object modeling tool
- Bcrypt: Password hashing library
- Jsonwebtoken: Library for generating and verifying JSON web tokens
- Cookie-parser: Middleware for parsing cookies
- Multer: Middleware for handling file uploads

## Configuration

Before running the application, make sure to configure the MongoDB connection string in `app.js`:

```javascript
mongoose.connect("mongodb://localhost:27017/blog");
```

## Usage

- Register a new user account by providing username, name, email, password, and age.
- Log in with your credentials to access your profile.
- Create new blog posts, edit or delete existing posts.
- Like or unlike posts.
- Upload or update your profile image.
- Log out from your account when done.

## Folder Structure

- `config`: Configuration files (multer configuration).
- `models`: Database models (user and blog post).
- `public`: Static assets (stylesheets, images).
- `routes`: Route handlers for different endpoints.
- `views`: EJS view templates.
- `app.js`: Main application file.

## Thanks

Feel free to reach out with any questions or feedback!