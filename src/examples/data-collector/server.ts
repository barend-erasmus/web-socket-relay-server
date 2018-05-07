import * as Highcharts from 'highcharts';
import { CommandBuilder } from '../../builders/command-builder';
import { Command } from '../../commands/command';
import { PublishCommand } from '../../commands/publish';
import { WebSocketClient } from '../../web-socket-client';

function onMessage(event: { data: any }, webSocketClient: WebSocketClient): void {
    const commandBuilder: CommandBuilder = new CommandBuilder();

    const command: Command = commandBuilder.build(JSON.parse(event.data));

    if (command instanceof PublishCommand) {
        const publishCommand: PublishCommand = command as PublishCommand;

        incrementPieChart(hostnamesPieChart, publishCommand.data.hostname);
        incrementPieChart(languagesPieChart, publishCommand.data.language);
        incrementPieChart(pathnamesPieChart, publishCommand.data.pathname);
        incrementPieChart(platformsPieChart, publishCommand.data.platform);
        incrementPieChart(userAgentsPieChart, publishCommand.data.userAgent);
    }
}

const host: string = 'ws://events.openservices.co.za';

const webSocketClientInstance: WebSocketClient = new WebSocketClient(host, onMessage, null,  [
    '431472d7-138b-4ba9-a750-e4c9d627ffaa',
]);

webSocketClientInstance.connect();

function incrementPieChart(chart: any, name: string): void {
    if (!name) {
        return;
    }

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

const hostnamesPieChart = Highcharts.chart('hostnamesPieChart', {
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
        name: 'Hostnames',
    }],
    title: {
        text: 'Hostnames',
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
});

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

const pathnamesPieChart = Highcharts.chart('pathnamesPieChart', {
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
        name: 'Pathnames',
    }],
    title: {
        text: 'Pathnames',
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
});

const platformsPieChart = Highcharts.chart('platformsPieChart', {
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

const userAgentsPieChart = Highcharts.chart('userAgentsPieChart', {
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
