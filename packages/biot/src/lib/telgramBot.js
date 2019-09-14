import TelegramBot from "node-telegram-bot-api";
import config from "../config/index";

const bot = new TelegramBot(config.biotTelegramToken, { polling: true });

export default bot;
