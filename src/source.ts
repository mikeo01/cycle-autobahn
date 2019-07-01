import { ISessionSetup } from "./sink";
import xs, { Stream } from "xstream";
import { adapt } from "@cycle/run/lib/adapt";
import { Session, ISubscribeOptions, ICallOptions } from "autobahn";
import { isError, SessionError } from "./session";

// WAMP source signature
export interface WAMPSource {
    subscribe: (topic: string, options?: ISubscribeOptions) => Stream<any>;
    call: (topic: string, args?: Array<any>, kwargs?: any, options?: ICallOptions) => Stream<any>;
}

/**
 * Producer imitating events that stem from autobahn's API (subscribe, call)
 * @param sink$ Stream<Session|SessionError>
 */
export function source(sink$: Stream<Session | SessionError>): WAMPSource {
    return {
        subscribe(topic: string, options: ISubscribeOptions = null): Stream<any> {
            // Empty producer - imitates events later
            const producer$ = xs.create();

            // Listen to session
            sink$.addListener({
                next: session => {
                    if (!isError(session)) {
                        // Imitate events that come back from subscribing to a topic
                        session.subscribe(topic, args => {
                            producer$.imitate(xs.of(args));
                        }, options);
                    }
                }
            });

            // Will imitate events emitted from subscription messages
            return adapt(producer$);
        },

        call(topic: string, args: Array<any> = [], kwargs: any, options: ICallOptions = null): Stream<any> {
            // Empty producer - imitates events later
            const producer$ = xs.create();

            // Listen to session
            sink$.addListener({
                next: session => {
                    if (!isError(session)) {
                        // Imitate events that come back from calling a remote procedure
                        session.call(topic, args, kwargs, options).then(args => {
                            producer$.imitate(xs.of(args));
                        });
                    }
                }
            });

            // Will imitate events emitted from subscription messages
            return adapt(producer$);
        }
    };
}
