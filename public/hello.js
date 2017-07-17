// Licensed Materials - Property of IBM
//
// SAMPLE
//
// (c) Copyright IBM Corp. 2017 All Rights Reserved
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with IBM Corp
var req = {
   method: 'POST',
   url: 'http://localhost:3001/cics/reverse/',
   data: { "string":"Hello world, testing!!"}
}

var reversedtext;
var ellietext = "hi";

var firstApp = angular.module('firstApp',[]);

firstApp.controller('Hello', function($scope, $http) {
    //Showing automatic REST API call
    $http(req).then(function(response){
        $scope.greeting = response.data;
        reversedtext = response;
    });

    $scope.user={"firstName":"john", "lastName":"doe"};


    $scope.elliebutton = function(){
        $http({
           method: 'POST',
           url: 'http://localhost:3001/cics/reverse/',
           data: { "string":$scope.string.input}
       }).then(function(response){
        $scope.string.reversed = response.data.reversed;
    });
   }
});


