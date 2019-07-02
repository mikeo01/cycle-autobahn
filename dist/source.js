"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xstream_1 = require("xstream");
const adapt_1 = require("@cycle/run/lib/adapt");
const session_1 = require("./session");
function source(sink$) {
    return {
        subscribe(topic, options = null) {
            const producer$ = xstream_1.default.create();
            sink$.addListener({
                next: session => {
                    if (!session_1.isError(session)) {
                        session.subscribe(topic, args => {
                            producer$.imitate(xstream_1.default.of(args));
                        }, options);
                    }
                }
            });
            return adapt_1.adapt(producer$);
        },
        call(topic, args = [], kwargs, options = null) {
            const producer$ = xstream_1.default.create();
            sink$.addListener({
                next: session => {
                    if (!session_1.isError(session)) {
                        session.call(topic, args, kwargs, options).then(args => {
                            producer$.imitate(xstream_1.default.of(args));
                        });
                    }
                }
            });
            return adapt_1.adapt(producer$);
        }
    };
}
exports.source = source;
//# sourceMappingURL=source.js.map