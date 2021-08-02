const express = require('express');
const router = express.Router();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const api_token_key = "api_token_key";

router.post("/*", async (req, res) => {
  const telefon = req.body
  
  if (!telefon) {
    res.status(400).send("Request telefon bilgilerini içermiyor.")
    return;
  }

  const token = req.headers.authorization;
  let firmaAdi;
  await tokenDataGetir(token)
    .then(result => firmaAdi = result.firma)

  const file = `phoneScripts/${firmaAdi}/${telefon.marka}-${telefon.model}.js`;
  fs.readFile(file, (error, data) => {
    if (error) {
      res.status(404).send(`console.error("${file} dosyası bulunamadi");`);
      console.error(`(Dosya Okunamadı) ${error}`);
      return;
    }
    res.send(data.toString());
  });
});

function tokenDataGetir(token) {
  return new Promise((result, reject) => {
    jwt.verify(token, api_token_key, (error, decoded) => {
      if (error) {
        console.log("Beklenmeyen bir hatayla karşılaşıldı.");
        reject(error)
      } else {
        result(decoded);
      }
    })
  });
}

module.exports = router;


