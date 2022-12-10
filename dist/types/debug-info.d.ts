type LogDNAWindow = {
    version: string;
    getContext: Function;
    getOptions: Function;
    getInstalledPlugins: Function;
    getSessionId: Function;
};
declare global {
    interface Window {
        __LOGDNA__: LogDNAWindow;
    }
}
export declare const addDebugInfo: () => void;
export {};
