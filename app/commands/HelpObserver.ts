import { Message } from "discord.js";
import { Client } from "discord.js";
import { IObserver } from "../IObserver";

class HelpObserver implements IObserver {
    event: string = "help";

    async callback(message: Message): Promise<any> {
      message.channel.send("Help é minha caceta");
      return;
    }
}

export default new HelpObserver();
