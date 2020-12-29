<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://www.opensymphony.com/sitemesh/decorator"
	prefix="dec"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html>
<head>

 <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<title><dec:title default="Trang chủ" /></title>

<link
	href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600,600i,700,700i&amp;subset=latin-ext,vietnamese"
	rel="stylesheet" />
<link
	href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,300i,700&amp;subset=latin-ext,vietnamese"
	rel="stylesheet" />
<link rel="stylesheet" type="text/css"
	href="<c:url value='/resources/assets/global/plugins/font-awesome/css/font-awesome.min.css' />" />
<link rel="stylesheet" type="text/css"
	href="<c:url value='/resources/assets/global/plugins/simple-line-icons/simple-line-icons.min.css'/>" />
<link rel="stylesheet" type="text/css"
	href="<c:url value='/resources/assets/global/plugins/bootstrap/css/bootstrap.min.css'/>" />
<link rel="stylesheet" type="text/css"
	href="<c:url value='/resources/assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css'/>" />
<link rel="stylesheet" type="text/css"
	href="<c:url value='/resources/assets/global/plugins/bootstrap-modal/css/bootstrap-modal.css'/>" />
<link rel="stylesheet" type="text/css"
	href="<c:url value='/resources/assets/global/plugins/bootstrap-modal/css/bootstrap-modal-bs3patch.css'/>" />
<!-- END GLOBAL MANDATORY STYLES -->
<!-- BEGIN PAGE LEVEL PLUGINS -->

<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN THEME GLOBAL STYLES -->
<link rel="stylesheet" id="style_components" type="text/css"
	href="<c:url value='/resources/assets/global/css/components-md.css'/>" />
<link type="text/css" rel="stylesheet"
	href="<c:url value='/resources/assets/global/css/plugins-md.css'/>" />
<!-- END THEME GLOBAL STYLES -->
<!-- BEGIN THEME LAYOUT STYLES -->
<link type="text/css" rel="stylesheet"
	href="<c:url value='/resources/assets/layouts/layout2/css/layout.css'/>" />
<link rel="stylesheet" type="text/css" id="style_color"
	href="<c:url value='/resources/assets/layouts/layout2/css/themes/light_custom.css'/>" />
<link rel="stylesheet" type="text/css"
	href="<c:url value='/resources/assets/layouts/layout2/css/custom.css'/>" />
</head>

<body
	class="page-sidebar-closed-hide-logo page-container-bg-solid page-md page-header-fixed page-sidebar-fixed page-footer-fixed">
	<!-- BEGIN HEADER -->
	<%@ include file="/WEB-INF/views/layouts/admin/header.jsp"%>
	<!-- END HEADER -->
	<!-- BEGIN HEADER & CONTENT DIVIDER -->
	<div class="clearfix"></div>
	<!-- END HEADER & CONTENT DIVIDER -->
	<!-- BEGIN CONTAINER -->
	<div class="page-container">
		<!-- BEGIN NAV -->
		<nav class="navbar navbar-default fixed-top" style="margin: 0;">
			<div class="container-fluid">
				<ul class="nav navbar-nav">
					<li data-link="system"><a href="/System">Quản trị</a></li>
					<li data-link="monitor"><a href="/Monitor">Giám sát</a></li>
					<li data-link="productforecast"><a href="/ProductForeCast">Sản
							phẩm dự báo</a></li>
					<li data-link="pointforecast"><a href="/PointForeCast">Dự
							báo điểm</a></li>
					<li data-link="evaluatepointforecast"><a
						href="/EvaluatePointForeCast">Đánh giá dự báo điểm</a></li>
					<li><a href="/Help/index.html" target="_blank">Trợ giúp</a></li>
				</ul>
				<ul class="nav navbar-nav pull-right">
					<li class="dropdown"><a href="#" class="dropdown-toggle"
						data-toggle="dropdown" role="button" aria-haspopup="true"
						aria-expanded="false"> Xin chào, <span class="caret"></span>
					</a>
						<ul class="dropdown-menu" style="z-index: 2000">
							<li><a href="/Account/Logout">Đăng xuất</a></li>
						</ul></li>
				</ul>
			</div>
		</nav>
		<!-- END NAV -->
		<!-- BEGIN SIDEBAR -->
		<%@ include file="/WEB-INF/views/layouts/admin/sidebar.jsp"%>

		<!-- END SIDEBAR -->
		<!-- BEGIN CONTENT -->
		<div class="page-content-wrapper">
			<!-- BEGIN CONTENT BODY -->
			<div class="page-content" style="overflow: auto">
				<div class="page-content-body">
					<dec:body />
				</div>
			</div>
			<!-- END CONTENT BODY -->
		</div>
		<!-- END CONTENT -->
	</div>
	<!-- END CONTAINER -->
	<!-- BEGIN FOOTER -->
	<%@ include file="/WEB-INF/views/layouts/admin/footer.jsp"%>
	<!-- END FOOTER -->

	<script
		src="<c:url value='/resources/assets/global/plugins/jquery.min.js' />"
		type="text/javascript"></script>
	<script
		src="<c:url value='/resources/assets/global/plugins/bootstrap/js/bootstrap.min.js' />"
		type="text/javascript"></script>
	<script
		src="<c:url value='/resources/assets/global/plugins/mustache.js' />"
		type="text/javascript"></script>
	<script
		src="<c:url value='/resources/assets/global/plugins/js.cookie.min.js' />"
		type="text/javascript"></script>
	<script
		src="<c:url value='/resources/assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js' />"
		type="text/javascript"></script>
	<script
		src="<c:url value='/resources/assets/global/plugins/jquery.blockui.min.js' />"
		type="text/javascript"></script>
	<script
		src="<c:url value='/resources/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js' />"
		type="text/javascript"></script>
	<script
		src="<c:url value='/resources/assets/global/plugins/bootstrap-modal/js/bootstrap-modalmanager.js' />"
		type="text/javascript"></script>
	<script
		src="<c:url value='/resources/assets/global/plugins/bootstrap-modal/js/bootstrap-modal.js' />"
		type="text/javascript"></script>
	<script
		src="<c:url value='/resources/assets/apps/scripts/datetime.format.js' />"></script>
	<script
		src="<c:url value='/resources/assets/global/scripts/enums.js' />"></script>
	<!-- END CORE PLUGINS -->
	<!-- BEGIN PAGE LEVEL PLUGINS -->
	<!-- END PAGE LEVEL PLUGINS -->
	<!-- BEGIN THEME GLOBAL SCRIPTS -->
	<script src="<c:url value='/resources/assets/global/scripts/app.js' />"></script>
	<script
		src="<c:url value='/resources/assets/global/plugins/bootbox/bootbox.min.js' />"></script>
	<!-- END THEME GLOBAL SCRIPTS -->
	<!-- BEGIN PAGE LEVEL SCRIPTS -->
	<!-- END PAGE LEVEL SCRIPTS -->
	<!-- BEGIN THEME LAYOUT SCRIPTS -->
	<script
		src="<c:url value='/resources/assets/layouts/layout2/scripts/layout.js' />"></script>
	<!-- END THEME LAYOUT SCRIPTS -->
</body>
</html>