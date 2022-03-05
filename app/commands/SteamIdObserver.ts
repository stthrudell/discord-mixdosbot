import IEventMessage from "../interfaces/IEventMessage";
import { IObserver } from "../interfaces/IObserver";
import User from "../models/User";

export default class PingObserver implements IObserver {
    event: string = "steamid";
    async callback(eventMessage: IEventMessage): Promise<any> {

        const userId = eventMessage.message.author.id
        const userAuthor = eventMessage.message.author.toString()

        const messageSplited = eventMessage.message.content.replace("!", "").split(" ");
        const steamId = messageSplited.slice(1)[0];
        
        if(!steamId){
            const user = await User.findOne({
				discordId: userId,
			});

            if(user) {
                eventMessage.message.channel.send(`${userAuthor} seu steam id é ${user?.steamId}`);
            } else {
                eventMessage.message.channel.send(`${userAuthor} você não tem o SteaID 64 Cadastrado. Para cadastrar, digite !steamid xxxxxxxxxxxxxxxxx`);
            }

        } else if(steamId.length != 17) {
            eventMessage.message.channel.send(`${userAuthor} SteamID no formato inválido, você deve cadastrar a SteamID 64!`);
        } else {

            const user = await User.findOne({
                discordId: userId,
            });

            if(user) {
                eventMessage.message.channel.send(`${userAuthor} esta steam id já esta cadastrada.`);
            } else {
                const user = await User.create({
                    discordId: userId,
                    steamId: steamId
                })
                await user.save();
                
                eventMessage.message.channel.send(`${userAuthor} SteamID cadastrado com sucesso!`);
            }            
        }

    }
}
