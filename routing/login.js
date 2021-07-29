const jwt = require('jsonwebtoken');
const api_token_key = "api_token_key";

const isLogin = async (req, res, next) => {

  let token, tokenGecerliMi;
  await getData(req).then(result => token = result.token);
  await tokenControl(token).then(result => tokenGecerliMi = result);

  if (tokenGecerliMi) {
    next();
  } else {
    res.status(401).end("Geçersiz Token")
  }

};

function getData(request) {
  return new Promise((resolve) => {
    request.on('data', chunk => {
      if (chunk) {
        resolve(JSON.parse(chunk.toString()));
      } else {
        resolve(false);
      }
    });
  }).catch(error => console.error(error));
}

function tokenControl(token) {
  return new Promise((result, reject) => {
    jwt.verify(token, api_token_key, (error, decoded) => {
      if (error) {
        result(false);
      } else {
        result(true);
      }
    })
  });
}

module.exports = isLogin;