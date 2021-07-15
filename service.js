const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');

app.use(cors({origin: '*'}));

test();

async function test() {

    app.get("/*", (request, response) => {
        fs.readFile(`extensionScripts${request.url}`, (error, data) => {
            if (error) {
                console.error(error);
                return;
            }
            response.send(`${data}`);
        });
    });

    app.post("/", async (req, res) => {
        const userdata = JSON.parse(await kullaniciBilgisiniGetir(req));
        if (kullaniciBilgileriDogruMu(userdata.email, userdata.pass)) {
            console.log(`${userdata.email} giriş yapıtı.`) // todo: giriş yapan ve yapmaya çalışılan tüm requestleri logla.
            res.send(userdata.email);
        }
        res.status(201).send('kullanıcı adı veya parola hatalı!');
    });
}

function kullaniciBilgileriDogruMu(useremail, userpass) {

    return new Promise((result, reject) => {
        fs.readFile("users.json", (error, data) => {
            if (error) {
                console.error(error);
                return;
            }
            const kullanicilar = JSON.parse(data.toString()).users;
            const buBilgilereAitKacKullaniciVar = kullanicilar.filter(kullanici => kullanici.email === useremail && kullanici.pass === userpass).length;
            result(); // todo:Burada kaldım.
        });
    });

}

function kullaniciBilgisiniGetir(request) {
    return new Promise((resolve) => {
        request.on('data', chunk => {
            resolve(chunk.toString());
        });
    }).catch(err => console.log(err));
}

app.listen(3000);


