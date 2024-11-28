const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');

// Import Model From Models Folder
const User = require('./models/User');
const Contact = require('./models/Contact');
const Trip = require('./models/Trip');

// Import Routes
const usersRouter = require('./routes/users');

// initialize Express
const app = express();

// MongoDB Atlas Connection
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  //Ping test
  console.log('MongoDB Atlas Connected');
  return mongoose.connection.db.admin().ping();
})
.then(() => console.log('Database ping Check Connection successful'))
.catch(err => {
  //Case connection failure
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Handle Connection Event
const db = mongoose.connection

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

db.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

// Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

// EJS Configuration
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false}
}));

// Flash messages
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

// Passport Localstrategy
passport.use(new LocalStrategy({ 
  usernameField: 'email',
  passwordField: 'password' 
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
      if (!user) {
        console.log('User not found:', email);
        return done(null, false, { message: 'Incorrect email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password incorrect for user:', email);
        return done(null, false, { message: 'Incorrect email or password.' });
      }
      return done(null, user);
  } catch (err) {
    console.error('Passport strategy error:', err);
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Global Middleware
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.path = req.path;
  res.locals.title = '';
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Authentication Middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please log in to access this page');
  res.redirect('/login');
};

// Contact Routes GET & POST
app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us'
  });
});

app.post('/contact', async (req, res) => {
  console.log('Received contact form submission:', req.body);
  try {
    const { name, email, subject, message } = req.body;
        
    if (!name || !email || !subject || !message) {
      return res.render('contact', {
        title: 'Contact Us',
          error: 'All fields are required',
          success: null
      });
    }

    const newContact = new Contact({
      name,
      email,
      subject,
      message,
      createdAt: new Date()
    });

    await newContact.save();
    req.flash('success_msg', 'Your message has been sent successfully!');
    res.redirect('/contact');

  } catch (error) {
    console.error('Error saving contact:', error);
      res.render('contact', {
        error: 'An error occurred while sending your message',
        title: 'Contact Us',
        success: null
      });
  }
});

// Authentication Login Routes GET & POST
app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }
  res.render('login', {
    title: 'Login',
    error: req.flash('error') 
  });
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Login error:', err);
      return next(err);
    }
        
    if (!user) {
      req.flash('error', info.message || 'Invalid credentials');
      return res.redirect('/login');
    }
        
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return next(err);
      }
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});

// Authentication Register Routes GET & POST
app.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }
  res.render('register', {
    title: 'Register',
    error: req.flash('error')
  });
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    console.log('Registration attempt:', { name, email });

    if (!name || !email || !password || !confirmPassword) {
      console.log('Validation failed: Missing fields');
      req.flash('error', 'All fields are required');
      return res.redirect('/register');
    }

    // Check Is Password Equal Confirm Password
    if (password !== confirmPassword) {
      console.log('Validation failed: Passwords do not match');
      req.flash('error', 'Passwords do not match');
      return res.redirect('/register');
    }
        
    // Check Is User Email Already Existed
    const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('User already exists:', email);
        req.flash('error', 'Email already registered');
        return res.redirect('/register');
      }

    // Create New User With hashed Password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    // Save New User In MongoDB
    await newUser.save();
    console.log('User registered successfully:', email);
    req.flash('success', 'Registration successful! Please login.');
    res.redirect('/login');

  } catch (err) {
    console.error('Registration error:', err);
    req.flash('error', 'Registration failed: ' + err.message);
    res.redirect('/register');
  }
});

// Trip Routes Create GET & POST
app.get('/trips/new', isAuthenticated, (req, res) => {
  try{
    res.render('trips/new', { 
      title: 'New Trip', 
      user: req.user 
    });
  } catch (error) {
    console.error('Error rendering new trip form:', error);
      res.status(500).render('error', {
        title: 'Error',
        user: req.user,
        message: 'Error loading new trip form'
      });
  }
});

app.post('/trips/new', isAuthenticated, async (req, res) => {
  try {
    const { destination, startDate, endDate, description } = req.body;
        
    const newTrip = new Trip({
      destination,
      startDate,
      endDate,
      description,
      user: req.user._id
    });

    // Save New Trip In MongoDB
    await newTrip.save();
    console.log('New Trip Create successfully:', newTrip);
    req.flash('success', 'Trip created successfully!');
    res.redirect('/dashboard');

  } catch (error) {
    console.error('Create trip error:', error);
    req.flash('error', 'Error creating trip');
    res.redirect('/trips/new');
  }
});

// Trip Routes Edit GET & POST
app.get('/trips/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id
    });
        
    if (!trip) {
      req.flash('error', 'Trip not found');
      return res.redirect('/dashboard');
    }

    res.render('trips/edit', {
      title: 'Edit Trip',
      user: req.user,
      trip: trip
    });

  } catch (error) {
    console.error('Edit trip error:', error);
    req.flash('error', 'Error loading trip');
    res.redirect('/dashboard');
  }
});

