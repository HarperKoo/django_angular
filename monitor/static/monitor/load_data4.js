var monitorApp = angular.module('monitorApp',[]);
monitorApp.controller('SimulationCtrl', function SimulationCtrl($scope,$http){

    setTimeout(function(){
        $http.get('fillrate').then(function(response){
            $scope.simulations = response.data.simulations;
        });
        // $http({
        //     url: 'boxplot',
        //     method: "GET",
        //     params: {tp: 'gross'}
        // })

    }, 0);

    window.aaa = $scope;

});