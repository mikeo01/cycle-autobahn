import xs, { Stream } from "xstream";
import { Connection, IConnectionOptions, Session } from "autobahn";
import { ISessionSetup, handle } from "./sink";

// Producer
const producer$ = xs.create()
    .startWith({
        reason: null,
        details: null
    });

// Session error stemming from autobahn
export interface SessionError {
    reason: any;
    details: any;
}

/**
 * Defined guard for determining error stemming from autobahn
 * @param sink SessionError
 */
export function isError(session: Session | SessionError): session is SessionError {
    return (<SessionError>session).reason !== undefined;
}

/**
 * Default session creation for autobahn
 * @param sinks$ Stream<ISessionSetup>
 * @param opts IConnectionOptions
 * @returns Stream<Session|SessionError>
 */
export const connect = (sinks$: Stream<ISessionSetup>, opts: IConnectionOptions): Stream<Session | SessionError> => {
    // Create WAMP client connection
    const client = new Connection(opts);

    // Session handling
    client.onopen = (session: Session) => {
        // Listen to sink streams, manage publishing and RPC registrations
        sinks$.addListener({
            next: sink => handle(sink, session, client)
        });

        // Imitate session stream for source
        producer$.imitate(xs.of(session));
    };

    // Error handling
    client.onclose = (reason, details) => {
        console.log(reason, details.reason);

        // Inject error into producer for error handling
        producer$.imitate(xs.of({
            reason, details
        }));

        // Re-try
        return false;
    };

    // Open connection to WAMP server
    client.open();

    return producer$ as Stream<Session | SessionError>;
}
