const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "not provided"],
      default: "not provided",
    },
    email: {
      type: String,
    },
    postalAddress: {
      type: Object,
      streetAddress: {
        type: String,
      },
      city: {
        type: String,
      },
      countryRegion: {
        type: String,
      },
      zipPostalCode: {
        type: Number,
      },
    },
    password: {
      type: String,
    },
    phoneNum: {
      type: Number,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    googleId: {
      type: Number,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
    verificationToken: String,

    //   userId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    //   }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("User", userSchema);
