/**
 * 
 */
var AreaConfig = function() {
	let public = $();
	let private = $();
	let check, dataTable, table, selectedRow, data;

	public.init = function() {
		table = $('#table');
		private.handleTheme();
		private.loadTable();
		$('#create').on('click', private.createItem);
		table.find('tbody').on('click', '.edit-item', private.editItem);
		table.find('tbody').on('click', '.delete-item', private.deleteItem);

		$('.data-form').ajaxForm({
			beforeSubmit: function(formData, jqForm, options) {
				for (var i = 0; i < formData.length; i++) {
					var dataInput = formData[i];
					if (dataInput.required) {
						if (!dataInput.value || formData.length < 7) {
							DBBB.alert("Vui lòng nhập đầy đủ thông tin");
							return false;
						}
						if (dataInput.name == "Area_Alias" && dataInput.value.length !== 4) {
							DBBB.alert("Tên viết tắt của khu vực dự báo không hợp lệ!");
							return false;
						}
						if (dataInput.name == "Email" && !DBBB.isEmail(dataInput.value)) {
							DBBB.alert("Vui lòng nhập đúng định dạng email!");
							return false;
						}
						if (dataInput.name == "Email_Pass" && !DBBB.isValidPassword(dataInput.value)) {
							DBBB.alert("Vui lòng nhập mật khẩu phải có chữ và số, bao gồm ít nhất 6 kí tự!");
							return false;
						}
					}
				}
			},
			success: function(responseText, statusText, xhr, $form) {
				var statusCode = responseText.code;
				if (statusCode == ResponseCodes.OK) {
					$('#table').DataTable().ajax.reload();
					$($form[0]).clearForm();
					$('.modal').modal('hide');
					DBBB.alert("Thông tin về khu vực dự báo mới đã được lưu vào trong CSDL khu vực dự báo");
				} else {
					if (responseText.errorMsg != null)
						DBBB.alert(responseText.errorMsg);
					else
						App.handlerResponseError(statusCode);
				}
			}
		});

		$('#form-import').ajaxForm({
			beforeSubmit: function(formData, jqForm, options) {
				for (var i = 0; i < formData.length; i++) {
					var dataInput = formData[i];
					if (dataInput.required) {
						if (!dataInput.value) {
							DBBB.alert("Vui lòng nhập đầy đủ thông tin");
							return false;
						}
					}
				}
			},
			success: function(responseText, statusText, xhr, $form) {
				if (responseText.success) {
					$('#table').DataTable().ajax.reload();
					$($form[0]).clearForm();
					$('.modal').modal('hide');
				}
				DBBB.alert(responseText.message);
			}
		});
		private.initLoading();
	}
	private.loadTable = function() {
		dataTable = table.dataTable({
			"processing": true,
			"serverSide": true,
			"filter": false,
			"datatype": "json",
			"ajax": {
				type: "POST",
				contentType: "application/json; charset=utf-8",
				dataType: 'json',
				url: "/library-management/author/list",
				data: function(d) {
				console.log(d);
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
				title: 'Tên bản tin',
				data: "Bulletin_Name"
			}, {
				title: 'Thao tác',
				render: function(data, type, row, meta) {
					return `<a class="btn btn-xs green edit-item" role="button" data-toggle="modal" href="#modal-edit" aria-expanded="false">
						        Sửa
						        <i class="fa fa-pencil"></i>
						    </a>
						    <a class="btn btn-xs red delete-item" role="button" aria-expanded="false">
						        Xóa
						        <i class="fa fa-trash"></i>
						    </a>`;
				},
				width: '180px',
				className: 'text-center'
			}],
			columnDefs: [
				{
					orderable: false,
					targets: [5]
				}
			],

			"initComplete": function(settings, json) {
				$(".dataTables_filter input")
					.unbind()
					.bind('keyup change', function(e) {
						if (e.keyCode == 13 || this.value == "") {
							dataTable
								.fnFilter(this.value);
						}
					});
			}
		});
	};
	private.handleTheme = function() {
		let sidebarheight = $('.page-sidebar-menu').height();
		$(".portlet").height(sidebarheight);
	};
	private.createItem = function() {
		check = true;
		$('.icon').unbind('click').on('click', private.showHidePassInput);
	};
	private.editItem = function() {
		check = true;
		selectedRow = $(this).parents('tr')[0];
		data = dataTable.fnGetData(selectedRow);
		App.populateFormWithData('#form-update', data);
		$('.icon').unbind('click').on('click', private.showHidePassInput);
	};
	private.deleteItem = function() {
		selectedRow = $(this).parents('tr')[0];
		data = dataTable.fnGetData(selectedRow);
		DBBB.confirm("Bạn có chắc chắn muốn xóa khu vực dự báo này ra khỏi CSDL khu vực dự báo hay không ?", function(result) {
			if (result) {
				$.ajax({
					url: "/Area/Config/Delete",
					data: { id: data.Area_Id },
					type: 'post'
				}).done(function(response) {
					var statusCode = response.code;
					if (statusCode == ResponseCodes.OK) {
						$('#table').DataTable().ajax.reload();
						DBBB.alert("Việc xóa thông tin về khu vực dự báo đã thành công, đề nghị bạn kiểm tra lại");
					} else {
						if (response.errorMsg != null)
							DBBB.alert(response.errorMsg);
						else
							App.handlerResponseError(statusCode);
					}
				});
			}
		});
	}
	private.showHidePassInput = function() {
		if (!check) {
			console.log(check);
			$('.pass').attr('type', 'text');
			$('.icon').removeClass('fa fa-eye-slash');
			$('.icon').addClass('fa fa-eye');
			$('.pass').addClass('');
			check = true;
		} else {
			console.log(check);
			$('.pass').attr('type', 'password');
			$('.icon').removeClass('fa fa-eye');
			$('.icon').addClass('fa fa-eye-slash');
			$('.pass').addClass('active');
			check = false;
		}
	};
	private.initLoading = function() {
		$(document).ajaxStart(function() {
			App.startPageLoading();
		});
		$(document).ajaxComplete(function() {
			App.stopPageLoading();
		});
	};
	return public;
}();
AreaConfig.init();