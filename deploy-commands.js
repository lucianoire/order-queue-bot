require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('listing')
    .setDescription('Create listing')
    .addUserOption(o => o.setName('buyer').setRequired(true))
    .addChannelOption(o => o.setName('channel').setRequired(true))
    .addIntegerOption(o => o.setName('quantity').setRequired(true))
    .addStringOption(o => o.setName('item').setRequired(true))
    .addStringOption(o => o.setName('mop').setRequired(true))
    .addNumberOption(o => o.setName('price').setRequired(true))
    .addStringOption(o => o.setName('status').setRequired(true))
    .addUserOption(o => o.setName('seller').setRequired(true))
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );
  console.log('Commands deployed');
})();
