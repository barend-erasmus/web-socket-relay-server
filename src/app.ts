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
        const message: Message = JSON.parse(rawMessage);

        if (message.type === 'set-key') {
            client.key = message.data;

            const clientsForKey: Client[] = clients.filter((x) => x.key === client.key && x.id !== client.id);

            for (const x of clientsForKey) {
                x.socket.send(JSON.stringify(new Message(client.id, 'server', x.id, 'client-opened')));
            }
        } else if (message.type === 'list-clients') {
            const clientsForKey: Client[] = clients.filter((x) => x.key === client.key);

            client.socket.send(JSON.stringify(new Message(JSON.stringify(clients.map((x) => x.id)), 'server', client.id, 'list-clients')));
        } else if (message.type === 'broadcast') {
            const clientsForKey: Client[] = clients.filter((x) => x.key === client.key && x.id !== client.id);

            for (const x of clientsForKey) {
                x.socket.send(JSON.stringify(new Message(message.data, message.from, x.id, null)));
            }
        } else if (message.type === null) {
            const toClient: Client = clients.find((x) => x.id === message.to);

            toClient.socket.send(JSON.stringify(new Message(message.data, message.from, toClient.id, null)));
        }
    });

    client.socket.on('close', function close() {
        const index: number = clients.indexOf(client);

        if (index > -1) {
            clients.splice(index, 1);
        }

        const clientsForKey: Client[] = clients.filter((x) => x.key === client.key && x.id !== client.id);

        for (const x of clientsForKey) {
            x.socket.send(JSON.stringify(new Message(client.id, 'server', x.id, 'client-closed')));
        }
    });

});

console.log(`listening on port 8891`);
