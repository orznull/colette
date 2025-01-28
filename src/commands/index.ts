import { initBlindPick, respondBlindPick } from "./blindPick";
import { ping } from "./ping";
import { Command } from "./types";

export const commands: Command[] = [
  ping,
  initBlindPick,
  respondBlindPick
]