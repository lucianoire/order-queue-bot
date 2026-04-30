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
  if (interaction.isChatInputCommand()) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      return interaction.reply({
        content: 'You do not have permission to use this.',
        ephemeral: true
      });
    }

    if (interaction.commandName === 'queued') {
      const queuedMessage = `_ _      
_ _        ** ყour orძer hɑs ხeen queueძ** 
_ _                  . ݁₊  ⊹  . ݁  <:bspider:1499062340086403213>   ݁ .  ⊹  ₊  ݁.

-# _ _        <:pearl:1483100606649602159> cancellations  are   not  allowed
-# _ _        <:bend1:1485543789488508980> once   your    order    is    queued
-# _ _        <:pearl:1483100606649602159> be   patient   and   avoid  rushing 
-# _ _        <:bend1:1485543789488508980> the    order.    __**rush    =    void**__
-# _ _        <:pearl:1483100606649602159> processing    time      may      vary
-# _ _        <:bend1:1485543789488508980> depending    on    order    volume
_ _`;

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('view here')
          .setStyle(ButtonStyle.Link)
          .setURL(`https://discord.com/channels/${process.env.GUILD_ID}/1455627867529543813`)
      );

      await interaction.reply({
        content: 'Queued notice posted.',
        ephemeral: true
      });

      return interaction.channel.send({
        content: queuedMessage,
        components: [row]
      });
    }

    if (interaction.commandName === 'listing') {
      const buyer = interaction.options.getUser('buyer');
      const channel = interaction.options.getChannel('channel');
      const quantity = interaction.options.getInteger('quantity');
      const item = interaction.options.getString('item');
      const mop = interaction.options.getString('mop');
      const price = interaction.options.getNumber('price');
      const status = interaction.options.getString('status');
      const seller = interaction.options.getUser('seller');

      await interaction.reply({
        content: 'Listing posted.',
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

      return queueChannel.send({
        content: message,
        components: status === 'completed' ? [deliveredButton()] : [statusMenu()]
      });
    }
  }

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

    if (status === 'completed') {
      return interaction.update({
        content,
        components: [deliveredButton()]
      });
    }

    return interaction.update({
      content,
      components: [statusMenu()]
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
