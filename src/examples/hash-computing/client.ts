import * as uuid from 'uuid';
import { CommandBuilder } from '../../builders/command-builder';
import { Command } from '../../commands/command';
import { PublishCommand } from '../../commands/publish';
import { WebSocketClient } from '../../web-socket-client';

const id: string = uuid.v4();

const host: string = 'ws://events.openservices.co.za';

const webSocketClientInstance: WebSocketClient = new WebSocketClient(host, onMessage, null,  [
    '84cdbfdc-48ca-4bc6-a862-f576e24cad1f',
    id,
]);

webSocketClientInstance.connect();

function onMessage(event: { data: string }, webSocketClient: WebSocketClient): void {
    const commandBuilder: CommandBuilder = new CommandBuilder();

    const command: Command = commandBuilder.build(JSON.parse(event.data));

    if (command instanceof PublishCommand) {
        const publishCommand: PublishCommand = command as PublishCommand;

        // TODO:
    }
}
