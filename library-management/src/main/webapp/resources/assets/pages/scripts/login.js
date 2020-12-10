var Login = function () {

    var handleLogin = function () {

        $('#group_list').change(function () {
            $.ajax({
                url: "/User/ListByGroup",
                data: { groupId: $(this).val() }
            })
                .done(function (result) {
                    //$('#user_list').find('option').not(':first').remove();
                    var userList = [];
                    for (var i = 0; i < result.length; i++) {
                        userList.push({ id: result[i].UserName, text: result[i].FirstName });
                    }
                    $('.select2').empty();
                    $('.select2').select2({
                        data: userList
                    });
                });
        });

        $(".select2").select2({
            placeholder: 'Vui lòng chọn người dùng',
            width: null
        });

        $('.login-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                },
                remember: {
                    required: false
                }
            },

            messages: {
                username: {
                    required: "Vui lòng chọn người dùng."
                },
                password: {
                    required: "Vui lòng nhập mật khẩu."
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit   
                $('.alert-danger', $('.login-form')).show();
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function (form) {
                $(form).find("[name=RememberMe]").val($("#remember").is(":checked"));
                $(form).ajaxSubmit({
                    success: function (xhr) {
                        if (xhr.success) {
                            var userInfo = xhr.info;
                            if (userInfo) {
                                $('.user-fullname').text(userInfo.FullName);
                                $('#info-title').text(userInfo.Title);
                                $('#info-department').text(userInfo.Department);
                                $('#avatar-img').prop('src', userInfo.PhotoUrl);
                                $('.user-name').val(userInfo.UserName);
                                $('#continue').unbind('click').on('click', function () {
                                    $(location).attr('href',xhr.url);
                                });
                                $('#modal-info').modal('show');
                            }
                        } else {
                            bootbox.alert('Mật khẩu bạn vừa nhập không đúng, đề nghị bạn nhập lại hoặc liên hệ với quản trị hệ thống để được trợ giúp');
                        }
                    }
                });
                // form.submit();
                // form.ajaxSubmit({
                //     success: function (xhr) {

                //     }
                // }); // form validation success, call ajax form submit
            }
        });
        $('.login-form').on('submit', function (e) {
            e.preventDefault();
        });

        $('.login-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('.login-form').validate().form()) {
                    $('.login-form').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    var handleForgetPassword = function () {
        $('.forget-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                email: {
                    required: true,
                    email: true
                }
            },

            messages: {
                email: {
                    required: "Email is required."
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit   

            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function (form) {
                form.submit();
            }
        });

        $('.forget-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('.forget-form').validate().form()) {
                    $('.forget-form').submit();
                }
                return false;
            }
        });

        jQuery('#forget-password').click(function () {
            jQuery('.login-form').hide();
            jQuery('.forget-form').show();
        });

        jQuery('#back-btn').click(function () {
            jQuery('.login-form').show();
            jQuery('.forget-form').hide();
        });

    };

    var handlerForgetPasswordPopup = function () {
        $('#form-changepassword').ajaxForm({
            beforeSubmit: function (formData, jqForm, options) {
                for (var i = 0; i < formData.length; i++) {
                    var dataInput = formData[i];
                    if (dataInput.required) {
                        if (!dataInput.value) {
                            bootbox.alert({
                                message: "Vui lòng nhập đầy đủ thông tin",
                                buttons: {
                                    ok: {
                                        label: "Tiếp tục",
                                        className: 'btn-success'
                                    }
                                }
                            });
                            return false;
                        }
                    }
                }
            },
            success: function (responseText, statusText, xhr, $form) {
                console.log(responseText.success);
                if (responseText.success) {
                    $('.modal').modal('hide');
                    $('#user-password').val('');
                } else {
                    bootbox.alert({
                        message: responseText.error,
                        buttons: {
                            ok: {
                                label: "Tiếp tục",
                                className: 'btn-success'
                            }
                        }
                    });
                }

                $('#modal-change-password input[type="password"]').val('');
            }
        });
    };

    return {
        //main function to initiate the module
        init: function () {
            handleLogin();
            handleForgetPassword();
            handlerForgetPasswordPopup();
        }

    };

}();

jQuery(document).ready(function () {
    Login.init();
});

function toggleChangePassword() {
    if ($('#modal-change-password').hasClass('in')) {
        $('#modal-change-password').modal('hide');
        $('#modal-info').modal('show');
    } else {
        $('#modal-info').modal('hide');
        $('#modal-change-password').modal('show');
    }
}