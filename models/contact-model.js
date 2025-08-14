const pool = require("../database/");

/* *****************************
 * Add new contact message
 * *************************** */
async function addContactMessage(name, email, phone, subject, message) {
  try {
    const sent_at = new Date();
    const is_read = false;
    const sql =
      "INSERT INTO public.inquiry (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    return await pool.query(sql, [name, email, phone, subject, message]);
  } catch (error) {
    console.error("error during addContactMessage.", error.message);
    throw new Error("Could not send message.");
  }
}

/* *****************************
 * Get all contact inquiries
 * *************************** */
async function getContactMessages() {
  try {
    const sql = "SELECT * FROM public.inquiry ORDER BY sent_at DESC";
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    console.error("error during getContactMessages.", error.message);
    throw new Error("Could not get messages.");
  }
}

/* *****************************
 * Toggle read status of a message
 * *************************** */
async function toggleMessageReadStatus(id) {
  try {
    const sql =
      "UPDATE public.inquiry SET is_read = NOT is_read WHERE id = $1 RETURNING *";
    const result = await pool.query(sql, [id]);
    return result.rows[0];
  } catch (error) {
    console.error("error during toggleMessageReadStatus.", error.message);
    throw new Error("Could not update message status.");
  }
}

module.exports = {
  addContactMessage,
  getContactMessages,
  toggleMessageReadStatus,
};
