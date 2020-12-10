
var ProcedureConfig = (() => {

    let $table, table,
        $createMd, groupDd, bullDd, procName, procDesc, timeDd,
        $updateMd, uProcId, uGroupDd, uBullDd, uProcName, uProcDesc, uTimeDd;
    let $group_forecast, $name_forecast, id_group;
    let root = {
        init() {
            $table = $('#table');
            root.loadListForecastGroup();
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
                    url: "/DisasterForecast/ForecastProcedures",
                    data: function (d) {
                        var group_id = $("select[name=group-forecast]").val();
                        var id_bulletin = $("select[name=name-forecast]").val();
                        d.group_id = group_id == undefined ? 0 : group_id;
                        d.id_bulletin = id_bulletin == undefined ? 0 : id_bulletin;
                        //d.type_filter_id = id_bulletin == undefined ? 0 : id_bulletin;
                        return JSON.stringify(d);
                    },
                },
                // Internationalisation. For more info refer to http://datatables.net/manual/i18n
                "language": {
                    url: '/static/translate/vi.json'
                },

                "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.

                "lengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "Tất cả"] // change per page values here
                ],
                // set the initial value
                "pageLength": 5,
                "pagingType": "bootstrap_full_number",
                columns: [
                    {
                        title: 'STT',
                        data: 'Stt'
                    },
                    {
                        title: 'Tên quy trình',
                        data: 'Procedure_Name'
                    },
                    {
                        title: "Tên đơn vị dự báo",
                        data: "foreBulletin_Time_Infos",
                        render: function (data, type, row, meta) {
                            var render = "";
                            if (data[0].ForeBulletin_Time != null && data[0].ForeBulletin_Time[0].foreBulletin_Offices != null) {
                                var ForeBulletin_Offices = data[0].ForeBulletin_Time[0].foreBulletin_Offices;
                                for (var i = 0; i < ForeBulletin_Offices.length; i++) {
                                    render += ForeBulletin_Offices[i].Office_Name + ",";
                                }
                                render = render != "" ? render.substring(0, render.length - 1) : "";
                            }
                            return render;
                        }
                    },
                    {
                        title: 'Mô tả',
                        data: 'Procedure_Desc',
                        width: '200px'
                    },
                    {
                        title: 'Thao tác',
                        render: function (data, type, row, meta) {
                            return Mustache.render($('#actions').html());
                        },
                        width: '180px',
                        className: 'text-center'
                    }
                ],
                columnDefs: [
                    {
                        orderable: false,
                        targets: [3]
                    }
                ],
                //"dom": "<'row'<'col-xs-2'l><'col-xs-10'<'toolbar'>>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
                "fnInitComplete": () => {
                    //var toolbar = $(".toolbar");
                }
            });
            $("#filter-group").on('change', function () {
                table.fnFilter();
            });
            $.get('/DisasterForecast/GetBulletins').done(bulls => {
                $.each(bulls, (i, bull) => {
                    $('#filter-group').append($("<option />").val(bull.ForeBulletin_Id).text(bull.ForeBulletin_Name));
                });
            });
        },
        delete() {
            var selectedRow = $(this).parents('tr')[0];
            var data = table.fnGetData(selectedRow);
            DBBB.confirm("Tất cả thông tin và các tập tin liên quan tới quy trình này sẽ bị xóa! Bạn có chắc muốn xóa quy trình này?",
                (result) => {
                    if (result)
                        $.get("/DisasterForecast/DeleteProcedure", { id: data.Procedure_Id }).done(xhr => {
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
            uProcId.val(data.Procedure_Id);
            uProcName.val(data.Procedure_Name);
            uProcDesc.val(data.Procedure_Desc);

            uGroupDd.val(data.bulletin_group_id);
            uGroupDd.trigger("change");
            root.onUBulletinSelectedDb($updateMd.find("[name=bulletin]"), data.time_config.ForeBulletin_Id, data.ForeBulletin_Time_Id);
            //$updateMd.find("[name=bulletin]").val(data.time_config.ForeBulletin_Id);
            //$updateMd.find("[name=bulletin]").trigger("change");
            //uTimeDd.val(data.ForeBulletin_Time_Id);
        },
        handleUpdate() {
            $updateMd = $("#modal-update");
            uProcId = $updateMd.find("[name=procedure_id]");
            uProcName = $updateMd.find("[name=procedure_name]");
            uGroupDd = $updateMd.find("[name=bulletin_group]").on('change', root.onUGroupDdChange);
            uBullDd = $updateMd.find("[name=bulletin]").on('change', root.onUBullDdChange);
            uTimeDd = $updateMd.find("[name=bulletin_time]");
            uProcDesc = $updateMd.find("[name=procedure_desc]");
            $updateMd.find(".update").on('click', root.update);
            $updateMd.find("[data-dismiss]").on('click', root.cancel);
        },
        handleCreate() {
            $createMd = $("#modal-create");
            procName = $createMd.find("[name=procedure_name]");
            groupDd = $createMd.find("[name=bulletin_group]").on('change', root.onGroupDdChange);
            bullDd = $createMd.find("[name=bulletin]").on('change', root.onBullDdChange);
            timeDd = $createMd.find("[name=bulletin_time]");
            procDesc = $createMd.find("[name=procedure_desc]");

            $createMd.find(".create").on('click', root.create);
            $createMd.find("[data-dismiss]").on('click', root.cancel);


            $.get('/DisasterBulletin/GetGroups').done(groups => {
                groupDd.empty();
                $.each(groups, (i, group) => {
                    groupDd.append($("<option />").val(group.ForeGroup_Id).text(group.ForeGroup_Name));
                });
                if (groups[0] != null)
                    groupDd.val(groups[0].ForeGroup_Id);
                groupDd.trigger("change");

                uGroupDd.empty();
                $.each(groups, (i, group) => {
                    uGroupDd.append($("<option />").val(group.ForeGroup_Id).text(group.ForeGroup_Name));
                });
                uGroupDd.val(groups[0].ForeGroup_Id);
                uGroupDd.trigger("change");
            });

        },
        onUGroupDdChange(e) {
            $.get("/Disaster/Process/Bulletins", { groupId: e.target ? e.target.value : 0 }).done(xhr => {
                uBullDd.empty();
                $.each(xhr, (i, bulletin) => {
                    uBullDd.append($("<option />").val(bulletin.ForeBulletin_Id).text(bulletin.ForeBulletin_Name));
                });
            });
        },
        onUBulletinSelectedDb(selector, id_selected, id_selected_BulletinTime) {
            $.get("/Disaster/Process/Bulletins", { groupId: uGroupDd.val() }).done(xhr => {
                selector.empty();
                $.each(xhr, (i, bulletin) => {
                    selector.append($("<option />").val(bulletin.ForeBulletin_Id).text(bulletin.ForeBulletin_Name));
                });
                selector.val(xhr[0].ForeBulletin_Id);
                if (id_selected) {
                    selector.val(id_selected);
                }
                root.onBullTimeSelectedDb(id_selected_BulletinTime, id_selected);
            });
        },
        onBullTimeSelectedDb(id_selected, id_Bulletin) {
            $.get("/DisasterForecast/GetTimeConfigs", { bulletinId: id_Bulletin }).done(times => {
                uTimeDd.empty();
                $.each(times, (index, time) => {
                    var date = time.ForeBulletin_Date == '-9999' ? "*" : time.ForeBulletin_Date;
                    var month = time.ForeBulletin_Month == '-9999' ? "*" : time.ForeBulletin_Month;
                    var year = time.ForeBulletin_Year == '-9999' ? "*" : time.ForeBulletin_Year;

                    uTimeDd.append($("<option />").val(time.ForeBulletin_Time_Id).text(`${time.ForeStart_Hour} - ${time.Issue_Hour} : ${time.ForeEnd_Hour} - ${date}/${month}/${year}`));

                });
                if (id_selected) {
                    uTimeDd.val(id_selected)
                }
            });
        },
        onUBullDdChange() {
            $.get("/DisasterForecast/GetTimeConfigs", { bulletinId: bullDd.val() }).done(times => {
                uTimeDd.empty();
                $.each(times, (index, time) => {
                    uTimeDd.append($("<option />").val(time.ForeBulletin_Time_Id).text(time.Issue_Time));
                });
            });
        },
        onGroupDdChange() {
            $.get("/Disaster/Process/Bulletins", { groupId: groupDd.val() }).done(xhr => {
                bullDd.empty();
                $.each(xhr, (i, bulletin) => {
                    bullDd.append($("<option />").val(bulletin.ForeBulletin_Id).text(bulletin.ForeBulletin_Name));
                });
                bullDd.val(xhr[0].ForeBulletin_Id);
                bullDd.trigger("change");
            });
        },
        onBullDdChange() {
            $.get("/DisasterForecast/GetTimeConfigs", { bulletinId: bullDd.val() }).done(times => {
                timeDd.empty();
                console.log(times);
                $.each(times, (index, time) => {
                    var date = time.ForeBulletin_Date == '-9999' ? "*" : time.ForeBulletin_Date;
                    var month = time.ForeBulletin_Month == '-9999' ? "*" : time.ForeBulletin_Month;
                    var year = time.ForeBulletin_Year == '-9999' ? "*" : time.ForeBulletin_Year;

                    timeDd.append($("<option />").val(time.ForeBulletin_Time_Id).text(`${time.ForeStart_Hour} - ${time.Issue_Hour} : ${time.ForeEnd_Hour} - ${date}/${month}/${year}`));
                });
            });
        },
        isvalidCreateForm() {
            if (!procName.val() || !procName.val().trim()) {
                DBBB.alert("Vui lòng nhập tên quy trình!");
                return false;
            }
            if (!groupDd.val()) {
                DBBB.alert("Vui lòng chọn một nhóm bản!");
                return false;
            }
            if (!bullDd.val()) {
                DBBB.alert("Vui lòng chọn một bản tin");
                return false;
            }
            if (!timeDd.val()) {
                DBBB.alert("Vui lòng chọn 1 cấu hình bản tin!");
                return false;
            }
            return true;
        },

        isvalidUpdateForm() {
            if (!uProcName.val() || !uProcName.val().trim()) {
                DBBB.alert("Vui lòng nhập tên quy trình!");
                return false;
            }
            if (!uGroupDd.val()) {
                DBBB.alert("Vui lòng chọn một nhóm bản!");
                return false;
            }
            if (!uBullDd.val()) {
                DBBB.alert("Vui lòng chọn một bản tin");
                return false;
            }
            if (!uTimeDd.val()) {
                DBBB.alert("Vui lòng chọn 1 cấu hình bản tin!");
                return false;
            }
            return true;
        },

        update() {
            if (root.isvalidUpdateForm()) {
                DBBB.confirm("Bạn có chắc muốn lưu thông tin về qui trình dự báo mới này vào CSDL qui trình dự báo hay không ?",
                    (result) => {
                        if (result) {
                            let param = {
                                Procedure_Id: uProcId.val(),
                                ForeBulletin_Time_Id: uTimeDd.val(),
                                Procedure_Name: uProcName.val().trim(),
                                Procedure_Desc: uProcDesc.val() && uProcDesc.val().trim() ? uProcDesc.val().trim() : "",
                            };
                            $.post("/DisasterForecast/UpdateProcedure", param).done(xhr => {
                                if (xhr.success) {
                                    $table.DataTable().ajax.reload();
                                    root.cancel();
                                }
                                DBBB.alert(xhr.message);
                            });
                        }
                    });
            }
        },
        create() {
            if (root.isvalidCreateForm()) {
                let param = {
                    ForeBulletin_Time_Id: timeDd.val(),
                    Procedure_Name: procName.val().trim(),
                    Procedure_Desc: procDesc.val() && procDesc.val().trim() ? procDesc.val().trim() : "",
                };
                $.post("/DisasterForecast/CreateProcedure", param).done(xhr => {
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
            $createMd.modal("hide");
            $updateMd.modal("hide");
        },

        loadListForecastGroup() {
            $group_forecast = $("select[name=group-forecast]").on("change", function () {
                root.loadForecastByGroup($(this).val());
            });
            $.get("/DisasterBulletin/GetGroups").done((data) => {
                if (data != null) {
                    $.each(data, function (index, value) {
                        $group_forecast.append(`<option value="${value.ForeGroup_Id}">${value.ForeGroup_Name}</option>`);
                        if (index == 0) {
                            root.loadForecastByGroup(value.ForeGroup_Id);
                        }
                    });
                }
            })
        },
        loadForecastByGroup(id_group) {
            $name_forecast = $("select[name=name-forecast]").on("change", function () {
                $table.DataTable().ajax.reload();
            });
            $name_forecast.empty();
            if (id_group != null) {
                $.get("/DisasterForecast/ForecastByGroup", { id: id_group }).done((data) => {
                    if (data != null) {
                        $.each(data, function (index, value) {
                            $name_forecast.append(`<option value="${value.ForeBulletin_Id}">${value.ForeBulletin_Name}</option>`);
                        });
                    }
                });
                $table.DataTable().ajax.reload();
            }
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
                    url: "/Excel/ImportBulletinProcedure",
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
    ProcedureConfig.init();
});