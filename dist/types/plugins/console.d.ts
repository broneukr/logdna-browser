import { Plugin, LogLevel } from '../logdna';
export type ConsolePlugin = {
    integrations?: LogLevel[];
} | undefined;
declare const Console: (opts?: ConsolePlugin) => Plugin;
export default Console;
