import { getInput, getVariable,  getEndpointAuthorization, getBoolInput, setVariable } from 'vsts-task-lib/task';
export interface IConfiguration {
    teamProject: string;
//artifact: string;
    runAsync: boolean;
    baseUrl: string;
    accessToken: string;
    buildId: number;
    releaseId: number;
    artifactName: string;
    manualEnvironments: string[];
    setReleaseIdOutput(releaseId: number);
}

export class Configuration implements IConfiguration {
    //public artifact: string;
    public requestedFor: string | null;
    public runAsync: boolean;
    public accessToken: string;
    public baseUrl: string;
    public buildId: number;
    public teamProject: string;
    public artifactName: string;
    public releaseId: number;
    public manualEnvironments: string[];
    public releaseIdOutputVariable: string;
    constructor() {
        this.baseUrl = this.getTeamFoundationUri();
        this.requestedFor = this.getRequestedFor();
        this.runAsync = this.getRunAsync();
        this.teamProject = this.getTeamProject();
        this.releaseId = this.getReleaseDefinitionId();
        this.accessToken = this.getAccessToken();
        this.buildId = this.getBuildId();
        this.artifactName = this.getArtifactName();
        this.manualEnvironments = this.getManualEnvironments();
        this.releaseIdOutputVariable = this.getReleaseOutputId();


    }
    public getReleaseOutputId(): string {
        return getVariable("releaseIdOutputVariable");
    }
    private getManualEnvironments(): string [] {
        let environments = getVariable('manualEnvironments');
        if (environments == null || environments == '') {
            return [];
        }
        return environments.split(",");
    }
        /**
     * Get the current buildId
     */
    private getBuildId(): number {
        return Number(getVariable("build.BuildId"));
    }
        /**
     * Get is Release Definition
     */
    private getReleaseDefinitionId(): number {
        let releaseId = getVariable('releaseDefinitionId');
        if (releaseId == null || releaseId == '' || isNaN(Number(releaseId))) {
            throw new Error("Missing required Release Definition ID or not a number");
        }
        return Number(releaseId);
    }
      /**
     * Get run async
     */
    private getRunAsync(): boolean {
        return getBoolInput('runAsync', false);
    }
     /**
     * Get artifact Name for
     */
    private getArtifactName(): string {
        let artifactName = getVariable('artifactName');
        if (artifactName == null || artifactName == '') {
            return getVariable('artifactName');
        }
        return artifactName;
    }
      /**
     * Get request for
     */
    private getRequestedFor(): string {
        let requestedForId = getVariable('requestedForId');
        if (requestedForId == null || requestedForId == '') {
             "";
        }
        return requestedForId;
    }
    /**
     * Get access token
     */
    private getAccessToken(): string {
        let customAuthToken = getInput('authToken', false);

        if (customAuthToken != null && customAuthToken.trim() != '') {
            return customAuthToken;
        }

        let auth = getEndpointAuthorization('SYSTEMVSSCONNECTION', true);
        if (auth == null) {
            return getVariable("system.accessToken");
        }
        return auth.parameters['AccessToken'];
    }
    /**
     * Get current team project
     */
    private getTeamProject(): string {
        return getVariable('system.teamProject');
    }

    /**
     * Get team foundation server uri
     */
    private getTeamFoundationUri(): string {
        return getVariable('system.teamFoundationCollectionUri');
    
    }
    /**
     * Set output parameter
     */
    public setReleaseIdOutput(releaseId: number) {
        setVariable(this.releaseIdOutputVariable, releaseId.toString());
    }
}
export class ConfigurationTest implements IConfiguration {
    public teamProject: string = "SampleApps";   
    public manualEnvironments: string [] = [];
    public runAsync: boolean = false;
    //public artifact: string = "kubernetes.128";
    public accessToken: string = "";
    public baseUrl: string = "https://*.visualstudio.com";
    public buildId: number = 129;
    public artifactName: string = "_SampleApps-CI";
    public releaseId: number = 1;
    public setReleaseIdOutput(releaseId: number) {
        
    }

}