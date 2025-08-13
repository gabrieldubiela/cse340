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

// Route to Accounts Management Page
router.get(
  "/account-management",
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildAccount)
);

// Rota to logout request
router.get(
  "/logout", 
  utilities.handleErrors(accountController.accountLogout)
);

// Route to Update Account Information Page 
router.get(
  "/update/:account_id",
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildUpdateView)
);

// Route to handle the account information update
router.post(
  "/update/", 
  utilities.checkJWTToken,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Route to handle the password update
router.post(
  "/update-password", 
  utilities.checkJWTToken,
  regValidate.updatePasswordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;
