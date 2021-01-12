/**
 * 
 */

/**
 * 
 */
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
				const dataSend = {};
				for (var i = 0; i < formData.length; i++) {
					var dataInput = formData[i];
					if (dataInput.required) {
						if (!dataInput.value) {
							DBBB.alert("Vui lòng nhập đầy đủ thông tin");
							return false;
						}
						if (dataInput.name == "Email_Pass" && !DBBB.isValidPassword(dataInput.value)) {
							DBBB.alert("Vui lòng nhập mật khẩu phải có chữ và số, bao gồm ít nhất 6 kí tự!");
							return false;
						}
					}
					dataSend[dataInput.name] = dataInput.value;
				}
				$.ajax({
					type: "POST",
					url: "/library-management/user/create",
					data: JSON.stringify(dataSend),
					contentType: 'application/json',
				}).then((res) => {
					if (res.data) {
						$('#table').DataTable().ajax.reload();
						jqForm.clearForm();
						$('.modal').modal('hide');
						DBBB.alert("Tài khoản người mượn sách đã được lưu");
					} else {
						if (res.message)
							DBBB.alert(res.message);
						else
							DBBB.alert("Lỗi hệ thống vui lòng thử lại sau");
					}
				})
				return false;
			},
			success: function(responseText, statusText, xhr, $form) {

			}
		});


		private.initLoading();
	}
	private.loadTable = function() {
		dataTable = table.dataTable({
			"processing": true,
			"serverSide": false,
			"filter": false,
			"datatype": "json",
			"ajax": {
				type: "POST",
				contentType: "application/json; charset=utf-8",
				dataType: 'json',
				url: "/library-management/user/list",
				data: function(d) {
					console.log(d);
					return JSON.stringify(d);
				},
			},

			"language": {
				url: '/static/translate/vi.json'
			},
			"bStateSave": true,

			"lengthMenu": [
				[5, 10, 15, 20, -1],
				[5, 10, 15, 20, "Tất cả"]
			],
			// set the initial value
			"pageLength": 5,
			"pagingType": "bootstrap_full_number",

			columns: [{
				title: 'Tên đăng nhập',
				data: "userName"
			}, {
				title: 'Tên hiển thị',
				data: "displayName"
			}, {
				title: 'Tuổi',
				data: "age"
			}, {
				title: 'Địa chỉ',
				data: "address"
			}, {
				title: 'Giới tính',
				data: "gender",
				render: function(data, type, row, meta) {
					return data === 1 ? "Nam" : data === 2 ? "Nữ" : "Khác";
				}
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
		$('#form-update').find('[name=gender]').find(`option[value=${data.gender}]`).attr('selected','selected');
		$('.icon').unbind('click').on('click', private.showHidePassInput);
	};
	private.deleteItem = function() {
		selectedRow = $(this).parents('tr')[0];
		data = dataTable.fnGetData(selectedRow);
		DBBB.confirm("Bạn có chắc chắn muốn xóa người mượn sách này ?", function(result) {
			if (result) {
				$.ajax({
					url: "/library-management/user/delete",
					data: JSON.stringify({ id: data.id }),
					type: 'post',
					contentType: "application/json; charset=utf-8",
					dataType: 'json',
				}).done(function(res) {
					if (res.data) {
						$('#table').DataTable().ajax.reload();
						DBBB.alert("Xóa người mượn sách thành công");
					} else {
						if (res.message)
							DBBB.alert(res.message);
						else
							DBBB.alert("Lỗi hệ thống vui lòng thử lại sau");
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