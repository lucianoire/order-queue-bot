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
 ‎        ‎ ‎ ‎ ‎ ‎ 𓈒⠀𓂃⠀⠀˖⠀<a:flower_1:1500489961986723910> ⠀˖⠀⠀𓂃⠀𓈒
‎  ‎ ‎ ‎ ‎         ‎ ‎ ‎ yay ! your order is now
‎ ‎ ‎ ‎ ‎ ‎   ‎ ‎ ‎ ‎‎‎   ‎ ‎ ‎‎ ‎‎      ‎ ‎ ‎‎ ‎ ‎**__completed__**
_ _
_ _ ‎ <:pearl_1:1501187460024111135>type   **/vouch**  to  send   a vouch
_ _ ‎ <:pearl_1:1501187460024111135>vouch     within     **12hours**    only
     <:bend_1:1501187237151375463>or     warranty     will     be    void[.](https://cdn.discordapp.com/attachments/1501118801339617401/1501188647557529681/IMG_1249.png?ex=69fb2a60&is=69f9d8e0&hm=a2a48e168d36901a7d2acd63a07d7abe2632111608c0dc632a265fada09b84a2&)
_ _ ‎ <:pearl_1:1501187460024111135>tysm  for  trusting,  come  again!
_ _`;

      await interaction.reply({
        content: 'Completed notice posted.',
        ephemeral: true
      });

      return interaction.channel.send({
        content: completedMessage
      });
    }

    if (interaction.commandName === 'mop') {
      const item = interaction.options.getString('item');
      const price = interaction.options.getNumber('price');

      const mopMessage = `_ _
_ _ _ _ _ _ _ _ _ _ _ _             **gcɑsh ɗetɑils**
_ _ _ _        𓎢𓎠𓎟<a:flower_1:1500489961986723910>𓎢𓎠𓎡<a:flower_1:1500489961986723910>𓎢𓎠𓎡
_ _
-# _ _     <:pearl_1:1501187460024111135> please send your proof of payment
-# _ _     <:bend_1:1501187237151375463> **no proof of payment = no process**
-# _ _     <:pearl_1:1501187460024111135> kindly  double   check  the  amount
-# _ _     <:bend_1:1501187237151375463> before sending. **excess amt = no rf**
-# _ _     <:pearl_1:1501187460024111135> payment   are   non   —   refundable
-# _ _     <:bend_1:1501187237151375463> once sent.  make sure you read the
-# _ _     <:bend_1:1501187237151375463> the     **[rules](https://discord.com/channels/1455613450935079109/1455613451903832269)**     before     availing. <:cutesy_001:1501141865905258527>   
-# _ _ _ _ _ _    <a:crown_1:1501122940723396730> **press the button below for mop**

-# _ _<:pearl_1:1501187460024111135> **item:** \`${item}\`
-# _ _<:pearl_1:1501187460024111135> **price:** \`₱${price.toFixed(2)}\`
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
_ _                  . ݁₊  ⊹  . ݁  <a:lucia_dns1:1501122589970399362>    ݁ .  ⊹  ₊  ݁.

-# _ _        <:pearl_1:1501187460024111135> cancellations  are   not  allowed
-# _ _        <:bend_1:1501187237151375463> once   your    order    is    queued
-# _ _        <:pearl_1:1501187460024111135> be   patient   and   avoid  rushing 
-# _ _        <:bend_1:1501187237151375463> the    order.    __**rush    =    void**__
-# _ _        <:pearl_1:1501187460024111135> processing    time      may      vary
-# _ _        <:bend_1:1501187237151375463> depending    on    order    volume
_ _`;

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('view here')
          .setStyle(ButtonStyle.Link)
          .setURL(`https://discord.com/channels/${process.env.GUILD_ID}/1501109326176059393`)
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
** **            <a:aaa_1:1501121970228432936> 𐔌  ⊹    ✿.˚    ♡⸝⸝     ୭ ˚.  
** **                  purchase  ―  lineup

> ** ** <a:heart_1:1501193566783930369> ${buyer}  𓎟𓎟𓎟  ${channel}
> ** ** <a:heart_1:1501193566783930369> ( ${quantity} )   ︵  **${item}**
> ** ** <a:heart_1:1501193566783930369> via :  __${mop}__   ◞    \` ₱ ${price.toFixed(2)} \`
> ** ** <a:heart_1:1501193566783930369> order is being : __${status}__
-# ** **     <a:flower_1:1500489961986723910>  order was catered by: ${seller} 
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

    const gcashMessage = `_ _
_ _              ── ✧ ── ⋆ ── ✧ ──
-# _ _                     **gcash   payment**
-# _ _                   \`0992 989 0833\`
-# _ _              (tap the number to copy)

-# _ _   <:pearl_1:1501187460024111135>send   the  payment,  then  receipt
-# _ _  <:bend_1:1501187237151375463> right  after. **no proof = no process**
-# _ _   <:pearl_1:1501187460024111135>forced refunds will have a ₱50 fee.
-# _ _   <:pearl_1:1501187460024111135>don’t   send    via    gcash    protect, 
-# _ _  <:bend_1:1501187237151375463>  it      won’t      be      accepted[.](https://cdn.discordapp.com/attachments/1501118801339617401/1501198214764826745/IMG_1253.png?ex=69fb3349&is=69f9e1c9&hm=436b37599027f9a01421e5ff40b4c0c08ee9eb11a96417574d3a04fc18590f18&)
-# _ _   <:pearl_1:1501187460024111135>tips    are    always    appreciated <:heart_0001:1501197839894577354>  
_ _               ── ✧ ── ⋆ ── ✧ ──
_ _`;

    return interaction.reply({
      content: gcashMessage
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
