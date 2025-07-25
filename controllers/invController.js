const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  let className = "Vehicles"; 
  if (data && data.length > 0) {
      className = data[0].classification_name;
  }

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 * Build inventory by inventory ID view (vehicle detail view)
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryById(inv_id);
  let nav = await utilities.getNav();

  if (!data || data.length < 1) {
    return next({
      status: 404,
      message: "Sorry, we could not find that vehicle.",
    });
  }

  // Build the HTML for the vehicle details
  const vehicleDetails = await utilities.buildVehicleDetail(data[0]);

  // Set the title using the vehicle make and model
  const title = `${data[0].inv_make} ${data[0].inv_model}`;

  res.render("./inventory/detail", {
    title: title,
    nav,
    vehicleDetails,
  });
};

/* ****************************************
 * Deliver management view
 * *************************************** */
invCont.buildManagement = async function (req, res, next) { 
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  });
};

/* ****************************************
 * Deliver Add Classification view
 * *************************************** */
invCont.buildAddClassification = async function (req, res, next) { 
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    classification_name: "",
  });
};

/* ****************************************
 * Process new classification addition
 * *************************************** */
invCont.registerClassification = async function (req, res) { 
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const regResult = await invModel.addClassification(classification_name);

  if (regResult.classification_id) {
    req.flash("notice", `The ${classification_name} classification was successfully added.`);
    nav = await utilities.getNav(); 
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the addition failed.");
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name,
    });
  }
};

/* ****************************************
 * Deliver Add Inventory view
 * *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add New Inventory Item",
    nav,
    classificationList,
    errors: null,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
  });
};

/* ****************************************
 * Process new inventory addition
 * *************************************** */
invCont.registerInventory = async function (req, res) { 
  let nav = await utilities.getNav();
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const invResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (invResult) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully added to inventory.`);
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, adding the new inventory item failed.");
    let classificationList = await utilities.buildClassificationList(Number(classification_id));
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      classificationList,
      errors: null,
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
  }
};

module.exports = invCont;