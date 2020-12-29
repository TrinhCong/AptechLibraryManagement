var DisasterBulletin = (() => {
    let $uGroupMd, $cGroupMd, $groupTbl, groupTbl, bullTbl, $bullTbl, $bullCreate, $bullUpdate;
    let fGroupDd, $officeDd, officeDd, bullName, bullDesc, _offices, _officeIds,sampleFile,path,fileName;
    let uBullId, uFGroupDd, $uOfficeDd, uOfficeDd, uBullName, uBullDesc, _uOfficeIds, uSampleFile, uPath, uFileName;
    let uGroupId, uGroupName, uGroupDesc, cGroupName, cGroupDesc;
    let exFile,$importMd,_type;
    let root = {
        init() {
            root.initGroup();
            root.initBulletin();
            root.initLoading();
            root.initImport();
        },
        initImport() {
            let uploadType = {
                forebulletin: {
                    url: '/Excel/ImportForecastBulletin',
                    path: '/contents/public/template/Biểu mẫu nhập liệu bản tin dự báo.xlsx'
                },
                //office: {
                //    url: '/Excel/ImportDisasterOffices',
                //    path: '/contents/public/template/Biểu mẫu quản trị đơn vị dự báo.xlsx'
                //}
            };
            $("[data-type]").on('click', (e) => {
                _type = $(e.target).data("type");
                $importMd.find(".download").attr("href", uploadType[_type].path);
            });
            $importMd = $("#modal-import-bulletin");
            console.log($importMd);
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
        initGroup() {
            $groupTbl = $('#table-group');
            groupTbl = $groupTbl.dataTable({
                "processing": true,
                "serverSide": true,
                "filter": true,
                "datatype": "json",
                "ajax": {
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    url: "/DisasterBulletin/ListGroup",
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
                    data: 'TT'
                }, {
                    title: 'Tên nhóm bản tin',
                    data: 'ForeGroup_Name'
                }, {
                    title: 'Thông tin mô tả',
                    data: 'ForeGroup_Desc'
                }, {
                    title: 'Thao tác',
                    render: function (data, type, row, meta) {
                        return Mustache.render($('#actions-group').html());
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


            $cGroupMd = $("#modal-create-group");
            cGroupName = $cGroupMd.find("[name=foregroup_name]");
            cGroupDesc = $cGroupMd.find("[name=foregroup_desc]");
            $cGroupMd.find(".create").on('click', root.onCreateGroup);

            $uGroupMd = $("#modal-edit-group");
            uGroupId= $uGroupMd.find("[name=foregroup_id]");
            uGroupName = $uGroupMd.find("[name=foregroup_name]");
            uGroupDesc = $uGroupMd.find("[name=foregroup_desc]");
            $uGroupMd.find(".update").on('click',root.onUpdateGroup);

            root.ResetModal($cGroupMd);

            $('#table-group tbody').on('click', '.edit-item-group', (e)=>  {
                let selectedRow = $(e.target).parents('tr')[0];
                let data = groupTbl.fnGetData(selectedRow);
                uGroupId.val(data.ForeGroup_Id);
                uGroupName.val(data.ForeGroup_Name);
                uGroupDesc.val(data.ForeGroup_Desc);
            });

            $('#table-group tbody').on('click', '.delete-item-group', (e)=>  {
                var selectedRow = $(e.target).parents('tr')[0];
                var data = groupTbl.fnGetData(selectedRow);
                DBBB.confirm("Tất cả bản tin thuộc nhóm này sẽ bị xóa theo! Bạn có chắc muốn xóa nhóm này?",
                    (result) => {
                        if (result) {
                            $.ajax({
                                url: "/DisasterBulletin/DeleteGroup",
                                data: { groupId: data.ForeGroup_Id },
                                type: 'post'
                            }).done( (xhr)=> {
                                if (xhr.success) {
                                    $groupTbl.DataTable().ajax.reload();
                                }
                                DBBB.alert(xhr.message);
                            });
                        }
                    }
                );
            });
        },
        onCreateGroup() {
            if (!cGroupName.val() && !cGroupName.val().trim()) {
                DBBB.alert("Vui lòng nhập tên nhóm bản tin!");
                return;
            }
            $.post("/DisasterBulletin/CreateGroup", {
                ForeGroup_Name: cGroupName.val().trim(),
                ForeGroup_Desc: cGroupDesc.val()
            }).done(xhr => {
                if (xhr.success) {
                    $groupTbl.DataTable().ajax.reload();
                    $cGroupMd.modal("hide");
                }
                DBBB.alert(xhr.message);
            });
        },
        onUpdateGroup() {
            if (!uGroupName.val() && !uGroupName.val().trim()) {
                DBBB.alert("Vui lòng nhập tên nhóm bản tin!");
                return;
            }
            $.post("/DisasterBulletin/UpdateGroup", {
                ForeGroup_Id: uGroupId.val(),
                ForeGroup_Name: uGroupName.val().trim(),
                ForeGroup_Desc: uGroupDesc.val()
            }).done(xhr => {
                if (xhr.success) {
                    $groupTbl.DataTable().ajax.reload();
                    $uGroupMd.modal("hide");
                }
                DBBB.alert(xhr.message);
            });
        },
        initBulletin() {
            $bullTbl = $('#table');

            bullTbl = $bullTbl.dataTable({
                "processing": true,
                "serverSide": true,
                "filter": true,
                "datatype": "json",
                "ajax": {
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    url: "/DisasterBulletin/List",
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

                "lengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "Tất cả"] // change per page values here
                ],
                // set the initial value
                "pageLength": 5,
                "pagingType": "bootstrap_full_number",
                //dom: `<'row'
                //            <'col-sm-12 col-md-6'l>
                //            <'col-sm-12 col-md-6'f>
                //        >
                //        <'row'
                //            <'col-sm-12'tr>
                //        >
                //        <'row'
                //            <'col-sm-12 col-md-5'i>
                //            <'col-sm-12 col-md-7'p>
                //        >`,

                columns: [
                    {
                        title: 'TT',
                        data: 'TT'
                    }, {
                        title: 'Tên bản tin',
                        data: 'ForeBulletin_Name'
                    }, {
                        title: 'Thông tin mô tả',
                        data: 'ForeBulletin_Desc'
                    }, {
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
                ]
            });
            $("#filter-group").on('change', ()=>  {
                bullTbl.fnFilter();
            });

            $bullCreate = $("#modal-create");
            fGroupDd = $bullCreate.find("[name=foregroup_id]");
            $officeDd = $bullCreate.find("[name=foreoffice_id]");
            bullName = $bullCreate.find("[name=forebulletin_name]");
            bullDesc = $bullCreate.find("[name=forebulletin_desc]");
            sampleFile = $bullCreate.find("[name=sample_file_path]");
            fileName = $bullCreate.find("[name=file]");
            path = $bullCreate.find("[name=path]");
            $bullCreate.find(".create").on('click', root.onCreateBulletin);
            $bullCreate.find("[data-dismiss]").on('click', root.clearCreateForm);

            root.ResetModal($bullCreate);
            $bullUpdate = $("#modal-edit");
            uBullId = $bullUpdate.find("[name=bulletin_id]");
            uFGroupDd = $bullUpdate.find("[name=foregroup_id]");
            $uOfficeDd = $bullUpdate.find("[name=foreoffice_id]");
            root.loadOffices();
            uBullName = $bullUpdate.find("[name=forebulletin_name]");
            uBullDesc = $bullUpdate.find("[name=forebulletin_desc]");
            uPath = $bullUpdate.find("[name=path]");
            uSampleFile = $bullUpdate.find("[name=sample_file_path]");
            uFileName = $bullUpdate.find("[name=file]");
            $bullUpdate.find(".update").on('click', root.onUpdateBulletin);

            $bullTbl.find('tbody').on('click', '.edit-item', (e) => {
                let selectedRow = $(e.target).parents('tr')[0];
                let data = bullTbl.fnGetData(selectedRow);
                uBullId.val(data.ForeBulletin_Id);
                uFGroupDd.val(data.ForeGroup_Id);
                _uOfficeIds = data.office_info.map(x => x.ForeOffice_Id);
                uOfficeDd.multiselect("select", _uOfficeIds);
                uBullName.val(data.ForeBulletin_Name);
                uBullDesc.val(data.ForeBulletin_Desc);
                uPath.val(data.File_Path);
                uFileName.val(data.File_Name);
                uSampleFile.val(data.Sample_File_Path);
            });

            $bullTbl.find('tbody').on('click', '.delete-item', (e) => {
                var selectedRow = $(e.target).parents('tr')[0];
                var data = bullTbl.fnGetData(selectedRow);
                DBBB.confirm("Tất cả thông tin và tài liệu mẫu liên quan đến bản tin này sẽ được xóa! Bạn có chắc muốn xóa bản tin này?",
                    (result) => {
                        if (result) {
                            $.ajax({
                                url: "/DisasterBulletin/Delete",
                                data: { id: data.ForeBulletin_Id },
                                type: 'post'
                            }).done(function (response) {
                                if (response.success) {
                                    $bullTbl.DataTable().ajax.reload();
                                }
                                DBBB.alert(response.message);
                            });
                        }
                    });
            });
        },
        onUpdateBulletin() {
            if (!uBullName.val().trim()) {
                DBBB.alert("Vui lòng nhập tên bản tin dự báo thiên tai!");
                return;
            }
            if (!uFGroupDd.val()) {
                DBBB.alert("Vui lòng chọn nhóm bản tin dự báo thiên tai!");
                return;
            }
            if (_uOfficeIds.length === 0) {
                DBBB.alert("Vui lòng chọn ít nhất 1 đơn vị thực hiện!");
                return;
            }
            if (!uSampleFile.val() || !DBBB.isValidPath(uSampleFile.val())) {
                DBBB.alert("Vui lòng nhập đúng định dạng đường dẫn lưu bản tin mẫu!");
                return;
            }
            if (!uPath.val() || !DBBB.isValidPath(path.val())) {
                DBBB.alert("Vui lòng nhập đúng định dạng đường dẫn!");
                return;
            }
            if (!uFileName.val()) {
                DBBB.alert("Vui lòng nhập tên quy ước bản tin phát hành!");
                return;
            }
            //let file = uSampleFile[0].files[0];
            //if (file) {
            //    if (file.size > 5 * 1024 * 1024 || !(file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type == "application/msword")) {
            //        DBBB.alert("Vui lòng chỉ chọn tập tin doc và có dung lượng nhỏ hơn 5 MB!");
            //        return;
            //    }
            //}

            var data = new FormData();
            data.append('bulletinId', uBullId.val());
            data.append('groupId', uFGroupDd.val());
            $.each(_uOfficeIds, (idx, value) => {
                data.append("officeIds[]", value);
            });
            data.append('bulletinName', uBullName.val().trim());
            data.append('bulletinDesc', uBullDesc.val() ? uBullDesc.val().trim() : '');
            data.append('path', uPath.val());
            data.append('fileName', uFileName.val().trim());
            data.append('sample_file_path', uSampleFile.val().trim());
            $.ajax({
                url: '/DisasterBulletin/UpdateAsync',
                type: 'POST',
                data: data,
                cache: false,
                dataType: 'json',
                processData: false,
                contentType: false,
                success(response, textStatus, jqXHR) {
                    if (response.success) {
                        root.clearCreateForm();
                        $bullTbl.DataTable().ajax.reload();
                        $bullUpdate.modal('hide');
                    }
                    DBBB.alert(response.message);
                },
                error(jqXHR, textStatus, errorThrown) {
                    DBBB.alert('Tạo mới thất bại!');
                }
            });
        },
        onCreateBulletin() {
            if (!bullName.val().trim()) {
                DBBB.alert("Vui lòng nhập tên bản tin dự báo thiên tai!");
                return;
            }
            if (!fGroupDd.val()) {
                DBBB.alert("Vui lòng chọn nhóm bản tin dự báo thiên tai!");
                return;
            }
            if (_officeIds.length === 0) {
                DBBB.alert("Vui lòng chọn ít nhất 1 đơn vị thực hiện!");
                return;
            }
            if (!sampleFile.val() || !DBBB.isValidPath(sampleFile.val())) {
                DBBB.alert("Vui lòng nhập đúng định dạng đường dẫn lưu bản tin mẫu!");
                return;
            }
            if (!path.val() || !DBBB.isValidPath(path.val())) {
                DBBB.alert("Vui lòng nhập đúng định dạng đường dẫn!");
                return;
            }
            if (!fileName.val()) {
                DBBB.alert("Vui lòng nhập tên quy ước bản tin phát hành!");
                return;
            }
            //let file = sampleFile[0].files[0];
            //if (file.size > 5 * 1024 * 1024 || !(file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type == "application/msword") ) {
            //    DBBB.alert("Vui lòng chỉ chọn tập tin doc và có dung lượng nhỏ hơn 5 MB!");
            //    return;
            //}

            var data = new FormData();
            data.append('groupId', fGroupDd.val());
            $.each(_officeIds, (idx, value) => {
                data.append("officeIds[]", value);
            });
            data.append('bulletinName', bullName.val().trim());
            data.append('bulletinDesc', bullDesc.val() ? bullDesc.val().trim():'');
            data.append('path', path.val());
            data.append('fileName', fileName.val().trim());
            data.append('sample_file_path', sampleFile.val().trim());
            $.ajax({
                url: '/DisasterBulletin/CreateAsync',
                type: 'POST',
                data: data,
                cache: false,
                dataType: 'json',
                processData: false,
                contentType: false,
                success(response, textStatus, jqXHR) {
                    if (response.success) {
                        root.clearCreateForm();
                        $('#table').DataTable().ajax.reload();
                        $('.modal').modal('hide');
                    }
                    DBBB.alert(response.message);
                },
                error(jqXHR, textStatus, errorThrown) {
                    DBBB.alert('Tạo mới thất bại!');
                }
            });
        },
        clearCreateForm() {
            $bullCreate.find('form')[0].reset();
            _officeIds = [];
            _offices = null;
            $officeDd.multiselect("select", []);
        },
        loadOffices() {
            $.get('/Disaster/Forecast/offices').done((offices) => {
                $officeDd.empty();
                $uOfficeDd.empty();
                _offices = offices;
                _officeIds = [];
                _uOfficeIds = [];
                $.each(offices, (idx, office) => {
                    $officeDd.append($("<option />").val(office.Id).text(office.Office_Name));
                    $uOfficeDd.append($("<option />").val(office.Id).text(office.Office_Name));
                });

                officeDd = $officeDd.multiselect("destroy").multiselect({
                    includeSelectAllOption: true,
                    selectAllValue: 'multiselect-all',
                    selectAllJustVisible: true,
                    buttonWidth: '100%',
                    maxHeight: '200',
                    onChange() {
                        _officeIds = [];
                        $.each($officeDd.find('option:selected'),(index, brand) => {
                            _officeIds.push($(brand).val());
                        });
                    },
                    onSelectAll() {
                        _officeIds = offices.map(office => office.Id);
                    },
                    onDeselectAll() {
                        _officeIds = [];
                    },
                });

                uOfficeDd = $uOfficeDd.multiselect("destroy").multiselect({
                    includeSelectAllOption: true,
                    selectAllValue: 'multiselect-all',
                    selectAllJustVisible: true,
                    buttonWidth: '100%',
                    maxHeight: '200',
                    onChange() {

                        _uOfficeIds = [];
                        $.each($uOfficeDd.find('option:selected'), (index, brand) => {
                            _uOfficeIds.push($(brand).val());
                        });
                        console.log(_uOfficeIds);
                    },
                    onSelectAll() {
                        _uOfficeIds = offices.map(office => office.Id);
                    },
                    onDeselectAll() {
                        _uOfficeIds = [];
                    },
                });
            });
        },

        initLoading() {
            $(document).ajaxStart(()=>  {
                App.startPageLoading();
            });
            $(document).ajaxComplete(()=>  {
                App.stopPageLoading();
            });
        },
        ResetModal($modal) {
            $modal.on('hidden.bs.modal', function () {
                $modal.find("input").val("");
                $modal.find("textarea").val("");
            });
        },

    }

    return {
        init: root.init
    };
})();

$(document).ready(() => {
    DisasterBulletin.init();
});