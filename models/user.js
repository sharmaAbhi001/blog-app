const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { createTokenForUser, validateToken} = require("../services/authontication")

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: { // Changed from 'slat' to 'salt'
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/Profile-PNG.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  // Check if the password is modified
  if (!user.isModified("password")) {
    return next(); // Continue to the next middleware
  }

  // Generate salt and hash the password
  const salt = randomBytes(16).toString('hex'); // Ensure to convert to hex
  const hashPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  // Store the salt and hashed password
  user.salt = salt; // Use the correct property name
  user.password = hashPassword;

  next(); // Proceed to save the user
});

userSchema.static('matchPasswordAndGenerateToken', async function(email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error('User not Found');

    const salt = user.salt;
    const hashPassword=user.password;

    const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

    if(hashPassword != userProvidedHash) throw new Error('incorrect Password !');

    const token = createTokenForUser(user);
    return token;
});

const User = model("User", userSchema); // Capitalized model name for consistency

module.exports = User;
