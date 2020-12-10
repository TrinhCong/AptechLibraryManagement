var StatisticBulletin = (() => {
    let defTimeStart, defTimeEnd, S_Group, S_Bulletin, S_Office, ItimeStart, ItimeEnd;
    var DatePickerStart, DatePickerEnd, reached_total, notReached_total, _condition;
    let $sideBar, $content, $win, $form, $exportExcel, fromTime, toTime, bGroupDd, bOfficeDd, bulletinDd, forecasterDd;
    let $total, $reachQty, $failQty, $table, table;
    let reachArr = [], failArr = [];
    //let $form, bullgrMs, bullofficeMs, forebullMs, forecasterMs, _bullgrMs, _bullofficeMs, _forebullMs, _forecasterMs;
    let root = {
        init() {
            root.initTheme();
            $form = $sideBar.find("form");
            fromTime = $form.find('[name=start_time]').datetimepicker({
                //defaultDate: new Date(),
                autoclose: true,
                isRTL: App.isRTL(),
                format: "HH:00p dd/mm/yyyy",
                fontAwesome: true,
                todayBtn: true,
                language: 'vi',
                minView: 1,
                pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left")
            }).on("changeDate", () => {
                root.validateTime();
            });
            toTime = $form.find('[name=end_time]').datetimepicker({
                //defaultDate: new Date(),
                autoclose: true,
                isRTL: App.isRTL(),
                format: "HH:00p dd/mm/yyyy",
                fontAwesome: true,
                todayBtn: true,
                language: 'vi',
                minView: 1,
                pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left")
            }).on("changeDate", () => {
                root.validateTime();
            });
            window.toTime = toTime;
            root.setDefaultTime();
            bGroupDd = $form.find("[name=groups]").on('change', root.changeBulletinSource);
            bOfficeDd = $form.find("[name=offices]").on('change', (event) => {
                root.changeBulletinSource();
                root.changeForecasterSource();
            });
            bulletinDd = $form.find("[name=bulletins]");
            forecasterDd = $form.find("[name=forecaster]");
            $form.find(".statistic").on('click', root.statistic);
            $form.on('change', () => {
                $content.hide();
            });

            $exportExcel = $(".export-excel").on("click", root.ExportExcel);

            $total = $("#total");
            $reachQty = $("#reach_qty");
            $failQty = $("#fail_qty");
            $table = $("#statistic_table");
        },
        statistic() {
            if (!toTime.val() || !fromTime.val()) {
                DBBB.alert("Vui lòng chọn đầy đủ thời gian!");
                return;
            }
            var data = {
                StatisticBulletin: {
                    bulletinId: bulletinDd.val() ? bulletinDd.val() : 0,
                    forecasterId: forecasterDd.val() ? forecasterDd.val() : ""
                },
                param: {
                    id_office: bOfficeDd.val() ? bOfficeDd.val() : 0
                },
                time: {
                    time_start: fromTime.val() ? fromTime.val() : "",
                    time_end: toTime.val() ? toTime.val() : "",
                }
            };

            $.post("/StatisticBulletin/BulletinStatistic", { data }).done(xhr => {
                root.loadResult(xhr);
                $content.show();
            });
        },
        loadResult(data) {
            reachArr = [];
            failArr = [];
            if ($.fn.DataTable.isDataTable(table))
                table.dataTable().fnDestroy();
            table = $table.dataTable({
                data: data.result,
                language: {
                    url: '/static/translate/vi.json'
                },
                destroy: true,
                filter: false,
                columns: [
                    {
                        title: 'TT',
                        data: null,
                        render: function (data, type, row, meta) {
                            return meta.row + meta.settings._iDisplayStart + 1;
                        },
                        className: 'text-center'
                    },
                    //{
                    //    title: "Thời gian tại hạn dự báo",
                    //    data: "DateTim",
                    //    render: function (data, type, meta, row) {
                    //        return data;
                    //    }
                    //},
                    {
                        title: "Tên bản tin",
                        data: "Bulletin_Name"
                    },
                    {
                        title: "Đơn vị dự báo",
                        data: "Office_Name"
                    },
                    {
                        title: "Dự báo viên",
                        data: "Forecaster"
                    },
                    {
                        title: "Thời điểm phát bản tin",
                        data: "Issue_Hour"
                    },
                    {
                        title: "Đánh giá",
                        data: null,
                        render: function (data, type, row, meta) {

                            if (root.CheckTime(data.Bulletin_Issue_Format, data.Issue_Hour.split(";"))) {
                                if (reachArr.indexOf(data.Id) === -1)
                                    reachArr.push(data.Id);
                                return "Đạt";
                            } else {
                                if (failArr.indexOf(data.Id) === -1)
                                    failArr.push(data.Id);
                                return "Không đạt";
                            }
                        }
                    }
                ]
                //columnDefs: columsdef
            });
            $total.text(data.total);
            $failQty.text(failArr.length);
            $reachQty.text(reachArr.length);
            _condition = data.condition;

        },
        changeBulletinSource() {
            $.get("/StatisticBulletin/GetBulletins", { groupId: bGroupDd.val(), officeId: bOfficeDd.val() }).done(
                xhr => {
                    bulletinDd.empty();
                    bulletinDd.append('<option value = "0"> Tất cả</option>');
                    if (xhr && xhr.length > 0) {
                        bulletinDd.prop('disabled', false);
                        xhr.filter(x => {
                            bulletinDd.append(`<option value = "${x.ForeBulletin_Id}">${x.ForeBulletin_Name}</option>`);
                        });
                    }
                    else
                        bulletinDd.prop('disabled', true);
                }
            );
        },
        changeForecasterSource() {
            $.get("/StatisticBulletin/GetUser", { officeId: bOfficeDd.val() }).done((xhr) => {
                forecasterDd.empty();
                forecasterDd.append('<option value = "0"> Tất cả</option>');
                if (xhr && xhr.length > 0) {
                    forecasterDd.prop('disabled', false);
                    xhr.filter(x => {
                        forecasterDd.append(`<option value = "${x.Id}">${x.FirstName}</option>`);
                    });
                }
                else
                    forecasterDd.prop('disabled', true);
            });
        },
        validateTime() {
            let time1 = $.dateTime.stringToDate(fromTime.val(), "HH:mm dd/MM/yyyy").getTime();
            let time2 = $.dateTime.stringToDate(toTime.val(), "HH:mm dd/MM/yyyy").getTime();
            if (time2 < time1) {
                DBBB.alert("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!");
                return false;
            }
            return true;
        },
        initTheme() {
            $sideBar = $("#statistic-sidebar");
            $content = $("#statistic-content");
            $win = $(window);
            $win.on('resize', () => {
                let height = $win.height() - 138;
                $sideBar.height(height);
                $content.height(height);
            });
            $sideBar.find("ul li a").on("click", (e) => {
                e.preventDefault();
                $sideBar.find("li").removeClass("active");
                let $li = $(e.target).parents("li");
                $li.addClass("active");
            });
            $win.trigger('resize');
        },
        setDefaultTime() {
            var startdate = new Date();
            startdate.setMonth(startdate.getMonth() - 1);
            let stopdate = new Date();
            fromTime.datetimepicker('setDate', startdate);
            toTime.datetimepicker('setDate', stopdate);

        },
        ExportExcel() {
            var data = {
                start_time: toTime.val(),
                end_time: fromTime.val(),
                group: bGroupDd.find('option:selected').text(),
                office: bOfficeDd.find('option:selected').text(),
                bulletin: bulletinDd.find('option:selected').text(),
                forecaster: forecasterDd.find('option:selected').text(),
                reachQty: reachArr.length,
                failQty: failArr.length,
                condition: _condition
            }
            console.log(data);
            App.postDownload("/StatisticBulletin/ExportToExcel",data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Dữ liệu.xlsx");
        },
        CheckTime(time_check, time_arr) {
            var check = true;
            var index, time_min;
            if (time_arr.length > 0) {
                time_min = Math.abs(root.caculateTime($.dateTime.stringToString(time_check, "HH:mm dd/MM/yyyy", "HH:mm"), time_arr[0]));
                index = 0;
            }
            for (var i = 1; i < time_arr.length; i++) {
                if (Math.abs(root.caculateTime($.dateTime.stringToString(time_check, "HH:mm dd/MM/yyyy", "HH:mm"), time_arr[i])) < time_min) {
                    time_min = Math.abs(root.caculateTime($.dateTime.stringToString(time_check, "HH:mm dd/MM/yyyy", "HH:mm"), time_arr[i]));
                    index = i;
                }
            }
            if (root.caculateTime($.dateTime.stringToString(time_check, "HH:mm dd/MM/yyyy", "HH:mm"), time_arr[index]) < 0) {
                check = false;
            }
            return check;
        },
        caculateTime(time_start, time_end) {
            var time_start_minute = time_start.split(":");
            var time_end_minute = time_end.split(":");
            var total_minute_start = time_start_minute[0] * 60 + time_start_minute[1];
            var total_minute_end = time_end_minute[0] * 60 + time_end_minute[1];
            return total_minute_end - total_minute_start;
        },
    };
    return root;
})();

$(document).ready(() => {
    StatisticBulletin.init();
});
