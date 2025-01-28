import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "./types";

async function run(_client: Client, interaction: CommandInteraction) {
  const msDiff = interaction.createdTimestamp - Date.now();
  const content = `Pong! ${msDiff}ms`;

  await interaction.followUp({
    ephemeral: true,
    content
  });
}

export const ping: Command = {
  name: "ping",
  description: "pongs u back",
  type: ApplicationCommandType.ChatInput,
  run
};