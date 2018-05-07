import { PublishCommand } from '../../commands/publish';

const host: string = 'ws://events.openservices.co.za';

const socket: WebSocket = new (window as any).WebSocket(host);

socket.onopen = (event: Event) => {
    if (socket.readyState === 1) {
        const publishCommand: PublishCommand = new PublishCommand({
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
        }, '431472d7-138b-4ba9-a750-e4c9d627ffaa');

        socket.send(JSON.stringify(publishCommand));
    }
};
