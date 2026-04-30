require('dotenv').config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('listing')
    .setDescription('Create purchase lineup listing')
    .addUserOption(option =>
      option.setName('buyer')
        .setDescription('Buyer')
        .setRequired(true)
    )
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('quantity')
        .setDescription('Quantity')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Item name')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('mop')
        .setDescription('Mode of payment')
        .setRequired(true)
    )
    .addNumberOption(option =>
      option.setName('price')
        .setDescription('Price')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('status')
        .setDescription('Order status')
        .setRequired(true)
        .addChoices(
          { name: 'noted', value: 'noted' },
          { name: 'processing', value: 'processing' },
          { name: 'completed', value: 'completed' }
        )
    )
    .addUserOption(option =>
      option.setName('seller')
        .setDescription('Seller')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('queued')
    .setDescription('Send queued order notice')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );

  console.log('Commands deployed');
})();
