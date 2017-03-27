app.controller('DistributionProjectCtrl', function ($scope, httpReq, auth,makeChartConfigForXY, $location, localStorage, $interval, showToast, modalBox, $q) {
    $scope.result = [];
    $scope.query = {};
    $scope.query.data = {
        //"query_time_type": 1,
        //"start_date": moment().format("YYYY-MM-DD"),
        "query_area_type": false
    };
    $scope.city_list = city_data.city_list;
    $scope.province_list = city_data.province_list;
    $scope.query_time_type = 1;
    $scope.query_top_type=1;
    $scope.query_config = [
        //{
        //    key: 'query_time_type',
        //    type: 'select',
        //    templateOptions: {
        //        label: '时间',
        //        options: [
        //            {
        //                "name": "单日",
        //                "value": 1
        //            }, {
        //                "name": "过去7天",
        //                "value": 2
        //            }, {
        //                "name": "过去30天",
        //                "value": 3
        //            }
        //        ]
        //    }
        //},
        //{
        //    key: 'start_date',
        //    type: 'datepicker',
        //    templateOptions: {
        //        label: '选择日期'
        //    }
        //},
        {
            key: 'query_area_type',
            type: 'checkbox',
            templateOptions: {
                label: '是否显示市级'
            }
        }


    ];
    $scope.query_btn_top = function (type) {
        $scope.query_top_type=type;
        if($scope.query_top_type==1){
            $scope.chartConfig = makeChartConfigForXY("新建项目", $scope.new_project_top10_result);
        }else if($scope.query_top_type==2){
            $scope.chartConfig = makeChartConfigForXY("活跃项目", $scope.active_project_top10_result);
        }else if($scope.query_top_type==3){
            $scope.chartConfig = makeChartConfigForXY("正常项目", $scope.normal_project_top10_result);
        }else if($scope.query_top_type==4){
            $scope.chartConfig = makeChartConfigForXY("订阅项目", $scope.renzheng_project_top10_result);
        }
    };
    $scope.query_btn = function (type) {
        $scope.query_time_type = type;
        if($scope.query_time_type==1){
            $scope.start_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            $scope.end_date = moment().format("YYYY-MM-DD");
        }else if ($scope.query_time_type == 2) {
            $scope.end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            $scope.start_date = moment($scope.end_date).subtract(7, 'days').format("YYYY-MM-DD");
        } else if ($scope.query_time_type == 3) {
            $scope.end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            $scope.start_date = moment($scope.end_date).subtract(30, 'days').format("YYYY-MM-DD");
        }else if ($scope.query_time_type == 4) {
            $scope.end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            $scope.start_date = moment($scope.end_date).subtract(60, 'days').format("YYYY-MM-DD");
        }

        $scope.show_start_date = moment($scope.start_date).add(1, 'days').format("YYYY-MM-DD");
        $scope.show_end_date = moment($scope.end_date).format("YYYY-MM-DD");


        httpReq("/nm2/project/query_project_distribution", {
            start_date: $scope.start_date,
            end_date: $scope.end_date,
            type: $scope.query.data.query_area_type
        }).then(function (data) {
            $scope.new_project_result = data.result.new_project_result;
            $scope.normal_project_result = data.result.normal_project_result;
            $scope.active_project_result = data.result.active_project_result;
            $scope.renzheng_project_result = data.result.renzheng_project_result;



            $scope.new_project_count = 0;
            _($scope.new_project_result).each(function (i) {
                if(i.name!='未知') {
                    $scope.new_project_count += i.count;
                }
            });
            $scope.normal_project_count = 0;
            _($scope.normal_project_result).each(function (i) {
                if(i.name!='未知') {
                    $scope.normal_project_count += i.count;
                }
            });
            $scope.active_project_count = 0;
            _($scope.active_project_result).each(function (i) {
                if(i.name!='未知') {
                    $scope.active_project_count += 1;
                }
            });
            $scope.renzheng_project_count = 0;
            _($scope.renzheng_project_result).each(function (i) {
                if(i.name!='未知'){
                    $scope.renzheng_project_count += i.count;
                }
            });
            $scope.result = [];
            if($scope.query.data.query_area_type){
                _($scope.city_list).each(function (p) {
                    var item = {};
                    item['name'] = p.province_name+' '+p.city_name;
                    var have_new_project = false;
                    _($scope.new_project_result).each(function (i) {
                        if (i.name == p.city_name) {
                            item['new_project_count'] = i.count;
                            have_new_project = true;
                        }
                    });
                    if (!have_new_project) {
                        item['new_project_count'] = 0;
                    }
                    var have_normal_project = false;
                    _($scope.normal_project_result).each(function (i) {
                        if (i.name == p.city_name) {
                            item['normal_project_count'] = i.count;
                            have_normal_project = true;
                        }
                    });
                    if (!have_normal_project) {
                        item['normal_project_count'] = 0;
                    }
                    var have_active_project = false;
                    _($scope.active_project_result).each(function (i) {
                        if (i.name == p.city_name) {
                            if(item.active_project_count>=0){
                                item['active_project_count'] =  item.active_project_count + 1;
                            }else{
                                item['active_project_count'] = 1;
                            }
                            have_active_project = true;
                        }
                    });
                    if (!have_active_project) {
                        item['active_project_count'] = 0;
                    }
                    var have_renzheng_project = false;
                    _($scope.renzheng_project_result).each(function (i) {
                        if (i.name == p.city_name) {
                            item['renzheng_project_count'] = i.count;
                            have_renzheng_project = true;
                        }
                    });
                    if (!have_renzheng_project) {
                        item['renzheng_project_count'] = 0;
                    }
                    $scope.result.push(item);
                });
                $scope.dataresult = angular.copy($scope.result);
                $scope.new_project_top10 = $scope.result.sort(function(a,b){
                    return b.new_project_count- a.new_project_count;
                });
                $scope.new_project_top10 = $scope.new_project_top10.slice(0,10);
                $scope.new_project_top10_result = [];
                _($scope.new_project_top10).each(function(i){
                    var item={};
                    item['y'] = i.new_project_count;
                    item['x'] = i.name;
                    $scope.new_project_top10_result.push(item);
                });
                $scope.normal_project_top10 = $scope.result.sort(function(a,b){
                    return b.normal_project_count- a.normal_project_count;
                });
                $scope.normal_project_top10 = $scope.normal_project_top10.slice(0,10);
                $scope.normal_project_top10_result = [];
                _($scope.normal_project_top10).each(function(i){
                    var item={};
                    item['y'] = i.normal_project_count;
                    item['x'] = i.name;
                    $scope.normal_project_top10_result.push(item);
                });
                $scope.active_project_top10 = $scope.result.sort(function(a,b){
                    return b.active_project_count- a.active_project_count;
                });
                $scope.active_project_top10 = $scope.active_project_top10.slice(0,10);
                $scope.active_project_top10_result = [];
                _($scope.active_project_top10).each(function(i){
                    var item={};
                    item['y'] = i.active_project_count;
                    item['x'] = i.name;
                    $scope.active_project_top10_result.push(item);
                });
                $scope.renzheng_project_top10 = $scope.result.sort(function(a,b){
                    return b.renzheng_project_count- a.renzheng_project_count;
                });
                $scope.renzheng_project_top10 = $scope.renzheng_project_top10.slice(0,10);
                $scope.renzheng_project_top10_result = [];
                _($scope.renzheng_project_top10).each(function(i){
                    var item={};
                    item['y'] = i.renzheng_project_count;
                    item['x'] = i.name;
                    $scope.renzheng_project_top10_result.push(item);
                });
                $scope.query_btn_top($scope.query_top_type);
            }else{
                _($scope.province_list).each(function (p) {
                    var item = {};
                    item['name'] = p.province_name;
                    var have_new_project = false;
                    _($scope.new_project_result).each(function (i) {
                        if (i.name == p.province_name) {
                            item['new_project_count'] = i.count;
                            have_new_project = true;
                        }
                    });
                    if (!have_new_project) {
                        item['new_project_count'] = 0;
                    }
                    var have_normal_project = false;
                    _($scope.normal_project_result).each(function (i) {
                        if (i.name == p.province_name) {
                            item['normal_project_count'] = i.count;
                            have_normal_project = true;
                        }
                    });
                    if (!have_normal_project) {
                        item['normal_project_count'] = 0;
                    }
                    var have_active_project = false;
                    _($scope.active_project_result).each(function (i) {
                        if (i.name == p.province_name) {
                            if(item.active_project_count>=0){
                                item['active_project_count'] =  item.active_project_count + 1;
                            }else{
                                item['active_project_count'] = 1;
                            }

                            have_active_project = true;
                        }
                    });
                    if (!have_active_project) {
                        item['active_project_count'] = 0;
                    }
                    var have_renzheng_project = false;
                    _($scope.renzheng_project_result).each(function (i) {
                        if (i.name == p.province_name) {
                            item['renzheng_project_count'] = i.count;
                            have_renzheng_project = true;
                        }
                    });
                    if (!have_renzheng_project) {
                        item['renzheng_project_count'] = 0;
                    }
                    $scope.result.push(item);
                });
            }
            $scope.dataresult = angular.copy($scope.result);
            $scope.new_project_top10 = $scope.result.sort(function(a,b){
                return b.new_project_count- a.new_project_count;
            });
            $scope.new_project_top10 = $scope.new_project_top10.slice(0,10);
            $scope.new_project_top10_result = [];
            _($scope.new_project_top10).each(function(i){
                var item={};
                item['y'] = i.new_project_count;
                item['x'] = i.name;
                $scope.new_project_top10_result.push(item);
            });
            $scope.normal_project_top10 = $scope.result.sort(function(a,b){
                return b.normal_project_count- a.normal_project_count;
            });
            $scope.normal_project_top10 = $scope.normal_project_top10.slice(0,10);
            $scope.normal_project_top10_result = [];
            _($scope.normal_project_top10).each(function(i){
                var item={};
                item['y'] = i.normal_project_count;
                item['x'] = i.name;
                $scope.normal_project_top10_result.push(item);
            });
            $scope.active_project_top10 = $scope.result.sort(function(a,b){
                return b.active_project_count- a.active_project_count;
            });
            $scope.active_project_top10 = $scope.active_project_top10.slice(0,10);
            $scope.active_project_top10_result = [];
            _($scope.active_project_top10).each(function(i){
                var item={};
                item['y'] = i.active_project_count;
                item['x'] = i.name;
                $scope.active_project_top10_result.push(item);
            });
            $scope.renzheng_project_top10 = $scope.result.sort(function(a,b){
                return b.renzheng_project_count- a.renzheng_project_count;
            });
            $scope.renzheng_project_top10 = $scope.renzheng_project_top10.slice(0,10);
            $scope.renzheng_project_top10_result = [];
            _($scope.renzheng_project_top10).each(function(i){
                var item={};
                item['y'] = i.renzheng_project_count;
                item['x'] = i.name;
                $scope.renzheng_project_top10_result.push(item);
            });
            $scope.query_btn_top($scope.query_top_type);
        });
    };
    $scope.query_btn(1);
});