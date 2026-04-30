require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('listing')
    .setDescription('Create listing')

    .addUserOption(o =>
      o.setName('buyer')
        .setDescription('Buyer')
        .setRequired(true)
    )

    .addChannelOption(o =>
      o.setName('channel')
        .setDescription('Channel')
        .setRequired(true)
    )

    .addIntegerOption(o =>
      o.setName('quantity')
        .setDescription('Quantity')
        .setRequired(true)
    )

    .addStringOption(o =>
      o.setName('item')
        .setDescription('Item')
        .setRequired(true)
    )

    .addStringOption(o =>
      o.setName('mop')
        .setDescription('Mode of payment')
        .setRequired(true)
    )

    .addNumberOption(o =>
      o.setName('price')
        .setDescription('Price')
        .setRequired(true)
    )

    .addStringOption(o =>
      o.setName('status')
        .setDescription('Order status')
        .setRequired(true)
    )

    .addUserOption(o =>
      o.setName('seller')
        .setDescription('Seller')
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
