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
        let scriptElement = sayfayaElementEkle("script",pageHead);
        scriptElement.innerHTML = script;
      })
      .catch(async error => {
        result(false);
        console.error(error);
        await kullaniciGirisFormuOlustur();
        //todo: token aldıktan sonra pencere ile tik işareti koy. Basınca uygulama çalışsın.
      });
  });
}

function kullaniciGirisFormuOlustur() {
  girisFormuClassiniSayfayaEkle();
  girisFormuElementiniOlustur();
}



async function girisButonunaBasildi(userInfo, event) {
  event.preventDefault();
  let tokenAlindi = await tokenAl(userInfo.email, userInfo.password);
  console.log("token alindi", tokenAlindi);
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

        let email = document.getElementById("tecmonyEmail");
        let password = document.getElementById("tecmonyPassword");

        let cancelButton = document.getElementById('tecmonyCancelButton');
        cancelButton.addEventListener("click", () => {
          form.style.display = 'none'
        });

        let form = document.getElementById('tecmonyLoginForm');
        form.style.display = 'block';

        form.addEventListener("submit", e => girisButonunaBasildi({email: email.value, password: password.value}, e));
        email.focus();
      }
    })
}

function girisFormuClassiniSayfayaEkle() {
  fetch(`${serviceURL}/loginForm`)
    .then(response => response.json())
    .then(data => {
      const cssElement = sayfayaElementEkle("style",pageHead);
      cssElement.innerHTML = data.style
      cssElement.type = "text/css";
    })
}

async function tokenAl(email, pass) {

  let tokenAlindi

  const raw = JSON.stringify({
    email,
    pass
  });

  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: raw
  };
  await fetch(`${serviceURL}/createToken`, requestOptions)
    .then(response => {
      tokenAlindi = response.status !== 401
      return response.json()
    })
    .then(result => setToken(result.token))
    .catch(error => console.error(`Token alırken hata : ${error}`))

  return tokenAlindi;
}

function setToken(token) {
  save_cookie("token", token);
}

function getToken() {
  return read_cookie("token");
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

function sayfayaCssEkle(css) {
  if (pageHead) {
    let element = document.createElement("style");
    element.innerHTML = css;
    element.type = "text/css";
    pageHead.appendChild(element);
  }
}



