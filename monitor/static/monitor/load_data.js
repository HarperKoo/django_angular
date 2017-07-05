var monitorApp = angular.module('monitorApp',[]);
monitorApp.controller('SimulationCtrl', function SimulationCtrl($scope,$http){
    $scope.boxPlot;

    // 基于准备好的dom，初始化echarts实例
    var batch_size_bar = echarts.init(document.getElementById('batch_size'));
    var KPI2_bar = echarts.init(document.getElementById('kpi2'));
    var $boxPlot = echarts.init(document.getElementById('boxplot'));
    var $boxplot_net = echarts.init(document.getElementById('boxplot_net'));


    // var KPI3_bar = echarts.init(document.getElementById('kpi3'));
    // var KPI4_bar = echarts.init(document.getElementById('kpi4'));
    batch_size_bar.showLoading();
    KPI2_bar.showLoading();
    // KPI3_bar.showLoading();
    // KPI4_bar.showLoading();
    setTimeout(function(){
        $http.get('summary').then(function(response){
            $scope.simulations = response.data.simulations;
            simulation_names = [];
            batch_size = [];
            CNTR  = [];
            t11 = [];
            t5  = [];
            t1 = [];
            for(var i=0; i < $scope.simulations.length; i++){
                simulation_names.push($scope.simulations[i].ID)
                batch_size.push($scope.simulations[i].COST)
                CNTR.push($scope.simulations[i].CNTR)
                t11.push($scope.simulations[i].t11)
                t5.push($scope.simulations[i].t5)
                t1.push($scope.simulations[i].t1)
            }



            // 指定图表的配置项和数据
            var batch_size_option = {
                title: {
                    text: 'COST (1million won)'
                },
                tooltip: {},
                legend: {
                    data:['Batch Size']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },

                xAxis: {
                    // data: ["test1","test2"]
                    data: simulation_names
                },
                yAxis: {},
                series: [{
                    name: 'cost',
                    type: 'bar',
                    data: batch_size
                    // data: [40.0000,20.3,70.0000]
                }]
            };

            // 指定图表的配置项和数据
            var kpi2_option = {
                title: {
                    text: '#of truck'
                },
                tooltip: {},
                legend: {
                    data:[ '11t', '5t', '1t']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    data: simulation_names
                },
                yAxis: {},
                series: [
                    {
                        name: '11t',
                        type: 'bar',
                        data: t11
                    }
                    ,{
                        name: '5t',
                        type: 'bar',
                        data: t5
                    }
                    ,{
                        name: '1t',
                        type: 'bar',
                        data: t1
                    }
                ]
            };

            // 指定图表的配置项和数据
            var kpi3_option = {
                title: {
                    text: 'KPI3 Bar Chart'
                },
                tooltip: {},
                legend: {
                    data:['CNTR', '11t', '5t', '1t']
                },
                xAxis: {
                    data: simulation_names
                },
                yAxis: {},
                series: [{
                    name: 'CNTR',
                    type: 'bar',
                    data: CNTR
                }]
            };
            var throughput_option = {
                title: {
                    text: 'Hourly Troughput'
                },
                legend: {
                    top:'10%',
                    data:['test1','test2','test3']
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    showAllSymbol:true,
                    data: ['09:00','10:00','11:00','12:00','13:00','14:00','15:00']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'test1',
                        type:'line',
                        data:[120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name:'test2',
                        type:'line',
                        data:[220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name:'test3',
                        type:'line',
                        data:[150, 232, 201, 154, 190, 330, 410]
                    },

                ]
            };

            batch_size_bar.hideLoading();
            KPI2_bar.hideLoading();
            // KPI3_bar.hideLoading();
            // KPI4_bar.hideLoading();
            // 使用刚指定的配置项和数据显示图表。
            batch_size_bar.setOption(batch_size_option);
            KPI2_bar.setOption(kpi2_option);
            // KPI3_bar.setOption(kpi3_option);
            // KPI4_bar.setOption(throughput_option);
        });
        $http({
            url: 'boxplot',
            method: "GET",
            params: {tp: 'gross', ex_type: 'CNTR'}
        }).then(function(response){
            $boxPlot.dispose()
            $boxPlot = echarts.init(document.getElementById('boxplot'));
            $scope.boxPlot = response.data.simulations;

            var data = [];
            for (var seriesIndex = 2; seriesIndex < $scope.boxPlot.length; seriesIndex++) {
                var current = $scope.boxPlot[seriesIndex];
                var seriesData = [];
                for (var i = 0; i < current.length; i += 1) {
                    var cate = current[i];
                    seriesData.push(cate);
                }
                data.push(echarts.dataTool.prepareBoxplotData(seriesData,{boundIQR: 'none'}));
            }
            var seriesList = []
            for (var i=0;i< $scope.boxPlot[0].length;i++) {
                seriesList.push(
                    {
                        name: $scope.boxPlot[0][i],
                        type: 'boxplot',
                        data: data[i].boxData,
                    }
                )
            }
            var option = {
                title: {
                    text: 'Gross Fill rate',
                    left: 'center',
                },
                legend: {
                    y: '10%',
                    data: $scope.boxPlot[0]
                },
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: $scope.boxPlot[1],
                    boundaryGap: true,

                    splitArea: {
                        show: true
                    },
                },
                yAxis: {
                },
                series: seriesList
            };
            $boxPlot.setOption(option);
        });


        $http({
            url: 'boxplot',
            method: "GET",
            params: {tp: 'net', ex_type: 'CNTR'}
        }).then(function(response){
            $boxplot_net.dispose()
            $boxplot_net = echarts.init(document.getElementById('boxplot_net'));
            $scope.boxPlot2 = response.data.simulations;

            var data = [];
            for (var seriesIndex = 2; seriesIndex < $scope.boxPlot2.length; seriesIndex++) {
                var current = $scope.boxPlot2[seriesIndex];
                var seriesData = [];
                for (var i = 0; i < current.length; i += 1) {
                    var cate = current[i];
                    seriesData.push(cate);
                }
                data.push(echarts.dataTool.prepareBoxplotData(seriesData,{boundIQR: 'none'}));
            }
            var seriesList = []
            for (var i=0;i< $scope.boxPlot2[0].length;i++) {
                seriesList.push(
                    {
                        name: $scope.boxPlot2[0][i],
                        type: 'boxplot',
                        data: data[i].boxData,
                    }
                )
            }
            var option = {
                title: {
                    text: 'Net Fill rate',
                    left: 'center',
                },
                legend: {
                    y: '10%',
                    data: $scope.boxPlot2[0]
                },
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: $scope.boxPlot2[1],
                    boundaryGap: true,

                    splitArea: {
                        show: true
                    },
                },
                yAxis: {
                },
                series: seriesList
            };

            $boxplot_net.setOption(option);
        });


        $http({
            url: 'network',
            method: "GET",
            params: {scenorio: 'Actual'}
        }).then(function(response){
            $scope.g = response.data;
            // Instantiate sigma:
            new sigma({
                graph: $scope.g,
                container: 'sigmas11',
                settings: {
                    minEdgeSize: 0,
                    maxEdgeSize: 10,
                    defaultNodeColor: '#ec5148'
                }

            });
        });

        $http({
            url: 'network',
            method: "GET",
            params: {scenorio: 'S1-2'}
        }).then(function(response){
            $scope.g = response.data;
            // Instantiate sigma:
            new sigma({
                graph: $scope.g,
                container: 'sigmas12',
                settings: {
                    minEdgeSize: 0,
                    maxEdgeSize: 14,
                    defaultNodeColor: '#ec5148',
                    // zoomingRatio: 1,
                    // doubleClickEnabled: false
                }

            });
        });

    }, 0);

    window.aaa = $scope;

    // $scope.simulations = [{"test_id": "test2", "description": "simulation with new batch creation algorithm", "data_end_time": "2017-06-02 08:00:00", "kpis": [{"simulation": "test2", "kpi_value": "0.400000", "kpi_datetime": "2017-06-02 08:00:00", "kpi_name": "KP2"}, {"simulation": "test2", "kpi_value": "100.000000", "kpi_datetime": "2017-06-02 08:00:00", "kpi_name": "KPI3"}, {"simulation": "test2", "kpi_value": "70.000000", "kpi_datetime": "2017-06-02 08:00:00", "kpi_name": "batch_size"}], "created_at": "2017-06-12 18:07:03", "data_start_time": "2017-06-01 08:00:00"}, {"test_id": "test1", "description": "using the original settings", "data_end_time": "2017-06-02 08:00:00", "kpis": [{"simulation": "test1", "kpi_value": "0.830000", "kpi_datetime": "2017-06-02 08:00:00", "kpi_name": "KPI2"}, {"simulation": "test1", "kpi_value": "100.000000", "kpi_datetime": "2017-06-02 08:00:00", "kpi_name": "KPI3"}, {"simulation": "test1", "kpi_value": "20.300000", "kpi_datetime": "2017-06-02 08:00:00", "kpi_name": "batch_size"}], "created_at": "2017-06-12 18:02:25", "data_start_time": "2017-06-01 08:00:00"}]

});