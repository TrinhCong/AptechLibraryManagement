class AuthHandler {
    constructor() {
        this._loadLoginInfo();
        this._navigate();
    }
    _isAuthorize(){
       return  this._data&&this._data.userId;
    }
    _navigateToLoginPage(){
        $(location).attr('href', '/library-management/user/login');
    }
    _navigateToAdminPage(){
        $(location).attr('href', '/library-management/admin-page');
    }
    _navigateToUserPage(){
        $(location).attr('href', '/library-management/user-page');
    }
    _navigateToForbidenPage(){
        $(location).attr('href', '/library-management/forbiden-page');
    }
    _loadLoginInfo(){
        var root=this;
        this._data={
            userId: localStorage.getItem('userid'),
            userName:localStorage.getItem('username'),
            role:localStorage.getItem('role')
        };
        root.$username= $("[name=username]");
        root.$password= $("[name=password]").on('keypress',function(e) {
            if(e.which == 13) {
                root._login();
            }
        });
        $("#user_name").text(root._data.userName);
        $(".sign-in").off('click').on('click',e=> this._login());
        $("#sign_out").off('click').on('click', _ => {
            root._clearLoginInfo();
            root._navigateToLoginPage();
        });
    }
    _navigate(){
        var root=this;
        let currentAddress=$(location).attr('href');
        if(root._isAuthorize()){
            if (currentAddress.toLowerCase().indexOf('login') > -1) {
                if(root._data.role=="admin")
                    root._navigateToAdminPage();
                else if(root._data.role=="user")
                root._navigateToUserPage();
                else 
                root._navigateToForbidenPage();
            } if(currentAddress.toLowerCase().indexOf('admin-page') > -1){
                if( root._data.role!="admin")
                root._navigateToForbidenPage();
            }
             else if(currentAddress.toLowerCase().indexOf('user-page') > -1){
                if(root._data.role!="admin"&&root._data.role!="user")
                root._navigateToForbidenPage();
            }
        }
        else {
            if(currentAddress.toLowerCase().indexOf('login') == -1)
            root._navigateToLoginPage();
       }
    }
    _setLoginInfo(data){
        localStorage.setItem('userid', data.id);
        localStorage.setItem('username',data.displayName|| data.userName);
        localStorage.setItem('role', data.role);
    }
    _clearLoginInfo(){
        localStorage.removeItem('userid');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
    }
    _login() {
        var root=this;
        var data = {
            userName: root.$username.val(),
            password: root.$password.val()
        }
        if(!data.userName||!data.password){
            bootbox.alert("Please enter all field!");
            return;
        }

        if (data.userName.toLowerCase() == 'admin' && data.password == 'Admin@123') {
            App.startPageLoading();
            setTimeout(_ => {
                App.stopPageLoading();
                data.id=9999999;
                data.role="admin";
                root._setLoginInfo(data);
                root._navigateToAdminPage();
            }, 2000);
        } else {
            App.startPageLoading();
            $.ajax({
                type: "POST",
                url: "/library-management/user/login",
                data: JSON.stringify(data),
                contentType: 'application/json',
            }).then(xhr=>{
                App.stopPageLoading();
                if(xhr.data){
                    root._setLoginInfo(xhr.data);
                    if(xhr.data.role=="admin"){
                        root._navigateToAdminPage();
                    }
                    else if(xhr.data.role=="user"){
                        root._navigateToUserPage();
                    }
                    else
                    root._navigateToForbidenPage();
                }
                else{
                    root._clearLoginInfo();
                    bootbox.alert("Wrong user or password!");
                }
            });
        }
    }
}

$(_ => {
    new AuthHandler();
});