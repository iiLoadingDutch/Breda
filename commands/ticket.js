const discord = require("discord.js");

module.exports.run = async (client, message, args) => {

// ID van de categorie van de tickets.
var categoryId = '816354973826678814';

var noCategory = new discord.MessageEmbed()
.setTitle("Oeps... :x:")
.setColor("RED")
.setDescription("Er is nog geen ticket categorie! Zorg dat hij goed in het script staat!")


if (!categoryId) return message.channel.send(noCategory);
 
var userName = message.author.username;
var userDiscriminator = message.author.discriminator;

var alreadyTicket = false;

  message.guild.channels.cache.forEach(channel => {

      if(channel.name == userName.toLowerCase() + "-" + userDiscriminator) {
          alreadyTicket = true;

          message.reply("U Heeft al een ticket!");

          return;
      }
    
  });


if(alreadyTicket) return;

message.channel.send(":white_check_mark: U Ticket Is Gemaakt");

message.guild.channels.create(userName.toLowerCase() + "-" + userDiscriminator, {type: 'text'}).then(
  (createdChannel) => {
      createdChannel.setParent(categoryId).then(

          (settedParent) => {

              settedParent.updateOverwrite(message.guild.roles.cache.find(x => x.name === '@everyone'),{
                  SEND_MESSAGES: false,
                  VIEW_CHANNEL: false
              }); 
              settedParent.updateOverwrite(message.author.id,{
                  CREATE_INSTANT_INVITE:false,
                  READ_MESSAGES: false,
                  ATTACH_FILES: true,
                  CONNECT: true,
                  ADD_REACTIONS: true,
                  SEND_MESSAGES: true,
                  VIEW_CHANNEL: true
              }); 

              var embedParent = new discord.MessageEmbed()
              .setTitle("Ticket " + message.channel.name)
              .setColor("#005eff")
              .setDescription("Hallo! Stuur hier je vraag. We zullen je snel helpen!")
              .setFooter("Ticket geopend");

              settedParent.send(embedParent);

          }
      ).catch(err => {
          message.channel.send("Ticket Sucsesvol Aangemaakt");
          console.log(err);
      });
  }


).catch(err => {
  message.channel.send("Er ging iets fout...");
  console.log(err);
});
 

}


module.exports.help = {

    name: "nieuw",
    description: "open een ticket",
    category: "tickets"

}