(function () {
    //todo:otomatik kullanıcı girişi ekle.
    let telefon = kayitliTelefonuBul();
    if (telefon === undefined) {
        try {
            telefon = sayfaninHangiTelefonaAitOldBul();
        } catch (e) {
            alert(`• ${e.message}`);
        }
    }
    if (telefon !== undefined) {
        kullaniciGirisIslemleri(telefon);
    }
}());

function kullaniciGirisIslemleri(telefon) {

    let email = prompt('Kullanıcı Adı');
    let pass = prompt('Parola');

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "email": email,
        "pass": pass,
        "phone": JSON.stringify(telefon)
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw
    };
    fetch(serviceURL, requestOptions)
        .then(response => {

            if (response.status === 401) {
                return response.text();

            } else if (response.status !== 200) {
                throw new Error(`Hata (${response.status}) : Giriş Başarısız.`);
            }

            return response.text();
        })
        .then(result => {
            if (result) {
                sayfayaDinamikScriptEkle(result)
            }
        })
        .catch(error => {
            alert(error);
            console.error('error', error)
        });

}

function sayfayaDinamikScriptEkle(script) {
    const head = document.getElementsByTagName("head")[0];
    if (head) {
        let element = document.createElement("script");
        element.innerHTML = script;
        head.appendChild(element);
    }
}

function kayitliTelefonuBul() {
    const kayitlitelefon = read_cookie("kayitli_telefon");
    if (kayitlitelefon)
        return JSON.parse(kayitlitelefon)

    return undefined;
}

function sayfaninHangiTelefonaAitOldBul() {

    let telefon = {};

    if (document.getElementById("idUsername") !== null && document.title === "Yealink T30 Phone") {      //### SIP-T30 Modeli Algılama
        telefon.marka = "yealink";
        telefon.model = "sip-t30";
    }
    telefon.marka = "yealink";
    telefon.model = "sip-t30";
    const markaTanimliMi = !telefon.marka;
    const modelTanimliMi = !telefon.model;

    if (markaTanimliMi || modelTanimliMi) {
        throw new Error("Telefon arayüz giriş sayfası tesbit edilemedi.");
    } else {
        save_cookie("kayitli_telefon", JSON.stringify(telefon));
        return telefon;
    }
}

function read_cookie(kayityeri) {

    let cerez_degeri;
    const cerezler = document.cookie.split("; ");
    for (let i = 0; i < cerezler.length; i++) {
        cerez_degeri = cerezler[i].split("=");
        if (kayityeri === cerez_degeri[0]) {
            return cerez_degeri[1];
        }
    }
}

function save_cookie(kayityeri, veri) {
    document.cookie = (kayityeri + "=" + veri)
}






























