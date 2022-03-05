import { TextChannel, VoiceChannel } from "discord.js";
import mongoose from "mongoose";
import { Model, DataTypes } from "sequelize";
import { database } from "../database";

export class MixConfig {
	public logsChannel: TextChannel;
	public waitingChannel: VoiceChannel;
	public teamOneChannel: VoiceChannel;
	public teamTwoChannel: VoiceChannel;

	constructor(
		logsChannel: TextChannel,
		waitingChannel: VoiceChannel,
		teamOneChannel: VoiceChannel,
		teamTwoChannel: VoiceChannel
	) {
		this.logsChannel = logsChannel;
		this.waitingChannel = waitingChannel;
		this.teamOneChannel = teamOneChannel;
		this.teamTwoChannel = teamTwoChannel;
	}
}

export interface MixConfigInterface {
	logsChannel: TextChannel;
	waitingChannel: VoiceChannel;
	teamOneChannel: VoiceChannel;
	teamTwoChannel: VoiceChannel;
}

export const MixConfigModelSchema = new database.Schema({
	guildId: String,
	logsChannel: String,
	waitingChannel: String,
	teamOneChannel: String,
	teamTwoChannel: String,
});

const MixConfigModel = database.model("MixConfig", MixConfigModelSchema);

export default MixConfigModel;