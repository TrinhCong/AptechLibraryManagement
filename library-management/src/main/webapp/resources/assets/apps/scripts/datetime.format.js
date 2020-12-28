(function (jQuery) {

    let supportFormat = {
        YEAR: "yyyy",
        MONTH: "MM",
        DATE: "dd",
        HOUR: "HH",
        MINUTE: "mm",
        SECOND: "ss"
    };

    //only support (yyyy,MM,dd,HH,mm,ss)
    jQuery.dateTime = (function () {
        let now = new Date();
        let defaultTime = {
            DATE: now.getDate(),
            MONTH: now.getMonth()+1,
            YEAR: now.getFullYear(),
            HOUR: now.getHours(),
            MINUTE: now.getMinutes(),
            SECOND: now.getSeconds()
        };
        let getDisplayNumber = (number, type) => {
            let standardLength = type === supportFormat.YEAR ? 4 : 2;
            let length = number.toString().length;
            if (standardLength > length)
                for (let i = length; i < standardLength; i++) {
                    number = "0" + number;
                }
            return number;
        };
        return {
            stringToDate(string, format) {
                let time = defaultTime;
                if (string.length === format.length) {
                    $.each(supportFormat, function (index, sFormat) {
                        let idx = format.indexOf(sFormat);
                        let length = sFormat.length;
                        if (idx > -1)
                            time[index] = Number(string.substring(idx, idx + length));
                    });
                    return new Date(time.YEAR, time.MONTH-1, time.DATE, time.HOUR, time.MINUTE, time.SECOND);
                }
                else
                    throw "value and date format is not match";
            },

            dateToString(datetime, format) {
                if (datetime instanceof Date) {
                    let time = {
                        DATE: datetime.getDate(),
                        MONTH: datetime.getMonth()+1,
                        YEAR: datetime.getFullYear(),
                        HOUR: datetime.getHours(),
                        MINUTE: datetime.getSeconds(),
                        SECOND: datetime.getSeconds()
                    };
                    let isValid = false;
                    $.each(supportFormat, function (index, sFormat) {
                        if (format.indexOf(sFormat) > -1) {
                            format = format.replace(sFormat, getDisplayNumber(time[index]));
                            isValid = true;
                        }
                    });
                    if (!isValid)
                        throw "not recognize date format param";
                }
                else
                    throw "object pass as param is not datetime type";
                return format;
            },

            stringToString(string, fromFormat, toFormat) {
                if (string.length === fromFormat.length) {
                    $.each(supportFormat, function (index, sFormat) {
                        let idx = fromFormat.indexOf(sFormat);
                        let length = sFormat.length;
                        if (idx > -1)
                            toFormat = toFormat.replace(sFormat, getDisplayNumber(Number(string.substring(idx, idx + length))));
                    });
                }
                else
                    throw "value and date format is not match";
                return toFormat;
            }
        };
    }());
}(jQuery));
