/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const { checkRequestBody } = require('../helpers/Utility');
const { Member } = require('../models/Member');
const { jwtSecret } = require('../config/constants');

const saltRounds = 10;

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

const router = express.Router();

router.post('/register', async (req, res) => {
  const errors = checkRequestBody(req.body, fieldsList);
  if (errors) {
    res.json({ status: 400, message: 'Some required fields are empty' });
  } else {
    const userData = _.pick(req.body, fieldsList);
    const hash = await bcrypt.hash(userData.password, saltRounds);
    userData.password = hash;
    const user = new Member(userData);
    user.save((err) => {
      if (err) {
        res.json({ status: 500, message: 'An error occured while saving' });
      } else {
        const name = user.surname + user.otherNames;
        const token = jwt.sign({ name, id: user.memberID, email: user.email }, jwtSecret);
        res.json({
          status: 201, token, name, role: user.role,
        });
      }
    });
  }
});

router.post('/login', (req, res) => {
  const loginData = _.pick(req.body, ['memberID']);
  Member.findOne(loginData, async (err, user) => {
    if (err) {
      res.status(500).json({ status: 500, message: 'An error occured' });
    } else {
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        const name = `${user.surname} ${user.otherNames}`;
        const token = jwt.sign({ name, id: user.memberID, email: user.email }, jwtSecret);
        res.status(201).json({
          status: 201,
          token,
          name,
          user,
          role: user.role,
        });
      } else {
        res.status(401).json({ status: 401, message: 'Incorrect login credentials' });
      }
    }
  });
});

module.exports = router;
