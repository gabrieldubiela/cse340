const express = require("express");
const router = new express.Router();
const contactController = require("../controllers/contactController");
const utilities = require("../utilities/");

// Route to build the contact page
router.get(
  "/",
  utilities.checkJWTToken,
  utilities.handleErrors(contactController.buildContact)
);

// Route to process the contact form submission
router.post(
  "/",
  contactController.contactValidationRules(), // Apply validation rules
  utilities.handleErrors(contactController.sendContactMessage)
);

// Route to toggle the read status of a contact message (Admin/Employee only)
router.post(
  "/toggle-read",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(contactController.toggleReadStatus)
);

module.exports = router;
