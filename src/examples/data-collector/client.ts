import { PublishCommand } from '../../commands/publish';

const host: string = 'ws://159.65.63.90:8891';

const socket: WebSocket = new (window as any).WebSocket(host);

socket.onopen = () => {
    if (socket.readyState === 1) {
        const publishCommand: PublishCommand = new PublishCommand({
            appCodeName: navigator.appCodeName,
            appName: navigator.appName,
            language: navigator.language,
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
