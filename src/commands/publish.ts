import { Command } from './command';

export class PublishCommand extends Command {

    constructor(public channel: string, public data: any) {
        super('publish');
    }

}
