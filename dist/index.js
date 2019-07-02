"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const source_1 = require("./source");
const session_1 = require("./session");
function makeWAMPDriver(opts) {
    return function wampDriver(sinks$) {
        const producer$ = session_1.connect(sinks$, opts);
        return source_1.source(producer$);
    };
}
exports.makeWAMPDriver = makeWAMPDriver;
//# sourceMappingURL=index.js.map