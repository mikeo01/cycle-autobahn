import { ISessionSetup } from "./sink";
import xs, { Stream } from "xstream";
import { adapt } from "@cycle/run/lib/adapt";
import { Session, ISubscribeOptions, ICallOptions } from "autobahn";

// WAMP source signature
export interface WAMPSource {
    subscribe: (topic: string, options?: ISubscribeOptions) => Stream<any>;
    call: (topic: string, args?: Array<any>, kwargs?: any, options?: ICallOptions) => Stream<any>;
}

/**
 * Imitation factory
 * @param sinks$ Stream<Session>
 * @param fn Closure
 */
function imitation(sinks$: Stream<Session>, fn: (session: Session, producer$: Stream<any>) => void, err?: (err: any, producer$: Stream<any>) => void): Stream<any> {
    // Empty producer - imitates events later
    const producer$ = xs.createWithMemory();

    // Listen to session
    sinks$.addListener({
        next: session => fn(session, producer$)
    });

    // Will imitate events emitted from subscription messages
    return adapt(producer$);
}

/**
 * Producer imitating events that stem from autobahn's API (subscribe, call)
 * @param sinks$ Stream<Session>
 */
export function source(sinks$: Stream<Session>): WAMPSource {
    return {
        subscribe(topic: string, options: ISubscribeOptions = null): Stream<any> {
            return imitation(sinks$, (session, producer$) => {
                // Imitate events that come back from subscribing to a topic
                // Force send next - acts as a proxy to autobahn API
                try {
                    session.subscribe(topic, args => {
                        producer$.shamefullySendNext(args);
                    }, options);
                } catch (e) {
                    
                }
            });
        },

        call(topic: string, args: Array<any> = [], kwargs: any, options: ICallOptions = null): Stream<any> {
            return imitation(sinks$, (session, producer$) => {
                // Imitate events that come back from calling a remote procedure
                // A single complete event is emitted to close the RPC loop
                try {
                    session.call(topic, args, kwargs, options).then(args => {
                        producer$.imitate(xs.of(args));
                    });
                } catch (e) {
                    
                }
            });
        }
    };
}
