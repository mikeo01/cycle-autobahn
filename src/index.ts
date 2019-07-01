import { IConnectionOptions } from 'autobahn';
import xs, { Stream } from 'xstream';
import { ISessionSetup, handle } from 'sink';
import { source } from './source';
import { connect } from './session';

/**
 * Makes WAMP driver and offloads to autobahn's API
 * 
 * @param opts IConnectionOptions
 */
export function makeWAMPDriver(opts: IConnectionOptions) {
    // WAMP driver
    return function wampDriver(sinks$: Stream<ISessionSetup>) {
        // Create autobahn session and connect to WAMP server
        const producer$ = connect(sinks$, opts);

        // Expose source for interacting with autobahn's API
        return source(producer$);
    };
}
