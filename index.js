const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const CREATE_CHANNEL_ID = "1354771746221461617";

client.once("ready", () => {
  console.log(`${client.user.tag} is online!`);
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  try {
    if (newState.channelId === CREATE_CHANNEL_ID) {
      const member = newState.member;
            const channel = await newState.guild.channels.create({
        name: `${member.displayName}'s VC`,
        type: ChannelType.GuildVoice,
        parent: newState.channel.parentId,
      });

      await newState.setChannel(channel);
    }

    if (
      oldState.channel &&
      oldState.channel.members.size === 0 &&
      oldState.channel.name.endsWith("'s VC")
    ) {
      await oldState.channel.delete().catch(() => {});
    }
  } catch (err) {
    console.error(err);
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const vc = message.member.voice.channel;
  if (!vc) return;

  if (message.content.startsWith("!rename ")) {
    const newName = message.content.slice(8).trim();

    if (!newName)
      return message.reply("❌ Usage: !rename <name>");

    try {
      await vc.setName(newName);
      return message.reply(`✅ VC renamed to **${newName}**`);
    } catch {
      return message.reply("❌ Rename failed.");
    }
  }
    if (message.content === "!lock") {
    try {
      await vc.permissionOverwrites.edit(message.guild.roles.everyone, {
        Connect: false,
      });

      return message.reply("🔒 VC locked.");
    } catch {
      return message.reply("❌ Lock failed.");
    }
  }

  if (message.content === "!unlock") {
    try {
      await vc.permissionOverwrites.edit(message.guild.roles.everyone, {
        Connect: true,
      });

      return message.reply("🔓 VC unlocked.");
    } catch {
      return message.reply("❌ Unlock failed.");
    }
  }

  if (message.content.startsWith("!limit ")) {
    const limit = parseInt(message.content.split(" ")[1]);

    if (isNaN(limit) || limit < 0 || limit > 99) {
      return message.reply("❌ Enter a number between 0 and 99.");
    }

    try {
      await vc.setUserLimit(limit);
      return message.reply(`👥 User limit set to ${limit}`);
    } catch {
      return message.reply("❌ Failed to set limit.");
    }
  }
});

client.login(process.env.TOKEN);
