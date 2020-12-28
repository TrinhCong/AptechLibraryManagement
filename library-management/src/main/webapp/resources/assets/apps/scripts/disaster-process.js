var Cuongdo5cap = {
    0: "Rất yêu",
    1: "Yếu",
    2: "Trung bình",
    3: "Khá mạnh",
    4: "Mạnh",
    5: "Rất mạnh"
};
var Cuongdo4cap = {
    0: "Yếu",
    1: "Trung bình",
    3: "Khá mạnh",
    4: "Mạnh",
    5: "Rất mạnh"
}
var Cuongdo3cap = {
    0: "Yếu",
    1: "Trung bình",
    3: "Mạnh",
    5: "Rất mạnh"
}
var Phamvi5cap = {
    0: "Không ảnh hưởng",
    1: "Ít ảnh hưởng",
    2: "Có ảnh hưởng",
    3: "Ảnh hưởng một phần",
    4: "Ảnh hưởng nhiều",
    5: "Ảnh hưởng trực tiếp"
}
var Phamvi4cap = {
    0: "Không ảnh hưởng",
    1: "Có ảnh hưởng",
    3: "Ảnh hưởng một phần",
    4: "Ảnh hưởng nhiều",
    5: "Ảnh hưởng trực tiếp"
}
var Phamvi3cap = {
    0: "Không ảnh hưởng",
    1: "Có ảnh hưởng",
    3: "Ảnh hưởng nhiều",
    5: "Ảnh hưởng trực tiếp"
};

