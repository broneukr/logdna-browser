import { LogLevel, LineContext } from '../logdna';
declare module '../LogDNAMethods' {
    interface LogDNAMethods {
        log(message: any, context?: LineContext, level?: LogLevel): void;
        error(message: any, context?: LineContext, level?: LogLevel): void;
        warn(message: any, context?: LineContext, level?: LogLevel): void;
        debug(message: any, context?: LineContext, level?: LogLevel): void;
        info(message: any, context?: LineContext, level?: LogLevel): void;
    }
}
declare const Logger: () => {
    name: string;
    methods(): {
        log: (message: any, context?: LineContext, level?: LogLevel) => void;
        error: (message: any, context?: LineContext) => void;
        warn: (message: any, context?: LineContext) => void;
        info: (message: any, context?: LineContext) => void;
        debug: (message: any, context?: LineContext) => void;
    };
};
export default Logger;
