var ForecastUnit = function () {
    let private = $();
    let public = $();
    let $form, bulletinDd, unitDd, leadTimeDd, varDd, displayDd,
        evaluateBtn, downloadBtn, $summary, startTime, endTime,
        total, real, lost, size,
        $table, $chart, $result, _param, chart;
    public.init = function () {
        $form = $("#forecast-unit");
        bulletinDd = $form.find("[name=Bulletin_Id]").on('change', private.onBulletinChange);
        unitDd = $form.find("[name=Forecast_Unit]");
        public.loadForecastUnit();
        leadTimeDd = $form.find("[name=Lead_Time]").on('change', private.onLeadTimeChange);
        varDd = $form.find("[name=Var_Name]");
        private.onBulletinChange();
        displayDd = $form.find("[name=Display_Shape]").on('change', private.changeDisplayType);
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

        $summary = $form.find(".data-summary");

        $result = $form.find('#result');
        $table = $result.find('.result-table');
        $chart = $result.find('.result-chart');
        total = $summary.find('[data-total]');
        real = $summary.find('[data-real]');
        lost = $summary.find('[data-lost]');
        size = $summary.find('[data-size]');

        private.initLoading();
    }
    private.initLoading = function () {
        $(document).ajaxStart(function () {
            App.startPageLoading();
        });
        $(document).ajaxComplete(function () {
            App.stopPageLoading();
        });
    };
    private.changeDisplayType = () => {
        if (displayDd.val() == "table") {
            $table.show();
            $chart.hide();
        }
        else {
            $table.hide();
            $chart.show();
        }
    }
    public.loadForecastUnit = function () {
        $.get("/EvaluatePointForeCast/GetForecastUnits").done(function (result) {
            unitDd.empty();
            $.each(result, function (i, unitName) {
                unitDd.append($('<option/>').val(unitName).html(unitName));
            });
        });
    };
    private.onBulletinChange = function () {
        $.ajax({
            url: '/EvaluatePointForeCast/GetFieldFromBulletin',
            type: 'POST',
            data: { id: bulletinDd.val() },
            success: function (result) {
                leadTimeDd.empty();
                $.each(result.listLeadtime, function (i, item) {
                    leadTimeDd.append($('<option/>').val(item.Leadtime).html(item.Leadtime));
                });
                varDd.empty();
                $.each(result.listVar, function (i, item) {
                    varDd.append($('<option/>').val(item.Var_Name).html(item.Var_Name));
                });
            },
            error: DBBB.error
        });
    };
    private.onLeadTimeChange = function () {
        $.get('/EvaluatePointForeCast/GetVarsFromLeadTime', { leadTime: leadTimeDd.val() })
            .done(function (result) {
                varDd.empty();
                $.each(result, function (index, item) {
                    varDd.append($('<option/>').val(item.Var_Name).html(item.Var_Name));
                });
            });
    };
    private.isformValid = function () {
        if (!startTime.val() || !endTime.val()) {
            DBBB.alert("Vui lòng nhập đầy đủ thời gian!");
            return false;
        }
        else if (startTime.val() && endTime.val()) {
            let arrayDate1 = startTime.val().split(' ');
            let arrayDate2 = endTime.val().split(' ');
            let newDate1 = arrayDate1[0].split('/');
            let newDate2 = arrayDate2[0].split('/');
            let fromTime = new Date(newDate1[1] + '/' + newDate1[0] + '/' + newDate1[2] + ' ' + arrayDate1[1]);
            let toTime = new Date(newDate2[1] + '/' + newDate2[0] + '/' + newDate2[2] + ' ' + arrayDate2[1]);
            if (fromTime >= toTime) {
                DBBB.alert("Thời gian kết thúc cần lớn hơn thời gian bắt đầu!");
                return false;
            }
        }
        return true;
    };
    private.evaluate = function () {
        _param = {
            Bulletin_Id: bulletinDd.val(),
            Unit_Name: unitDd.val(),
            Start_Time: startTime.val(),
            End_Time: endTime.val(),
            Var_Name: varDd.val(),
            Lead_Time: leadTimeDd.val(),
            Display_Shape: displayDd.val(),
            Eval_Type: "unit"
        };
        if (private.isformValid()) {

            $.ajax({
                url: '/EvaluatePointForeCast/GetRealSize',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: JSON.stringify(_param),
                success: function (total) {
                    if (total === 0) {
                        DBBB.alert("Khoảng thời gian bạn chọn theo quy định không có bản tin dự báo nào để đánh giá!");
                    }
                    else if (total < 15) {
                        DBBB.confirm(`Khoảng thời gian bạn chọn chỉ có ${total} bản tin dự báo được đưa vào đánh giá,<br/>
                                        số lượng bản tin này quá ít và có thể không đảm bảo tính thống kê. <br/>
                                        Bạn có muốn tiếp tục không?`,
                            function (ok) {
                                if (ok) {
                                    private.evaluateUnit();
                                }
                            });

                    }
                    else
                        setTimeout(() => {
                            private.evaluateUnit();
                        }, 200);
                },
                error: DBBB.error
            });
        }
    };
    private.evaluateUnit = function () {
        $.ajax({
            url: '/EvaluatePointForeCast/EvaluateByRequire',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(_param),
            success: function (result) {
                if (result.evalParams.length > 0) {
                    $result.show();
                    private.createTable(result.evalParams);
                    private.createChart(result.evalParams);
                    total.html(result.prescribedTotal);
                    real.html(result.realTotal);
                    lost.html(result.lostTotal);
                    size.html(result.sizeTotal);
                    $result.show();
                    downloadBtn.show();
                    private.changeDisplayType();
                }
                else {
                    $table.hide();
                    $chart.hide();
                    $result.hide();
                    downloadBtn.hide();
                    DBBB.alert("Không thể thực hiện tính toán do không tìm thấy dữ liệu quan trắc trong CSDL!<br/>Vui lòng cập nhật dữ liệu và thử lại!");
                }

            },
            error: DBBB.error
        });
    };
    private.createTable = (data) => {
        let tableHeader = "<td>TT</td>\
                                <td>Điểm dự báo</td>";
        let params = data[0].Params;
        $.each(params, function (index, value) {
            tableHeader += "<td>" + value.Name + "</td>";
        });
        $table.find("thead tr").empty().html(tableHeader);

        let tableBody = "";
        $.each(data, function (index, item) {
            tableBody += " <tr>\
                                <td>"+ (index + 1) + "</td>\
                                <td>"+ item.StationName + "</td>";
            $.each(item.Params, function (index, param) {
                tableBody += "<td>" + param.Value + "</td>";
            });
            tableBody += "</tr>";
        });
        $table.find("tbody").empty().html(tableBody);
        let table = $table.find("table");
        if ($.fn.DataTable.isDataTable(table))
            table.dataTable().fnDestroy();
        table.dataTable({
            "language": {
                url: '/static/translate/vi.json'
            },
            "ordering": false
        });
        $table.css('padding', '10px');
    }

    private.createChart = function (result) {
        let startTime = _param.Start_Time.split(' ')[0];
        let endTime = _param.End_Time.split(' ')[0];
        let template = `<div class="row" >
                            <div class="col-md-12" style="height:auto" id="params-chart">
                            </div>
                        </div >`;
        $chart.html(template);

        let chartData = [];
        $.each(result, function (index, data) {
            let item = {};
            item['stationName'] = data.StationName;
            $.each(data.Params, function (idx, param) {
                item[param.Name] = param.Value;
            });
            chartData.push(item);
        });
        let params = result[0].Params;
        let graph = [], axes = [];
        $.each(params, function (index, param) {
            let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            graph.push({
                "balloonText": param.Name + ":[[value]]",
                "title": param.Name,
                "fillColors": color,
                "fillAlphas": 1,
                "lineAlpha": 1,
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
            "autoMarginOffset": 40,
            "gridAboveGraphs": true,
            autoDisplay: true,
            autoMargins: true,
            autoResize: true,
            autoTransform: true,
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
                    "text": `Kết quả đánh giá ${_param.Unit_Name}`,//cho biến: ${_param.Var_Name} tại hạn dự báo: ${_param.Lead_Time} từ ngày ${startTime} đến ngày ${endTime} của đơn vị ${_param.Unit_Name}`,
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
    ForecastUnit.init();
});