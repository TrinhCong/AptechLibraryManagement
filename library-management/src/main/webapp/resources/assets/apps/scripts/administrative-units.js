var AdminnistrativeUnits = function () {
    let $tableProvince, $tableDitrict, tableProvince, tableDitrict, ajaxProvince, ajaxDistrict, columnsProvince, columnsDistrict;
    let $modalCreateProvince, $modalCreateDitrict, $modalEditProvince, $modalEditDitrict;
    let S_provinces;
    var root = {
        init() {
            $tableProvince = $("#table-province");
            $tableDitrict = $("#table-district");
            $modalCreateProvince = $("#modal-create-province");
            $modalCreateDitrict = $("#modal-create-district");
            $modalEditProvince = $("#modal-edit-province");
            $modalEditDitrict = $("#modal-edit-ditrict");
            S_provinces = $("[name=s-province-id]");
            //
            root.loadTableProvince();
            root.loadTableDistrict();
            //
            S_provinces.on("change", function () {
                $tableDitrict.DataTable().ajax.reload();
            });
            $modalCreateDitrict.find(".create").on("click", root.handlerCreateDistrict);
            $modalCreateProvince.find(".create").on("click", root.handlerCreateProvince);
            $modalEditDitrict.find(".update").on("click", root.handlerEditDistrict);
            $modalEditProvince.find(".update").on("click", root.handlerEditProvince);
        },
        loadTable($table, _otable, columns, ajax, fnComplete, action_edit, action_delete) {
            _otable = $table.dataTable({
                "processing": true,
                "serverSide": true,
                "filter": false,
                "ordering": false,
                "datatype": "json",
                "ajax": {
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    url: ajax.url,
                    data: function (d) {
                        console.log(S_provinces.val());
                        d.region = {
                            province_id: S_provinces != undefined ? S_provinces.val() : 0
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
            $table.on("click", ".edit-item", action_edit);
            $table.on("click", ".delete-item", action_delete);
        },
        loadTableProvince() {
            columnsProvince = [
                {
                    title: 'STT',
                    data: null,
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {
                    title: 'Tên Tỉnh / Thành phố',
                    data: 'province_name'
                },
                {
                    title: 'Mô tả',
                    data: 'province_desc'
                },
                {
                    title: 'Thao tác',
                    render: function (data, type, row, meta) {
                        return Mustache.render($('#actions-province').html());
                    },
                    width: '180px',
                    className: 'text-center'
                }
            ];
            ajaxProvince = {
                url: "/DisasterLevel/ListProvince"
            };
            root.loadTable($tableProvince, tableProvince, columnsProvince, ajaxProvince, () => { }, root.editProvince, root.deleteProvince);
        },
        loadTableDistrict() {
            columnsDistrict = [
                {
                    title: 'STT',
                    data: null,
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {
                    title: 'Tên Huyện/Thành phố/Thị xã',
                    data: 'district_name'
                },
                {
                    title: 'Mô tả',
                    data: 'district_desc'
                },
                {
                    title: 'Thao tác',
                    render: function (data, type, row, meta) {
                        return Mustache.render($('#actions-district').html());
                    },
                    width: '180px',
                    className: 'text-center'
                }
            ];
            ajaxDistrict = {
                url: "/DisasterLevel/ListDistrict"
            };
            root.loadTable($tableDitrict, tableDitrict, columnsDistrict, ajaxDistrict, () => { }, root.editDistrict, root.deleteDistrict);
        },
        editProvince() {
            let row = $(this).parents('tr')[0];
            let data = $tableProvince.fnGetData(row);
            $modalEditProvince.find("[name=province_name]").val(data.province_name);
            $modalEditProvince.find("[name=province_desc]").val(data.province_desc);
        },
        createModalProvince() {

        },
        handlerCreateProvince() {
            if (root.IsvalidCreateOrUpdateProvince($modalCreateProvince)) {
                let data = {
                    province_name: $modalCreateProvince.find("[name=province_name]").val(),
                    province_desc: $modalCreateProvince.find("[name=province_desc]").val()
                }
                $.post("/DisasterLevel/CreateOrUpdateProvince", data).done(function (xhr) {
                    if (xhr.success) {
                        $tableProvince.DataTable().ajax.reload();
                        root.refreshProvince();
                        root.cancelProvince();
                    }
                    DBBB.alert(xhr.message);
                });
            }
        },
        handlerEditProvince() {
            if (root.IsvalidCreateOrUpdateProvince($modalEditProvince)) {
                let data = {
                    province_id: $modalEditProvince.find("[name=province_id]").val(),
                    province_name: $modalEditProvince.find("[name=province_name]").val(),
                    province_desc: $modalEditProvince.find("[name=province_desc]").val()
                }
                DBBB.confirm("Bạn có chắc muốn lưu thông tin vừa chỉnh sửa về đơn vị hành chính cấp Tỉnh/Thành phố này vào CSDL Tỉnh/Thành phố không  ?",
                    result => {
                        if (result) {
                            $.post("/DisasterLevel/CreateOrUpdateProvince", data).done(function (xhr) {
                                if (xhr.success) {
                                    $tableProvince.DataTable().ajax.reload();
                                    root.refreshProvince();
                                    root.cancelProvince();
                                }
                                DBBB.alert(xhr.message);
                            });
                        }
                    })
            }
        },
        deleteProvince() {
            DBBB.confirm("Bạn có chắc chắn muốn xóa đơn vị hành chính cấp Tỉnh/Thành phố này vào CSDL Tỉnh/Thành phố hay không ?",
                result => {
                    if (result) {
                        let row = $(this).parents('tr')[0];
                        let data = $tableProvince.fnGetData(row);
                        $.get("/DisasterLevel/DeleteProvince", { id_province: data.province_id }).done(function (xhr) {
                            if (xhr.success) {
                                $tableProvince.DataTable().ajax.reload();
                                root.refreshProvince();
                                root.cancelProvince();
                            }
                            DBBB.alert(xhr.message);
                        });
                    }
                })
        },
        editDistrict() {
            let row = $(this).parents('tr')[0];
            let data = $tableDitrict.fnGetData(row);
            console.log(data);
            $modalEditDitrict.find("[name=province_id]").val(S_provinces.val());
            $modalEditDitrict.find("[name=district_id]").val(data.district_id);
            $modalEditDitrict.find("[name=district_name]").val(data.district_name);
            $modalEditDitrict.find("[name=district_desc]").val(data.district_desc);
        },
        createModalDistrict() {

        },
        handlerCreateDistrict() {
            if (root.IsvalidCreateOrUpdateDistrict($modalCreateDitrict)) {
                let data = {
                    id_province: $modalCreateDitrict.find("[name=province_id]").val(),
                    district_name: $modalCreateDitrict.find("[name=district_name]").val(),
                    district_desc: $modalCreateDitrict.find("[name=district_desc]").val()
                }
                $.post("/DisasterLevel/CreateOrUpdateDistrict", data).done(function (xhr) {
                    if (xhr.success) {
                        $tableDitrict.DataTable().ajax.reload();
                        root.cancelDistrict();
                    }
                    DBBB.alert(xhr.message);
                });
            }
        },
        handlerEditDistrict() {
            if (root.IsvalidCreateOrUpdateDistrict($modalCreateDitrict)) {
                let data = {
                    district_id: $modalEditDitrict.find("[name=district_id]").val(),
                    district_name: $modalEditDitrict.find("[name=district_name]").val(),
                    district_desc: $modalEditDitrict.find("[name=district_desc]").val()
                }
                DBBB.confirm("Bạn có chắc muốn lưu thông tin vừa chỉnh sửa về đơn vị hành chính cấp Tỉnh/Thành phố này vào CSDL Tỉnh/Thành phố không  ?",
                    result => {
                        if (result) {
                            $.post("/DisasterLevel/CreateOrUpdateDistrict", data).done(function (xhr) {
                                if (xhr.success) {
                                    $tableDitrict.DataTable().ajax.reload();
                                    root.cancelDistrict();
                                }
                                DBBB.alert(xhr.message);
                            });
                        }
                    })
            }
        },
        deleteDistrict() {
            let row = $(this).parents('tr')[0];
            let data = $tableDitrict.fnGetData(row);
            DBBB.confirm("Bạn có chắc chắn muốn xóa đơn vị hành chính cấp Huyện/Thành phố/Thị xã này ra khỏi CSDL Huyện/Thành phố/Thị xã hay không ?",
                result => {
                    if (result) {
                        $.get("/DisasterLevel/DeleteDistrict", { id_district: data.district_id }).done(function (xhr) {
                            if (xhr.success) {
                                $tableDitrict.DataTable().ajax.reload();
                                root.cancelDistrict();
                            }
                            DBBB.alert(xhr.message);
                        })
                    }
                })
        },
        IsvalidCreateOrUpdateProvince($modal) {
            if (!$modal.find("[name=province_name]").val()) {
                DBBB.alert("Vui lòng nhập tên tỉnh hoặc thành phố!");
                return false;
            }
            if (!$modal.find("[name=province_desc]").val()) {
                DBBB.alert("Vui lòng nhập mô tả cho tỉnh hoặc thành phố!");
                return false;
            }
            return true;
        },
        IsvalidCreateOrUpdateDistrict($modal) {
            if (!$modal.find("[name=district_name]").val()) {
                DBBB.alert("Vui lòng nhập tên huyện/thành phố hoặc thị xã!");
                return false;
            }
            if (!$modal.find("[name=district_desc]").val()) {
                DBBB.alert("Vui lòng nhập mô tả cho huyện/thành phố hoặc thị xã!");
                return false;
            }
            return true;
        },
        cancelProvince() {
            $modalCreateProvince.modal("hide");
            $modalEditProvince.modal("hide");
            $modalCreateProvince.find("form")[0].reset();
            $modalEditProvince.find("form")[0].reset();
        },
        cancelDistrict() {
            $modalCreateDitrict.modal("hide");
            $modalEditDitrict.modal("hide");
            $modalCreateDitrict.find("form")[0].reset();
            $modalEditDitrict.find("form")[0].reset();
        },
        loadProvinces(selector, id_selected) {
            $.get("/disasterLevel/getProvinces").done(function (data) {
                if (data != null) {
                    selector.empty();
                    $.each(data, function (index, value) {
                        selector.append(`<option value="${value.province_id}">${value.province_name}</option>`);
                    });
                    if (id_selected) {
                        selector.val(id_selected);
                    }
                    selector.trigger("change");
                }
            })
        },
        refreshProvince() {
            root.loadProvinces(S_provinces, null);
            root.loadProvinces($modalCreateDitrict.find("[name=province_id]"), null);
            root.loadProvinces($modalEditDitrict.find("[name=province_id]"), null);
        }
    };
    return {
        init: root.init
    };
}()
$(document).ready(() => {
    AdminnistrativeUnits.init();
})