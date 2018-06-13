"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebApi_1 = require("vso-node-api/WebApi");
class VstsApi {
    constructor(config) {
        this.config = config;
        this.api = this.createConnection(this.config.baseUrl, this.config.accessToken);
    }
    /**
    * Create Build Api connection
    * @param teamFoundationUri Team Foundation server uri
    * @param accessToken OAuth token
    */
    async getReleaseApi() {
        return await this.api.getReleaseApi();
    }
    async getBuildApi() {
        return await this.api.getBuildApi();
    }
    createConnection(teamFoundationUri, accessToken) {
        let creds = WebApi_1.getPersonalAccessTokenHandler(accessToken);
        let connection = new WebApi_1.WebApi(teamFoundationUri, creds);
        return connection;
    }
}
exports.VstsApi = VstsApi;
//# sourceMappingURL=vsts-api.js.map