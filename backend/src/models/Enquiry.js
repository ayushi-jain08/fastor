const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    courseInterest: { type: String, required: true, trim: true },
    message: { type: String, trim: true },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    claimedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

enquirySchema.index({ claimedBy: 1, createdAt: -1 });
enquirySchema.index({ claimedBy: 1, claimedAt: -1 });

module.exports = mongoose.model('Enquiry', enquirySchema);
