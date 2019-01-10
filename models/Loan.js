const { Schema, model } = require('mongoose');

const { ObjectId } = Schema;

const LoanSchema = new Schema({
  loanId: ObjectId,
  memberID: String,
  surname: String,
  otherNames: String,
  email: String,
  amount: String,
  phone: String,
  loanType: String,
  guarantor1: String,
  guarantor2: String,
  approval: { type: Boolean, default: false },
});

module.exports.Loan = model('Loan', LoanSchema);
