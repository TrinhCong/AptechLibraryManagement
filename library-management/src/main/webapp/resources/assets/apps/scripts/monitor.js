var Monitor = function () {
    let defTimeStart, defTimeEnd, S_Group, S_Bulletin, S_Office, ItimeStart, ItimeEnd;
    let $tableMonitor, tableMonitor, $btnSearch, $btnExport;
    var DatePickerStart, currentDate;
    let root = {
        init() {
            root.Define();
            root.createDateTimePicker();
            root.TimeDefault();
            root.loadTable();
            root.SearchSelect();
            root.MonitorStart();
            root.ExportExcel();
        },
        Define() {
            ItimeStart = $("[name=time-start]");
            ItimeEnd = $("[name=time-end]");
            S_Group = $("[name=s-group-id]");
            S_Bulletin = $("[name=s-bulletin-id]");
            S_Office = $("[name=s-office-id]");
            $tableMonitor = $("#table-monitor");
            $btnSearch = $(".btn-search");
            $btnExport = $(".btn-export");
        },
        TimeDefault() {
            var time_current = new Date();
            var date_start = new Date();
            date_start.setDate(date_start.getDate() - 2);
            DatePickerStart.datetimepicker("setDate", date_start);
            DatePickerEnd.datetimepicker("setDate", time_current);
        },
        SearchSelect() {
            S_Office.on("change", function () {
                $btnSearch.prop("disabled", false);
            });
            S_Bulletin.on("change", function () {
                $btnSearch.prop("disabled", false);
            });
            S_Group.on("change", function () {
                root.loadBulletin(S_Bulletin, null, $(this).val(), true);
            });
        },
        loadBulletin(selector, id_selected, id_group, getAll) {
            $.get("/DisasterForecast/ForecastByGroup", { id: id_group }).done((data) => {
                if (data != null) {
                    selector.empty();
                    if (getAll) {
                        selector.append(`<option value="-1">Tất cả</option>`);
                    }
                    for (var i = 0; i < data.length; i++) {
                        selector.append(`<option value="${data[i].ForeBulletin_Id}">${data[i].ForeBulletin_Name}</option>`);
                    }
                    if (id_selected) {
                        selector.val(id_selected);
                    }
                    selector.trigger("change");
                }
            })
        },
        loadTable() {
            tableMonitor = $tableMonitor.dataTable({
                "processing": true,
                "serverSide": true,
                "filter": false,
                "ordering": false,
                "datatype": "json",
                "ajax": {
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    url: "/MonitorProcedure/GetList",
                    data: function (d) {
                        d.param = {
                            id_office: S_Office.val()
                        };
                        d.id_bulletin = S_Bulletin.val();
                        d.id_group = S_Group.val();
                        d.time = {
                            time_start: ItimeStart.val(),
                            time_end: ItimeEnd.val()
                        }
                        return JSON.stringify(d);
                    },
                },
                // Internationalisation. For more info refer to http://datatables.net/manual/i18n
                "language": {
                    url: '/static/translate/vi.json'
                },
                "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.
                "bLengthChange": false,
                "lengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "Tất cả"] // change per page values here
                ],
                // set the initial value
                "pageLength": 5,
                "pagingType": "bootstrap_full_number",
                "columns": [
                    {
                        data: null,
                        render: function (data, type, row, meta) {
                            return meta.row + meta.settings._iDisplayStart + 1;
                        }
                    },
                    {
                        data: 'ForeBulletin_Name'
                    },
                    {
                        data: 'Procedure_Start_Format'
                    },
                    {
                        data: 'ForeStart_Hour'
                    },
                    {
                        data: null,
                        render: function (data, type, row, meta) {
                            if (root.CheckTime(data.Procedure_Start_Format, data.ForeStart_Hour.split(";"))) {
                                return "Đạt";
                            } else {
                                return "Không đạt";
                            }
                        }
                    },
                    {
                        data: 'Procedure_End_Format'
                    },
                    {
                        data: 'ForeEnd_Hour'
                    },
                    {
                        data: null,
                        render: function (data, type, row, meta) {
                            if (root.CheckTime(data.Procedure_End_Format, data.ForeEnd_Hour.split(";"))) {
                                return "Đạt";
                            } else {
                                return "Không đạt";
                            }
                        }
                    },
                    {
                        data: 'Bulletin_Issue_Format'
                    },
                    {
                        data: 'Issue_Hour'
                    },
                    {
                        data: null,
                        render: function (data, type, row, meta) {
                            if (root.CheckTime(data.Bulletin_Issue_Format, data.Issue_Hour.split(";"))) {
                                return "Đạt";
                            } else {
                                return "Không đạt";
                            }
                        }
                    },
                    {
                        data: null,
                        width: '70px',
                        render: function (data, type, row, meta) {
                            return `<button class="btn btn-sm bulletin-document" title="Tải bản tin dự báo"><i class="fa fa-download" aria-hidden="true"></i></button>`
                        },
                        className: "text-center"
                    },
                    {
                        render: function (data, type, row, meta) {
                            return `<button class="btn btn-sm document-file" title="Tải hồ sơ dự báo"><i class="fa fa-download" aria-hidden="true"></i></button>`;
                        },
                        width: '70px',
                        className: 'text-center'
                    }
                ],
                "fnInitComplete": function () {

                }
            });
            $tableMonitor.on("click", ".bulletin-document", function () {
                let row = $(this).parents('tr')[0];
                let data = $tableMonitor.fnGetData(row);
                ajaxDownload(`/MonitorProcedure/DownloadBulletinFile?released_id=${data.Id}`, null, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", data.Bulletin_File);
            });
            $tableMonitor.on("click", ".document-file", function () {
                let row = $(this).parents('tr')[0];
                let data = $tableMonitor.fnGetData(row);
                console.log(data);
                ajaxDownload(`/MonitorProcedure/DownloadDocument?released_id=${data.Id}`, null, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", data.Profile_Name);
            });
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
        createDateTimePicker() {
            DatePickerStart = $('[name=time-start]').datetimepicker({
                //Default: currentDate.setDate(currentDate.getDate() - 2),
                autoclose: true,
                isRTL: App.isRTL(),
                format: "HH:00p dd/mm/yyyy",
                fontAwesome: true,
                todayBtn: true,
                language: 'vi',
                minView: 1,
                pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left")
            });
            DatePickerStart.on("changeDate", () => {
                root.validateTime();
            });
            DatePickerEnd = $('[name=time-end]').datetimepicker({
                //Default: currentDate,
                autoclose: true,
                isRTL: App.isRTL(),
                format: "HH:00p dd/mm/yyyy",
                fontAwesome: true,
                todayBtn: true,
                language: 'vi',
                minView: 1,
                pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left")
            });
            DatePickerEnd.on("changeDate", () => {
                root.validateTime();
            });
        },
        validateTime() {
            let time1 = $.dateTime.stringToDate(DatePickerStart.val(), "HH:mm dd/MM/yyyy").getTime();
            let time2 = $.dateTime.stringToDate(DatePickerEnd.val(), "HH:mm dd/MM/yyyy").getTime();
            if (time2 < time1) {
                DBBB.alert("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!");
                return false;
            }
            $btnSearch.prop("disabled", false);
            return true;
        },
        MonitorStart() {
            $btnSearch.on("click", function () {
                if (root.validateTime()) {
                    $tableMonitor.DataTable().ajax.reload();
                }
            });
        },
        ExportExcel() {
            $btnExport.on("click", function () {
                var data = {
                    param: {
                        id_office: S_Office.val()
                    },
                    id_bulletin: S_Bulletin.val(),
                    id_group: S_Group.val(),
                    time: {
                        time_start: ItimeStart.val(),
                        time_end: ItimeEnd.val()
                    }
                };
                var currentDate = new Date();
                var dd = currentDate.getDate();
                var mm = currentDate.getUTCMonth() + 1;
                var yyyy = currentDate.getFullYear();
                ajaxDownload("/MonitorProcedure/ExportExcel", JSON.stringify(data), "application/json; charset=utf-8", S_Office.find("option:selected").text() + "_" + yyyy + mm + dd + ".xlsx");
            });
        }
    };
    return {
        init: root.init
    };
}();

$(document).ready(function () {
    Monitor.init();
});
var ajaxDownload = function (url, data, contentType, fileName) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.responseType = 'blob';
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onloadstart = function () {
        App.startPageLoading()
    };
    xhr.onload = function (e) {
        if (this.status === 200) {
            var blob = new Blob([this.response], {
                type: contentType
            });
            var downloadUrl = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = downloadUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } else {
            alert('Không thể tạo đường dẫn tới tệp tin!');
        }
    };
    xhr.onloadend = function () {

        App.stopPageLoading()
    };
    xhr.send(data);
}