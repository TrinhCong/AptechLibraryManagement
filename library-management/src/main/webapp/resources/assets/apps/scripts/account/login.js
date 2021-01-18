class LoginHandler {
    constructor() {
        $(".sign-in").off('click').on('click', this._login);
    }
    _login() {
        var data = {
            userName: $("[name=username]").val(),
            password: $("[name=password]").val(),
        }
        App.startPageLoading();
        setTimeout(_ => {
            App.stopPageLoading();
            if (data.userName == 'admin' && data.password == '123456') {
                localStorage.setItem('username', 'Admin');
                $(location).attr('href', '/library-management/home');
            } else {
                localStorage.removeItem('username');
                bootbox.alert("Wrong user or password!");
            }
        }, 2000);
    }
}

$(document).ready(_ => {
    new LoginHandler();
});