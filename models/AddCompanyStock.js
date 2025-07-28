const mongoose = require("mongoose");

const addCompanyStockSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    gold_24kt: {
      type: Number,
      required: true,
    },
    conversion_rate: {
      type: Number,
      required: true,
    },
    gold_18kt: {
      type: Number,
      required: true,
    },
    is_cleared: {
      type: Boolean,
      default: false,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AddCompanyStock", addCompanyStockSchema); 