const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const userModel = require('./models/user');
const postModel = require('./models/blogPost');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/', (req, res) => {
  res.render('index');
});

app.post('/registerUser', async (req, res) => {
  let { username, name, email, password, age } = req.body;

  let user = await userModel.findOne({ email });

  if (user) {
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

        res.status(200).send("User registered successfully");
      } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).send("Internal server error");
      }
    });
  });
});


app.listen(3000, () => {
  console.log('App listening on port 3000!');
});