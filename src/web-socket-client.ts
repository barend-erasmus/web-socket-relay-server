import { PublishCommand } from './commands/publish';
import { SubscribeCommand } from './commands/subscribe';

export class WebSocketClient {

    protected socket: WebSocket = null;

    constructor(
        protected host: string,
        protected onMessageFn: (event: { data: string }, webSocketClient: WebSocketClient) => void,
        protected onOpenFn: (event: Event, webSocketClient: WebSocketClient) => void,
        protected subscribedChannels: string[],
    ) {

    }

    public async connect(): Promise<void> {
        this.socket = new (window as any).WebSocket(this.host);

        this.socket.onclose = (closeEvent: CloseEvent) => this.onClose(closeEvent);

        this.socket.onmessage = (event: { data: any }) => {
            if (this.onMessageFn) {
                this.onMessageFn(event, this);
            }
        };

        this.socket.onopen = (openEvent: Event) => this.onOpen(openEvent);
    }

    public sendPublish(channel: string, data: any): void {
        this.socket.send(JSON.stringify(new PublishCommand(channel, data)));
    }

    protected onClose(closeEvent: CloseEvent): void {
        console.log('Disconnected.');

        if (closeEvent.code === 1000) {
            return;
        }

        console.log('Reconnecting.');
        this.connect();
    }

    protected onOpen(event: Event): void {
        if (this.socket.readyState === 1) {
            console.log('Connected.');

            for (const channel of this.subscribedChannels) {
                const subscribeCommand: SubscribeCommand = new SubscribeCommand(channel);
                this.socket.send(JSON.stringify(subscribeCommand));
            }

            if (this.onOpenFn) {
                this.onOpenFn(event, this);
            }
        }
    }

}
