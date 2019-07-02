"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xstream_1 = require("xstream");
const autobahn_1 = require("autobahn");
const sink_1 = require("./sink");
const producer$ = xstream_1.default.create()
    .startWith({
    reason: null,
    details: null
});
function isError(session) {
    return session.reason !== undefined;
}
exports.isError = isError;
exports.connect = (sinks$, opts) => {
    const client = new autobahn_1.Connection(opts);
    client.onopen = (session) => {
        sinks$.addListener({
            next: sink => sink_1.handle(sink, session, client)
        });
        producer$.imitate(xstream_1.default.of(session));
    };
    client.onclose = (reason, details) => {
        console.log(reason, details.reason);
        producer$.imitate(xstream_1.default.of({
            reason, details
        }));
        return false;
    };
    client.open();
    return producer$;
};
//# sourceMappingURL=session.js.map