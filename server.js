// const TelegramBot = require('node-telegram-bot-api');
// const token = "7795977850:AAEYlNfPM5jlpbvtqXRTpnbEfI5yCKL0gdI"
// // Create a bot that uses 'polling' to fetch new updates
// const bot = new TelegramBot(token, { polling: true });

// // Listen for '/start' command and send a message with a button
// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;

//   // Create an inline keyboard with a button
//   const options = {
//     reply_markup: {
//       inline_keyboard: [
//         [
//           {
//             text: 'Click me',
//             callback_data: 'click_button' // This is used to identify button click
//           }
//         ]
//       ]
//     }
//   };

//   // Send a message with the button
//   bot.sendMessage(chatId, 'Click the button below:', options);
// });

// // Handle button press event (callback query)
// bot.on('callback_query', (callbackQuery) => {
//   const message = callbackQuery.message;
//   const chatId = message.chat.id;

//   // Check if the callback data is 'click_button'
//   if (callbackQuery.data === 'click_button') {
//     // Send "Hello World" message when the button is clicked
//     bot.sendMessage(chatId, 'Hello World!');
//   }
// });

// console.log('Bot is running...');


const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require('pg');
const TelegramBotHandler = require('./config/telegramBotHandler');

const channelId = '@lottery_ch';

const botHandler = new TelegramBotHandler();
const app = express();
const port = process.env.PORT || 5001;

botHandler.start();