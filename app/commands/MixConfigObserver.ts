require('dotenv');
import { Message, Client, VoiceChannel, TextChannel, GuildChannel, Collection } from "discord.js";
import IEventMessage from "../interfaces/IEventMessage";
import { IObserver } from "../interfaces/IObserver";
import MixObserver from "./MixObserver";
import discordApplication from "../main";
import EndMixObserver from "./EndMixObserver";
import Server from "../models/Server";
import fs from "fs";
import MixConfigModel, { MixConfig } from "../models/MixConfig";
import { Bus } from "../Bus";

export default class MixConfigObserver implements IObserver {
	event: string = "mix";
	readonly emotis: string[] = [
		"0️⃣",
		"1️⃣",
		"2️⃣",
		"3️⃣",
		"4️⃣",
		"5️⃣",
		"6️⃣",
		"7️⃣",
		"8️⃣",
		"9️⃣",
		"🔟",
		"😀",
		"😁",
		"😂",
		"🤣",
		"😃",
		"😄",
		"😅",
		"😆",
		"😉",
		"😊",
		"😋",
		"😎",
		"😍",
		"😘",
		"😗",
		"😙",
		"😚",
		"🙂",
		"🤗",
	];

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

	static getChannelsById(
		serverChannels: Collection<string, GuildChannel>,
		id: string
	) {
		return serverChannels.find((chanel, key) => chanel.id == id);
	}

	private channelsConfig: any = {
		logsChannel: {
			getChannels: (collection: Collection<string, GuildChannel>) => {
				return MixConfigObserver.getChannelsByTypeFromCollection(
					collection,
					"text"
				);
			},
			configMessage:
				"Escolha o canal de texto para o Prata I aqui poder mandar os logs dos mix: ",
		},
		waitingChannel: {
			getChannels: MixConfigObserver.getChannelsByTypeFromCollection,
			configMessage:
				"Escolha o canal de voz onde os bots (players) irão aguardar o mix: ",
		},
		teamOneChannel: {
			getChannels: MixConfigObserver.getChannelsByTypeFromCollection,
			configMessage: "Escolha o canal para o time 1: ",
		},
		teamTwoChannel: {
			getChannels: MixConfigObserver.getChannelsByTypeFromCollection,
			configMessage: "Escolha o canal para o time 2: ",
		},
	};

	async callback(eventMessage: IEventMessage): Promise<any> {
		const serverId = eventMessage.message.guild?.id;
		let mixConfigModel = await MixConfigModel.findOne();

		const channelLog = eventMessage.message.channel;
		const serverChannels = eventMessage.message.guild?.channels.cache;

		if (!mixConfigModel) {
			mixConfigModel = new MixConfigModel({
				guildId: serverId,
			});

			await mixConfigModel.save();
		}

		for (let channel in this.channels) {
			if (serverChannels) {
				if (mixConfigModel[channel]) {
					this.channels[channel] = MixConfigObserver.getChannelsById(
						serverChannels,
						mixConfigModel[channel]
					);
				}

				if (!this.channels[channel]) {
					const newChannel = await this.sendConfig(
						channel,
						channelLog as TextChannel,
						serverChannels
					);

					mixConfigModel[channel] = newChannel?.id;
					await mixConfigModel.save();
					this.channels[channel] = newChannel;
				}
			}
		}

		const mixConfig = new MixConfig(
			this.channels.logsChannel as TextChannel,
			this.channels.waitingChannel as VoiceChannel,
			this.channels.teamOneChannel as VoiceChannel,
			this.channels.teamTwoChannel as VoiceChannel
		);

		const mixObserver = new MixObserver(mixConfig);
		const endMixObserver = new EndMixObserver(mixConfig);

		discordApplication.bus.register(mixObserver);
		discordApplication.bus.register(endMixObserver);

		discordApplication.bus.remove(this);
        discordApplication.bus.notify("mix", eventMessage);
	}

	private async sendConfig(
		channel: string,
		channelLog: TextChannel,
		serverChannels: Collection<string, GuildChannel>
	): Promise<GuildChannel> {
		const channelConfig = this.channelsConfig[channel];

		const channels = channelConfig
			.getChannels(serverChannels)
			.map((value: GuildChannel) => value);

		const configMessage = channelConfig.configMessage;

		const channelsOptions: string = channels.reduce(
			(acc: string, value: GuildChannel, index: number) => {
				return (acc += `\n${this.emotis[index]} - ${value.name}`);
			},
			configMessage + "\n"
		);

		const message = await channelLog.send(`
            \`\`\` ${channelsOptions} \`\`\`
        `);

		for (let i = 0; i < channels.length; i++) {
			await message.react(this.emotis[i]);
		}

		const collectedReaction = await message.awaitReactions(
			(reaction, user) => {
				return this.emotis.indexOf(reaction.emoji.name) != -1;
			},
			{ max: 1 }
		);

		const reaction = collectedReaction.first();

		const index = this.emotis.indexOf(reaction?.emoji.name || "");

		message.delete();

		return channels[index];
	}
}
