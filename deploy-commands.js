require('dotenv').config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('listing')
    .setDescription('Create purchase lineup listing')
    .addUserOption(o => o.setName('buyer').setDescription('Buyer').setRequired(true))
    .addChannelOption(o => o.setName('channel').setDescription('Channel').setRequired(true))
    .addIntegerOption(o => o.setName('quantity').setDescription('Quantity').setRequired(true))
    .addStringOption(o => o.setName('item').setDescription('Item').setRequired(true))
    .addStringOption(o => o.setName('mop').setDescription('MOP').setRequired(true))
    .addNumberOption(o => o.setName('price').setDescription('Price').setRequired(true))
    .addStringOption(o =>
      o.setName('status')
        .setDescription('Status')
        .setRequired(true)
        .addChoices(
          { name: 'noted', value: 'noted' },
          { name: 'processing', value: 'processing' },
          { name: 'completed', value: 'completed' }
        )
    )
    .addUserOption(o => o.setName('seller').setDescription('Seller').setRequired(true)),

  new SlashCommandBuilder()
    .setName('queued')
    .setDescription('Send queued notice'),

  new SlashCommandBuilder()
    .setName('mop')
    .setDescription('Send GCash payment details')
    .addStringOption(o =>
      o.setName('item')
        .setDescription('Item name')
        .setRequired(true)
    )
    .addNumberOption(o =>
      o.setName('price')
        .setDescription('Price')
        .setRequired(true)
    )
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );

  console.log('Commands deployed');
})();
