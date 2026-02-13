const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();

// Komut satırından 'ilk' yazılırsa DB'yi de yükler: npm run deploy -- ilk
const isFirstRun = process.argv.includes('ilk');

const config = {
    user: process.env.FTP_USER || "admin_kullanici", // Burayı dolduracağız
    password: process.env.FTP_PASSWORD || "sifreniz",
    host: process.env.FTP_HOST || "ftp.siteadresiniz.com",
    port: 21,
    localRoot: __dirname,
    remoteRoot: "/public_html/",
    include: ["*", "**/*"],
    exclude: [
        "node_modules/**",
        ".git/**",
        ".next/**",
        ".env*",
        "deploy.js",
        "README.md"
    ],
    deleteRemote: false,
    forcePasv: true,
    sftp: false
};

// Rutin güncellemede kritik dosyaları koru
if (!isFirstRun) {
    console.log('🛡️  GÜNCELLEME MODU: Veritabanı ve Uploads korunuyor.');

    config.exclude.push("public/uploads/**");
} else {
    console.log('✨ İLK KURULUM MODU: Her şey (DB dahil) yükleniyor!');
}

console.log('🚀 Yükleme başlıyor...');
if (!config.password || config.password === "sifreniz") {
    console.error('❌ HATA: Lütfen deploy.js içine şifrenizi yazın veya .env dosyası oluşturun!');
    process.exit(1);
}

ftpDeploy.deploy(config)
    .then(res => console.log(`✅ Yükleme Başarılı! Toplam ${res.uploadedFiles.length} dosya yüklendi.`))
    .catch(err => console.error('❌ Hata:', err));
