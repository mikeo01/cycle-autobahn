import xs, { Stream } from "xstream";
import debounce from "xstream/extra/debounce";

/**
 * Args value
 */
export const mockTopicValue = 'some random information to assert against';

/**
 * Publish to topic
 */
const publish = () =>
    // Our publish request (add debounce so we can register first)
    xs.create({
        start: listener => listener.next({
            publish: {
                topic: topic,
                args: [mockTopicValue],
                options: {
                    exclude_me: false
                }
            }
        }),
        stop: () => undefined
    }).compose(debounce(100)) as Stream<any>;

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
    })

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
    rpc()
);
