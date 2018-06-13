"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BuildInterfaces_1 = require("vso-node-api/interfaces/BuildInterfaces");
class BuildApi {
    constructor(buildApi) {
        this.buildApi = buildApi;
    }
    async queueBuild(build, project, ignoreWarnings) {
        let result = await this.buildApi.queueBuild(build, project, ignoreWarnings);
        result.status = BuildInterfaces_1.BuildStatus.Cancelling;
        this.buildApi.updateBuild(result, result.id, project);
        return result;
    }
    getDefinitions(project) {
        return this.buildApi.getDefinitions(project);
    }
    async getBuild(buildId) {
        let build = await this.buildApi.getBuild(buildId);
        build.status = BuildInterfaces_1.BuildStatus.Completed;
        build.result = BuildInterfaces_1.BuildResult.Succeeded;
        return build;
    }
}
exports.BuildApi = BuildApi;
//# sourceMappingURL=mock-build-api.js.map