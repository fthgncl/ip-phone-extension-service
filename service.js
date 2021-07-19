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
        const kullanici = JSON.parse(await uzantidanGonderilenKullaniciBilgileriniCek(req));

        let kullaniciMevcutMu;
        await kayitliKullaniciyiCek(kullanici.email, kullanici.pass)
            .then(kullaniciVarligi => kullaniciMevcutMu = kullaniciVarligi);

        const phone = telefon = JSON.parse(kullanici.phone);

        if (kullaniciMevcutMu) {
            logKaydiEkle(`${kullanici.email} giriş yaptı. Telefon bilgileri | Telefon : ${phone.marka} , ${phone.model}`);
            let phoneScriptData = await telefonScriptDosyasiniCek(phone);
            return res.send(phoneScriptData);
        }
        logKaydiEkle(`${kullanici.email} hatalı giriş denemesi.`);
        res.status(401).send('kullanıcı adı veya parola hatalı!');
    });
}
function logKaydiEkle(bilgi){
    fs.appendFile("logs.txt",`\n${Date()} | ${bilgi}`,err=>{
       if (err){
           throw err;
       }
    });


}
function telefonScriptDosyasiniCek(telefon) {

    return new Promise(result => {
        fs.readFile(`extensionScripts/phoneScripts/${telefon.marka}-${telefon.model}.js`, (error, data) => {
            if (error) {
                console.error(error);
            }
            result(data);
        })
    });

}

function kayitliKullaniciyiCek(useremail, userpass) {

    return new Promise((result) => {
        fs.readFile("users.json", (error, data) => {
            if (error) {
                console.error(error);
                return;
            }
            const kullanicilar = JSON.parse(data.toString());
            const kullaniciMevcutMu = kullanicilar.find(kullanici => (kullanici.email === useremail && kullanici.pass === userpass)) !== undefined;
            result(kullaniciMevcutMu);
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



