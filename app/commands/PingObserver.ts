import { Message } from "discord.js";
import { IObserver } from "../IObserver";

class PingObserver implements IObserver {
    event: string = "ping";
    async callback(message: Message): Promise<any> {
      message.channel.send("Pong!");
    }
}

export default new PingObserver();
