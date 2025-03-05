const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Perfil del usuario
router.get('/profile', ensureAuthenticated, userController.getProfile);
router.post('/profile', ensureAuthenticated, userController.updateProfile);

// Favoritos del usuario
router.get('/favorites', ensureAuthenticated, userController.getFavorites);
router.post('/favorites/toggle', ensureAuthenticated, userController.toggleFavorite);

// Reseñas del usuario
router.get('/reviews', ensureAuthenticated, userController.getReviews);
router.post('/reviews/add', ensureAuthenticated, userController.addReview);
router.post('/reviews/edit', ensureAuthenticated, userController.editReview);
router.post('/reviews/delete', ensureAuthenticated, userController.deleteReview);

// Dashboard del usuario
router.get('/dashboard', ensureAuthenticated, userController.getDashboard);

module.exports = router;