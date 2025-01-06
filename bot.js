const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
require('dotenv').config();

// Inisialisasi bot dengan polling
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// Daftar ID pengguna yang diizinkan
const allowedUserIds = [6243379861, 5745620815, 6031133853];

// Memeriksa apakah ID pengguna ada dalam daftar yang diizinkan
function isUserAllowed(userId) {
    return allowedUserIds.includes(userId);
}

// Membaca data buyer dari file JSON
function getBuyers() {
    try {
        const data = fs.readFileSync('buyers.json', 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading buyers file:', err);
        return [];
    }
}

// Menyimpan data buyer ke file JSON
function saveBuyers(buyers) {
    fs.writeFileSync('buyers.json', JSON.stringify(buyers, null, 2));
}

// Menyimpan data buyer baru
function saveBuyerData(buyerData) {
    const buyers = getBuyers();
    buyers.push(buyerData);
    saveBuyers(buyers);
}

// Fungsi untuk menghapus buyer berdasarkan username
function deleteBuyerByUsername(username) {
    let buyers = getBuyers();
    const initialLength = buyers.length;
    buyers = buyers.filter(b => b.username !== username);
    saveBuyers(buyers);
    return initialLength > buyers.length; // Mengembalikan true jika ada yang dihapus
}

// Membaca data VPS dari file JSON
function getVpsList() {
    try {
        const data = fs.readFileSync('vps.json', 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading VPS file:', err);
        return [];
    }
}

// Menyimpan data VPS ke file JSON
function saveVpsData(vpsData) {
    const vpsList = getVpsList();
    vpsList.push(vpsData);
    fs.writeFileSync('vps.json', JSON.stringify(vpsList, null, 2));
}

// Fungsi untuk menghapus VPS berdasarkan IP atau hostname
function deleteVpsByIpOrHostname(identifier) {
    let vpsList = getVpsList();
    const initialLength = vpsList.length;
    vpsList = vpsList.filter(vps => vps.ip !== identifier && vps.hostname !== identifier);
    fs.writeFileSync('vps.json', JSON.stringify(vpsList, null, 2));
    return initialLength > vpsList.length; // Mengembalikan true jika ada yang dihapus
}

// Menyambut user dengan tombol
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    // Memeriksa apakah pengguna diizinkan
    if (!isUserAllowed(chatId)) {
        return bot.sendMessage(chatId, 'Akses dibatasi! Kamu tidak diizinkan untuk menggunakan bot ini.');
    }

    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Tambah Buyer', callback_data: 'add_buyer' },
                    { text: 'Tambah VPS', callback_data: 'add_vps' }
                ],
                [
                    { text: 'Cek Buyer', callback_data: 'view_buyers' },
                    { text: 'Cek Daftar VPS', callback_data: 'view_vps' }
                ],
                [
                    { text: 'Cek Detail VPN', callback_data: 'view_vpn_details' }
                ],
                [
                    { text: 'Hapus Buyer', callback_data: 'delete_buyer' },
                    { text: 'Hapus VPS', callback_data: 'delete_vps' }
                ],
                [
                    { text: 'Kirim File buyers.json', callback_data: 'send_buyers_json' },
                    { text: 'Kirim File vps.json', callback_data: 'send_vps_json' }
                ],
                [
                    { text: 'Kirim File bot.js', callback_data: 'send_bot_js' }
                ]
            ]
        }
    };

    bot.sendMessage(chatId, 'Selamat datang, Onii-chan!\nAku di sini untuk membantumu mengelola semua buyer dan VPS dengan mudah, agar kamu bisa fokus berniaga tanpa khawatir. 🥰', options);
});

