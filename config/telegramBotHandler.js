const axios = require('axios')
const { bot } = require('./config'); // Import config

class TelegramBotHandler {
    constructor() {
        this.bot = bot;
        this.startMessage = 'Hey there, lottery master! 👑 \nThis bot is your one-stop shop for creating exciting Flash Lotteries. Use the following buttons to start building your next big draw!';
    }
    start() {
        console.log("chat started!");
        this.bot.onText(/\/start/, async(msg) => {
            const chatId = msg.chat.id;
            const username = msg.from.username;
            console.log('test----------->', chatId, username);
            bot.sendMessage(chatId, 'Hello World!');
        })
    }
}

module.exports = TelegramBotHandler;