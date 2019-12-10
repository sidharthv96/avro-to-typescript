// tslint:disable
import { WebhookState } from "./WebhookStateEnum";

export interface IWebhook {
    url?: string;
    secret?: string;
    created?: string;
    state?: WebhookState;
    source_id?: string;
    delete?: boolean;
}
