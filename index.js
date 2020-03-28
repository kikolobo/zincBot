////////////////////////////////////////////////// 
// ZINC Discord Bot *Bot CoVida* 27 y 28 de Marzo 2020
// Escrito por: @marcopaaz del team CoVida 
// Codigo Adicional @kikolobo del team CoVida
// Covida Discord: https://discord.gg/PZ99WkY
////////////////////////////////////////////////// 
let Discord = require('discord.js')
let Client = new Discord.Client()
let dotenv = require('dotenv');
var fs = require('fs');

var welcomeMessage = 'no asignado. reportar a moderador';
var roleInstructions = 'no asignado. reportar a moderador';
var roleListRaw = 'no asignado. reportar a moderador';


// Carga de archivos auxiliares
fs.readFile('welcomeMessage.txt', 'utf8', function(err, data) {
  if (err) throw err;
  welcomeMessage = data;
});

fs.readFile('roleInstructions.txt', 'utf8', function(err, data) {
  if (err) throw err;
  roleInstructions = data;
});

fs.readFile('roleList.txt', 'utf8', function(err, data) {
  if (err) throw err;
  roleListRaw = data;
});

// Carga de parametros de configuración
dotenv.load()

// Carga de parametros de configuración
let botname = process.env.BOT_NAME;
let allowedRoles = process.env.ALLOWED_ROLES.split(',');
let botToken = process.env.BOT_TOKEN;
let dalayForRoleMessage = process.env.DELAY_FOR_ROLE_MSG;
let versionString = process.env.VERSION;


// Carga los roles permitidos en una variable legible
// let allowedString = ''
// allowedRoles.forEach((role) => {
//   allowedString = allowedString.concat('  :radio_button:  ' + role + '\n')
// })


// Comenzamos a escuchr eventos
// ******************************

// Evento: Cuando llega un nuevo mensaje
Client.on('message', msg => {
  let args = msg.content.split(" ");  

  // No es para el bot o es el bot.. descartar.
  if (!msg.content.toLowerCase().startsWith(botname) || msg.author.bot) {     
    return;
  }


  // Comandos permitidos
  // ************************** >>
  if (args[1] == 'bienvenido' || args[1] == 'bienvenida' || args[1] == 'welcome' || args[1] == 'reglas' || args[1] == 'rules') {
    msg.reply(welcomeMessage);    
    setTimeout(function(){ //Esperar 1 minuto y mandarle instrucciónes para el rol
    msg.reply(roleInstructions);
  }, dalayForRoleMessage);
    return      
  }    

  if (args[1] == 'roles' || args[1] == 'rol' || args[1] == 'ayuda' || args[1] == 'help' || args[1] == '?') {
    msg.reply(roleListRaw);
    return
  }

  if (args[1] == 'hola' || args[1] == 'hello' || args[1] == 'eit' || args[1] == 'pst' || args[1] == 'ehlo')  {
    msg.reply('**¡Hola!**, Soy **zinc** :robot:  (v' + versionString + '), el bot de **CoVida!** para servirte!')
    return;
  }

  if (args[1] == 'version' || args[1] == 'ver') {
    msg.reply('version: ' + versionString);
    return
  }

  if (args[1] == 'soy') {
    var theRole = args[2].toLowerCase()
    var role = msg.guild.roles.find(role => role.name === theRole)


    if (!role || role === null) {
      msg.reply('Ese rol no existe.\n Revisa los roles disponibles escribiendo `zinc roles` o `zinc ayuda`')
      return
    }

    if (allowedRoles.indexOf(role.name) === -1) {
      msg.reply('Ese rol no esta disponible.\n Para obtener una lista de roles usa: `zinc roles`')
      return
    }

    msg.member.addRole(role).catch(console.error);    
    msg.channel.send(`:fire: ${msg.member.user.username} es un experto en ${role.name}! **woot! woot!**`)

    return
  }
  // ************************** << Comandos Permitidos

  // Mensaje default cuando no encuentra un comando.
  msg.reply('Perdón. No entendí lo que me quieres decir, escribe *`zinc ayuda`* para mas info');
})


// Evento: Cuando llega un usuario nuevo al server.
Client.on("guildMemberAdd", member => {
  //Mandarle mensaje de bienvenida.
  console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );  
  member.send(welcomeMessage);  
})

// Evento: Cuando corre el servidor
Client.on('ready', () => {
  Client.user.setActivity('Pidele ayuda a zinc nuestro bot -> zinc ayuda')
  console.log(`Ready to set roles in ${Client.channels.size} channels on ${Client.guilds.size} servers, for a total of ${Client.users.size} users.`)
})

Client.on('error', e => { console.error(e) })

Client.login(botToken)
