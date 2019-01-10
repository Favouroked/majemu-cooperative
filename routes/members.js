const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const router = express.Router();
const auth = require('../middlewares/auth');
const { Member } = require('../models/Member');

const fieldsList = [
  'memberID',
  'password',
  'surname',
  'otherNames',
  'email',
  'phone',
  'dob',
  'role',
  'accountNo',
  'bankName',
  'state',
  'homeTown',
  'contactAddress',
  'contributionAmount',
  'startDate',
  'workplace',
  'position',
  'nok',
  'nokAddress',
  'nokPhone',
];

const saltRounds = 10;

router.post('/add', auth, async (req, res) => {
  const memberData = _.pick(req.body, fieldsList);
  const hash = await bcrypt.hash(memberData.password, saltRounds);
  memberData.password = hash;
  const member = new Member(memberData);
  member.save((err) => {
    if (err) {
      res.json({ status: 500, message: 'An error occured while saving' });
    } else {
      res.json({ status: 201, data: member });
    }
  });
});

router.get('/view', auth, (req, res) => {
  Member.find({}, (err, members) => {
    if (err) {
      res.json({ status: 500, message: 'An error occured' });
    } else {
      const ret = members.map(obj => _.omit(obj.toObject(), ['_id', '__v', 'password']));
      res.json({ status: 200, data: ret });
    }
  });
});

router.get('/guarantors', auth, async (req, res) => {
  const members = await Member.find({}).exec();
  const mappedMembers = members.map(obj => ({
    name: `${obj.surname} ${obj.otherNames}`,
    value: obj.email,
  }));
  res.status(200).json({ status: 200, data: mappedMembers });
});

module.exports = router;
