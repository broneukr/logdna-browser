import { LogDNALogLine } from './logdna';
declare const process: (lines: LogDNALogLine | LogDNALogLine[]) => Promise<void>;
declare const flush: (lines?: LogDNALogLine[]) => Promise<void>;
export { process, flush };
