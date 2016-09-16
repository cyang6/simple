var app = angular.module('simple', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/'
    }).when('/', {
        templateUrl: 'src/home.html',
        controller: 'HomeCtrl'
    })
});

app.service('HomeService', homeService);
function homeService($http) {
    this.getData = function (successHandler, errorHandler) {
        $http.get('src/data.json',{isArray:true}).then(successHandler , errorHandler);
    }
}

app.directive('simpleDirective', simpleDirective);
function simpleDirective() {
    return {
        restrict: 'AE',
        scope: {
            show:'&showMe'
        },
        templateUrl: 'src/simple-directive.tpl.html',
        replace: true,
        transclude: true,
        link: function (scope, element, attrs) {
            if(attrs.color){
                element.css('background-color', attrs.color);
            }
            element.on('click', function () {
                scope.$apply(function () {
                    scope.show({message: attrs.color + " clicked"});
                });
            });
        }

    }
}

app.directive('simpleGroup', group);
function group() {
    return {
        restrict: 'AE',
        templateUrl: 'src/group.tpl.html',
        scope:{},
        transclude:true,
        controller: function ($scope) {
            var list = [];
            this.add = function (scope) {
                scope.open = false;
                list.push(scope);
            };
            $scope.remove = function (scope) {
                var index = list.indexOf(scope);
                if (index > 0){
                    list = list.splice(index,1);
                }
            };
            this.closeOther = function(scope){
                for (var i = 0; i < list.length; i++){
                    var cur = list[i];
                    if (scope != cur){
                        cur.open = false;
                    }
                }
            };
        },
        link: function (scope, elem, attrs) {
            scope.name = 'Group';
        }
    }
}

app.directive('simpleRecord', record);
function record() {
    return {
        restrict: 'AE',
        require: '^^simpleGroup',
        template:'<h3 ng-click="toggle()">{{name}}</h3><ng-transclude ng-show="open"></ng-transclude>',
        transclude: true,
        scope: {
            name:'='
        },
        link: function (scope, elem, attrs, group) {
            group.add(scope);
            scope.toggle = function () {
                scope.open = !scope.open;
                if (scope.open){
                    group.closeOther(scope);
                }
            };
        }
    }
}

app.controller('HomeCtrl', homeCtrl);
function homeCtrl($scope, HomeService) {
    $scope.name = 'Home Page';
    $scope.showMsg = function (message) {
        $scope.message = message;
    };
    HomeService.getData(handler,handler);
    function handler(response) {
        if(response.status == 200){
            $scope.items = response.data;
        }
    }
}








