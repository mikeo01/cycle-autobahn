"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isPublish(sink) {
    return sink.publish !== undefined;
}
function isRPC(sink) {
    return sink.register !== undefined;
}
function handle(sink, session, client) {
    if (isPublish(sink)) {
        session.publish(sink.publish.topic, sink.publish.args, sink.publish.kwargs, sink.publish.options);
    }
    else if (isRPC(sink)) {
        session.register(sink.register.name, sink.register.procedure, sink.register.options);
    }
    else {
        if (sink.close) {
            client.close('wamp.goodbye.normal', 'exiting app / closing connection normally');
        }
    }
}
exports.handle = handle;
//# sourceMappingURL=sink.js.map