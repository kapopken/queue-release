import { WebApi, getPersonalAccessTokenHandler } from 'vso-node-api/WebApi';
import { IReleaseApi } from 'vso-node-api/ReleaseApi';
import { IConfiguration } from './configuration';
import { IBuildApi } from 'vso-node-api/BuildApi';

export class VstsApi {
    api: WebApi;
    constructor(
        private config: IConfiguration
    ) { 
        this.api = this.createConnection(this.config.baseUrl, this.config.accessToken);
    }

    /**
    * Create Build Api connection
    * @param teamFoundationUri Team Foundation server uri
    * @param accessToken OAuth token
    */
    public async getReleaseApi(): Promise<IReleaseApi> {
        return await this.api.getReleaseApi();
    }
    public async getBuildApi(): Promise<IBuildApi> {
        return await this.api.getBuildApi();
    }
    private createConnection(teamFoundationUri: string, accessToken: string): WebApi {
        let creds = getPersonalAccessTokenHandler(accessToken);
        let connection = new WebApi(teamFoundationUri, creds);
        return connection;
    }
}