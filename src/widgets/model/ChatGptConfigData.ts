import {WidgetData} from "@widget-js/core";

export type ProxyProtocol = 'http' | 'https' | 'sock5' | 'sock4'

export class ChatGptConfigData extends WidgetData {
    proxy?: string;
    shortcut: string = 'Meta+Alt+C';
    protocol: ProxyProtocol = 'http';
    port?: string;
    host?: string;

    getProxyRule(): string {
        return `${this.protocol}://${this.host}:${this.port}`
    }

    hasProxyRule(): boolean {
        return !!(this.protocol && this.host && this.port)
    }
}
