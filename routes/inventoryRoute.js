const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build inventory by inventory item view
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInvId)
);

// Route to build inventory management view
router.get(
  "/management",
  utilities.handleErrors(invController.buildManagement)
);

// Route to deliver the Add Classification view
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);

// Route to process the Add Classification form submission
router.post(
  "/add-classification",
  utilities.classificationRules(),
  utilities.checkClassificationData,
  utilities.handleErrors(invController.registerClassification)
);

// Route to deliver the Add Inventory view
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);

// Route to process the Add Inventory form submission
router.post(
  "/add-inventory",
  utilities.inventoryRules(),
  utilities.checkInventoryData,
  utilities.handleErrors(invController.registerInventory)
);

module.exports = router;
