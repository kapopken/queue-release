"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_1 = require("vsts-task-lib/task");
class Configuration {
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
    getReleaseOutputId() {
        return task_1.getVariable("releaseIdOutputVariable");
    }
    getManualEnvironments() {
        let environments = task_1.getVariable('manualEnvironments');
        if (environments == null || environments == '') {
            return [];
        }
        return environments.split(",");
    }
    /**
 * Get the current buildId
 */
    getBuildId() {
        return Number(task_1.getVariable("build.BuildId"));
    }
    /**
 * Get is Release Definition
 */
    getReleaseDefinitionId() {
        let releaseId = task_1.getVariable('releaseDefinitionId');
        if (releaseId == null || releaseId == '' || isNaN(Number(releaseId))) {
            throw new Error("Missing required Release Definition ID or not a number");
        }
        return Number(releaseId);
    }
    /**
   * Get run async
   */
    getRunAsync() {
        return task_1.getBoolInput('runAsync', false);
    }
    /**
    * Get artifact Name for
    */
    getArtifactName() {
        let artifactName = task_1.getVariable('artifactName');
        if (artifactName == null || artifactName == '') {
            return task_1.getVariable('artifactName');
        }
        return artifactName;
    }
    /**
   * Get request for
   */
    getRequestedFor() {
        let requestedForId = task_1.getVariable('requestedForId');
        if (requestedForId == null || requestedForId == '') {
            "";
        }
        return requestedForId;
    }
    /**
     * Get access token
     */
    getAccessToken() {
        let customAuthToken = task_1.getInput('authToken', false);
        if (customAuthToken != null && customAuthToken.trim() != '') {
            return customAuthToken;
        }
        let auth = task_1.getEndpointAuthorization('SYSTEMVSSCONNECTION', true);
        if (auth == null) {
            return task_1.getVariable("system.accessToken");
        }
        return auth.parameters['AccessToken'];
    }
    /**
     * Get current team project
     */
    getTeamProject() {
        return task_1.getVariable('system.teamProject');
    }
    /**
     * Get team foundation server uri
     */
    getTeamFoundationUri() {
        return task_1.getVariable('system.teamFoundationCollectionUri');
    }
    /**
     * Set output parameter
     */
    setReleaseIdOutput(releaseId) {
        task_1.setVariable(this.releaseIdOutputVariable, releaseId.toString());
    }
}
exports.Configuration = Configuration;
class ConfigurationTest {
    constructor() {
        this.teamProject = "SampleApps";
        this.manualEnvironments = [];
        this.runAsync = false;
        //public artifact: string = "kubernetes.128";
        this.accessToken = "ud3lhw6kbgonjqrvuoehmfwpg5kwgv3erdaj7nmakf5pyajlzgoa";
        this.baseUrl = "https://kdizzle.visualstudio.com";
        this.buildId = 129;
        this.artifactName = "_SampleApps-CI";
        this.releaseId = 1;
    }
    setReleaseIdOutput(releaseId) {
    }
}
exports.ConfigurationTest = ConfigurationTest;
//# sourceMappingURL=configuration.js.map