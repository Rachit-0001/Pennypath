const { validationResult } = require('express-validator');

/**
 * Runs after express-validator chains on a route. If any validation
 * failed, responds with 400 and a list of field-level error messages.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = validate;
