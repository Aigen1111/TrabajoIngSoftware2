const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');
const connectFlash = require('connect-flash');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { ensureAuthenticated, ensureAdmin } = require('./middleware/authMiddleware');
require('dotenv').config();
require('./config/passport')(passport);

const app = express();

// Conectar a la base de datos
connectDB();

// Configuración de EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layout'); // Configurar el layout por defecto

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(connectFlash());
app.use(express.static('public'));

// Variables globales
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Rutas
app.use('/', authRoutes);
app.use('/', adminRoutes);
app.get('/', (req, res) => res.render('index', { title: 'Inicio' }));
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  if (req.user.role === 'admin') {
    res.redirect('/admin/dashboard');
  } else {
    res.render('dashboard', { title: 'Dashboard', user: req.user });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));