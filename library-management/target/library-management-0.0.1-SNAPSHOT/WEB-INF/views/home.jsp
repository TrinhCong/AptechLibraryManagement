<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html>
<html>
<head><%@ page isELIgnored="false"%>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>javaguides.net</title>
</head>

<body>
	<link rel="stylesheet" type="text/css"
		href="<c:url value='/resources/assets/global/plugins/bootstrap-modal/css/bootstrap-modal-bs3patch.css'/>" />
	<link rel="stylesheet" type="text/css"
		href="<c:url value='/resources/assets/global/plugins/datatables/datatables.min.css'/>" />
	<link rel="stylesheet" type="text/css"
		href="<c:url value='/resources/assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css'/>" />
	<link rel="stylesheet" type="text/css"
		href="<c:url value='/resources/assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css'/>" />
	<style>
		#table_wrapper {
			margin-bottom: 100px !important;
		}
		.portlet.light.no-margin{
			height: 100% !important;
		}
	</style>

	<div class="portlet light no-margin">
		<div class="portlet-title">
			<div class="caption">
				<span class="caption-subject font-green-sharp bold uppercase">Quản
					trị người mượn sách</span>
			</div>
		</div>
		<div class="portlet-body">
			<div class="table-toolbar">
				<div class="row">
					<div class="col-md-6">
						<a class="btn btn-sm green" data-toggle="modal" role="button"
							href="#modal-create" id="create">Thêm người mượn sách <i
							class="fa fa-plus"></i>
						</a>
					</div>
				</div>
			</div>
			<table class="table table-bordered table-hover table-striped"
				id="table"></table>
		</div>
	</div>

	<!-- edit -->
	<div id="modal-edit" class="modal fade" tabindex="-1" data-width="500"
		data-backdrop="static">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal"
				aria-hidden="true"></button>
			<h4 class="modal-title">Cập nhật thông tin về sản phẩm NWP</h4>
		</div>
		<div class="modal-body">
			<form action="/NWPProduct/Update" method="post"
				class="form-horizontal data-form" id="form-update">
				<input type="hidden" id="product-id" value="0" name="Product_Id" />
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Tên sản phẩm<span
						class="required">*</span></label>
					<div class="col-sm-8">
						<input type="text" class="form-control" name="Product_Name"
							required />
					</div>
				</div>
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Thông tin mô
						tả về sản phẩm</label>
					<div class="col-sm-8">
						<textarea name="Product_Desc" id="" cols="30" rows="5"
							class="form-control"></textarea>
					</div>
				</div>
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Hạn dự báo<span
						class="required">*</span></label>
					<div class="col-sm-8">
						<input type="text" class="form-control" name="Leadtime" required />
						<small> (không quá 3 ký tự và đầy đủ. Ví dụ: 072) </small>
					</div>
				</div>
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Danh sách các
						hạn dự báo<span class="required">*</span>
					</label>
					<div class="col-sm-8">
						<input type="text" class="form-control fr-list" name="Fr_List"
							required /> <small> (không quá 3 ký tự và đầy đủ, các
							hạn dự báo cách nhau dấu ";" giá trị cuối phải bằng hạn dự báo
							tối đa. Ví dụ: 000; 006; 012; 024; 048; 072) </small>
					</div>
				</div>
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Đường dẫn chứa
						sản phẩm<span class="required">*</span>
					</label>
					<div class="col-sm-8">
						<input type="text" class="form-control" name="Product_Path"
							required />
					</div>
				</div>
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Tên file sản
						phẩm<br />(tên qui ước)<span class="required">*</span>
					</label>
					<div class="col-sm-8">
						<input type="text" class="form-control" name="Product_File"
							required />
					</div>
				</div>
			</form>
		</div>
		<div class="modal-footer text-center"
			style="text-align: center !important">
			<button type="button" onclick="$('#form-update').submit()"
				class="btn btn-sm green">Lưu lại</button>
			<button type="button" data-dismiss="modal" class="btn btn-sm red">Đóng</button>
		</div>
	</div>
	<!-- create -->
	<div id="modal-create" class="modal fade" tabindex="-1"
		data-width="500" data-backdrop="static">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal"
				aria-hidden="true"></button>
			<h4 class="modal-title">Tạo mới sản phẩm dự báo số trị</h4>
		</div>
		<div class="modal-body">
			<form action="/NWPProduct/Create" class="form-horizontal data-form"
				method="post" id="form-create">
				<div class="form-group">
					<label class="control-label col-sm-4" for="">Lựa chọn mô
						hình<span class="required">*</span>
					</label>
					<div class="col-sm-8">
						<select class="form-control select2" name="NWP_Model_Id">

						</select>
					</div>
				</div>
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Tên sản phẩm<span
						class="required">*</span></label>
					<div class="col-sm-8">
						<input type="text" class="form-control" name="Product_Name"
							required />
					</div>
				</div>
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Mô tả về sản
						phẩm</label>
					<div class="col-sm-8">
						<textarea name="Product_Desc" id="Product_Desc" cols="30" rows="5"
							class="form-control"></textarea>
					</div>
				</div>
			</form>
		</div>
		<div class="modal-footer text-center"
			style="text-align: center !important">
			<button type="button" onclick="$('#form-create').submit()"
				class="btn btn-sm green">Lưu lại</button>
			<button type="button" data-dismiss="modal" class="btn btn-sm red">Đóng</button>
		</div>
	</div>

	<script
		src="<c:url value='/resources/assets/global/scripts/datatable.js' />"></script>
	<script
		src="<c:url value='/resources/assets/global/plugins/datatables/datatables.min.js' />"></script>
	<script
		src="<c:url value='/resources/assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.js' />"></script>
	<script
		src="<c:url value='/resources/assets/global/plugins/jquery.form.min.js' />"></script>
	<script
		src="<c:url value='/resources/assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js' />"></script>
	<script src="<c:url value='/resources/scripts/home.js' />"></script>

</body>


</html>