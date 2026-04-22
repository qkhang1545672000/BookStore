import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    sex: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    password: {
      type: String,
      required: true,
      select: false, // không trả về khi query
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    cccd: {
      type: String,
      required: true,
      select: false,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Tenant = mongoose.models.Tenant || mongoose.model("Tenant", tenantSchema);

export default Tenant;
