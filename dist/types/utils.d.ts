import { Tags } from './logdna';
declare const _default: {
    validateHostname: (hostname: string) => boolean;
    parseTags: (tags?: Tags) => string;
    stringify: (obj: unknown) => string;
    getStackTrace: () => string;
    backOffWithJitter: (base: number, cap: number, lastSleep: number) => number;
    jsonByteSize: (obj: unknown) => number;
    includeInSampleRate: (sampleRate: number | undefined, sampleRateScore: number) => boolean;
    generateSampleRateScore: () => number;
    isBrowserStorageAvailable: (storage: "localStorage" | "sessionStorage") => boolean;
    isFunction: (fn?: Function | undefined) => boolean;
    originalConsole: any;
    cacheConsole: () => void;
};
export default _default;
