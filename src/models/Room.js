import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["empty", "occupied", "late", "maintenance"],
      default: "empty",
    },
    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);

export default Room;
