const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    category: {
      type: String,
      default: "Other",

      // enum: ['ikea', 'liddy', 'caressa', 'marcos'],
    },
    //   userId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    //   }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Product", productSchema);
