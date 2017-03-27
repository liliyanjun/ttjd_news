/**
 * Created by Administrator on 2016/6/22.
 */
app.controller('queryProjectsCtrl', function ($scope, httpReq, auth, $location, localStorage, $interval, showToast, modalBox, showConfirm) {
        $scope.query_arg = {};
        $scope.query_time_type = 0;
        $scope.query_project_type = 0;
        $scope.$on("pageInit", function () {
            $scope.loadPage();
        });

        $scope.$on("loadPage", function () {
            $scope.pageReq("/nm2/project/query_project_v2", $scope.query_arg).then(function (data) {
                $scope.data_list = data.result;
                //alert(JSON.stringify(data))
                
            })
        });
        $scope.query = {};
        $scope.query.data = {
            //query_time_type: 0,
            query_type: 1
            //query_renzheng_type: 0,
            //query_project_type: -1
        };
        $scope.query_config = [
            //{
            //    key: 'query_time_type',
            //    type: 'select',
            //    templateOptions: {
            //        label: '时间',
            //        options: [
            //            {
            //                "name": "全部",
            //                "value": 0
            //            },
            //            {
            //                "name": "今日",
            //                "value": 1
            //            }, {
            //                "name": "昨日",
            //                "value": 2
            //            }, {
            //                "name": "过去7天",
            //                "value": 3
            //            }, {
            //                "name": "过去30天",
            //                "value": 4
            //            }, {
            //                "name": "过去60天",
            //                "value": 5
            //            }, {
            //                "name": "任选时间",
            //                "value": 6
            //            }
            //        ]
            //    }
            //},
            //{
            //    key: 'start_date',
            //    type: 'datepicker',
            //
            //    templateOptions: {
            //        label: '起始时间'
            //    },
            //    "hideExpression": "model.query_time_type!=6"
            //},
            //{
            //    key: 'end_date',
            //    type: 'datepicker',
            //    templateOptions: {
            //        label: '结束时间'
            //    },
            //    "hideExpression": "model.query_time_type!=6"
            //},
            //{
            //    key: 'query_renzheng_type',
            //    type: 'select',
            //    templateOptions: {
            //        label: '订阅状态',
            //        options: [
            //            {
            //                "name": "全部",
            //                "value": 0
            //            }, {
            //                "name": "订阅",
            //                "value": 1
            //            }, {
            //                "name": "试用",
            //                "value": 2
            //            }, {
            //                "name": "订阅到期",
            //                "value": 3
            //            }, {
            //                "name": "试用到期",
            //                "value": 4
            //            }]
            //    }
            //
            //},
            //{
            //    key: 'query_project_type',
            //    type: 'select',
            //    templateOptions: {
            //        label: '项目状态',
            //        options: [{
            //            "name": "全部",
            //            "value": -1
            //        }, {
            //            "name": "正常",
            //            "value": 0
            //        }, {
            //            "name": "解散",
            //            "value": 3
            //        }]
            //    },
            //},
            {
                key: 'query_type',
                type: 'select',
                templateOptions: {
                    options: [{
                        "name": "工程名称",
                        "value": 1
                    }, {
                        "name": "超级管理员",
                        "value": 2
                    }, {
                        "name": "联系电话",
                        "value": 3
                    }, {
                        "name": "渠道代码",
                        "value": 4
                    }]
                }
            },

            {
                key: 'query_content',
                type: 'input',
                templateOptions: {
                    type: "text"
                }
            }
        ];

        $scope.query_btn = function (type) {
            if (type != 0) {
                $scope.query_time_type = type;
            }
            $scope.query_arg = {};
            var start_date = $scope.query.data.start_date;
            var end_date = moment($scope.query.data.end_date).add('days', 1).format("YYYY-MM-DD");
            if ($scope.query_time_type == 1) {
                start_date = null;
                end_date = null;
            } else if ($scope.query_time_type == 2) {
                start_date = moment().format("YYYY-MM-DD");
                end_date = moment().add('days', 1).format("YYYY-MM-DD");
            } else if ($scope.query_time_type == 3) {
                start_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
                end_date = moment().format("YYYY-MM-DD");
            } else if ($scope.query_time_type == 4) {
                start_date = moment().subtract(8, 'days').format("YYYY-MM-DD");
                end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            } else if ($scope.query_time_type == 5) {
                start_date = moment().subtract(31, 'days').format("YYYY-MM-DD");
                end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            } else if ($scope.query_time_type == 6) {
                start_date = moment().subtract(61, 'days').format("YYYY-MM-DD");
                end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            }
            $scope.query_arg['start_date'] = start_date;
            $scope.query_arg['end_date'] = end_date;
            $scope.query_arg['query_project_type'] = $scope.query_project_type;
            $scope.query_arg['query_type'] = $scope.query.data.query_type;
            $scope.query_arg['query_content'] = $scope.query.data.query_content;

            $scope.loadPage();
        };
        $scope.query_btn_2 = function (type) {
            $scope.query_project_type = type;
            var start_date = $scope.query.data.start_date;
            var end_date = moment($scope.query.data.end_date).add('days', 1).format("YYYY-MM-DD");
            if ($scope.query_time_type == 1) {
                start_date = null;
                end_date = null;
            } else if ($scope.query_time_type == 2) {
                start_date = moment().format("YYYY-MM-DD");
                end_date = moment().add('days', 1).format("YYYY-MM-DD");
            } else if ($scope.query_time_type == 3) {
                start_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
                end_date = moment().format("YYYY-MM-DD");
            } else if ($scope.query_time_type == 4) {
                start_date = moment().subtract(8, 'days').format("YYYY-MM-DD");
                end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            } else if ($scope.query_time_type == 5) {
                start_date = moment().subtract(31, 'days').format("YYYY-MM-DD");
                end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            } else if ($scope.query_time_type == 6) {
                start_date = moment().subtract(61, 'days').format("YYYY-MM-DD");
                end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            }
            $scope.query_arg = {};
            $scope.query_arg['start_date'] = start_date;
            $scope.query_arg['end_date'] = end_date;
            $scope.query_arg['query_project_type'] = $scope.query_project_type;
            $scope.query_arg['query_type'] = $scope.query.data.query_type;
            $scope.query_arg['query_content'] = $scope.query.data.query_content;

            $scope.loadPage();
        };
        $scope.show_projectinfo = function (project) {
            modalBox.show("query_projectinfo", {project_id: project.id});
        };
        $scope.show_project_member = function (project) {
            modalBox.show("query_project_member", {project_id: project.id});
        };
        $scope.renzheng_project = function (project) {
            modalBox.show("renzheng_project", {project_id: project.id}).then(function (result) {
                angular.extend(project, result);
            });
        };
        $scope.log_project = function (project) {
            modalBox.show("log_project", {project_id: project.id});
        };
        $scope.recover_project = function (project) {
            showConfirm('提示', '是否确认恢复项目').then(function () {
                httpReq('/nm2/project/recover_project', {project_id: project.id}).then(function () {
                    project.status = 0;
                    showToast('恢复成功', 'success');
                });
            });
        };
    })

    .controller('queryProjectInfoModalCtrl', function ($scope, httpReq, args, $rootScope, modalBox, $uibModalInstance, showToast, $location) {
        httpReq('/nm2/project/query_projectinfo', {"project_id": args.project_id}).then(function (data) {
            $scope.projectinfo = data.result;
        });
        $scope.close = function () {
            $uibModalInstance.dismiss();
        };

    })
    .controller('queryProjectMemberModalCtrl', function ($scope, httpReq, args, $rootScope, modalBox, $uibModalInstance, showToast, $location) {
        httpReq('/nm2/project/query_projectinfo', {"project_id": args.project_id}).then(function (data) {
            $scope.projectinfo = data.result;
        });
        $scope.close = function () {
            $uibModalInstance.dismiss();
        };

    })

