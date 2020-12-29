
var RiskLevel = (() => {
    let $tblRiskLevel, tblRiskLevel, $modalCreate, $modalEdit;
    let S_Province, S_Disaster;
    let root = {
        init() {
            S_Province = $("[name=s-province-id]").on('change', () => {
                tblRiskLevel.DataTable().ajax.reload();
            });
            S_Disaster = $("[name=s-disaster-id]").on('change', () => {
                S_Province.trigger('change');
            });
            root.initRiskLevel();
            root.handlerCreate();
            root.initImport();
            $modalEdit = $("#modal-edit-risk");
            $modalEdit.find(".update").on("click", root.handlerEdit);

        },
        initRiskLevel() {
            $tblRiskLevel = $("#table-risk");
            tblRiskLevel = $tblRiskLevel.dataTable({
                "processing": true,
                "serverSide": true,
                "filter": false,
                "datatype": "json",
                "ordering": false,
                "ajax": {
                    type: "post",
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    url: "/DisasterLevel/RiskLevelList",
                    data: function (d) {
                        d.region = {
                            province_id: S_Province == null ? 0 : S_Province.val()
                        }
                        d.param = {
                            id_disaster: S_Disaster == null ? 0 : S_Disaster.val()
                        }
                        return JSON.stringify(d);
                    },
                },
                // Internationalisation. For more info refer to http://datatables.net/manual/i18n
                "language": {
                    url: '/static/translate/vi.json'
                },
                dom: `<'row'
                            <'col-sm-12 col-md-6'l>
                            <'col-sm-12 col-md-6'f>
                        >
                        <'row'
                            <'col-sm-12'tr>
                        >
                        <'row'
                            <'col-sm-12 col-md-5'i>
                            <'col-sm-12 col-md-7'p>
                        >`,

                "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.

                "lengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "Tất cả"] // change per page values here
                ],
                // set the initial value
                "pageLength": 5,
                "pagingType": "bootstrap_full_number",

                columns: [{
                    title: 'TT',
                    data: null,
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    },
                    className: 'text-center'
                }, {
                    title: 'Huyện/Thành phố/Thị xã',
                    data: 'District',
                        render: function (data, type, row, meta) {
                        return data == null ? "" : data.Name_vn;
                    }
                }, {
                    title: 'Rủi ro',
                    data: 'R'
                }, {
                    title: "Hiểm họa",
                    data: "H"
                }, {
                    title: "Mức độ phơi nhiễm",
                    data: "E"
                }, {
                    title: "Tính tổn thương",
                    data: "V"
                }, {
                    title: 'Thao tác',
                    render: function (data, type, row, meta) {
                        return Mustache.render($('#actions').html());
                    },
                    width: '180px',
                    className: 'text-center'
                }],
                columnDefs: [

                ],

            });
            $('#table-risk tbody').on('click', '.edit-item', root.edit);
            $('#table-risk tbody').on('click', '.delete-item', root.delete);
        },
        edit() {
            $modalEdit.find("[name=province-id]").on("change", function () {
                root.loadDistrict($modalEdit.find("[name=district-id]"), data.district_id, S_Province.val())
            });
            let row = $(this).parents('tr')[0];
            let data = tblRiskLevel.fnGetData(row);
            $modalEdit.find("[name=province-id]").trigger("change");
            $modalEdit.find("[name=risk-id]").val(data.risk_id);
            $modalEdit.find("[name=disaster-id]").val(S_Disaster.val());
            $modalEdit.find("[name=province-id]").val(S_Province.val());
            $modalEdit.find("[name=province-id]").trigger("change");
            $modalEdit.find("[name=r]").val(data.R);
            $modalEdit.find("[name=h]").val(data.H);
            $modalEdit.find("[name=e]").val(data.E);
            $modalEdit.find("[name=v]").val(data.V);
        },
        delete() {
            let row = $(this).parents('tr')[0];
            let data = tblRiskLevel.fnGetData(row);
            DBBB.confirm("Bạn có chắc chắn muốn xóa thiên tai này ra khỏi CSDL thiên tai hay không ?",
                result => {
                    if (result) {
                        $.get("/DisasterLevel/DeleteRiskLevel", { risk_id: data.risk_id }).done(function (xhr) {
                            if (xhr.success) {
                                tblRiskLevel.DataTable().ajax.reload();
                            }
                            DBBB.alert(xhr.message);
                        })
                    }
                });
        },
        create() {
            if (root.IsvalidCreateOrEdit($modalCreate)) {
                var data = {
                    disaster_id: $modalCreate.find("[name=disaster-id]").val(),
                    district_id: $modalCreate.find("[name=district-id]").val(),
                    e: $modalCreate.find("[name=e]").val(),
                    r: $modalCreate.find("[name=r]").val(),
                    v: $modalCreate.find("[name=v]").val(),
                    h: $modalCreate.find("[name=h]").val()
                }

                $.post("/DisasterLevel/CreateOrUpdateRisk", { data }).done(function (xhr) {
                    if (xhr.success) {
                        tblRiskLevel.DataTable().ajax.reload();
                        root.Cancel();
                    }
                    DBBB.alert(xhr.message);
                })
            }
        },
        handlerCreate() {
            $modalCreate = $("#modal-create-risk");
            $modalCreate.find(".create").on("click", root.create);
            $modalCreate.find("[name=province-id]").on("change", function () {
                root.loadDistrict($modalCreate.find("[name=district-id]"), null, $(this).val());
            });
            $modalCreate.find("[name=province-id]").trigger("change");
        },
        handlerEdit() {
            if (root.IsvalidCreateOrEdit($modalEdit)) {
                var data = {
                    risk_id: $modalEdit.find("[name=risk-id]").val(),
                    disaster_id: $modalEdit.find("[name=disaster-id]").val(),
                    district_id: $modalEdit.find("[name=district-id]").val(),
                    e: $modalEdit.find("[name=e]").val(),
                    r: $modalEdit.find("[name=r]").val(),
                    v: $modalEdit.find("[name=v]").val(),
                    h: $modalEdit.find("[name=h]").val()
                }
                DBBB.confirm("Bạn có chắc muốn lưu thông tin vừa chỉnh sửa về thiên tai này vào Cơ Sở Dữ Liệu thiên tai hay không ?",
                    result => {
                        if (result) {
                            $.post("/DisasterLevel/CreateOrUpdateRisk", { data }).done(function (xhr) {
                                if (xhr.success) {
                                    tblRiskLevel.DataTable().ajax.reload();
                                    root.Cancel();
                                }
                                DBBB.alert(xhr.message);
                            });
                        }
                    });
            }
        },
        IsvalidCreateOrEdit($modal) {
            if (!$modal.find("[name=district-id]").val()) {
                DBBB.alert("Vui lòng chọn một Huyện/Thành phố hoặc Thị xã!");
                return false;
            }
            if (!$modal.find("[name=r]").val()) {
                DBBB.alert("Vui lòng nhập cấp độ rủi ro!");
                return false;
            } else {
                if ($modal.find("[name=r]").val() < 0 || $modal.find("[name=r]").val() > 5) {
                    DBBB.alert("Vui lòng nhập cấp độ rủi ro nằm trong khoảng từ 0-5!");
                    return false;
                }
            }
            if (!$modal.find("[name=e]").val()) {
                DBBB.alert("Vui lòng nhập cấp độ phơi nhiễm!");
                return false;
            } else {
                if ($modal.find("[name=e]").val() < 0 || $modal.find("[name=e]").val() > 5) {
                    DBBB.alert("Vui lòng nhập cấp độ phơi nhiễm nằm trong khoảng từ 0-5!");
                    return false;
                }
            }
            if (!$modal.find("[name=h]").val()) {
                DBBB.alert("Vui lòng nhập cấp độ hiểm họa!");
                return false;
            } else {
                if ($modal.find("[name=h]").val() < 0 || $modal.find("[name=h]").val() > 5) {
                    DBBB.alert("Vui lòng nhập cấp độ hiểm họa nằm trong khoảng từ 0-5!");
                    return false;
                }
            }
            if (!$modal.find("[name=v]").val()) {
                DBBB.alert("Vui lòng nhập cấp độ tổn thương!");
                return false;
            } else {
                if ($modal.find("[name=v]").val() < 0 || $modal.find("[name=v]").val() > 5) {
                    DBBB.alert("Vui lòng nhập cấp độ tổn thương nằm trong khoảng từ 0-5!");
                    return false;
                }
            }
            return true;
        },
        Cancel() {
            $modalCreate.modal("hide");
            $modalEdit.modal("hide");
            $modalCreate.find("form")[0].reset();
            $modalEdit.find("form")[0].reset();
        },
        loadDistrict(selector, id_selected, province_id) {
            $.get("/disasterLevel/getDistrict", { province_id: province_id }).done(function (data) {
                if (data != null) {
                    selector.empty();
                    $.each(data, function (index, value) {
                        selector.append(`<option value="${value.Id}">${value.Name_vn}</option>`);
                    });
                    if (id_selected) {
                        selector.val(id_selected);
                    }
                    selector.trigger("change");
                }
            })
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
                    url: "/Excel/ImportRisk",
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
                            tblRiskLevel.DataTable().ajax.reload();
                        }
                        DBBB.alert(response.message);
                    },
                    error: DBBB.error
                });

            });
        },
    };


    return {
        init: root.init
    };
})();

$(document).ready(() => {
    RiskLevel.init();
});
