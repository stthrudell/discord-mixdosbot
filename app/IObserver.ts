import { Message } from "discord.js";

export interface IObserver {
  event: string;
  callback(message: Message): Promise<any>;
}
