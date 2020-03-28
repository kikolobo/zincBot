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

    // Tomar args
    let args = msg.content.split(" ");

    if (args.length < 2 || args[1] == '--help') {
      msg.channel.sendMessage('Estos son los roles disponibles: \n'+
        allowedString +
        '\nusa !role `<rol>` para unirte.')

      return
    }

    // Asignar Rol
    let role = msg.guild.roles.find("name", args[1].toLowerCase());

    if (!role || role === null) {
      msg.channel.sendMessage('No se pudo encontrar el rol, intenta de nuevo.')
      return
    }

    if (allowedRoles.indexOf(role.name) === -1) {
      msg.channel.sendMessage('No tienes permitido unirte a este grupo. \nPara obtener una lista de roles usa: `!role --help`')
      return
    }

    msg.member.addRole(role).catch(console.error);
    msg.channel.sendMessage('Has sido agregado a: ' + role.name)

    return
  }
})

Client.on("guildMemberAdd", member => {
    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );

    member.guild.defaultChannel.sendMessage(`Bienvenido "${member.user.username}"! \n Asegúrate de escoger tu rolc con "!role" y el nombre del rol \n\nReglas: \n0.- Por favor NO SPAM - NO FLOODS \n1.- Busca el canal más adecuado para postear. \n2.- No postear avances de otros proyectos mas que en el canal de #noticias-de-otros-proyectos \n3.- Si tienes una idea para un proyecto la discutimos en #posibles-proyectos \n4.- Para todo lo demás… Esta #todo-lo-demas :)` );
})

Client.on('ready', () => {
  Client.user.setGame('Usa !role --help')
  console.log(`Ready to set roles in ${Client.channels.size} channels on ${Client.guilds.size} servers, for a total of ${Client.users.size} users.`)
})

Client.on('error', e => { console.error(e) })

Client.login(botToken)
