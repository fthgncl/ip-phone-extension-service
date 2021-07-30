const express = require('express');
const router = express.Router();
const fs = require('fs');

router.post("/*", async (req, res) => {
  const telefon = req.body
  if (!telefon) {
    res.status(400).send("Request telefon bilgilerini içermiyor.")
    return;
  }
  const file = `phoneScripts/${telefon.marka}-${telefon.model}.js`;
  fs.readFile(file, (error, data) => {
    if (error) {
      res.status(404).send(`console.error("${file} dosyası bulunamadi");`);
      console.error(`(Dosya Okunamadı) ${error}`);
      return;
    }
    res.send(data.toString());
  });
});

module.exports = router;


