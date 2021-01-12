import { Message } from "discord.js";

export default interface EventMessage {
  message: Message,
  args: string[],
  command: string
}
