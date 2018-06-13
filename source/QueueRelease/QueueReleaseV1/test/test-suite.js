"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const assert = require("assert");
const mock_test_1 = require("vsts-task-lib/mock-test");
const timeout = 100000;
function initializeEnvironment() {
    process.env['teamProject'] = 'VSTS-Queue-Release';
    process.env['teamFoundationCollectionUri'] = 'https://xxx.visualstudio.com';
    process.env['authToken'] = '';
    process.env['runAsync'] = 'false';
    process.env['releaseDefinitionId'] = 'fail';
    process.env['artifactName'] = '';
    process.env['requestedForId'] = '';
    process.env['buildId'] = '128';
}
describe('Queue Release tests', function () {
    this.timeout(timeout);
    before(initializeEnvironment);
    it('Invalid Release ID', (done) => {
        process.env['releaseDefinitionId'] = '1';
        let tp = path.join(__dirname, 'runner.js');
        let tr = new mock_test_1.MockTestRunner(tp);
        tr.run();
        assert(tr.failed, `should have failed: ${tr.stderr}`);
        done();
    });
    it('Valid Release ID', (done) => {
        process.env['releaseDefinitionId'] = '1';
        let tp = path.join(__dirname, 'runner.js');
        let tr = new mock_test_1.MockTestRunner(tp);
        tr.run();
        assert(tr.succeeded, `should have succeeded: ${tr.stderr}`);
        done();
    });
});
//# sourceMappingURL=test-suite.js.map