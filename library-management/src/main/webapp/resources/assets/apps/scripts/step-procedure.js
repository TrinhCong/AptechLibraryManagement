var StepProducedure = function () {
    let $tableStep1, $tableStep2, $tableStep3, $modalCreate1, $modalCreate2, $modalCreate3, $modalEdit1, $modalEdit2, $modalEdit3;
    let otableStep1, otableStep2, otableStep3, columnStep1, columnStep2, columnStep3,
        ajaxStep1, ajaxStep2, ajaxStep3, fnCompleteTable1, fnCompleteTable2, fnCompleteTable3;
    let $importMd, exFile;
    let S_ForecastGroup, S_ForecastBulletin, S_ForecastOffice, S_ForecastProcedure, S_Step1, S_Step2;
    let private = {
        loadTable($table, _otable, columns, ajax, fnComplete) {
            _otable = $table.dataTable({
                "processing": true,
                "serverSide": false,
                "filter": false,
                "ordering": false,
                "datatype": "json",
                "ajax": {
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    url: ajax.url,
                    data: function (d) {
                        d.param = {
                            id_procedure: S_ForecastProcedure.val() == null ? 0 : S_ForecastProcedure.val(),
                            id_step1: S_Step1.val() == null ? 0 : S_Step1.val(),
                            id_step2: S_Step2.val() == null ? 0 : S_Step2.val()
                        };
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
                "columns": columns,
                "fnInitComplete": fnComplete
            });
        },
        LoadBulletinForecast(selector, id_selected, id_group) {
            $.get("/DisasterForecast/ForecastByGroup", { id: id_group }).done((data) => {
                if (data != null) {
                    selector.empty();
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
        LoadOfficeForecast(selector, id_selected, id_bulletin) {
            $.get("/StepProcedure/getOffice", { id_bulletin: id_bulletin }).done((data) => {
                if (data != null) {
                    selector.empty();
                    for (var i = 0; i < data.length; i++) {
                        selector.append(`<option value="${data[i].Id}">${data[i].Office_Name}</option>`);
                    }
                    if (id_selected) {
                        selector.val(id_selected);
                    }
                    selector.trigger("change");
                }
            })
        },
        LoadProcedureForecast(selector, id_selected, id_office, id_bulletin) {
            $.get("/StepProcedure/getProcedure", { id_office: id_office, id_bulletin: id_bulletin }).done((data) => {
                if (data != null) {
                    selector.empty();
                    for (var i = 0; i < data.length; i++) {
                        selector.append(`<option value="${data[i].Procedure_Id}">${data[i].Procedure_Name}</option>`);
                    }
                    if (id_selected) {
                        selector.val(id_selected);
                    }
                    selector.trigger("change");
                }
            })
        },
        LoadStep1ByProcedure(selector, id_selected, id_procedure) {
            $.get("/StepProcedure/getStep1", { id_procedure: id_procedure }).done((data) => {
                if (data != null) {
                    selector.empty();
                    for (var i = 0; i < data.length; i++) {
                        selector.append(`<option value="${data[i].Cate1_Step_Id}">${data[i].Step1_Name}</option>`);
                    }
                    if (id_selected) {
                        selector.val(id_selected);
                    }
                    selector.trigger("change");
                }
            })
        },
        LoadStep2ByStep1(selector, id_selected, id_step1) {
            $.get("/StepProcedure/getStep2", { id_step1: id_step1 }).done((data) => {
                if (data != null) {
                    selector.empty();
                    for (var i = 0; i < data.length; i++) {
                        selector.append(`<option value="${data[i].Cate2_Step_Id}">${data[i].Step2_Name}</option>`);
                    }
                    if (id_selected) {
                        selector.val(id_selected);
                    }
                    selector.trigger("change");
                }
            })
        },
        IsvalidCreateForm($modal) {
            if (!$modal.find("[name=groupbulletin-create]").val()) {
                DBBB.alert("Vui lòng chọn nhóm bản tin!");
                return false;
            }
            if (!$modal.find("[name=bulletin-create]").val()) {
                DBBB.alert("Vui lòng chọn một bản tin!");
                return false;
            }
            if (!$modal.find("[name=office-create]").val()) {
                DBBB.alert("Vui lòng chọn một đơn vị");
                return false;
            }
            if (!$modal.find("[name=procedure_id]").val()) {
                DBBB.alert("Vui lòng chọn một quy trình bản tin!");
                return false;
            }
            if (!$modal.find("[name=Step_Name]").val()) {
                DBBB.alert("Vui lòng nhập tên bản tin!");
                return false;
            }
            return true;
        },
        IsvalidEditForm($modal) {
            if (!$modal.find("[name=groupbulletin-edit]").val()) {
                DBBB.alert("Vui lòng chọn nhóm bản tin!");
                return false;
            }
            if (!$modal.find("[name=bulletin-edit]").val()) {
                DBBB.alert("Vui lòng chọn một bản tin!");
                return false;
            }
            if (!$modal.find("[name=office-edit]").val()) {
                DBBB.alert("Vui lòng chọn một đơn vị");
                return false;
            }
            if (!$modal.find("[name=procedure_id]").val()) {
                DBBB.alert("Vui lòng chọn một quy trình bản tin!");
                return false;
            }
            if (!$modal.find("[name=Step_Name]").val()) {
                DBBB.alert("Vui lòng nhập tên bản tin!");
                return false;
            }
            return true;
        },
        IsvalidForm2($modal) {
            if (!$modal.find("[name=Cat1_Step_Id]").val()) {
                DBBB.alert("Vui lòng chọn bước cấp 1!");
                return false;
            }

            return true;
        },
        IsvalidForm3($modal) {
            if (!$modal.find("[name=Cat2_Step_Id]").val()) {
                DBBB.alert("Vui lòng chọn bước cấp 2!");
                return false;
            }

            return true
        }
    }

    let root = {
        init() {
            $tableStep1 = $("#table-step1");
            $tableStep2 = $("#table-step2");
            $tableStep3 = $("#table-step3");
            $modalCreate1 = $("#modal-create-step1");
            $modalCreate2 = $("#modal-create-step2");
            $modalCreate3 = $("#modal-create-step3");
            $modalEdit1 = $("#modal-edit-step1");
            $modalEdit2 = $("#modal-edit-step2");
            $modalEdit3 = $("#modal-edit-step3");
            //
            S_ForecastGroup = $("[name=s-group-forecast]");
            S_ForecastBulletin = $("[name=s-name-forecast]");
            S_ForecastOffice = $("[name=s-name-office]");
            S_ForecastProcedure = $("[name=s-name-procedure]");
            S_Step1 = $("[name=s-step-1]");
            S_Step2 = $("[name=s-step-2]");
            root.loadSelectSearch();
            root.createModalStep1();
            root.createModalStep2();
            root.createModalStep3();
            root.initImport();
            //
            $modalCreate1.find(".btn-sm.create").on("click", root.handlerCreateStep1);
            $modalEdit1.find(".btn-sm.update").on("click", root.handlerUpdateStep1);
            $modalCreate2.find(".btn-sm.create").on("click", root.handlerCreateStep2);
            $modalEdit2.find(".btn-sm.update").on("click", root.handlerUpdateStep2);
            $modalCreate3.find(".btn-sm.create").on("click", root.handlerCreateStep3);
            $modalEdit3.find(".btn-sm.update").on("click", root.handlerUpdateStep3);
            //root.loadTableStep1();
            //root.loadTableStep2();
            //root.loadTableStep3();
        },
        loadTableStep1() {
            ajaxStep1 = {
                url: "/StepProcedure/getStep1ByProcedure",
            };
            columnStep1 = [
                {
                    title: 'STT',
                    data: null,
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {
                    title: 'Tên quy trình',
                    data: 'Step1_Name'
                },
                {
                    title: 'Mô tả',
                    data: 'Step1_Desc'
                },
                {
                    title: 'Thứ tự',
                    data: null,
                    render: function (data, type, row, meta) {
                        return `<a class="btn btn-up-step1"><i class="glyphicon glyphicon-arrow-up color-green"></i></a><a class="btn btn-down-step1"><i class="glyphicon glyphicon-arrow-down color-red"></i></a>`;
                    },
                    className: 'text-center'
                },
                {
                    title: 'Thao tác',
                    render: function (data, type, row, meta) {
                        return Mustache.render($('#actions-step1').html());
                    },
                    width: '180px',
                    className: 'text-center'
                }
            ];
            private.loadTable($tableStep1, otableStep1, columnStep1, ajaxStep1, () => {
                $('#table-step1 tbody').on('click', '.edit-item-step1', root.editStep1);
                $('#table-step1 tbody').on('click', '.delete-item', root.handlerDeleteStep1);
                $("#table-step1 tbody").on('click', '.btn-up-step1', (e) => {
                    let a = $(e.currentTarget);
                    let row = a.closest('tr');
                    var data = $tableStep1.fnGetData(row);
                    if (data.Step1_Sequence != 1) {
                        root.EventSequence("/StepProcedure/UpdateOrderStep1", data.Cate1_Step_Id, -1, $tableStep1);
                    }
                });
                $("#table-step1 tbody").on('click', '.btn-down-step1', (e) => {
                    let a = $(e.currentTarget);
                    let row = a.closest('tr');
                    var data = $tableStep1.fnGetData(row);
                    if (data.Step1_Sequence != $tableStep1.DataTable().page.info().recordsTotal) {
                        root.EventSequence("/StepProcedure/UpdateOrderStep1", data.Cate1_Step_Id, 1, $tableStep1);
                    }
                });
            });
        },
        loadTableStep2() {
            ajaxStep2 = {
                url: "/StepProcedure/getStep2ByStep1"
            };
            columnStep2 = [
                {
                    title: 'STT',
                    data: null,
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {
                    title: 'Tên quy trình',
                    data: 'Step2_Name'
                },
                {
                    title: 'Thứ tự',
                    data: null,
                    render: function (data, type, row, meta) {
                        return `<a class="btn btn-up-step2"><i class="glyphicon glyphicon-arrow-up color-green"></i></a><a class="btn btn-down-step2"><i class="glyphicon glyphicon-arrow-down color-red"></i></a>`;
                    },
                    className: 'text-center'
                },
                {
                    title: 'Thao tác',
                    render: function (data, type, row, meta) {
                        return Mustache.render($('#actions-step2').html());
                    },
                    width: '180px',
                    className: 'text-center'
                }
            ];
            private.loadTable($tableStep2, otableStep2, columnStep2, ajaxStep2, () => {
                $('#table-step2 tbody').on('click', '.edit-item-step2', root.editStep2);
                $('#table-step2 tbody').on('click', '.delete-item', root.handlerDeleteStep2);
                $("#table-step2 tbody").on('click', '.btn-up-step2', (e) => {
                    let a = $(e.currentTarget);
                    let row = a.closest('tr');
                    var data = $tableStep2.fnGetData(row);
                    if (data.Step2_Sequence != 1) {
                        root.EventSequence("/StepProcedure/UpdateOrderStep2", data.Cate2_Step_Id, -1, $tableStep2);
                    }
                });
                $("#table-step2 tbody").on('click', '.btn-down-step2', (e) => {
                    let a = $(e.currentTarget);
                    let row = a.closest('tr');
                    var data = $tableStep2.fnGetData(row);
                    if (data.Step2_Sequence != oTable.DataTable().page.info().recordsTotal) {
                        root.EventSequence("/StepProcedure/UpdateOrderStep2", data.Cate2_Step_Id, 1, $tableStep2);
                    }
                });
            });
        },
        loadTableStep3() {
            ajaxStep3 = {
                url: "/StepProcedure/getStep3ByStep2",
            }
            columnStep3 = [
                {
                    title: 'STT',
                    data: null,
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {
                    title: 'Tên quy trình',
                    data: 'Step3_Name'
                },
                {
                    title: "Dạng bước",
                    data: "Step3_Type",
                    render: function (data, type, row, meta) {
                        return EnumStepTypeString[data];
                    }
                },
                {
                    title: 'Mô tả',
                    data: 'Step3_Tips'
                },
                {
                    title: 'Thứ tự',
                    data: null,
                    render: function (data, type, row, meta) {
                        return `<a class="btn btn-up-step2"><i class="glyphicon glyphicon-arrow-up color-green"></i></a><a class="btn btn-down-step2"><i class="glyphicon glyphicon-arrow-down color-red"></i></a>`;
                    },
                    className: 'text-center'
                },
                {
                    title: 'Thao tác',
                    render: function (data, type, row, meta) {
                        return Mustache.render($('#actions-step3').html());
                    },
                    width: '180px',
                    className: 'text-center'
                }
            ];
            private.loadTable($tableStep3, otableStep3, columnStep3, ajaxStep3, () => {
                $('#table-step3 tbody').on('click', '.edit-item-step3', root.editStep3);
                $('#table-step3 tbody').on('click', '.delete-item', root.handlerDeleteStep3);
                $("#table-step3 tbody").on('click', '.btn-up-step3', (e) => {
                    let a = $(e.currentTarget);
                    let row = a.closest('tr');
                    var data = $tableStep3.fnGetData(row);
                    if (data.Step3_Sequence != 1) {
                        root.EventSequence("/StepProcedure/UpdateOrderStep3", data.Cate3_Step_Id, -1, $tableStep3);
                    }
                });
                $("#table-step3 tbody").on('click', '.btn-down-step3', (e) => {
                    let a = $(e.currentTarget);
                    let row = a.closest('tr');
                    var data = $tableStep3.fnGetData(row);
                    if (data.Step3_Sequence != oTable.DataTable().page.info().recordsTotal) {
                        root.EventSequence("/StepProcedure/UpdateOrderStep3", data.Cate3_Step_Id, 1, $tableStep3);
                    }
                });
            });
        },
        loadSelectSearch() {

            S_ForecastGroup.on("change", function () {
                private.LoadBulletinForecast(S_ForecastBulletin, null, $(this).val());
            });
            S_ForecastBulletin.on("change", function () {
                private.LoadOfficeForecast(S_ForecastOffice, null, $(this).val());
            });
            S_ForecastOffice.on("change", function () {
                private.LoadProcedureForecast(S_ForecastProcedure, null, $(this).val(), S_ForecastBulletin.val());
            });
            S_ForecastProcedure.on("change", function () {

                private.LoadStep1ByProcedure(S_Step1, null, S_ForecastProcedure.val());
                if ($.fn.dataTable.isDataTable("#table-step1")) {
                    $tableStep1.DataTable().ajax.reload(() => {
                    });
                } else {
                    root.loadTableStep1();
                }
            });
            S_ForecastGroup.trigger("change");

            S_Step1.on("change", function () {
                if ($.fn.dataTable.isDataTable("#table-step2")) {
                    $tableStep2.DataTable().ajax.reload(() => {
                    });
                } else {
                    root.loadTableStep2();
                }
                private.LoadStep2ByStep1(S_Step2, null, S_Step1.val());
            });
            S_Step2.on("change", function () {
                if ($.fn.dataTable.isDataTable("#table-step3")) {
                    $tableStep3.DataTable().ajax.reload(() => {
                    });
                } else {
                    root.loadTableStep3();
                }
            })
        },
        //
        createModalStep1() {
            $modalCreate1.find("[name=groupbulletin-create]").on("change", function () {
                private.LoadBulletinForecast($modalCreate1.find("[name=bulletin-create]"), null, $(this).val());
            });
            $modalCreate1.find("[name=bulletin-create]").on("change", function () {
                private.LoadOfficeForecast($modalCreate1.find("[name=office-create]"), null, $(this).val());
            });
            $modalCreate1.find("[name=office-create]").on("change", function () {
                private.LoadProcedureForecast($modalCreate1.find("[name=procedure_id]"), null, $(this).val(), $modalCreate1.find("[name=bulletin-create]").val());
            });
            $modalCreate1.find("[name=groupbulletin-create]").trigger("change");
        },
        editStep1() {
            let row = $(this).parents('tr')[0];
            let data = $tableStep1.fnGetData(row);
            console.log(data);
            $modalEdit1.find("[name=Cate1_Step_Id]").val(data.Cate1_Step_Id);
            $modalEdit1.find("[name=Step_Name]").val(data.Step1_Name);
            $modalEdit1.find("[name=Step_Desc]").val(data.Step1_Desc);
            $modalEdit1.find("[name=gui_flag]").val(data.Gui_Flag);
            $modalEdit1.find("[name=groupbulletin-edit]").val(S_ForecastGroup.val());
            //
            $modalEdit1.find("[name=groupbulletin-edit]").on("change", function () {
                private.LoadBulletinForecast($modalEdit1.find("[name=bulletin-edit]"), S_ForecastBulletin.val(), S_ForecastGroup.val());
            });
            $modalEdit1.find("[name=bulletin-edit]").on("change", function () {
                private.LoadOfficeForecast($modalEdit1.find("[name=office-edit]"), S_ForecastOffice.val(), $(this).val());
            });
            $modalEdit1.find("[name=office-edit]").on("change", function () {
                private.LoadProcedureForecast($modalEdit1.find("[name=procedure_id]"), S_ForecastProcedure.val(), $(this).val(), $modalEdit1.find("[name=bulletin-edit]").val());
            });
            //
            $modalEdit1.find("[name=groupbulletin-edit]").trigger("change");
        },
        handlerCreateStep1() {
            if (private.IsvalidCreateForm($modalCreate1)) {
                data = {
                    procedure_id: $modalCreate1.find("[name=procedure_id]").val(),
                    Step1_Name: $modalCreate1.find("[name=Step_Name]").val(),
                    Step1_Desc: $modalCreate1.find("[name=Step_Desc]").val()
                }
                $.post("/StepProcedure/CreateStep1", { data }).done(function (xhr) {
                    if (xhr.success) {
                        $tableStep1.DataTable().ajax.reload(() => {
                        });
                        private.LoadStep1ByProcedure(S_Step1, null, S_ForecastProcedure.val());
                        $modalCreate2.find("[name=procedure_id]").trigger("change");
                        root.cancelStep1();
                    }
                    DBBB.alert(xhr.message);
                })
            }
        },
        handlerUpdateStep1() {
            if (private.IsvalidEditForm($modalEdit1)) {
                DBBB.confirm("Bạn có chắc muốn lưu thông tin vừa chỉnh sửa về bước dự báo cấp 1 này vào CSDL các bước của qui trình dự báo hay không ?",
                    result => {
                        if (result) {
                            data = {
                                Cate1_Step_Id: $modalEdit1.find("[name=Cate1_Step_Id]").val(),
                                Step1_Name: $modalEdit1.find("[name=Step_Name]").val(),
                                Step1_Desc: $modalEdit1.find("[name=Step_Desc]").val()
                            }
                            $.post("/StepProcedure/UpdateStep1", { data }).done(function (xhr) {
                                if (xhr.success) {
                                    $tableStep1.DataTable().ajax.reload(() => {
                                        $tableStep1.find("tbody").find(".edit-item-step1").on("click", root.editStep1);
                                    });
                                    private.LoadStep1ByProcedure(S_Step1, null, S_ForecastProcedure.val());
                                    root.cancelStep1();
                                    $modalCreate2.find("[name=procedure_id]").trigger("change");
                                }
                                DBBB.alert(xhr.message);
                            })
                        }
                    });
            }
        },
        handlerDeleteStep1() {
            let row = $(this).parents('tr')[0];
            let data = $tableStep1.fnGetData(row);
            DBBB.confirm("Bạn có chắc chắn xóa bước cấp 1 này ra khỏi quy trình dự báo không?",
                result => {
                    if (result) {
                        $.post("/StepProcedure/DeleteStep1", { id_step1: data.Cate1_Step_Id }).done(function (xhr) {
                            if (xhr.success) {
                                $tableStep1.DataTable().ajax.reload(() => {
                                    $tableStep1.find("tbody").find(".edit-item-step1").on("click", root.editStep1);
                                    $tableStep1.find("tbody").find(".delete-item").on("click", root.handlerDeleteStep1);
                                });
                                private.LoadStep1ByProcedure(S_Step1, null, S_ForecastProcedure.val());
                                $modalCreate2.find("[name=procedure_id]").trigger("change");
                            }
                            DBBB.alert(xhr.message);
                        })
                    }
                });
        },
        cancelStep1() {
            $modalCreate1.find("form")[0].reset();
            $modalEdit1.find("form")[0].reset();
            $modalCreate1.modal("hide");
            $modalEdit1.modal("hide");
        },
        //
        createModalStep2() {
            $modalCreate2.find("[name=groupbulletin-create]").on("change", function () {
                private.LoadBulletinForecast($modalCreate2.find("[name=bulletin-create]"), null, $(this).val());
            });
            $modalCreate2.find("[name=bulletin-create]").on("change", function () {
                private.LoadOfficeForecast($modalCreate2.find("[name=office-create]"), null, $(this).val());
            });
            $modalCreate2.find("[name=office-create]").on("change", function () {
                private.LoadProcedureForecast($modalCreate2.find("[name=procedure_id]"), null, $(this).val(), $modalCreate2.find("[name=bulletin-create]").val());
            });
            $modalCreate2.find("[name=procedure_id]").on("change", function () {
                private.LoadStep1ByProcedure($modalCreate2.find("[name=Cat1_Step_Id]"), null, $(this).val());
            });
            $modalCreate2.find("[name=groupbulletin-create]").trigger("change");
        },
        editStep2() {
            let row = $(this).parents('tr')[0];
            let data = $tableStep2.fnGetData(row);
            $modalEdit2.find("[name=Cate2_Step_Id]").val(data.Cate2_Step_Id);
            $modalEdit2.find("[name=Step_Name]").val(data.Step2_Name);
            $modalEdit2.find("[name=Step_Desc]").val(data.Step2_Tips);
            $modalEdit2.find("[name=Step_Type]").val(data.Step2_Type);
            //
            $modalEdit2.find("[name=groupbulletin-edit]").val(S_ForecastGroup.val());
            $modalEdit2.find("[name=groupbulletin-edit]").on("change", function () {
                private.LoadBulletinForecast($modalEdit2.find("[name=bulletin-edit]"), S_ForecastBulletin.val(), S_ForecastGroup.val());
            });
            $modalEdit2.find("[name=bulletin-edit]").on("change", function () {
                private.LoadOfficeForecast($modalEdit2.find("[name=office-edit]"), S_ForecastOffice.val(), $(this).val());
            });
            $modalEdit2.find("[name=office-edit]").on("change", function () {
                private.LoadProcedureForecast($modalEdit2.find("[name=procedure_id]"), S_ForecastProcedure.val(), $(this).val(), $modalEdit2.find("[name=bulletin-edit]").val());
            });
            $modalEdit2.find("[name=procedure_id]").on("change", function () {
                private.LoadStep1ByProcedure($modalEdit2.find("[name=Cat1_Step_Id]"), S_Step1.val(), $(this).val());
            });
            //
            $modalEdit2.find("[name=groupbulletin-edit]").trigger("change");
        },
        handlerCreateStep2() {
            if (private.IsvalidCreateForm($modalCreate2) && private.IsvalidForm2($modalCreate2)) {
                data = {
                    Cate1_Step_Id: $modalCreate2.find("[name=Cat1_Step_Id]").val(),
                    Step2_Name: $modalCreate2.find("[name=Step_Name]").val(),
                    //Step2_Type: $modalCreate2.find("[name=Step_Type]").val(),
                    Step2_Tips: $modalCreate2.find("[name=Step_Desc]").val()
                }
                $.post("/StepProcedure/CreateStep2", { data }).done(function (xhr) {
                    if (xhr.success) {
                        $tableStep2.DataTable().ajax.reload(() => {

                        });
                        private.LoadStep2ByStep1(S_Step2, null, S_Step1.val());
                        root.cancelStep2();
                        $modalCreate3.find("[name=Cat1_Step_Id]").trigger("change");
                    }
                    DBBB.alert(xhr.message);
                })
            }
        },
        handlerUpdateStep2() {
            if (private.IsvalidEditForm($modalEdit2) && private.IsvalidForm2($modalEdit2)) {
                DBBB.confirm("Bạn có chắc muốn lưu thông tin vừa chỉnh sửa về bước dự báo cấp 2 này vào CSDL các bước của qui trình dự báo hay không ?",
                    result => {
                        if (result) {
                            data = {
                                Cate2_Step_Id: $modalEdit2.find("[name=Cate2_Step_Id]").val(),
                                Step2_Name: $modalEdit2.find("[name=Step_Name]").val(),
                                //Step2_Type: $modalEdit2.find("[name=Step_Type]").val(),
                                Step2_Tips: $modalEdit2.find("[name=Step_Desc]").val()
                            }
                            $.post("/StepProcedure/UpdateStep2", { data }).done(function (xhr) {
                                if (xhr.success) {
                                    $tableStep2.DataTable().ajax.reload(() => {

                                    });
                                    private.LoadStep2ByStep1(S_Step2, null, S_Step1.val());
                                    root.cancelStep2();
                                    $modalCreate3.find("[name=Cat1_Step_Id]").trigger("change");
                                }
                                DBBB.alert(xhr.message);
                            })
                        }
                    });
            }
        },
        handlerDeleteStep2() {
            let row = $(this).parents('tr')[0];
            let data = $tableStep2.fnGetData(row);
            DBBB.confirm("Bạn có chắc chắn xóa bước cấp 2 này ra khỏi quy trình dự báo không?",
                result => {
                    if (result) {
                        $.post("/StepProcedure/DeleteStep2", { id_step2: data.Cate2_Step_Id }).done(function (xhr) {
                            if (xhr.success) {
                                $tableStep2.DataTable().ajax.reload(() => {

                                });
                                private.LoadStep2ByStep1(S_Step2, null, S_Step1.val());
                                $modalCreate3.find("[name=Cat1_Step_Id]").trigger("change");
                            }
                            DBBB.alert(xhr.message);
                        })
                    }
                });
        },
        cancelStep2() {
            $modalCreate2.find("form")[0].reset();
            $modalEdit2.find("form")[0].reset();
            $modalCreate2.modal("hide");
            $modalEdit2.modal("hide");
        },
        //
        createModalStep3() {
            $modalCreate3.find("[name=groupbulletin-create]").on("change", function () {
                private.LoadBulletinForecast($modalCreate3.find("[name=bulletin-create]"), null, $(this).val());
            });
            $modalCreate3.find("[name=bulletin-create]").on("change", function () {
                private.LoadOfficeForecast($modalCreate3.find("[name=office-create]"), null, $(this).val());
            });
            $modalCreate3.find("[name=office-create]").on("change", function () {
                private.LoadProcedureForecast($modalCreate3.find("[name=procedure_id]"), null, $(this).val(), $modalCreate3.find("[name=bulletin-create]").val());
            });
            $modalCreate3.find("[name=procedure_id]").on("change", function () {
                private.LoadStep1ByProcedure($modalCreate3.find("[name=Cat1_Step_Id]"), null, $(this).val());
            });
            $modalCreate3.find("[name=Cat1_Step_Id]").on("change", function () {
                private.LoadStep2ByStep1($modalCreate3.find("[name=Cat2_Step_Id]"), null, $(this).val())
            });
            $modalCreate3.find("[name=groupbulletin-create]").trigger("change");
        },
        editStep3() {
            let row = $(this).parents('tr')[0];
            let data = $tableStep3.fnGetData(row);
            console.log(data);
            $modalEdit3.find("[name=Cate3_Step_Id]").val(data.Cate3_Step_Id);
            $modalEdit3.find("[name=Step_Name]").val(data.Step3_Name);
            $modalEdit3.find("[name=Step_Desc]").val(data.Step3_Tips);
            $modalEdit3.find("[name=Step3_Action]").val(data.Step3_Action);
            $modalEdit3.find("[name=Step_Type]").val(data.Step3_Type);
            //$modalEdit3.find("[name=Step_Type]").val(data.Step3_Type);
            //
            $modalEdit3.find("[name=groupbulletin-edit]").val(S_ForecastGroup.val());
            $modalEdit3.find("[name=groupbulletin-edit]").on("change", function () {
                private.LoadBulletinForecast($modalEdit3.find("[name=bulletin-edit]"), S_ForecastBulletin.val(), S_ForecastGroup.val());
            });
            $modalEdit3.find("[name=bulletin-edit]").on("change", function () {
                private.LoadOfficeForecast($modalEdit3.find("[name=office-edit]"), S_ForecastOffice.val(), $(this).val());
            });
            $modalEdit3.find("[name=office-edit]").on("change", function () {
                private.LoadProcedureForecast($modalEdit3.find("[name=procedure_id]"), S_ForecastProcedure.val(), $(this).val(), $modalEdit3.find("[name=bulletin-edit]").val());
            });
            $modalEdit3.find("[name=procedure_id]").on("change", function () {
                private.LoadStep1ByProcedure($modalEdit3.find("[name=Cat1_Step_Id]"), S_Step1.val(), $(this).val());
            });
            $modalEdit3.find("[name=Cat1_Step_Id]").on("change", function () {
                private.LoadStep2ByStep1($modalEdit3.find("[name=Cat2_Step_Id]"), S_Step2.val(), $(this).val());
            });
            //
            $modalEdit3.find("[name=groupbulletin-edit]").trigger("change");
        },
        handlerCreateStep3() {
            if (private.IsvalidCreateForm($modalCreate3) && private.IsvalidForm2($modalCreate3) && private.IsvalidForm3($modalCreate3)) {
                data = {
                    Cate2_Step_Id: $modalCreate3.find("[name=Cat2_Step_Id]").val(),
                    Step3_Name: $modalCreate3.find("[name=Step_Name]").val(),
                    Step3_Type: $modalCreate3.find("[name=Step_Type]").val(),
                    Step3_Tips: $modalCreate3.find("[name=Step_Desc]").val(),
                    Step3_Action: $modalCreate3.find("[name=Step3_Action]").val()
                };
                $.post("/StepProcedure/CreateStep3", { data, procedure_id: $modalCreate3.find("[name=procedure_id]").val() }).done(function (xhr) {
                    if (xhr.success) {
                        $tableStep3.DataTable().ajax.reload(() => {
                        });
                        root.cancelStep3();
                    }
                    DBBB.alert(xhr.message);
                })
            }
        },
        handlerUpdateStep3() {
            if (private.IsvalidEditForm($modalEdit3) && private.IsvalidForm2($modalEdit3) && private.IsvalidForm3($modalEdit3)) {
                console.log(1);
                DBBB.confirm("Bạn có chắc muốn lưu thông tin vừa chỉnh sửa về bước dự báo cấp 3 này vào CSDL các bước của qui trình dự báo hay không ?",
                    result => {
                        if (result) {
                            data = {
                                Cate3_Step_Id: $modalEdit3.find("[name=Cate3_Step_Id]").val(),
                                Step3_Name: $modalEdit3.find("[name=Step_Name]").val(),
                                Step3_Type: $modalEdit3.find("[name=Step_Type]").val(),
                                Step3_Tips: $modalEdit3.find("[name=Step_Desc]").val(),
                                Step3_Action: $modalEdit3.find("[name=Step3_Action]").val()
                            }
                            $.post("/StepProcedure/UpdateStep3", {
                                data, forebulletin_admin_id: S_ForecastBulletin.val(),
                                procedure_id: S_ForecastProcedure.val(),
                                forebulletin_office_id: S_ForecastOffice.val()
                            }).done(function (xhr) {
                                if (xhr.success) {
                                    $tableStep3.DataTable().ajax.reload(() => {
                                    });
                                    root.cancelStep3();
                                }
                                DBBB.alert(xhr.message);
                            });
                        }
                    });
            }
        },
        handlerDeleteStep3() {
            let row = $(this).parents('tr')[0];
            let data = $tableStep3.fnGetData(row);
            DBBB.confirm("Bạn có chắc chắn xóa bước cấp 3 này ra khỏi quy trình dự báo không?",
                result => {
                    if (result) {
                        $.post("/StepProcedure/DeleteStep3", { id_step3: data.Cate3_Step_Id }).done(function (xhr) {
                            if (xhr.success) {
                                $tableStep3.DataTable().ajax.reload(() => {
                                });
                            }
                            DBBB.alert(xhr.message);
                        })
                    }
                });
        },
        cancelStep3() {
            $modalCreate3.find("form")[0].reset();
            $modalEdit3.find("form")[0].reset();
            $modalCreate3.modal("hide");
            $modalEdit3.modal("hide");
        },
        EventSequence(url, step_id, status, table) {
            $.post(url, { stepId: step_id, status: status }).done(function (xhr) {
                if (xhr.success)
                    table.DataTable().ajax.reload(null, false);
            });
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
                    url: "/Excel/ImportStepProcedure",
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
}();
$(document).ready(function () {
    StepProducedure.init();
});