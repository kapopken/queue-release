import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'src','index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('runAsync', process.env['runAsync']);
tmr.setInput('releaseDefinitionId', process.env['releaseDefinitionId']);
tmr.setInput('build.BuildId', process.env['buildId']);
tmr.setInput('artifactName', process.env['artifactName']);
tmr.setInput('authToken', process.env['authToken']);
tmr.setInput('requestedForId', process.env['requestedForId']);
tmr.setInput('system.teamProject', process.env['teamProject']);
tmr.setInput('system.teamFoundationCollectionUri', process.env['teamFoundationCollectionUri']);

var mockBuildApi = require('./mock-release-api');

// Mock a specific module function called in task 
tmr.registerMock('./release-worker', mockBuildApi);

tmr.run();