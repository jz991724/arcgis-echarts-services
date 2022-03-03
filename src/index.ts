/**
 * @描述: 关于charts的服务
 * @作者: 张俊
 * @创建时间: 2022-03-02 10:50:08
 */
// @ts-ignore
import $ from 'jquery';
import * as echarts from 'echarts';

export class ChartsService {
    mapView;

    mapDom;

    chartConfigList = [];

    mapZoom: undefined;

    // 所以事件
    events: any[] = [];

    constructor(mapView: any, mapDom: any) {
        this.mapView = mapView;
        this.mapDom = mapDom;

        if (this.mapView) {
            this.mapView.when(() => {
                this.setListenEvents();
            });
        }
    }

    setListenEvents() {
        // 监听地图变化事件，刷新统计图位置
        this.mapView.watch('extent', () => {
            this.toScreenAllCharts();
        });
    }

    // 生成所有chart的配置文件
    generateChartConfigList(chartConfigList = []) {
        this.clearAllCharts();

        this.chartConfigList = [...chartConfigList];
        this.toScreenAllCharts();
    }

    // 生成chart对象
    generateChartObject(chartConfig: { id: any; height: any; width: any; option: any; }) {
        $(this.mapDom)
            .append(`<div id="${chartConfig.id}" class="chartDiv" style="height:${chartConfig.height || 0}px;width:${chartConfig.width || 0}px;position:absolute;"></div>`); // 往mapview追加存放图表的DOM元素

        const dom = document.getElementById(chartConfig.id); // 绘制图表
        if (dom) {
            const myChart = echarts.init(dom);
            myChart.setOption(chartConfig.option);

            return myChart;
        }
        return null;
    }

    // 调整图表位置及大小函数
    resizeChart(chartConfig: { id: any; x: any; y: any; chartObj: { resize: (arg0: { height: number; width: number; }) => void; }; height: number; width: number; }) {
        const chartJqueryObject = $(`#${chartConfig.id}`);
        chartJqueryObject.css('transform', `translate3d(${chartConfig.x}px, ${chartConfig.y}px, 0)`);

        const {zoom} = this.mapView;
        if (this.mapZoom !== zoom) {
            this.mapZoom = zoom;
            if (chartConfig?.chartObj) {
                chartConfig.chartObj.resize({
                    height: zoom * chartConfig.height,
                    width: zoom * chartConfig.width,
                });
            }
        }
    }

    // 刷新所有的chart到地图上
    toScreenAllCharts(chartConfigList = this.chartConfigList) {
        chartConfigList.forEach((chartConfig) => {
            const {
                x,
                y,
                chartObj,
            } = chartConfig;
            // 坐标转换
            const mapPoint: any = {
                x,
                y,
                spatialReference: this.mapView.spatialReference,
            };
            const screenPoint = this.mapView.toScreen(mapPoint);

            if (!chartObj) {
                chartConfig.chartObj = this.generateChartObject(chartConfig);
            }

            this.resizeChart({
                ...chartConfig,
                x: screenPoint.x,
                y: screenPoint.y,
            });
        });
    }

    // 清空所有的charts
    clearAllCharts() {
        this.mapZoom = undefined;
        $(this.mapDom)
            .children('.chartDiv')
            .remove();
    }

    // 销毁当前服务
    destroy() {
        // @ts-ignore
        this.events.forEach((event: { remove: () => void; }) => {
            event.remove();
        });
        this.events = [];

        this.clearAllCharts();
    }
}
