var express = require("express");
var router = express.Router();
const MySql = require("../routes/utils/MySql");
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcrypt");

router.post("/Register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    let user_details = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      country: req.body.country,
      password: req.body.password,
      email: req.body.email,
    }
    let users = [];
    users = await DButils.execQuery("SELECT userName from danamaordb.users");

    if (users.find((x) => x.userName === user_details.username))
      throw { status: 409, message: "Username taken" };

    // add the new username
    let hash_password = bcrypt.hashSync(
      user_details.password,
      parseInt(process.env.bcrypt_saltRounds || 13)
    );
    await DButils.execQuery(
      `INSERT INTO users VALUES ('${user_details.username}', '${hash_password}', '${user_details.firstname}', '${user_details.lastname}',
      '${user_details.email}', '${user_details.country}')`
    );
    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Login", async (req, res, next) => {
  try {
    // check that username exists
    const users = await DButils.execQuery("SELECT userName FROM danamaordb.users");
    if (!users.find((x) => x.userName === req.body.username))
      throw { status: 401, message: "Username or Password incorrect" };

    // check that the password is correct
    const user = (
      await DButils.execQuery(
        `SELECT * FROM danamaordb.users WHERE username = '${req.body.username}'`
      )
    )[0];
    const result = await bcrypt.compare(req.body.password, user.UserPassword);
    if (!result) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.userName = user.userName;


    // return cookie
    res.status(200).send({ message: "login succeeded", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});

module.exports = router;