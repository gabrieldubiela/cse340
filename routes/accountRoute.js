const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

// Route to Login Page
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to Register Page
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Process the registration request
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route to Accounts Page
router.get("/accountmanagement", utilities.handleErrors(accountController.buildAccounts));

module.exports = router;
