const discord = require("discord.js");

module.exports.run = async (client, message, args) => {



    if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply("Je Hebt geen Perms Op Iemand Te Bannen");

    if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.reply("I can't ban. Please mention iiLoadingDutch.");

    if (!args[0]) return message.reply("Tag Iemand Die U Wilt Bannen");

    if (!args[1]) return message.reply("Geef Een Reden Op");

    var banUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    if (banUser.id === message.author.id) return message.reply("Je Kan Je Zelf Niet Bannen");


    var reason = args.slice(1).join(" ");

    if (!banUser) return message.reply("That user isn't real...");

    var embed = new discord.MessageEmbed()
        .setColor("#ff0000")
        .setThumbnail(banUser.user.displayAvatarURL)
        .setFooter(message.member.displayName, message.author.displayAvatarURL)
        .setTimestamp()
        .setDescription(`** User:** ${banUser} (${banUser.id})
        **Responsible Supervisor:** ${message.author}
        **Reason: ** ${reason}`);

    var embedPrompt = new discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor("Cancel after 30 seconds.")
        .setDescription(`Do you want to ban ${banUser}?`);


    message.channel.send(embedPrompt).then(async msg => {

        var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);


        // We kijken dat het de gebruiker is die het als eerste heeft uitgevoerd.
        // message.channel.awaitMessages(m => m.author.id == message.author.id,
        //     { max: 1, time: 30000 }).then(collected => {

        //         if (collected.first().content.toLowerCase() == 'yes') {
        //             message.reply('Kick speler.');
        //         }
        //         else
        //             message.reply('Geanuleerd');

        //     }).catch(() => {
        //         message.reply('Geen antwoord na 30 sec, geanuleerd.');
        //     });


        if (emoji === "✅") {

            msg.delete();

            
            banUser.ban({ reason: reason }).catch(err => {
                if (err) return console.log(err);
            });

            message.reply(embed);

            var modlog = message.member.guild.channels.cache.find(channel => channel.name === "moderation-logs");


            var noLogChannel = new discord.MessageEmbed()
            .setTitle("Oops... :x:")
            .setColor("RED")
            .setDescription("Currently, there is no mod log channel. Make sure the channel is called `moderation-logs`")
            .setFooter('©techcode', 'https://media.discordapp.net/attachments/772774838342516756/772912401984389150/SPOILER_TechCode_Logo.jpg');

            var cantdm = new discord.MessageEmbed()
            .setTitle("Oops... :x:")
            .setColor("RED")
            .setDescription("I cant dm the banned user..")
            .setFooter('©techcode', 'https://media.discordapp.net/attachments/772774838342516756/772912401984389150/SPOILER_TechCode_Logo.jpg');

            if (!modlog) return message.channel.send(noLogChannel);
            modlog.send(embed);
            
            message.banUser.send(embed).then(() => {
                return;
            }).catch(() => {

                message.channel.send(cantdm);
            });


        } else if (emoji === "❌") {

            msg.delete();

            message.reply("No ban?").then(m => m.delete(5000));

        }

    });
}

// Emojis aan teksten kopellen.
async function promptMessage(message, author, time, reactions) {
// We gaan eerst de tijd * 1000 doen zodat we seconden uitkomen.
time *= 1000;

// We gaan ieder meegegeven reactie onder de reactie plaatsen.
for (const reaction of reactions) {
    await message.react(reaction);
}

// Als de emoji de juiste emoji is die men heeft opgegeven en als ook de auteur die dit heeft aangemaakt er op klikt
// dan kunnen we een bericht terug sturen.
const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;

// We kijken als de reactie juist is, dus met die filter en ook het aantal keren en binnen de tijd.
// Dan kunnen we bericht terug sturen met dat icoontje dat is aangeduid.
return message.awaitReactions(filter, { max: 1, time: time }).then(collected => collected.first() && collected.first().emoji.name);
}








module.exports.help = {

    name: "verban",
    description: "Ban someone",
    category: "moderation"

}