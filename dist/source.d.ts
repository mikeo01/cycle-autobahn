import { Stream } from "xstream";
import { Session, ISubscribeOptions, ICallOptions } from "autobahn";
import { SessionError } from "./session";
export interface WAMPSource {
    subscribe: (topic: string, options?: ISubscribeOptions) => Stream<any>;
    call: (topic: string, args?: Array<any>, kwargs?: any, options?: ICallOptions) => Stream<any>;
}
export declare function source(sink$: Stream<Session | SessionError>): WAMPSource;
