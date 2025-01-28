import { CommandInteraction, Client, ApplicationCommandType, ApplicationCommandOptionType, userMention } from "discord.js";
import { Command } from "./types";

let openPicks: {
  name?: string | null;
  responses: {
    id: string;
    response?: string;
  }[]
}[] = [];

async function runInit(_client: Client, interaction: CommandInteraction) {
  if (!interaction.isChatInputCommand()) return;

  const user1 = interaction.options.getUser("captain1", true);
  const user2 = interaction.options.getUser("captain2", true);
  const name = interaction.options.getString("name")

  openPicks.push({
    name,
    responses: [
      { id: user1.id, response: undefined },
      { id: user2.id, response: undefined },
    ]
  })

  await interaction.followUp({
    content: `${name ?? "Blind pick"} between ${userMention(user1.id)} and ${userMention(user2.id)} initiated.`
  });
}

async function runPick(_client: Client, interaction: CommandInteraction) {
  if (!interaction.isChatInputCommand()) return;
  const inputtedResponse = interaction.options.getString("response", true)

  const openPick = openPicks.find(pick =>
    pick.responses.some(res => res.id === interaction.user.id && !res.response)
  )

  if (!openPick) {
    await interaction.followUp({
      ephemeral: true,
      content: `You are not a part of any open blind picks. Use /blindpickstart to start a blind pick.`
    });
    return
  }

  const responseToFill = openPick.responses.find(res =>
    res.id === interaction.user.id && !res.response
  )!

  responseToFill.response = inputtedResponse;

  // ephemeral response, only visible to user
  await interaction.followUp({
    ephemeral: true,
    content: `Response: ${inputtedResponse} received.`
  });

  // public response
  if (interaction.channel?.isSendable()) {
    await interaction.channel.send(
      `Response received from ${userMention(interaction.user.id)}`
    )
  }

  // announce results and delete the blind pick if it's complete.
  if (openPick.responses.every(res => !!res.response)) {
    if (interaction.channel?.isSendable()) {
      interaction.channel.send(
        `${openPick.name ?? "Blind Pick"} Result: \n`
        + openPick.responses.map(({ id, response }) => `${userMention(id)}: ${response} `).join("\n")
      )
    }
    openPicks = openPicks.filter(e => e !== openPick)
  }

}

export const initBlindPick: Command = {
  name: "blindpickstart",
  description: "starts a blindpick between two users",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "captain1",
      description: "1 of 2 participants in the blind pick",
      type: ApplicationCommandOptionType.User,
      required: true
    },
    {
      name: "captain2",
      description: "2 of 2 participants in the blind pick",
      type: ApplicationCommandOptionType.User,
      required: true
    },
    {
      name: "name",
      description: "Optional name of the blind pick event",
      type: ApplicationCommandOptionType.String,
    },
  ],
  run: runInit
};

export const respondBlindPick: Command = {
  name: "blindpick",
  description: "respond to the first open blindpick event you are a part of",
  replyEphemeral: true,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "response",
      description: "Your response to the blind pick event",
      type: ApplicationCommandOptionType.String,
      required: true
    },
  ],
  run: runPick
};