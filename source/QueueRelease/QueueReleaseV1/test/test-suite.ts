import * as path from 'path';
import * as assert from 'assert';
import { MockTestRunner } from 'vsts-task-lib/mock-test';

const timeout: number = 100000;

function initializeEnvironment(): void {
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
        let tr = new MockTestRunner(tp);
        tr.run();
        assert(tr.failed, `should have failed: ${tr.stderr}`);
        done();
    });
    it('Valid Release ID', (done: MochaDone) => {

        process.env['releaseDefinitionId'] = '1';
        let tp = path.join(__dirname, 'runner.js');
        let tr: MockTestRunner = new MockTestRunner(tp);

        tr.run();
        assert(tr.succeeded, `should have succeeded: ${tr.stderr}`);

        done();
    });
});

