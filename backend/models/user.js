// Import frameworks
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Create schema for users which stores things like their names, their landlord's name,
 * their rent monthly payment, repair and other requests they've made among other things.
 * Some of this information is used to display to the user later/ for record keeping like
 * the lease information that will be displayed on the lease agreement page.
 *
 * NOTE: This model stores the landlord's name as entered in by the tenant. Landlord's are
 * not allowed to create accounts.
 */

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    authenticated: {
        type: Boolean,
        default: false
    }
});


module.exports = UserSchema;
