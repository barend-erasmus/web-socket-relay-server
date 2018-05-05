import { CommandBuilder } from '../../builders/command-builder';
import { Command } from '../../commands/command';
import { PublishCommand } from '../../commands/publish';
import { SubscribeCommand } from '../../commands/subscribe';

const host: string = 'ws://159.65.63.90:8891';

const socket: WebSocket = new (window as any).WebSocket(host);

let numberOfCommands: number = 0;

socket.onopen = () => {
    if (socket.readyState === 1) {
        const subscribeCommand: SubscribeCommand = new SubscribeCommand('431472d7-138b-4ba9-a750-e4c9d627ffaa');

        socket.send(JSON.stringify(subscribeCommand));
    }
};

socket.onmessage = (event: { data: any }) => {
    const commandBuilder: CommandBuilder = new CommandBuilder();

    const command: Command = commandBuilder.build(JSON.parse(event.data));

    if (command instanceof PublishCommand) {
        const publishCommand: PublishCommand = command as PublishCommand;

        numberOfCommands ++;

        document.querySelector('span#numberOfCommands').innerHTML = numberOfCommands.toString();

        document.querySelector('span#timestampOfLastCommand').innerHTML = new Date().toString();
    }
};
