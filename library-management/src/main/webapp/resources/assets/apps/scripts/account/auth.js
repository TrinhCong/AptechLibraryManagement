class AuthHandler {
    constructor() {
        let status = $(location).attr('href').toLowerCase().indexOf('login') > -1;
        let userName = localStorage.getItem('username');
        if (status) {
            if (userName)
                $(location).attr('href', '/library-management/user');
        } else {
            if (!userName)
                $(location).attr('href', '/library-management/user/login');
            else {
                $("#user_name").text(userName);
                $("#sign_out").on('click', _ => {
                    localStorage.removeItem('username');
                    $(location).attr('href', '/library-management/user/login');
                });
            }
        }
    }
}

$(document).ready(_ => {
    new AuthHandler();
});