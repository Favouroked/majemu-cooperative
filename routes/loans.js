/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const express = require('express');
const _ = require('lodash');
const request = require('request');

const router = express.Router();
const auth = require('../middlewares/auth');
const { Loan } = require('../models/Loan');

const fieldsList = [
  'memberID',
  'surname',
  'otherNames',
  'email',
  'phone',
  'amount',
  'salary',
  'dueDate',
  'startDate',
  'loansPerMonth',
  'months',
  'loanType',
  'guarantor1',
  'guarantor2',
];

const sendEmail = (email, loanId, name) => {
  const link = `https://localhost:4000/approve/change/${loanId}`;
  const options = {
    url: 'https://g0jgcajumi.execute-api.us-east-2.amazonaws.com/staging/',
    headers: {
      'Content-Type': 'application/json',
    },
    form: {
      field: 'generic',
      email,
      subject: 'Guarantor Verification',
      body: `Member ${name} has requested for you to be his loan guarantor. Click <a href="${link}">here</a> to accept, otherwise ignore`,
    },
  };

  request.post(options, (err) => {
    if (err) console.log(err);
  });
};

router.post('/request', auth, (req, res) => {
  const loanData = _.pick(req.body, fieldsList);
  const loan = new Loan(loanData);
  loan.loanId = loan._id;
  loan.save((err) => {
    if (err) {
      res.json({ status: 500, message: 'An error occured while saving' });
    } else {
      sendEmail(loanData.guarantor1, loan.loanId, req.user.name);
      res.json({ status: 201, data: loan });
    }
  });
});

router.get('/schedule', auth, (req, res) => {
  Loan.findOne({ memberID: req.user.id }, (err, loan) => {
    if (err) {
      res.json({ status: 500, message: 'An error occured' });
    } else {
      const ret =  _.omit(loan.toObject(), ['_id', '__v', 'userId']);
      res.json({ status: 200, data: ret });
    }
  });
});

router.get('/requested', auth, (req, res) => {
  Loan.find({}, (err, loans) => {
    if (err) {
      res.json({ status: 500, message: 'An error occured' });
    } else {
      const ret = loans.map(obj => _.omit(obj.toObject(), ['_id', '__v', 'userId']));
      res.json({ status: 200, data: ret });
    }
  });
});

router.get('/approved', auth, (req, res) => {
  Loan.find({ approval: true }, (err, loans) => {
    if (err) {
      res.json({ status: 500, message: 'An error occured' });
    } else {
      const ret = loans.map(obj => _.omit(obj.toObject(), ['_id', '__v', 'userId']));
      res.json({ status: 200, data: ret });
    }
  });
});

router.get('/approve/:loanId', auth, (req, res) => {
  const { loanId } = req.params;
  Loan.findByIdAndUpdate(loanId, { approval: true }, { new: true }, (err, loan) => {
    if (err) {
      res.status(500).json({ status: 500, message: 'Internal Error' });
    } else {
      res.status(200).json(loan);
    }
  });
});

router.get('/decline/:loanId', auth, (req, res) => {
  const { loanId } = req.params;
  Loan.findByIdAndUpdate(loanId, { approval: false }, { new: true }, (err, loan) => {
    if (err) {
      res.status(500).json({ status: 500, message: 'Internal Error' });
    } else {
      res.status(200).json(loan);
    }
  });
});

router.get('/declined', auth, (req, res) => {
  Loan.find({ approval: false }, (err, loans) => {
    if (err) {
      res.json({ status: 500, message: 'An error occured' });
    } else {
      const ret = loans.map(obj => _.omit(obj.toObject(), ['_id', '__v', 'userId']));
      res.json({ status: 200, data: ret });
    }
  });
});

module.exports = router;
