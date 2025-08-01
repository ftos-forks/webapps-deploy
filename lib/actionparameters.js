"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionParameters = exports.appKindMap = exports.WebAppKind = void 0;
const core = __importStar(require("@actions/core"));
const SiteContainer_1 = require("azure-actions-appservice-rest/Arm/SiteContainer");
const github = require('@actions/github');
var WebAppKind;
(function (WebAppKind) {
    WebAppKind[WebAppKind["Windows"] = 0] = "Windows";
    WebAppKind[WebAppKind["Linux"] = 1] = "Linux";
    WebAppKind[WebAppKind["WindowsContainer"] = 2] = "WindowsContainer";
    WebAppKind[WebAppKind["LinuxContainer"] = 3] = "LinuxContainer";
})(WebAppKind || (exports.WebAppKind = WebAppKind = {}));
;
exports.appKindMap = new Map([
    ['app', WebAppKind.Windows],
    ['app,linux', WebAppKind.Linux],
    ['app,container,windows', WebAppKind.WindowsContainer],
    ['app,linux,container', WebAppKind.LinuxContainer],
    ['api', WebAppKind.Windows],
]);
class ActionParameters {
    constructor(endpoint) {
        this._publishProfileContent = core.getInput('publish-profile');
        this._appName = core.getInput('app-name');
        this._slotName = core.getInput('slot-name');
        this._packageInput = core.getInput('package');
        this._images = core.getInput('images');
        this._multiContainerConfigFile = core.getInput('configuration-file');
        this._startupCommand = core.getInput('startup-command');
        this._resourceGroupName = core.getInput('resource-group-name');
        /**
         * Trimming the commit message because it is used as a param in uri of deployment api. And sometimes, it exceeds the max length of http URI.
         */
        this._commitMessage = github.context.eventName === 'push' ? github.context.payload.head_commit.message.slice(0, 1000) : "";
        this._endpoint = endpoint;
        // Used only for OneDeploy
        this._type = core.getInput('type');
        this._targetPath = core.getInput('target-path');
        this._clean = core.getInput('clean');
        this._restart = core.getInput('restart');
        // Used for Sitecontainers app.
        const siteContainersConfigInput = core.getInput('sitecontainers-config');
        if (siteContainersConfigInput) {
            const raw = JSON.parse(siteContainersConfigInput);
            this._siteContainers = raw.map(SiteContainer_1.SiteContainer.fromJson);
        }
        else {
            this._siteContainers = null;
        }
        this._blessedAppSitecontainers = false;
    }
    static getActionParams(endpoint) {
        if (!this.actionparams) {
            this.actionparams = new ActionParameters(!!endpoint ? endpoint : null);
        }
        return this.actionparams;
    }
    get appName() {
        return this._appName;
    }
    get commitMessage() {
        return this._commitMessage;
    }
    set commitMessage(commitMessage) {
        this._commitMessage = commitMessage;
    }
    get packageInput() {
        return this._packageInput;
    }
    get package() {
        return this._package;
    }
    set package(appPackage) {
        this._package = appPackage;
    }
    get images() {
        return this._images;
    }
    get resourceGroupName() {
        return this._resourceGroupName;
    }
    set resourceGroupName(rg) {
        this._resourceGroupName = rg;
    }
    get kind() {
        return this._kind;
    }
    set kind(kind) {
        this._kind = kind;
    }
    get realKind() {
        return this._realKind;
    }
    set realKind(kind) {
        this._realKind = kind;
    }
    get endpoint() {
        return this._endpoint;
    }
    get publishProfileContent() {
        return this._publishProfileContent;
    }
    get slotName() {
        return this._slotName;
    }
    get isMultiContainer() {
        return this._isMultiContainer;
    }
    set isMultiContainer(isMultiCont) {
        this._isMultiContainer = isMultiCont;
    }
    get isLinux() {
        return this._isLinux;
    }
    set isLinux(isLin) {
        this._isLinux = isLin;
    }
    get startupCommand() {
        return this._startupCommand;
    }
    get multiContainerConfigFile() {
        return this._multiContainerConfigFile;
    }
    get type() {
        return this._type;
    }
    set type(type) {
        this._type = type;
    }
    get targetPath() {
        return this._targetPath;
    }
    get clean() {
        return this._clean;
    }
    get restart() {
        return this._restart;
    }
    get siteContainers() {
        return this._siteContainers;
    }
    set siteContainers(siteContainers) {
        this._siteContainers = siteContainers;
    }
    get blessedAppSitecontainers() {
        return this._blessedAppSitecontainers;
    }
    set blessedAppSitecontainers(blessedAppSitecontainers) {
        this._blessedAppSitecontainers = blessedAppSitecontainers;
    }
}
exports.ActionParameters = ActionParameters;
