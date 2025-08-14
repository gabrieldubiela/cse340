const { body, validationResult } = require("express-validator");
const validate = {};

/* **********************************
 * Contact Data Validation Rules
 * ********************************* */
validate.contactRules = () => {
  return [
    // name is required
    body("name").trim().escape().notEmpty().withMessage("Name is required."),

    // valid email is required
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    // phone is optional and must be a valid phone number
    body("phone")
      .trim()
      .escape()
      .optional({ nullable: true, checkFalsy: true })
      .isMobilePhone()
      .withMessage("The phone number must be a valid mobile phone number."),

    // message is required
    body("message")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A message is required."),
  ];
};

module.exports = validate;
