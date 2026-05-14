require('dotenv').config();
const { Telegraf } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');
const QuickChart = require('quickchart-js');

const bot = new Telegraf(process.env.BOT_TOKEN);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

bot.start((ctx) => {
    ctx.reply(
        'Halo! Aku asisten keuangan pribadi kamu. 🚀\n\n' +
        'Cara catat pengeluaran:\n' +
        '👉 Langsung ketik: "Kopi 15rb" atau "Bensin 50k"\n\n' +
        'Gunakan menu /help untuk melihat panduan lengkap.'
    );
});

bot.command('help', (ctx) => {
    ctx.reply(
        '📖 PANDUAN PENGGUNAAN BOT\n\n' +
        '1. Catat Jajan: Langsung ketik Nama Barang [Spasi] Nominal\n' +
        'Contoh: Nasi Padang 25rb atau Kopi 15k\n\n' +
        '2. Cek Laporan:\n' +
        '• /laporan : Laporan khusus hari ini\n' +
        '• /laporan_semua : Semua riwayat jajan kamu\n' +
        '• /grafik : Lihat grafik visual jajan kamu\n\n' +
        '3. Atur Keuangan:\n' +
        '• /budget [angka] : Set jatah jajan bulanan\n' +
        '• /undo : Hapus catatan terakhir kalau salah input\n\n' +
        '💡 Tips: Selalu gunakan satuan k, rb, atau jt untuk mempermudah mencatat!'
    );
});

bot.command('budget', async (ctx) => {
    const amount = parseInt(ctx.message.text.split(' ')[1]);
    if (isNaN(amount)) return ctx.reply('Contoh penggunaan: /budget 2000000');

    const { error } = await supabase
        .from('budget')
        .upsert({ user_id: ctx.from.id, limit_amount: amount });

    if (error) return ctx.reply('❌ Gagal memasang budget.');
    ctx.reply(`✅ Budget bulanan diatur ke Rp ${amount.toLocaleString('id-ID')}.`);
});

bot.command('undo', async (ctx) => {
    try {
        const { data: lastData } = await supabase
            .from('pengeluaran')
            .select('id, nama_barang')
            .eq('user_id', ctx.from.id)
            .order('tanggal', { ascending: false })
            .limit(1);

        if (!lastData || lastData.length === 0) return ctx.reply('Belum ada data.');

        const { error } = await supabase
            .from('pengeluaran')
            .delete()
            .eq('id', lastData[0].id);

        if (error) throw error;
        ctx.reply(`🗑️ Berhasil menghapus: "${lastData[0].nama_barang}".`);
    } catch (err) {
        ctx.reply('❌ Gagal menghapus data.');
    }
});

// --- FITUR: GRAFIK ---
bot.command('grafik', async (ctx) => {
    try {
        const { data } = await supabase
            .from('pengeluaran')
            .select('nama_barang, nominal')
            .eq('user_id', ctx.from.id)
            .limit(10);

        if (!data || data.length === 0) return ctx.reply('Data belum cukup.');

        const chart = new QuickChart();
        chart.setConfig({
            type: 'bar',
            data: {
                labels: data.map(d => d.nama_barang),
                datasets: [{ label: 'Pengeluaran', data: data.map(d => d.nominal), backgroundColor: '#36A2EB' }]
            }
        }).setWidth(800).setHeight(400);

        await ctx.replyWithPhoto(chart.getUrl());
    } catch (err) {
        ctx.reply('❌ Gagal membuat grafik.');
    }
});

bot.command('laporan', async (ctx) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { data: list } = await supabase
            .from('pengeluaran')
            .select('nama_barang, nominal')
            .eq('user_id', ctx.from.id)
            .gte('tanggal', today.toISOString());

        const { data: budgetData } = await supabase
            .from('budget')
            .select('limit_amount')
            .eq('user_id', ctx.from.id)
            .single();

        let total = list ? list.reduce((sum, item) => sum + item.nominal, 0) : 0;
        let listText = list && list.length > 0 
            ? list.map((item, i) => `${i + 1}. ${item.nama_barang}: Rp ${item.nominal.toLocaleString('id-ID')}`).join('\n')
            : 'Belum ada data hari ini.';

        let msg = `📊 LAPORAN HARI INI\n\n${listText}\n\n💰 TOTAL: Rp ${total.toLocaleString('id-ID')}`;
        if (budgetData) msg += `\n📉 SISA BUDGET: Rp ${(budgetData.limit_amount - total).toLocaleString('id-ID')}`;

        ctx.reply(msg);
    } catch (err) {
        ctx.reply('❌ Gagal mengambil laporan.');
    }
});

bot.command('laporan_semua', async (ctx) => {
    try {
        const { data } = await supabase
            .from('pengeluaran')
            .select('nama_barang, nominal')
            .eq('user_id', ctx.from.id);

        if (!data || data.length === 0) return ctx.reply('Kosong.');

        let total = 0;
        let listBarang = data.map((item, index) => {
            total += item.nominal;
            return `${index + 1}. ${item.nama_barang}: Rp ${item.nominal.toLocaleString('id-ID')}`;
        }).join('\n');

        ctx.reply(`🗄️ LAPORAN SELURUHNYA\n\n${listBarang}\n\n💰 TOTAL: Rp ${total.toLocaleString('id-ID')}`);
    } catch (err) {
        ctx.reply('❌ Gagal mengambil semua laporan.');
    }
});

bot.on('text', async (ctx) => {
    const msg = ctx.message.text.toLowerCase();
    const match = msg.match(/(.+)\s(\d+)(k|rb|jt)?/);

    if (match) {
        let item = match[1].trim();
        let amount = parseInt(match[2]);
        let unit = match[3];

        if (unit === 'k' || unit === 'rb') amount *= 1000;
        if (unit === 'jt') amount *= 1000000;

        try {
            await supabase.from('pengeluaran').insert([{ 
                user_id: ctx.from.id, 
                nama_barang: item, 
                nominal: amount 
            }]);
            ctx.reply(`✅ Catat: ${item} (Rp ${amount.toLocaleString('id-ID')})`);
        } catch (err) {
            ctx.reply('❌ Gagal menyimpan.');
        }
    }
});

bot.launch().then(() => console.log('🚀 Bot Dewa v3.5 Aktif!'));