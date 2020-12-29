var EmailConfig = (() => {
    let $tblEmail, tblEmail, $modalCreate, $modalEdit, cOffice, cToEmails, cBulletin, uToEmails, uBulletin, uOffice, Idedit_bulletin;
    let root = {
        init() {
            console.log(1);
            root.initEmailConfig();
            root.handlerCreate();
            root.initImport();

            $modalEdit = $("#modal-edit-email");
            uToEmails = $modalEdit.find("[name=Emails]");
            uBulletin = $modalEdit.find("[name=bulletin_id]");
            $modalEdit.find("[name=office_id]").on("change", (e) => {
                var id = e.currentTarget ? e.currentTarget.value : 0;
                root.getBulletin($modalEdit, id, Idedit_bulletin);
            })
            $modalEdit.find(".update").on("click", root.handlerEdit);
        },
        initEmailConfig() {
            $tblEmail = $("#table-disaster");
            tblEmail = $tblEmail.dataTable({
                "processing": true,
                "serverSide": true,
                "filter": false,
                "datatype": "json",
                "ajax": {
                    type: "post",
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    url: "/DisasterBulletinConfig/ListEmail",
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
                    title: 'Tên bản tin dự báo',
                    data: null,
                    render: function (data, type, row, meta) {
                        return data.foreBulletin ? data.foreBulletin.ForeBulletin_Name : "";
                    }
                }, {
                    title: "Đơn vị dự báo",
                    data: 'foreBulletin_Office',
                    render: function (data, type, row, meta) {
                        return data != null ? data.Office_Name : "";
                    }
                }, {
                    title: 'Email nhận bản tin',
                    data: 'Emails',
                    render: function (data, type, row, meta) {
                        return data;
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
            let data = tblEmail.fnGetData(row);
            $modalEdit.find("[name=id]").val(data.Id);
            $modalEdit.find("[name=Emails]").val(data.Emails);
            $modalEdit.find("[name=office_id]").val(data.Office_Id);
            Idedit_bulletin = data.Bulletin_Id ? data.Bulletin_Id : 0;
            $modalEdit.find("[name=office_id]").trigger("change");
        },
        delete() {
            let row = $(this).parents('tr')[0];
            let data = tblEmail.fnGetData(row);
            DBBB.confirm("Bạn có chắc chắn muốn xóa cấu hình bản tin này ?",
                result => {
                    if (result) {
                        $.post("/DisasterBulletinConfig/DeleteEmail", { id: data.Id }).done(function (xhr) {
                            if (xhr.success) {
                                tblEmail.DataTable().ajax.reload();
                            }
                            DBBB.alert(xhr.message);
                        })
                    }
                });
        },
        create() {
            if (root.IsvalidCreate($modalCreate)) {
                var data = {
                    Office_Id: $modalCreate.find("[name=office_id]").val(),
                    Bulletin_Id: cBulletin.val(),
                    Emails: cToEmails.val()
                }
                console.log(data);
                $.post("/DisasterBulletinConfig/CreateEmailConfig", { data }).done(function (xhr) {
                    if (xhr.success) {
                        tblEmail.DataTable().ajax.reload();
                        root.Cancel();
                    }
                    DBBB.alert(xhr.message);
                })
            }
        },
        handlerCreate() {
            $modalCreate = $("#modal-create-email");
            $modalCreate.find(".create").on("click", root.create);
            cOffice = $modalCreate.find("[name=office_id]");
            cBulletin = $modalCreate.find("[name=bulletin_id]");
            cToEmails = $modalCreate.find("[name=Emails]");
            cOffice.on("change", (e) => {
                var id = e.currentTarget ? e.currentTarget.value : 0;
                root.getBulletin($modalCreate, id);
            });
            cOffice.trigger("change");
        },
        handlerEdit() {
            if (root.IsvalidUpdate($modalEdit)) {
                var data = {
                    Id: $modalEdit.find("[name=id]").val(),
                    Office_Id: $modalEdit.find("[name=office_id]").val(),
                    Bulletin_Id: uBulletin.val(),
                    Emails: uToEmails.val()
                }
                DBBB.confirm("Bạn có muốn xóa cấu hình cho bản tin?",
                    result => {
                        if (result) {
                            $.post("/DisasterBulletinConfig/UpdateEmail", { editedItem: data }).done(function (xhr) {
                                if (xhr.success) {
                                    tblEmail.DataTable().ajax.reload();
                                    root.Cancel();
                                }
                                DBBB.alert(xhr.message);
                            });
                        }
                    });
            }
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
        IsvalidCreate($modal) {
            if (!cBulletin.val()) {
                DBBB.alert("Vui lòng chọn một bản tin dự báo !");
                return false;
            }
            if (!cToEmails.val() || !DBBB.isValidEmails(cToEmails.val().trim())) {
                DBBB.alert("Vui lòng nhập đúng định dạng danh sách các email và mỗi email cách nhau bởi dấu ';' !");
                return false;
            }
            return true;
        },
        IsvalidUpdate($modal) {
            if (!uBulletin.val()) {
                DBBB.alert("Vui lòng chọn một bản tin dự báo !");
                return false;
            }
            if (!uBulletin.val() || !DBBB.isValidEmails(uToEmails.val().trim())) {
                DBBB.alert("Vui lòng nhập đúng định dạng danh sách các email và mỗi email cách nhau bởi dấu ';' !");
                return false;
            }
            return true;
        },
        Cancel() {
            $modalCreate.modal("hide");
            $modalEdit.modal("hide");
            $modalCreate.find("form").find("input").val("");
            $modalEdit.find("form").find("input").val("");
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
                    url: "/Excel/ImportEmailConfig",
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
    EmailConfig.init();
});