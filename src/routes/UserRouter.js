require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../database/connection");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");
const {
  generateVerificationToken,
  nameSplit,
  dateConversion,
} = require("../utils/common-functions");

//User Registration
router.post("/api/user/register", async (req, res) => {
  try {
    let { full_name, email_address, password } = req.body;

    if (!isEmail(email_address)) {
      return res.status(400).json({ error: "Invalid email address." });
    }

    delete req.body.full_name;
    const verificationToken = generateVerificationToken();

    const name = nameSplit(full_name);
    const formattedDate = dateConversion();

    const additionalFields = {
      agree_terms_privacy: "yes",
      verification_code: verificationToken,
      verified: "yes",
      first_name: name.first_name,
      middle_name: name.middle_name,
      last_name: name.last_name,
      login_password: password,
      reg_date: formattedDate,
      msg_flag: 0,
      reg_acc_status: "activated",
      package_id: 1,
      package_start: formattedDate,
      package_expiry: "free_forever",
    };

    const requestBodyWithAdditionalFields = {
      ...req.body,
      ...additionalFields,
    };

    if (requestBodyWithAdditionalFields.password) {
      const hashedPassword = await bcrypt.hash(
        requestBodyWithAdditionalFields.password,
        10
      );
      requestBodyWithAdditionalFields.password = hashedPassword;
    }

    const paramNamesString = Object.keys(requestBodyWithAdditionalFields).join(
      ", "
    );
    const paramValuesString = Object.values(requestBodyWithAdditionalFields)
      .map((value) => `'${value}'`)
      .join(", ");

    const callProcedureSQL = `CALL InsertRegistration(?, ?)`;
    await pool.execute(callProcedureSQL, [paramNamesString, paramValuesString]);
    res.status(201).json({
      message: "Registration successful.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

//User Login
router.post("/api/user/login", async (req, res) => {
  const { email_address, password } = req.body;

  try {
    const [rows] = await pool.execute("CALL selectLogin(?)", [email_address]);
    if (rows[0][0]?.email_address !== email_address) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const passwordMatch = await bcrypt.compare(password, rows[0][0]?.password);
    if (passwordMatch) {
      await pool.execute("CALL checkLogin(?,?)", [
        email_address,
        passwordMatch,
      ]);

      res.status(201).json({ message: "Login successful." });
    } else {
      res.status(401).json({ error: "Invalid credentials." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error." });
  }
});


//get motivator
router.get("/api/user/get-motivator", async (req, res) => {
  try {
    const [rows, fields] = await pool.execute("CALL Motivator()");
    res.status(200).json(rows[0][0]);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
