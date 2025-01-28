import { CommandInteraction, ChatInputApplicationCommandData, Client } from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
  run: (client: Client, interaction: CommandInteraction) => Promise<void>;

  /**
   * Whether the deferred replies should be ephemeral or not.
   */
  replyEphemeral?: boolean;
}