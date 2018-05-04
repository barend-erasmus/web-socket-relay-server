import { Command } from './command';

export class PublishCommand extends Command {

    constructor(public data: string, public channel: string) {
        super('publish');
    }

}
