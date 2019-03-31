// Import frameworks
const mongoose = require('mongoose');
const hashGenerator = require('random-hash');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * Create schema for pending verifications
 */
const PendingVerificationSchema = new Schema({
  hash: {
    type: String,
    // Create a random confirmation token for the user
    default: () => hashGenerator.generateHash({ length: 16 }),
  },
  user: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  expireDate: {
    type: Date,
    default: () => Date.now() + 24*60*60*1000, // 24 hours
  }
});

PendingVerificationSchema.method('isExpired', function() {
  return this.expireDate < Date.now();
});

PendingVerificationSchema.method('getConfirmationLink', function() {
  return `${process.env.HOST_EMAIL_ROUTE}/authenticate/${this.hash}`
});

module.exports = PendingVerificationSchema;
