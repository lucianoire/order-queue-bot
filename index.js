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

function makeButtons() {
  return new ActionRowBuilder().addComponents(
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
}

client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName !== 'listing') return;

    if (interaction.user.id !== process.env.OWNER_ID) {
      return interaction.reply({
        content: '❌ ikaw lang pwede gumamit nito',
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
      components: [makeButtons()]
    });
  }

  if (interaction.isButton()) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return interaction.reply({
        content: '❌ bawal ka pindot',
        ephemeral: true
      });
    }

    const status = interaction.customId;

    let content = interaction.message.content.replace(
      /order is being : __.*__/,
      `order is being : __${status}__`
    );

    if (status === 'completed') {
      const disabledRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('done')
          .setLabel('order has been delivered.')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true)
      );

      return interaction.update({
        content,
        components: [disabledRow]
      });
    }

    return interaction.update({
      content,
      components: [makeButtons()]
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
