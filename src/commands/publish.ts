import { Command } from './command';

export class PublishCommand extends Command {

    constructor(public data: any, public channel: string) {
        super('publish');
    }

}
