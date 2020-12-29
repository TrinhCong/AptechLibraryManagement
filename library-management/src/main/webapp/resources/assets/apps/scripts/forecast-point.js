var ForecastPoint = function () {
    let public = $();
    let private = $();
    let step1 = $();
    let step2 = $();
    let step3 = $();
    let step4 = $();
    let step5 = $();
    let step6 = $();
    let step7 = $();
    let $login1, $login2, $loginMd, procedureConfigItem,
        bulletinDd, areaDd, issueTimeDd, ips = [],
        acceptCb, testCb, $firstAction, $secondAction, startBtn,
        _step, _maxStep, _ltLength, _ltCount, _maxLtCount, _operationForecast, areaName,
        intervalTime, createIssueBtn, bulletinName, forecaster, _path;
    let $step1, $step2, $step3, $step4, $step5, $step6, $step7, $step5Content,
        $createMd, $previewMd, createBtn, stopTime, accessTime, $btnReleased, $listReleased, released_id;

    public.init = function () {
        private.activeControl();
        private.handleLogin();
        step1.init();
        step2.init();
        step3.init();
        step4.init();
        step5.init();
        step6.init();
        step7.init();
        private.ReleasedPointForecast();
        private.initLoading();
    };
    private.ReleasedPointForecast = () => {
        $listReleased = $("[name=released-point-forecast]");
        $btnReleased = $("[name=start-show-released]");
        $btnReleased.on("click", () => {
            if ($listReleased.val() && $listReleased.val() != "0") {
                $.get("/PointForeCast/GetReleasedContent", { released_id: $listReleased.val() ? $listReleased.val() : 0 }).done(xhr => {
                    for (var i = 0; i < xhr.pointBackups.length; i++) {
                        $(`textarea[name=${xhr.pointBackups[i].Step_Name}]`).val(xhr.pointBackups[i].Step_Content);
                    }
                    for (var i = 0; i < xhr.GroupVarPointByArea.length; i++) {
                        var item = xhr.GroupVarPointByArea[i];
                        if (item != null) {
                            for (var j = 0; j < item.VarValue.length; j++) {
                                var $tr = $(`tr[data-page="${item.VarValue[i].page_idx}"][data-point="${item.Area_Name}"]`);
                                $tr.find(`.${item.VarValue[j].VarName}`).val(item.VarValue[j].Value);
                            }
                        }
                    }
                });
            }
        })
    };
    private.initLoading = function () {
        $(document).ajaxStart(function () {
            App.startPageLoading();
        });
        $(document).ajaxComplete(function () {
            App.stopPageLoading();
        });
    };
    //activeControl
    private.activeControl = function () {
        _step = 0;
        _maxStep = 0;
        $(".continue").on('click', function () {
            private.increaseStep();
            private.activeStep()
        });

        $(".previous").on('click', function () {
            _step--;
            private.activeStep()
        });

        $("[data-step]").on('click', function () {
            _step = Number($(this).data('step'));
            if (_step <= _maxStep)
                private.activeStep();
            return false;
        });
    };

    private.countDown = function () {
        // Get todays date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = stopTime - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        $("#count_time").html(hours + "h " + minutes + "m " + seconds + "s ");

        if (distance < 10 * 60 * 1000) {
            $("#count_time").attr("style", "color: #fd3030");
        }
        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(intervalTime);
            $("#count_time").html("Hết hạn");
        }
    };
    //end handle control


    //handle login
    private.handleLogin = function () {
        accessTime = new Date();
        $loginMd = $("#login-modal");
        $loginMd.modal('toggle');
        $login1 = $("#first-form");
        $firstAction = $loginMd.find(".first-action");
        $login2 = $("#second-form");
        bulletinName = $login2.find("[name=Bulletin_Name]");
        forecaster = $login2.find("[name=Forecaster]");
        areaName = $login2.find("[name=Area_Name]");
        $secondAction = $loginMd.find(".second-action");
        bulletinDd = $loginMd.find("[name=Bulletin_Id]").on('change', private.onBulletinChange);
        areaDd = $loginMd.find("[name=Area_Id]").on('change', private.onAreaChange);
        issueTimeDd = $loginMd.find("[name=Issue_Time]").on('change', private.onIssueTimeChange);
        private.onBulletinChange();

        $loginMd.find(".next-form").on('click', private.nextLoginPage);
        $loginMd.find(".back").on('click', private.prevLoginPage);
        startBtn = $loginMd.find(".start").on('click', private.login);
        $loginMd.find("[name=accept_box]").on('change', private.activeStartBtn);
        $loginMd.find("[data-dismiss]").on('click', private.exitTask);
    };
    private.exitTask = function () {
        $(location).attr("href", "/");
    }
    private.onAreaChange = function () {
        areaName.val(areaDd.find('option:selected').text());
    };
    private.onIssueTimeChange = function () {
        $login2.find('[name=Hour]').val(issueTimeDd.find('option:selected').text());
    };
    private.activeStartBtn = function () {
        if ($(this).is(':checked'))
            startBtn.removeAttr('disabled');
        else
            startBtn.attr('disabled', 'disabled');
    };
    private.nextLoginPage = function () {
        $login1.hide();
        $firstAction.hide();
        $login2.show();
        $secondAction.show();
    };
    private.login = function () {
        if (!bulletinName.val())
            DBBB.alert("Vui lòng nhập tên bản tin dự báo");
        else {
            $loginMd.modal('toggle');
            private.increaseStep();
            private.activeStep();
            intervalTime = setInterval(private.countDown, 1000);
            private.saveOperationForecast();
        }
    };
    private.increaseStep = function () {
        _step++;
        if (_step > _maxStep)
            _maxStep = _step;
    };
    private.saveOperationForecast = function () {
        let now = new Date();
        var dateTim = $.dateTime.dateToString(accessTime, "yyyyMMdd") + issueTimeDd.find('option:selected').val() + "00";
        _operationForecast = {
            Bulletin_Id: Number(bulletinDd.val()),
            //Dattim_Id:0,
            Dattim: Number(dateTim),
            Bulletin_Name: bulletinName.val(),
            Forecaster_Id: forecaster.data("id"),
            Forecast_Area_Id: areaDd.val(),
            //Counter:0,
            Start_Time: $.dateTime.dateToString(now, "yyyyMMddHHmmss"),
            //End_Time:"",
            //Issue_Time: "",
            //Sending_Time: "",
            //Finish_Time: "",
            //Search_Content:"",
            //TT:0
        };
        $.post("OperationForecast/SaveOrUpdate", _operationForecast)
            .done(function (response) {
                //DBBB.alert(response.message);
            });
    };
    private.activeStep = function () {
        for (let i = 0; i <= _step; i++) {
            $('[id^=tab_step]').removeClass("active");
            $("#tab_step" + _step).removeClass("not-activated").addClass('active');
            $("[id^=step]").hide();
            $("#step" + _step).show();
        }
    };
    private.prevLoginPage = function () {
        $login1.show();
        $firstAction.show();
        $login2.hide();
        $secondAction.hide();
    };
    private.onBulletinChange = function () {
        $.ajax({
            url: 'Bulletin/Config/GetAI',
            type: 'POST',
            data: { id: bulletinDd.val() },
            success: function (value) {
                $.each(value.listArea, function (i, item) {
                    areaDd.append($('<option/>').val(item.Area_Id).html(item.Area_Name));
                });
                $.each(value.listIssueTime, function (i, item) {
                    let timeStr = item[0] + item[1] + "h" + item[2] + item[3];
                    issueTimeDd.append($('<option/>').val(item).text(timeStr));
                });

                $login2.find('[name=Bulletin_Type]').val(bulletinDd.find('option:selected').text());
                private.onAreaChange();
                private.onIssueTimeChange();
                $.get('/PointForeCast/GetProcedureConfig', { bulletinId: bulletinDd.val(), issueTime: issueTimeDd.val() })
                    .done(function (item) {
                        //let fromStr = item.Procedure_Start[0] + item.Procedure_Start[1] + "h" + item.Procedure_Start[2] + item.Procedure_Start[3];
                        let toStr = item.Procedure_End[0] + item.Procedure_End[1] + "h" + item.Procedure_End[2] + item.Procedure_End[3];
                        stopTime = new Date();
                        stopTime = new Date(stopTime.getFullYear(), stopTime.getMonth(), stopTime.getDate(), item.Procedure_End[0] + item.Procedure_End[1], item.Procedure_End[2] + item.Procedure_End[3]).getTime();
                        procedureConfigItem = item;
                        //$login2.find("#from-time").text(fromStr);
                        $login2.find("#to-time").text(toStr);
                    });
            }
        });
    };
    //  end handle login

    //handle step 1
    step1.init = function () {
        $step1 = $("#step1");
        $.each($step1.find(".step-content"), (index, ele) => {
            let $content = $(ele).on('change', e => {
                let val = $content.val().trim()
                $content.parents(".area-tag").find("input[type=checkbox]").prop("checked", !!val);
            });
        });
    };
    //end handle step 1

    //handle step 2
    step2.init = function () {
        $step2 = $("#step2");
        $.each($step2.find(".step-content"), (index, ele) => {
            let $content = $(ele).on('change', e => {
                let val = $content.val().trim()
                $content.parents(".area-tag").find("input[type=checkbox]").prop("checked", !!val);
            });
        });
    };
    //end handle step 2

    //handle step 3
    step3.init = function () {
        $step3 = $("#step3");
        $.each($step3.find(".step-content"), (index, ele) => {
            let $content = $(ele).on('change', e => {
                let val = $content.val().trim()
                $content.parents(".area-tag").find("input[type=checkbox]").prop("checked", !!val);
            });
        });
    };
    //end handle step 3

    //handle step 4
    step4.init = function () {
        $step4 = $("#step4");
        $.each($step4.find(".step-content"), (index, ele) => {
            let $content = $(ele).on('change', e => {
                let val = $content.val().trim()
                $content.parents(".area-tag").find("input[type=checkbox]").prop("checked", !!val);
            });
        });
    };
    //end handle step 4

    //handle step 5
    let nextBb, prevBb, department;
    let ltName;
    step5.init = function () {
        $step5 = $("#step5");
        $createMd = $("#modal_bulletin_creation");

        $('.form_datetime').datetimepicker({
            defaultDate: new Date(),
            autoclose: true,
            isRTL: App.isRTL(),
            format: "dd/mm/yyyy HH:00",
            fontAwesome: true,
            todayBtn: true,
            language: 'vi',
            minView: 1,
            pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left")
        });

        $step5Content = $step5.find(".content");
        _ltLength = Number($step5.find("[data-lt-length]").data('ltLength'));
        _ltCount = 0;
        _maxLtCount = 0;
        step5.loadContent(areaDd.val());
        ltName = $step5.find('[data-date]');
        $step5.find("[id^=lt_] a").on('click', step5.onLeadTimeClick);
        $step5.find('.next').on('click', step5.onNext);
        $step5.find('.prev').on('click', step5.onPrev);
        nextBb = $step5.find('[data-next]');
        prevBb = $step5.find('[data-prev]');
        acceptCb = $createMd.find("[name=accept_checkbox]");
        testCb = $createMd.find("[name=test_checkbox]");
        department = $createMd.find("[name=department]");
        createBtn = $createMd.find(".create").on("click", step5.createBulletin);
        $createMd.find(".preview").on('click', step5.preview);
        $createMd.find('[data-dismiss]').on('click', step5.resetModal);
        testCb.on('change', step5.onTestCbChange);
        acceptCb.on('change', function () {
            if (acceptCb.is(':checked'))
                createBtn.removeAttr('disabled');
            else
                createBtn.attr('disabled', 'disabled');
        });
        $previewMd = $("#preview-modal");
    };
    step5.createBulletin = function () {
        let data = {
            BulletinId: bulletinDd.val(),
            ForcastUnit: department.val(),
            data: step5.getDataFromTables(),
            OperationForecast: _operationForecast,
            forecast_time: $createMd.find("[name=issue_time]").val(),
            area_name: $createMd.find('[name=area]').val(),
            Check: $createMd.find('[name=checkuser]').val()
        };
        $.ajax({
            url: "/PointForecast/SaveBulletin",
            type: "post",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            success: function (response) {
                $createMd.modal("hide");
                bootbox.alert(response.message);
                private.increaseStep();
                private.activeStep();
                _path = response.data.excelPath;
                released_id = response.data.released_id;
            }
        });

    };
    step5.resetModal = function () {
        acceptCb.prop("checked", false);
        acceptCb.trigger("change");
    };
    step5.onLeadTimeClick = function () {
        if (step5.validate()) {
            let parent = $(this).parents("[id^=lt_]");
            if (!parent.hasClass("active")) {
                _ltCount = Number(parent.attr('id').split("_")[1]);
                if (_ltCount <= _maxLtCount) {
                    $step5.find("[id^=lt_]").removeClass('active');
                    parent.addClass('active');
                    step5.showTable();
                }
            }
        }
    };
    step5.changeLeadtimeName = () => {
        let date = new Date();
        date.setDate(date.getDate() + _ltCount);
        let dateStr = $.dateTime.dateToString(date, "dd/MM/yyyy");
        switch (_ltCount) {
            case 0:
                ltName.text("Đêm " + dateStr);
                break;
            case 1:
                ltName.text("Ngày " + dateStr);
                break;
            default:
                ltName.text("Cả ngày " + dateStr);
                break;
        }
    };
    step5.showTable = function () {
        $step5.find("[data-table-lt]").hide();
        $step5.find("[data-table-lt=" + _ltCount + "]").show();
        step5.changeLeadtimeName();
    };
    step5.getDataFromTables = function () {
        let dataList = [];
        $step5.find("[data-table-lt]").each(function (index, table) {
            dataInfo = {
                LeadTime: $(table).data("tableLt"),
                subVars: []
            }
            $(table).find("[data-point]").each(function (ix, point) {
                let pointItem = {
                    Name: $(point).data("point"),
                    subVars: []
                };
                $(point).find("[data-var]").each(function (idx, varItem) {
                    let item = {};
                    item.Name = $(varItem).data("var");
                    item.Value = $(varItem).val();
                    pointItem.subVars.push(item);
                });
                let weatherItem = {
                    Name: "T.tiết",
                    subVars: []
                };
                $(point).find("[data-var-weather]").each(function (idx, varItem) {
                    let item = {};
                    item.Name = $(varItem).data("varWeather");
                    item.Value = $(varItem).val();
                    weatherItem.subVars.push(item);
                });
                if (weatherItem.subVars.length > 0)
                    pointItem.subVars.push(weatherItem);
                dataInfo.subVars.push(pointItem);
            });
            dataList.push(dataInfo);
        });
        return dataList;
    };
    step5.preview = function () {
        step5._data = {
            BulletinId: bulletinDd.val(),
            ForcastUnit: department.val(),
            data: step5.getDataFromTables()
        };
        $.ajax({
            type: "post",
            url: "PointForeCast/PreviewReport",
            contentType: 'application/json; charset=utf-8',
            dataType: 'html',
            data: JSON.stringify(step5._data),
            success: function (response) {
                $previewMd.find(".modal-body").html(response);
                $previewMd.modal("show");
            },
            error: DBBB.error
        });
    };
    step5.onTestCbChange = function () {
        if (testCb.is(':checked')) {
            step5._data = {
                BulletinId: bulletinDd.val(),
                ForcastUnit: department.val(),
                data: step5.getDataFromTables()
            };
            App.postDownload('PointForeCast/CreateTestReport/', step5._data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Dự báo 10 ngày.xlsx");
            acceptCb.removeAttr('disabled');
        }
        else
            acceptCb.attr('disabled', 'disabled');
    };
    step5.onNext = function () {
        if (step5.validate()) {
            if (_ltCount < _ltLength - 1) {
                step5.increaseLeadTime();
                $step5.find("[id^=lt_]").removeClass('active');
                $step5.find("#lt_" + _ltCount).removeClass('disabled').addClass('active');
                step5.showTable();
                prevBb.hide();
                nextBb.text(_ltCount).show().fadeOut();
            }
            else {
                let dateStr = issueTimeDd.find("option:selected").text() + "" + $.dateTime.dateToString(new Date(), "dd/MM/yyyy");
                $createMd.find('[name=issue_time] ').val(dateStr);
                $createMd.find('[name=area]').val(areaDd.find("option:selected").text());
                $createMd.modal("toggle");
            }
        }
    };
    step5.increaseLeadTime = function () {
        _ltCount++;
        if (_maxLtCount < _ltCount)
            _maxLtCount = _ltCount;
    }
    step5.onPrev = function () {
        if (step5.validate()) {
            if (_ltCount > 0) {
                _ltCount--;
                $step5.find("[id^=lt_]").removeClass('active');
                $step5.find("#lt_" + _ltCount).removeClass('disabled').addClass('active');
                step5.showTable();
                nextBb.hide();
                prevBb.text(_ltCount).show().fadeOut();
            }
        }
    };
    step5.validate = function () {
        let lt = $(".pagination .active a").data("leadTime");
        isValid = true;
        $step5.find('[data-table-lt=' + lt + ']').find('input,select').each(function (index, value) {
            if (!$(value).val())
                isValid = false;
        });
        if (!isValid) {
            DBBB.alert("Vui lòng nhập đủ thông tin yêu cầu!");
            return false;
        }
        return true;
    };
    step5.loadContent = function (areaId) {
        $.ajax({
            type: 'get',
            url: '/PointForeCast/GetStep5Data',
            dataType: 'html',
            contentType: 'application/html; charset=utf-8',
            data: { Area_Id: areaId || 1 },
            success: function (result) {
                $step5Content.html(result);
                _ltCount = $(".pagination .active a").data("leadTime");
                step5.showTable();

                $.each($step5.find("[data-root]"), (index, ele) => {
                    let $rt = $(ele);
                    let page = Number($rt.data('root'));
                    $.each($rt.find("[data-var]"), (vIdx, vEle) => {
                        let $vEle = $(vEle);
                        let data = $vEle.data('var');
                        $vEle.on('change', () => {
                            $(`[data-table-lt=${page}]`).find(`[data-var='${data}']`).val($vEle.val());
                        });
                    });
                    $.each($rt.find("[data-var-weather]"), (vIdx, vEle) => {
                        let $vEle = $(vEle);
                        let data = $vEle.data('varWeather');
                        $vEle.on('change', () => {
                            $(`[data-table-lt=${page}]`).find(`[data-var-weather='${data}']`).val($vEle.val());
                        });
                    });
                });
            },
            error: DBBB.error
        });
    };
    //end handle step 5

    //handle step 6
    let ipTpl, _ipCtr, editEmailCb, emailLs, editIpCb, ipLs,
        ipWrapper, addIpBtn, subject, emailBody, sendMailBtn,
        _ipOrigin, _emailOrigin;
    step6.init = function () {
        $step6 = $("#step6");
        editEmailCb = $step6.find("[name=edit_emails]").on('change', step6.onMailCbChange);
        emailLs = $step6.find("[name=emails]");
        editIpCb = $step6.find("[name=edit_ips]").on("change", step6.onIpCbChange);
        ipLs = $step6.find("[name=ips]");
        ipTpl = $("#ip_tpl").html();
        ipWrapper = $step6.find(".ip-wrapper");
        addIpBtn = $step6.find(".add-ip").on("click", step6.addIp);
        subject = $step6.find("[name=email_subject]");
        emailBody = $step6.find("[name=email_body]");
        sendMailBtn = $step6.find(".send-mail").on("click", step6.send)
        _ipCtr = 0;
        step6.load();
    };
    step6.load = function () {
        $.get("/PointForecast/getEmailAndIPs")
            .done(function (response) {
                if (response.data.emails.length > 0) {
                    _emailOrigin = response.data.emails.map(function (item) {
                        return item.Email;
                    }).join("; ");
                    emailLs.val(_emailOrigin);
                }
                if (response.data.ips.length > 0) {
                    _ipOrigin = response.data.ips.map(function (item) {
                        return item.IP_Address;
                    }).join("; ");
                    ipLs.val(_ipOrigin);
                    ips = response.data.ips;
                }
            });
    };
    step6.send = function () {
        if (step6.validate()) {
            if ($('[name=edit_ips]').is(":checked")) {
                $('.ip-wrapper').find('.col-sm-11').each((idx, ele) => {
                    ips.push({
                        IP_Address: $(ele).find('[name=ip]').val(),
                        IP_Account: $(ele).find('[name=account]').val(),
                        IP_Pass: $(ele).find('[name=password]').val(),
                        FolderReceive: $(ele).find('[name=ip_path]').val()
                    });
                });
            }
            $.ajax({
                url: "/PointForecast/SendBulletinAsync",
                type: "post",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    emails: emailLs.val(),
                    ips: ips,
                    attachFilePath: _path,
                    operationForecast: _operationForecast
                }),
                success: function (response) {
                    if (response.success) {
                        if ((_ipOrigin !== ipLs.val() || _emailOrigin !== emailLs.val())) {
                            if (response.data.ipErr && response.data.ipErr.length > 0) {
                                DBBB.alert("Gửi file bản tin đến địa chỉ IP :" + response.data.ipErr.join(';') + " không gửi được !", step6.saveChangeAddress);
                            } else {
                                step6.saveChangeAddress();
                            }
                        } else {
                            private.increaseStep();
                            private.activeStep();
                            step7.show();
                        }
                    }
                    else
                        bootbox.alert(response.message);
                }
            });
        }
    };
    step6.saveChangeAddress = function(){
        DBBB.confirm("Gửi bản tin hoàn tất!\nBạn có bổ sung thêm địa chỉ email hoặc IP,\n để các địa chỉ này tiếp tục xuất hiện trong hệ thống trong các lần dự báo tiếp theo,\n bạn liên hệ với quản trị hệ thống để nhập các địa chỉ mới này vào CSDL",
            (ok) => {
                if (ok) {
                    let data = {
                        emails: emailLs.val(),
                        area_id: procedureConfigItem.Area_Id,
                        bulletin_id: procedureConfigItem.Bulletin_Id
                    };
                    $.ajax({
                        url: "/ReceiveEmail/SaveChangePointForecast",
                        method: 'post',
                        type: 'json',
                        data: data,
                        success: (xhr) => {
                            if (xhr.success) {

                            }
                        }
                    });
                }
                private.increaseStep();
                private.activeStep();
                step7.show();
            });
    }
    step6.validate = function () {
        let isValid = true;
        let emailArr = emailLs.val().split("; ");
        let errorEmails = [];
        $.each(emailArr, function (index, value) {
            value = value.trim();
            if (!step6.isEmail(value)) {
                isValid = false;
                if (value)
                    errorEmails.push(value);
            }
        });
        if (!isValid) {
            bootbox.alert("Lỗi địa chỉ email: " + errorEmails.join(",  "));
            return false;
        }
        else if (!subject.val()) {
            bootbox.alert("Vui lòng nhập tiêu đề email!");
            return false;
        }
        else if (!emailBody.val()) {
            bootbox.alert("Vui lòng nhập nội dung email!");
            return false;
        }
        ipWrapper.find("input").each(function (index, value) {
            if (!$(value).val())
                isValid = false;
        });
        if (!isValid && editIpCb.is(":checked")) {
            bootbox.alert("Vui lòng nhập đẩy đủ thông tin IP bổ sung");
            return false;
        }
        else if (!emailLs.val() && !ipLs.val()) {
            bootbox.alert("Không có địa chỉ nào được nhận bản tin!");
            return false;
        }
        let errorIpArr = [];
        let ipArr = ipLs.val().split("; ");
        isValid = true;
        $.each(ipArr, function (index, value) {
            value = value.trim();
            if (!step6.isIpAddress(value)) {
                isValid = false;
                if (value)
                    errorIpArr.push(value);
            }
        });
        if (!isValid) {
            bootbox.alert("Lỗi địa chỉ IP: " + errorIpArr.join(",  "));
            return false;
        }
        return true;
    };
    step6.isEmail = function (email) {
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    };
    step6.isIpAddress = function (ip) {
        var regex = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;
        return regex.test(ip);
    }
    step6.onMailCbChange = function () {
        step6.activeElement(emailLs, editEmailCb.is(":checked"));
    };
    step6.onIpCbChange = function () {
        if (editIpCb.is(":checked")) {
            step6.activeDiv(ipWrapper, true);
            addIpBtn.show();
        }
        else {
            step6.activeDiv(ipWrapper, false);
            addIpBtn.hide();
        }
    };
    step6.addIp = function () {
        let html = Mustache.to_html(ipTpl, { tpl_id: ++_ipCtr });
        ipWrapper.append(html);
        let group = ipWrapper.find("#ip_group_" + _ipCtr);
        let ip = group.find("[name=ip]").on('change', step6.refreshIp);
        ip.mask("099.099.099.099");
        group.find(".remove-ip").on('click', function () {
            let ips = ips.filter(ip => {
                return ip.IP_Address !== group.find('[name=id]').val();
            });
            $(this).parents("[id^=ip_group]").remove();
            step6.refreshIp();
        });
        group.find("[name=ip_path]").val(_path);
    };
    step6.refreshIp = function () {
        let newIp = _ipOrigin;
        ipWrapper.find("input[name=ip]").each(function (index, value) {
            if ($(value).val())
                newIp += "; " + $(value).val();
        });
        ipLs.val(newIp);
    };
    step6.activeDiv = function (div, isEnable) {
        if (isEnable)
            div.removeAttr('disabled')
        else
            div.attr("disabled", true)
    };
    step6.activeElement = function (element, isEnable) {
        if (isEnable)
            element.removeAttr("readonly");
        else
            element.attr("readonly", true);
    };
    //end handle step 6

    //handle step 7
    step7.init = function () {
        $step7 = $("#step7");
    };
    step7.show = function () {
        DBBB.confirm("Bạn đã hoàn tất việc thực hiện qui trình dự báo điểm,\n Bạn có muốn thoát khỏi giao diện hỗ trợ thực hiện qui trình dự báo điểm hay không?",
            function (ok) {
                if (ok) {
                    var Content = [];
                    var text_area = $(".step-content");
                    for (var i = 0; i < text_area.length; i++) {
                        Content.push({
                            Relseased_Id: released_id,
                            Step_Name: $(text_area[i]).attr("name"),
                            Step_Content: $(text_area[i]).val()
                        });
                    }
                    _operationForecast.pointForecastBackups = Content;
                    $.post("/PointForecast/FinishOperation", _operationForecast)
                        .done(function (response) {
                            private.exitTask();
                        });
                }
            });
    }
    //end handle step 7

    return public;
}();
$(document).ready(function () {
    ForecastPoint.init();
});