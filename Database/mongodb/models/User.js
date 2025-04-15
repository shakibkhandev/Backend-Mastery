const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 30,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Add password validation logic here if needed
          return value.length >= 6; // Example: minimum 6 characters
        },
        message: "Password must be at least 6 characters long",
      },
    },
    type: {
      type: String,
      required: true,
      enum: ["USER", "ADMIN", "CREATOR"],
      default: "USER",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
