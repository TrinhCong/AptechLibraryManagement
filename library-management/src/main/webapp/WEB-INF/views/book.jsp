<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html>
<html>
<head><%@ page isELIgnored="false"%>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Aptech library management</title>
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
				<span class="caption-subject font-green-sharp bold uppercase">Books Management</span>
			</div>
		</div>
		<div class="portlet-body">
			<div class="table-toolbar">
				<div class="row">
					<div class="col-md-6">
						<a class="btn btn-sm green" data-toggle="modal" role="button"
							href="#modal-create" id="create">Add Book <i
							class="fa fa-plus"></i>
						</a>
					</div>
					<div class="col-md-6">
						<select  class="form-control" id="filter" style="width: 145px;
						float: right;">
							<option value="0">All Book</option>
							<option value="1">Available</option>
						</select>
						<div style="float:right; padding:7px">Filter: </div>
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
			<h4 class="modal-title">Update Book</h4>
		</div>
		<div class="modal-body">
			<form 
				class="form-horizontal data-form" id="form-update">
				<input type="hidden" id="book_id" value="0" name="id" />
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Book Code<span
						class="required">*</span></label>
					<div class="col-sm-8">
						<input type="text" class="form-control" name="code"
							required />
					</div>
				</div>
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Book Title<span
						class="required">*</span></label>
					<div class="col-sm-8">
						<input type="text" class="form-control" name="title"
							required />
					</div>
				</div>
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Subject<span
						class="required">*</span></label>
					<div class="col-sm-8">
						<select class="form-control" name="subjectId">
						</select>
					</div>
				</div>
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Author<span
						class="required">*</span></label>
					<div class="col-sm-8">
						<select class="form-control" name="authorId">
						</select>
					</div>
				</div>
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Rent Price<span
						class="required">*</span></label>
					<div class="col-sm-8">
						<input type="number" class="form-control" name="rentPrice" min="1" step="1"
							required />
					</div>
				</div>
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Quantity<span
						class="required">*</span></label>
					<div class="col-sm-8">
						<input type="number" class="form-control" name="quantity"
							required />
					</div>
				</div>
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Description<span
						class="required">*</span></label>
					<div class="col-sm-8">
						<textarea name="description" cols="30" rows="5"
							class="form-control"></textarea>
					</div>
				</div>
			</form>
		</div>
		<div class="modal-footer text-center"
			style="text-align: center !important">
			<button type="button" onclick="$('#form-update').submit()"
				class="btn btn-sm green">Save</button>
			<button type="button" data-dismiss="modal" class="btn btn-sm red">Close</button>
		</div>
	</div>
	<!-- create -->
	<div id="modal-create" class="modal fade" tabindex="-1"
		data-width="500" data-backdrop="static">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal"
				aria-hidden="true"></button>
			<h4 class="modal-title">Add Book</h4>
		</div>
		<div class="modal-body">
			<form action="/library-management/book/save" class="form-horizontal data-form"
				method="post" id="form-create">
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Book Code<span
						class="required">*</span></label>
					<div class="col-sm-8">
						<input type="text" class="form-control" name="code"
							required />
					</div>
				</div>
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Book Title<span
						class="required">*</span></label>
					<div class="col-sm-8">
						<input type="text" class="form-control" name="title"
							required />
					</div>
				</div>
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Subject<span
						class="required">*</span></label>
					<div class="col-sm-8">
						<select class="form-control" name="subjectId">
						</select>
					</div>
				</div>
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Author<span
						class="required">*</span></label>
					<div class="col-sm-8">
						<select class="form-control" name="authorId">
						</select>
					</div>
				</div>
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Rent Price<span
						class="required">*</span></label>
					<div class="col-sm-8">
						<input type="number" class="form-control" name="rentPrice" min="1" step="1"
							required />
					</div>
				</div>
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Quantity<span
						class="required">*</span></label>
					<div class="col-sm-8">
						<input type="number" class="form-control" name="quantity"
							required />
					</div>
				</div>
				<div class="form-group">
					<label for="" class="control-label col-sm-4">Description<span
						class="required">*</span></label>
					<div class="col-sm-8">
						<textarea name="description" cols="30" rows="5"
							class="form-control"></textarea>
					</div>
				</div>
			</form>
		</div>
		<div class="modal-footer text-center"
			style="text-align: center !important">
			<button type="button" onclick="$('#form-create').submit()"
				class="btn btn-sm green">Save</button>
			<button type="button" data-dismiss="modal" class="btn btn-sm red">Close</button>
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
	<script src="<c:url value='/resources/assets/apps/scripts/book.js' />"></script>

</body>


</html>