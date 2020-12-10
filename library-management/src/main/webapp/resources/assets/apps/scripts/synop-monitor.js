var SynopMonitor = function () {
    let public = $();
    let private = $();
    let $mainWrapper, $form, $synopBody, $synopTable,
        areaDd, stationDd, $varContainer, dpShape,
        _areas, _stations, _vars, _stationName, _varName, _data,
        fromTime, toTime, changeChart, $synopChart, downloadBtn,
        $searchResult, $charChoice, searchBtn, $resultBtns,
        minCb, maxCb, thMin, thMax, _cbArr, $resultBody;
    let map, $mapWrapper, _modelData,
        mapTimeDd, _markers = [], _tags = [], _tpl, _mapTpl,
        mapPg, _pgCtr, playBtn, _playIcon,
        nextBtn, prevBtn, _pgLoop, displayTime, _obsData, _pgLength;
    let featureGrMarker ;

    let ModelParams = ["n", "dd", "ff", "vv", "ww", "pmsl", "t", "td"];
    let WindInfo = {
        N: {
            deg: 0,
            speed: { top: -16, left: 62 },
            direction: { top: -14, left: 37 }
        },
        NNE: {
            deg: 22.5,
            speed: { top: -5, left: 85 },
            direction: { top: -11, left: 61 }
        },
        NE: {
            deg: 45,
            speed: { top: 12, left: 100 },
            direction: { top: 2, left: 85 }
        },
        ENE: {
            deg: 67.5,
            speed: { top: 36, left: 108 },
            direction: { top: 22, left: 95 }
        },
        E: {
            deg: 90,
            speed: { top: 58, left: 105 },
            direction: { top: 44, left: 103 }
        },
        ESE: {
            deg: 112.5,
            speed: { top: 84, left: 94 },
            direction: { top: 68, left: 100 }
        },
        SE: {
            deg: 135,
            speed: { top: 101, left: 74 },
            direction: { top: 88, left: 86 }
        },
        SSE: {
            deg: 157.5,
            speed: { top: 108, left: 50 },
            direction: { top: 100, left: 65 }
        },
        S: {
            deg: 180,
            speed: { top: 105, left: 26 },
            direction: { top: 108, left: 40 }
        },
        SSW: {
            deg: 202.5,
            speed: { top: 95, left: 5 },
            direction: { top: 100, left: 19 }
        },
        SW: {
            deg: 225,
            speed: { top: 76, left: -12 },
            direction: { top: 89, left: -2 }
        },
        WSW: {
            deg: 247.5,
            speed: { top: 50, left: -20 },
            direction: { top: 68, left: -20 }
        },
        W: {
            deg: 270,
            speed: { top: 27, left: -17 },
            direction: { top: 45, left: -27 }
        },
        WNW: {
            deg: 292,
            speed: { top: 5, left: -7 },
            direction: { top: 23, left: -21 }
        },
        NW: {
            deg: 315,
            speed: { top: -13, left: 13 },
            direction: { top: 2, left: -7 }
        },
        NNW: {
            deg: 337.5,
            speed: { top: -20, left: 38 },
            direction: { top: -10, left: 14 }
        }
    };
    public.init = function () {
        private.handleTheme();
        private.initForm();
        private.handleLoading();
    };
    private.loadMap = function () {
        if (!map) {
            map = L.map('map').setView([19.759191, 105.709731], 6);
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibG9uZ250IiwiYSI6ImNpaW1xZmNrZzAxYnB0cmtucW40azNhNDIifQ.a8NhnxBa6Lj84T5WB08KlQ', {
                //attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox.streets',
                accessToken: 'pk.eyJ1IjoibG9uZ250IiwiYSI6ImNpaW1xZmNrZzAxYnB0cmtucW40azNhNDIifQ.a8NhnxBa6Lj84T5WB08KlQ'
            }).addTo(map);
            map.invalidateSize();
            let pager = L.control({ position: 'topright' });
            pager.onAdd = function (map) {
                let div = L.DomUtil.create('div', 'info legend');
                div.innerHTML = $("#map-pager-tpl").html();
                div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
                return div;
            };
            pager.addTo(map);
            mapPg = $("#map-pager");
            prevBtn = mapPg.find('.prev').on('click', private.prevPager);
            playBtn = mapPg.find('.play-pause').on('click', private.playOrPausePager);
            nextBtn = mapPg.find('.next').on('click', private.nextPager);
            displayTime = mapPg.find('.time');
            _playIcon = $(playBtn.find('i')[0]);

            let timeDd = L.control({ position: 'topright' });
            timeDd.onAdd = function (map) {
                let div = L.DomUtil.create('div', 'info legend');
                div.innerHTML = '<select class="form-control" style="display:none" id="map-time"></select>';
                div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
                return div;
            };
            timeDd.addTo(map);
            mapTimeDd = $("#map-time").on('change', private.onMapTimechange);
        }
    };
    private.onMapTimechange = function () {
        let time = mapTimeDd.val();
        let dt = $.grep(_obsData, function (item) {
            return item.Time.Time === time;
        })[0];
        private.showWindBarb(dt);
    };
    private.activePagerCtrl = function () {
        if (!_pgLoop)
            $(playBtn.find('i')[0]).removeClass('fa-pause').addClass('fa-play');

        nextBtn.prop('disabled', true).addClass('disabled');
        prevBtn.prop('disabled', true).addClass('disabled');
        if (_pgCtr < _pgLength) {
            nextBtn.prop('disabled', false).removeClass('disabled');
        }
        if (_pgCtr > 0)
            prevBtn.prop('disabled', false).removeClass('disabled');
    };
    private.prevPager = function (e) {
        e.stopPropagation();
        _pgCtr--;
        if (_pgCtr == 0)
            prevBtn.prop('disabled', true).addClass('disabled');
        if (_pgCtr < _pgLength)
            nextBtn.prop('disabled', false).removeClass('disabled');

        private.showWindBarb(_obsData[_pgCtr]);
    };
    private.playOrPausePager = function (e) {
        e.stopPropagation();
        if (_playIcon.hasClass('fa-pause'))
            private.stopLoop();
        else
            private.startLoop();
    };
    private.pausePager = function (e) {
        try {
            if (_playIcon.hasClass('fa-pause'))
                private.stopLoop();
        } catch (err) {

        }
    };
    private.nextPager = function (e) {
        e.stopPropagation();
        _pgCtr++;
        if (_pgCtr === _pgLength)
            nextBtn.prop('disabled', true).addClass('disabled');
        if (_pgCtr > 0)
            prevBtn.prop('disabled', false).removeClass('disabled');
        private.showWindBarb(_obsData[_pgCtr]);
    };
    private.stopLoop = function () {

        if (_pgLoop) {
            clearInterval(_pgLoop);
            _pgLoop == null;
        }
        if (_playIcon) {
            _playIcon.removeClass('fa-pause').addClass('fa-play');
            if (_pgCtr == 0)
                prevBtn.prop('disabled', true).addClass('disabled');
            if (_pgCtr > 0)
                prevBtn.prop('disabled', false).removeClass('disabled');

            if (_pgCtr < _obsData.length - 1)
                nextBtn.prop('disabled', false).removeClass('disabled');
            if (_pgCtr === _obsData.length - 1)
                nextBtn.prop('disabled', true).addClass('disabled');
        }
    };
    private.startLoop = function () {
        if (_playIcon)
            _playIcon.removeClass('fa-play').addClass('fa-pause');
        _pgLoop = setInterval(function () {
            _pgCtr++;
            if (_pgCtr === _obsData.length) {
                _pgCtr = 0;
            }
            private.showWindBarb(_obsData[_pgCtr]);
            displayTime.html(_obsData[_pgCtr].Time.DisplayTime);
            prevBtn.prop('disabled', true).addClass('disabled');
            nextBtn.prop('disabled', true).addClass('disabled');
        }, 1500);
    };
    private.closePopup = function () {
        if ($(".leaflet-popup-close-button")[0])
            $(".leaflet-popup-close-button")[0].click();
    };
    private.showResult = function (station, varName, type) {
        _pgCtr = 0;
        private.stopLoop();
        private.closePopup();
        _stationName = station;
        _varName = varName;
        _data = {
            FromTime: fromTime.val(),
            ToTime: toTime.val(),
            VarStr: _vars.join(' ; '),
            StationStr: _stations.join(' ; '),
            Station: _stationName,
            VarName: _varName,
            Type: type
        };
        if (dpShape.val() === "table") {
            $mainWrapper.show();
            $mapWrapper.hide();
            $.ajax({
                type: 'get',
                url: '/ProductForeCast/DisplaySynopTable',
                dataType: 'html',
                contentType: 'application/html; charset=utf-8',
                data: _data,
                success: function (result) {
                    $synopBody.show();
                    $synopChart.hide();
                    $synopTable.html(result);
                    $synopTable.find("table").dataTable({
                        "language": {
                            url: '/static/translate/vi.json'
                        },
                        "ordering": false
                    });
                    $synopTable.css('padding', '10px');
                    private.activeSynopBtn();
                    downloadBtn.removeClass('disabled').removeAttr('disabled');
                },
                error: DBBB.error
            });
        }
        else if (dpShape.val() === "change") {
            $mainWrapper.show();
            $mapWrapper.hide();
            $.ajax({
                type: 'get',
                url: '/ProductForeCast/DisplaySynopChart',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: _data,
                success: function (result) {
                    $synopBody.hide();
                    private.createChart(result);
                    $synopChart.show();
                    downloadBtn.removeClass('disabled').removeAttr('disabled');
                },
                error: DBBB.error

            });

        }
        else if (dpShape.val() === "model" || dpShape.val() === "space") {
            let timeIndex = mapTimeDd ? mapTimeDd.val() : null;
            _pgCtr = 0;
            private.showStationModel(timeIndex);
        }
    };
    private.showStationModel = function (timeIndex) {
        $mainWrapper.hide();
        $mapWrapper.show();
        $mapWrapper.find('#map').show();
        private.loadMap();
        _modelData = {
            FromTime: fromTime.val(),
            ToTime: toTime.val(),
            VarStr: _vars.join(' ; '),
            StationStr: _stations.join(' ; '),
            TimeIndex: timeIndex
        };
        return $.ajax({
            type: 'post',
            url: '/ProductForeCast/GetStationModelData',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(_modelData),
            success: function (result) {
                _obsData = result.DataList;
                _pgCtr = 0;
                _pgLength = _obsData.length -1;
                private.showWindBarb(_obsData[_pgCtr]);
            },
            error: DBBB.error
        });
    };
    private.showWindBarb = function (data) {
        let time = data.Time;
        let dt = data.Data;
        mapTimeDd.empty();
        $.each(_obsData, function (index, item) {
            let timeItem = item.Time
            mapTimeDd.append($('<option/>').val(timeItem.Time).text(timeItem.DisplayTime));
        });
        mapTimeDd.val(time.Time);

        //_obsData = result.TimeList;
        let radius = 0, length = 0;
        if (dpShape.val() === "space") {
            mapTimeDd.show();
            mapPg.hide();
            radius = 8;
            length = 30;
        }
        else {
            mapTimeDd.hide();
            mapPg.show();
            radius = 15;
            length = 45;
            private.activePagerCtrl();
            displayTime.html(time.DisplayTime);
        }

        if (_markers.length > 0) {
            $.each(_markers, function (index, marker) {
                map.removeLayer(marker);
            });
        }
        if (_tags.length > 0) {
            $.each(_tags, function (index, tag) {
                tag.remove();
            });
        }
        featureGrMarker = new L.featureGroup();
        $.each(dt, function (index, value) {
            let popData = {};
            $.each(value.items, function (idx, value) {
                popData[value.Name] = value.ValueStr
            });
            popData = $.extend(popData, {
                lon: value.Lon,
                lat: value.Lat,
                deg: 0,
                speed: 0,
                direction: 0
            });

            if (popData.dd !== "-9999" && popData.dd) {
                popData = $.extend(popData, {
                    deg: WindInfo[popData.dd].deg,
                    speed: WindInfo[popData.dd].speed,
                    direction: WindInfo[popData.dd].direction
                });
            }

            //end test
            let icon = L.WindBarb.icon({ lat: value.Lat, deg: popData.deg, speed: private.msToKts(popData.ff), pointRadius: radius, strokeLength: length });
            let marker = L.marker([value.Lat, value.Lon], { icon: icon }).addTo(map);
            featureGrMarker.addLayer(marker);
            if (dpShape.val() === "space") {
                marker.on('mouseover', function (e) {
                    let html = Mustache.to_html(_tpl, popData);
                    L.popup()
                        .setLatLng(e.latlng)
                        .setContent(html)
                        .openOn(map);
                });
                marker.on('mouseout', function (e) {
                    private.closePopup();
                });
            }
            else {
                private.showParamGraph({ className: "icon-param-" + index, data: popData });
            }
            _markers.push(marker);

        });
        map.fitBounds(featureGrMarker.getBounds())
    }
    private.showParamGraph = function (options) {
        _mapTpl = $("#map-param").html();
        let html = Mustache.to_html(_mapTpl, options.data);

        var divIcon = new L.divIcon({
            className: options.className,
            html: html
        });
        let marker = new L.Marker([options.data.lat, options.data.lon], { icon: divIcon }).addTo(map);
        featureGrMarker.addLayer(marker);
        $tag = $("." + options.className);
        _tags.push($tag);
        let speed = options.data.speed;
        let direction = options.data.direction;
        $tag.find('#wind-icon').css({
            'width': '127px',
            'height': '127px',
            'position': 'relative',
            'font-size': '10px',
            'margin-top': '-58px',
            'margin-left': '-56px'
            //'transform': 'rotate(' + options.data.deg + 'deg)',
            //'transform-origin': 'top left'
        });
        $tag.find('#wind-icon .param').css({
            'position': 'absolute',
            'font-weight': 'bolder',
            //'transform': 'rotate(-' + options.data.deg + 'deg)',
            //'transform-origin': 'top left',
            'min-width': '25px',
            'display': 'block',
            'text-align': 'center',
            'border-radius': '5px',
            'background': '#b3d7fde0'
        });
        $tag.find('#wind-icon [name=n]').css({
            'top': '45%',
            'left': '39%',
            'background': 'unset',
        });
        $tag.find('#wind-icon [name=dd]').css({
            'top': direction.top + '%',
            'left': direction.left + '%',
            'display': 'none'
        });

        $tag.find('#wind-icon [name=ff]').css({
            'top': speed.top + '%',
            'left': speed.left + '%',
            'display': 'none'
        });

        $tag.find('#wind-icon [name=vv]').css({
            'top': '32%',
            'left': '-2%',
        });

        $tag.find('#wind-icon [name=ww]').css({
            'top': '32%',
            'left': '20%'
        });

        $tag.find('#wind-icon [name=pmsl]').css({
            'top': '38%',
            'right': '12%'
        });

        $tag.find('#wind-icon [name=t]').css({
            'top': '18%',
            'right': '60%'
        });

        $tag.find('#wind-icon [name=td]').css({
            'top': '60%',
            'left': '20%'
        });
        _markers.push(marker);
    };
    private.handleLoading = function () {
        $(document).ajaxStart(function () {
            App.startPageLoading();
        });
        $(document).ajaxComplete(function () {
            App.stopPageLoading();
        });
    };
    private.initForm = function () {
        $mainWrapper = $("#main-wrapper");
        $mapWrapper = $("#map-wrapper");
        _tpl = $('#popup-content').html();
        $form = $("#synop-form");
        areaDd = $form.find("[name=Area_Ids]");
        private.loadAreas();
        stationDd = $form.find("[name=Station_Ids]");
        private.loadStations();

        $form.find('.date-time-picker').datetimepicker({
            format: "dd/mm/yyyy HH:00p",
            rtl: App.isRTL(),
            orientation: "left",
            autoclose: true,
            minView: 1,
            language: 'vi'
        });

        fromTime = $form.find("[name=fromTime]");
        toTime = $form.find("[name=toTime]");
        $varContainer = $form.find(".var-container");
        private.loadVars();
        dpShape = $form.find("[name=DisplayShape]").on('change', private.onDpShapeChange);
        $form.find(".display").on("click", private.display);
        downloadBtn = $form.find(".download").on("click", private.download);
        $form.find("[title]").tooltip();
        $synopBody = $(".synop-body");
        $synopTable = $(".synop-table");
        timeCb = $synopBody.find("[type='radio'][name=SynopTime]").on('change', private.onTimeCbChange);
        $synopChart = $(".synop-chart");
        $charChoice = $("#char-choices");
        $searchResult = $("#search-result");
        searchBtn = $("#search-btn").on('click', private.search);
        thMin = $searchResult.find(".th-min");
        thMax = $searchResult.find(".th-max");
        $resultBody = $searchResult.find("tbody");
        $resultBtns = $searchResult.find(".result-btn");
        minCb = $charChoice.find("[data-cb=min]").on('change', function () {
            if ($(this).is(":checked"))
                maxCb.prop("checked", false);
        });
        maxCb = $charChoice.find("[data-cb=max]").on('change', function () {
            if ($(this).is(":checked"))
                minCb.prop("checked", false);
        });

    };
    private.onDpShapeChange = function () {
        $mapWrapper.hide();
        private.pausePager();
        if (dpShape.val() === "table" || dpShape.val() === "space")
            private.hideVarCb('none', false);
        else if (dpShape.val() === "change")
            private.hideVarCb(['dd'], false);
        else if (dpShape.val() === "model")
            private.hideVarCb(ModelParams, true);
    };
    private.hideVarCb = function (varArr, isHide) {
        $varContainer.find("[data-var]").each(function (index, value) {
            let varItem = $(value).data('var');
            $(value).removeAttr("disabled");
            $varContainer.find("." + varItem).show();
            if (typeof varArr === 'object') {
                if (isHide) {
                    if (varArr.indexOf(varItem) === -1) {
                        $(value).prop("checked", false).attr("disabled", true);
                        $varContainer.find("." + varItem).hide();
                    }
                }
                else {
                    if (varArr.indexOf(varItem) > -1) {
                        $(value).prop("checked", false).attr("disabled", true);
                        $varContainer.find("." + varItem).hide();
                    }
                }
            }
        });
    }
    private.search = function () {
        if (private.validateForm()) {
            _cbArr = [];
            $charChoice.find("[type=checkbox]").each(function (index, element) {
                if ($(element).is(":checked"))
                    _cbArr.push($(element).data('cb'));
            });
            if (_cbArr.length === 0) {
                DBBB.alert("Vui lòng chọn một đặc trưng!");
                isValid = true;
                return false;
            }
            $searchResult.show();
            if (minCb.is(":checked")) {
                thMin.show();
                thMax.hide();
            }
            else {
                thMin.hide();
                thMax.show();
            }
            private.showMinMax(_stations[0], _vars[0]);
        };

    };
    private.showMinMax = function (station, varName) {
        _stationName = station;
        _varName = varName;
        _data = {
            FromTime: fromTime.val(),
            ToTime: toTime.val(),
            VarStr: _vars.join(' ; '),
            StationStr: _stations.join(' ; '),
            Station: _stationName,
            VarName: _varName,
            Type: "var",
        };
        $.ajax({
            type: 'get',
            url: '/ProductForeCast/DisplaySynopChart',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: _data,
            success: function (result) {
                $resultBody.empty();
                let chartDatas = [];
                $.each(result.data, function (index, data) {
                    let item = {};
                    item['time'] = data.Times;
                    $.each(data.items, function (idx, value) {
                        item[value.Name] = Number(value.ValueStr) == -9999 ? 0 : Number(value.ValueStr);
                    });
                    chartDatas.push(item);
                });
                let dataList = [];
                if (minCb.is(":checked")) {
                    $.each(result.vars, function (index, value) {
                        value = value.trim();
                        let min = Math.min.apply(Math, chartDatas.map(function (item) { return item[value]; }));
                        let minItem = $.grep(chartDatas, function (dt) {
                            return dt[value] === min;
                        })[0];
                        dataList.push({
                            name: value,
                            time: minItem.time,
                            value: min
                        });
                    });
                }
                else {
                    $.each(result.vars, function (index, value) {
                        value = value.trim();
                        let max = Math.max.apply(Math, chartDatas.map(function (item) { return item[value]; }));
                        let maxItem = $.grep(chartDatas, function (dt) {
                            return dt[value] === max;
                        })[0];
                        dataList.push({
                            name: value,
                            time: maxItem.time,
                            value: max
                        });
                    });
                }
                $.each(dataList, function (index, value) {
                    let row = "<tr><td>" + value.name + "</td><td>" + value.value + "</td><td>" + value.time + "</td></tr>";
                    $resultBody.append(row);
                });
                $resultBtns.empty();
                $.each(result.stations, function (index, value) {
                    let btnClass = result.stationId == value.Sid ? "btn btn-success" : "btn btn-info";
                    $resultBtns.append('<button class="' + btnClass + '" data-stn-btn="' + value.Name + '" style="margin:0 2px">' + value.Name + '</button>');
                });
                $resultBtns.find('[data-stn-btn]').on('click', function () {
                    _stationName = $(this).data('stnBtn');
                    private.showMinMax(_stationName, _varName);
                });
                $(".panel-body").css('height', '400px');
            },
            error: DBBB.error
        });
    };
    private.download = function () {
        if (_data)
            if (dpShape.val() === "table") {
                App.postDownload('/ProductForeCast/ExportSynopTable', _data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "synopdata.xlsx");
            }
            else if (dpShape.val() === "change") {
                var exp = new AmCharts.AmExport(changeChart);
                exp.init();
                exp.output({
                    format: 'png'
                });
            }
    };
    private.onTimeCbChange = function () {
        //console.log($(this).val());
        if ($(this).val() === "station-table")
            private.showResult(_stationName, _varName, "station");
        else if ($(this).val() === "var-table")
            private.showResult(_stationName, _varName, "var");
        else
            private.showResult(_stationName, _varName, "time");
    };
    private.display = function (e) {
        e.preventDefault();
        if (private.validateForm()) {
            private.showResult(_stations[0], _vars[0], "var");
        };
    };
    private.validateForm = function () {
        if (!_areas) {
            DBBB.alert("Vui lòng chọn ít nhất một Tỉnh/Thành phố!");
            return false;
        }
        else if (!_stations) {
            DBBB.alert("Vui lòng chọn ít nhất một trạm quan trắc!");
            return false;
        }
        else if (!(fromTime.val() && toTime.val())) {
            DBBB.alert("Vui lòng chọn đầy đủ thời gian!");
            return false;
        }
        else if (fromTime.val() && toTime.val()) {
            let arrayDate1 = fromTime.val().split(' ');
            let arrayDate2 = toTime.val().split(' ');
            let newDate1 = arrayDate1[0].split('/');
            let newDate2 = arrayDate2[0].split('/');
            let startTime = new Date(newDate1[1] + '/' + newDate1[0] + '/' + newDate1[2] + ' ' + arrayDate1[1]);
            let endTime = new Date(newDate2[1] + '/' + newDate2[0] + '/' + newDate2[2] + ' ' + arrayDate2[1]);
            if (startTime >= endTime) {
                DBBB.alert("Thời gian kết thúc cần lớn hơn thời gian bắt đầu!");
                return false;
            }
        }
        let isValid = false;
        _vars = [];
        $varContainer.find("[data-var]").each(function (index, cb) {
            if ($(cb).is(":checked")) {
                _vars.push($(this).data('var'));
                isValid = true;
            }
        });
        if (!isValid) {
            DBBB.alert("Vui lòng chọn ít nhất 1 biến!");
            return false;
        }
        return true;
    };

    private.createChart = function (result) {

        let template = '<div class="row" >\
                                <div class="col-md-12" style="height:auto" id="change-chart">\
                                </div>\
                                <div class="col-md-12" style="height:auto" id="chartdiv">\
                                </div>\
                                <div class="col-md-12" id="station-btn">\
                                </div>\
                            </div >';
        $synopChart.html(template);
        let chartDatas = [];
        $.each(result.data, function (index, data) {
            let item = {};
            let timeStr = data.Times.replace("Ngày: ", "").split(" ");
            let date = timeStr[1].split('-');
            item['time'] = timeStr[0] + "/" + date[0];
            $.each(data.items, function (idx, value) {
                item[value.Name] = Number(value.ValueStr) == -9999 ? 0 : Number(value.ValueStr);
            });
            chartDatas.push(item);
        });
        let graph = [], axes = [], labels = [];
        let unit = {};
        let ctr = 0;

        $.each(result.vars, function (index, value) {
            let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            value = value.trim();
            $.each(ChartUnitEnum, function (idx, item) {
                if (item.VarName.indexOf(value) > -1) {
                    if (!unit[item.Name]) {
                        unit[item.Name] = item.SymBol;
                        axes.push({
                            "id": item.Name,
                            "title": item.SymBol,
                            "axisColor": color,
                            "axisThickness": 2,
                            "axisAlpha": 1,
                            "position": "left",
                            "axisTitleOffset": -20,
                            "offset": ctr * 60,
                        });
                        //labels.push({
                        //    "text": item.SymBol,
                        //    "bold": true,
                        //    "x": -60*ctr,
                        //    "y": 5
                        //});
                        ctr++;
                    }
                    let graphOptions = {
                        "title": value + "(" + item.SymBol + ")",
                        "balloonText": "[[title]]: <b>[[value]]</b>",
                        "bullet": "circle",
                        "bulletSize": 2,
                        "bulletBorderColor": color,
                        "bulletBorderAlpha": 1,
                        "bulletBorderThickness": 2,
                        "valueField": value,
                        "type": "smoothedLine",
                        "valueAxis": item.Name,
                    }
                    if (value.indexOf('Rain') > -1) {
                        graphOptions.fillColors = color;
                        graphOptions.fillAlphas = 0.7;
                        graphOptions.type = "column";
                        graphOptions.fixedColumnWidth = 10
                        graphOptions.bullet = false
                    }
                    graph.push(graphOptions);

                }
            });
        });

        changeChart = AmCharts.makeChart("change-chart", {
            "type": "serial",
            "theme": "light",
            "dataProvider": chartDatas,
            "gridAboveGraphs": true,
            //"allLabels": labels,
            "valueAxes": axes,
            "graphs": graph,
            "chartCursor": {
                "categoryBalloonEnabled": false,
                "cursorAlpha": 0,
                "zoomable": false
            },
            "categoryField": "time",
            "categoryAxis": {
                "gridPosition": "start",
                "gridAlpha": 0,
                labelRotation: 45
            },
            "legend": {},
            "export": {
                "enabled": true,
                "menu": [{
                    "class": "export-main",
                    "menu": [{
                        "label": "Tải biểu đồ",
                        "menu": ["PNG", "JPG"]
                    }]
                }]
            }
        });

        $("#change-chart").height(450);
        $.each(result.stations, function (index, value) {
            let btnClass = result.stationId === value.Sid ? "btn btn-success" : "btn btn-info";
            $("#station-btn").append(' <button class="' + btnClass + '" data-stn-btn="' + value.Name + '">' + value.Name + '</button>');
        });
        $synopChart.find('[data-stn-btn]').on('click', function () {
            _stationName = $(this).data('stnBtn');
            private.showResult(_stationName, _varName, "var");
        });

    };
    private.activeSynopBtn = function () {
        $synopTable.find('[data-var-btn]').on('click', function () {
            _varName = $(this).data('varBtn');
            private.showResult(_stationName, _varName, "station");
        });
        $synopTable.find('[data-stn-btn]').on('click', function () {
            _stationName = $(this).data('stnBtn');
            private.showResult(_stationName, _varName, "var");
        });
        $synopTable.find('[data-time-btn]').on('click', function () {
            _varName = $(this).data('timeBtn');
            private.showResult(_stationName, _varName, "time");
        });
    };
    private.loadVars = function () {
        $.get('/ProductForeCast/GetVars').done(function (varArr) {
            $varContainer.empty();
            $.each(varArr, function (index, value) {
                let tempLate = '<div class="col-md-3 ' + value.Name + '">\
                                    <label class="mt-checkbox mt-checkbox-outline">\
                                        <input type="checkbox" data-var="' + value.Name + '" data-var-title="' + value.Description + '"> ' + value.Name + '\
                                        <span title="'+ value.Description + '"></span>\
                                    </label>\
                                </div>';
                $varContainer.append(tempLate);
            });
        });
    };
    private.loadStations = function (areaIds) {
        let data = areaIds ? { AreaStr: areaIds } : {};
        $.post('/ProductForeCast/GetStationsByAreaIds', data).done(function (result) {
            stationDd.empty();
            $.each(result, function (index, stn) {
                stationDd.append($('<option/>').val(stn.Sid).text(stn.Name));
            });
            _stations = null;
            private.reloadMs(stationDd, private.onStationChange);
        });
    };
    private.loadAreas = function () {
        $.get('/ProductForeCast/GetAreas', {}).done(function (result) {
            areaDd.empty();
            $.each(result, function (index, area) {
                areaDd.append(
                    $('<option/>').val(area.Area_Id).text(area.Area_Name)
                );

                private.reloadMs(areaDd, private.onAreaChange);
            });
        });
    };
    private.reloadMs = function ($element, change) {
        let changeFunc = typeof change === 'function' ? change : function () { };
        $element.multiselect("destroy").multiselect({
            includeSelectAllOption: true,
            selectAllValue: 'multiselect-all',
            selectAllJustVisible: true,
            buttonWidth: '140',
            maxHeight: '150',
            onChange: changeFunc,
            onSelectAll: function () {
                if ($element === areaDd) {
                    _areas = "all";
                    private.loadStations(null);
                    private.onAreaChange();
                }
                if ($element === stationDd) {
                    _stations = "all";
                    private.onStationChange();
                }
            },
            onDeselectAll: function () {
                if ($element === areaDd) {
                    _areas = null;
                    private.loadStations("not select");
                    private.onAreaChange();
                }
                if ($element === stationDd) {
                    _stations = null;
                    private.onStationChange();
                }
            }
        });
    };

    private.onStationChange = function (element, checked) {
        let brands = stationDd.find('option:selected');
        _stations = [];
        $(brands).each(function (index, brand) {
            _stations.push($(this).text());
        });
    };

    private.onAreaChange = function (element, checked) {
        let brands = areaDd.find(' option:selected');
        _areas = [];
        $(brands).each(function (index, brand) {
            _areas.push($(this).text());
        });
        _areas = _areas.join(' ; ');
        private.loadStations(_areas);

    };

    private.handleTheme = function () {
        $(window).resize(function () {
            setTimeout(function () {
                var contentHeight = $('.page-content-body').height();
                $('.accordion').height(contentHeight - 55);
                var searchPanelHeight = contentHeight - 238;
                var formPanelHeight = contentHeight - 183;
                $('#collapse_3_2 .form-body').height(searchPanelHeight);
                $('#collapse_3_1 .form-body').height(formPanelHeight);
            }, 100);
        });
        setTimeout(function () {
            var contentHeight = $('.page-content-body').height();
            $('.accordion').height(contentHeight - 55);

            var searchPanelHeight = contentHeight - 238;
            var formPanelHeight = contentHeight - 183;
            $('#collapse_3_2 .form-body').height(searchPanelHeight);
            $('#collapse_3_1 .form-body').height(formPanelHeight);

            if (!$('#product-fore-cast').hasClass('active')) {
                $('#product-fore-cast').addClass('active');
            }
        }, 100);

        setTimeout(function () {
            let height = $('.page-sidebar').height();
            $("#main-wrapper").css('min-height', height);
            $("#map-wrapper").css('min-height', height);
            $("#map").css('min-height', height);
        }, 200);

    };
    private.msToKts = function (ms) {
        return 1.943844 * Number(ms);
    }

    return public;
}();
$(document).ready(function () {
    SynopMonitor.init();
});

