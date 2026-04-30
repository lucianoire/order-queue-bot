require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  await client.application.commands.set([]);
  console.log('Cleared global commands');

  const guild = await client.guilds.fetch(process.env.GUILD_ID);

  await guild.commands.set([
    {
      name: 'queued',
      description: 'Send queued notice'
    },
    {
      name: 'mop',
      description: 'Send GCash payment details',
      options: [
        {
          name: 'item',
          type: 3,
          description: 'Item name',
          required: true
        },
        {
          name: 'price',
          type: 10,
          description: 'Price',
          required: true
        }
      ]
    },
    {
      name: 'listing',
      description: 'Create purchase lineup listing',
      options: [
        { name: 'buyer', type: 6, description: 'Buyer', required: true },
        { name: 'channel', type: 7, description: 'Channel', required: true },
        { name: 'quantity', type: 4, description: 'Quantity', required: true },
        { name: 'item', type: 3, description: 'Item name', required: true },
        { name: 'mop', type: 3, description: 'Mode of payment', required: true },
        { name: 'price', type: 10, description: 'Price', required: true },
        {
          name: 'status',
          type: 3,
          description: 'Order status',
          required: true,
          choices: [
            { name: 'noted', value: 'noted' },
            { name: 'processing', value: 'processing' },
            { name: 'completed', value: 'completed' }
          ]
        },
        { name: 'seller', type: 6, description: 'Seller', required: true }
      ]
    }
  ]);

  console.log('Cleaned and deployed commands');
});

client.login(process.env.DISCORD_TOKEN);
