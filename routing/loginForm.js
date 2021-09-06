const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get("/", async (request, response) => {

  const styleFile = "loginForm/style.css";
  const formFile = "loginForm/form.html";
  let fileData = {style: "", html: ""};

  await (fs.readFile(styleFile, (error, data) => {
    if (error) {
      response.status(404).send(`console.error("${styleFile} dosyası bulunamadi");`);
      console.error(`(Dosya Okunamadı) ${error}`);
      return;
    }
    fileData.style = data.toString();
  }))

  await fs.readFile(formFile, (error, data) => {
    if (error) {
      response.status(404).send(`console.error("${formFile} dosyası bulunamadi");`);
      console.error(`(Dosya Okunamadı) ${error}`);
      return;
    }
    fileData.html = data.toString();
    response.send(fileData); //todo : burayı readFile dışına al.
  });

});


module.exports = router;


