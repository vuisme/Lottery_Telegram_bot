const token = "7795977850:AAEYlNfPM5jlpbvtqXRTpnbEfI5yCKL0gdI"
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(token, { polling: true });

module.exports = { token, bot };