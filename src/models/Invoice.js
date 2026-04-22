import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    month: {
      type: String, // "2026-01"
      required: true,
    },
    roomPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    electricFee: {
      type: Number,
      required: true,
      min: 0,
    },
    waterFee: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
  },
  {
    timestamps: true,
  },
);

// 1 phòng chỉ có 1 hóa đơn mỗi tháng
invoiceSchema.index({ room: 1, month: 1 }, { unique: true });

// Tự động tính tổng tiền
invoiceSchema.pre("save", function (next) {
  this.total = this.roomPrice + this.electricFee + this.waterFee;
  next();
});

const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);

export default Invoice;
