const mongoose = require("mongoose");
const companySchema = new mongoose.Schema(
  {
    company_name: {
      type: String,
      required: true,
    },
    company_address: {
      type: String,
      required: true,
    },
    company_phone: {
      type: String,
      required: true,
    },
    gst_number: {
      type: String,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema); 