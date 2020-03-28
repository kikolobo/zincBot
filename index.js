let Discord = require('discord.js')
let Client = new Discord.Client()
let dotenv = require('dotenv');

// Grabs the BOT_TOKEN from .env and stores in on the `process.env`
dotenv.load()

let allowedRoles = process.env.ALLOWED_ROLES.split(',')
let botToken = process.env.BOT_TOKEN

// allowed strings
let allowedString = ''
allowedRoles.forEach((role) => {
  allowedString = allowedString.concat('- ' + role + '\n')
})

Client.on('message', msg => {
  // Set prefix
  let prefix = "!"

  if (!msg.content.startsWith(prefix)
    || msg.author.bot
  ) return

  if (msg.content.startsWith(prefix + 'role')) {

    // Get args
    let args = msg.content.split(" ");

    if (args.length < 2 || args[1] == '--help') {
      msg.channel.sendMessage('Estos son los roles a los que te puedes unir: \n'+
        allowedString +
        '\nusa "!role `<nombre del rol>` para unirte.')

      return
    }

    // Get the role
    let role = msg.guild.roles.find("name", args[1].toLowerCase());

    if (!role || role === null) {
      msg.channel.sendMessage('No se pudo encontrar el rol.')
      return
    }

    if (allowedRoles.indexOf(role.name) === -1) {
      msg.channel.sendMessage('Doesn\'t look like you\'re allowed to join that group. \nFor a list of allowed roles type `!role --help`')
      return
    }

    msg.member.addRole(role).catch(console.error);
    msg.channel.sendMessage('You\'ve been added to: ' + role.name)

    return
  }
})

Client.on("guildMemberAdd", member => {
    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );

    member.guild.defaultChannel.sendMessage(`Bienvenido "${member.user.username}"! \n Asignate un rol con "!role" seguido del rol.`);
})

Client.on('ready', () => {
  Client.user.setGame('type !role --help')
  console.log(`Ready to set roles in ${Client.channels.size} channels on ${Client.guilds.size} servers, for a total of ${Client.users.size} users.`)
})

Client.on('error', e => { console.error(e) })

Client.login(botToken)
