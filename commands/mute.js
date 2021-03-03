const discord = require("discord.js");

module.exports.run = async (client, message, args) => {

    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Je Hebt Geen Perms Om Dit Te Doen");
 
    if (!args[0]) return message.reply("Mention an user.");
 
    if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("Contact iiLoadingDutch. No perms.");
 
    var mutePerson = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    if (mutePerson.id === message.author.id) return message.reply("Cant mute yourself");

 
    if (!mutePerson) return message.reply("Can't find that user");
 
    if (mutePerson.hasPermission("ADMINISTRATOR")) return message.reply("Sorry, you can't mute this person");
 
    var muteRole = message.guild.roles.cache.find(role => role.name == "muted");

    var noMuteRole = new discord.MessageEmbed()
    .setTitle("Oops... :x:")
    .setColor("RED")
    .setDescription("Currently, there is no mute role. Make sure the role is called `muted`")
    .setFooter('©techcode', 'https://media.discordapp.net/attachments/772774838342516756/772912401984389150/SPOILER_TechCode_Logo.jpg');

    if (!muteRole) return message.channel.send(noMuteRole)

    
    mutePerson.roles.add(muteRole.id);
    message.channel.send(`${mutePerson} is muted`);

    


}


module.exports.help = {

    name: "mute",
    description: "Mute someone",
    category: "moderation"

}