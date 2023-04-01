import { OptionParser } from "../option/OptionParser";
import { Command } from "./Command";

export class CommandParser {
  public static parseOptions(
    command: Command,
    args: string[]
  ): Record<string, any> {
    const options: Record<string, any> = {};

    let i = 0;
    while (i < args.length) {
      const arg = args[i];
      if (arg.startsWith("-")) {
        const option = command.findOption(arg);
        if (!option) {
          throw new Error(`Unknown option: ${arg}`);
        }

        const { value, index } = OptionParser.parse(option, args, i);
        const optionKey = option.getKey();
        options[optionKey] = value;
        i = index + 1;
      } else {
        i++;
      }
    }

    return options;
  }

  public static validateOptions(
    command: Command,
    options: Record<string, any>
  ): void {
    const optionKeys = command.options.map((option) => option.getKey());
    for (const key in options) {
      if (!optionKeys.includes(key)) {
        throw new Error(`Unknown option: ${key}`);
      }
      const option = command.findOption(key);
      if (option?.argument?.required && options[key] === undefined) {
        throw new Error(`Missing required option: ${option.longName}`);
      }
    }
  }
}
