"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReleaseInterfaces_1 = require("vso-node-api/interfaces/ReleaseInterfaces");
class ReleaseWorker {
    constructor(releaseApi, buildApi, config) {
        this.releaseApi = releaseApi;
        this.buildApi = buildApi;
        this.config = config;
    }
    async getBuildVersion(buildId, teamProject) {
        let buildData = await this.buildApi.getBuild(buildId, teamProject);
        let buildVersion = {
            sourceBranch: buildData.sourceBranch,
            sourceRepositoryId: buildData.repository.id,
            sourceVersion: buildData.sourceVersion,
            commitMessage: "",
            id: buildData.id.toString(),
            name: buildData.buildNumber,
            sourcePullRequestId: null,
            sourceRepositoryType: buildData.repository.type
        };
        return buildVersion;
    }
    async queueBuild(releaseId) {
        let artifacts = [];
        if (this.config.artifactName) {
            console.log("Getting build version");
            let buildVersion = await this.getBuildVersion(this.config.buildId, this.config.teamProject);
            console.log(`Found build version with id ${buildVersion.id}`);
            let artifact = {
                alias: this.config.artifactName,
                instanceReference: buildVersion
            };
            artifacts.push(artifact);
        }
        let requestedRelease = {
            definitionId: releaseId,
            description: "queue",
            isDraft: false,
            manualEnvironments: this.config.manualEnvironments,
            properties: {},
            reason: ReleaseInterfaces_1.ReleaseReason.ContinuousIntegration,
            artifacts: artifacts
        };
        console.log("Requesting release");
        this.release = await this.releaseApi.createRelease(requestedRelease, this.config.teamProject);
        console.log(`Release Status: ${this.release.status}`);
    }
    async getCompletedStatus() {
        this.release = await this.releaseApi.getRelease(this.config.teamProject, this.release.id);
        console.log(`Release Status: ${this.release.status}`);
        return this.release.environments[0].status === ReleaseInterfaces_1.EnvironmentStatus.Succeeded;
    }
}
exports.ReleaseWorker = ReleaseWorker;
//# sourceMappingURL=release-worker.js.map