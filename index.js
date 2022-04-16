let Discord = require("discord.js");
let bot = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
let fs = require("fs");
let words = require(__dirname + "/db/words.json");
let allwords = require(__dirname + "/db/allwords.json");
let db = require(__dirname + "/db/db.json");
let lb = require(__dirname + "/db/lb.json");

bot.once("ready", async () => {
  console.log(`${bot.user.username} is online`);
  bot.user.setActivity("wordle help");
});

bot.on("messageCreate", async msg => {
  if (msg.author.bot) return;

  if (msg.author.id == "699010127977513081") {
    if (msg.content.toLowerCase() == "wordle staff") {
      let one = new Discord.MessageEmbed()
        .setTitle("Wordle Support Server")
        .setDescription("Welcome to the official support server for the <@940698842393878578> bot! 👋 In this channel you can find information about the bot, how to request support, and any other information we find necessary to share.");
      let two = new Discord.MessageEmbed()
        .setTitle("Rules")
        .setDescription("This server has no \"rules\" so to speak, so we'll just go based off of the 4 default Discord rules:\n<:spacer:962721216991469589>**1.** Treat everyone with respect. Absolutely no harassment, witch hunting, sexism, racism, or hate speech will be tolerated.\n<:spacer:962721216991469589>**2.** No spam or self-promotion (server invites, advertisements, etc) without permission from a staff member. This includes DMing fellow members.\n<:spacer:962721216991469589>**3.** No NSFW or obscene content. This includes text, images, or links featuring nudity, sex, hard violence, or other graphically disturbing content.\n<:spacer:962721216991469589>**4.** If you see something against the rules or something that makes you feel unsafe, let staff know. We want this server to be a welcoming space!");
      let three = new Discord.MessageEmbed()
        .setTitle("Support")
        .setDescription("This server was mainly made to give support to users who requested it. To do so, head over to the <#941120986793783356> channel and ping <@&962710756879659028>. Once a staff member is available, they will assist you with your questions and/or troubles.");
      let four = new Discord.MessageEmbed()
        .setTitle("Links")
        .setDescription("We only have three main links:\n<:spacer:962721216991469589>**Server invite:** https://discord.gg/fp6GkqPum6\n<:spacer:962721216991469589>**Bot invite:** https://discord.com/api/oauth2/authorize?client_id=940698842393878578&permissions=274878024704&scope=bot\n<:spacer:962721216991469589>**Top.gg page:** https://top.gg/bot/940698842393878578");
      msg.channel.send({ embeds: [one, two, three, four] });
    };
  };

  if (msg.content.toLowerCase() == "wordle help") {
    let e = new Discord.MessageEmbed()
      .addField("wordle help", "Pulls up this same list of commands.")
      .addField("wordle rules", "Easy to understand instructions to help you play.")
      .addField("new wordle", "Starts a new wordle game.")
      .addField("guess {your guess}", "Enters your guess into an ongoing game.")
      .addField("quit wordle", "Stops the current wordle game.")
      .addField("wordle difficulty", "Alternates the wordle difficulty between **easy** and **hard**.")
      .addField("wordle points", "Shows your total wordle points.")
      .addField("wordle top", "Shows the top three wordle players in your server.");
    msg.channel.send({ embeds: [e] });
  };

  if (msg.content.toLowerCase() == "wordle rules") {
    let e = new Discord.MessageEmbed().setDescription("Wordle is a simple 5-letter word guessing game, where players guess words to unlock clues in order to aid them in discovering the final word.\n\nTo play wordle, begin by typing **`new wordle`** to start a new round with a randomly generated word. Then, begin guessing 5-letter words with **`guess {your guess}`**. Once you begin guessing, you'll notice multicolored boxes containing the letters of your guess appearing. These colors can indicate different clues to help you narrow down the final word.\n\n<:correct:953045330587430962> - A green colored box means that the letter contained within it is a letter found in the final word, AND it is in its correct spot in the final word.\n<:present:953045330264481854> - A yellow colored box means that the letter contained within it is a letter found in the final word, BUT it is in the wrong spot in the final word.\n<:absent:953045330474180669> - A gray colored box means that the letter contained within it is a letter NOT found in the final word.\n\nThe rules of the game are simple. You get unlimited attempts at guessing the final word, but once you surpass 10 tries, you won't be able to claim any points from guessing the correct word. Additionally, you may choose to give up using the **`quit wordle`** command, but only once least 6 valid guesses have been made for that round. You may view your wordle points via the **`wordle points`** command.\n\nIf you have any questions, join the official wordle [support server](https://discord.gg/fp6GkqPum6).");
    msg.channel.send({ embeds: [e] });
  };

  if (msg.content.toLowerCase() == "new wordle") {
    if (JSON.stringify(db).includes(msg.guild.id) && db[msg.guild.id].g) return msg.channel.send("There is already an ongoing game. Type **`guess {your guess}`** to join the round.");
    let wordle = words[Math.floor(Math.random() * words.length)];
    db[msg.guild.id] = {
      g: true,
      w: wordle.split(""),
      gs: [],
      t: 0,
      d: db[msg.guild.id].d || "easy"
    };
    fs.writeFile("./db/db.json", JSON.stringify(db), (err) => { if (err) throw err });
    msg.channel.send("A new wordle game has started. Type **`guess {your guess}`** to start playing.");
  };

  if (msg.content.toLowerCase().startsWith("guess ")) {
    if (!JSON.stringify(db).includes(msg.guild.id) || !db[msg.guild.id].g) return msg.channel.send("There is no ongoing game. Type **`new wordle`** to start a new round.");
    let guess = msg.content.toLowerCase().replace("guess ", "");
    if (guess.length < 5) return msg.channel.send("Your guess is too short.");
    if (guess.length > 5) return msg.channel.send("Your guess is too long.");
    if (db[msg.guild.id].gs.includes(guess)) return msg.channel.send("That word has already been guessed.");
    let valid = (words.includes(guess) || allwords.includes(guess));
    if (!valid) return msg.channel.send("Your guess is not a valid word.");
    db[msg.guild.id].t++;
    db[msg.guild.id].gs.push(guess);
    if (db[msg.guild.id].w.join("") == guess) {
      if (!JSON.stringify(lb).includes(msg.author.id)) lb[msg.author.id] = 0;
      let points = 11 - db[msg.guild.id].t;
      if (points < 0) points = 0;
      msg.channel.send({
        content: `Correct! You guessed it in **${db[msg.guild.id].t}** tries. You gained ${points} points.`, files: [{
          attachment: `https://api.aakhilv.me/wordle/${db[msg.guild.id].w.join("")}/${guess}`,
          name: "wordle.png"
        }]
      });
      db[msg.guild.id].g = false;
      lb[msg.author.id] += points;
      fs.writeFile("./db/db.json", JSON.stringify(db), (err) => { if (err) throw err });
      return fs.writeFile("./db/lb.json", JSON.stringify(lb), (err) => { if (err) throw err });
    };
    msg.channel.send({
      files: [{
        attachment: `https://api.aakhilv.me/wordle/${db[msg.guild.id].w.join("")}/${guess}`,
        name: "wordle.png"
      }]
    });
    fs.writeFile("./db/db.json", JSON.stringify(db), (err) => { if (err) throw err });
  };

  if (msg.content.toLowerCase() == "quit wordle") {
    if (!JSON.stringify(db).includes(msg.guild.id) || !db[msg.guild.id].g) return msg.channel.send("There is no ongoing game. Type **`new wordle`** to start a new round.");
    if (db[msg.guild.id].t < 6) return msg.channel.send(`Guess **${6 - db[msg.guild.id].t}** more times before giving up.`);
    msg.channel.send(`Aw, you gave up... The correct word was **${db[msg.guild.id].w.join("")}**.`);
    db[msg.guild.id].g = false;
    fs.writeFile("./db/db.json", JSON.stringify(db), (err) => { if (err) throw err });
  };

  if (msg.content.toLowerCase() == "wordle points") {
    if (!JSON.stringify(lb).includes(msg.author.id)) return msg.channel.send("You have **0** points.");
    msg.channel.send(`You have **${lb[msg.author.id]}** points.`);
  };

  if (msg.content.toLowerCase() == "wordle top") {
    let m = await msg.channel.send("Loading... <a:loading:953360291511562372>");
    let top = Object.entries(lb).sort((a, b) => b[1] - a[1]);
    let count = 0, topu = 0, tope = [];
    while (count < 3) {
      if (topu > (top.length - 1)) {
        while (count < 3) {
          tope.push("No user found");
          count++;
        };
        break;
      };
      try {
        await msg.guild.members.fetch(top[topu][0]);
      } catch {
        topu++;
        continue;
      };
      tope.push(`<@!${top[topu][0]}> - ${top[topu][1]} points`);
      count++;
      topu++;
    };
    let e = new Discord.MessageEmbed().setDescription(`🥇 ${tope[0]}\n\n🥈 ${tope[1]}\n\n🥉 ${tope[2]}`);
    m.edit({ content: `Top 3 players in **${msg.guild.name}**`, embeds: [e] });
  };
});

bot.login("OTQwNjk4ODQyMzkzODc4NTc4.YgLMEQ._uxpLuZ6BsAY-f-LXwrrxrn4c3U");
