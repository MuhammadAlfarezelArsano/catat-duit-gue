require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('Halo Bos! Gue asisten keuangan lo.\n\nContoh catat: "Kopi 15rb" atau "Gaji 5jt"');
});

bot.on('text', (ctx) => {
    const pesan = ctx.message.text.toLowerCase();

    const regex = /(.+?)\s+(\d+(?:\.\d+)?)\s*(rb|k|jt|juta)?/;
    const match = pesan.match(regex);

    if (match) {
        let namaBarang = match[1].trim();
        let angka = parseFloat(match[2]);
        let satuan = match[3];

        if (satuan === 'rb' || satuan === 'k') {
            angka *= 1000;
        } else if (satuan === 'jt' || satuan === 'juta') {
            angka *= 1000000;
        }

        const formatRupiah = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(angka);

        ctx.reply(`✅ Dicatat Bos!\n📌 Barang: ${namaBarang}\n💰 Nominal: ${formatRupiah}`);
        console.log(`Berhasil catat: ${namaBarang} - ${angka}`);
    } else {
        ctx.reply('Format salah Bos. Contoh: "Soto 15rb"');
    }
});

bot.launch().then(() => console.log("Bot sudah ON! Silakan chat di Telegram."));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));