const express = require('express');
const _ = require('lodash');

const router = express.Router();
const auth = require('../middlewares/auth');
const { Contribution } = require('../models/Contribution');

const fieldsList = [
  'memberID',
  'surname',
  'otherNames',
  'email',
  'phone',
  'amountPaid',
  'savingsType',
  'paymentDate',
  'narration',
];

router.post('/add', auth, (req, res) => {
  const contributionData = _.pick(req.body, fieldsList);
  const contribution = new Contribution(contributionData);
  contribution.save((err) => {
    if (err) {
      res.json({ status: 500, message: 'An error occured while saving' });
    } else {
      res.json({ status: 201, data: contribution });
    }
  });
});

router.get('/list', auth, (req, res) => {
  Contribution.find({}, (err, contributions) => {
    if (err) {
      res.json({ status: 500, message: 'An error occured' });
    } else {
      const ret = contributions.map(obj => _.omit(obj.toObject(), ['_id', '__v']));
      res.json({ status: 200, data: ret });
    }
  });
});

router.get('/mine', auth, (req, res) => {
  const { id } = req.user;
  Contribution.find({ memberID: id }, (err, contributions) => {
    if (err) {
      res.json({ status: 500, message: 'An error occured' });
    } else {
      const ret = contributions.map(obj => _.omit(obj.toObject(), ['_id', '__v']));
      res.json({ status: 200, data: ret });
    }
  });
});

module.exports = router;
