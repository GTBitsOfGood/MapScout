// Import frameworks
const mongoose = require('mongoose');

// Import schemas from their files
const UserSchema = require('./user');
const PendingVerificationSchema = require('./pendingVerification');

// Create a database model for each schema
const User = mongoose.model('User', UserSchema);
const PendingVerification = mongoose.model('PendingVerification', PendingVerificationSchema);

// Export all schemas
module.exports = {
  User,
  PendingVerification
};
