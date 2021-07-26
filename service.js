const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const jwt = require('jsonwebtoken');

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

    app.post("/login", async (req, res) => {
        const kullanici = await uzantidanGonderilenKullaniciBilgileriniCek(req);
        request.on('data', chunk => JSON.parse(chunk.toString()) )


        let kullaniciMevcutMu;
        await kayitliKullaniciyiCek(kullanici.email, kullanici.pass)
            .then(kullaniciVarligi => kullaniciMevcutMu = kullaniciVarligi);

        const phone = telefon = JSON.parse(kullanici.phone);

        if (kullaniciMevcutMu) {
            token = await tokenUret(kullanici);
            logKaydiEkle(`${kullanici.email} kullanıcı adı ile giriş yaptıldı. Tesbit edilen telefon ${phone.marka} ${phone.model}`);
            let phoneScriptData = await telefonScriptDosyasiniCek(phone);
            return res.send({token,script:phoneScriptData});
        }
        logKaydiEkle(`${kullanici.email} kullanıcı adı ile giriş yapılmaya çalışıldı.`, "HATALI GİRİŞ");
        res.status(401).send('kullanıcı adı veya parola hatalı!');
    });
}
function tokenUret(user,gecerlilikSuresi = "300s"){
    return jwt.sign(user, 'api_token_key', { expiresIn: gecerlilikSuresi });
}

function logKaydiEkle(bilgi, logBasligi = '') {
    let tarih = new Date();
    (logBasligi !== '' ) && (logBasligi = `[${logBasligi}]`);
    let tarihYazisi = `[Tarih : ${tarih.getDate()}/${tarih.getMonth() + 1}/${tarih.getFullYear()} - ${tarih.getHours()}:${tarih.getMinutes()}]`
    fs.appendFile("logs.txt", `\n${tarihYazisi} ${logBasligi}\n${bilgi}\n`, err => {
        if (err) {
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
            const user = JSON.parse(chunk.toString());

            resolve(user);
        });
    }).catch(err => console.log(err));
}

app.listen(3000);



