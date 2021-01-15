import { GuildMember } from "discord.js";
import IEventMessage from "../interfaces/IEventMessage";
import { IObserver } from "../interfaces/IObserver";
import MixConfig from "../models/MixConfig";

export default class PingObserver implements IObserver {

    private mixConfig: MixConfig;

    constructor (mixConfig: MixConfig) {
        this.mixConfig = mixConfig;
    }

    event: string = "endmix";
    async callback(eventMessage: IEventMessage): Promise<any> {
        this.mixConfig.teamOneChannel.members.map( (member: GuildMember) => {
            member.voice.setChannel(this.mixConfig.waitingChannel)
        })
        this.mixConfig.teamTwoChannel.members.map( (member: GuildMember) => {
            member.voice.setChannel(this.mixConfig.waitingChannel)
        })
    }
}