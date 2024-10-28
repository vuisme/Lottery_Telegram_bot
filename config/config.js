const token = process.env.TOKEN;
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(token, { polling: true });

module.exports = { token, bot };
