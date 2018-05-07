import { PublishCommand } from '../../commands/publish';
import { WebSocketClient } from '../../web-socket-client';

const host: string = 'ws://events.openservices.co.za';

const webSocketClientInstance: WebSocketClient = new WebSocketClient(host, null, onOpen,  []);

webSocketClientInstance.connect();

function onOpen(event: Event, webSocketClient: WebSocketClient): void {
    webSocketClient.sendPublish('431472d7-138b-4ba9-a750-e4c9d627ffaa', {
        appCodeName: navigator.appCodeName,
        appName: navigator.appName,
        hostname: location.hostname,
        language: navigator.language,
        pathname: location.pathname,
        platform: navigator.platform,
        product: navigator.product,
        productSub: navigator.productSub,
        userAgent: navigator.userAgent,
        vendor: navigator.vendor,
        vendorSub: navigator.vendorSub,
    });
}
