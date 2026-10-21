# SKG PBD Adventure V8 Premium 3D — Fresh Fixed

Versi ini dibetulkan supaya semua fail utama berada pada aras yang sama, tanpa folder `src`. Fail `index.html` memanggil `/main.js`, dan `main.js` mengimport `./style.css`.

## Deploy ke Vercel (beginner)
1. Ekstrak ZIP ini di komputer.
2. Cipta **repository GitHub baharu** (contoh `SKG-PBD-V8-FRESH`). Jangan gunakan repository V8 lama.
3. Di repository kosong, pilih **uploading an existing file** atau **Add file > Upload files**.
4. Pilih dan upload SEMUA ENAM FAIL dalam folder yang telah diekstrak: `index.html`, `main.js`, `style.css`, `package.json`, `vercel.json`, `README.md`. **Jangan upload ZIP sahaja.**
5. Klik **Commit changes**.
6. Di Vercel, klik **Add New > Project**, import repository baharu, pilih preset **Vite**, root `./`, Build Command `npm run build`, Output Directory `dist`, Install Command `npm install`.
7. Klik Deploy.

## Kawalan
A/D atau anak panah untuk bergerak, Space untuk melompat, X/J untuk menembak. Di telefon, gunakan butang pada skrin.

## Watak
Fox, Rabbit, Panda dan Cat. Ini prototaip satu dunia 3D. Belum ada integrasi Google Sheets atau kuiz PBD.
