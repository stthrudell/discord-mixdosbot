import { TextChannel, VoiceChannel } from "discord.js";

export default class MixConfig {
    public logsChannel: TextChannel;
    public waitingChannel: VoiceChannel;
    public teamOneChannel: VoiceChannel;
    public teamTwoChannel: VoiceChannel;

    // public onWatingChannelEnter: Function;
    // public onWatingChannelLeave: Function;

    constructor(
        logsChannel: TextChannel,
        waitingChannel: VoiceChannel,
        teamOneChannel: VoiceChannel,
        teamTwoChannel: VoiceChannel
    ) {
        this. logsChannel = logsChannel;
        this. waitingChannel = waitingChannel;
        this. teamOneChannel = teamOneChannel;
        this. teamTwoChannel = teamTwoChannel;
        // // Main
        // const main 

        // on.('', () => {
        //     // if
        //         this.onWatingChannelEnter(user);
        //         this.onWatingChannelLeave(user);
        // });
    }
}
