// Uzantı bu scripti sayfa yüklendikten sonra çalıştırır.
 
var serviceURL = "http://localhost:3000";
const pageHead = document.getElementsByTagName("head")[0];
(function () {
  if (!kurulumAsamasindaMi())
    return;

  if (!sayfaIlkDefaMiYuklendi())
    return;


  sweetAlerEkle();

  const scriptElement = sayfayaElementEkle("script",pageHead);
  scriptElement.src = `${serviceURL}/extensionScripts/phoneExtension.js`

}());

function kurulumAsamasindaMi() {
  return read_cookie("startinstall") === "1";
}

function sayfaIlkDefaMiYuklendi() {
  const kontrolElementi = document.getElementById("control_element_") == null;
  if (!kontrolElementi) {
    return false
  }

  const element = document.createElement("a");
  element.setAttribute("id", "control_element_");
  pageHead.appendChild(element)
  return true

  // Sayfada bir nesne oluşturduk. Eğer bu script sayfa yenilenmeden önce tekrar çalışmaya
  // kalkarsa control_element_ idsi olan bir nesnenin varlığını kontrol edip daha önceden
  // çalışıp çalışmadığını algılayacak.

}

function read_cookie(kayityeri) {

  let cerez_degeri
  let cerezler = document.cookie.split("; ");
  for (let i = 0; i < cerezler.length; i++) {
    cerez_degeri = cerezler[i].split("=");
    if (kayityeri === cerez_degeri[0]) {
      return cerez_degeri[1];
    }
  }
}

function kurulumDurdur() {
  fetch(`${serviceURL}/extensionScripts/url.json`)
    .then(response => response.json())
    .then(data => {
      const scriptElement = sayfayaElementEkle("script",pageHead);
      scriptElement.src = `${data.url}/extensionScripts/stopinstall.js`;
    })
    .catch((error) => {
      console.error("stopinstall.js ulaşmaya çalışırken Hata: " + error);
    });
}

function sayfayaElementEkle(tag,eklenilecekYer){

  if (!eklenilecekYer)
    return null

  const element = document.createElement(tag);
  eklenilecekYer.appendChild(element);

  return element

}


function sweetAlerEkle(){
  let scriptElement = sayfayaElementEkle("script",pageHead)
  scriptElement.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
}
