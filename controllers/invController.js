const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
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
    // If no vehicle data is found, trigger a 404 error
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
    vehicleDetails, // Pass the HTML string to the view
  });
};

module.exports = invCont;
