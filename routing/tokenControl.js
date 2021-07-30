const jwt = require('jsonwebtoken');
const api_token_key = "api_token_key";

const isToken = async (req, res, next) => {
  if (!req.url.toLowerCase().includes("phoneScripts".toLowerCase())) {
    return next();
  }

  const token = req.headers.authorization;
  let tokenGecerliMi;
  await tokenControl(token).then(result => tokenGecerliMi = result);

  if (tokenGecerliMi) {
    next();
  } else {
    res.status(401).json({message: "Geçersiz Token"})
  }

};

function tokenControl(token) {
  return new Promise((result) => {
    jwt.verify(token, api_token_key, error => {
      if (error) {
        result(false);
      } else {
        result(true);
      }
    })
  });
}

module.exports = isToken;