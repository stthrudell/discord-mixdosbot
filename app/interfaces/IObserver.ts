import { Message } from "discord.js";
import IEventMessage from "./IEventMessage";

export interface IObserver {
  event: string;
  callback(message: IEventMessage): Promise<any>;
}
