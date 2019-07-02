import { Stream } from "xstream";
import { IConnectionOptions, Session } from "autobahn";
import { ISessionSetup } from "./sink";
export interface SessionError {
    reason: any;
    details: any;
}
export declare function isError(session: Session | SessionError): session is SessionError;
export declare const connect: (sinks$: Stream<ISessionSetup>, opts: IConnectionOptions) => Stream<Session | SessionError>;
