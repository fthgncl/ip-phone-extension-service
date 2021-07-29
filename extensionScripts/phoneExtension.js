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
    telefonScriptiniCalistir(telefon);
  }
}());

function telefonScriptiniCalistir(telefon) {

  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(telefon)
  };
  fetch(`${serviceURL}/phoneScripts`, requestOptions)
    .then(result => result.text())
    .then(script => sayfayaDinamikScriptEkle(script))

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
  telefon.marka = "yealink"; //todo:burası kaldırılacak.
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

function delete_cookie(kayityeri) {
  document.cookie = kayityeri + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function setToken(token) {
  save_cookie("token", token);
}

function getToken() {
  return read_cookie("token");
}

function deleteToken() {
  delete_cookie("token");
}

function sayfayaDinamikScriptEkle(script) {
  const head = document.getElementsByTagName("head")[0];
  if (head) {
    let element = document.createElement("script");
    element.innerHTML = script;
    head.appendChild(element);
  }
}

























