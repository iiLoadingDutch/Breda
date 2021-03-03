const discord = require("discord.js");
const botConfig = require("./botconfig.json");
 
const client = new discord.Client();
const fs = require('fs');
client.commands = new discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if (err) console.log(err);

    var jsFiles = files.filter(f => f.split(".").pop() === "js");

    if (jsFiles.length <= 0) {
        console.log("No files founded");
        return;
    }

    jsFiles.forEach((f, i) => {

        var fileGet = require (`./commands/${f}`);
        console.log(`File ${f} loaded`);

       client.commands.set(fileGet.help.name, fileGet);

    })

});
 
client.on("ready", async () => {
 
    console.log(`${client.user.username} is online.`);
 
    client.user.setActivity("Zuid-Limburg", { type: "PLAYING" });
 
});
 
 
client.on("message", async message => {
 
    if(message.author.bot) return;
 
    if(message.channel.type === "dm") return;

        var prefix = botConfig.prefix;
    // zet hier al je triggers, dus bijvoorbeeld !hallo :smile:

    if (message.content === `${prefix}hallo`) {
 
        return message.channel.send("Hallo Hoe Gaat Het?");

    }

 if (message.content === `${prefix}claim`) {
 
        return message.channel.send(`U wordt verder geholpen door ${message.author}`);

    }

 if (message.content === `${prefix}help`) {

var helpembed = new discord.MessageEmbed()
  .setTitle('Help')
  .setDescription('-kick\n-ban\n-mute\n-unmute\n-nieuw\n-sluit\n-hallo')
  .setColor('BLUE')
 
        return message.channel.send(helpembed);

    }

 

 

    if(!message.content.startsWith(prefix)) return;


    var messageArray = message.content.split(" ");
 
    var command = messageArray[0];

    var arguments = messageArray.slice(1);

    var commands = client.commands.get(command.slice(prefix.length));

if(commands) commands.run(client, message, arguments);
 

});



client.login(process.env.token);