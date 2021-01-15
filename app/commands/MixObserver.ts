import { GuildMember, Message, TextChannel } from "discord.js";
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
    }

    async callback(eventMessage: IEventMessage): Promise<any> {
        const {message} = eventMessage;
        message.channel.send("Bot Configurado!");

        if(this.mixConfig.waitingChannel.members.size > 8) {
            message.channel.send("Tem que ter pelo menos 10 BOT's pra começar o mix, amigo!");
            return;
        }
        

        this.mixConfig.waitingChannel.members.map( (member: GuildMember) => {
            this.mix.addPlayer(member);
            member.voice.setChannel(this.mixConfig.teamTwoChannel)
        })

        this.confirmTeams(this.teams() as GuildMember[][], eventMessage.message.channel as TextChannel);


        console.log(this.mix.teamOne);
        console.log(this.mix.teamTwo);

        return;
        
    }

    private async confirmTeams(teams: GuildMember[][], channelLog: TextChannel,) {
        var teamsMsg: string = 'Comfirme os times para o mix...';
        var acceptedTeams: number = 0;
        var recusedTeams: number = 0;

        teams.map( (team: GuildMember[], index) => {
            teamsMsg += '\n Time ' + index;
            team.map( (player: GuildMember) => {
                teamsMsg += '\n ' + player.displayName;
            } )
        })

        const message = await channelLog.send(`
            \`\`\` ${teamsMsg} \`\`\`
        `);

        await message.react('✅');
        await message.react('❌');

        const collectedReaction = await message.awaitReactions((reaction, user) => {
            return reaction.emoji.name === '✅' || reaction.emoji.name === '❌' ;
        }, {time: 15000});

        const collector = message.createReactionCollector((reaction, user) => {
            return reaction.emoji.name === '✅' || reaction.emoji.name === '❌' ;
        }, { time: 15000 });

        collector.on('collect', r => {
            r.emoji.name == '✅' ? acceptedTeams++ : recusedTeams++;
        });

        collector.on('end', collected => {
            acceptedTeams > recusedTeams ? 'confir maps()' : this.confirmTeams(this.teams() , channelLog);
        });

    }

    teams() {
        return this.mix.createTeams();
    }

    //confirm maps()

}
