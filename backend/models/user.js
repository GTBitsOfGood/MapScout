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
    address: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: false
    },
    // Lease Information
    landlordFirstName: {
        type: String
    },
    landlordLastName: {
        type: String
    },
    landlordEmail: {
        type: String
    },
    landlordNumber: {
        type: String
    },
    // Information pertaining to lease timeline and rent here.
    leaseStartDate: {
        type: String
    },
    leaseEndDate: {
        type: String
    },
    monthlyRent: {
        type: String
    },
    securityDeposit: {
        type: String
    },
    // Information about utilies and apartment amenities here.
    numberOfBedrooms: {
        type: String
    },
    utilities: {
        type: String
    },
    address: {
        type: String
    },
    notes: {
        type: String
    },
    images: [
        {
            type: String, // Storage bucket image key (Azure or AWS)
            required: true
        }
    ],

    // Information about payments, complaints and repair requests tenent has made.
    payments: [
        {
            type: Schema.ObjectId,
            ref: "Payment",
            default: []
        }
    ],
    issues: [
        {
            type: Schema.ObjectId,
            ref: "Issue",
            default: []
        }
    ],
    authenticated: {
        type: Boolean,
        default: false
    }
});

/**
 * Find the current user id = id and update the fields.
 * We check if the parameters are non-null and if they're not we update the repair model.
 * Otherwise, we set the value equal to itself for simplicity as opposed to checking
 * for each value's nullity.
 */
UserSchema.statics.updateLeaseAgreement = function(
    userId,
    images,
    landlordFirstName,
    landlordLastName,
    landlordNumber,
    landlordEmail,
    leaseStartDate,
    leaseEndDate,
    monthlyRent,
    securityDeposit,
    numberOfBedrooms,
    utilities,
    address,
    notes
) {
    return this.findById(userId).then(user => {
        if (user) {
            user.images = images ? images : user.images;
            user.landlordFirstName = landlordFirstName
                ? landlordFirstName
                : user.landlordFirstName;
            user.landlordLastName = landlordLastName
                ? landlordLastName
                : user.landlordLastName;
            user.landlordNumber = landlordNumber
                ? landlordNumber
                : user.landlordNumber;
            user.landlordEmail = landlordEmail
                ? landlordEmail
                : user.landlordEmail;
            user.leaseEndDate = leaseEndDate ? leaseEndDate : user.leaseEndDate;
            user.monthlyRent = monthlyRent ? monthlyRent : user.monthlyRent;
            user.securityDeposit = securityDeposit
                ? securityDeposit
                : user.securityDeposit;
            user.numberOfBedrooms = numberOfBedrooms
                ? numberOfBedrooms
                : user.numberOfBedrooms;
            user.utilities = utilities ? utilities : user.utilities;
            user.rentMailingAddress = address ? address : user.address;
            user.notes = notes ? notes : user.notes;
        }
        return user.save();
    });
};

module.exports = UserSchema;
