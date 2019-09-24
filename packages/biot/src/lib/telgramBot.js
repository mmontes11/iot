import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BIOT_TELEGRAM_TOKEN, { polling: true });

export default bot;
