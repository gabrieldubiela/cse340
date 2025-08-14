const contactModel = require("../models/contact-model");
const utilities = require("../utilities/");
const { body, validationResult } = require("express-validator");

/* ****************************************
 * Deliver contact view
 * *************************************** */
async function buildContact(req, res, next) {
  let nav = await utilities.getNav();
  let title = "Contact Us";
  let contactMessages = [];

  // Check if the user is an Admin or Employee
  if (
    res.locals.loggedin &&
    (res.locals.accountData.account_type === "Admin" ||
      res.locals.accountData.account_type === "Employee")
  ) {
    // Fetch messages for the inbox
    try {
       contactMessages = await contactModel.getContactMessages();
      title = "Contact Message Inbox";
    } catch (error) {
      req.flash("notice", "Sorry, an error occurred while fetching messages.");
      contactMessages = [];
    }
  }

  res.render("contact/contact", {
    title: title,
    nav,
    errors: null,
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    sent_at: "",
    is_read: "",
    contactMessages
  });
}

/* ****************************************
 * Process contact form submission
 * *************************************** */
async function sendContactMessage(req, res) {
  let nav = await utilities.getNav();
  let { name, email, phone, subject, message } = req.body;

  // Run validation checks
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const title = "Contact Us";
    req.flash("error", errors.array().map(e => e.msg).join(' '));
    return res.render("contact/contact", {
    title: title,
    nav,
    errors: null,
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    sent_at: "",
    is_read: "",
    contactMessages: []
    });
  }

  const finalPhone = phone === "" ? null : phone;

  try {
    await contactModel.addContactMessage(name, email, phone, subject, message);
    req.flash(
      "notice",
      "Thank you for your message! We will get back to you shortly."
    );
    res.redirect("/contact");
  } catch (error) {
    console.error("Error in sendContactMessage:", error);
    req.flash(
      "error",
      "Sorry, there was an error sending your message. Please try again."
    );
    res.redirect("/contact");
  }
}

/* ****************************************
 * Validation Rules for Contact Form
 * *************************************** */
const contactValidationRules = () => {
  return [
    body("name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please enter your name."),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address."),

    body("phone")
      .optional({ checkFalsy: true })
      .matches(/^\d{10,15}$/) // Ensures 10-15 digits only
      .withMessage("Please enter a valid phone number (10-15 digits only)."),

    body("subject")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Please enter a subject with at least 5 characters."),

    body("message")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Please enter a message with at least 10 characters."),
  ];
};

/* ****************************************
 * Toggle read status of a message
 * *************************************** */
async function toggleReadStatus(req, res) {
  const { id } = req.body;
  try {
    const result = await contactModel.toggleMessageReadStatus(id);
    if (result) {
      res.json({ success: true, is_read: result.is_read });
    } else {
      res.status(404).json({ success: false, message: "Message not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating message status." });
  }
}

module.exports = {
  buildContact,
  sendContactMessage,
  contactValidationRules,
  toggleReadStatus,
};
