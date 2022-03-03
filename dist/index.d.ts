import * as echarts from 'echarts';
export declare class ChartsService {
    mapView: any;
    mapDom: any;
    chartConfigList: {};
    mapZoom: undefined;
    events: any[];
    constructor(mapView: any, mapDom: any);
    setListenEvents(): void;
    generateChartConfigList(chartConfigList?: {}): void;
    generateChartObject(chartConfig: {
        id: any;
        height: any;
        width: any;
        option: any;
    }): echarts.ECharts | null;
    resizeChart(chartConfig: {
        id: any;
        x: any;
        y: any;
        chartObj: {
            resize: (arg0: {
                height: number;
                width: number;
            }) => void;
        };
        height: number;
        width: number;
    }): void;
    toScreenAllCharts(chartConfigList?: {}): void;
    clearAllCharts(): void;
    destroy(): void;
}
