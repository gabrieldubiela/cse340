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
  "/detail/:inv_Id",
  utilities.handleErrors(invController.buildByInvId)
);

// Route to build inventory management view
router.get("/", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagement));

// Route to deliver the Add Classification view
router.get(
  "/add-classification",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
);

// Route to process the Add Classification form submission
router.post(
  "/add-classification",
  utilities.checkAccountType,
  utilities.classificationRules(),
  utilities.checkClassificationData,
  utilities.handleErrors(invController.registerClassification)
);

// Route to deliver the Add Inventory view
router.get(
  "/add-inventory",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
);

// Route to process the Add Inventory form submission
router.post(
  "/add-inventory",
  utilities.checkAccountType,
  utilities.inventoryRules(),
  utilities.checkInventoryData,
  utilities.handleErrors(invController.registerInventory)
);

// Route to get inventory by classification ID
router.get(
  "/getInventory/:classification_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to build the edit inventory view
router.get(
  "/edit/:inv_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.editInventoryView)
);

// Route to process the edit inventory form submission
router.post(
  "/edit-inventory/", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
);

router.get(
  "/delete/:inv_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventoryView)
);

router.post(
  "/delete/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;
