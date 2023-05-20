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
require("@colors/colors");
const {
  readFile,
  writeFile,
  readdir,
  lstat,
  access,
  constants,
} = require("fs/promises");
let data = {
  commandsUsed: 0,
  cashEarned: 0,
  zoo: {},
};

client.on("ready", async () => {
  console.log(`${client.user.username} is ready!`);
  console.log("starting auto bot....".blue);

  let Data = await readFile(config.data).catch((e) => null);

  if (!Data) {
    await writeFile(config.data, JSON.stringify(data));
  } else if (Data) {
    data = JSON.parse(Data || data);
  }

  console.log("Loaded data..".blue);

  await setupBot();
});

client.on("messageCreate", async (msg) => {
  if (msg.author.id !== config.dankId && msg.channel.type !== "DM") return;

  if (
    msg.embeds.length > 0 &&
    msg.embeds[0].description &&
    msg.embeds[0].description.includes("don't have")
  ) {
    if (msg.embeds[0].description.includes("shovel")) {
      /*
     await msg.channel.sendSlash(config.dankId, "shop buy shovel");
      console.log("send buy shovel".yellow);
      */
    }
  }

  if (
    msg.embeds.length > 0 &&
    msg.embeds[0].description &&
    msg.embeds[0].description.includes("⏣") &&
    !msg.embeds[0].description.includes("sell")
  ) {
    let cash = msg.embeds[0].description.split("⏣")[1].trim().match(/\d+/g);
    console.log(cash);

    data["cashEarned"] += Number(cash.join(""));
  }

  if (
    msg.embeds.length > 0 &&
    msg.embeds[0].description &&
    msg.embeds[0].description.includes("brought back")
  ) {
    let ms = msg.embeds[0].description.split("**")[1].split(">")[1];

    if (!ms) return;
    ms = ms.replace(/ /g, "_");
    data["zoo"][msg] += 1;
  }

  if (
    msg.components.length > 0 &&
    msg.interaction?.commandName?.includes("shop sell all")
  ) {
    let id = msg.components[0].components[1].customId;
    await msg.clickButton(id);
    console.log("Clicked sell button!");
  }

  await save();
});

async function setupBot() {
  let channel = await client.users.cache.get(config.dankId).createDM();

  const send = async (msg) =>
    await channel.sendSlash(config.dankId, msg).catch((e) => null);
  const log = (msg) => console.log(msg.yellow);

  for (let i = 0; i < Infinity; i++) {
    await send("beg");
    log("sent beg.");
    data["commandsUsed"] += 1;

    await sleep(5);

    await send("dig");
    log("sent dig.");
    data["commandsUsed"] += 1;

    await sleep(5);

    await send("fish");
    log("sent fish.");
    data["commandsUsed"] += 1;

    await sleep(5);

    await send("hunt");
    log("sent hunt.");
    data["commandsUsed"] += 1;

    await sleep(5);

    await send("shop sell all");
    log("sent sell all");
    data["commandsUsed"] += 1;

    await save();
    await sleep(30);
  }
}

async function save() {
  return await writeFile(config.data, JSON.stringify(data));
}

function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

client.login(config.token);
