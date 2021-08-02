// Uzantının simgesine sağtıklayıp "Kurulum İşlemlerini Durdur" butonuna bastığında
// ve kurulum işlemi tamamlandığında çalışır.
 
save_cookie("startinstall", "0")
save_cookie("asama", "0")
delete_cookie("kayitli_telefon")
alert("• Kurulum İşlemleri Durduruldu.")
window.location.href = '/'

function delete_cookie(kayityeri) {
  document.cookie = kayityeri + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function save_cookie(kayityeri, veri) {
  document.cookie = (kayityeri + "=" + veri)
}

