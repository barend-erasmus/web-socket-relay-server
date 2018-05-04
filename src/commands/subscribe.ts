import { Command } from './command';

export class SubscribeCommand extends Command {

    constructor(public channel: string) {
        super('subscribe');
    }

}
