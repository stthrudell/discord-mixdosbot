import { DMChannel, GuildMember, Message, NewsChannel, TextChannel } from "discord.js";
import IEventMessage from "../interfaces/IEventMessage";
import { IObserver } from "../interfaces/IObserver";
import { Mix } from "../models/Mix";
import MixConfig from "../models/MixConfig";

enum Status {
    WAITING
}

export default class MixObserver implements IObserver {
    event: string = 'mix';

    readonly emotis: string[] = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

    private mix: Mix = new Mix();
    private status: Status = Status.WAITING;
    private mapChosingMessage?: Message;
    private countMessage?: Message;
    private teamsSorted?: GuildMember[][];
    private mapsVoted: any = [];
    private mixConfig: MixConfig;
    private channel?: TextChannel | DMChannel | NewsChannel;

    constructor (mixConfig: MixConfig) {
        this.mixConfig = mixConfig;
    }

    async callback(eventMessage: IEventMessage): Promise<any> {
        const {message} = eventMessage;
        
        this.channel = message.channel;

        if(this.mixConfig.waitingChannel.members.size <= 9) {
            message.channel.send("Tem que ter pelo menos 10 BOT's pra começar o mix, amigo!");
            return;
        }

        this.mix.clearPlayers();

        this.mixConfig.waitingChannel.members.map( (member: GuildMember) => {
            this.mix.addPlayer(member);
            //member.voice.setChannel(this.mixConfig.teamTwoChannel)
        })

        this.teamsSorted = await this.mix.createTeams()

        await this.startMix();

        return;
    }

    private async startMix() {
        var nameRandom = Math.floor(Math.random() * this.mix.players.length);

        var teamsMsg: string = `Comfirme os times para o mix (sem reclamar em ${this.mix.players[nameRandom].displayName})...`;
        var acceptedTeams: number = 0;
        var recusedTeams: number = 0;

        this.teamsSorted?.map( (team: GuildMember[], index: number) => {
            teamsMsg += '\n\n Time BOT#' + team[index].displayName;
            team.map( (player: GuildMember) => {
                teamsMsg += '\n ' + player.displayName;
            } )
        })

        const message = await this.channel?.send(`
            \`\`\` ${teamsMsg} \`\`\`
        `);

        await message?.react('✅');
        await message?.react('❌');

        const collector = message?.createReactionCollector((reaction, user) => {
            return reaction.emoji.name === '✅' || reaction.emoji.name === '❌' ;
        }, { max: 1, time: 10000 });        

        collector?.on('collect', r => {            
            console.log(r.emoji.name)
            r.emoji.name == '✅' ? acceptedTeams++ : recusedTeams++;                
            console.log('acc', acceptedTeams)
            console.log('rec', recusedTeams)
        });

        collector?.on('end', collected => {
            message?.delete()
            acceptedTeams >= recusedTeams ? this.voteMaps() : this.startMix();
        });

    }

    private async voteMaps() {

        var mapsMsg: string = 'Vote nos mapas que gostaria de jogar (Menos Dust2): \n';

        this.mix.allMaps.map((map, index) => {
            mapsMsg += '\n ' + this.emotis[index] + map;
            this.mapsVoted.push({map: map, count: 0});
        })

        const message = await this.channel?.send(`
            \`\`\` ${mapsMsg} \`\`\`
        `);

        this.mix.allMaps.map( async (map, index) => {
            await message?.react(this.emotis[index]);
        })

        // Create a reaction collector
        const filter = (reaction: { emoji: { name: string; }; }, user: any) => this.emotis.indexOf(reaction.emoji.name) != -1;
        const collector = message?.createReactionCollector(filter, { time: 15000 });
        collector?.on('collect', r => {
            let i = this.emotis.indexOf(r.emoji.name);
            this.mapsVoted[i].count++
        });
        collector?.on('end', collected => {
            message?.delete()
            this.go()
        });

    }

    private async go() {

        this.mix.teamOne.map((user: GuildMember) => {
            user.voice.setChannel(this.mixConfig.teamOneChannel);
        })

        this.mix.teamTwo.map((user: GuildMember) => {
            user.voice.setChannel(this.mixConfig.teamTwoChannel)
        })

        const mapVoted = this.mapsVoted.sort((a: { count: number; }, b: { count: number; }) => b.count - a.count)

        let msg = 'Preparem-se pro mix BOT\'s...';
        msg += '\n\n Mapa: ' + mapVoted[0].map;

        this.teamsSorted?.map( (team: GuildMember[], index: number) => {
            msg += '\n\n Time BOT#' + team[index].displayName;
            team.map( (player: GuildMember) => {
                msg += '\n ' + player.displayName;
            } )
        })
        msg += '\n\nGood luck & have fun!';

        this.channel?.send(`
            \`\`\` ${msg} \`\`\`
        `);

    }

}
