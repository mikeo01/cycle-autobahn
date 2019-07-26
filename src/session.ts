import xs, { Stream } from "xstream";
import { Connection, IConnectionOptions, Session } from "autobahn";
import { ISessionSetup, handle } from "./sink";

// Producer
const producer$ = xs.create()
    .startWith({
        reason: null,
        details: null
    });

/**
 * Default session creation for autobahn
 * @param sinks$ Stream<ISessionSetup>
 * @param opts IConnectionOptions
 * @returns Stream<Session>
 */
export const connect = (sinks$: Stream<ISessionSetup>, opts: IConnectionOptions): Stream<Session> => {
    // Create WAMP client connection
    const client = new Connection(opts);

    // Session handling
    client.onopen = (session: Session) => {
        // Browser
        if (typeof localStorage != 'undefined') {
            localStorage.setItem('autobahn_connected', 'true');
        }

        try {
            // Listen to sink streams, manage publishing and RPC registrations
            sinks$.addListener({
                next: sink => handle(sink, session, client)
            });
        } catch (e) {
            console.error(e);
        }

        // Imitate session stream for source
        producer$.shamefullySendNext(session);
    };

    // Closed connections
    client.onclose = (reason, details) => {
        // Browser
        if (typeof localStorage != 'undefined') {
            localStorage.setItem('autobahn_connected', 'false');
        }
        
        console.error(reason, details);

        return false;
    };

    // Open connection to WAMP server
    client.open();

    return producer$ as Stream<Session>;
}
