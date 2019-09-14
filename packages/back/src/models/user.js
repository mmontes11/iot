import mongoose from "../lib/mongoose";
import regex from "../utils/regex";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    match: regex.passwordRegex,
  },
  creationTime: {
    type: Date,
    default: Date.now(),
  },
});
const UserModel = mongoose.model("User", UserSchema);

export { UserSchema, UserModel };
