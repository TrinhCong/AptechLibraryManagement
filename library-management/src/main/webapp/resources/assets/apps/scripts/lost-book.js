class LostBookHandler {

    constructor() {
        var that = this;
        that.$table = $('#table');
        that._handleTheme();
        that._loadTable();
        $('#create').on('click', that._createItem);
        that.$table.find('tbody').on('click', '.edit-item', e => {
            that._editItem($(e.target).parents('tr')[0]);
        });
        that.$table.find('tbody').on('click', '.delete-item', e => {
            that._deleteItem($(e.target).parents('tr')[0]);
        });

        $('.data-form').ajaxForm({
            beforeSubmit: function(formData, jqForm, options) {
                const dataSend = {};
                for (var i = 0; i < formData.length; i++) {
                    var dataInput = formData[i];
                    if (dataInput.required) {
                        if (!dataInput.value) {
                            Aptech.alert("Please enter all fields!");
                            return false;
                        }
                    }
                    dataSend[dataInput.name] = dataInput.value;
                }
                if (!dataSend.quantity || dataSend.quantity <= 0) {
                    Aptech.alert("Quantity must be greater than zero!");
                    return false;
                }
                $.ajax({
                    type: "POST",
                    url: "/library-management/lost-book/save",
                    data: JSON.stringify(dataSend),
                    contentType: 'application/json',
                }).then((res) => {
                    if (res.success) {
                        that.$table.DataTable().ajax.reload();
                        jqForm.clearForm();
                        $('.modal').modal('hide');
                        Aptech.alert("Update infomation successful!");
                    } else {
                        if (res.message)
                            Aptech.alert(res.message);
                        else
                            Aptech.alert("Please try later!");
                    }
                })
                return false;
            },
            success: function(responseText, statusText, xhr, $form) {

            }
        });


        that._initLoading();
        that._loadData();
    }
    _loadData() {
        this.$books = $("[name=bookId]").empty();
        $.get("/library-management/book/list").done(xhr => {
            if (xhr.data)
                xhr.data.forEach(item => this.$books.append($("<option/>").text(item.title).val(item.id)));
        });
    }
    _loadTable() {
        var that = this;
        this.dataTable = this.$table.dataTable({
            "processing": true,
            "serverSide": false,
            "filter": true,
            "datatype": "json",
            "ajax": {
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                url: "/library-management/lost-book/list",
                data: function(d) {
                    return JSON.stringify(d);
                },
            },

            // "language": {
            //     url: '/static/translate/vi.json'
            // },
            "bStateSave": true,

            "lengthMenu": [
                [5, 10, 15, 20, -1],
                [5, 10, 15, 20, "Tất cả"]
            ],
            // set the initial value
            "pageLength": 5,
            "pagingType": "bootstrap_full_number",

            columns: [{
                title: 'Book',
                data: "book.title"
            }, {
                title: 'Quantity',
                data: "quantity",
            }, {
                title: 'Reason',
                data: "reason",
            }, {
                title: 'Updated At',
                data: "updatedAt",
                render: function(data, type, row, meta) {
                    return data ? new Date(data).toString('HH:mm dd/MM/yyyy') : "";
                }
            }, {
                title: 'Actions',
                render: function(data, type, row, meta) {
                    return `<a class="btn btn-xs green edit-item" role="button" data-toggle="modal" href="#modal-edit" aria-expanded="false">
						        Edit
						        <i class="fa fa-pencil"></i>
						    </a>
						    <a class="btn btn-xs red delete-item" role="button" aria-expanded="false">
						        Delete
						        <i class="fa fa-trash"></i>
						    </a>`;
                },
                width: '180px',
                className: 'text-center'
            }],
            "initComplete": function(settings, json) {
                $(".dataTables_filter input")
                    .unbind()
                    .bind('keyup change', function(e) {
                        if (e.keyCode == 13 || this.value == "") {
                            that.dataTable
                                .fnFilter(this.value);
                        }
                    });
            }
        });
    }
    _handleTheme() {
        let sidebarheight = $('.page-sidebar-menu').height();
        $(".portlet").height(sidebarheight);
    }
    _createItem() {
        this.check = true;
        $('.icon').unbind('click').on('click', this._showHidePassInput);
    }
    _editItem(selectedRow) {
        this.check = true;
        var data = this.dataTable.fnGetData(selectedRow);
        App.populateFormWithData('#form-update', data);
        $('#form-update').find('[name=gender]').find(`option[value=${data.gender}]`).attr('selected', 'selected');
        $('.icon').unbind('click').on('click', this._showHidePassInput);
    }
    _deleteItem(selectedRow) {
        var data = this.dataTable.fnGetData(selectedRow);
        Aptech.confirm("Are you sure to delete this lost-book?", function(result) {
            if (result) {
                let param = { id: data.id };
                console.log(param);
                $.ajax({
                    url: "/library-management/lost-book/delete",
                    data: JSON.stringify(param),
                    type: 'post',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                }).done(function(res) {
                    if (res.success) {
                        $('#table').DataTable().ajax.reload();
                        Aptech.alert("Deleted successful!");
                    } else {
                        Aptech.alert(res.message || "An error has occured! Try delete later!");
                    }
                });
            }
        });
    }
    _showHidePassInput() {
        if (!this.check) {
            $('.pass').attr('type', 'text');
            $('.icon').removeClass('fa fa-eye-slash');
            $('.icon').addClass('fa fa-eye');
            $('.pass').addClass('');
            this.check = true;
        } else {
            $('.pass').attr('type', 'password');
            $('.icon').removeClass('fa fa-eye');
            $('.icon').addClass('fa fa-eye-slash');
            $('.pass').addClass('active');
            this.check = false;
        }
    }
    _initLoading() {
        $(document).ajaxStart(function() {
            App.startPageLoading();
        });
        $(document).ajaxComplete(function() {
            App.stopPageLoading();
        });
    }
}
$(_ => {
    new LostBookHandler();
});