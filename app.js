const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const userModel = require('./models/user');
const postModel = require('./models/post');

// Set view engine and middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Homepage route
app.get('/', (req, res) => {
  res.render('index');
});

// Login page route
app.get('/login', (req, res) => {
  res.render('login');
});

// Logout route
app.get('/logout', (req, res) => {
  // Clear token cookie and redirect to login page
  res.cookie("token", "");
  res.redirect("/login");
});

// Login route
app.post('/login', async (req, res) => {
  let { email, password } = req.body;

  try {
    // Find the user by email
    let user = await userModel.findOne({ email });

    if (!user) {
      // User not found
      return res.status(400).send("User Not Found");
    }

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).send("Internal server error");
      }
      if (result) {
        // Passwords match, login successful

        // Generate JWT token
        let token = jwt.sign({ email: user.email, userID: user._id }, "secretkeyhere");

        // Set JWT token as a cookie
        res.cookie("token", token);

        res.status(200).redirect('/profile');
      } else {
        // Passwords don't match, redirect to login page
        res.redirect('/login');
      }
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send("Internal server error");
  }
});

// User registration route
app.post('/registerUser', async (req, res) => {
  let { username, name, email, password, age } = req.body;

  let user = await userModel.findOne({ email });

  if (user) {
    // User already registered
    return res.status(500).send("User Already Registered");
  }

  // Generate salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return res.status(500).send("Error generating salt");
    }

    // Hash the password using the generated salt
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        return res.status(500).send("Error hashing password");
      }

      // Create new user with hashed password
      try {
        let createdUser = await userModel.create({
          username,
          name,
          email,
          age,
          password: hash // Save hashed password to the database
        });

        // Sign JWT token with the newly created user's details
        let token = jwt.sign({ email: createdUser.email, userID: createdUser._id }, "secretkeyhere");

        // Set JWT as a cookie
        res.cookie("token", token);

        res.status(200).redirect("/profile");
      } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).send("Internal server error");
      }
    });
  });
});

// Profile route - accessible only if user is logged in
app.get('/profile', isLoggedIn, async (req, res) => {
  // console.log(req.user);

  let user = await userModel.findOne({email: req.user.email})
  res.render('profile', {user})
});


// Create Post
app.post('/createPost', isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({email: req.user.email})
  let {blogContent} = req.body;

  let post = await postModel.create({
    user: user._id,
    content: blogContent,
  });

  // console.log(post);

  user.posts.push(post._id);
  await user.save();
  res.redirect('/profile');
})

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.cookies.token === "" || req.cookies.token === undefined) {
    // User not logged in
    res.redirect('/login');
  }
  else {
    // User logged in, decode token and attach user data to request object
    let data = jwt.verify(req.cookies.token, "secretkeyhere");
    req.user = data;
    next();
  }
}

// Start server
app.listen(3000, () => {
  console.log('App listening on port 3000!');
});