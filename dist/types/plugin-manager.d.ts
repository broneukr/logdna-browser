import { LogDNABrowserOptions } from './logdna';
type InstalledPlugins = string[];
export declare const addPluginMethods: (options: LogDNABrowserOptions) => void;
export declare const initPlugins: (options: LogDNABrowserOptions) => void;
export declare const addDefaultPlugins: (options: LogDNABrowserOptions) => void;
export declare const getInstalledPlugins: () => InstalledPlugins;
export {};
