
var QuickEvaluate = function () {
    let private = $();
    let public = $();
    let $form, dateTimePicker, bulletin, selectArea,
        leadTimeDd, varDd, pointDd,
        evalBtn, dwlBtn, dateTime1, dateTime2, displayShape,
        $table, table, $chart, chart, $scatter, scatter,
        observePoint, sizeTotal, lostTotal, _data;
    let DisplayShape = {
        TABLE: "table",
        LINE: "line",
        SCATTER: "scatter"
    }
    public.init = function () {
        $form = $("#evaluate_form");
        bulletin = $form.find("[name=Bulletin_Id]");
        areaDd = $form.find("[name=Area_Name]");
        leadTimeDd = $form.find("[name=Lead_Time]");
        varDd = $form.find("[name=Met_Var]");
        pointDd = $form.find("[name=Point_Name]");
        dateTime1 = $form.find("[name=Start_Time]");
        dateTime2 = $form.find("[name=End_Time]");
        displayShape = $form.find("[name=Chart_Type]").on('change', private.displayChange);
        $table = $("#table-wrapper");
        table = $("#quick_eval_table");
        observePoint = $("#observe_point");
        sizeTotal = $("#size_total");
        lostTotal = $("#lost_total");
        $chart = $("#chart-wrapper");
        $scatter = $("#scatter-wrapper");
        $form.find(".download").on("click", private.download);

        dateTimePicker = $form.find('.form_datetime').datetimepicker({
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
        $.ajax({
            url: '/EvaluatePointForeCast/GetFieldFromBulletin',
            type: 'POST',
            data: { id: bulletin.val() },
            success: function (value) {
                $.each(value.listArea, function (i, item) {
                    areaDd.append(
                        $('<option/>').val(item.Area_Name).html(item.Area_Name)
                    );
                });
                $.each(value.listLeadtime, function (i, item) {
                    leadTimeDd.append(
                        $('<option/>').val(item.Leadtime).html(item.Leadtime)
                    );
                });
                private.areaChange()
                private.leadTimeChange();
                areaDd.on('change', private.areaChange);
                leadTimeDd.on('change', private.leadTimeChange);

            }
        });
        evalBtn = $form.find(".evaluate").on('click', private.evaluate);
    };
    private.download = function () {
        if (_data) {
            if (displayShape.val() === DisplayShape.TABLE) {
                App.postDownload('/EvaluatePointForeCast/ExportQuickEvaluate', _data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "evaluate.xlsx");
            }
            else {
                let dwnChart = displayShape.val() === DisplayShape.LINE ? chart : scatter;
                var exp = new AmCharts.AmExport(dwnChart);
                exp.init();
                exp.output({
                    format: 'png'
                });
            }
        }
    };
    private.areaChange = function () {
        $.ajax({
            url: '/EvaluatePointForeCast/GetPointFromArea',
            type: 'POST',
            data: { areaName: areaDd.val() },
            success: function (value) {
                pointDd.empty();
                $.each(value.listPoint, function (i, item) {
                    pointDd.append(
                        $('<option/>').val(item.Name).html(item.Name)
                    );
                });
            }
        });
    };
    private.leadTimeChange = function () {
        $.ajax({
            url: '/EvaluatePointForeCast/GetMetvarFromLeadtime',
            type: 'Post',
            data: { leadTime: leadTimeDd.val(), bulletinId: bulletin.val() },
            success: function (value) {
                varDd.empty();
                $.each(value, function (idx, item) {
                    varDd.append(
                        $('<option/>').val(item).html(item)
                    );
                })
            }
        });
    };
    private.evaluate = function () {
        let isValid = true;
        let data = {};
        $scatter.empty();
        $chart.empty();
        $table.hide();
        $chart.hide();
        $scatter.hide();

        $form.find('[name]').each(function () {
            if (!$(this).val())
                isValid = false;
            data[$(this).attr('name')] = $(this).val();
        });
        if (!isValid)
            bootbox.alert("Vui lòng nhập đủ thông tin yêu cầu!");
        else {
            let arrayDate1 = dateTime1.val().split(' ');
            let arrayDate2 = dateTime2.val().split(' ');
            let newDate1 = arrayDate1[0].split('/');
            let newDate2 = arrayDate2[0].split('/');
            let startTime = new Date(newDate1[1] + '/' + newDate1[0] + '/' + newDate1[2] + ' ' + arrayDate1[1]);
            let endTime = new Date(newDate2[1] + '/' + newDate2[0] + '/' + newDate2[2] + ' ' + arrayDate2[1]);
            if (startTime > endTime) {
                bootbox.alert("Thời gian kết thúc cần lớn hơn hoặc bằng thời gian bắt đầu!");
                return false;
            }
            App.startPageLoading();
            $.post('/EvaluatePointForeCast/QuickEvaluate', { Info: data }).done(function (result) {
                if (result.data.length == 0) {
                    DBBB.alert("Khoảng thời gian đánh giá bạn chọn không có số liệu tương ứng, mời bạn chọn khoảng thời gian khác");
                }
                else {
                    _data = result.data;
                    dwlBtn = $form.find(".download").removeClass('disabled');
                    dwlBtn.removeAttr('disabled');
                    private.createTable(result);
                    private.createLineChart(result);
                    private.createScatterChart(result);
                    private.displayChange();
                }
                App.stopPageLoading();
            });
        }
    };
    private.displayChange = () => {
        $table.hide();
        $chart.hide();
        $scatter.hide();
        if (displayShape.val() === DisplayShape.TABLE)
            $table.show();
        else if (displayShape.val() === DisplayShape.LINE)
            $chart.show();
        else
            $scatter.show();
    }
    private.createScatterChart = (result) => {
        let varName = varDd.val();
        if (varName === "H.gió") {
            bootbox.alert("Biểu đồ scatter không hỗ trợ cho biến hướng gió!");
        }
        else {
            let valArr = [];
            let obsArr = [];
            let foreArr = [];
            $.each(result.data, function (idx, value) {
                valArr.push(value.ObsVal);
                obsArr.push(value.ObsVal);
                valArr.push(value.ForeVal);
                foreArr.push(value.ForeVal);
            });
            let max = private.arrayMax(valArr) > 0 ? private.arrayMax(valArr) : 0;
            max = Math.ceil(max + max * 0.1);


            scatter = AmCharts.makeChart($scatter.attr("id"), {
                "type": "xy",
                "theme": "light",
                "autoMarginOffset": 50,
                "gridAboveGraphs": true,
                //"legend": {},
                "dataProvider": _data,
                "valueAxes": [{
                    "id": "x-axis",
                    "position": "bottom",
                    "axisAlpha": 0,
                    "dashLength": 1,
                    "title": "   ",
                    "minimum": 0,
                    "maximum": max,
                    "autoGridCount": false,
                    "gridCount": max
                }, {
                    "id": "y-axis",
                    "axisAlpha": 0,
                    "dashLength": 1,
                    "position": "left",
                    "title": "  ",
                    "minimum": 0,
                    "maximum": max,
                    "autoGridCount": false,
                    "gridCount": max
                }],
                "startDuration": 0,
                "graphs": [{
                    "balloonText": "Dự báo:[[x]] - Quan trắc:[[y]]",
                    "bullet": "round",
                    "lineAlpha": 0,
                    "xField": "ObsVal",
                    "yField": "ForeVal",
                    "lineColor": "#595959",
                    "fillAlphas": 0
                }],
                "trendLines": [{
                    "finalValue": private.arrayMax(foreArr) > 0 ? private.arrayMax(foreArr) : 0,
                    "finalXValue": private.arrayMax(obsArr) > 0 ? private.arrayMax(obsArr) : 0,
                    "initialValue": private.arrayMin(foreArr) > 0 ? private.arrayMin(foreArr) : 0,
                    "initialXValue": private.arrayMin(obsArr) > 0 ? private.arrayMin(obsArr) : 0,
                    "lineColor": "#595959"
                }, {
                    "finalValue": max,
                    "finalXValue": max,
                    "initialValue": 0,
                    "initialXValue": 0,
                    "lineColor": "#ff0000"
                }],
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
                "allLabels": [{
                    "text": "Quan trắc",
                    "x": "!20",
                    "y": "!20",
                    "width": "50%",
                    "size": 13,
                    "bold": true,
                    "align": "right"
                }, {
                    "text": "Dự báo",
                    "rotation": 270,
                    "x": "10",
                    "y": "0",
                    "width": "50%",
                    "size": 13,
                    "bold": true,
                    "align": "right"
                }]
            });
            scatter.write($scatter.attr("id"));
            $scatter.show();
        }

    };
    private.createLineChart = (result) => {
        let varName = varDd.val();
        if (varName === "H.gió") {
            bootbox.alert("Biểu đồ đường không hỗ trợ cho biến hướng gió!");
        }
        else {
            let symbol = $.grep(ChartUnitEnum, function (item) {
                return item.VarName.indexOf(varName) > -1;
            })[0].SymBol;
            chart = AmCharts.makeChart($chart.attr("id"), {
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
                    "horizontalGap": 10,
                    "maxColumns": 1,
                    //"position": "right",
                    "useGraphSettings": true,
                    "markerSize": 10,
                    valueText: "[[value]] " + symbol
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
                "dataProvider": _data,
                "valueAxes": [{
                    "axisAlpha": 0,
                    "position": "left"
                }],
                "startDuration": 1,
                "graphs": [{
                    "title": symbol ? "Giá trị quan trắc " : "",
                    "balloonText": varName + ": <b>[[value]]</b> " + symbol,
                    "bullet": "circle",
                    "bulletSize": 10,
                    "bulletBorderColor": "#ccc",
                    "bulletBorderAlpha": 1,
                    "bulletBorderThickness": 2,
                    "valueField": "ObsVal",
                    "type": "smoothedLine",
                    "valueAxis": "VarVal",
                }, {
                    "title": symbol ? "Giá trị dự báo " : "",
                    "balloonText": varName + ": <b>[[value]]</b> " + symbol,
                    "bullet": "circle",
                    "bulletSize": 10,
                    "bulletBorderColor": "#ccc",
                    "bulletBorderAlpha": 1,
                    "bulletBorderThickness": 2,
                    "valueField": "ForeVal",
                    "type": "smoothedLine",
                    "valueAxis": "VarVal",
                    "lineAlpha": 0,
                    "lineColor": "#000000"
                }],
                "valueAxes": [
                    {
                        "id": "VarVal",
                        "title": "   ",
                        "axisColor": "#ccc",
                        "axisThickness": 2,
                        "axisAlpha": 1,
                        "position": "left",
                        "axisTitleOffset": -20,
                        "offset": 0
                    },
                ],
                "categoryField": "TimeForecast",
                "categoryAxis": {
                    "gridPosition": "start",
                    "axisAlpha": 0,
                    "tickLength": 0,
                    "title": "   ",
                    labelRotation: 45
                },
                "allLabels": [
                    {
                        "text": `Kết quả đánh giá tại trạm ${result.pointName}`,
                        "x": "0",
                        "y": -3,
                        "width": "50%",
                        "size": 13,
                        "bold": true,
                        "align": "center"
                    },
                    {
                        "text": "Thời điểm dự báo",
                        "x": "!20",
                        "y": "!20",
                        "width": "50%",
                        "size": 13,
                        "bold": true,
                        "align": "right"
                    }, {
                        "text": symbol ? varName + " (" + symbol + ")" : varName,
                        "rotation": 270,
                        "x": "10",
                        "y": "0",
                        "width": "50%",
                        "size": 13,
                        "bold": true,
                        "align": "right"
                    }]
            });
            chart.write($chart.attr("id"));
            $chart.show();

        }
    };
    private.createTable = (result) => {
        if ($.fn.DataTable.isDataTable(table))
            table.dataTable().fnDestroy();
        table.dataTable({
            data: _data,// chưa có dataSet
            language: {
                url: '/static/translate/vi.json'
            },
            destroy: true,
            filter: false,
            columns: [
                {
                    title: "TT",
                    data: "TT"
                },
                {
                    title: "Thời gian phát bản tin",
                    data: "TimeForecast",
                    render: function (data, type, meta, row) {
                        return data;
                    }
                },
                {
                    title: "Hạn dự báo",
                    data: "Leadtime",
                    render: function (data, type, meta, row) {
                        return data;
                    }
                },
                {
                    title: "Thời gian tại hạn dự báo",
                    data: "DateTim",
                    render: function (data, type, meta, row) {
                        return data;
                    }
                },
                {
                    title: "Giá trị dự báo",
                    data: "ForeVal"
                },
                {
                    title: "Giá trị quan trắc",
                    data: "ObsVal"
                }
            ]
            //columnDefs: columsdef
        });

        observePoint.html(result.pointName);
        sizeTotal.html(result.sizeTotal);
        lostTotal.html(result.lostTotal);
        $table.show();
    };
    private.arrayMin = function (arr) {
        var len = arr.length, min = Infinity;
        while (len--) {
            if (Number(arr[len]) < min) {
                min = Number(arr[len]);
            }
        }
        return min;
    };
    private.arrayMax = function (arr) {
        var len = arr.length, max = -Infinity;
        while (len--) {
            if (Number(arr[len]) > max) {
                max = Number(arr[len]);
            }
        }
        return max;
    };
    return public;
}();

$(document).ready(function () {
    QuickEvaluate.init();
});