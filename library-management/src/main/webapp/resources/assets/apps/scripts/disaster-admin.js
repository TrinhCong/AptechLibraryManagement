
var DisasterAdmin = (() => {
    let $tblDisaster, tblDisaster, $modalCreate, $modalEdit;
    let MucDoRuiRo = [
        "Nhỏ",
        "Trung Bình",
        "Lớn",
        "Rất lớn",
        "Thảm họa"
    ];
    let root = {
        init() {
            console.log(1);
            root.initDisasterAdmin();
            root.handlerCreate();
            root.initImport();
            $modalEdit = $("#modal-edit-disaster");
            $modalEdit.find(".update").on("click", root.handlerEdit);
        },
        initDisasterAdmin() {
            $tblDisaster = $("#table-disaster");
            tblDisaster = $tblDisaster.dataTable({
                "processing": true,
                "serverSide": true,
                "filter": false,
                "datatype": "json",
                "ajax": {
                    type: "post",
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    url: "/DisasterLevel/ListDisaster",
                    data: function (d) {
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
                    title: 'Tên thiên tai',
                    data: 'disaster_name'
                }, {
                    title: 'Các cấp độ',
                    data: 'risk_cate',
                    width: "100px"
                }, {
                    title: "Mức độ",
                    data: "risk_mag"
                }, {
                    title: "Bảng màu",
                    data: "risk_color",
                    render: function (data, type, row, meta) {
                        var render = "";
                        var rbg_arr = data.split(";");
                        for (var i = 0; i < rbg_arr.length; i++) {
                            var rbg = rbg_arr[i].trim().split(" ");
                            render += `<div style="float:left;margin-left:3px;width:50px;height:50px;background-color:rgb(${rbg[0]},${rbg[1]},${rbg[2]})"></div>`;
                        }
                        return render;
                    }
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
            $('#table-disaster tbody').on('click', '.edit-item', root.edit);
            $('#table-disaster tbody').on('click', '.delete-item', root.delete);
        },
        edit() {
            let row = $(this).parents('tr')[0];
            let data = tblDisaster.fnGetData(row);
            $modalEdit.find("[name=disaster_id]").val(data.disaster_id);
            $modalEdit.find("[name=disaster_name]").val(data.disaster_name);
            $modalEdit.find("[name=risk_cate]").val(data.risk_cate);
            $modalEdit.find("[name=risk_mag]").val(data.risk_mag);
            $modalEdit.find("[name=risk_color]").val(data.risk_color);
        },
        delete() {
            let row = $(this).parents('tr')[0];
            let data = tblDisaster.fnGetData(row);
            DBBB.confirm("Bạn có chắc chắn muốn xóa thiên tai này ra khỏi CSDL thiên tai hay không ?",
                result => {
                    if (result) {
                        $.get("/DisasterLevel/DeleteDisaster", { disaster_id: data.disaster_id }).done(function (xhr) {
                            if (xhr.success) {
                                tblDisaster.DataTable().ajax.reload();
                            }
                            DBBB.alert(xhr.message);
                        })
                    }
                });
        },
        create() {
            if (root.IsvalidCreateOrEdit($modalCreate)) {
                var data = {
                    disaster_name: $modalCreate.find("[name=disaster_name]").val(),
                    risk_cate: $modalCreate.find("[name=risk_cate]").val(),
                    risk_mag: root.ChangeMucDoThienTai($modalCreate.find("[name=risk_mag]").val()),
                    risk_color: $modalCreate.find("[name=risk_color]").val()
                }

                $.post("/DisasterLevel/CreateDisaster", { data }).done(function (xhr) {
                    console.log(xhr);
                    if (xhr.success) {
                        tblDisaster.DataTable().ajax.reload();
                        root.Cancel();
                    }
                    DBBB.alert(xhr.message);
                })
            }
        },
        handlerCreate() {
            $modalCreate = $("#modal-create-disaster");
            $modalCreate.find(".create").on("click", root.create);
        },
        handlerEdit() {
            if (root.IsvalidCreateOrEdit($modalEdit)) {
                var data = {
                    disaster_id: $modalEdit.find("[name=disaster_id]").val(),
                    disaster_name: root.CapitalizeFirstLetter($modalEdit.find("[name=disaster_name]").val()),
                    risk_cate: $modalEdit.find("[name=risk_cate]").val(),
                    risk_mag: root.ChangeMucDoThienTai($modalEdit.find("[name=risk_mag]").val()),
                    risk_color: $modalEdit.find("[name=risk_color]").val(),
                }
                DBBB.confirm("Bạn có chắc muốn lưu thông tin vừa chỉnh sửa về thiên tai này vào CSDL thiên tai hay không ?",
                    result => {
                        if (result) {
                            $.post("/DisasterLevel/UpdateDisaster", { data }).done(function (xhr) {
                                if (xhr.success) {
                                    tblDisaster.DataTable().ajax.reload();
                                    root.Cancel();
                                }
                                DBBB.alert(xhr.message);
                            });
                        }
                    });
            }
        },
        IsvalidCreateOrEdit($modal) {
            let DCate_arr, MucDo_arr, Color_arr;
            if (!$modal.find("[name=disaster_name]").val()) {
                DBBB.alert("Vui lòng nhập tên thiên tai!");
                return false;
            }
            if ($modal.find("[name=risk_cate]").val() || $modal.find("[name=risk_mag]").val() || $modal.find("[name=risk_color]").val()) {
                if (!$modal.find("[name=risk_cate]").val()) {
                    DBBB.alert("Vui lòng điền cấp độ rủi ro tương ứng!");
                    return false;
                }
                if (!$modal.find("[name=risk_mag]").val()) {
                    DBBB.alert("Vui lòng điền mức độ rủi ro tương ứng!");
                    return false;
                }
                if (!$modal.find("[name=risk_color]").val()) {
                    DBBB.alert("Vui lòng điền màu cho mức độ rủi ro tương ứng!");
                    return false;
                }
                DCate_arr = $modal.find("[name=risk_cate]").val().split(";");
                MucDo_arr = $modal.find("[name=risk_mag]").val().split(";");
                Color_arr = $modal.find("[name=risk_color]").val().split(";");
                if (DCate_arr.length > 5 || DCate_arr.length < 3) {
                    DBBB.alert("Số lượng cấp độ rủi ro thiên tai nhỏ nhất 3 cấp độ và không vượt quá 5 cấp độ !");
                    return false;
                }
                if (DCate_arr.length != MucDo_arr.length) {
                    DBBB.alert("Số lượng cấp độ rủi ro và mức độ rủi ro không bằng nhau!");
                    return false;
                }
                if (DCate_arr.length != Color_arr.length) {
                    DBBB.alert("Số lượng cấp độ rủi ro và màu của rui ro không bằng nhau!");
                    return false;
                }
                for (var i = 0; i < DCate_arr.length; i++) {
                    if (DCate_arr[i] <= 0 || DCate_arr[i] >= 6) {
                        DBBB.alert("Cấp độ rủi ro thiên tai không đúng định dạng!");
                        return false;
                    }
                }
                for (var i = 0; i < MucDo_arr.length; i++) {
                    MucDo_arr[i] = root.CapitalizeFirstLetter(MucDo_arr[i]);
                    if (MucDo_arr.indexOf(MucDo_arr[i]) < 0) {
                        DBBB.alert("Giá trị nhập vào mức độ rủi ro thiên tai phải là các giá trị sau : Nhỏ;Trung bình;Lớn;Rất lớn;Thảm họa !");
                        return false;
                    }
                }
                for (var i = 0; i < Color_arr.length; i++) {
                    var color_ele = Color_arr[i].trim().split(" ");
                    if (color_ele.length != 3) {
                        DBBB.alert("Giá trị màu RGB phải có 3 số và cách nhau bởi dấu cách. Ví dụ: 255 254 256 !");
                        return false
                    }
                }
            }
            return true;
        },
        Cancel() {
            console.log("hide");
            $modalCreate.modal("hide");
            $modalEdit.modal("hide");
            $modalCreate.find("form").find("input").val("");
            $modalEdit.find("form").find("input").val("");
        },
        CapitalizeFirstLetter(string) {
            if (string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            } else {
                return "";
            }
        },
        ChangeMucDoThienTai(string) {
            var string_return = "";
            if (string) {
                var string_ele = string.split(";");
                for (var i = 0; i < string_ele.length; i++) {
                    string_return += root.CapitalizeFirstLetter(string_ele[i].trim()) + ";";
                }
                string_return = string_return.substring(0, string_return.length - 1)
            }
            return string_return;
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
                    url: "/Excel/ImportDisaster",
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
                            tblDisaster.DataTable().ajax.reload();
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
    DisasterAdmin.init();
});
