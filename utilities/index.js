const invModel = require("../models/inventory-model");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the vehicle detail view HTML
 * ************************************ */
Util.buildVehicleDetail = async function (vehicle) {
  let detailHtml = '<div id="vehicle-detail-container">';

  // Vehicle image
  detailHtml += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" class="vehicle-detail-image">`;

  // Vehicle details section
  detailHtml += '<div class="vehicle-details-content">';
  detailHtml += `<h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>`;
  detailHtml += `<p class="detail-price"><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</p>`;
  detailHtml += `<p><strong>Description:</strong> ${vehicle.inv_description}</p>`;
  detailHtml += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`;
  detailHtml += `<p><strong>Miles:</strong> ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)}</p>`;
  detailHtml += `<p><strong>Year:</strong> ${vehicle.inv_year}</p>`;
  detailHtml += "</div>";
  detailHtml += "</div>";

  return detailHtml;
};

/* ***********************************
 * Classification Data Validation
 * ********************************* */
Util.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage(
        "Classification name cannot contain spaces or special characters."
      )
      .custom(async (classification_name) => {
        const classificationExists =
          await invModel.checkExistingClassification(classification_name);
        if (classificationExists) {
          throw new Error(
            "Classification name already exists. Please choose a different name."
          );
        }
      }),
  ];
};

/* **************************************
 * Check data and return errors or continue
 * ************************************* */
Util.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await Util.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      messages: req.flash(),
      classification_name,
    });
    return;
  }
  next();
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ************************
 * Constructs the Classification List HTML
 * For use in forms
 **************************/
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == row.classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ***********************************
 * Inventory Data Validation Rules
 * ********************************* */
Util.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .isInt({ min: 1 })
      .withMessage("Please select a classification."),

    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a vehicle make (minimum 3 characters)."),

    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a vehicle model (minimum 3 characters)."),

    body("inv_year")
      .trim()
      .isInt({ min: 1886, max: new Date().getFullYear() + 1 })
      .withMessage("Please provide a valid year (e.g., 2024)."),

    body("inv_description")
      .trim()
      .isLength({ min: 10 })
      .withMessage(
        "Please provide a vehicle description (minimum 10 characters)."
      ),

    body("inv_image")
      .trim()
      .matches(/^\/images\/vehicles\/.+\.(jpg|jpeg|png|webp)$/)
      .withMessage(
        "Please provide a valid image path (e.g., /images/vehicles/car.jpg)."
      ),

    body("inv_thumbnail")
      .trim()
      .matches(/^\/images\/vehicles\/.+\.(jpg|jpeg|png|webp)$/)
      .withMessage(
        "Please provide a valid thumbnail path (e.g., /images/vehicles/car-tn.jpg)."
      ),

    body("inv_price")
      .trim()
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price (e.g., 25000.00)."),

    body("inv_miles")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Please provide valid mileage."),

    body("inv_color")
      .trim()
      .matches(/^[a-zA-Z]+$/)
      .withMessage("Please provide a valid color (letters only)."),
  ];
};

/* **************************************
 * Check inventory data and return errors or continue
 * ************************************* */
Util.checkInventoryData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await Util.getNav();
    let classificationList = await Util.buildClassificationList(
      Number(classification_id)
    );
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory Item",
      nav,
      messages: req.flash(),
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

/* **************************************
 * Check inventory data and return errors or continue
 * ************************************* */
Util.checkUpdateData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    inv_id,
  } = req.body;

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await Util.getNav();
    let classificationList = await Util.buildClassificationList(
      Number(classification_id)
    );
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit Inventory Item",
      nav,
      messages: req.flash(),
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      inv_id,
    });
    return;
  }
  next();
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

module.exports = Util;
