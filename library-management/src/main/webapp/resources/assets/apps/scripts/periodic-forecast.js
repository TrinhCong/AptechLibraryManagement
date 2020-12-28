var PeriodicEvaluation = function () {
    let public = $();
    let private = $();
    let $form, startTime, endTime, bulletinDd,
        leadTimeDd, veriReportDd, specReportDd, chart, varDd, displayDd,
        report_type, evaluateBtn, downloadBtn,
        $specReport, _result, _chartData, $resultBtns, table, $table;

    public.init = function () {
        $form = $("#periodic-form");
        bulletinDd = $form.find("[name=Bulletin_Id]").on('change', private.onBulletinChange);
        leadTimeDd = $form.find("[name=LeadTime_Id]").on('change', private.onLeadTimeChange);
        varDd = $form.find("[name=Var_Name]");
        veriReportDd = $form.find("[name=VeriReport_Id]");
        private.onBulletinChange();
        displayDd = $form.find("[name=Display_Shape]").on('change', private.displayChange);
        chart = $form.find("[name=Chart_Type]");
        $form.find('.form_datetime').datetimepicker({
            defaultDate: new Date(),
            autoclose: true,
            isRTL: App.isRTL(),
            format: "dd/mm/yyyy HH:00p",
            fontAwesome: true,
            todayBtn: true,
            language: 'vi',
            minView: 1,
            pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left")
        });
        startTime = $form.find("[name=Start_Time]");
        endTime = $form.find("[name=End_Time]");
        downloadBtn = $form.find(".download").on('click', private.download);
        evaluateBtn = $form.find(".evaluate").on('click', private.evaluate);
        $specReport = $("#spec-report");
        specReportDd = $("#Specify_Report").on('change', private.onSpecReportChange);
        $result = $form.find('#result');
        $table = $result.find('.result-table');
        $chart = $result.find('.result-chart');
        private.initLoading();
    };
    private.initLoading = function () {
        $(document).ajaxStart(function () {
            App.startPageLoading();
        });
        $(document).ajaxComplete(function () {
            App.stopPageLoading();
        });
    };
    private.leadTimeChange = function () {
        $.ajax({
            url: '/EvaluatePointForeCast/GetVarHasFlagInVarConfig',
            type: 'Post',
            data: {
                leadtime: leadTimeDd.val(),
                bulletinId: bulletin.val()
            },
            success: function (value) {
                varDd.empty();
                $.each(value, function (i, item) {
                    varDd.append($('<option/>').val(item.Var_Name).html(item.Var_Name));
                });
            }
        });
    };
    private.isTimeValid = function (startTime, endTime) {
        if (startTime && endTime) {
            let arrayDate1 = startTime.split(' ');
            let arrayDate2 = endTime.split(' ');
            let newDate1 = arrayDate1[0].split('/');
            let newDate2 = arrayDate2[0].split('/');
            let fromTime = new Date(newDate1[1] + '/' + newDate1[0] + '/' + newDate1[2] + ' ' + arrayDate1[1]);
            let toTime = new Date(newDate2[1] + '/' + newDate2[0] + '/' + newDate2[2] + ' ' + arrayDate2[1]);
            if (fromTime > toTime)
                return false;
            else
                return true;
        }
        else
            return false;
    }
    private.isformValid = function () {
        if (!startTime.val() || !endTime.val()) {
            DBBB.alert("Vui lòng nhập đầy đủ thời gian!");
            return false;
        }
        else if (!private.isTimeValid(startTime.val(), endTime.val())) {
            DBBB.alert("Thời gian kết thúc cần lớn hơn hoặc bằng thời gian bắt đầu!");
            return false;
        }
        return true;
    };
    private.onSpecReportChange = function () {
        if (displayDd.val() == "table") {
            private.createTable(specReportDd.val());
        }
        else {
            private.createChart(specReportDd.val());
        }
    };
    private.displayChange = () => {
        $table.hide();
        $chart.hide();
        if (displayDd.val() == "table")
            $table.show();
        else
            $chart.show();
    }
    private.evaluate = function () {
        $table.hide();
        $chart.hide();
        $result.hide();
        downloadBtn.hide();
        $specReport.hide();
        _param = {
            Bulletin_Id: bulletinDd.val(),
            VeriReport_Id: veriReportDd.val(),
            Start_Time: startTime.val(),
            End_Time: endTime.val(),
            Var_Name: varDd.val(),
            LeadTime_Id: leadTimeDd.val(),
            Display_Shape: displayDd.val()
        };
        if (private.isformValid()) {
            $.ajax({
                url: '/EvaluatePointForeCast/EvaluatePeriodic',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: JSON.stringify(_param),
                success: function (result) {
                    _result = result.resultList;
                    if (_result.length > 0) {
                        $("#total").html(result.reportTotal);
                        let fromTimeVal = startTime.val().split(' ')[0]; //$.dateTime.stringToString(result.period.Period_Start, "yyyyMMddHH", "dd/MM/yyyy");
                        let toTimeVal = endTime.val().split(' ')[0];//$.dateTime.stringToString(result.period.Period_End, "yyyyMMddHH", "dd/MM/yyyy");
                        $("#from-time").html(fromTimeVal);
                        $("#to-time").html(toTimeVal);
                        $specReport.show();
                        specReportDd.empty();
                        $.each(_result, function (i, item) {
                            specReportDd.append($('<option/>').val(i).html("Báo cáo lập tại thời điểm: " + item.Date));
                        });
                        private.createTable(0);
                        private.createChart(0);
                        $result.show();
                        downloadBtn.show();
                        private.displayChange();
                    }
                    else
                        DBBB.alert("Không tìm thấy báo cáo đánh giá nào trong khoảng thời gian bạn chọn!");
                },
                error: DBBB.error
            });
        }
    };
    private.createTable = function (position) {
        let result = _result[position];
        let tableHeader = "<td>TT</td>\
                                <td>Khu vực dự báo</td>\
                                <td>Điểm dự báo</td>";
        let params = result.ResultParams[0].AreaParams[0].Params;
        $.each(params, function (index, value) {
            tableHeader += "<td>" + value.Name + "</td>";
        });
        table = $table.find("table");
        if ($.fn.DataTable.isDataTable(table))
            table.dataTable().fnDestroy();
        table.find("thead tr").empty().html(tableHeader);
        let tableBody = "";

        $.each(result.ResultParams, function (index, area) {
            $.each(area.AreaParams, function (idx, item) {
                tableBody += " <tr>\
                                <td>"+ (idx + 1) + "</td>\
                                <td>"+ area.AreaName + "</td>\
                                <td>"+ item.StationName + "</td>";
                $.each(item.Params, function (i, param) {
                    tableBody += "<td>" + param.Value + "</td>";
                });
                tableBody += "</tr>";
            });
        });
        table.find("tbody").empty().html(tableBody);
        table.dataTable({
            language: {
                url: '/static/translate/vi.json'
            },
            ordering: false,
        });
        $table.css('padding', '10px');
        $table.show();
    }

    private.createChart = function (position) {
        position = 0 || position;
        _chartData = _result[position];
        let fromTimeVal = startTime.val().split(' ')[0]; //$.dateTime.stringToString(result.period.Period_Start, "yyyyMMddHH", "dd/MM/yyyy");
        let toTimeVal = endTime.val().split(' ')[0];//$.dateTime.stringToString(result.period.Period_End, "yyyyMMddHH", "dd/MM/yyyy");
        let template = `<div class="row" >
                                <div class="col-md-12" style="height:auto" id="params-chart">
                                </div>
                                <div class="col-md-12" style="height:auto" id="result-btn">
                                </div>
                            </div>`;
        $chart.html(template);
        $resultBtns = $("#result-btn");
        let result = _chartData.ResultParams[position];
        let chartData = [];
        console.log(result);

        $.each(result.AreaParams, function (index, data) {
            let item = {};
            item['stationName'] = data.StationName;
            $.each(data.Params, function (idx, param) {
                item[param.Name] = param.Value;
            });
            chartData.push(item);
        });
        let params = result.AreaParams[0].Params;
        let graph = [], axes = [];
        $.each(params, function (index, param) {
            let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            graph.push({
                "balloonText": param.Name + ":[[value]]",
                "title": param.Name,
                "fillColors": color,
                "fillAlphas": 0.9,
                "lineAlpha": 0.2,
                "type": "column",
                "valueField": param.Name,
                "fixedColumnWidth": 15,
                "valueAxis": param.Name,
            });
            axes.push({
                "id": param.Name,
                //"title": param.Name,
                "axisColor": color,
                "color": color,
                "axisThickness": 2,
                "axisAlpha": 1,
                "position": "left",
                //"axisTitleOffset": -10,
                "offset": index * 60,
            });
        });

        chart = AmCharts.makeChart("params-chart", {
            "dataProvider": chartData,
            "valueAxes": axes,
            "graphs": graph,
            "type": "serial",
            "theme": "light",
            "autoMarginOffset": 30,
            "gridAboveGraphs": true,
            "chartCursor": {
                "categoryBalloonEnabled": false,
                "cursorAlpha": 0,
                "zoomable": false
            },
            "legend": {
                //"horizontalGap": 10,
                //"maxColumns": 1,
                //"position": "right",
                "useGraphSettings": true,
                //"markerSize": 10
            },
            "export": {
                "enabled": true,
                "menu": [{
                    "class": "export-main",
                    "menu": [{
                        "label": "Tải biểu đồ",
                        "menu": ["PNG", "JPG"]
                    }]
                }]
            },
            "startDuration": 1,
            "categoryField": "stationName",
            "categoryAxis": {
                "gridPosition": "start",
                "axisAlpha": 0,
                "tickLength": 0,
                "title": "   ",
                labelRotation: 45
            },
            "allLabels": [
                {
                    "text": `Chu kỳ đánh giá của báo cáo từ ngày ${fromTimeVal} đến ngày ${toTimeVal}`,
                    "x": "0",
                    "y": -3,
                    "width": "50%",
                    "size": 13,
                    "bold": true,
                    "align": "center"
                },
                {
                    "text": "Điểm dự báo",
                    "x": "!20",
                    "y": "!20",
                    "width": "50%",
                    "size": 13,
                    "bold": true,
                    "align": "right"
                }, {
                    "text": "Chỉ số đánh giá",
                    "rotation": 270,
                    "x": "10",
                    "y": "10",
                    "width": "50%",
                    "size": 13,
                    "bold": true,
                    "align": "right"
                }]
        });
        $("#params-chart").height(450);
        chart.write("params-chart");
        if (_chartData.ResultParams.length > 1) {
            $resultBtns.empty();
            $resultBtns.css({ 'padding': '5px', 'border': '1px solid #ccc' })
            $.each(_chartData.ResultParams, function (index, value) {
                let btnClass = index === position ? "btn btn-success" : "btn btn-info";
                $resultBtns.append('<button class="' + btnClass + '" data-stn-btn="' + index + '" style="margin:0 2px">' + value.AreaName + '</button>');
            });
            $resultBtns.find('[data-stn-btn]').on('click', function () {
                let index = Number($(this).data('stnBtn'));
                private.createChart(index);
            });
        }
        $chart.show();

    };
    private.onBulletinChange = function () {
        $.ajax({
            url: '/EvaluatePointForeCast/GetFieldFromBulletin',
            type: 'POST',
            data: { id: bulletinDd.val() },
            success: function (result) {
                leadTimeDd.empty();
                $.each(result.listLeadtime, function (i, item) {
                    leadTimeDd.append($('<option/>').val(item.Leadtime_Id).html(item.Leadtime));
                });
                varDd.empty();
                $.each(result.listVar, function (i, item) {
                    varDd.append($('<option/>').val(item.Var_Name).html(item.Var_Name));
                });

                veriReportDd.empty();
                $.each(result.listVeriReport, function (i, item) {
                    veriReportDd.append($('<option/>').val(item.Verireport_Id).html(item.Verireport_name));
                });
            }
        });
    };
    private.onLeadTimeChange = function () {
        $.get('/EvaluatePointForeCast/GetVarsFromLeadTimeId', { ltId: leadTimeDd.val() })
            .done(function (result) {
                varDd.empty();
                $.each(result, function (index, item) {
                    varDd.append($('<option/>').val(item.Var_Name).html(item.Var_Name));
                });
            });
    };

    private.download = function () {
        if (_param) {
            if (displayDd.val() === "table") {
                App.postDownload('/EvaluatePointForeCast/ExportEvaluationResult', _param, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "synopdata.xlsx");
            }
            else if (displayDd.val() === "chart") {
                var exp = new AmCharts.AmExport(chart);
                exp.init();
                exp.output({
                    format: 'png'
                });
            }
        }
        else
            DBBB.alert("Vui lòng làm mới trình duyệt và thử lại!");
    };
    return public;
}();

$(document).ready(function () {
    PeriodicEvaluation.init();
});
