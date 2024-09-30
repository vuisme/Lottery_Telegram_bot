const token = "7703771063:AAG_xk0swI_kton1B1mBZKXSPQ9cpZ3qeNM"
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(token, { polling: true });

module.exports = { token, bot };