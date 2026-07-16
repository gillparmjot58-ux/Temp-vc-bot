const { Client, GatewayIntentBits, ChannelType } = require("discord.js");

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
    // Create Temp VC
    if (newState.channelId === CREATE_CHANNEL_ID) {
      const member = newState.member;

      const channel = await newState.guild.channels.create({
        name: `${member.displayName}'s VC`,
        type: ChannelType.GuildVoice,
        parent: newState.channel.parentId,
      });

      await newState.setChannel(channel);
    }

    // Delete empty Temp VC
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

client.login(process.env.TOKEN);
