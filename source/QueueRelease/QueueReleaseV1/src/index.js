"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_1 = require("vsts-task-lib/task");
const release_worker_1 = require("./release-worker");
const vsts_api_1 = require("./vsts-api");
const configuration_1 = require("./configuration");
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function run() {
    try {
        // Get environment variables
        let configuration = new configuration_1.Configuration();
        let vsts = new vsts_api_1.VstsApi(configuration);
        let releaseApi = await vsts.getReleaseApi();
        let buildApi = await vsts.getBuildApi();
        let release = new release_worker_1.ReleaseWorker(releaseApi, buildApi, configuration);
        console.log("Queueing Release");
        release.queueBuild(configuration.releaseId);
        if (!configuration.runAsync) {
            console.log("Waiting on release to complete");
            let hasUnfinishedTasks;
            do {
                await sleep(2000);
                hasUnfinishedTasks = false;
                if (!(await release.getCompletedStatus())) {
                    hasUnfinishedTasks = true;
                }
                else {
                    console.log("Release Complete");
                }
            } while (hasUnfinishedTasks);
        }
        configuration.setReleaseIdOutput(release.release.id);
        task_1.setResult(task_1.TaskResult.Succeeded, `Queue build(s) finished successfully`);
    }
    catch (error) {
        console.error(error);
        task_1.setResult(task_1.TaskResult.Failed, `Queue build(s) failed`);
    }
}
run();
//# sourceMappingURL=index.js.map