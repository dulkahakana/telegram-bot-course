const TelegramApi = require('node-telegram-bot-api');

const token = '1908433080:AAGViRgmH10qEWElXcq1ba_jt6ATUh9oal4';

const {gameOptions, againOptions} = require('./options');

const bot = new TelegramApi(token, {polling: true});

const chats = {};



const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Я загадал цифру от 0 до 9, а ты должен ее угадать');
  const randomNumber = Math.floor(Math.random()*10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
};



const start = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Начальное приветсвие'},
    {command: '/info', description: 'Информация о пользователе'},
    {command: '/game', description: 'Угадай число'}
  ]);

  bot.on('message', async msg => {
  const text = msg.text;
  const chatId = msg.chat.id;

  // console.log(msg);
  console.log(`
    New message
    User: ${msg.from.username}, 
    написал: ${text}.
  `)

  if (text === '/start') {
    if (msg.from.first_name === 'Dulka' & msg.from.last_name === 'Hakana') {
      console.log('DulkaHakana вошел в бота');
      await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/22c/b26/22cb267f-a2ab-41e4-8360-fe35ac048c3b/8.webp');
      return bot.sendMessage(chatId, 'Добрый вечер мой повелитель! Что изволите делать?'); 
    } else if (msg.from.first_name === 'Ula' & msg.from.last_name === 'Demon') {
      await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/88e/586/88e586f0-4299-313f-bedb-ef45c7710422/1.webp');
      return bot.sendMessage(chatId, 'Добрый вечер Юленька!');
    } else {
      return bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот DHbot');    
    }     
  } else if (text === '/info') {
    return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
  } else if (text === '/game') {
      return startGame(chatId);
  } else {
    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!')
    // return bot.sendMessage(chatId, `Ты написал мне ${text}`);
  } 
  
  });

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return startGame(chatId);
    };

    if (data == chats[chatId]) {
      return bot.sendMessage(chatId, `Вы угадали, это чилсло: ${chats[chatId]}`, againOptions);
    } else {
      return bot.sendMessage(chatId, `К сожалению вы не угадали, бот загадал цифру: ${chats[chatId]}`, againOptions);
    }
  });

  console.log('DHBot is started...');

}

start();

