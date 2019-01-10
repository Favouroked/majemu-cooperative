const _ = require('lodash');

module.exports.checkRequestBody = (params, requiredFields) => {
  const errors = {};
  for (let i = 0; i < requiredFields.length; i += 1) {
    if (!Object.hasOwnProperty.call(params, requiredFields[i])) {
      errors[requiredFields[i]] = 'is required';
    }
  }
  if (_.isEmpty(errors)) {
    return null;
  }

  return errors;
};
