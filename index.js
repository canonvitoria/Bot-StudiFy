const { Client, Events, GatewayIntentBits, Collection, Integration} = require('discord.js');

const dotenv = require('dotenv');
dotenv.config();

const { TOKEN } = process.env;

// Importação dos comandos

const fs = require("node:fs");
const path = require("node:path");

const commandPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith(".js"));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

for (const file of commandFiles) {
	const filePath = path.join(commandPath, file);
	const command = require(filePath);
	
	if ("data" in command && "execute" in command) {
		client.commands.set(command.data.name, command)
	} else {
		console.log(`Esse comando em ${filePath} está com "data" ou "execute" ausente.`)
	}
}

// Login do bot 
client.once(Events.ClientReady, c => {
	console.log(`Pronto! Login realizado como ${c.user.tag}`);
});

client.login(TOKEN);

// Listener de interaçõe com o bot

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isStringSelectMenu()){
		const selected = interaction.values[0]
		if (selected == "javascript") {
			await interaction.reply("Documentação do JavaScript: https://developer.mozilla.org/en-US/docs/Web/JavaScript")
		} else if (selected == "html") {
			await interaction.reply("Documentação do HTML: https://developer.mozilla.org/en-US/docs/Web/HTML")
		} else if (selected == "css") {
			await interaction.reply("Documentação do CSS: https://developer.mozilla.org/en-US/docs/Web/CSS")
		} else if (selected == "python") {
			await interaction.reply("Documentação do Python: https://docs.python.org/pt-br/3/")
		} else if (selected == "java") {
			await interaction.reply("Documentação do Java: https://www.oracle.com/java/technologies/javase-documentation.html")
		} else if (selected == "php") {
			await interaction.reply("Documentação do PHP: https://www.php.net/docs.php")
		}
	}

	if(!interaction.isChatInputCommand()) return

	const command = interaction.client.commands.get(interaction.commandName)

	if (!command) {
		console.error("Comando não encontrado")
		return
	} 
	try {
		await command.execute(interaction)
	} catch (error) {
		console.error(error);
		await interaction.reply("Houve um erro ao executar esse comando")
	}
});  