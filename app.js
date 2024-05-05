// Import required modules
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const userModel = require('./models/user');
const postModel = require('./models/blogPost');

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
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await userModel.findOne({ email });

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
        const token = jwt.sign({ email: user.email, userID: user._id }, "secretkeyhere");

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
  const { username, name, email, password, age } = req.body;

  const user = await userModel.findOne({ email });

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
        const createdUser = await userModel.create({
          username,
          name,
          email,
          age,
          password: hash // Save hashed password to the database
        });

        // Sign JWT token with the newly created user's details
        const token = jwt.sign({ email: createdUser.email, userID: createdUser._id }, "secretkeyhere");

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
  try {
    const user = await userModel.findOne({ email: req.user.email }).populate("posts");
    res.render('profile', { user });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).send("Internal server error");
  }
});

// Create Post
app.post('/createPost', isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    const { blogContent } = req.body;

    const post = await postModel.create({
      user: user._id,
      content: blogContent,
    });

    user.posts.push(post._id);
    await user.save();
    res.redirect('/profile');
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).send("Internal server error");
  }
});


// Like Post
app.get('/like/:id', isLoggedIn, async (req, res) => {
  try {
    // Find the post by ID and populate the 'user' field
    const blogPost = await postModel.findById(req.params.id).populate('user');

    if (!blogPost) {
      return res.status(404).send('Post not found');
    }

    // Check if the user has already liked the post
    const likedIndex = blogPost.likes.indexOf(req.user.userID);

    if (likedIndex === -1) {
      // User hasn't liked the post, add the like
      blogPost.likes.push(req.user.userID);
    } else {
      // User has already liked the post, remove the like
      blogPost.likes.splice(likedIndex, 1);
    }

    // Save the updated post
    await blogPost.save();

    // Redirect to the profile page
    res.redirect('/profile');
  } catch (err) {
    console.error('Error liking post:', err);
    res.status(500).send('Internal server error');
  }
});



// Edit Post
app.get('/edit/:id', isLoggedIn, async (req, res) => {
  try {

    // Find the post by ID and populate the 'user' field
    const blogPost = await postModel.findById(req.params.id).populate('user');

    res.render('edit', { blogPost });

  } catch (err) {
    console.error('Error liking post:', err);
    res.status(500).send('Internal server error');
  }
});



// Edit Post
app.post('/editPost/:id', isLoggedIn, async (req, res) => {
  try {
    // Find the post by ID and update its content
    await postModel.findByIdAndUpdate({ _id: req.params.id }, { content: req.body.blogContent });

    res.redirect('/profile');
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).send("Internal server error");
  }
});


// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (!req.cookies.token) {
    // User not logged in
    return res.redirect('/login');
  }

  try {
    // Verify JWT token
    const data = jwt.verify(req.cookies.token, "secretkeyhere");
    req.user = data;
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(401).send("Unauthorized");
  }
}

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
