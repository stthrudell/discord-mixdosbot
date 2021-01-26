import { GuildMember } from "discord.js";

export class Mix {
    
    public readonly allMaps: string[] = ['Mirage', 'Inferno', 'Cache', 'Overpass', 'Train', 'Vertigo'];

    public players: GuildMember[];
    public teamOne: GuildMember[];
    public teamTwo: GuildMember[];
    public maps: string[];
    public md3: boolean;

    constructor(players?: GuildMember[], md3?: boolean) {
        this.players = players || [];
        this.teamOne = [];
        this.teamTwo = [];
        this.maps = [];
        this.md3 = md3 || false;
    }

    public clearPlayers () {
        this.players = [];
    }

    public addPlayer (player: GuildMember) {
        console.log(this.players.includes(player))

        if(!this.players.includes(player))
            this.players.push(player);
    }

    public removePlayer (player: GuildMember) {
        this.players = this.players.filter(v => v != player);
    }   

    public async createTeams() {
        this.players = this.players.sort(() => Math.random() - 0.5);
        this.teamOne = this.players.slice(0, 5);
        this.teamTwo = this.players.slice(5 , 10);
        return [this.teamOne, this.teamTwo];
    }

    public selectedMaps(maps: string[]) {
        this.maps = maps;
    }    

    public end() {
        
    }
    
}