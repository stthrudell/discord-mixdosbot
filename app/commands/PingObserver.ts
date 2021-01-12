import { Message } from "discord.js";
import IEventMessage from "../interfaces/IEventMessage";
import { IObserver } from "../interfaces/IObserver";

export default class PingObserver implements IObserver {
    event: string = "ping";
    async callback(eventMessage: IEventMessage): Promise<any> {
      eventMessage.message.channel.send("Pong!");
    }
}
