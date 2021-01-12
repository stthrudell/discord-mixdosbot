import { GuildMember } from "discord.js";

export class Mix {
    
    public readonly allMaps: string[] = ['Mirage', 'Inferno', 'Cache', 'Overpass', 'Train', 'Vertigo'];

    private players: GuildMember[];
    private teamOne: GuildMember[];
    private teamTwo: GuildMember[];
    private maps: string[];
    private md3: boolean;

    constructor(players?: GuildMember[], md3?: boolean) {
        this.players = players || [];
        this.teamOne = [];
        this.teamTwo = [];
        this.maps = [];
        this.md3 = md3 || false;
    }

    public addPlayer (player: GuildMember) {
        this.players.push(player);
    }

    public removePlayer (player: GuildMember) {
        this.players = this.players.filter(v => v != player);
    }   

    public createTeams () {
        this.players = this.players.sort(() => Math.random() - 0.5);
        this.teamOne = this.players.slice(0, this.players.length / 2);
        this.teamTwo = this.players.slice((this.players.length / 2) + 1, this.players.length);
    }

    public selectMaps(maps: string[]) {
        this.maps = maps;
    }
    
}