
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head><%@ page isELIgnored="false"%>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Aptech library management</title>
</head>
<body>
<div style="height:300px; width:100%; text-align:center; padding-top:50px;">
    <b style="font-size: 30; color: red;">You Do not have Authorization to View this Page!</b><br>
    <span>Please contact with administrator!</span><br>
    <span>Or click <a id="sign_out" href="#">Here</a> to login with another account</span></div>
<script
	src="<c:url value='/resources/assets/global/plugins/jquery.min.js' />"
	type="text/javascript"></script>
    <script
        src="<c:url value='/resources/assets/apps/scripts/account/auth.js' />"></script>
</body>
</html>