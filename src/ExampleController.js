class ExampleController {
    constructor($scope, example) {
        $scope.example = example;
    }
}
ExampleController.$inject = ['$scope', 'example'];

export { ExampleController };
