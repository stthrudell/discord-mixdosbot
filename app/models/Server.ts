require('dotenv');
import { GuildMember, TextChannel, VoiceChannel } from "discord.js";
import Rcon from 'rcon-srcds';
import fs from 'fs';

export default class Server {
    
    private rcon: Rcon | undefined;
    private commands_exec: string = '';

    constructor() {
        if(process.env.SV_ENABLE && process.env.SV_HOST && process.env.SV_PORT) {       
            this.rcon = new Rcon({ host: process.env.SV_HOST, port: Number(process.env.SV_PORT) })
            
        }
    }
    
    public async exec(command: string)  {
        
        const exec = await this.save_exec()
        console.log(exec)
        console.log(this.commands_exec)
        console.log('mudando de mapa')

        if(!this.rcon?.authenticated) {
            this.rcon?.authenticate(process.env.SV_RCON_PASSWORD || "")
            .then(() => {
                this.rcon?.execute(command)
            })
            .catch( (err) => {
                console.error(err)
            });            
        } else {
            this.rcon?.execute(command)
        }     
    }

    // public async exec(action: string, command: string = '') {
    //     return this.rcon?.execute(action + ' ' + command);
    // }

    public async changeLevel(map: string) {
        return this.rcon?.execute('changelevel ' + map);
    }

    public async defineCT(players: GuildMember[]) {  
        this.write_exec('mp_teamname_1 "Time BOT#' + players[0].displayName + '"')
    }

    public async defineTR(players: GuildMember[]) {
        this.write_exec('mp_teamname_2 "Time BOT#' + players[0].displayName + '"')
    }

    private write_exec(command: string) {
        this.commands_exec += '\n'+command
    }

    private async save_exec() {
        fs.writeFile(process.env.SV_EXEC_CFG || '', this.commands_exec, function(err){
            if(err){
              return console.log('erro', err)
            }
            console.log('Arquivo Criado');
            return true;
        });
    }
}

