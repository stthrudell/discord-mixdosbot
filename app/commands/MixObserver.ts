import { Message } from "discord.js";
import IEventMessage from "../interfaces/IEventMessage";
import { IObserver } from "../interfaces/IObserver";
import { Mix } from "../models/Mix";
import MixConfig from "../models/MixConfig";

enum Status {
    WAITING
}

export default class MixObserver implements IObserver {
    event: string = 'mix';

    private mix: Mix = new Mix();
    private status: Status = Status.WAITING;
    private mapChosingMessage?: Message;
    private countMessage?: Message;
    private mixConfig: MixConfig;

    constructor (mixConfig: MixConfig) {
        this.mixConfig = mixConfig;
        // mixConfig.onWatingChannelEnter = (user) => {
        //     mix.addPlayer(user)
        // }
    }

    async callback(eventMessage: IEventMessage): Promise<any> {
        const {message} = eventMessage;

        message.channel.send("Bot Configurado!");
        return;
        
    }

}
