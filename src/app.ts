import * as WebSocket from 'ws';
import { CommandBuilder } from './builders/command-builder';
import { Command } from './commands/command';
import { PublishCommand } from './commands/publish';
import { SubscribeCommand } from './commands/subscribe';
import { Client } from './models/client';

const server: WebSocket.Server = new WebSocket.Server({ port: 8891 });

const clients: Client[] = [];

const commandBuilder: CommandBuilder = new CommandBuilder();

server.on('connection', (socket: WebSocket) => {
    const client: Client = new Client(socket, []);

    clients.push(client);

    client.socket.on('message', (message: string) => {
        const command: Command = commandBuilder.build(JSON.parse(message));

        if (command instanceof PublishCommand) {
            const publishCommand: PublishCommand = command as PublishCommand;

            for (const c of clients) {
                console.log(`Client subscribed to [${c.subscribedChannels.join(',')}]`);

                if (c.subscribedChannels.indexOf(publishCommand.channel) > -1) {
                    console.log('Sending to subscriber');
                    c.socket.send(JSON.stringify(publishCommand));
                }
            }

            console.log(`Command: '${command.type}' '${publishCommand.channel}' [${client.subscribedChannels.join(',')}]`);
        }

        if (command instanceof SubscribeCommand) {
            const subscribeCommand: SubscribeCommand = command as SubscribeCommand;

            client.subscribe(subscribeCommand.channel);

            console.log(`Command: '${command.type}' '${subscribeCommand.channel}' [${client.subscribedChannels.join(',')}]`);
        }

    });

    client.socket.on('close', () => {
        const index: number = clients.indexOf(client);

        if (index > -1) {
            clients.splice(index, 1);
        }

        console.log(`Closed client subscriber to [${client.subscribedChannels.join(',')}]`);
    });

});

console.log(`listening on port 8891`);
