require('dotenv').config();
import { Client, Message } from "discord.js";
import { Bus } from "./Bus";
import commands from "./commands";
import IEventMessage from "./interfaces/IEventMessage";
import { IObserver } from "./interfaces/IObserver";
import ClearPrefixMessage from "./utils/ClearPrefixMessage";


class DiscordApplication {
  private _client: Client = new Client();
  public bus: Bus = new Bus();
  readonly commandPrefix: string = "!";

  constructor (token: string) {
    this._client.login(token).then(() => {
      console.log("Bot iniciado!");      
      this._client.user?.setActivity('!mix', {type: "PLAYING"})
    });


    this.registerCommands();
    this._client.on('message', (message: Message) => {
      this.handleMessage(message);
    });
  }

  public get client() {
    return this._client;
  }

  private registerCommands() {
    for (let command of commands) 
      this.bus.register(command as IObserver);
  }

  private handleMessage(message: Message) {
    const { content } = message;
    const [command, args] = ClearPrefixMessage.clear(message.content, this.commandPrefix);
    const eventMessage: IEventMessage = {
      message,
      command: (command as string),
      args: (args as string[])
    }

    if (content.startsWith(this.commandPrefix)) {
      const splited = content.replace(this.commandPrefix, "").split(" ");
      const command = splited[0];
      this.bus.notify(command.toLowerCase(), eventMessage);
    }
  }
}

export default new DiscordApplication(process.env.TOKEN || "");
