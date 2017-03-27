/**
 * Created by fanjunwei on 16/4/18.
 */
app.controller('homeCtrl', function ($scope, $rootScope, httpReq, $interval, modalBox, $location, myUserInfo, $state, showConfirm) {
    $scope.data = {};
    httpReq("/nm2/query_home_info_v3").then(function (data) {
        $scope.data = data.result;
    })
});
