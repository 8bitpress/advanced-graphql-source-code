import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  accountId: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  description: {
    type: String,
    maxlength: 256
  },
  following: [mongoose.Schema.Types.ObjectId],
  fullName: {
    type: String,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  }
});

profileSchema.index({ fullName: "text", username: "text" });

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
