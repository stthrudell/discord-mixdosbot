import { Message, Client, VoiceChannel, TextChannel, GuildChannel, Collection } from "discord.js";
import IEventMessage from "../interfaces/IEventMessage";
import { IObserver } from "../interfaces/IObserver";
import MixConfig from "../models/MixConfig";
import MixObserver from "./MixObserver";
import discordApplication from "../main";
import EndMixObserver from "./EndMixObserver";


export default class MixConfigObserver implements IObserver {
    event: string = "mix";
    readonly emotis: string[] = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

    public channels: any = {
      logsChannel: false,
      waitingChannel: false,
      teamOneChannel: false,
      teamTwoChannel: false,
    };

    static getChannelsByTypeFromCollection(
      serverChannels: Collection<string, GuildChannel>,
      type: string = "voice"
    ) {
      return serverChannels.filter((value, key) => {
        return value.type == type;
      });
    }

    private channelsConfig: any = {
      logsChannel: {
        getChannels: (collection: Collection<string, GuildChannel>) => {
          return MixConfigObserver.getChannelsByTypeFromCollection(collection, "text");
        },
        configMessage: 'Escolha o canal de texto para gerenciar o mix: ',
      },
      waitingChannel: {
        getChannels: MixConfigObserver.getChannelsByTypeFromCollection,
        configMessage: 'Escolha o canal de voz onde os players irão aguardar o mix: ',
      },
      teamOneChannel: {
        getChannels: MixConfigObserver.getChannelsByTypeFromCollection,
        configMessage: 'Escolha o canal para o time 1: ',
      },
      teamTwoChannel: {
        getChannels: MixConfigObserver.getChannelsByTypeFromCollection,
        configMessage: 'Escolha o canal para o time 2: ',
      },
    }

    async callback(eventMessage: IEventMessage): Promise<any> {
      const channelLog = eventMessage.message.channel;
      const serverChannels = eventMessage.message.guild?.channels.cache;
      for (let channel in this.channels) {
        if (serverChannels)
          if (!this.channels[channel]) {
            this.channels[channel] = await this.sendConfig(
              channel, 
              channelLog as TextChannel, 
              serverChannels
            );
        }
      }

      const mixConfig = new MixConfig(
        this.channels.logsChannel as TextChannel,
        this.channels.waitingChannel as VoiceChannel,
        this.channels.teamOneChannel as VoiceChannel,
        this.channels.teamTwoChannel as VoiceChannel,
      );

      const mixObserver = new MixObserver(mixConfig);
      const endMixObserver = new EndMixObserver(mixConfig)

      discordApplication.bus.register(mixObserver);
      discordApplication.bus.register(endMixObserver);

      discordApplication.bus.remove(this);
    }

    private async sendConfig(
      channel: string, 
      channelLog: TextChannel,
      serverChannels: Collection<string, GuildChannel>
    ): Promise<TextChannel | VoiceChannel> {
      const channelConfig = this.channelsConfig[channel];

      const channels = channelConfig
        .getChannels(serverChannels)
        .map(((value: GuildChannel) => value));

      const configMessage = channelConfig.configMessage;

      const channelsOptions: string = channels.reduce((acc: string, value: GuildChannel, index: number) => {
        return acc += `${this.emotis[index]} - ${value.name}\n`;
      }, configMessage + "\n");

      const message = await channelLog.send(`
      \`\`\` ${channelsOptions} \`\`\`
      `);

      for (let i = 0; i < channels.length; i++) {
        await message.react(this.emotis[i]);
      }

      const collectedReaction = await message.awaitReactions((reaction, user) => {
        return this.emotis.indexOf(reaction.emoji.name) != -1;
      }, {max: 1});

      const reaction = collectedReaction.first();

      const index = this.emotis.indexOf(reaction?.emoji.name || "");

      message.delete();

      return channels[index];
    }
}
