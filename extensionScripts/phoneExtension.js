
(function () {
    let telefon = kayitliTelefonuBul();
    if (telefon === undefined) {
        try {
            telefon = sayfaninHangiTelefonaAitOldBul();
        } catch (e) {
            alert(`• ${e.message}`);
        }
    }

    kullaniciGirisIslemleri(telefon);

}());

function kullaniciGirisIslemleri(telefon){

    let email = prompt('Kullanıcı Adı');
    let pass = prompt('Parola');

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "email": email,
        "pass": pass
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw
    };
    fetch(serverURL, requestOptions)
        .then(response => {
            if ( response.status === 201 ){
                alert(response.body);
            }
            else if ( response.status !== 200 ){
                alert("Giriş Başarısız.");
            }
            return response.json();
        })
        .then(result => {
            //telefonModelineGoreUzakScriptiEkle(telefon);
        })
        .catch(error => console.log('error', error));

}


function kayitliTelefonuBul() {
    const kayitlitelefon = read_cookie("kayitli_telefon");
    if ( kayitlitelefon )
        return JSON.parse(kayitlitelefon)

    return undefined;
}
function sayfaninHangiTelefonaAitOldBul() {

    let telefon = {};

    if (document.getElementById("idUsername") !== null && document.title === "Yealink T30 Phone") {      //### SIP-T30 Modeli Algılama
        telefon.marka = "yealink";
        telefon.model = "sip-t30";
    }


    const markaTanimliMi = !telefon.marka;
    const modelTanimliMi = !telefon.model;

    if (markaTanimliMi || modelTanimliMi) {
        throw new Error("Telefon arayüz giriş sayfası tesbit edilemedi.");
    } else {
        save_cookie("kayitli_telefon", JSON.stringify(telefon));
        return telefon;
    }
}
function telefonModelineGoreUzakScriptiEkle(telefon) {
    sayfayaScriptEkle(`${serverURL}/${telefon.marka}-${telefon.model}.js`);
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






























