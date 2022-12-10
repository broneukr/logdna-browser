declare const _default: {
    Metrics: (opts?: {
        prefix: string;
        logLevel: import("../logdna").LogLevel;
    }) => {
        name: string;
        init(): void;
        methods(): {
            mark: (name: string) => void;
            measure: (name: string, start: string, end: string) => void;
        };
    };
    SSNFilter: () => {
        name: string;
        hooks: {
            beforeSend: ({ level, message, lineContext }: import("../logdna").LogMessage) => {
                level: import("../logdna").LogLevel;
                message: any;
                lineContext: object | undefined;
            };
        };
    };
};
export default _default;
