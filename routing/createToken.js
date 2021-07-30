const express = require('express');
const router = express.Router();
const fs = require('fs')
const jwt = require('jsonwebtoken');
const api_token_key = "api_token_key";

router.post("/", async (request, response) => {
  const user = request.body

  if (!user.email || !user.pass) {
    response.status(400).json({message: "kullanıcı adı veya parola boş bırakılamaz."});
    return;
  }
  if (await kullaniciVarMi(user)) {
    const token = jwt.sign({}, api_token_key, {expiresIn: "30s"});
    response.send({token})
  } else {
    response.status(401).json({message: "kullanici adi veya parola hatali"});
  }
});

function kullaniciVarMi(user) {
  return new Promise((result) => {
    fs.readFile("users.json", (error, data) => {
      if (error) {
        console.error(error);
        return;
      }
      const kullanicilar = JSON.parse(data.toString());
      const kullaniciMevcutMu = kullanicilar.find(kullanici => (kullanici.email === user.email && kullanici.pass === user.pass)) !== undefined;
      result(kullaniciMevcutMu);
    });
  });

}

module.exports = router;