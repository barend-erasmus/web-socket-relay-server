import * as Highcharts from 'highcharts';
import { CommandBuilder } from '../../builders/command-builder';
import { Command } from '../../commands/command';
import { PublishCommand } from '../../commands/publish';
import { SubscribeCommand } from '../../commands/subscribe';

function connectWebSocket(host: string): WebSocket {
    console.log('Connecting...');

    const socket: WebSocket = new (window as any).WebSocket(host);

    socket.onclose = (closeEvent: CloseEvent) => {
        console.log('Disconnected.');

        if (closeEvent.code === 1000) {
            return;
        }

        connectWebSocket(host);
    };

    socket.onmessage = (event: { data: any }) => onMessage(event);

    socket.onopen = (openEvent: Event) => onOpen(openEvent, socket);

    return socket;
}

function onMessage(event: { data: any }): void {
    const commandBuilder: CommandBuilder = new CommandBuilder();

    const command: Command = commandBuilder.build(JSON.parse(event.data));

    if (command instanceof PublishCommand) {
        const publishCommand: PublishCommand = command as PublishCommand;

        incrementPieChart(languagesPieChart, publishCommand.data.language);
        incrementPieChart(platformPieChart, publishCommand.data.platform);
        incrementPieChart(userAgentPieChart, publishCommand.data.userAgent);
    }
}

connectWebSocket('ws://events.openservices.co.za');

function onOpen(openEvent: Event, socket: WebSocket): void {
    if (socket.readyState === 1) {
        console.log('Connected.');

        const subscribeCommand: SubscribeCommand = new SubscribeCommand('431472d7-138b-4ba9-a750-e4c9d627ffaa');

        socket.send(JSON.stringify(subscribeCommand));
    }
}

function incrementPieChart(chart, name: string): void {
    let existingPoint = null;

    for (const point of chart.series[0].data) {
        if (point.name === name) {
            existingPoint = point;
        }
    }

    if (existingPoint) {
        const existingValue: number = existingPoint.y;
        existingPoint.update(existingValue + 1);
    } else {
        chart.series[0].addPoint({
            name,
            y: 1,
        });
    }
}

const languagesPieChart = Highcharts.chart('languagesPieChart', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false,
            },
            showInLegend: true,
        },
    },
    series: [{
        colorByPoint: true,
        data: [],
        name: 'Languages',
    }],
    title: {
        text: 'Languages',
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
});

const platformPieChart = Highcharts.chart('platformPieChart', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false,
            },
            showInLegend: true,
        },
    },
    series: [{
        colorByPoint: true,
        data: [],
        name: 'Platforms',
    }],
    title: {
        text: 'Platforms',
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
});

const userAgentPieChart = Highcharts.chart('userAgentPieChart', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false,
            },
            showInLegend: true,
        },
    },
    series: [{
        colorByPoint: true,
        data: [],
        name: 'User Agents',
    }],
    title: {
        text: 'User Agents',
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
});
