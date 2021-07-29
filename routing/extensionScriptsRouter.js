const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get("/*", (request, response) => {

  const file = `extensionScripts${request.url}`;
  fs.readFile(file, (error, data) => {
    if (error) {
      response.send(`console.error("${file} dosyası bulunamadi");`);
      console.error(`(Dosya Okunamadı) ${error}`);
      return;
    }
    response.send(data.toString());
  });
});

module.exports = router;


