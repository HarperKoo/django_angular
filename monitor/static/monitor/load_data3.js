var monitorApp = angular.module('monitorApp',[]);
monitorApp.controller('SimulationCtrl', function SimulationCtrl($scope,$http){

    setTimeout(function(){
        $http.get('config').then(function(response){
            $scope.truckcapacity = response.data.truckcapacity;
            $scope.truckutil = response.data.truckutil;
            $scope.truckconf = response.data.truckconf;

        });
        // $http({
        //     url: 'boxplot',
        //     method: "GET",
        //     params: {tp: 'gross'}
        // })

    }, 0);

    window.aaa = $scope;

});