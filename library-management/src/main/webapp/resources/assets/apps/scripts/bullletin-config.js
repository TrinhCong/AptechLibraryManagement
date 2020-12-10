
var BulletinConfig = (() => {
    let $table, table,
        $createMd, bGroupDd, bullDd, unitDd,
        issueHour, issueDate, issueMonth, issueYear,
        startHour, startDate, startMonth, startYear,
        endHour, endDate, endMonth, endYear;
    let $updateMd, uOfficeDd, uBullDd, uTimeId, uBullId,
        uIssueHour, uIssueDate, uIssueMonth, uIssueYear,
        uStartHour, uStartDate, uStartMonth, uStartYear,
        uEndHour, uEndDate, uEndMonth, uEndYear;
    let bullDate, bullMonth, bullYear, uBullDate, uBullMonth, uBullYear;
    let _officeIds = [], _uOfficeIds = [];
    let yearSource = (() => {
        let year = (new Date()).getFullYear();
        let source = [];
        for (var i = year - 5; i < year + 11; i++) {
            source.push(i);
        }
        return source;
    })();
    let root = {
        init() {
            $table = $('#table');
            root.loadTable();
            root.handleCreate();
            root.handleUpdate();
            root.initImport();
            $('#table tbody').on('click', '.edit-item', root.edit);
            $('#table tbody').on('click', '.delete-item', root.delete);
        },
        loadTable() {
            table = $table.dataTable({
                "processing": true,
                "serverSide": true,
                "filter": true,
                "datatype": "json",
                "ajax": {
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    url: "/DisasterBulletin/BulletinTimes",
                    data: function (d) {
                        d.type_filter_id = $('#filter-group').val();
                        return JSON.stringify(d);
                    },
                },
                // Internationalisation. For more info refer to http://datatables.net/manual/i18n
                "language": {
                    url: '/static/translate/vi.json'
                },

                "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.
                "scrollX": true,
                "lengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "Tất cả"] // change per page values here
                ],
                // set the initial value
                "pageLength": 5,
                "pagingType": "bootstrap_full_number",
                columns: [{
                    data: 'Stt'
                }, {
                    data: 'bulletin.ForeBulletin_Name',
                }, {
                    data: null,
                    render: (data, type, row, meta) => {
                        if (data.ForeStart_Hour != '-9999')
                            return data.ForeStart_Hour;
                        else
                            return "*";
                    },
                }, {
                    data: null,
                    render: (data, type, row, meta) => {
                        if (data.Issue_Hour != '-9999')
                            return data.Issue_Hour;
                        else
                            return "*";
                    },
                }, {
                    data: null,
                    render: (data, type, row, meta) => {
                        if (data.ForeEnd_Hour != '-9999')
                            return data.ForeEnd_Hour;
                        else
                            return "*";
                    },
                }, {
                    data: null,
                    render: (data, type, row, meta) => {
                        if (data.ForeBulletin_Date != '-9999')
                            return data.ForeBulletin_Date;
                        else
                            return "*";
                    },
                }, {
                    data: null,
                    render: (data, type, row, meta) => {
                        if (data.ForeBulletin_Month != '-9999')
                            return data.ForeBulletin_Month;
                        else
                            return "*";
                    },
                }, {
                    data: null,
                    render: (data, type, row, meta) => {
                        if (data.ForeBulletin_Year != '-9999')
                            return data.ForeBulletin_Year;
                        else
                            return "*";
                    },
                }, {
                    render: function (data, type, row, meta) {
                        return Mustache.render($('#actions').html());
                    },
                    width: '180px',
                    className: 'text-center'
                }],
                columnDefs: [
                    {
                        orderable: false,
                        targets: [3]
                    },
                ],
                "dom": "<'row'<'col-xs-2'l><'col-xs-10'<'toolbar'>>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
                "fnInitComplete": () => {
                    var toolbar = $(".toolbar");
                }
            });
            $("#filter-group").on('change', function () {
                table.fnFilter();
            });
        },
        delete() {
            var selectedRow = $(this).parents('tr')[0];
            var data = table.fnGetData(selectedRow);
            DBBB.confirm("Bạn có chắc chắn muốn xóa bản tin dự báo thiên tai này ra khỏi CSDL bản tin dự báo thiên tai hay không ?",
                (result) => {
                    if (result)
                        $.get("/DisasterBulletin/DeleteTimeConfig", { timeId: data.ForeBulletin_Time_Id }).done(xhr => {
                            if (xhr.success) {
                                $table.DataTable().ajax.reload();
                                root.cancel();
                            }
                            DBBB.alert(xhr.message);
                        });
                });
        },
        edit() {
            let row = $(this).parents('tr')[0];
            let data = table.fnGetData(row);
            $updateMd.find("[name=time_id]").val(data.ForeBulletin_Time_Id);
            var id_office = data.foreBulletin_Offices ? data.foreBulletin_Offices[0].Id : -1;

            uOfficeDd.val(id_office);
            uIssueHour.multiselect("select", (data.Issue_Hour && data.Issue_Hour != -999) ? data.Issue_Hour.split(';') : []);
            uStartHour.multiselect("select", (data.ForeStart_Hour && data.ForeStart_Hour != -999) ? data.ForeStart_Hour.split(';') : []);
            uEndHour.multiselect("select", (data.ForeEnd_Hour && data.ForeEnd_Hour != -999) ? data.ForeEnd_Hour.split(';') : []);

            uBullDate.multiselect("select", (data.ForeBulletin_Date && data.ForeBulletin_Date != -999) ? data.ForeBulletin_Date.split(';') : []);
            uBullMonth.multiselect("select", (data.ForeBulletin_Month && data.ForeBulletin_Month != -999) ? data.ForeBulletin_Month.split(';') : []);
            uBullYear.multiselect("select", (data.ForeBulletin_Year && data.ForeBulletin_Month != -999) ? data.ForeBulletin_Year.split(';') : []);

            _uOfficeIds = data.ForeBulletin_Id;
            uOfficeDd.trigger("change");
        },
        handleUpdate() {
            $updateMd = $("#modal-update");
            uTimeId = $updateMd.find("[name=time_id]");
            uBullId = $updateMd.find("[name=bulletin_id]");
            uOfficeDd = $updateMd.find("[name=department]");

            uIssueHour = $updateMd.find("[name=issue_hour]");
            uStartHour = $updateMd.find("[name=start_hour]");
            uEndHour = $updateMd.find("[name=end_hour]");

            uBullDate = $updateMd.find("[name=forebulletin_date]");
            uBullMonth = $updateMd.find("[name=forebulletin_month]");
            uBullYear = $updateMd.find("[name=forebulletin_year]");

            for (var i = 1; i <= 31; i++) {
                if (i <= 12) {
                    if (i < 10) {
                        uIssueHour.append($("<option />").val("0" + i + ":00").text("0" + i + ":00"));
                        uIssueHour.append($("<option />").val("0" + i + ":30").text("0" + i + ":30"));

                        uStartHour.append($("<option />").val("0" + i + ":00").text("0" + i + ":00"));
                        uStartHour.append($("<option />").val("0" + i + ":30").text("0" + i + ":30"));

                        uEndHour.append($("<option />").val("0" + i + ":00").text("0" + i + ":00"));
                        uEndHour.append($("<option />").val("0" + i + ":30").text("0" + i + ":30"));
                    }
                    else {
                        uIssueHour.append($("<option />").val(i + ":00").text(i + ":00"));
                        uIssueHour.append($("<option />").val(i + ":30").text(i + ":30"));
                        uStartHour.append($("<option />").val(i + ":00").text(i + ":00"));
                        uStartHour.append($("<option />").val(i + ":30").text(i + ":30"));
                        uEndHour.append($("<option />").val(i + ":00").text(i + ":00"));
                        uEndHour.append($("<option />").val(i + ":30").text(i + ":30"));
                    }

                    uBullDate.append($("<option />").val(i).text(i));
                    uBullMonth.append($("<option />").val(i).text(i));
                }
                else if (i > 12 && i <= 24) {
                    uIssueHour.append($("<option />").val(i + ":00").text(i + ":00"));
                    uIssueHour.append($("<option />").val(i + ":30").text(i + ":30"));

                    uStartHour.append($("<option />").val(i + ":00").text(i + ":00"));
                    uStartHour.append($("<option />").val(i + ":30").text(i + ":30"));

                    uEndHour.append($("<option />").val(i + ":00").text(i + ":00"));
                    uEndHour.append($("<option />").val(i + ":30").text(i + ":30"));

                    uBullDate.append($("<option />").val(i).text(i));

                }
                else {
                    uBullDate.append($("<option />").val(i).text(i));
                }
            }

            yearSource.filter(x => {
                uBullYear.append($("<option />").val(x).text(x));
            });

            uOfficeDd.on("change", (e) => {
                var id = e.currentTarget ? e.currentTarget.value : 0;
                root.getBulletin($updateMd, id, _uOfficeIds);
            });

            root.initMultiSelectDd([uIssueHour, uStartHour, uEndHour, uBullDate, uBullMonth, uBullYear]);

            $updateMd.find(".update").on('click', root.update);
            $updateMd.find("[data-dismiss]").on('click', root.cancel);
        },
        handleCreate() {
            $createMd = $("#modal-create");
            unitDd = $createMd.find("[name=department]").on("change", (e) => {
                var id = e.currentTarget ? e.currentTarget.value : 0;
                root.getBulletin($createMd, id);
            });
            unitDd.trigger("change");
            bullDd = $createMd.find("[name=bulletin_id]").on('change', root.onBullDdChange);

            issueHour = $createMd.find("[name=issue_hour]");
            startHour = $createMd.find("[name=start_hour]");
            endHour = $createMd.find("[name=end_hour]");

            bullDate = $createMd.find("[name=forebulletin_date]");
            bullMonth = $createMd.find("[name=forebulletin_month]");
            bullYear = $createMd.find("[name=forebulletin_year]");

            for (var i = 1; i <= 31; i++) {
                if (i <= 12) {
                    if (i < 10) {
                        issueHour.append($("<option />").val("0" + i + ":00").text("0" + i + ":00"));
                        issueHour.append($("<option />").val("0" + i + ":30").text("0" + i + ":30"));

                        startHour.append($("<option />").val("0" + i + ":00").text("0" + i + ":00"));
                        startHour.append($("<option />").val("0" + i + ":30").text("0" + i + ":30"));

                        endHour.append($("<option />").val("0" + i + ":00").text("0" + i + ":00"));
                        endHour.append($("<option />").val("0" + i + ":30").text("0" + i + ":30"));
                    }
                    else {
                        issueHour.append($("<option />").val(i + ":00").text(i + ":00"));
                        issueHour.append($("<option />").val(i + ":30").text(i + ":30"));

                        startHour.append($("<option />").val(i + ":00").text(i + ":00"));
                        startHour.append($("<option />").val(i + ":30").text(i + ":30"));

                        endHour.append($("<option />").val(i + ":00").text(i + ":00"));
                        endHour.append($("<option />").val(i + ":30").text(i + ":30"));
                    }
                    bullDate.append($("<option />").val(i).text(i));
                    bullMonth.append($("<option />").val(i).text(i));

                }
                else if (i > 12 && i <= 24) {
                    issueHour.append($("<option />").val(i + ":00").text(i + ":00"));
                    issueHour.append($("<option />").val(i + ":30").text(i + ":30"));

                    startHour.append($("<option />").val(i + ":00").text(i + ":00"));
                    startHour.append($("<option />").val(i + ":30").text(i + ":30"));

                    endHour.append($("<option />").val(i + ":00").text(i + ":00"));
                    endHour.append($("<option />").val(i + ":30").text(i + ":30"));

                    bullDate.append($("<option />").val(i).text(i));
                }
                else {
                    bullDate.append($("<option />").val(i).text(i));
                }
            }
            yearSource.filter(x => {
                bullYear.append($("<option />").val(x).text(x));
            });
            root.initMultiSelectDd([issueHour, startHour, endHour, bullDate, bullMonth, bullYear]);

            $createMd.find(".create").on('click', root.create);
            $createMd.find("[data-dismiss]").on('click', root.cancel);

        },
        initMultiSelectDd(eleArray) {
            if (eleArray && typeof eleArray === 'object' && eleArray.length > 0) {
                eleArray.filter(x => {
                    x.multiselect({
                        includeSelectAllOption: false,
                        selectAllValue: 'multiselect-all',
                        selectAllJustVisible: false,
                        buttonWidth: '108px',
                        maxHeight: '96',
                        nonSelectedText: 'Tất cả'
                    })
                })
            }
        },
        onBullDdChange() {
            $.get("/DisasterBulletin/GetOffices", { bulletinId: bullDd.val() }).done(units => {
                unitDd.empty();
                if (units.length > 0) {
                    $.each(units, (i, unit) => {
                        unitDd.append($("<option />").val(unit.Id).text(unit.Office_Name));
                    });
                    unitDd.multiselect("destroy").multiselect({
                        includeSelectAllOption: true,
                        selectAllValue: 'multiselect-all',
                        selectAllJustVisible: true,
                        buttonWidth: '100%',
                        maxHeight: '200'
                    });
                }
            });

        },
        isvalidCreateForm() {
            if (!bullDd.val()) {
                DBBB.alert("Vui lòng chọn một bản tin!");
                return false;
            }
            if (!unitDd.val()) {
                DBBB.alert("Vui lòng chọn một đơn vị");
                return false;
            }
            var reg = new RegExp('^(([01]?[0-9]|2[0-3])h[0-5][0-9];)*([01]?[0-9]|2[0-3])h[0-5][0-9]$');

            var thoigian_phat = issueHour.val() ? issueHour.val() : [];
            var thoigian_batdau = startHour.val() ? startHour.val() : [];
            var thoigian_ketthuc = endHour.val() ? endHour.val() : [];
            if (!bullDate.val() && !bullMonth.val() && !bullYear.val() && !thoigian_phat && !thoigian_batdau && !thoigian_ketthuc) {
                DBBB.alert("Vui lòng chọn cấu hình thời gian!");
                return false;
            }
            if (thoigian_phat || thoigian_batdau || thoigian_ketthuc) {

                if (thoigian_batdau.length !== thoigian_ketthuc.length || thoigian_phat.length !== thoigian_batdau.length || thoigian_ketthuc.length !== thoigian_phat.length) {
                    DBBB.alert("Số lượng thời gian bắt đầu, thời gian phát bản tin và kết thúc bản tin phải bằng nhau <br/> Ví dụ : bắt đầu 08:30,14:00; phát hành 9:30;16:00; kết thúc 10:00,17:00")
                    return false;
                }
                for (var i = 0; i < thoigian_batdau.length; i++) {
                    if (root.caculateTime(thoigian_batdau[i], thoigian_phat[i]) < 0
                        || root.caculateTime(thoigian_phat[i], thoigian_ketthuc[i]) < 0) {
                        DBBB.alert(`Thời gian : bắt đầu ${thoigian_batdau[i]} - phát bản tin : ${thoigian_phat[i]} - thời gian kết thúc ${thoigian_ketthuc[i]} không hợp lệ`);
                        return false;
                    }
                }
            }

            return true;
        },

        isvalidUpdateForm() {
            if (!uBullId.val()) {
                DBBB.alert("Vui lòng chọn một bản tin!");
                return false;
            }
            if (!uOfficeDd.val()) {
                DBBB.alert("Vui lòng chọn một đơn vị");
                return false;
            }

            var thoigian_phat = uIssueHour.val() ? uIssueHour.val() : [];
            var thoigian_batdau = uStartHour.val() ? uStartHour.val() : [];
            var thoigian_ketthuc = uEndHour.val() ? uEndHour.val() : [];
            if (!bullDate.val() && !bullMonth.val() && !bullYear.val() && !thoigian_phat && !thoigian_batdau && !thoigian_ketthuc) {
                DBBB.alert("Vui lòng chọn cấu hình thời gian!");
                return false;
            }
            if (thoigian_phat || thoigian_batdau || thoigian_ketthuc) {

                if (thoigian_batdau.length !== thoigian_ketthuc.length || thoigian_phat.length !== thoigian_batdau.length || thoigian_ketthuc.length !== thoigian_phat.length) {
                    DBBB.alert("Số lượng thời gian bắt đầu, thời gian phát bản tin và kết thúc bản tin phải bằng nhau <br/> Ví dụ : bắt đầu 08:30,14:00; phát hành 9:30;16:00; kết thúc 10:00,17:00")
                    return false;
                }
                for (var i = 0; i < thoigian_batdau.length; i++) {
                    if (root.caculateTime(thoigian_batdau[i], thoigian_phat[i]) < 0
                        || root.caculateTime(thoigian_phat[i], thoigian_ketthuc[i]) < 0) {
                        DBBB.alert(`Thời gian : bắt đầu ${thoigian_batdau[i]} - phát bản tin : ${thoigian_phat[i]} - thời gian kết thúc ${thoigian_ketthuc[i]} không hợp lệ`);
                        return false;
                    }
                }
            }

            return true;
        },

        update() {
            if (root.isvalidUpdateForm()) {
                let param = {
                    ForeBulletin_Time_Id: uTimeId.val(),
                    ForeBulletin_Id: uBullId.val(),
                    officeIds: uOfficeDd.val(),
                    Issue_Hour: uIssueHour.val() ? uIssueHour.val().join(';') : '-9999',
                    ForeStart_Hour: uStartHour.val() ? uStartHour.val().join(';') : '-9999',
                    ForeEnd_Hour: uEndHour.val() ? uEndHour.val().join(';') : '-9999',

                    ForeBulletin_Date: uBullDate.val() ? uBullDate.val().join(';') : '-9999',
                    ForeBulletin_Month: uBullMonth.val() ? uBullMonth.val().join(';') : '-9999',
                    ForeBulletin_Year: uBullYear.val() ? uBullYear.val().join(';') : '-9999'
                };
                $.post("/DisasterBulletin/UpdateTimeConfig", param).done(xhr => {
                    if (xhr.success) {
                        $table.DataTable().ajax.reload();
                        root.cancel();
                    }
                    DBBB.alert(xhr.message);
                });

            }
        },
        create() {
            if (root.isvalidCreateForm()) {
                let param = {
                    ForeBulletin_Id: bullDd.val(),
                    officeIds: unitDd.val(),
                    Issue_Hour: issueHour.val() ? issueHour.val().join(';') : '-9999',
                    ForeStart_Hour: startHour.val() ? startHour.val().join(';') : '-9999',
                    ForeEnd_Hour: endHour.val() ? endHour.val().join(';') : '-9999',

                    ForeBulletin_Date: bullDate.val() ? bullDate.val().join(';') : '-9999',
                    ForeBulletin_Month: bullMonth.val() ? bullMonth.val().join(';') : '-9999',
                    ForeBulletin_Year: bullYear.val() ? bullYear.val().join(';') : '-9999',
                };
                $.post("/DisasterBulletin/CreateTimeConfig", param).done(xhr => {
                    if (xhr.success) {
                        $table.DataTable().ajax.reload();
                        root.cancel();
                    }
                    DBBB.alert(xhr.message);
                });

            }
        },
        cancel() {
            $createMd.find("form")[0].reset();
            $updateMd.find("form")[0].reset();

            _officeIds = [];
            _uOfficeIds = [];

            $createMd.find(".multi").val([]);
            $createMd.find(".multi").multiselect("deselectAll");
            $createMd.find(".multi").multiselect("refresh");

            $createMd.find(".multi").val([]);
            $createMd.find(".multi").multiselect("deselectAll");
            $createMd.find(".multi").multiselect("refresh");

            $createMd.modal("hide");
            $updateMd.modal("hide");
        },
        getBulletin($modal, id_office, id_selected) {
            $modal.find("[name=bulletin_id]").empty();
            $.post("/DisasterForecast/getBulletins", { office_id: id_office }).done(xhr => {
                var options = ``;
                for (var i = 0; i < xhr.length; i++) {
                    options += `<option value="${xhr[i].ForeBulletin_Id}">${xhr[i].ForeBulletin_Name}</option>`
                }
                $modal.find("[name=bulletin_id]").append(options);
                if (id_selected)
                    $modal.find("[name=bulletin_id]").val(id_selected);
            });
        },
        caculateTime(time_start, time_end) {
            var time_start_minute = time_start.split(":");
            var time_end_minute = time_end.split(":");
            var total_minute_start = time_start_minute[0] * 60 + time_start_minute[1];
            var total_minute_end = time_end_minute[0] * 60 + time_end_minute[1];
            return total_minute_end - total_minute_start;
        },
        initImport() {
            $importMd = $("#modal-import");
            exFile = $importMd.find("[name=excel_file]");
            $importMd.find(".upload").on("click", (e) => {
                if (!exFile.val()) {
                    DBBB.alert("vui lòng chọn 1 tệp tin!");
                    return;
                }
                let file = exFile[0].files[0];
                if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                        DBBB.alert("Vui lòng chỉ chọn tập tin doc và có dung lượng nhỏ hơn 5 MB!");
                        return;
                    }
                }
                var data = new FormData();
                data.append('excelFile', file);
                $.ajax({
                    url: "/Excel/ImportBulletinConfigTime",
                    type: 'POST',
                    data: data,
                    cache: false,
                    dataType: 'json',
                    processData: false,
                    contentType: false,
                    success(response, textStatus, jqXHR) {
                        if (response.success) {
                            $importMd.find("form")[0].reset();
                            $importMd.modal('hide');
                            $table.DataTable().ajax.reload();
                        }
                        DBBB.alert(response.message);
                    },
                    error: DBBB.error
                });

            });
        },
    }

    return {
        init: root.init
    };

})();



$(document).ready(() => {
    BulletinConfig.init();
});