## Pesyaratan

untuk melakukan instalsi projek koi-ecommerce dan ingin menjalan
dilocalhost ada beberapa tools yang harus disiapkan.

- Node Js versi 20 (minimum)
  [link download](https://nodejs.org/id/download/package-manager)

- Git
  [link download](https://git-scm.com/download)

- IDE rekomendasi: Visual Studio Code
  [link download](https://code.visualstudio.com/)

- Universal development environment Xampp atau Laragon(rekomendasi), karena konfigurasi Laragon lebih mudah.

- Web server saya sarankan menggunakan nginx

setelah menginstall semua tools di atas dan silahkan jalankan web server, kemudian copy link repository dibawah ini.

```bash
https://github.com/agustrio1/koi-ecommerce.git
```

masuk ke terminal ketikan seperti dibawah ini

```
git clone  https://github.com/agustrio1/koi-ecommerce.git
```

tunggu hingga selesai download. kemudian silahkan ketik

```
cd koi-ecommerce

```

kemudian jalankan perintah

```
npm install

```

tunggu sampai semua installasi depedency selesai. lalu ketikan command seperti dibawah ini.

```
npx prisma migrate dev
```

ada perintah menamakan file migrasi, saya beri contoh koi_db ini sebenarnya bebas untuk penamaannya.

terakhir silahkan ketik command di terminal seperti dibawah ini.

```
npm run dev

```

buka projek di http://localhost:3000/

projek berjalan di localhost