var DisasterProcess = (() => {
    let that = this;
    let $pageBody, $loginMd, $form, unit, fcter, unitId, fcterId, fcgroupDd, fcBullDd, typeDd, timeDd, $options, uCtr, rBull;
    let _procedure, _loginTime, $content,
        processName, unitTxt, fcTerTxt, fcBullTxt, pastTimes;
    let disasterDd, provinceDd, $DTM_R, $DTM_E, $DTM_H, $DTM_V, displayDd, $tableResult, $ctn_tableResult, $ctn_mapResult, $DefineName, tableResult,
        $DTF_Disaster, $DTF_CapDuBao, $DTF_Province, $tableRiskLv, tableRiskLv, riskControl;
    let sampleFile, sampleFileLoad, savePath, nameFileRules, fileName, _folderPath, _fileName, _cat1s, serverPath;
    let $container, $menuBar, $tabContent, $riskContainer, $riskFrm, $foreContaier, $foreFrm, $riskDetermine, $bulletinProvider,
        $pagination;
    let stepImgRender = {}, start_time, end_time, send_time, issue_time, procedure_id, district_geom;
    let _previous_id, _next_id, totalStep1First = 0, idx1, UpdateTotal = 0;
    let map, RemoteRiskData = {}, Remote_layer = [], Caculate_layer = [], step3Values = [], downLoadBullFile = {}, simpleMapScreenshoter, send_email;
    let root = {
        init() {
            $pageBody = $(".page-content-body").hide();
            $loginMd = $('#login-modal');
            $form = $loginMd.find("form");
            $container = $("#step-container");
            $menuBar = $container.find(".step-nav-tabs");
            $tabContent = $container.find(".tab-content");

            unitId = $form.find("[name=office_id]");
            unit = $form.find("[name=department]");
            fcterId = $form.find("[name=forecaster_id]");
            fcter = $form.find("[name=forecaster]");
            fcgroupDd = $form.find("[name=foregroup_id]").on('change', root.onFcgroupDdChange);
            fcBullDd = $form.find("[name=forebulletin_id]").on('change', root.onFcBullDdChange);
            timeDd = $form.find("[name=issue_times]").on('change', root.onIssueTimeDdChange);
            typeDd = $form.find("[name=action_type]").on('change', root.onTypeDdChange);
            uCtr = $form.find("[name=update_count]");
            rBull = $form.find("[name=related_bulletin]").on('change', (e) => {
                var $opt = $(e.target).find("option:selected");
                uCtr.val($opt.data("update"));
            });
            $options = $form.find(".update-options");

            $.get('/DisasterBulletin/GetGroups').done(groups => {
                fcgroupDd.empty();
                if (groups.length > 0) {
                    $.each(groups, (i, group) => {
                        fcgroupDd.append($("<option />").val(group.ForeGroup_Id).text(group.ForeGroup_Name));
                    });
                    fcgroupDd.val(groups[0].ForeGroup_Id);
                    fcgroupDd.trigger("change");
                }
            });

            $loginMd.find("[data-dismiss]").on('click', root.exitTask);
            $loginMd.find(".continue").on('click', root.continue);

            root.showLoginModal();
            $content = $("#content");
            processName = $content.find(".process_name");
            unitTxt = $content.find(".unit_txt");
            fcTerTxt = $content.find(".fcTer_txt");
            fcBullTxt = $content.find(".fcBull_txt");
            pastTimes = $content.find(".past_times");
            $content.find(".btn-watch").on('click', () => {
                root.LoadAvailableDocument(pastTimes.find("option:selected"));
            });

            $content.find("[name=update_time]").datetimepicker({
                format: "dd/mm/yyyy HH:00p",
                rtl: App.isRTL(),
                orientation: "left",
                autoclose: true,
                minView: 1,
                language: 'vi'
            });

            root.initLoading();
        },
        onTypeDdChange() {
            if (timeDd.val() != null)
                root.onIssueTimeDdChange();
            if (typeDd.val() == 1)
                $options.hide();
            else
                $options.show();
        },
        onIssueTimeDdChange() {
            if (typeDd.val() != 1) {
                $.get("/DisasterProcess/GetProcedure", { timeId: timeDd.val() }).done(procedure => {
                    if (procedure) {
                        $.get("/MonitorProcedure/GetReleased", { procedure_id: procedure.Procedure_Id, office_id: unitId.val() }).done((xhr) => {
                            rBull.empty();
                            for (var i = 0; i < xhr.length; i++) {
                                rBull.append(`<option value="${xhr[i].Id}" data-profile="${xhr[i].Profile_Name}" data-update="${xhr[i].Update_Total}" data-path="${xhr[i].File_Path}" data-name="${xhr[i].File_Name}">${xhr[i].Bulletin_Issue_Format}</option>`);
                                if (i === 0)
                                    uCtr.val(xhr[i].Update_Total);
                            }
                        });
                    }
                })
            }
        },
        onFcBullDdChange() {
            $.get("/DisasterForecast/GetTimeConfigs", { bulletinId: fcBullDd.val() }).done(times => {
                timeDd.empty();
                $.each(times, (index, time) => {
                    var date = time.ForeBulletin_Date == "-9999" ? "*" : time.ForeBulletin_Date;
                    var month = time.ForeBulletin_Month == "-9999" ? "*" : time.ForeBulletin_Month;
                    var year = time.ForeBulletin_Year == "-9999" ? "*" : time.ForeBulletin_Year;
                    timeDd.append($("<option />").val(time.ForeBulletin_Time_Id).text(`Giờ: ${time.Issue_Hour} - Ngày/Tháng/Năm: ${date}/${month}/${year}`));
                });
            });
        },
        continue() {
            _procedure = {
                Forecaster_Id: fcterId.val(),
                Office_Id: unitId.val(),
                Bulletin_Id: fcBullDd.val(),
                Login_Time: _loginTime,
                Procedure_Start: new Date()
            };

            if (typeDd.val() == 2) {
                _procedure.Bulletin_Update = uCtr.val();
                if (!rBull.val()) {
                    DBBB.alert("Chưa có bản tin đã phát hành nào! Vui lòng chọn tác vụ tạo mới và nhấn tiếp tục!");
                    return;
                }
            }
            $.get("/DisasterProcess/GetProcedure", { timeId: timeDd.val() }).done(procedure => {
                if (procedure) {
                    processName.text(procedure.Procedure_Name);
                    procedure_id = procedure.Procedure_Id;
                    if (procedure.ForeBulletin_Admin != null) {
                        that.ForeBulletin_Admin = procedure.ForeBulletin_Admin;
                        if (procedure.ForeBulletin_Admin.File_Path != "") {
                            savePath = root.ConvertSavePath(procedure.ForeBulletin_Admin.File_Path.split("/"));
                        }

                        nameFileRules = procedure.ForeBulletin_Admin.File_Name;
                    } else {
                        savePath = "";
                        nameFileRules = "";
                        sampleFile = "";
                    }
                    $.get("/MonitorProcedure/GetReleased", { procedure_id: procedure_id, office_id: unitId.val() }).done((xhr) => {
                        pastTimes.empty();
                        for (var i = 0; i < xhr.length; i++)
                            pastTimes.append(`<option value="${xhr[i].Id}" data-path="${xhr[i].File_Path}" data-name="${xhr[i].File_Name}">${xhr[i].Bulletin_Issue_Format}</option>`)
                    });
                }
            });
            unitTxt.text(unit.val());
            fcTerTxt.text(fcter.val());
            fcBullTxt.text(root.getText(fcBullDd, fcBullDd.val()));
            if (typeDd.val() == 2) {
                UpdateTotal = rBull.find("option:selected").data("update") + 1;
                root.loadCatProcedure();
            } else {
                root.loadCatProcedure();
            }
            $loginMd.modal("hide");
        },
        loadCatProcedure() {
            $.get("/DisasterProcess/GetCatProcedures?timeId=" + timeDd.val()).done(cat1s => {
                if (cat1s.length > 0) {
                    $.get("/DisasterProcess/GetCatProceduresGuiFlag?timeId=" + timeDd.val()).done(cat1sGui => {
                        start_time = new Date();
                        $pageBody.show();
                        root.loadProcedureSteps(cat1s, true);
                        root.riskDetermination();
                        root.loadProcedureSteps(cat1sGui, false);
                        root.BulletinProvider(cat1sGui.length);
                        if (typeDd.val() == 2)
                            root.LoadAvailableDocument(rBull.find("option:selected"));
                        root.BindEventPagination();
                        root.HandelPaginationStep();
                        root.foreDetermination();
                        root.LoadTableRiskLevel();
                        root.CreateMapResult();
                    });
                    root.GetAllCateProcedure();
                }
                else {
                    DBBB.alert("Chưa có dữ liệu các bước thực hiện quy trình này!", () => {
                        location.reload(true);
                    });
                }
            });
        },
        loadProcedureSteps(data, empty) {
            if (empty) {
                $menuBar.empty();
                $tabContent.empty();
            }
            data.forEach((cat1, idx) => {
                let tab = "";
                idx1 = idx + totalStep1First;
                if (idx1 === 0 && empty)
                    tab += `<li class="step-item item-1-${idx1} active"><a data-toggle="tab" href="#cat1_${cat1.Cate1_Step_Id}">${cat1.Step1_Name}</a></li>`;
                else
                    tab += `<li class="step-item item-1-${idx1}"><a data-toggle="tab" href="#cat1_${cat1.Cate1_Step_Id}">${cat1.Step1_Name}</a></li>`;
                $menuBar.append(tab);

                tab = "";
                let active = idx1 === 0 ? " in active" : "";
                tab += `<div id="cat1_${cat1.Cate1_Step_Id}" class="tab-pane fade ${active}">
                            <div class="step-sidebar-wrapper">
                                <div class="step-sidebar">
                                    <ul class="step-sidebar-menu">
                                        ${(() => {
                        let li = "";
                        $.each(cat1.cat2s, (idx, cat2) => {
                            let active = idx === 0 ? "active" : "";
                            li += `<li class="step-item item-2-${idx} ${active}">
                                                            <a data-toggle="tab" class="step-3" href="#cat3_${cat2.Cate2_Step_Id}" data-step1=".${cat2.Cate1_Step_Id}">
                                                                <i class="fa fa-forward"></i>
                                                                <span class="title">${cat2.Step2_Name}</span>
                                                            </a>
                                                        </li>`;
                        });
                        return li;
                    })()}
                                                        </ul>
                                </div>
                            </div>
                                 <div class="tab-content-cat3 tab-content">
                                 ${(() => {
                        let step_content_3 = ``;
                        cat1.cat2s.forEach((cat2, idx2) => {
                            var previous_type_step, next_type_step, step_previous, step_next;
                            if (cat2.Cate1_Step_Id == cat1.Cate1_Step_Id) {
                                let active3 = idx2 === 0 ? " in active" : "";
                                let index_title = idx2 + 1;

                                if (idx2 == 0) {
                                    previous_type_step = EnumStep.First;
                                    next_type_step = EnumStep.Normal;

                                    _previous_id = idx1 - 1;
                                    _next_id = idx2 + 1;
                                    step_previous = `item-1-${_previous_id}`;
                                    step_next = `item-2-${_next_id}`;
                                } else if (idx2 == (cat1.cat2s.length - 1)) {
                                    previous_type_step = EnumStep.Normal;
                                    next_type_step = EnumStep.Last;

                                    _previous_id = idx2 - 1;
                                    _next_id = idx1 + 1;

                                    step_previous = `item-2-${_previous_id}`;
                                    step_next = `item-1-${_next_id}`;
                                } else {
                                    previous_type_step = EnumStep.Normal;
                                    next_type_step = EnumStep.Normal;

                                    _previous_id = idx2 - 1;
                                    _next_id = idx2 + 1;

                                    step_previous = `item-2-${_previous_id}`;
                                    step_next = `item-2-${_next_id}`;
                                }

                                if (idx1 === 0 && idx2 === 0) {
                                    step_previous = ``;
                                    previous_type_step = EnumStep.Start;

                                }
                                if (idx1 == (data.length - 1) && idx2 == (cat1.cat2s.length - 1)) {
                                    _previous_id = idx1;
                                    _next_id = idx1 + 1;

                                    totalStep1First = data.length;

                                    step_next = `item-1-${_next_id}`;
                                    next_type_step = EnumStep.Last;
                                }
                                if (data.length == 1 && idx2 == (cat1.cat2s.length - 1)) {
                                    _previous_id = idx1;
                                    _next_id = idx1 + 1;

                                    previous_type_step = EnumStep.Last;

                                    step_next = `item-1-${_next_id}`;
                                    next_type_step = EnumStep.Last;
                                }

                                step_content_3 += `<div class="step-content-wrapper remote tab-pane-step3 ${cat2.Cate1_Step_Id} tab-pane fade ${active3}" id="cat3_${cat2.Cate2_Step_Id}">
                                                    <div class="step-content-body portlet light bordered">
                                  ${(() => {
                                        let step_content_3 = `<div class="step-content">`;
                                        cat2.cat3s.forEach((cat3, idx3) => {
                                            let index = idx3 + 1;
                                            step_content_3 += `<div class="title-step3" data-name-step="${cat3.Step3_Name}" title="${cat3.Step3_Tips}">
                                                                                       <div style="float:left;margin-bottom:10px;">
                                                                                            <b style="font-weight:600;display:inline-block;margin-top:1px;">${index_title}.${index} ${cat3.Step3_Name}</b>
                                                                                        </div>`;
                                            if (cat3.Step3_Type == EnumStepType.All || cat3.Step3_Type == EnumStepType.Check) {
                                                step_content_3 += `<div style="float:left;" title="${cat3.Step3_Tips}">
                                                                                            <input type="checkbox" class="checkbox-cat3" data-parent-id="${cat3.Cate2_Step_Id}" style="margin-left:7px;" name="check-cat3-${cat3.Cate3_Step_Id}">
                                                                                        </div>`;
                                            }
                                            step_content_3 += `</div>`
                                            if (cat3.Step3_Type == EnumStepType.All || cat3.Step3_Type == EnumStepType.Text) {
                                                step_content_3 += `<div class="input-step" title="${cat3.Step3_Tips}">
                                                                                    <textarea class="form-control value-step3 action-${cat3.Step3_Action_Format}" data-parent-id="${cat3.Cate2_Step_Id}" data-position="${cat3.Step3_Action}" col="30" row="3" name="input-cat3-${cat3.Cate3_Step_Id}"></textarea>
                                                                                    </div>`;
                                            }
                                        });
                                        step_content_3 += `</div>`;
                                        return step_content_3;
                                    })()}
                                            <div class="pagination-step pagination-remote">
                                                    <div class="previous-step col-md-6"><button name="previous-step" class="btn btn-info pull-left" data-type="previous" data-status="${previous_type_step}" data-step="${step_previous}"><span class="glyphicon glyphicon-chevron-left"></span> Quay lại</button></div>
                                                    <div class="next-step col-md-6"><button name="next-step" class="btn btn-info pull-right" data-type="next" data-status="${next_type_step}" data-step="${step_next}">Tiếp tục <span class="glyphicon glyphicon-chevron-right"></span></button></div>
                                                    </div>
                                                    </div>
                                               </div>`
                            }
                        });
                        return step_content_3;
                    })()
                    }
                            </div>
                        </div>`;

                $tabContent.append(tab);
                root.bindResponsive($tabContent.find(".step-sidebar-wrapper"), $tabContent.find(".step-content-wrapper.remote"), $tabContent.find(".pagination-remote"));

            });
            $(".step-3").on("click", function () {
                var id_content = $(this).attr("href");
                var id_step_1 = $(this).data("step1");
                $tabContent.find(".tab-pane-step3" + id_step_1).removeClass("in");
                $tabContent.find(".tab-pane-step3" + id_step_1).removeClass("active");
                $tabContent.find(id_content + id_step_1).addClass("in");
                $tabContent.find(id_content + id_step_1).addClass("active");
            });
        },
        bindResponsive($sideBar, $subContent, $pagination) {
            let $win = $(window);
            $win.on('resize', () => {
                let height = $win.height() - 233;
                let width = $win.width() - 2;
                $sideBar.height(height);
                $sideBar.css({
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden'
                });
                $subContent.css({
                    width: width - $sideBar.width() + "px",
                    height: height + "px"
                });
                if ($pagination) {
                    $pagination.css({
                        width: width - 332,
                        bottom: 0
                    });
                    if (width < 1425) {
                        $pagination.css({
                            "bottom": "29px"
                        });
                    }

                    if (width < 1223) {
                        $pagination.css({
                            "bottom": "60px"
                        });
                    }
                }
                $subContent.find(".step-content-body").height(height - 35);
            });
            $sideBar.find("ul li a").on("click", (e) => {
                e.preventDefault();
                $sideBar.find("li").removeClass("active");
                let $li = $(e.target).parents("li");
                $li.addClass("active");
            });
            $win.trigger('resize');
        },
        getText(dd, val) {
            let text = "";
            $.each(dd.find('option'), (idx, opt) => {
                if ($(opt).val() === val)
                    text = $(opt).text();
            });
            return text;
        },
        onFcgroupDdChange() {
            $.get("/Disaster/Process/Bulletins", { groupId: fcgroupDd.val() }).done(xhr => {
                fcBullDd.empty();
                if (xhr.length > 0) {
                    $.each(xhr, (i, bulletin) => {
                        fcBullDd.append($("<option />").val(bulletin.ForeBulletin_Id).text(bulletin.ForeBulletin_Name));
                    });
                    fcBullDd.val(xhr[0].ForeBulletin_Id);
                    fcBullDd.trigger("change");
                }
            });
        },
        showLoginModal() {
            $loginMd.modal('show');
            _loginTime = new Date();
        },
        initLoading() {
            $(document).ajaxStart(function () {
                App.startPageLoading();
            });
            $(document).ajaxComplete(function () {
                App.stopPageLoading();
            });
        },
        exitTask() {
            $(location).attr("href", "/DisasterForecast");
        },
        riskDetermination() {
            var previous_id = _previous_id;
            var id_step = idx1 + 1;
            totalStep1First++;
            stepImgRender.position = "RMAP";

            $menuBar.append(`<li class="step-item item-1-${id_step}"><a data-toggle="tab" href="#determined_risk">Xác định cấp độ rủi ro</a></li>`);
            $riskDetermine = $(`<div id="determined_risk" class="tab-pane fade ">
                            <div class="step-control-container">
                                <div class="step-sidebar">
                                    <ul class="step-sidebar-menu">
                                        ${$("#risk-determined-control").html()}
                                    </ul>
                                </div>
                            </div>
                            <div class="step-content-wrapper">
                                <div class="step-content">
                                    <div class="step-content-body portlet light bordered">
                                        <div class="portlet-title">
                                            <div class="caption">
                                                <span class="caption-subject font-green-sharp bold uppercase">&nbsp;</span>
                                            </div>
                                        </div>
                                        <div class="portlet-body">
                                             ${$("#risk-determined-content").html()}
                                        </div>
                                            <div class="pagination-step">
                                                    <div class="previous-step col-md-6"><button name="previous-step" class="btn btn-info pull-left" data-type="previous" data-status="${EnumStep.First}" data-step="item-1-${previous_id}"><span class="glyphicon glyphicon-chevron-left"></span> Quay lại</button></div>
                                                    <div class="next-step col-md-6"><button name="next-step" class="btn btn-info pull-right" data-type="next" data-status="${EnumStep.Last}" data-step="item-1-${totalStep1First}">Tiếp tục <span class="glyphicon glyphicon-chevron-right"></span></button></div>
                                            </div>
                                                    </div>
                                               </div>
                                    </div>
                                </div>
                            </div>
                        </div>`).appendTo($tabContent);
            root.bindResponsive($riskDetermine.find(".step-control-container"), $riskDetermine.find(".step-content-wrapper"), null);
            //
            $tableResult = $("#table-result");
            $ctn_tableResult = $riskDetermine.find(".ctn-table-result");
            $ctn_mapResult = $riskDetermine.find(".ctn-map-result");
            $riskDetermine.find(".export-risk-avaiable").on("click", root.ExportRiskAvaiable);

            //
            root.availabelRisk();
            root.foreDetermination();
            //
            $.each($riskDetermine.find("li.control-tab"), (idx, ele) => {
                $(ele).on('click', () => {
                    $riskDetermine.find("li.control-tab").removeClass("active");
                    $riskContainer.hide();
                    $foreContaier.hide();
                    $(ele).addClass("active");
                    if ($(ele).data('toggle') === $riskContainer.attr('id'))
                        $riskContainer.show();
                    else
                        $foreContaier.show();
                });
            });
        },
        BulletinProvider(cat1GuiLength) {
            var previous_id = cat1GuiLength == 0 ? idx1 + 1 : idx1;
            var id_step = cat1GuiLength == 0 ? totalStep1First : idx1 + 1;
            $menuBar.append(`<li class="step-item item-1-${id_step} provider"><a data-toggle="tab" href="#bulletin_provider">Cung cấp bản tin</a></li>`);
            $bulletinProvider = $(`<div id="bulletin_provider" class="tab-pane fade ">
                            <div class="step-control-container">
                                <div class="step-sidebar">
                                        ${$("#container-bulletin-provider").html()}
                                </div>
                            </div>
                            <div class="step-content-wrapper">
                                <div class="step-content">
                                    <div class="step-content-body portlet light bordered">
                                        <div class="portlet-body">
                                             ${$("#content-bulletin-provider").html()}
                                        </div>
                                            <div class="pagination-step">
                                                    <div class="previous-step col-md-6"><button name="previous-step" class="btn btn-info pull-left" data-type="previous" data-status="${EnumStep.First}" data-step="item-1-${previous_id}"><span class="glyphicon glyphicon-chevron-left"></span> Quay lại</button></div>
                                                    <div class="next-step col-md-6"><button name="end-step" disabled class="btn btn-info pull-right" data-type="next" data-status="" data-step="">Kết thúc <span class="glyphicon glyphicon-chevron-right"></span></button></div>
                                                </div>
                                    </div>
                                </div>
                            </div>
                        </div>`).appendTo($tabContent);
            root.bindResponsive($bulletinProvider.find(".step-control-container"), $bulletinProvider.find(".step-content-wrapper"), null);
            $DefineName = $bulletinProvider.find("[name=name_file_define]");
            $bulletinProvider.find("[name=confirm-content]").on("click", () => {
                DBBB.confirm("Xác nhận tên và nội dung văn bản vừa tạo là bản tin là bản tin cuối ??",
                    (ok) => {
                        if (ok) {
                            root.SaveDocument();
                        }
                    });
            });
            $bulletinProvider.find("[name=end-step]").on("click", () => {
                DBBB.confirm("Bạn có chắc chắn muốn kết thúc quy trình thực hiện bản tin dự báo ?", (result) => {
                    if (result) {
                        end_time = new Date();
                        var id_released = typeDd.val() == 2 ? rBull.find("option:selected").val() : 0;
                        var bullProfile = {
                            procedure_name: fcBullTxt.text(),
                            user_name: fcter.val(),
                            office_name: unit.val(),
                            office_id: unitId.val(),
                            start_time: $.dateTime.dateToString(start_time, "HHhmm dd-MM-yyyy"),
                            end_time: $.dateTime.dateToString(end_time, "HHhmm dd-MM-yyyy"),
                            send_time: $.dateTime.dateToString(send_time, "HHhmm dd-MM-yyyy"),
                            issue_time: $.dateTime.dateToString(issue_time, "HHhmm dd-MM-yyyy"),
                            emails: send_email,
                            bulletin_file_name: _fileName,
                            cat1s: [],
                        };
                        var released = {
                            Id: id_released,
                            User_Id: fcterId.val(),
                            start_time: $.dateTime.dateToString(start_time, "HHhmm dd-MM-yyyy"),
                            end_time: $.dateTime.dateToString(end_time, "HHhmm dd-MM-yyyy"),
                            issue_time: $.dateTime.dateToString(issue_time, "HHhmm dd-MM-yyyy"),
                            send_time: $.dateTime.dateToString(send_time, "HHhmm dd-MM-yyyy"),
                            Procedure_Id: procedure_id,
                            File_Path: _folderPath,
                            File_Name: _fileName,
                            Bulletin_Name: processName.text(),
                            Bulletin_Id: fcBullDd.val(),
                            Update_Total: UpdateTotal
                        };
                        var oItem = {
                            released_Disaster: released,
                            step3Values: step3Values,
                            BulletinProfile: bullProfile
                        };

                        $.ajax({
                            url: "/DisasterProcess/CreateReleased",
                            type: "post",
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            data: JSON.stringify(oItem),
                            success(xhr) {
                                if (xhr.success) {
                                    location.reload();
                                }
                            },
                            error: DBBB.error
                        });
                        //$.post("/DisasterProcess/CreateReleased", oItem).done(xhr => {
                        //    if (xhr.success) {
                        //        location.reload();
                        //    }
                        //});
                    }
                });
            });
            $bulletinProvider.find("[name=send-email]").on("click", root.sendEmail);
            $bulletinProvider.find("[name=create-doc]").on("click", root.DocumentFileCreate);

        },
        DocumentFileCreate() {
            step3Values = [];
            $tabContent.find(".value-step3").each((idx, ele) => {
                var input_checkbox = $(ele).parent().parent(".step-content").find(".checkbox-cat3");
                step3Values.push({
                    value: $(ele).val(),
                    position: $(ele).data("position") == undefined ? "" : $(ele).data("position"),
                    visible: input_checkbox.is(":checked"),
                    parent_id: $(ele).data("parent-id") == undefined ? input_checkbox.is(":checked") : $(ele).data("parent-id"),
                    cat3_Name: $(ele).parent().parent(".step-content").find(".title-step3").data("name-step")
                });
            });
            $.post("/DisasterProcess/DocumentFileCreate", {
                step3Values: step3Values,
                stepImgRender: stepImgRender,
                office_id: unitId.val(),
                bulletin_id: that.ForeBulletin_Admin.ForeBulletin_Id
            }).done((xhr) => {
                if (xhr.success) {
                    fileName = xhr.data.name_create;
                    var googleDocs = "https://docs.google.com/gview?url=" + _baseUrl;
                    var iframe = `<iframe style="width:100%;height:400px;" class="doc" src="${googleDocs}/${xhr.data.folder_create}/${xhr.data.name_create}&embedded=true"></iframe>`;
                    $bulletinProvider.find(".ctn-btn-iframe").empty();
                    $bulletinProvider.find(".ctn-btn-iframe").append(iframe);
                    $bulletinProvider.find("[name=confirm-content]").prop('disabled', false);
                    $DefineName.prop('disabled', false);
                    $DefineName.val(root.getFileNameRules(nameFileRules.split("%")));

                    downLoadBullFile.WebHostRoot = true;
                    downLoadBullFile.path = xhr.data.folder_create;
                    downLoadBullFile.file_name = xhr.data.name_create;

                    $bulletinProvider.find("[name=download-bulletin-file]").prop('disabled', false);
                    $bulletinProvider.find("[name=download-bulletin-file]").on("click", () => {
                        App.postDownload("/DisasterProcess/DownloadBulletinFile", downLoadBullFile, null, downLoadBullFile.file_name);
                    });
                    serverPath = xhr.data.folder_create;
                } else {
                    DBBB.alert(xhr.message);
                }

            });
        },
        SaveDocument() {
            var oldFilePath;
            if (typeDd.val() == 2) {
                oldFilePath = rBull.find("option:selected").data("path") == "" ? rBull.find("option:selected").data("name") : rBull.find("option:selected").data("path") + "\\" + rBull.find("option:selected").data("name");
            }
            $.post("/DisasterProcess/DocumentSave", {
                savePath: savePath,
                saveFile: fileName,
                fileName: $DefineName.val() == "" ? nameFileRules : $DefineName.val(),
                oldFilePath: oldFilePath,
                updateTotal: UpdateTotal,
                serverPath: serverPath
            }).done(xhr => {
                if (xhr.success) {
                    _folderPath = xhr.data.savePath;
                    _fileName = xhr.data.nameFileBulletin;
                    root.getEmails();
                    $bulletinProvider.find("textarea").prop('disabled', false);
                    $bulletinProvider.find("input").prop('disabled', false);
                    $bulletinProvider.find("[name=create-doc]").prop('disabled', true);
                    $bulletinProvider.find("[name=confirm-content]").prop('disabled', true);
                    $bulletinProvider.find("[name=previous-step]").remove();
                    $container.find("li").addClass("step-item");
                    $container.find(".provider").removeClass("step-item");
                    downLoadBullFile.WebHostRoot = false;
                    downLoadBullFile.path = savePath;
                    downLoadBullFile.file_name = xhr.data.nameFileBulletin;
                    issue_time = new Date();
                }
                DBBB.alert(xhr.message);
            });
        },
        BindEventPagination() {
            $tabContent.find(".pagination-step").find("button").on("click", root.HandelPaginationStep);
        },
        HandelPaginationStep(e) {
            var type, step_id, status;
            var $ele = e ? $(e.target) : null;
            if ($ele) {
                type = $ele.data("type") == undefined ? "" : $ele.data("type");
                step_id = $ele.data("step") == undefined ? "" : $ele.data("step");
                status = $ele.data("status") == undefined ? "" : $ele.data("status");
                root.PaginationAction(type, step_id, status);
            }
        },
        PaginationAction(type, step_id, status) {
            if (status === EnumStep.Normal) {
                var step2_previous = $tabContent.find(".tab-pane.active").find("li.active");
                step2_previous.removeClass("step-item");
                step2_previous.removeClass("active");

                var step_2_next = $tabContent.find(".tab-pane.active").find(`.${step_id}`);
                var tab_pane = $(step_2_next.find(`a`).attr("href"));

                $tabContent.find(".tab-pane.active").find(".step-content-wrapper").removeClass("in");
                $tabContent.find(".tab-pane.active").find(".step-content-wrapper").removeClass("active");

                step_2_next.addClass("active");
                step_2_next.removeClass("step-item");
                tab_pane.addClass("in");
                tab_pane.addClass("active");

            } else if (status === EnumStep.Last || status === EnumStep.First) {
                var step1_previous = $container.find(".step-nav-tabs").find("li.active");
                step1_previous.removeClass("active");
                step1_previous.removeClass("step-item");

                var step2_previous = $tabContent.find(".tab-pane.active").find("li.active");
                step2_previous.removeClass("step-item");

                var step_1_next = $container.find(".step-nav-tabs").find(`.${step_id}`);
                var tab_pane_step1 = $(step_1_next.find("a").attr("href"));

                $tabContent.find(".tab-pane").removeClass("active");
                $tabContent.find(".tab-pane").removeClass("in");

                step_1_next.addClass("active");
                step_1_next.removeClass("step-item");
                tab_pane_step1.addClass("in");
                tab_pane_step1.addClass("active");
                if (status === EnumStep.Last) {
                    var step_2_fisrt = tab_pane_step1.find("li:first-child");
                    step_2_fisrt.addClass("active");
                    var tab_pane_step2 = $(step_2_fisrt.find("a").attr("href"));
                    step_2_fisrt.removeClass("step-item");
                } else if (status === EnumStep.First) {
                    var step_2_last = tab_pane_step1.find("li:last-child");
                    var tab_pane_step2 = $(step_2_last.find("a").attr("href"));
                    step_2_last.removeClass("step-item");
                }
                tab_pane_step2.addClass("in");
                tab_pane_step2.addClass("active");
            }
        },
        HandlerResultTable() {
            if (paramMs.val() === null) {
                DBBB.alert("Vui lòng chọn ít nhất một đại lượng cần xem !");
                return;
            }
            var columns = [{
                title: "Huyện/Thành phố/Thị xã",
                data: "District",
                render(data, type, row, meta) {
                    return data ? data.Name_vn : "";
                }
            }];
            paramMs.val().filter(x => {
                columns.push({
                    title: x,
                    data: x
                });
            });
            var dailuong = paramMs.val().join(", ");
            $ctn_tableResult.show();
            $ctn_mapResult.hide();
            //title
            var khuvuc = provinceDd.val() == -1 ? "ĐỒNG BẰNG BẮC BỘ" : provinceDd.find("option:selected").text();
            $riskDetermine.find(".caption-subject").text("Số liệu tính toán " + dailuong.substr(0, dailuong.length - 1) + " cho " + disasterDd.find("option:selected").text() + " trên khu vực " + khuvuc + " dựa trên số liệu đã qua");
            //
            if ($.fn.dataTable.isDataTable("#table-result")) {
                tableResult.DataTable().destroy();
                $('#table-result').empty();
            }
            root.LoadTableResult(columns);
        },
        LoadTableResult(columns, fnComplete) {
            tableResult = $tableResult.dataTable({
                "processing": true,
                "serverSide": true,
                "filter": false,
                "ordering": false,
                "datatype": "json",
                "ajax": {
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    url: "/DisasterProcess/getListRisk",
                    data: function (d) {
                        d.region = {
                            province_id: provinceDd.val()
                        };
                        d.param = {
                            id_disaster: disasterDd.val()
                        };
                        return JSON.stringify(d);
                    }
                },
                // Internationalisation. For more info refer to http://datatables.net/manual/i18n
                "language": {
                    url: '/static/translate/vi.json'
                },
                "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.
                "bLengthChange": false,
                "lengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "Tất cả"] // change per page values here
                ],
                // set the initial value
                "pageLength": 5,
                "pagingType": "bootstrap_full_number",
                "columns": columns,
                "fnInitComplete": fnComplete
            });
        },
        HandlerResultMap() {
            if (paramMs.val() === null) {
                DBBB.alert("Vui lòng chọn ít nhất một đại lượng cần xem !");
                return;
            }
            $ctn_tableResult.hide();
            $ctn_mapResult.show();
            var innerHtml = paramMs.val().map(x => `<li class="${x} item-risk"><a href="#" data-field="${x}">${x}</a></li>`).join(" ");
            var dailuong = paramMs.val().join(", ");

            //Add control risk avaiable
            riskControl = L.Control.extend({
                options: {
                    position: 'topright'
                },
                onAdd: function (map) {
                    $(".leaflet-top.leaflet-right").find(".pagination-map").remove();
                    var pagination = L.DomUtil.create('ul', 'pagination pagination-map');
                    $(pagination).append(innerHtml);
                    return pagination;
                }
            });
            map.addControl(new riskControl());
            //Chú thích
            root.AddMaplegend(disasterDd.val(), true);
            $.each($ctn_mapResult.find("li.item-risk"), (idx, ele) => {
                $(ele).on("click", () => {
                    $(".pagination-map>li.active").removeClass("active");
                    $(ele).addClass("active");
                    if ($(ele).find("a").data("field") == "R") {
                        $(".leaflet-bottom.leaflet-right").find(".ul_R").removeClass("hidden");
                        $(".leaflet-bottom.leaflet-right").find(".ul_EHV").addClass("hidden");
                    } else {
                        $(".leaflet-bottom.leaflet-right").find(".ul_R").addClass("hidden");
                        $(".leaflet-bottom.leaflet-right").find(".ul_EHV").removeClass("hidden");
                    }
                    root.ChangeFeatureGroup($(ele).find("a").data("field"), RemoteRiskData);
                });
            });

            root.LoadMapResult(provinceDd.val(), disasterDd.val());
            //title
            var khuvuc = provinceDd.val() == -1 ? "ĐỒNG BẰNG BẮC BỘ" : provinceDd.find("option:selected").text();
            $riskDetermine.find(".caption-subject").text("Bản đồ tính toán " + dailuong.substr(0, dailuong.length - 1) + " cho " + disasterDd.find("option:selected").text() + " trên khu vực " + khuvuc + " dựa trên số liệu đã qua");

        },
        ChangeFeatureGroup(riskType) {
            root.RemoveLayer(Remote_layer);
            root.RemoveLayer(Caculate_layer);
            Remote_layer = [];
            if (RemoteRiskData.length) {

                //add Layer
                var risk_value;
                var colors = RemoteRiskData[0].Disaster.risk_color.split(";");
                var risk_cate = RemoteRiskData[0].Disaster.risk_cate.split(";");

                for (var i = 0; i < RemoteRiskData.length; i++) {
                    var color;
                    if (riskType == EnumRiskType.R)
                        risk_value = RemoteRiskData[i].R;
                    else if (riskType == EnumRiskType.E)
                        risk_value = RemoteRiskData[i].E;
                    else if (riskType == EnumRiskType.V)
                        risk_value = RemoteRiskData[i].V;
                    else if (riskType == EnumRiskType.H)
                        risk_value = RemoteRiskData[i].H;
                    else
                        risk_value = RemoteRiskData[i].R;
                    try {
                        color = colors[risk_cate.indexOf(risk_value.toString())].split(" ");
                    } catch (err) {
                        color = ["255", "255", "255", "0"];
                    }
                    root.AddMapLayer(district_geom[i].GEO_JSON, color, district_geom[i].Name_Vn, Remote_layer, riskType, [35, 10]);
                }
            }
        },
        LoadMapResult(province_id, disaster_id) {
            map.invalidateSize();
            $.ajax({
                type: "POST",
                url: "/DisasterProcess/mapRisk",
                data: {
                    param: {
                        region: { province_id: province_id },
                        param: { id_disaster: disaster_id }
                    }
                },
                success(xhr) {
                    RemoteRiskData = xhr.risks;
                    var district_ids = xhr.district_ids;
                    district_geom = [];
                    district_ids.filter(id => {
                        district_geom.push(DistrictSource.filter(x => x.Id == id)[0]);
                    });
                    $ctn_mapResult.find("li.item-risk").first().trigger("click");
                }
            });
        },
        CreateMapResult() {
            //height Map
            var height_screen = $(window).height();
            var footer = $(".page-footer").height();
            var header = $(".page-header").height() + $(".process-title").height() + $(".info-area").height() + $(".step-nav-tabs").height() + $(".navbar").height();
            var height_map = height_screen - footer - header;

            $("#map-result").height(height_map);
            //
            if (!map) {
                map = L.map('map-result').setView([19.759191, 105.709731], 7);
                var tile = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibG9uZ250IiwiYSI6ImNpaW1xZmNrZzAxYnB0cmtucW40azNhNDIifQ.a8NhnxBa6Lj84T5WB08KlQ', {
                    maxZoom: 18,
                    id: 'mapbox.streets',
                    accessToken: 'pk.eyJ1IjoibG9uZ250IiwiYSI6ImNpaW1xZmNrZzAxYnB0cmtucW40azNhNDIifQ.a8NhnxBa6Lj84T5WB08KlQ'

                }).addTo(map);

                simpleMapScreenshoter = L.simpleMapScreenshoter({
                    hidden: true
                }).addTo(map)

                var printer = L.easyPrint({
                    tileLayer: tile,
                    sizeModes: ['A4Landscape'],
                    filename: 'myMap'
                }).addTo(map);
                $(".easyPrintSizeMode").prop("title", "Tải ảnh bản đồ");
            }

        },
        availabelRisk() {
            $riskContainer = $riskDetermine.find("#available_risk_container");
            $riskFrm = $riskContainer.find("form");
            disasterDd = $riskFrm.find("[name=disaster_id]");
            provinceDd = $riskFrm.find("[name=province_id]");
            paramMs = $riskFrm.find("[name=Params]").multiselect("destroy").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'multiselect-all',
                selectAllJustVisible: true,
                buttonWidth: '100%',
                maxHeight: '150',
                onChange() {
                },
                onSelectAll: function () {
                },
                onDeselectAll: function () {
                }
            });
            displayDd = $riskFrm.find("[name=display_type]");
            $riskFrm.find(".watch").on("click", function () {
                if (displayDd.val() == 1)
                    root.HandlerResultTable();
                else if (displayDd.val() == 2)
                    root.HandlerResultMap();
            });
        },
        foreDetermination() {
            $foreContaier = $riskDetermine.find("#forecast_determined_container");
            $foreContaier.height($riskDetermine.height() - 40);
            $foreFrm = $foreContaier.find("form");
            $DTF_CapDuBao = $foreFrm.find("[name=cap_dubao]");
            $DTF_Disaster = $foreFrm.find("[name=disaster_id]");
            $DTF_Province = $foreFrm.find("[name=province_id]");
            $tableRiskLv = $foreFrm.find("#table-risk-level");
            $foreFrm.find("[name=cap_dubao]").on("change", function () {
                if ($(this).val() == 2) {
                    $DTF_Province.prop("disabled", false);
                    tableRiskLv.DataTable().ajax.reload();
                } else {
                    $DTF_Province.prop("disabled", true);
                    tableRiskLv.DataTable().ajax.reload();
                }
            });
            $foreFrm.find("[name=province_id]").on("change", () => {
                tableRiskLv.DataTable().ajax.reload();
            });
        },
        LoadTableRiskLevel() {
            var id = $tableRiskLv.attr('id');
            if ($.fn.dataTable.isDataTable("#" + id)) {
                tableRiskLv.DataTable().destroy();
                //$tableRiskLv.empty();
            }
            tableRiskLv = $tableRiskLv.dataTable({
                "processing": true,
                "serverSide": false,
                "filter": false,
                "ordering": false,
                "datatype": "json",
                "scrollX": false,
                "paging": true,
                "info": false,
                "ajax": {
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    url: "/DisasterProcess/caculateRisk",
                    data: function (d) {
                        d.region = { province_id: $DTF_Province.val() == null ? 0 : $DTF_Province.val() };
                        d.param = {
                            id_disaster: $DTF_Disaster.val(),
                            id_capdubao: $DTF_CapDuBao.val()
                        };
                        return JSON.stringify(d);
                    }
                },
                // Internationalisation. For more info refer to http://datatables.net/manual/i18n
                "language": {
                    url: '/static/translate/vi.json'
                },
                "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.
                "bLengthChange": false,
                "lengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "Tất cả"] // change per page values here
                ],
                // set the initial value
                "pageLength": 5,
                "pagingType": "bootstrap_full_number",
                "columns": [
                    {
                        "title": "Tỉnh/Thành phố",
                        "data": "name_are"
                    },
                    {
                        "title": "Cường độ",
                        "data": "disaster_cate",
                        "render": function (data, type, row, meta) {
                            var risk_cate = data.split(";");
                            var select = `<select name="td_cuongdo">
                                ${(() => {
                                    let keys;
                                    let options = ``;
                                    if (risk_cate.length == 3) {
                                        keys = Object.keys(Cuongdo3cap);
                                        for (let i = 0; i < (risk_cate.length + 1); i++) {
                                            options += `<option value="${keys[i]}" >${Cuongdo3cap[keys[i]]}</option>`;
                                        }
                                    } else if (risk_cate.length == 4) {
                                        keys = Object.keys(Cuongdo4cap);
                                        for (let i = 0; i < (risk_cate.length + 1); i++) {
                                            options += `<option value="${keys[i]}" >${Cuongdo4cap[keys[i]]}</option>`;
                                        }
                                    } else if (risk_cate.length == 5) {
                                        keys = Object.keys(Cuongdo5cap);
                                        for (let i = 0; i < (risk_cate.length + 1); i++) {
                                            options += `<option value="${keys[i]}" >${Cuongdo5cap[keys[i]]}</option>`;
                                        }
                                    }
                                    return options;
                                })()}
                                        </select>`;
                            return risk_cate.length > 2 ? select : "Thiên tai phải có ít nhất 3 cấp độ rủi ro";
                        },
                        "className": "text-center"
                    },
                    {
                        "title": "Phạm vi ảnh hưởng",
                        "data": null,
                        "render": function (data, type, row, meta) {
                            let risk_cate = data.disaster_cate.split(";");
                            let keys;
                            let select = `<select name="td_phamvi">
                                ${(() => {
                                    let options = ``;
                                    if (risk_cate.length == 3) {
                                        keys = Object.keys(Phamvi3cap);
                                        for (let i = 0; i < (risk_cate.length + 1); i++) {
                                            options += `<option value="${keys[i]}" >${Phamvi3cap[keys[i]]}</option>`;
                                        }
                                    } else if (risk_cate.length == 4) {
                                        keys = Object.keys(Phamvi4cap);
                                        for (let i = 0; i < (risk_cate.length + 1); i++) {
                                            options += `<option value="${keys[i]}" >${Phamvi4cap[keys[i]]}</option>`;
                                        }
                                    } else if (risk_cate.length == 5) {
                                        keys = Object.keys(Phamvi5cap);
                                        for (let i = 0; i < (risk_cate.length + 1); i++) {
                                            options += `<option value="${keys[i]}" >${Phamvi5cap[keys[i]]}</option>`;
                                        }
                                    }
                                    return options;
                                })()}
                                        </select>`;
                            return select;
                        },
                        "className": "text-center"
                    }
                ],
                "fnInitComplete": function () { }
            });
            $("[name=caculate-risk]").on("click", () => {
                var RiskData = [];
                tableRiskLv.DataTable().page.len(-1).draw();
                var nodes = tableRiskLv.DataTable().rows().nodes();
                if (nodes.length > 0) {
                    for (var i = 0; i < nodes.length; i++) {
                        var data_row = tableRiskLv.fnGetData(nodes[i]);
                        RiskData.push({
                            Id: data_row.id_area,
                            CuongDo: $(nodes[i]).find("[name=td_cuongdo]").val(),
                            PhamVi: $(nodes[i]).find("[name=td_phamvi]").val()
                        });
                    }
                    tableRiskLv.DataTable().page.len(5).draw();
                    var data_row_first = tableRiskLv.fnGetData(nodes[0]);
                    RiskData.Disaster_cate = data_row_first.disaster_cate.split(";");

                    $(".leaflet-top.leaflet-right").find(".pagination-map").remove();

                    $ctn_tableResult.hide();
                    $ctn_mapResult.show();
                    root.AddMaplegend($DTF_Disaster.val(), false);
                    root.LoadCaculateMapLayer(root.CaculateRisk(RiskData));
                } else {
                    DBBB.alert("Không tìm thấy khu vực cần tính toán rủi ro");
                }
            });
            $("[name=confirm-result-risk]").on("click", function () {
                DBBB.confirm("Bạn có chắc muốn đưa bản đồ cấp độ rủi ro này vào bản tin dự báo hay không ?", (result) => {
                    if (result) {
                        App.startPageLoading();
                        root.getBase64Map();
                    }
                });
            });
        },
        LoadCaculateMapLayer(riskData) {
            root.RemoveLayer(Remote_layer);
            root.RemoveLayer(Caculate_layer);
            Caculate_layer = [];

            map.invalidateSize();
            $.get("/DisasterProcess/getDisaster", { id_disaster: $DTF_Disaster.val() }).done(function (xhr) {
                var risk_color = xhr.risk_color.split(";");
                var risk_mag = xhr.risk_cate.split(";");
                if ($DTF_CapDuBao.val() == "1") {
                    $riskDetermine.find(".caption-subject").text("Bản đồ cấp độ rủi ro cho Đồng Bằng Bắc Bộ");
                    for (var i = 0; i < riskData.length; i++) {
                        var color;
                        var idx_mag = risk_mag.indexOf(riskData[i].RuiRo);
                        var idx_province = ProvinceSourceIds.indexOf(riskData[i].Id);
                        try {
                            color = risk_color[idx_mag].split(" ");
                        } catch (err) {
                            color = ["255", "255", "255", "0"];
                        }
                        root.AddMapLayer(ProvinceSource[idx_province].GEO_JSON, color, ProvinceSource[idx_province].Name_Vn, Caculate_layer, riskData[i].Id, [10, 0]);

                    }
                } else if ($DTF_CapDuBao.val() == "2") {
                    $riskDetermine.find(".caption-subject").text("Bản đồ cấp độ rủi ro cho " + $DTF_Disaster.text() + " trên khu vực " + $DTF_Province.find("option:selected").text());
                    for (var i = 0; i < riskData.length; i++) {
                        var color;
                        var idx_mag = risk_mag.indexOf(riskData[i].RuiRo);
                        var idx_district = DistrictSourceIds.indexOf(riskData[i].Id);
                        try {
                            color = risk_color[idx_mag].split(" ");
                        } catch (err) {
                            color = ["255", "255", "255", "0"];
                        }
                        root.AddMapLayer(DistrictSource[idx_district].GEO_JSON, color, DistrictSource[idx_district].Name_Vn, Caculate_layer, riskData[i].Id, [35, 10]);
                    }
                }

            })

        },
        AddMaplegend(disaster_id, EHV) {
            var ControlLegend, row_EHV, row_R;
            row_R = `<li><div class="legend-color-fill" style="background-color : #fff;width:20px;height:20px;display:inline-block;float:left"></div> <span>Không có rủi ro </span></li>`;
            if (EHV)
                row_EHV = `<li><div class="legend-color-fill" style="background-color : #fff;width:20px;height:20px;display:inline-block;float:left"></div> <span>Không có</span></li>`;
            $.get("/DisasterProcess/getDisaster", { id_disaster: disaster_id }).done(function (xhr) {
                var risk_color = xhr.risk_color.split(";");
                var risk_mag = xhr.risk_mag.split(";");
                for (var i = 0; i < risk_mag.length; i++) {
                    row_R += `<li><div class="legend-color-fill" style="background-color : rgb(${risk_color[i]});width:20px;height:20px;display:inline-block;float:left;"></div> <span >Rủ ro cấp ${(() => (i + 1))()}</span></li>`;
                    if (EHV)
                        row_EHV += `<li><div class="legend-color-fill" style="background-color : rgb(${risk_color[i]});width:20px;height:20px;display:inline-block;float:left;"></div> <span >${risk_mag[i]}</span></li>`;
                }
                ControlLegend = L.Control.extend({
                    options: {
                        position: 'bottomright'
                    },
                    onAdd: function (map) {
                        $(".leaflet-bottom.leaflet-right").find(".legend-note").remove();
                        var LegendNote = L.DomUtil.create('div', 'legend-note');
                        var ul_R = L.DomUtil.create("ul", "ul_R", LegendNote);
                        var ul_EHV = L.DomUtil.create("ul", "ul_EHV", LegendNote);
                        $(ul_R).append(row_R);
                        if (EHV)
                            $(ul_EHV).append(row_EHV);
                        return LegendNote;
                    }
                });
                map.addControl(new ControlLegend());
            });
        },
        AddMapLayer(geoJson, color, region_name, ctn_MapLayer, layer_id, anchor) {
            var l = L.geoJSON(geoJson, {
                style: function (feature) {
                    return {
                        fillColor: `rgb(${color[0]},${color[1]},${color[2]})`,
                        color: `gray`,
                        fillOpacity: 1,
                        weight: 1,
                    };
                },
            }).addTo(map);
            var marker = L.marker(l.getBounds().getCenter(), {
                icon: new L.divIcon({
                    className: 'my-div-icon',
                    iconAnchor: anchor,
                    html: `<div style="font-weight:600;font-size:10.5px;width:120px;">${region_name}</div>`,
                }),
            }).addTo(map);
            ctn_MapLayer.push({
                index: layer_id,
                mapLayer: l
            });
        },
        RemoveLayer(LayerArr) {
            $(".leaflet-pane.leaflet-marker-pane").find(".my-div-icon").remove();
            $.each(LayerArr, (idx, layer) => {
                map.removeLayer(layer.mapLayer);
            });
        },
        CaculateRisk(RiskData) {
            var ResultRisk = [];
            switch (RiskData.Disaster_cate.length) {
                case 3:
                    for (var i = 0; i < RiskData.length; i++) {
                        var Ruiro = 0;
                        var IxE = RiskData[i].CuongDo * RiskData[i].PhamVi;
                        if (IxE == 0)
                            Ruiro = 0;
                        else if (0 < IxE && IxE < 9)
                            Ruiro = RiskData.Disaster_cate[0];
                        else if (9 <= IxE && IxE < 25)
                            Ruiro = RiskData.Disaster_cate[1];
                        else if (25 <= IxE)
                            Ruiro = RiskData.Disaster_cate[2];
                        ResultRisk.push({
                            Id: RiskData[i].Id,
                            RuiRo: Ruiro
                        });
                    }
                    break;
                case 4:
                    for (var i = 0; i < RiskData.length; i++) {
                        var Ruiro = 0;
                        var IxE = RiskData[i].CuongDo * RiskData[i].PhamVi;
                        if (IxE == 0)
                            Ruiro = 0;
                        else if (0 < IxE && IxE < 9)
                            Ruiro = RiskData.Disaster_cate[0];
                        else if (9 <= IxE && IxE < 15)
                            Ruiro = RiskData.Disaster_cate[1];
                        else if (15 <= IxE && IxE < 25)
                            Ruiro = RiskData.Disaster_cate[2];
                        else if (25 <= IxE)
                            Ruiro = RiskData.Disaster_cate[3];
                        ResultRisk.push({
                            Id: RiskData[i].Id,
                            RuiRo: Ruiro
                        });
                    }
                    break;
                case 5:
                    for (var i = 0; i < RiskData.length; i++) {
                        var Ruiro = 0;
                        var IxE = RiskData[i].CuongDo * RiskData[i].PhamVi;
                        if (IxE == 0)
                            Ruiro = 0;
                        else if (0 < IxE && IxE < 4)
                            Ruiro = RiskData.Disaster_cate[0];
                        else if (4 <= IxE && IxE < 9)
                            Ruiro = RiskData.Disaster_cate[1];
                        else if (9 <= IxE && IxE < 15)
                            Ruiro = RiskData.Disaster_cate[2];
                        else if (15 <= IxE && IxE <= 25)
                            Ruiro = RiskData.Disaster_cate[3];
                        else if (25 <= IxE)
                            Ruiro = RiskData.Disaster_cate[4];
                        ResultRisk.push({
                            Id: RiskData[i].Id,
                            RuiRo: Ruiro
                        });
                    }
                    break;
                default:
                    console.log("error");
            }
            console.log(ResultRisk);
            return ResultRisk;
        },
        ExportRiskAvaiable() {
            var dailuong = paramMs.val();
            var id_disaster = $("#available_risk_container").find("[name=disaster_id]").val();
            var id_province = $("#available_risk_container").find("[name=province_id]").val();
            var param = {
                dailuong: dailuong,
                id_disaster: id_disaster,
                id_province: id_province
            }
            App.postDownload("/DisasterProcess/ExportExcelRisk", param, "application/json; charset=utf-8", "data.xlsx");
        },
        getBase64Map() {
            var MapResultJs = $("#map-result").css('background', 'none');

            simpleMapScreenshoter.takeScreen('image').then(image => {
                var img = document.createElement('img');
                var dimensions = map.getSize();
                img.width = dimensions.x;
                img.height = dimensions.y;
                img.src = image;

                let $imgCtn = $('<div style="position:absolute; top:0;overflow:auto; left:0"/>').appendTo("body");
                $imgCtn.append(`<img width=650 src="${img.src}" style="float:left">`);
                html2canvas(MapResultJs[0], {
                    onrendered: function (canvas) {
                        $imgCtn.append(`<img width=650 src="${canvas.toDataURL("image/png")}"  style="z-index:100;position: absolute;left: 0;">`);
                        html2canvas($imgCtn[0], {
                            onrendered: function (canvas2) {
                                stepImgRender.value = canvas2.toDataURL("image/png");
                                $imgCtn.remove();
                                App.stopPageLoading();
                            }
                        });
                    }
                });
            }).catch(e => {
                alert(e.toString())
            })
        },
        getFileNameRules(RulseArr, extention) {
            var TimeNow = new Date();
            var NameFile = "";
            for (var i = 0; i < RulseArr.length; i++) {
                NameFile += root.NametoRules(RulseArr[i]);
            }
            if (NameFile == "")
                NameFile = dateTime.dateToString(TimeNow, "yyyy-MM-dd HH:mm");
            return NameFile;
        },
        getMonth(date) {
            var month = date.getMonth() + 1;
            return month < 10 ? '0' + month : '' + month;
        },
        getDate(date) {
            return (date.getDate() < 10 ? '0' : '') + date.getDate();
        },
        getMinutes(date) {
            return (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
        },
        getEmails() {
            $.get("/DisasterBulletinConfig/getEmail", {
                bulletin_id: fcBullDd.val(),
                office_id: unitId.val()
            }).done(xhr => {
                var emails = [];
                if (xhr.length > 0) {
                    for (var i = 0; i < xhr.length; i++) {
                        emails.push(xhr[i].Emails);
                    }
                    $bulletinProvider.find("[name=Emails]").text(emails.join(';'));
                }
            });
        },
        sendEmail() {
            var default_email = $bulletinProvider.find("[name=Emails]").val();
            var add_email = $bulletinProvider.find("[name=Emails_add]").val();
            if (add_email != "" && default_email != "") {
                default_email += ";" + add_email;
            }
            else {
                default_email = default_email == "" ? add_email : default_email;
            }
            if (default_email == "") {
                DBBB.alert("Phải có ít nhất 1 địa chỉ Email để gửi đi!!");
                return;
            }
            if ($bulletinProvider.find("[name=email-title]").val() == "") {
                DBBB.alert("Nhập tiêu đề cho Email gửi đi!");
                return;
            }
            send_email = default_email;
            $.ajax({
                url: "/DisasterProcess/SendBulletinAsync",
                type: "post",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    emails: default_email,
                    attachFilePath: savePath + "\\" + _fileName,
                    body: $bulletinProvider.find("[name=email-content]").val(),
                    subject: $bulletinProvider.find("[name=email-title]").val()
                }),
                success: function (response) {
                    if (response.success) {
                        DBBB.alert("Gửi bản tin hoàn tất!");
                        send_time = new Date();
                        $bulletinProvider.find("[name=end-step]").prop("disabled", false);
                    }
                    else
                        DBBB.alert(response.message);
                }
            });
        },
        LoadAvailableDocument($opt) {
            var released_id = $opt.val();
            var name = $opt.data("name");
            if (name == "") {
                DBBB.alert("Không thể tìm thấy bản tin dự báo của khung giờ được chọn!");
                return;
            }
            $.post("/DisasterProcess/LoadAvaiableDocument", { released_id: released_id }).done(xhr => {
                if (xhr.success) {
                    for (var i = 0; i < xhr.data.length; i++) {
                        $(`.action-${xhr.data[i].position}`).val(xhr.data[i].value);
                    }
                } else {
                    DBBB.alert(xhr.message);
                }
            });
        },
        ConvertSavePath(savePathArr) {
            for (var i = 0; i < savePathArr.length; i++) {
                if (savePathArr[i].split("%").length > 1) {
                    var pathToRulesArr = savePathArr[i].split("%");
                    var Path = "";
                    for (var j = 0; j < pathToRulesArr.length; j++) {
                        Path += root.NametoRules(pathToRulesArr[j]);
                    }
                    savePathArr[i] = Path;
                }
            }
            var FSavePath = savePathArr.filter(function (value) {
                return value != "";
            });
            if (FSavePath.length > 0)
                return FSavePath.join("/");
            else
                return "";
        },
        NametoRules(string) {
            var TimeNow = new Date();
            var NameFile = "";
            switch (string) {
                case EnumFileNameRules.yyyy:
                    NameFile += TimeNow.getFullYear().toString();
                    break;
                case EnumFileNameRules.yy:
                    NameFile += TimeNow.getFullYear().toString().substr(2, 2);
                    break;
                case EnumFileNameRules.mm:
                    NameFile += root.getMonth(TimeNow);
                    break;
                case EnumFileNameRules.dd:
                    NameFile += root.getDate(TimeNow);
                    break;
                case EnumFileNameRules.pp:
                    NameFile += root.getMinutes(TimeNow);
                    break;
                case EnumFileNameRules.ymd:
                    NameFile += $.dateTime.dateToString(TimeNow, "yyyy-MM-dd");
                    break;
                case EnumFileNameRules.ymdh:
                    NameFile += $.dateTime.dateToString(TimeNow, "yyyy-MM-dd HH");
                    break;
                case EnumFileNameRules.ymdhp:
                    NameFile += $.dateTime.dateToString(TimeNow, "yyyy-MM-dd HHhmm");
                    break;
                case EnumFileNameRules.hhpp:
                    NameFile += $.dateTime.dateToString(TimeNow, "HHhmm");
                    break;
                case EnumFileNameRules.dvdb:
                    NameFile += unitId.find("option:selected").text();
                    break;
                default:
                    NameFile += string;
                    break;
            }
            return NameFile;
        },
        GetAllCateProcedure() {
            $.get("/DisasterProcess/GetAllCatProcedures", { timeId: + timeDd.val() }).done(cat1s => {
                _cat1s = cat1s;
            });
        }
    };
    return {
        start: root.init
    };
})();


$(document).ready(() => {
    DisasterProcess.start();
});