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
    async Validate(releaseId, teamProject) {
        let releaseDefinition = await this.releaseApi.getReleaseDefinition(teamProject, releaseId);
        if (null == releaseDefinition) {
            throw "Could not find release";
        }
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
        this.release.status = ReleaseInterfaces_1.ReleaseStatus.Abandoned;
        this.releaseApi.updateRelease(this.release, this.config.teamProject, this.release.id);
    }
    async getCompletedStatus() {
        this.release = await this.releaseApi.getRelease(this.config.teamProject, this.release.id);
        return true;
    }
}
exports.ReleaseWorker = ReleaseWorker;
//# sourceMappingURL=mock-release-api.js.map