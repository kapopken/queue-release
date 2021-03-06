import { Release,BuildVersion, EnvironmentStatus, ReleaseStartMetadata, ReleaseReason, ArtifactMetadata } from 'vso-node-api/interfaces/ReleaseInterfaces';
import { IReleaseApi } from 'vso-node-api/ReleaseApi';
import { IConfiguration } from "./configuration";
import { IBuildApi } from 'vso-node-api/BuildApi';

export interface IQueueRunner {
    queueBuild(buildId: number): Promise<void>;
    getCompletedStatus(): Promise<boolean>;
    release: Release;
}
export class ReleaseWorker implements IQueueRunner { 
    release: Release;
    constructor(
        private releaseApi: IReleaseApi,
        private buildApi: IBuildApi,
        private config: IConfiguration
    ) { 
      

    }
    public async getBuildVersion(buildId: number, teamProject: string): Promise<BuildVersion> {
        let buildData = await this.buildApi.getBuild(buildId, teamProject);
      
        let buildVersion: BuildVersion = {
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
    public async queueBuild(releaseId: number): Promise<void> {
  
        let artifacts: ArtifactMetadata[] = [];

        if(this.config.artifactName) {
            console.log("Getting build version");
           let buildVersion = await this.getBuildVersion(this.config.buildId, this.config.teamProject);
           console.log(`Found build version with id ${buildVersion.id}`);
           let artifact  = { 
                alias: this.config.artifactName, 
                instanceReference: buildVersion
            };
            artifacts.push(artifact);
        }

        let requestedRelease: ReleaseStartMetadata = { 
            definitionId: releaseId, 
            description: "queue",
            isDraft: false,
            manualEnvironments: this.config.manualEnvironments,
            properties: {},
            reason:  ReleaseReason.ContinuousIntegration,
            artifacts: artifacts
        
        };
        console.log("Requesting release");
        this.release  = await this.releaseApi.createRelease(requestedRelease, this.config.teamProject);
        console.log(`Release Status: ${this.release.status}`);
    
    }
    public async getCompletedStatus():  Promise<boolean> {
        this.release = await this.releaseApi.getRelease(this.config.teamProject, this.release.id);
        console.log(`Release Status: ${this.release.status}`);
        return this.release.environments[0].status === EnvironmentStatus.Succeeded;
    }
}