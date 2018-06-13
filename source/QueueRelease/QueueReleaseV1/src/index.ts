import { TaskResult, setResult } from 'vsts-task-lib/task';
import {ReleaseWorker, IQueueRunner} from "./release-worker";
import { VstsApi} from "./vsts-api";
import { IConfiguration, ConfigurationTest, Configuration } from './configuration';

function sleep(ms): Promise<{}> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function run() {

    try {
        // Get environment variables
        let configuration = new Configuration();
        let vsts = new VstsApi(configuration);
        let releaseApi = await vsts.getReleaseApi();
        let buildApi = await vsts.getBuildApi();
        let release: IQueueRunner = new ReleaseWorker(releaseApi, buildApi, configuration);

        console.log("Queueing Release");
        release.queueBuild(configuration.releaseId);

        if(!configuration.runAsync) {
            console.log("Waiting on release to complete");

            let hasUnfinishedTasks;
            do {
                await sleep(2000);
                hasUnfinishedTasks = false;
                if (!(await release.getCompletedStatus())) {
                    hasUnfinishedTasks = true;
                } else {
                    console.log("Release Complete");
                }
            } while (hasUnfinishedTasks);
    
        }
      
        configuration.setReleaseIdOutput(release.release.id);

        setResult(TaskResult.Succeeded, `Queue build(s) finished successfully`);
    }
    catch (error) {
        console.error(error);
        setResult(TaskResult.Failed, `Queue build(s) failed`);
    }
}

run();