// Menangani callback query dari tombol
bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const action = callbackQuery.data;

    // Memeriksa apakah pengguna diizinkan
    if (!isUserAllowed(chatId)) {
        return bot.sendMessage(chatId, 'Akses dibatasi! Kamu tidak diizinkan untuk menggunakan bot ini.');
    }

    if (action === 'add_buyer') {
        bot.sendMessage(chatId, 'Silakan masukkan data buyer dalam format: `Username | no wa | startdate | enddate` (contoh: `user123 | 08123456789 | 2025-01-01 | 2025-12-31`)');
        bot.once('message', (msg) => {
            const inputData = msg.text.split(' | ');

            if (inputData.length === 4) {
                const [username, whatsapp, startDate, endDate] = inputData;
                const options = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'id.vpnluxuryweb.id', callback_data: 'server_id' },
                                { text: 'sg2.vpnluxury.web.id', callback_data: 'server_sg2' },
                                { text: 'sg3.vpnluxury.web.id', callback_data: 'server_sg3' }
                            ]
                        ]
                    }
                };

                bot.sendMessage(chatId, 'Pilih server yang akan digunakan:', options);

                // Menunggu pilihan server
                bot.once('callback_query', (serverQuery) => {
                    const server = serverQuery.data === 'server_id' ? 'id.vpnluxuryweb.id' : 
                                   serverQuery.data === 'server_sg2' ? 'sg2.vpnluxury.web.id' : 
                                   'sg3.vpnluxury.web.id';
                    bot.sendMessage(chatId, 'Silakan kirim detail akun VPN (contoh: VMESS WS TLS):');
                    bot.once('message', (vpnMsg) => {
                        const vpnDetails = vpnMsg.text;

                        const buyerData = {
                            username,
                            startDate,
                            endDate,
                            whatsapp,
                            server,
                            vpnDetails
                        };

                        saveBuyerData(buyerData);
                        bot.sendMessage(chatId, 'Buyer berhasil ditambahkan!');
                    });
                });

            } else {
                bot.sendMessage(chatId, 'Format input salah. Pastikan menggunakan format: `Username | no wa | startdate | enddate`');
            }
        });
    } else if (action === 'add_vps') {
        bot.sendMessage(chatId, 'Silakan masukkan data VPS dalam format: `IP VPS | password | HOSTNAME | startdate | enddate` (contoh: `140.XXX.XXX | PASSWORD123 | sg.domain.com | 2025-01-01 | 2025-12-31`)');
        bot.once('message', (msg) => {
            const inputData = msg.text.split(' | ');

            if (inputData.length === 5) {
                const [ip, password, hostname, startDate, endDate] = inputData;
                const vpsData = { ip, password, hostname, startDate, endDate };
                saveVpsData(vpsData);
                bot.sendMessage(chatId, 'VPS berhasil ditambahkan!');
            } else {
                bot.sendMessage(chatId, 'Format input salah. Pastikan menggunakan format: `IP VPS | password | HOSTNAME | startdate | enddate`');
            }
        });
    } else if (action === 'view_buyers') {
        const buyers = getBuyers();
        if (buyers.length === 0) {
            bot.sendMessage(chatId, 'Belum ada buyer yang tercatat.');
        } else {
            let response = 'Daftar Buyer:\n';
            buyers.forEach((buyer, index) => {
                response += `${index + 1}. ❒ Username VPN\n        ╰┈➤ \`${buyer.username}\`\n`;
                response += `   ❒ WhatsApp User\n        ╰┈➤ \`${buyer.whatsapp}\`\n`;
                response += `   ❒ Expired Akun\n        ╰┈➤ \`${buyer.startDate} ➤ ${buyer.endDate}\`\n`;
                response += `   ❒ Server\n        ╰┈➤ \`${buyer.server}\`\n\n`;  // Menambahkan informasi server
            });
            bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
        }
    } else if (action === 'view_vps') {
        const vpsList = getVpsList();
        if (vpsList.length === 0) {
            bot.sendMessage(chatId, 'Belum ada VPS yang tercatat.');
        } else {
            let response = 'Daftar VPS:\n';
            vpsList.forEach((vps, index) => {
                response += `${index + 1}. ❒ IP VPS\n        ╰┈➤ \`${vps.ip}\`\n`;
                response += `   ❒ Hostname\n        ╰┈➤ \`${vps.hostname}\`\n`;
                response += `   ❒ Expired Akun\n        ╰┈➤ \`${vps.startDate} ➤ ${vps.endDate}\`\n\n`;
            });
            bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
        }
    } else if (action === 'view_vpn_details') {
        bot.sendMessage(chatId, 'Masukkan username VPN untuk cek detail:');
        bot.once('message', (msg) => {
            const username = msg.text;
            const buyer = getBuyers().find(b => b.username === username);

            if (buyer) {
                bot.sendMessage(chatId, `Detail VPN untuk username \`${username}\`:\n${buyer.vpnDetails}`);
            } else {
                bot.sendMessage(chatId, `Username ${username} tidak ditemukan.`);
            }
        });
    } else if (action === 'delete_buyer') {
        bot.sendMessage(chatId, 'Masukkan username VPN yang ingin dihapus:');
        bot.once('message', (msg) => {
            const username = msg.text;
            const success = deleteBuyerByUsername(username);

            if (success) {
                bot.sendMessage(chatId, `Buyer dengan username ${username} berhasil dihapus.`);
            } else {
                bot.sendMessage(chatId, `Username ${username} tidak ditemukan.`);
            }
        });
    } else if (action === 'delete_vps') {
        bot.sendMessage(chatId, 'Masukkan IP atau hostname VPS yang ingin dihapus:');
        bot.once('message', (msg) => {
            const identifier = msg.text;
            const success = deleteVpsByIpOrHostname(identifier);

            if (success) {
                bot.sendMessage(chatId, `VPS dengan IP/Hostname ${identifier} berhasil dihapus.`);
            } else {
                bot.sendMessage(chatId, `VPS dengan IP/Hostname ${identifier} tidak ditemukan.`);
            }
        });
    } else if (action === 'send_buyers_json') {
        // Kirim file buyers.json
        const filePath = 'buyers.json';
        if (fs.existsSync(filePath)) {
            bot.sendDocument(chatId, filePath);
        } else {
            bot.sendMessage(chatId, 'File buyers.json tidak ditemukan.');
        }
    } else if (action === 'send_vps_json') {
        // Kirim file vps.json
        const filePath = 'vps.json';
        if (fs.existsSync(filePath)) {
            bot.sendDocument(chatId, filePath);
        } else {
            bot.sendMessage(chatId, 'File vps.json tidak ditemukan.');
        }
    } else if (action === 'send_bot_js') {
        // Kirim file bot.js
        const filePath = 'bot.js';
        if (fs.existsSync(filePath)) {
            bot.sendDocument(chatId, filePath);
        } else {
            bot.sendMessage(chatId, 'File bot.js tidak ditemukan.');
        }
    }
});
