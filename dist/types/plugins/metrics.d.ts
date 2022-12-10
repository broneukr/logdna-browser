import { LogLevel } from '../logdna';
type MetricPlugin = {
    prefix: string;
    logLevel: LogLevel;
};
declare const Metrics: (opts?: MetricPlugin) => {
    name: string;
    init(): void;
    methods(): {
        mark: (name: string) => void;
        measure: (name: string, start: string, end: string) => void;
    };
};
export default Metrics;
