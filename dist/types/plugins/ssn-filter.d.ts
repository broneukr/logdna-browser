import { LogMessage } from '../logdna';
declare const SSN: () => {
    name: string;
    hooks: {
        beforeSend: ({ level, message, lineContext }: LogMessage) => {
            level: import("../logdna").LogLevel;
            message: any;
            lineContext: object | undefined;
        };
    };
};
export default SSN;
