const axios = require('axios');
const { bot } = require('./config'); // Import config
const Lottery = require('./lottery');
const keyboards = require('./keyboards');
class TelegramBotHandler {
    constructor() {
        this.bot = bot;
        this.lotteries = {}; // Store lottery objects by chat ID
        this.inputStatus = {}; // Store input status for each chat
        this.commandStatus = {};
        this.flag = '';
        this.startMessage = 'Hey there, lottery master! 👑 \nThis bot is your one-stop shop for creating exciting Flash Lotteries. Use the following buttons to start building your next big draw!';
    }

    start() {
        console.log("chat started!");
        
        // Handle the /start command
        this.bot.onText(/\/start/, async (msg) => {
            const chatId = msg.chat.id;
            const username = msg.from.username;
            this.lotteries = {}; // Store lottery objects by chat ID
            console.log('test----------->', chatId, username);
            this.inputStatus = {}; // Store input status for each chat
            this.commandStatus = {};
            const data = {
                chatId: chatId,
                username: username
            };
            try {
                // Sending the command options to the user
                this.bot.sendMessage(chatId, '/new_lottery\n/lottery_list\n/delete_lottery');
            } catch (e) {
                console.log(e);
            }
        });

        // Handle the /new_lottery command
        this.bot.onText(/\/new_lottery/, async (msg) => {
            const chatId = msg.chat.id;
            const username = msg.from.username;
            this.lotteries[chatId] = new Lottery(chatId, username);
            this.lotteries[chatId].reset(chatId);
            this.lotteries[chatId].sendMessage(this.startMessage, keyboards);
            // Send the "hello world" message when /new_lottery is triggered
            this.commandStatus[chatId] = 'new_lottery';
        });
        this.bot.on('callback_query', async (query) => {
            const chatId = query.message.chat.id;
            const data = query.data;
            const lottery = this.lotteries[chatId];

            switch(data){
                case 'TITLE':
                    this.inputStatus[chatId] = 'TITLE',
                    bot.sendMessage(chatId,"Input the title of this lottery!");
                    break;
                case "DESCR":
                    this.inputStatus[chatId] = "DESCR",
                    bot.sendMessage(chatId, "Input the description of this lottery");
                    break;
                case 'BUYLIMIT':
                    this.inputStatus[chatId] = 'BUYLIMIT';
                    bot.sendMessage(chatId, 'BuyLimit number must be integer like 5 or 10');
                    break;
                case 'ESTPRICE':
                    this.inputStatus[chatId] = 'ESTPRICE';
                    bot.sendMessage(chatId, 'Choose the payment method of this lottery', {
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                                [
                                    { text: 'USDT', callback_data: 'USDT' },
                                    { text: 'TON', callback_data: 'TON' },
                                    { text: 'ERC', callback_data: 'ERC' },
                                    { text: 'SOL', callback_data: 'SOL' },
                                ]
                            ]
                        })
                    });
                    break;
                case 'RESET':
                    if (this.lotteries[chatId]) {
                        this.lotteries[chatId].reset();
                        this.lotteries[chatId].sendMessage(this.startMessage, keyboards);
                        this.inputStatus[chatId] = 'RESET';
                    }
                    break;
                case 'CONFIRM':
                    if (this.inputStatus[chatId] === 'CONFIRM') {
                        this.bot.sendMessage(chatId, 'You have already published this lottery.');
                    } else {
                        if (this.lotteries[chatId]) {
                            this.flag = "end_lottery"
                            // this.commandStatus[chatId] = 'end_lottery';
                            this.commandStatus[chatId] = 'fl';
                            this.inputStatus[chatId] = 'CONFIRM';
                            await this.lotteries[chatId].publishLottery();
                        }
                    }
                    break;
                case 'USDT':
                    this.inputStatus[chatId] = 'USDT';
                    bot.sendMessage(chatId, 'Insert the price of a single ticket in USDT');
                    break;
                case 'TON':
                    this.inputStatus[chatId] = 'TON';
                    bot.sendMessage(chatId, 'Insert the price of a single ticket in TON');
                    break;
                case 'ERC':
                    this.inputStatus[chatId] = 'ERC';
                    bot.sendMessage(chatId, 'Insert the price of a single ticket in ERC');
                    break;
                case 'SOL':
                    this.inputStatus[chatId] = 'SOL';
                    bot.sendMessage(chatId, 'Insert the price of a single ticket in SOL');
                    break;
            }
        });
        this.bot.on('message', async (msg) => {
            const chatId = msg.chat.id;
            const text = msg.text;
            const lottery = this.lotteries[chatId];
            if (text === '/start') {
                // Handle /start command (already handled in the start method)
            } else if (text === '/new_lottery' || text === '/lottery_list' || text === '/delete_lottery') {
            } else {
                if (lottery) {
                    await this.lotteries[chatId].handleUserInput(msg, this.inputStatus[chatId]);
                } else {
                    bot.sendMessage(chatId, 'Please start creating lottery using /fl first.');
                }
            }
        });

        this.bot.on('polling_error', (error) => {
            console.error('Polling error:', error);
        });
    }
}

module.exports = TelegramBotHandler;
