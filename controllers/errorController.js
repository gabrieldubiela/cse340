// A  controller to demonstrate  500 error

const errorCont = {};

/* ***************************
 * Trigger a 500 server error
 * ************************** */
errorCont.triggerError = async function (req, res, next) {
  // This line intentionally throws an error to demonstrate the 500 error handling
throw new Error("Oh no! There was a server crash. This is an intentional 500 error for testing purposes.");
};

module.exports = errorCont;