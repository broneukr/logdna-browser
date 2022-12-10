import { SessionId } from './logdna';
declare const init: () => void;
declare const setSessionId: (id: SessionId) => void;
declare const getSessionId: () => SessionId;
export { init, getSessionId, setSessionId };
