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

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
