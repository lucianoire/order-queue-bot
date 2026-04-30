require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {

  // 🔘 SLASH COMMAND
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'listing') {

      const buyer = interaction.options.getUser('buyer');
      const channel = interaction.options.getChannel('channel');
      const quantity = interaction.options.getInteger('quantity');
      const item = interaction.options.getString('item');
      const mop = interaction.options.getString('mop');
      const price = interaction.options.getNumber('price');
      const status = interaction.options.getString('status');
      const seller = interaction.options.getUser('seller');

      // ikaw lang makakakita
      await interaction.reply({
        content: '✅ Listing posted!',
        ephemeral: true
      });

      const queueChannel = await client.channels.fetch(process.env.QUEUE_CHANNEL_ID);

      const message = `
_ _
** **            <:000_1:1456193159678791897>    𐔌  ⊹    ✿.˚    ♡⸝⸝     ୭ ˚.  
** **                  purchase  ―  lineup

> ** ** <:000_1:1456193174002466924> ${buyer}  𓎟𓎟𓎟  ${channel}
> ** ** <:000_1:1456193174002466924> ( ${quantity} )   ︵  **${item}**
> ** ** <:000_1:1456193174002466924> via :  __${mop}__   ◞    \` ₱ ${price}.00 \`
> ** ** <:000_1:1456193174002466924> order is being : __${status}__
-# ** **     <:0000_1:1456193237084536842>  order was catered by: ${seller} 
_ _
`;

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('noted')
            .setLabel('noted')
            .setStyle(ButtonStyle.Secondary),

          new ButtonBuilder()
            .setCustomId('processing')
            .setLabel('processing')
            .setStyle(ButtonStyle.Primary),

          new ButtonBuilder()
            .setCustomId('completed')
            .setLabel('completed')
            .setStyle(ButtonStyle.Success)
        );

      await queueChannel.send({
        content: message,
        components: [row]
      });
    }
  }

  // 🔘 BUTTONS
  if (interaction.isButton()) {

    // ikaw lang pwede
    if (interaction.user.id !== process.env.OWNER_ID) {
      return interaction.reply({
        content: '❌ bawal ka pindot',
        ephemeral: true
      });
    }

    const status = interaction.customId;

    let content = interaction.message.content;

    content = content.replace(
      /order is being : __.*__/,
      `order is being : __${status}__`
    );

    // ✅ pag completed → disable na
    if (status === 'completed') {
      const disabledRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('done')
            .setLabel('order has been delivered.')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
        );

      return interaction.update({
        content: content,
        components: [disabledRow]
      });
    }

    // normal buttons
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('noted')
          .setLabel('noted')
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId('processing')
          .setLabel('processing')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId('completed')
          .setLabel('completed')
          .setStyle(ButtonStyle.Success)
      );

    await interaction.update({
      content: content,
      components: [row]
    });
  }

});

client.login(process.env.DISCORD_TOKEN);
