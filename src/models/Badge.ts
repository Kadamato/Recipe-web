import mongoose, { Schema } from "mongoose";

const badgeSchema = new Schema(
  {
    avatar_url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owners: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Badge = mongoose.models.Badge || mongoose.model("Badge", badgeSchema);

export default Badge;
