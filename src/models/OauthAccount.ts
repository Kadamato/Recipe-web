import mongoose from "mongoose";
import { Schema } from "mongoose";

const OAuthAccountSchema = new Schema({
  providerId: String,
  providerUserId: String,
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const OAuthAccount =
  mongoose.models.OAuthAccount || // Ensure this matches the string used in mongoose.model
  mongoose.model("OAuthAccount", OAuthAccountSchema); // Consistent casing

export default OAuthAccount;
