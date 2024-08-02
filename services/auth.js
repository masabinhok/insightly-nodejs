const JWT = require("jsonwebtoken");

const secret = "erss2005";

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
    profileImageUrl: user.profileImageUrl,
  };
  const token = JWT.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}



module.exports = {
  createTokenForUser,
  validateToken,
};
