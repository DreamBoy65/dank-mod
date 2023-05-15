const {
  Client,
  CustomStatus,
  WebhookClient,
  Collection,
} = require("discord.js-selfbot-v13");
const config = require("./config.js");
const client = new Client({
  checkUpdate: false,
});

let isOkay = true;

client.on("ready", async () => {
  console.log(`${client.user.username} is ready!`);
  console.log("starting auto bot....");

  await setupBot();
});

client.on("messageCreate", async (msg) => {
  if (msg.author.id !== config.dankId) return;
  if (msg.interaction?.user?.id !== client.user.id) return;
  if (!msg.components.length > 0) return;
  if (!msg.interaction.commandName.includes("shop sell all")) return;
  
  let id = msg.components[0].components[1].customId;

  await msg.clickButton();
  console.log("Clicked sell button!");
  /* if (
    msg.content.includes("verify") &&
    msg.content.includes(client.user.username)
  ) {
    isOkay = false;
  }*/
});

async function setupBot() {
  let channel = client.channels.cache.get(config.channel);
  const send = async (msg) => await channel.sendSlash(config.dankId, msg);
  const log = (msg) => console.log(msg);

  for (let i = 0; i < Infinity; i++) {
    if (!isOkay) return;

    await send("beg");
    log("sent beg.");

    await sleep(5);

    await send("dig");
    log("sent dig.");

    await sleep(5);

    await send("fish");
    log("sent fish.");

    await sleep(5);

    await send("shop sell all");
    log("sent sell all");

    await sleep(30);
  }
}

function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

client.login(config.token);
