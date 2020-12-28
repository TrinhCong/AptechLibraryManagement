
var BulletinOffice = (() => {
    let $officeTbl, officeTbl, $areaTbl, areaTbl,
        $oInfoMd, $oCreateMd, $oUpdateMd,
        $aCreateMd, $aUpdateMd,
        cAreaName, cAreaDesc, cAreaAlias, uAreaId, uAreaName, uAreaDesc, uAreaAlias, cProvinceMs, cDistrictMs, uProvinceMs, uDistrictMs,
        _cProvinceIds, _cDistrictIds, _uProvinceIds, _uDistrictIds,
        iUnit, iAreas, iDesc, iToEmails, iFromEmail, iUser,
        cUnit, cOffAlias, cAreaMs, _cAreaIds = [], cDesc, cToEmails, cFromEmail, cUser, cPass, cUsersMs, _cUsersMs = [],
        uId, uUnit, uAreaMs, _uAreaIds = [], uDesc, uOffAlias, uToEmails, uFromEmail, uUser, uPass, uUsersMs, _uUsersMs = [],
        $importMd, exFile, _type,
        disids_edit, provinids_edit;


    let root = {
        init() {
            console.log('bulletin-office');
            root.initImport();
            root.initArea();
            root.initOffice();
        },
        initImport() {
            let uploadType = {
                area: {
                    url: '/Excel/ImportDisasterAreas',
                    path: '/contents/public/template/Biểu mẫu quản trị khu vực dự báo.xlsx'
                },
                office: {
                    url: '/Excel/ImportDisasterOffices',
                    path: '/contents/public/template/Biểu mẫu quản trị đơn vị dự báo.xlsx'
                }
            };
            $("[data-type]").on('click', (e) => {
                _type = $(e.target).data("type");
                $importMd.find(".download").attr("href", uploadType[_type].path);
            });
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
                    url: uploadType[_type].url,
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
        initOffice() {
            $officeTbl = $('#table-office');
            officeTbl = $officeTbl.dataTable({
                "processing": true,
                "serverSide": true,
                "filter": true,
                "datatype": "json",
                "ajax": {
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    url: "/DisasterBulletinOffice/ListOffice",
                    data: function (d) {
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

                columns: [{
                    title: 'TT',
                    data: 'TT'
                }, {
                    title: 'Tên đơn vị dự báo',
                    data: 'Office_Name'
                }, {
                    title: 'Danh sách các khu vực chịu trách nhiệm dự báo',
                    data: 'Responsible_Areas'
                }, {
                    title: 'Thông tin mô tả',
                    data: 'Office_Desc'
                }, {
                    title: 'Thao tác',
                    render: function (data, type, row, meta) {
                        return Mustache.render($('#actions-office').html());
                    },
                    width: '180px',
                    className: 'text-center'
                }],
                columnDefs: [
                    {
                        orderable: false,
                        targets: [3]
                    }
                ],

            });


            root.handleOfficeInfo();
            root.handleOfficeCreate();
            root.handleOfficeUpdate();


            $officeTbl.find('tbody').on('click', '.edit-item-office', root.editOffice);
            $officeTbl.find('tbody').on('click', '.detail-item-office', root.showOffice);
            $officeTbl.find('tbody').on('click', '.delete-item-office', root.deleteOffice);
        },
        handleOfficeInfo() {
            $oInfoMd = $("#modal-info-office");
            iUnit = $oInfoMd.find("[name=department]");
            iAreas = $oInfoMd.find("[name=area]");
            iDesc = $oInfoMd.find("[name=description]");
            iToEmails = $oInfoMd.find("[name=to_emails]");
            iFromEmail = $oInfoMd.find("[name=from_email]");
            iUser = $oInfoMd.find("[name=user]");
        },
        handleOfficeCreate() {
            $oCreateMd = $("#modal-create-office");
            cUnit = $oCreateMd.find("[name=department]");
            cAreaMs = $oCreateMd.find("[name=area]");
            cDesc = $oCreateMd.find("[name=description]");
            cToEmails = $oCreateMd.find("[name=to_emails]");
            cFromEmail = $oCreateMd.find("[name=from_email]");
            cUser = $oCreateMd.find("[name=user]");
            cPass = $oCreateMd.find("[name=pass]");
            cUsersMs = $oCreateMd.find("[name=users]");
            cOffAlias = $oCreateMd.find("[name=alias]");

            $.get('/DisasterBulletinOffice/GetAreas').done(xhr => {
                cAreaMs.empty();
                $.each(xhr, (idx, area) => {
                    cAreaMs.append($("<option />").val(area.Id).text(area.Area_Name));
                });
                cAreaMs.multiselect("destroy").multiselect({
                    includeSelectAllOption: true,
                    selectAllValue: 'multiselect-all',
                    selectAllJustVisible: true,
                    buttonWidth: '100%',
                    maxHeight: '200',
                    onChange() {
                        _cAreaIds = [];
                        $.each(cAreaMs.find(' option:selected'), (index, brand) => {
                            _cAreaIds.push($(brand).val());
                        });
                    },
                    onSelectAll() {
                        _cAreaIds = xhr.map(x => x.Id);
                    },
                    onDeselectAll() {
                        _cAreaIds = [];
                    }
                });
            });

            $oCreateMd.find(".create").on('click', root.onCreateOffice);
            $oCreateMd.find("[data-dismiss]").on('click', () => {
                cAreaMs.val([]);
                cAreaMs.multiselect('deselectAll');
                cAreaMs.multiselect('refresh');
                $oCreateMd.find("form")[0].reset();
            });
        },
        onCreateOffice() {
            if (!cUnit.val()) {
                DBBB.alert("Vui lòng nhập tên đơn vị dự báo!");
                return;
            }
            if (!_cAreaIds.length > 0) {
                DBBB.alert("Vui lòng chọn ít nhất 1 khu vực chịu trách nhiệm!");
                return;
            }
            //if (!cToEmails.val() || !DBBB.isValidEmails(cToEmails.val())) {
            //    DBBB.alert("Vui lòng nhập đúng định dạng danh sách các email và mỗi email cách nhau bởi dấu ';' !");
            //    return;
            //}
            if (!cOffAlias.val() && !cOffAlias.val().trim()) {
                DBBB.alert("Vui lòng nhập viết tắt khu vực dự báo!");
                return;
            }
            if (cOffAlias.val().trim().length !== 4) {
                DBBB.alert("Viết tắt khu vực dự báo có 4 kí tự!");
                return;
            }
            if (!cFromEmail.val() || !DBBB.isEmail(cFromEmail.val())) {
                DBBB.alert("Vui lòng nhập đúng định dạng địa chỉ email gửi đi!");
                return;
            }
            if (!cUser.val()) {
                DBBB.alert("Vui lòng nhập tên tài khoản đăng nhập!");
                return;
            }
            if (!cPass.val()) {
                DBBB.alert("Vui lòng nhập mật khẩu phải có chữ và số, bao gồm ít nhất 6 kí tự!");
                return;
            }
            let info = [];
            $.each(_cAreaIds, (idx, areaId) => {
                info.push({
                    Area_Id: areaId
                });
            });
            let user = [];
            $.each(_cUsersMs, (index, userId) => {
                user.push({
                    User_Id: userId
                })
            });
            let param = {
                Office_Name: cUnit.val(),
                Office_Desc: cDesc.val(),
                areaInfos: info,
                userInfos: user,
                To_Emails: cToEmails.val(),
                From_Email: cFromEmail.val(),
                Email_Account: cUser.val(),
                Email_Password: cPass.val().trim(),
                Office_Alias: cOffAlias.val().trim()
            };
            $.post('/DisasterBulletinOffice/Create', param).done(xhr => {
                if (xhr.success) {
                    $officeTbl.DataTable().ajax.reload();
                    $oCreateMd.modal('hide');
                    $oCreateMd.find("form")[0].reset();
                }
                DBBB.alert(xhr.message);
            });
        },
        handleOfficeUpdate() {
            $oUpdateMd = $("#modal-edit-office");
            uId = $oUpdateMd.find("[name=office_id]");
            uUnit = $oUpdateMd.find("[name=department]");
            uAreaMs = $oUpdateMd.find("[name=area]");
            uDesc = $oUpdateMd.find("[name=description]");
            uToEmails = $oUpdateMd.find("[name=to_emails]");
            uFromEmail = $oUpdateMd.find("[name=from_email]");
            uOffAlias = $oUpdateMd.find("[name=alias]");
            uUser = $oUpdateMd.find("[name=user]");
            uPass = $oUpdateMd.find("[name=pass]");
            uUsersMs = $oUpdateMd.find("[name=users]");

            $oUpdateMd.find(".update").on('click', root.onUpdateOffice);
        },
        editOffice() {
            let selectedRow = $(this).parents('tr')[0];
            let data = officeTbl.fnGetData(selectedRow);
            uId.val(data.Id);
            uUnit.val(data.Office_Name);
            _uAreaIds = data.areaInfos.map(x => x.Area_Id);
            uAreaMs.multiselect("select", _uAreaIds);
            uDesc.val(data.Office_Desc);
            uToEmails.val(data.To_Emails);
            uFromEmail.val(data.From_Email);
            uUser.val(data.Email_Account);
            uPass.val(data.Email_Password);
            uOffAlias.val(data.Office_Alias);

            var selected_ids = data.areaInfos.map((value) => {
                return value.Area_Id;
            });
            $.get('/DisasterBulletinOffice/GetAreas').done(xhr => {
                uAreaMs.empty();
                $.each(xhr, (idx, area) => {
                    uAreaMs.append($("<option />").val(area.Id).text(area.Area_Name));
                });
                uAreaMs.find("option").each((idx, option) => {
                    if (selected_ids.indexOf(parseInt($(option).val())) > -1) {
                        $(option).attr("selected", true);
                    }
                });
                uAreaMs.multiselect("destroy").multiselect({
                    includeSelectAllOption: true,
                    selectAllValue: 'multiselect-all',
                    selectAllJustVisible: true,
                    buttonWidth: '100%',
                    maxHeight: '200',
                    onChange() {
                        _uAreaIds = [];
                        let brands = cAreaMs.find('option:selected');
                        $(brands).each((index, brand) => {
                            _uAreaIds.push($(this).val());
                        });
                    },
                    onSelectAll() {
                        _uAreaIds = xhr.map(x => x.Id);
                    },
                    onDeselectAll() {
                        _uAreaIds = [];
                    }
                });

            });
        },
        showOffice(e) {
            let selectedRow = $(e.target).parents('tr')[0];
            let data = officeTbl.fnGetData(selectedRow);
            iUnit.val(data.Office_Name);
            iAreas.val(data.Responsible_Areas);
            iDesc.val(data.Office_Desc);
            iToEmails.val(data.To_Emails);
            iFromEmail.val(data.From_Email);
            iUser.val(data.Email_Account);
        },
        onUpdateOffice() {
            if (!uUnit.val().trim()) {
                DBBB.alert("Vui lòng nhập tên đơn vị dự báo!");
                return;
            }
            if (!_uAreaIds.length > 0) {
                DBBB.alert("Vui lòng chọn ít nhất 1 khu vực chịu trách nhiệm!");
                return;
            }
            //if (!uToEmails.val() || !DBBB.isValidEmails(uToEmails.val())) {
            //    DBBB.alert("Vui lòng nhập đúng định dạng danh sách các email và mỗi email cách nhau bởi dấu ';' !");
            //    return;
            //}
            if (!uOffAlias.val() && !uOffAlias.val().trim()) {
                DBBB.alert("Vui lòng nhập viết tắt khu vực dự báo!");
                return;
            }
            if (uOffAlias.val().trim().length !== 4) {
                DBBB.alert("Viết tắt khu vực dự báo có 4 kí tự!");
                return;
            }
            if (!uFromEmail.val() || !DBBB.isEmail(uFromEmail.val())) {
                DBBB.alert("Vui lòng nhập đúng định dạng địa chỉ email gửi đi!");
                return;
            }
            if (!uUser.val().trim()) {
                DBBB.alert("Vui lòng nhập tên tài khoản đăng nhập!");
                return;
            }
            uPass.val().trim();
            if (!uPass.val()) {
                DBBB.alert("Vui lòng nhập mật khẩu phải có chữ và số, bao gồm ít nhất 6 kí tự!");
                return;
            }
            let info = [];
            $.each(_uAreaIds, (idx, areaId) => {
                info.push({
                    Area_Id: areaId
                });
            });
            let user = [];
            $.each(_uUsersMs, (index, userId) => {
                user.push({
                    User_Id: userId
                })
            });
            let param = {
                Id: uId.val(),
                Office_Name: uUnit.val().trim(),
                areaInfos: info,
                userInfos: user,
                Office_Desc: uDesc.val(),
                To_Emails: uToEmails.val(),
                From_Email: uFromEmail.val(),
                Email_Account: uUser.val().trim(),
                Email_Password: uPass.val(),
                Office_Alias: cOffAlias.val().trim()
            };
            $.post('/DisasterBulletinOffice/Update', param).done(xhr => {
                if (xhr.success) {
                    $officeTbl.DataTable().ajax.reload();
                    $oUpdateMd.modal('hide');
                }
                DBBB.alert(xhr.message);
            });
        },
        deleteOffice() {
            var selectedRow = $(this).parents('tr')[0];
            var data = officeTbl.fnGetData(selectedRow);
            DBBB.confirm("Tất cả các bản tin đã phát hành của đơn vị này cũng sẽ được xóa theo! Bạn có chắc muốn xóa đơn vị này?",
                result => {
                    if (result) {
                        $.get("/DisasterBulletinOffice/Delete", { Id: data.Id }).done(xhr => {
                            if (xhr.success) {
                                $officeTbl.DataTable().ajax.reload();
                            }
                            DBBB.alert(xhr.message);
                        });
                    }
                });
        },
        initArea() {
            $areaTbl = $('#table');
            areaTbl = $areaTbl.dataTable({
                "processing": true,
                "serverSide": true,
                "filter": true,
                "datatype": "json",
                "ajax": {
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    url: "/DisasterBulletinOffice/ListArea",
                    data: function (d) {
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

                columns: [{
                    title: 'STT',
                    data: 'Stt'
                }, {
                    title: 'Tên khu vực dự báo',
                    data: 'Area_Name'
                }, {
                    title: 'Mô tả khu vực',
                    data: 'Description'
                }, {
                    title: 'Thao tác',
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
                    }
                ]
            });

            $areaTbl.find('tbody').on('click', '.edit-item', root.editArea);
            $areaTbl.find('tbody').on('click', '.delete-item', root.deleteArea);
            root.handleCreateArea();
            root.handleUpdateArea();
        },
        handleCreateArea() {
            var province = {
                url: '/DisasterBulletinOffice/GetProvinces',
                region_id: [0],
                ids_selected: [],
                onChange: root.onChangeProvinceCreate,
                onSelectAll: root.onChangeProvinceCreate,
                onDeselectAll: root.onChangeProvinceCreate,
                Initialized: root.onInitProvinceCreate
            };
            $aCreateMd = $("#modal-create");
            cAreaName = $aCreateMd.find("[name=area_name]");
            cAreaDesc = $aCreateMd.find("[name=description]");
            cProvinceMs = $aCreateMd.find("[name=province]");
            cDistrictMs = $aCreateMd.find("[name=district]");
            cAreaAlias = $aCreateMd.find("[name=alias]");
            $aCreateMd.find(".create").on('click', root.onCreateArea);
            $aCreateMd.find("[data-dismiss]").on('click', root.cReset);

            root.getRegions(province, cProvinceMs, _cProvinceIds, true);
        },
        cReset() {
            cProvinceMs.val([]);
            cProvinceMs.multiselect('deselectAll');
            cProvinceMs.multiselect('refresh');

            cDistrictMs.val([]);
            cDistrictMs.multiselect('deselectAll');
            cDistrictMs.multiselect('refresh');

            $aCreateMd.find("form")[0].reset();
        },
        onCreateArea() {
            if (!cAreaName.val().trim()) {
                DBBB.alert("Vui lòng nhập tên khu vực dự báo!");
                return;
            }
            if (_cDistrictIds.length == 0) {
                DBBB.alert("Vui lòng chọn huyện thị xã thuộc khu vực dự báo!");
                return;
            }
            if (!cAreaAlias.val() && !cAreaAlias.val().trim()) {
                DBBB.alert("Vui lòng nhập viết tắt khu vực dự báo!");
                return;
            }
            if (cAreaAlias.val().trim().length !== 4) {
                DBBB.alert("Viết tắt khu vực dự báo có 4 kí tự!");
                return;
            }
            let param = {
                Area_Name: cAreaName.val().trim(),
                Districts: _cDistrictIds,
                Area_Alias: cAreaAlias.val().toUpperCase(),
                Description: cAreaDesc.val() ? cAreaDesc.val().trim() : null,
            }
            $.post('/DisasterBulletinOffice/CreateArea', param).done(xhr => {
                if (xhr.success) {
                    $areaTbl.DataTable().ajax.reload();
                    root.cReset();
                    $aCreateMd.modal("hide");
                }
                DBBB.alert(xhr.message);
            });
        },
        handleUpdateArea() {
            $aUpdateMd = $("#modal-edit");
            uAreaId = $aUpdateMd.find("[name=id]");
            uAreaName = $aUpdateMd.find("[name=area_name]");
            uAreaDesc = $aUpdateMd.find("[name=description]");
            uProvinceMs = $aUpdateMd.find("[name=province]");
            uDistrictMs = $aUpdateMd.find("[name=district]");
            uAreaAlias = $aUpdateMd.find("[name=alias]");

            $aUpdateMd.find(".update").on('click', root.onUpdateArea);
        },
        onUpdateArea() {
            if (!uAreaName.val().trim()) {
                DBBB.alert("Vui lòng nhập tên khu vực dự báo!");
                return;
            }
            if (_uDistrictIds.length == 0) {
                DBBB.alert("Vui lòng chọn huyện thị xã thuộc khu vực dự báo!");
                return;
            }
            if (!uAreaAlias.val().trim()) {
                DBBB.alert("Vui lòng nhập viết tắt khu vực dự báo!");
                return;
            }
            if (uAreaAlias.val().length !== 4) {
                DBBB.alert("Viết tắt khu vực dự báo có 4 kí tự!");
                return;
            }
            let param = {
                Id: uAreaId.val(),
                Area_Name: uAreaName.val().trim(),
                Districts: _uDistrictIds,
                Area_Alias: uAreaAlias.val().toUpperCase(),
                Description: uAreaDesc.val() ? uAreaDesc.val().trim() : null
            }
            $.post('/DisasterBulletinOffice/UpdateArea', param).done(xhr => {
                if (xhr.success) {
                    $areaTbl.DataTable().ajax.reload();
                    $aUpdateMd.modal("hide");
                }
                DBBB.alert(xhr.message);
            });
        },
        editArea() {
            let selectedRow = $(this).parents('tr')[0];
            var data = areaTbl.fnGetData(selectedRow);
            provinids_edit = data.Area_District_Infos.map((value) => {
                return value.Districts.Parent_Id;
            });
            disids_edit = data.Area_District_Infos.map((value) => {
                return value.District_Id;
            });
            uAreaId.val(data.Id);
            uAreaName.val(data.Area_Name);
            uAreaDesc.val(data.Description);
            uAreaAlias.val(data.Area_Alias);
            var province = {
                url: '/DisasterBulletinOffice/GetProvinces',
                region_id: [0],
                ids_selected: provinids_edit,
                onChange: root.onChangeProvinceUpdate,
                onSelectAll: root.onChangeProvinceUpdate,
                onDeselectAll: root.onChangeProvinceUpdate,
                Initialized: root.onInitProvinceUpdate
            };
            root.getRegions(province, uProvinceMs, _uProvinceIds, false);
        },
        deleteArea() {
            var selectedRow = $(this).parents('tr')[0];
            var data = areaTbl.fnGetData(selectedRow);
            DBBB.confirm("Tất cả dữ liệu liên quan tới khu vực dự báo này trong hệ thống sẽ bị xóa theo! Bạn có chắc muốn xóa khu vực này?",
                result => {
                    if (result) {
                        $.get("/DisasterBulletinOffice/DeleteArea", { Id: data.Id }).done(xhr => {
                            if (xhr.success)
                                $areaTbl.DataTable().ajax.reload();
                            DBBB.alert(xhr.message);
                        });
                    }
                });
        },
        getRegions(data, selector, ids_give, optionSelectAll) {
            App.startPageLoading();
            $.get(data.url, { region_id: data.region_id.length > 0 ? data.region_id.join(",") : "-1" }).done((xhr) => {
                selector.empty();
                if (optionSelectAll) {
                    $.each(xhr, (idx, area) => {
                        selector.append($("<option />").val(area.Id).text(area.Name_vn));
                    });
                } else {
                    $.each(xhr, (idx, area) => {
                        selector.append($("<option />").val(area.Id).text(area.Name_vn));
                    });
                }
                if (data.ids_selected != undefined && data.ids_selected.length > 0) {
                    selector.find("option").each((idx, option) => {
                        if (data.ids_selected.indexOf(parseInt($(option).val())) > -1) {
                            $(option).attr("selected", true);
                        }
                    });
                }
                selector.multiselect("destroy").multiselect({
                    includeSelectAllOption: true,
                    selectAllValue: 'multiselect-all',
                    selectAllJustVisible: true,
                    buttonWidth: '100%',
                    maxHeight: '180',
                    onChange: data.onChange,
                    onInitialized: data.Initialized,
                    onSelectAll: data.onSelectAll,
                    onDeselectAll: data.onDeselectAll
                });
                App.stopPageLoading();
            });
        },
        onChangeProvinceCreate() {
            _cProvinceIds = [];
            $.each(cProvinceMs.find('option:selected'), (index, brand) => {
                _cProvinceIds.push($(brand).val());
            });
            root.getRegions({
                url: "/DisasterBulletinOffice/GetDistricts",
                region_id: _cProvinceIds,
                ids_selected: [],
                onChange: root.onChangeDistrictCreate,
                onSelectAll: root.onChangeDistrictCreate,
                onDeselectAll: root.onChangeDistrictCreate,
                Initialized: root.onInitDistrictCreate,
            }, cDistrictMs, _cDistrictIds, true);
        },
        onInitProvinceCreate(select, container) {
            _cProvinceIds = [];
            $.each(select.find('option:selected'), (index, brand) => {
                _cProvinceIds.push($(brand).val());
            });
            root.getRegions({
                url: "/DisasterBulletinOffice/GetDistricts",
                region_id: _cProvinceIds,
                ids_selected: [],
                onChange: root.onChangeDistrictCreate,
                onSelectAll: root.onChangeDistrictCreate,
                onDeselectAll: root.onChangeDistrictCreate,
                Initialized: root.onInitDistrictCreate,
            }, cDistrictMs, _cDistrictIds, true);
        },
        onInitDistrictCreate(select, container) {
            _cDistrictIds = [];
            $.each(select.find('option:selected'), (index, brand) => {
                _cDistrictIds.push($(brand).val());
            });
        },
        onChangeDistrictCreate() {
            _cDistrictIds = [];
            $.each(cDistrictMs.find('option:selected'), (index, brand) => {
                _cDistrictIds.push($(brand).val());
            });
        },
        onChangeProvinceUpdate() {
            _uProvinceIds = [];
            $.each(uProvinceMs.find('option:selected'), (index, brand) => {
                _uProvinceIds.push($(brand).val());
            });
            root.getRegions({
                url: "/DisasterBulletinOffice/GetDistricts",
                region_id: _uProvinceIds,
                ids_selected: [],
                onChange: root.onChangeDistrictupdate,
                onSelectAll: root.onChangeDistrictupdate,
                onDeselectAll: root.onChangeDistrictupdate,
                Initialized: root.onInitDistrictUpdate,
            }, uDistrictMs, _uDistrictIds, true);
        },
        onInitProvinceUpdate(select, container) {
            _uProvinceIds = [];
            $.each(select.find('option:selected'), (index, brand) => {
                _uProvinceIds.push($(brand).val());
            });
            root.getRegions({
                url: "/DisasterBulletinOffice/GetDistricts",
                region_id: _uProvinceIds,
                ids_selected: disids_edit,
                onChange: root.onChangeDistrictupdate,
                onSelectAll: root.onChangeDistrictupdate,
                onDeselectAll: root.onChangeDistrictupdate,
                Initialized: root.onInitDistrictUpdate,
            }, uDistrictMs, _uDistrictIds, false);
        },
        onInitDistrictUpdate(select, container) {
            _uDistrictIds = [];
            $.each(select.find('option:selected'), (index, brand) => {
                _uDistrictIds.push($(brand).val());
            });
        },
        onChangeDistrictupdate() {
            _uDistrictIds = [];
            $.each(uDistrictMs.find('option:selected'), (index, brand) => {
                _uDistrictIds.push($(brand).val());
            });
        }
    };
    return {
        init: root.init
    };
})();

$(document).ready(() => {
    BulletinOffice.init();
});
