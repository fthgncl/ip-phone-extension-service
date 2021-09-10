const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const api_token_key = "api_token_key";
const logKaydiEkle = require("../logKaydiModulu");

router.post("/", async (request, response) => {
  const user = request.body

  if (!user.email || !user.pass) {
    response.status(400).json({message: "kullanıcı adı veya parola boş bırakılamaz."});
    return;
  }

  const userAllInfo = kullaniciBilgieriniGetir(user)
  if (userAllInfo) {
    const token = jwt.sign({firma: userAllInfo.firma}, api_token_key, {expiresIn: "30s"});
    logKaydiEkle(`${user.email} kullanıcı adı ile giriş yapıldı.`);
    response.send({token})
  } else {
    logKaydiEkle(`${user.email} kullanıcı adı ile hatalı giriş yapıldı`, "HATALI GİRİŞ");
    response.status(401).json({message: "kullanici adi veya parola hatali"});
  }
});

function kullaniciBilgieriniGetir(user) {
  const users = require("../users.json");
  const userAllInfo = users.find(kullanici => kullanici.email === user.email && kullanici.pass === user.pass);

  if (userAllInfo) {
    return userAllInfo;
  } else {
    return false;
  }

}

module.exports = router;