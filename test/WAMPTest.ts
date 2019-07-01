'use strict';

import 'mocha';
import { expect } from 'chai';

// Driver
import { makeWAMPDriver } from '../src/index';
import { topic, mockTopicValue, rpcName, setup } from './stub/wamp-requests';
import xs from 'xstream';

describe('WAMP', function () {
    /**
     * Setup topics, remote procedures for all testing
     */
    this.beforeAll(function () {
        this.WAMP = makeWAMPDriver({
            url: 'ws://localhost:8500/ws',
            realm: 'realm1'
        })(setup());
    });

    it('should subscribe to a topic and receive information', function (done) {
        // Listen to topic
        this.WAMP.subscribe(topic)
            .addListener({
                next: event => {
                    expect(event.pop() === mockTopicValue);
                },
                complete: () => done(),
                error: e => done(e)
            });
    });

    it('should register a new remote procedure and return 3 correctly', function (done) {
        // Call remote procedure
        this.WAMP.call(rpcName, [1, 2])
            .addListener({
                next: result => {
                    expect(result === 3);
                },
                complete: () => done(),
                error: e => done(e)
            });
    });
});
