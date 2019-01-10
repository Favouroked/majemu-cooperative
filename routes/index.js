const express = require('express');

const { Contribution } = require('../models/Contribution');
const { Loan } = require('../models/Loan');
const { Member } = require('../models/Member');

const auth = require('../middlewares/auth');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard', auth, async (req, res) => {
  const contributions = await Contribution.find({}).exec();
  const loans = await Loan.find({}).exec();
  const members = await Member.find({}).exec();
  const myContributions = await Contribution.find({ memberID: req.user.id }).exec();
  const myLoans = await Loan.find({ memberID: req.user.id }).exec();
  res.status(200).json({
    status: 200,
    data: {
      contributions: contributions.length,
      loans: loans.length,
      members: members.length,
      myContributions: myContributions.length,
      myLoans: myLoans.length,
    },
  });
});

module.exports = router;
