import { Message } from "discord.js";
import { Client } from "discord.js";
import IEventMessage from "../interfaces/IEventMessage";
import { IObserver } from "../interfaces/IObserver";

export default class HelpObserver implements IObserver {
    event: string = "help";

    async callback(eventMessage: IEventMessage): Promise<any> {
      eventMessage.message.channel.send("Help é minha caceta");
      return;
    }
}
