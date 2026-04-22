import mongoose from "mongoose";

const electricWaterSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    month: {
      type: String, // "2026-01"
      required: true,
    },
    oldElectricNumber: {
      type: Number,
      required: true,
    },
    newElectricNumber: {
      type: Number,
      required: true,
    },
    oldWaterNumber: {
      type: Number,
      required: true,
    },
    newWaterNumber: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// 1 phòng chỉ có 1 bản ghi mỗi tháng
electricWaterSchema.index({ room: 1, month: 1 }, { unique: true });

const ElectricWater =
  mongoose.models.ElectricWater || mongoose.model("ElectricWater", electricWaterSchema);

export default ElectricWater;
