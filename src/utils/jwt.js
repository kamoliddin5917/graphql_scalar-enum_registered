const jwt = require("jsonwebtoken");
module.exports = {
  sign: (data) => jwt.sign(data, "ok"),
  verify: (data) => jwt.verify(data, "ok"),
};
