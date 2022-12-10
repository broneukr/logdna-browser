import { Context } from './logdna';
type LogDNABrowserInfo = {
    version: string;
};
type StaticContext = {
    browser: LogDNABrowserInfo;
};
declare const addContext: (_context: Context) => void;
declare const getContext: () => Context;
declare const getDynamicContext: () => {
    location: Location;
};
declare const getStaticContext: () => StaticContext | undefined;
export { addContext, getContext, getStaticContext, getDynamicContext };
