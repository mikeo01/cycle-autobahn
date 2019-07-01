import { Connection, Session, IPublishOptions, RegisterEndpoint, IRegisterOptions } from "autobahn";
import { Stream } from "xstream";

// RPC registration message
export interface RPCRegistration {
    register: {
        name: string;
        procedure: RegisterEndpoint;
        options?: IRegisterOptions;
    };
}

// Publishing to topic message
export interface Publish {
    publish: {
        topic: string;
        args: Array<any>;
        kwargs?: any;
        options?: IPublishOptions;
    };
}

// Connection closure message
export interface Close {
    close: Boolean
}

// Union type for session setup options
export type ISessionSetup = Publish | RPCRegistration | Close;

/**
 * Defined guard for publishing to a topic
 * * @param sink ISessionSetup
 */
function isPublish(sink: ISessionSetup): sink is Publish {
    return (<Publish>sink).publish !== undefined;
}

/**
 * Defined guard for registering a new remote procedure
 * @param sink ISessionSetup
 */
function isRPC(sink: ISessionSetup): sink is RPCRegistration {
    return (<RPCRegistration>sink).register !== undefined;
}

/**
 * Handle sinks - deal with publishing and registering against active session
 * @param sink ISessionSetup
 * @param session Session
 * @param client Connection
 */
export function handle(sink: ISessionSetup, session: Session, client: Connection) {
    if (isPublish(sink)) {
        // Handle publishing to a topic
        session.publish(sink.publish.topic, sink.publish.args, sink.publish.kwargs, sink.publish.options);
    } else if (isRPC(sink)) {
        // Handle registering a new remote procedure for other connected clients to consume
        session.register(sink.register.name, sink.register.procedure, sink.register.options);
    } else {
        // Handle stop
        if (sink.close) {
            client.close('wamp.goodbye.normal', 'exiting app / closing connection normally');
        }
    }
}
