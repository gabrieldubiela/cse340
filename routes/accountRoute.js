const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

// Route to "My Account"
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to Register Page
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Route to submit registration form
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
