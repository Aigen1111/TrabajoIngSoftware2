const User = require('../models/User');
const Movie = require('../models/Movie');
const Review = require('../models/Review');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites').populate('reviews');
    res.render('profile', { title: 'Profile', user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.updateProfile = async (req, res) => {
  const { username, email } = req.body;
  try {
    await User.findByIdAndUpdate(req.user.id, { username, email });
    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.render('favorites', { title: 'Favorites', favorites: user.favorites });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.toggleFavorite = async (req, res) => {
  const { movieId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user.favorites.includes(movieId)) {
      user.favorites = user.favorites.filter(fav => fav.toString() !== movieId);
    } else {
      user.favorites.push(movieId);
    }
    await user.save();
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id }).populate('movie');
    res.render('reviews', { title: 'My Reviews', reviews });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.addReview = async (req, res) => {
  const { movieId, comment } = req.body;
  try {
    const review = new Review({ user: req.user.id, movie: movieId, comment });
    await review.save();
    res.redirect('/reviews');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.editReview = async (req, res) => {
  const { reviewId, comment } = req.body;
  try {
    await Review.findByIdAndUpdate(reviewId, { comment });
    res.redirect('/reviews');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.deleteReview = async (req, res) => {
  const { reviewId } = req.body;
  try {
    await Review.findByIdAndDelete(reviewId);
    res.redirect('/reviews');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const movies = await Movie.find();
    const user = await User.findById(req.user.id).populate('favorites');
    res.render('dashboard', { title: 'Dashboard', user, movies });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
}; 