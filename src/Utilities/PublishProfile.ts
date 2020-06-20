var core = require("@actions/core");

import { FormatType, SecretParser } from 'actions-secret-parser';
import { Kudu } from 'azure-actions-appservice-rest/Kudu/azure-app-kudu-service';

import RuntimeConstants from '../RuntimeConstants';

export interface ScmCredentials {
    uri: string;
    username: string;
    password: string;
}

export class PublishProfile {
    private _creds: ScmCredentials;
    private _appUrl: string;
    private _appOS: string;
    private _kuduService: any;
    private static _publishProfile: PublishProfile;

    private constructor(publishProfileContent: string) {
        try {
            let secrets = new SecretParser(publishProfileContent, FormatType.XML);
            this._creds = {
                uri: secrets.getSecret("//publishProfile/@publishUrl", false),
                username: secrets.getSecret("//publishProfile/@userName", true),
                password: secrets.getSecret("//publishProfile/@userPWD", true)
            };
            this._appUrl = secrets.getSecret("//publishProfile/@destinationAppUrl", false);
            if(this._creds.uri.indexOf("scm") < 0) {
                throw new Error("Publish profile does not contain kudu URL");
            }
            this._creds.uri = `https://${this._creds.uri}`;
            this._kuduService = new Kudu(this._creds.uri, this._creds.username, this._creds.password);
            this.setAppOS();
        } catch(error) {
            core.error("Failed to fetch credentials from Publish Profile. For more details on how to set publish profile credentials refer https://aka.ms/create-secrets-for-GitHub-workflows");
            throw error;
        }
    }

    public static getPublishProfile(publishProfileContent: string) {
        if(!this._publishProfile) {
            this._publishProfile = new PublishProfile(publishProfileContent);
        }
        return this._publishProfile;
    }

    public get creds(): ScmCredentials {
        return this._creds;
    }

    public get appUrl(): string {
        return this._appUrl;
    }

    public get kuduService() {
        return this._kuduService;
    }

    public get appOS() {
        return this._appOS;
    }

    private async setAppOS() {
        try {
            const appRuntimeDetails = await this._kuduService.getAppRuntime();
            this._appOS = appRuntimeDetails[RuntimeConstants.system][RuntimeConstants.osName];
        }
        catch(error) {
            throw Error("Internal Server Error. Please try again\n" + error);
        }
    }

}