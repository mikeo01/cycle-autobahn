import xs, { Stream } from "xstream";
import delay from "xstream/extra/delay";
import { IPublishOptions } from "autobahn";

/**
 * Args value
 */
export const mockTopicValue = 'some random information to assert against';

/**
 * Publish to topic
 */
const publish = () =>
    // Our publish request (add delay so we can register first)
    xs.of({
        publish: {
            topic: topic,
            args: [mockTopicValue],
            options: {
                exclude_me: false
            }
        }
    }).compose(delay(750)) as Stream<IPublishOptions>;

/**
 * Register a new remote procedure
 */
const rpc = () =>
    // Our RPC register
    xs.of({
        register: {
            name: rpcName,
            procedure: (args) => args[0] + args[1]
        }
    });

/**
 * Close after x has passed (otherwise tests stall)
 */
const close = () =>
    // Our RPC register
    xs.of({
        close: true
    }).compose(delay(1500));

/**
 * Default test topic
 */
export const topic = 'local.crossbar.hello';

/**
 * Default test rpc
 */
export const rpcName = 'local.crossbar.add';

/**
 * Setup workspace for this testing session
 */
export const setup = () => xs.merge(
    publish(),
    rpc(),
    close()
);
