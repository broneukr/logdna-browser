import { LogMessage } from './logdna';
declare const captureMessage: ({ level, message, lineContext }: LogMessage) => void;
declare const captureError: (error: any, isUnhandledRejection?: boolean) => void;
declare const internalErrorLogger: (...args: any[]) => any;
export { captureError, captureMessage, internalErrorLogger };
