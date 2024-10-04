// server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('./models/User'); // Ensure correct path

const app = express();

const { ensureAuthenticated } = require('./config/auth');

// ====== Middleware ======

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Method Override Middleware
app.use(methodOverride('_method'));

// Express Session Middleware
app.use(session({
    secret: 'todoappsecret', // Replace with a strong secret in production
    resave: false,
    saveUninitialized: false
}));

// Connect Flash Middleware
app.use(flash());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Global Variables for Flash Messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); // For Passport error messages
    next();
});

// Set EJS as the Templating Engine
app.set('view engine', 'ejs');

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// ====== Database Connection ======

const dbURI = process.env.MONGOURI;

mongoose.connect(dbURI, {
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// ====== Passport Configuration ======

// Local Strategy for Username and Password
// Example for login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      const user = await User.findOne({ username });

      if (!user) {
          return res.render('login', { message: 'User not found.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.render('auth/login', { message: 'Incorrect password. Please try again.' });
      }

      // Redirect or render the next page if successful
      req.session.userId = user._id;
      res.redirect('/dashboard'); // Change this to your desired route
  } catch (error) {
      console.error(error);
      res.render('auth/login', { message: 'An error occurred. Please try again later.' });
  }
});

// Example for registration route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();

      res.render('auth/login', { message: 'Registration successful! Please log in.' });
  } catch (error) {
      console.error(error);
      res.render('auth/register', { message: 'An error occurred. Please try again later.' });
  }
});


// Serialize and Deserialize User
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// ====== Define the To-Do Model ======

const Todo = require('./models/Todo');

// ====== Routes ======

// Import Authentication Routes
const authRouter = require('./routes/auth');

// Use Auth Routes
app.use('/', authRouter);

app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard/index', { user: req.user });
});

// Home Route - Redirect to Todos
app.get('/', (req, res) => {
    res.render('index');
});

// Display All To-Dos
app.get('/todos', ensureAuthenticated, async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.render('todos/todos', { todos });
    } catch (err) {
        req.flash('error_msg', 'Error fetching to-dos');
        res.redirect('/');
    }
});

// Show Form to Create New To-Do
app.get('/todos/new', ensureAuthenticated, (req, res) => {
    res.render('todos/new');
});

// Create New To-Do
app.post('/todos', ensureAuthenticated, async (req, res) => {
    const { text } = req.body;
    if (!text) {
        req.flash('error_msg', 'Please enter a to-do item');
        return res.redirect('/todos/new');
    }

    try {
        const newTodo = new Todo({ text, user: req.user.id });
        await newTodo.save();
        req.flash('success_msg', 'To-Do added successfully');
        res.redirect('/todos');
    } catch (err) {
        req.flash('error_msg', 'Error adding to-do');
        res.redirect('/todos/new');
    }
});

// Show Form to Edit To-Do
app.get('/todos/:id/edit', ensureAuthenticated, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo || todo.user.toString() !== req.user.id) {
            req.flash('error_msg', 'To-Do not found');
            return res.redirect('/todos');
        }
        res.render('todos/edit', { todo });
    } catch (err) {
        req.flash('error_msg', 'Error fetching to-do');
        res.redirect('/todos');
    }
});

// Update To-Do
app.put('/todos/:id', ensureAuthenticated, async (req, res) => {
    const { text, completed } = req.body;
    if (!text) {
        req.flash('error_msg', 'Please enter a to-do item');
        return res.redirect(`/todos/${req.params.id}/edit`);
    }

    try {
        let todo = await Todo.findById(req.params.id);
        if (!todo || todo.user.toString() !== req.user.id) {
            req.flash('error_msg', 'To-Do not found');
            return res.redirect('/todos');
        }

        todo.text = text;
        todo.completed = completed === 'on' ? true : false;
        await todo.save();

        req.flash('success_msg', 'To-Do updated successfully');
        res.redirect('/todos');
    } catch (err) {
        req.flash('error_msg', 'Error updating to-do');
        res.redirect('/todos');
    }
});

// Delete To-Do
app.delete('/todos/:id', ensureAuthenticated, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo || todo.user.toString() !== req.user.id) {
            req.flash('error_msg', 'To-Do not found');
            return res.redirect('/todos');
        }

        await todo.remove();
        req.flash('success_msg', 'To-Do deleted successfully');
        res.redirect('/todos');
    } catch (err) {
        req.flash('error_msg', 'Error deleting to-do');
        res.redirect('/todos');
    }
});

// ====== Start the Server ======

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
