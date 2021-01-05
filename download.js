var fs = require("fs");
var stream = fs.createWriteStream(__dirname + "/out.txt");
var str = "hogehogefugafugafoobarpiyo[";

let arr = [
  "https://external-preview.redd.it/fF0UX0TfMfDupElzywSdMvsWE23RZtaDmgIPc99n2KI.jpg?width=640&height=936&crop=smart&auto=webp&s=4e9bde5bf953eb7fa87f23694c5323f2568feb60",
  "https://preview.redd.it/lfl0aketz0961.jpg?width=640&height=481&crop=smart&auto=webp&s=ebb63e35b8f19c022aee64844f715452f5a7d90c",
  "https://preview.redd.it/n9wh539nz0961.jpg?width=640&height=525&crop=smart&auto=webp&s=7fc0a4b6fc4df88f2f711de6dd94901f3cae4d25",
  "https://img0.dditscdn.com/ff268cab8d9fbae1ed7506f97496274f1c/cf1218962715a80796109411717c6c19_glamour_445x250.webp?cno=5f67",
  "https://img0.dditscdn.com/ff268cab8d9fbae1ed7506f97496274f12/2bd2f26fcedfa41390969411e87ec8d8_glamour_445x250.webp?cno=bf52",
  "https://thumb-lvlt.xhcdn.com/a/GkNB-EOc_gYsQPErrgAdBQ/017/512/128/240x135.6.jpg",
  "https://thumb-lvlt.xhcdn.com/a/Xz5Qo4lMiQqb8TkZAjC-Og/004/421/871/240x135.8.jpg",
  "https://img-9gag-fun.9cache.com/photo/aDdA3Gd_460s.jpg",
];

for (var i = 0; i < arr.length; i++) {
  // 1Gtimes
  stream.write(arr[i] + "\n");
}

stream.on("drain", function () {
  console.log("drain"); // never happen
});
