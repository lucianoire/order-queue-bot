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

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  await client.application.commands.set([]);

  const guild = await client.guilds.fetch(process.env.GUILD_ID);

  await guild.commands.set([
    { name: 'queued', description: 'Send queued notice' },
    { name: 'completed', description: 'Send completed order notice' },
    {
      name: 'mop',
      description: 'Send GCash payment details',
      options: [
        { name: 'item', type: 3, description: 'Item name', required: true },
        { name: 'price', type: 10, description: 'Price', required: true }
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

  console.log('Commands deployed');
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

function gcashButton() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('gcash_mop')
      .setLabel('gcash')
      .setStyle(ButtonStyle.Secondary)
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

    if (interaction.commandName === 'completed') {
      const completedMessage = `‎ 
‎ ‎        ‎ ‎ ‎ ‎ ‎ 𓈒⠀𓂃⠀⠀˖⠀<:pink_cross:1483503420349612215>   ⠀˖⠀⠀𓂃⠀𓈒
‎  ‎ ‎ ‎ ‎         ‎ ‎ ‎ yay ! your order is now
‎ ‎ ‎ ‎ ‎ ‎   ‎ ‎ ‎ ‎‎‎   ‎ ‎ ‎‎ ‎‎      ‎ ‎ ‎‎ ‎ ‎**__completed__**

‎   ‎ <:000_1:1456193174002466924>type   **/vouch**  to  send   a vouch
‎ ‎ ‎ ‎‎ <:000_1:1456193174002466924>vouch     within     **12hours**    only
     <:bend1:1485543789488508980>or     warranty     will     be    void[.](https://cdn.discordapp.com/attachments/1480096108410568785/1492513162254090280/IMG_0263.png?ex=69db9ab3&is=69da4933&hm=9c727f4a944d3b7869eff674fa0545ad8dc6fa992c1ec8f71280bc89a7ff4b0a&)
    <:000_1:1456193174002466924>tysm  for  trusting,  come  again!
_ _`;

      return interaction.reply({
        content: completedMessage
      });
    }

    if (interaction.commandName === 'mop') {
      const item = interaction.options.getString('item');
      const price = interaction.options.getNumber('price');

      const mopMessage = `_ _
_ _ _ _ _ _ _ _ _ _ _ _             **gcɑsh ɗetɑils**
_ _ _ _        𓎢𓎠𓎟<a:whitecross:1499062281013825618>𓎢𓎠𓎡<a:whitecross:1499062281013825618>𓎢𓎠𓎡
_ _
-# _ _     <:pearl:1483100606649602159> please send your proof of payment
-# _ _     <:bend1:1485543789488508980> **no proof of payment = no process**
-# _ _     <:pearl:1483100606649602159> kindly  double   check  the  amount
-# _ _     <:bend1:1485543789488508980> before sending. **excess amt = no rf**
-# _ _     <:pearl:1483100606649602159> payment   are   non   —   refundable
-# _ _     <:bend1:1485543789488508980> once sent.  make sure you read the
-# _ _     <:bend1:1485543789488508980> the     **[rules](https://discord.com/channels/1455613450935079109/1455613451903832269)**     before     availing. <a:kkk_pinkb:1499060602516148295> 

-# _ _ _ _ _ _    <:xnl_whitecash:1499062274265059509> **press the button below for mop**

-# _ _<:pearl:1483100606649602159> **item:** \`${item}\`
-# _ _<:pearl:1483100606649602159> **price:** \`₱${price.toFixed(2)}\`
_ _`;

      await interaction.reply({
        content: 'MOP details posted.',
        ephemeral: true
      });

      return interaction.channel.send({
        content: mopMessage,
        components: [gcashButton()]
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

  if (interaction.isButton()) {
    if (interaction.customId !== 'gcash_mop') return;

    const gcashMessage = `_ _              ── ✧ ── ⋆ ── ✧ ──
-# _ _                     **gcash   payment**
-# _ _                   \`0992 989 0833\`
-# _ _              (tap the number to copy)

-# _ _   <:pearl:1483100606649602159>send   the  payment,  then  receipt
-# _ _  <:bend1:1485543789488508980> right  after. **no proof = no process**
-# _ _   <:pearl:1483100606649602159>forced refunds will have a ₱50 fee.
-# _ _   <:pearl:1483100606649602159>don’t   send    via    gcash    protect, 
-# _ _  <:bend1:1485543789488508980>  it      won’t      be      accepted[.](https://cdn.discordapp.com/attachments/1480092289232797789/1487036657231200266/IMG_9111.png?ex=69c7ae4e&is=69c65cce&hm=c9af89ec93e8daa9b1fca55dc12c3cba2ddbbafd22527b07fe4868ea7c02a007&)
-# _ _   <:pearl:1483100606649602159>tips    are    always    appreciated <:pink:1480218642082697309> 
_ _               ── ✧ ── ⋆ ── ✧ ──
_ _`;

    return interaction.reply({
      content: gcashMessage
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
