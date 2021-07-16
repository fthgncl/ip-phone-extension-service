const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');

startService();

async function startService() {

    app.use(cors({origin: '*'}));

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
        const uzantidanGelenKullanici = JSON.parse(await uzantidanGonderilenKullaniciBilgileriniCek(req));
        let kullanici;
        await kayitliKullaniciyiCek(uzantidanGelenKullanici.email, uzantidanGelenKullanici.pass).then(kayitliKullanici => kullanici = kayitliKullanici);

        if (kullanici) {
            console.log(`${kullanici.email} ${kullanici.phone.model} giriş yaptı.`) // todo: giriş yapan ve yapmaya çalışılan tüm requestleri logla.
            return res.send(kullanici);
        }
        console.log("giriş yapamadı.")
        res.status(401).send('kullanıcı adı veya parola hatalı!');
    });
}
function phoneScriptDosyaYolunuGonder(phone){

}
function kayitliKullaniciyiCek(useremail, userpass) {

    return new Promise((result, reject) => {
        fs.readFile("users.json", (error, data) => {
            if (error) {
                console.error(error);
                return;
            }
            const kullanicilar = JSON.parse(data.toString()).users;
            result(kullanicilar.find(kullanici => (kullanici.email === useremail && kullanici.pass === userpass)));
        });
    });

}

function uzantidanGonderilenKullaniciBilgileriniCek(request) {
    return new Promise((resolve) => {
        request.on('data', chunk => {
            resolve(chunk.toString());
        });
    }).catch(err => console.log(err));
}

app.listen(3000);



