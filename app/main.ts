import { Discord, On, Client } from "@typeit/discord";

@Discord()
abstract class AppDiscord {

  @On("message")
  private onMessage() {
    console.log({ arguments });
  }

}

async function start() {
  const client = new Client({
    classes: [
      AppDiscord
    ],
    silent: false,
    variablesChar: ":"
  });

  await client.login("Nzk2ODYzMzExNzU1ODcwMjM4.X_eGyg.EAmwxPo5C235JvTAi8PhmyT5mpc");
}

start();
_mo