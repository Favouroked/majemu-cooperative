const { Schema, model } = require('mongoose');

const ContributionSchema = new Schema({
  memberID: String,
  surname: String,
  otherNames: String,
  email: String,
  phone: String,
  amountPaid: String,
  paymentDate: String,
  narration: String,
});

module.exports.Contribution = model('Contribution', ContributionSchema);
