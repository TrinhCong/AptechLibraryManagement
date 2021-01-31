<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <title>Aptech library management</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <meta content="Preview page of Metronic Admin Theme #2 for " name="description" />
    <meta content="" name="author" />
    <!-- BEGIN GLOBAL MANDATORY STYLES -->
    <link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css" />
    <link href="/library-management/resources/assets/global/plugins/font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css" />
    <link href="/library-management/resources/assets/global/plugins/simple-line-icons/simple-line-icons.css" rel="stylesheet" type="text/css" />
    <link href="/library-management/resources/assets/global/plugins/bootstrap/css/bootstrap.css" rel="stylesheet" type="text/css" />
    <link href="/library-management/resources/assets/global/plugins/bootstrap-switch/css/bootstrap-switch.css" rel="stylesheet" type="text/css" />
    <link href="/library-management/resources/assets/global/plugins/bootstrap-modal/css/bootstrap-modal.css" rel="stylesheet" type="text/css" />
    <link href="/library-management/resources/assets/global/plugins/bootstrap-modal/css/bootstrap-modal-bs3patch.css" rel="stylesheet" type="text/css" />
    <!-- END GLOBAL MANDATORY STYLES -->
    <!-- BEGIN PAGE LEVEL PLUGINS -->
    <link href="/library-management/resources/assets/global/plugins/select2/css/select2.css" rel="stylesheet" type="text/css" />
    <link href="/library-management/resources/assets/global/plugins/select2/css/select2-bootstrap.min.css" rel="stylesheet" type="text/css" />
    <!-- END PAGE LEVEL PLUGINS -->
    <!-- BEGIN THEME GLOBAL STYLES -->
    <link href="/library-management/resources/assets/global/css/components-md.css" rel="stylesheet" id="style_components" type="text/css" />
    <link href="/library-management/resources/assets/global/css/plugins-md.css" rel="stylesheet" type="text/css" />
    <link href="/library-management/resources/assets/layouts/layout2/css/custom.css" rel="stylesheet" type="text/css" />
    <!-- END THEME GLOBAL STYLES -->
    <!-- BEGIN PAGE LEVEL STYLES -->
    <link href="/library-management/resources/assets/pages/css/login-3.css" rel="stylesheet" type="text/css" />
    <!-- END PAGE LEVEL STYLES -->
    <!-- BEGIN THEME LAYOUT STYLES -->
    <!-- END THEME LAYOUT STYLES -->
</head>
<!-- END HEAD -->

<body class=" login">
    <!-- BEGIN LOGO -->
    <div class="logo">
        <a href="/">
            <img src="/library-management/resources/assets/layouts/layout2/img/logo-default.png" alt=" " style="height:120px;" /> </a>
    </div>
    <!-- END LOGO -->
    <!-- BEGIN LOGIN -->
    <div class="content">
        <!-- BEGIN LOGIN FORM -->
        <form class="login-form">
            <h3 class="form-title">Log In</h3>
            <div class="alert alert-danger display-hide">
                <button class="close" data-close="alert"></button>
                <span> Please enter user name and password </span>
            </div>
            <div class="form-group">
                <!--ie8, ie9 does not support html5 placeholder, so we just show field title for that-->
                <label class="control-label visible-ie8 visible-ie9">Account</label>
                <div class="input-icon">
                <i class="fa fa-user"></i>
                    <input class="form-control placeholder-no-fix" type="text" autocomplete="off" placeholder="user name" name="username" /> </div>
                
            </div>
            <div class="form-group">
                <label class="control-label visible-ie8 visible-ie9">Paswword</label>
                <div class="input-icon">
                    <i class="fa fa-lock"></i>
                    <input class="form-control placeholder-no-fix" type="password" autocomplete="off" placeholder="password" name="password" id="user-password" />
                </div>
            </div>
            <div class="form-actions">
                <label class="rememberme mt-checkbox mt-checkbox-outline">
                    <input type="checkbox" id="remember" /> Remember
                    <span></span>
                </label>
                <input type="hidden" name="RememberMe" value="false" />
                <a class="btn green pull-right sign-in"> Log In </a>
            </div>
        </form>
        <!-- END LOGIN FORM -->
        <!-- crea
    </div>
    <!-- END LOGIN -->
        <!--[if lt IE 9]>
    <script src="/library-management/resources/assets/global/plugins/respond.min.js"></script>
    <script src="/library-management/resources/assets/global/plugins/excanvas.min.js"></script>
    <script src="/library-management/resources/assets/global/plugins/ie8.fix.min.js"></script>
    <![endif]-->
        <!-- BEGIN CORE PLUGINS -->
        <script src="/library-management/resources/assets/global/plugins/jquery.min.js" type="text/javascript"></script>
        <script src="/library-management/resources/assets/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
        <script src="/library-management/resources/assets/global/plugins/bootbox/bootbox.min.js" type="text/javascript"></script>
        <script src="/library-management/resources/assets/global/plugins/js.cookie.min.js" type="text/javascript"></script>
        <script src="/library-management/resources/assets/global/plugins/jquery.form.min.js" type="text/javascript"></script>
        <script src="/library-management/resources/assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
        <script src="/library-management/resources/assets/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
        <script src="/library-management/resources/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script>
        <script src="/library-management/resources/assets/global/plugins/bootstrap-modal/js/bootstrap-modalmanager.js" type="text/javascript"></script>
        <script src="/library-management/resources/assets/global/plugins/bootstrap-modal/js/bootstrap-modal.js" type="text/javascript"></script>
        <!-- END CORE PLUGINS -->
        <!-- BEGIN PAGE LEVEL PLUGINS -->
        <script src="/library-management/resources/assets/global/plugins/jquery-validation/js/jquery.validate.min.js" type="text/javascript"></script>
        <script src="/library-management/resources/assets/global/plugins/jquery-validation/js/additional-methods.min.js" type="text/javascript"></script>
        <script src="/library-management/resources/assets/global/plugins/select2/js/select2.full.min.js" type="text/javascript"></script>
        <!-- END PAGE LEVEL PLUGINS -->
        <!-- BEGIN THEME GLOBAL SCRIPTS -->
        <script src="/library-management/resources/assets/global/scripts/app.js" type="text/javascript"></script>
        <!-- END THEME GLOBAL SCRIPTS -->
        <!-- BEGIN PAGE LEVEL SCRIPTS -->
        <script src="/library-management/resources/assets/apps/scripts/account/auth.js" type="text/javascript"></script>
        <!-- END PAGE LEVEL SCRIPTS -->
        <!-- BEGIN THEME LAYOUT SCRIPTS -->
        <!-- END THEME LAYOUT SCRIPTS -->
        <script>

        </script>
</body>

</html>