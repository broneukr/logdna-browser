import { Plugin } from '../logdna';
export type GlobalErrorHandlerPlugin = {
    enableErrorHandler?: boolean;
    enableUnhandledPromiseRejection?: boolean;
} | undefined;
declare const GlobalErrorHandler: (opts?: GlobalErrorHandlerPlugin) => Plugin;
export default GlobalErrorHandler;
