const fs = require('fs');
const logKaydiEkle = (bilgi, logBasligi = '') => {
  let tarih = new Date();
  (logBasligi !== '') && (logBasligi = `[${logBasligi}]`);
  let tarihYazisi = `[Tarih : ${tarih.getDate()}/${tarih.getMonth() + 1}/${tarih.getFullYear()} - ${tarih.getHours()}:${tarih.getMinutes()}]`
  console.log(`HISTORY : ${logBasligi} ${tarihYazisi} ${bilgi}`)
  fs.appendFile("logs.txt", `\n${tarihYazisi} ${logBasligi}\n${bilgi}\n`, err => {
    if (err) {
      throw err;
    }
  });


}

module.exports = logKaydiEkle;