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
async function telefonScriptBaslatilsinMiSor(){

  const question = await Swal.fire({
    title: '<strong>Kurulumu Başlat</strong>',
    icon: 'question',
    html: 'Bu işlemi gerçekleştirmek istediğinize emin misiniz ?',
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: true,
    confirmButtonText:'Evet',
    cancelButtonText: 'Hayır , kurulumu durdur'
  })

  if ( !question.value ){
    kurulumDurdur();
  }

  return question.value;

}

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
      .then(async script => {
        let kullaniciEminMi = await telefonScriptBaslatilsinMiSor();
        if ( kullaniciEminMi ) {
          result(true)
          let scriptElement = sayfayaElementEkle("script", pageHead);
          scriptElement.innerHTML = script;
        }
      })
      .catch(async error => {
        result(false);
        console.error(error);
        await kullaniciGirisFormuOlustur();
      });
  });
}
async function kullaniciGirisFormuOlustur(){
  const { value: formValues } = await Swal.fire({
    title: 'Oturum Aç',
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Giriş Yap',
    cancelButtonText: 'İptal',
    html:
        '<input id="email" placeholder="Email" class="swal2-input">' +
        '<input id="pass" placeholder="Parola" type="password" class="swal2-input">',
    preConfirm: async () =>
    {
        let girisBasariliMi = await tokenAl(document.getElementById('email').value, document.getElementById('pass').value);
        girisYapButonunaBasildi(girisBasariliMi);
    }
  });
}

function girisYapButonunaBasildi(girisBasariliMi){
      Swal.fire({
        icon: girisBasariliMi?'success':'error',
        title: girisBasariliMi?'Giriş Yapıldı':'Hatalı Giriş',
        showConfirmButton: false,
          timer: 1500
      })
}

async function tokenAl(email, pass) {

  let tokenAlindi = false;

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
      tokenAlindi = response.status === 200
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




