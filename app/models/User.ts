import { database } from "../database";

export interface UserInterface {
	discordId: string;
	steamId: string;
}

export const UserSchema = new database.Schema({
	discordId: String,
	steamId: String,
});

const User = database.model("User", UserSchema);

export default User;
