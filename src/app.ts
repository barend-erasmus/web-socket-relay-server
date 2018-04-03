import * as UUID from 'uuid';
import * as WebSocket from 'ws';
import { Client } from './models/client';
import { Message } from './models/message';

const server: WebSocket.Server = new WebSocket.Server({ port: 8891 });

const clients: Client[] = [];

server.on('connection', (socket: any) => {
    const client: Client = new Client(UUID.v4(), null, socket);

    clients.push(client);

    client.socket.on('message', (rawMessage: string) => {
        console.log(rawMessage);

        const message: Message = JSON.parse(rawMessage);

        if (message.command === 'set-key' && message.to === 'server') {
            client.key = message.data;

            const clientsForKey: Client[] = clients.filter((x) => x.key === client.key && x.id !== client.id);

            for (const x of clientsForKey) {
                x.socket.send(JSON.stringify(new Message('client-opened', null, client.id, 'server', x.id)));
            }

            client.socket.send(JSON.stringify(new Message(message.command, message.correlationId, null, 'server', client.id)));

            console.log(`SET-KEY: ${message.data}`);
        } else if (message.command === 'list-clients' && message.to === 'server') {
            const clientsForKey: Client[] = clients.filter((x) => x.key === client.key);

            client.socket.send(JSON.stringify(new Message(message.command, message.correlationId, clients.map((x) => x.id), 'server', client.id)));

            console.log(`LIST-CLIENTS: ${client.key}`);
        } else if (message.to !== 'server') {
            const toClient: Client = clients.find((x) => x.id === message.to);

            if (!toClient) {
                return;
            }

            toClient.socket.send(JSON.stringify(new Message(message.command, message.correlationId, message.data, client.id, message.to)));

            console.log(`MESSAGE: ${message.to}`);
        }
    });

    client.socket.on('close', function close() {
        const index: number = clients.indexOf(client);

        if (index > -1) {
            clients.splice(index, 1);
        }

        const clientsForKey: Client[] = clients.filter((x) => x.key === client.key && x.id !== client.id);

        for (const x of clientsForKey) {
            x.socket.send(JSON.stringify(JSON.stringify(new Message('client-closed', null, client.id, 'server', x.id))));
        }
    });

});

console.log(`listening on port 8891`);
