const keyboards = require('./keyboards');
const { bot, token } = require('./config'); // Import config    
const channelId = '@lottery_ch';

class Lottery {
    constructor(chatId, username) {
        this.username = username;
        this.chatId = chatId;
        this.title = {};
        this.descr = {};
        this.buylimit = {};
        this.estprice = {};
        this.paymethod = {};
    };
    reset() {
        this.title[this.chatId] = null;
        this.descr[this.chatId] = null;
        this.buylimit[this.chatId] = null;
        this.estprice[this.chatId] = null;
        this.paymethod[this.chatId] = null;
        // this.username[this.chatId] = null;
    }

    // getLotteryId() {
    //     const now = new Date();
    //     const hours = String(now.getHours()).padStart(2, '0');
    //     const minutes = String(now.getMinutes()).padStart(2, '0');
    //     const seconds = String(now.getSeconds()).padStart(2, '0');
    //     const day = String(now.getDate()).padStart(2, '0');
    //     const month = String(now.getMonth() + 1).padStart(2, '0');
    //     const year = String(now.getFullYear()).slice(2, 4);
    //     return `lottery_${year}${month}${day}_${hours}${minutes}${seconds}`;
    // };
    sendMessage(message, keyOptions) {
        let inline_keyboards = [];
    
        // Group buttons in pairs of two
        for (let i = 0; i < keyOptions.length; i += 2) {
            inline_keyboards.push([keyOptions[i], keyOptions[i + 1]]);
        }
    
        const options = {
            reply_markup: JSON.stringify({
                inline_keyboard: inline_keyboards
            })
        };
    
        bot.sendMessage(this.chatId, message, options);
    }
    async handleUserInput(msg, inputStatus) {
        const text = msg.text;
        switch (inputStatus) {
            case 'TITLE':
                if (text.length > 255) {
                    bot.sendMessage(this.chatId, '⚠️ The maximum length of lottery name is 255.');
                    return;
                } else {
                    this.title[this.chatId] = text;
                }
                break;
            case 'DESCR':
                if (text.length > 1056) {
                    bot.sendMessage(this.chatId, '⚠️ The maximum length of description is 1056.');
                    return;
                } else {
                    this.descr[this.chatId] = text;
                }
                break;
            case 'BUYLIMIT':
                if (text && /^\d+$/.test(text)) {
                    const numberValue = parseInt(text, 10);
                    if (numberValue <= 1000000 && numberValue > 0) {
                        this.buylimit[this.chatId] = numberValue;
                    } else {
                        bot.sendMessage(
                            this.chatId,
                            '⚠️ The number must be less than or equal to 1,000,000 and more than 0.'
                        );
                        return;
                    }
                } else {
                    bot.sendMessage(this.chatId, '⚠️ Please send a valid number.');
                    return;
                }
                break;
            case 'USDT':
                if (text && /^\d+(\.\d{2})?$/.test(text)) {
                    const numberValue = parseFloat(text, 10);
                    if (numberValue > 0) {
                        this.estprice[this.chatId] = numberValue;
                        this.paymethod[this.chatId] = 'USDT';
                    } else {
                        bot.sendMessage(this.chatId, '⚠️ The number must be more than 0.');
                        return;
                    }
                } else {
                    bot.sendMessage(this.chatId, '⚠️ Please send a valid number.');
                    return;
                }
                break;
            case 'TON':
                if (text && /^\d+(\.\d{2})?$/.test(text)) {
                    const numberValue = parseFloat(text, 10);
                    if (numberValue > 0) {
                        this.estprice[this.chatId] = numberValue;
                        this.paymethod[this.chatId] = 'TON';
                    } else {
                        bot.sendMessage(this.chatId, '⚠️ The number must be more than 0.');
                        return;
                    }
                } else {
                    bot.sendMessage(this.chatId, '⚠️ Please send a valid number.');
                    return;
                }
                break;
            case 'ERC':
                if (text && /^\d+(\.\d{2})?$/.test(text)) {
                    const numberValue = parseFloat(text, 10);
                    if (numberValue > 0) {
                        this.estprice[this.chatId] = numberValue;
                        this.paymethod[this.chatId] = 'ERC';
                    } else {
                        bot.sendMessage(this.chatId, '⚠️ The number must be more than 0.');
                        return;
                    }
                } else {
                    bot.sendMessage(this.chatId, '⚠️ Please send a valid number.');
                    return;
                }
                break; 
            case 'SOL':
                if (text && /^\d+(\.\d{2})?$/.test(text)) {
                    const numberValue = parseFloat(text, 10);
                    if (numberValue > 0) {
                        this.estprice[this.chatId] = numberValue;
                        this.paymethod[this.chatId] = 'SOL';
                    } else {
                        bot.sendMessage(this.chatId, '⚠️ The number must be more than 0.');
                        return;
                    }
                } else {
                    bot.sendMessage(this.chatId, '⚠️ Please send a valid number.');
                    return;
                }
                break;            
        }

        const message =
            `\n\n 🥇 Lottery Name: ${this.title[this.chatId] ? this.title[this.chatId] : 'empty'}` +
            `\n 📝 Description: ${this.descr[this.chatId] ? this.descr[this.chatId] : 'empty'}` +
            `\n 🎟 Buy limit: ${this.buylimit[this.chatId] ? this.buylimit[this.chatId] : 'empty'}` +
            `\n 💲 Price of a single ticket: ${this.estprice[this.chatId] ? this.estprice[this.chatId] : 'empty'}`

        if (
            this.title[this.chatId] != null &&
            this.descr[this.chatId] != null &&
            this.buylimit[this.chatId] != null &&
            this.estprice[this.chatId] != null
        ) {
            bot.sendMessage(
                this.chatId,
                '🎉 A new lottery has been created! 🎉' +
                    '\n\nHere are the details:\n' +
                    message +
                    '\n 👉 Click the button below to publish the lottery!',
                {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{ text: '🔄 Reset', callback_data: 'RESET' }],
                            [{ text: '✅ Publish', callback_data: 'CONFIRM' }]
                        ]
                    })
                }
            );
        } else {
            this.sendMessage(message, keyboards);
        }
    }
    async publishLottery() {
        const lotteryId = this.getLotteryId();
        const lotteryData = {
            chatId: this.chatId,
            lotteryId: lotteryId,
            title: this.title[this.chatId],
            descr: this.descr[this.chatId],
            buylimit: this.buylimit[this.chatId],
            estprice: this.estprice[this.chatId],
            paymethod: this.paymethod[this.chatId],
            openstatus: 'created',
            username: this.username
        };
        try {
            await bot.sendMessage(this.chatId, `🎉  Your exciting new lottery "${lotteryId}" has been started.`);
            return;
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = Lottery;