app.post('/trips/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const { destination, startDate, endDate, description } = req.body;
    await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { destination, startDate, endDate, description }
    );
        req.flash('success', 'Trip updated successfully!');
        res.redirect('/dashboard');
    
  } catch (error) {
    console.error('Update trip error:', error);
    req.flash('error', 'Error updating trip');
    res.redirect(`/trips/edit/${req.params.id}`);
  }
});

// Trip Routes Delete POST
app.post('/trips/delete/:id', isAuthenticated, async (req, res) => {
  try {
    await Trip.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    req.flash('success', 'Trip deleted successfully!');
    res.redirect('/dashboard');

  } catch (error) {
    console.error('Delete trip error:', error);
    req.flash('error', 'Error deleting trip');
    res.redirect('/dashboard');
  }
});

// User Profile GET
app.get('/profile', isAuthenticated, (req, res) => {
  res.render('profile', { 
    title: 'Profile', 
    user: req.user 
  });
});

// User Profile Route Update GET & PUT
app.get('/updateProfile/:email', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email
    });
  
    if(!user) {
      res.flash('error', 'User not found');
      return res.redirect('/profile');
    }

    if (user.email !== req.user.email) {
      req.flash('error', 'Unauthorized access');
      return res.redirect('/profile');
    }

    res.render('updateProfile', { 
      title: 'Edit Profile Page', 
      user: req.user 
    });
  } catch (err) {
    console.error('Update user profile error', error);
    res.flash('error', "Error loading User Profile");
    res.redirect('/profile')
  }
});

app.post('/updateProfile/:email', isAuthenticated, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = { name, email };
        
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });
    if (!updatedUser) {
      req.flash('error', 'User not found');
      return res.redirect('/profile');
    }

      req.flash('success', 'Profile updated successfully');
      res.redirect('/profile');
  } catch (err) {
    console.error('Update profile error:', err);
    req.flash('error', 'Unable to update profile');
    res.redirect('/profile');
  }
});

app.post('/updateProfile/:email', isAuthenticated, async (req, res) => {
  try {
    if (req.params.email !== req.user.email) {
      req.flash('error', 'Unauthorized access');
      return res.redirect('/profile');
    }

    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email) {
      req.flash('error', 'Name and email are required');
      return res.redirect(`/updateProfile/${req.user.email}`);
    }

    // Check Is Email Exist
    if (email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        req.flash('error', 'Email already in use');
        return res.redirect(`/updateProfile/${req.user.email}`);
      }
    }

    const updateData = { name, email };

    updateData.password = await bcrypt.hash(password, 10);

    // Update User
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      req.flash('error', 'User not found');
      return res.redirect('/profile');
    }

    req.flash('success', 'Profile updated successfully');
    res.redirect('/profile');

  } catch (error) {
    console.error('Update profile error:', error);
    req.flash('error', 'Unable to update profile. Please try again.');
    res.redirect(`/updateProfile/${req.user.email}`);
  }
});

// Delete Account Route
app.post('/account/delete', isAuthenticated, async (req, res) => {
  try {
    await Trip.deleteMany({ user: req.user._id });
    await User.findByIdAndDelete(req.user._id);
        
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).send('Error logging out after account deletion');
      }
      req.flash('success_msg', 'Your account has been successfully deleted');
      res.redirect('/');
    });

  } catch (err) {
    console.error('Error deleting account:', err);
    req.flash('error_msg', 'An error occurred while deleting your account');
    res.redirect('/profile');
  }
});

// Public Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home', user: req.user });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About', user: req.user });
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/');
    }
      req.flash('success', 'You have been logged out');
      res.redirect('/');
  });
});

// Protected Routes
app.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id });
        
    res.render('dashboard', {
      title: 'Dashboard',
      user: req.user,
      trips: trips
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error', 'Error loading dashboard');
    res.render('dashboard', {
      title: 'Dashboard',
      user: req.user,
      trips: []
    });
  }
});

app.get('/trip-planner', isAuthenticated, (req, res) => {
  res.render('trip-planner', { 
    title: 'Trip Planner', 
    user: req.user 
  });
});

app.get('/budget-calculator', isAuthenticated, (req, res) => {
  res.render('budget-calculator', { 
    title: 'Budget Calculator', 
    user: req.user 
  });
});

app.get('/my-trips', isAuthenticated, (req, res) => {
  res.render('my-trips', { 
    title: 'My Trips', 
    user: req.user 
  });
});

app.get('/settings', isAuthenticated, (req, res) => {
  res.render('settings', { 
    title: 'Settings', 
    user: req.user 
  });
});

app.use('/users', usersRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});