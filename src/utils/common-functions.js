require("dotenv").config();
const crypto = require("crypto");

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const nameSplit = (name) => {
  const nameParts = name.split(" ");
  let first_name = "";
  let middle_name = "";
  let last_name = "";

  if (nameParts.length === 1) {
    first_name = nameParts[0];
  } else if (nameParts.length === 2) {
    first_name = nameParts[0];
    last_name = nameParts[1];
  } else if (nameParts.length >= 3) {
    first_name = nameParts[0];
    middle_name = nameParts.slice(1, -1).join(" ");
    last_name = nameParts[nameParts.length - 1];
  }

  return { first_name, middle_name, last_name };
};

const dateConversion = () => {
  const currentDate = new Date();
  const formattedDate = currentDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  return formattedDate;
};

module.exports = {
  generateVerificationToken,
  nameSplit,
  dateConversion,
};
