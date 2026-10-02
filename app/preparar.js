// Fans of Rumble · Prepara la app de Android. Lo usa GitHub al fabricar la app (.github/workflows/app-android.yml)
//   node app/preparar.js web      → copia el juego a la carpeta www (lo que va dentro de la app)
//   node app/preparar.js android  → ajusta el proyecto Android: iconos, pantalla de carga, vertical,
//                                   pantalla completa, número de versión y firma (si hay clave)
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const paso = process.argv[2];

function copiar(de, a) {
  const st = fs.statSync(de);
  if (st.isDirectory()) { fs.mkdirSync(a, { recursive: true }); for (const f of fs.readdirSync(de)) copiar(path.join(de, f), path.join(a, f)); }
  else fs.copyFileSync(de, a);
}
function version() {
  const src = fs.readFileSync(path.join(ROOT, 'js/02-progresion.js'), 'utf8');
  const m = src.match(/const VERSION = '(\d+)\.(\d+)\.(\d+)'/);
  if (!m) throw new Error('No encuentro la VERSION en js/02-progresion.js');
  // 0.9.27 → 927 · 1.0.0 → 10000 · 1.2.3 → 10203 (siempre sube)
  return { name: `${m[1]}.${m[2]}.${m[3]}`, code: +m[1] * 10000 + +m[2] * 100 + +m[3] };
}
function cambiar(fich, fn) { const s = fs.readFileSync(fich, 'utf8'), n = fn(s); if (n !== s) fs.writeFileSync(fich, n); return n !== s; }

if (paso === 'web') {
  const www = path.join(ROOT, 'www');
  fs.rmSync(www, { recursive: true, force: true }); fs.mkdirSync(www);
  for (const f of ['index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable.png', 'css', 'js']) copiar(path.join(ROOT, f), path.join(www, f));
  console.log('Juego copiado a www/');
} else if (paso === 'android') {
  const V = version(), MAIN = path.join(ROOT, 'android/app/src/main'), RES = path.join(MAIN, 'res');
  // 1) iconos y pantalla de carga (se quitan las imágenes de carga de Capacitor)
  for (const d of fs.readdirSync(RES)) if (d.startsWith('drawable')) for (const f of fs.readdirSync(path.join(RES, d))) if (/^splash\.(png|jpg|webp)$/.test(f)) fs.rmSync(path.join(RES, d, f));
  copiar(path.join(__dirname, 'res'), RES);
  // 2) siempre en vertical
  cambiar(path.join(MAIN, 'AndroidManifest.xml'), s => s.includes('android:screenOrientation') ? s : s.replace(/<activity\b/, '<activity\n            android:screenOrientation="portrait"'));
  // 3) pantalla completa (sin la barra de arriba del móvil)
  const sty = path.join(RES, 'values/styles.xml');
  if (fs.existsSync(sty)) cambiar(sty, s => s.includes('android:windowFullscreen') ? s : s.replace(/(<style name="AppTheme\.NoActionBar"[^>]*>)/, '$1\n        <item name="android:windowFullscreen">true</item>'));
  // 4) versión y firma
  const groovy = path.join(ROOT, 'android/app/build.gradle'), kts = groovy + '.kts', firmar = !!process.env.FOR_KEYSTORE;
  if (fs.existsSync(groovy)) cambiar(groovy, s => {
    s = s.replace(/versionCode \d+/, `versionCode ${V.code}`).replace(/versionName "[^"]*"/, `versionName "${V.name}"`);
    if (firmar && !s.includes('FOR_KEYSTORE')) {
      s = s.replace(/android \{/, `android {\n    signingConfigs {\n        release {\n            storeFile file(System.getenv("FOR_KEYSTORE"))\n            storePassword System.getenv("FOR_KEYSTORE_PASSWORD")\n            keyAlias System.getenv("FOR_KEY_ALIAS")\n            keyPassword System.getenv("FOR_KEY_PASSWORD")\n        }\n    }`);
      s = s.replace(/release \{(?!\s*storeFile)/, 'release {\n            signingConfig signingConfigs.release');
    }
    return s;
  });
  else if (fs.existsSync(kts)) cambiar(kts, s => {
    s = s.replace(/versionCode = \d+/, `versionCode = ${V.code}`).replace(/versionName = "[^"]*"/, `versionName = "${V.name}"`);
    if (firmar && !s.includes('FOR_KEYSTORE')) {
      s = s.replace(/android \{/, `android {\n    signingConfigs {\n        create("release") {\n            storeFile = file(System.getenv("FOR_KEYSTORE"))\n            storePassword = System.getenv("FOR_KEYSTORE_PASSWORD")\n            keyAlias = System.getenv("FOR_KEY_ALIAS")\n            keyPassword = System.getenv("FOR_KEY_PASSWORD")\n        }\n    }`);
      s = s.replace(/getByName\("release"\) \{/, 'getByName("release") {\n            signingConfig = signingConfigs.getByName("release")');
    }
    return s;
  });
  else throw new Error('No encuentro android/app/build.gradle');
  console.log(`Android listo · versión ${V.name} (código ${V.code})${firmar ? ' · con firma' : ' · sin firma (solo app de prueba)'}`);
  if (process.env.GITHUB_ENV) fs.appendFileSync(process.env.GITHUB_ENV, `FOR_VERSION=${V.name}\n`);
} else {
  console.log('Uso: node app/preparar.js web | android'); process.exit(1);
}
