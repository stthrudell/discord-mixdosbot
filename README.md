# Bot gerador de Mix (CS:GO) para o discord.


  - Gera os times aleatoreamente
  - Separa os player's no discord para as salas configuradas no bot
  - Muda o mapa no servidor do csgo.
  - Restring os times dentro do servidor do csgo de acordo com o time gerado pelo bot

### Instalação

Este bot para o discord requer [Node.js](https://nodejs.org/) v14+ para rodar.

Instale as dependências e devDependencias e rode o servidor.

```sh
$ clone este repositório
$ npm install ou yarn install
$ npm start ou yarn start
```

For production environments...

```sh
$ TOKEN='token do seu bot'
```

### Todo's

 - Salvar os canais do mix no BD
 - Mudar o mapa do servidor de acordo com o gerado no mix
 - Verificar se todos tem SteamID 64 antes de gerar o mix
 - Restringir os times no servidor de acordo com o gerado no mix com base no SteamID 64
 - Passar todas as variáveis necessárias para o .env (HOST DO SERVER, RCON PASSWORD etc)

Licença
----

MIT


**Free Software, Hell Yeah!**