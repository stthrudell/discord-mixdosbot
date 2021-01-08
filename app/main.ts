import { Client, Message } from "discord.js";
import { Bus } from "./Bus";
import commands from "./commands";

class DiscordApplication {
  private client: Client = new Client();
  private bus: Bus = new Bus();
  private commandPrefix: string = "!";

  constructor (token: string) {
    this.client.login(token).then(() => {
      console.log("Bot iniciado!");
    });
    this.registerCommands();
    this.client.on('message', (message: Message) => {
      this.handleMessage(message);
    });
  }

  private registerCommands() {
    for (let command of commands) 
      this.bus.register(command);
  }

  private handleMessage(message: Message) {
    const { content } = message;
    if (content.startsWith(this.commandPrefix)) {
      const splited = content.replace(this.commandPrefix, "").split(" ");
      const command = splited[0];
      this.bus.notify(command.toLowerCase(), message);
    }
  }
}

new DiscordApplication(process.env.TOKEN || "");

