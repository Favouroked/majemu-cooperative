const { Schema, model } = require('mongoose');

const MemberSchema = new Schema({
  memberID: String,
  password: String,
  surname: String,
  otherNames: String,
  email: String,
  phone: String,
  dob: String,
  role: String,
  accountNo: String,
  bankName: String,
  state: String,
  homeTown: String,
  contactAddress: String,
  contributionAmount: String,
  startDate: String,
  workplace: String,
  position: String,
  nok: String,
  nokAddress: String,
  nokPhone: String,
});

module.exports.Member = model('Member', MemberSchema);
