// Uzantının simgesine tıklandığında çalışır.

save_cookie("startinstall", "1");
window.location.href = '/';

function save_cookie(kayityeri, veri) {
  document.cookie = (kayityeri + "=" + veri);
}