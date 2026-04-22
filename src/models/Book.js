import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true, trim: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", BookSchema);

export default Book;
