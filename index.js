require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// 🔥 SELECT MENU
function statusMenu() {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('status_menu')
      .setPlaceholder('do not touch !')
      .addOptions(
        { label: 'noted', description: 'noted', value: 'noted' },
        { label: 'processing', description: 'processing', value: 'processing' },
        { label: 'completed', description: 'completed', value: 'completed' }
      )
  );
}

// 🔥 AFTER COMPLETED (DISABLED BUTTON)
function deliveredButton() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('done')
      .setLabel('order has been delivered.')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
  );
}

client.on('interactionCreate', async interaction => {

  // 🔹 SLASH COMMAND
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName !== 'listing') return;

    if (interaction.user.id !== process.env.OWNER_ID) {
      return interaction.reply({
        content: 'You do not have permission to use this.',
        ephemeral: true
      });
    }

    const buyer = interaction.options.getUser('buyer');
    const channel = interaction.options.getChannel('channel');
    const quantity = interaction.options.getInteger('quantity');
    const item = interaction.options.getString('item');
    const mop = interaction.options.getString('mop');
    const price = interaction.options.getNumber('price');
    const status = interaction.options.getString('status');
    const seller = interaction.options.getUser('seller');

    await interaction.reply({
      content: '✅ Listing posted!',
      ephemeral: true
    });

    const queueChannel = await client.channels.fetch(process.env.QUEUE_CHANNEL_ID);

    const message = `_ _
** **            <:000_1:1456193159678791897>    𐔌  ⊹    ✿.˚    ♡⸝⸝     ୭ ˚.  
** **                  purchase  ―  lineup

> ** ** <:000_1:1456193174002466924> ${buyer}  𓎟𓎟𓎟  ${channel}
> ** ** <:000_1:1456193174002466924> ( ${quantity} )   ︵  **${item}**
> ** ** <:000_1:1456193174002466924> via :  __${mop}__   ◞    \` ₱ ${price.toFixed(2)} \`
> ** ** <:000_1:1456193174002466924> order is being : __${status}__
-# ** **     <:0000_1:1456193237084536842>  order was catered by: ${seller} 
_ _`;

    await queueChannel.send({
      content: message,
      components: [statusMenu()]
    });
  }

  // 🔹 SELECT MENU HANDLER
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId !== 'status_menu') return;

    if (interaction.user.id !== process.env.OWNER_ID) {
      return interaction.reply({
        content: 'You do not have permission to use this.',
        ephemeral: true
      });
    }

    const status = interaction.values[0];

    const content = interaction.message.content.replace(
      /order is being : __.*__/,
      `order is being : __${status}__`
    );

    // 👉 COMPLETED → DISABLED BUTTON
    if (status === 'completed') {
      return interaction.update({
        content,
        components: [deliveredButton()]
      });
    }

    // 👉 NOT COMPLETED → KEEP MENU
    return interaction.update({
      content,
      components: [statusMenu()]
    });
  }

});

client.login(process.env.DISCORD_TOKEN);
