// Sistem kurulum aşamasındaysa bu script çalışır

(function () {
  let telefon = kayitliTelefonuBul();

  if (telefon === undefined) {
    telefon = sayfaninHangiTelefonaAitOldBul();
    if (telefon === undefined) {
      alert("Telefon arayüz giriş sayfası tesbit edilemedi.");
      return;
    }
  }
  telefonScriptiniCalistir(telefon);
}());

function telefonScriptiniCalistir(telefon) {
  return new Promise((result) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': getToken(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(telefon)
    };

    fetch(`${serviceURL}/phoneScripts`, requestOptions)
      .then(response => {
        if (response.status === 401) {
          result(false);
          throw Error("Geçersiz Token");
        }
        return response.text();
      })
      .then(script => {
        result(true)
        sayfayaDinamikScriptEkle(script);
      })
      .catch(async error => {
        result(false);
        console.error(error);
        await kullaniciGirisFormuOlustur();
        //await tokenAl(); todo : aç
        //todo: token aldıktan sonra pencere ile tik işareti koy. Basınca uygulama çalışsın.
      });
  });
}

function kullaniciGirisFormuOlustur() {
  girisFormuClassiniSayfayaEkle();
  girisFormuElementiniOlustur();
}

function girisButonunaBasildi() {
  alert("xxxx");

}

function girisFormuElementiniOlustur() {
  fetch(`${serviceURL}/loginForm`)
    .then(response => response.json())
    .then(data => {
      const body = document.getElementsByTagName("body")[0];
      if (body) {
        let element = document.createElement("div");
        element.innerHTML = data.html;
        body.appendChild(element);

        element.getElementById('id01').style.display = 'block'
      }
    })
}

function girisFormuClassiniSayfayaEkle() {
  fetch(`${serviceURL}/loginForm`)
    .then(response => response.json())
    .then(data => {
      sayfayaCssEkle(data.style);
    })
}

function tokenAl() {
  let email = prompt('Kullanıcı Adı');
  let pass = prompt('Parola');
  const raw = JSON.stringify({
    email,
    pass
  });

  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: raw
  };
  fetch(`${serviceURL}/createToken`, requestOptions)
    .then(response => response.json())
    .then(result => setToken(result.token))
    .catch(error => console.error(`Token alırken hata : ${error}`))


}

function setToken(token) {
  save_cookie("token", token);
}

function getToken() {
  return read_cookie("token");
}

//*************************************

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
    return undefined;
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

function kayitliTelefonuBul() {

  const kayitlitelefon = read_cookie("kayitli_telefon");
  if (kayitlitelefon)
    return JSON.parse(kayitlitelefon)

  return undefined;
}

function sayfayaDinamikScriptEkle(script) {
  const head = document.getElementsByTagName("head")[0];
  if (head) {
    let element = document.createElement("script");
    element.innerHTML = script;
    head.appendChild(element);
  }
}

function sayfayaCssEkle(css) {
  const head = document.getElementsByTagName("head")[0];
  if (head) {
    let element = document.createElement("style");
    element.innerHTML = css;
    element.type = "text/css";
    head.appendChild(element);
  }
}



