"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsService = void 0;
/**
 * @描述: 关于charts的服务
 * @作者: 张俊
 * @创建时间: 2022-03-02 10:50:08
 */
// @ts-ignore
var jquery_1 = __importDefault(require("jquery"));
var echarts = __importStar(require("echarts"));
var ChartsService = /** @class */ (function () {
    function ChartsService(mapView, mapDom) {
        var _this = this;
        this.chartConfigList = [];
        // 所以事件
        this.events = [];
        this.mapView = mapView;
        this.mapDom = mapDom;
        if (this.mapView) {
            this.mapView.when(function () {
                _this.setListenEvents();
            });
        }
    }
    ChartsService.prototype.setListenEvents = function () {
        var _this = this;
        // 监听地图变化事件，刷新统计图位置
        this.mapView.watch('extent', function () {
            _this.toScreenAllCharts();
        });
    };
    // 生成所有chart的配置文件
    ChartsService.prototype.generateChartConfigList = function (chartConfigList) {
        if (chartConfigList === void 0) { chartConfigList = []; }
        this.clearAllCharts();
        this.chartConfigList = __spreadArray([], chartConfigList);
        this.toScreenAllCharts();
    };
    // 生成chart对象
    ChartsService.prototype.generateChartObject = function (chartConfig) {
        jquery_1.default(this.mapDom)
            .append("<div id=\"" + chartConfig.id + "\" class=\"chartDiv\" style=\"height:" + (chartConfig.height || 0) + "px;width:" + (chartConfig.width || 0) + "px;position:absolute;\"></div>"); // 往mapview追加存放图表的DOM元素
        var dom = document.getElementById(chartConfig.id); // 绘制图表
        if (dom) {
            var myChart = echarts.init(dom);
            myChart.setOption(chartConfig.option);
            return myChart;
        }
        return null;
    };
    // 调整图表位置及大小函数
    ChartsService.prototype.resizeChart = function (chartConfig) {
        var chartJqueryObject = jquery_1.default("#" + chartConfig.id);
        chartJqueryObject.css('transform', "translate3d(" + chartConfig.x + "px, " + chartConfig.y + "px, 0)");
        var zoom = this.mapView.zoom;
        if (this.mapZoom !== zoom) {
            this.mapZoom = zoom;
            if (chartConfig === null || chartConfig === void 0 ? void 0 : chartConfig.chartObj) {
                chartConfig.chartObj.resize({
                    height: zoom * chartConfig.height,
                    width: zoom * chartConfig.width,
                });
            }
        }
    };
    // 刷新所有的chart到地图上
    ChartsService.prototype.toScreenAllCharts = function (chartConfigList) {
        var _this = this;
        if (chartConfigList === void 0) { chartConfigList = this.chartConfigList; }
        chartConfigList.forEach(function (chartConfig) {
            var x = chartConfig.x, y = chartConfig.y, chartObj = chartConfig.chartObj;
            // 坐标转换
            var mapPoint = {
                x: x,
                y: y,
                spatialReference: _this.mapView.spatialReference,
            };
            var screenPoint = _this.mapView.toScreen(mapPoint);
            if (!chartObj) {
                chartConfig.chartObj = _this.generateChartObject(chartConfig);
            }
            _this.resizeChart(__assign(__assign({}, chartConfig), { x: screenPoint.x, y: screenPoint.y }));
        });
    };
    // 清空所有的charts
    ChartsService.prototype.clearAllCharts = function () {
        this.mapZoom = undefined;
        jquery_1.default(this.mapDom)
            .children('.chartDiv')
            .remove();
    };
    // 销毁当前服务
    ChartsService.prototype.destroy = function () {
        // @ts-ignore
        this.events.forEach(function (event) {
            event.remove();
        });
        this.events = [];
        this.clearAllCharts();
    };
    return ChartsService;
}());
exports.ChartsService = ChartsService;
//# sourceMappingURL=index.js.map