class __TimeUtil {
    constructor() {
        var root = this;
        $(function() {
            root._init();
        });
    }
    _init() {
        var root = this;
        root._supportedFormat = {
            YEAR: "yyyy",
            MONTH: "MM",
            DATE: "dd",
            HOUR: "HH",
            MINUTE: "mm",
            SECOND: "ss"
        };
        let now = new Date();
        root._defaultTime = {
            DATE: now.getDate(),
            MONTH: now.getMonth() + 1,
            YEAR: now.getFullYear(),
            HOUR: now.getHours(),
            MINUTE: now.getMinutes(),
            SECOND: now.getSeconds()
        };

        String.prototype.toTime = function(format) {
            var string = this;
            let time = root._defaultTime;
            if (string.length === format.length) {
                $.each(root._supportedFormat, function(index, sFormat) {
                    let idx = format.indexOf(sFormat);
                    let length = sFormat.length;
                    if (idx > -1)
                        time[index] = Number(string.substring(idx, idx + length));
                });
                return new Date(time.YEAR, time.MONTH - 1, time.DATE, time.HOUR, time.MINUTE, time.SECOND);
            } else
                throw "value and date format is not match";
        };
        Date.prototype.toString = function(format) {
            var datetime = this;
            if (datetime instanceof Date) {
                let time = {
                    DATE: datetime.getDate(),
                    MONTH: datetime.getMonth() + 1,
                    YEAR: datetime.getFullYear(),
                    HOUR: datetime.getHours(),
                    MINUTE: datetime.getSeconds(),
                    SECOND: datetime.getSeconds()
                };
                let isValid = false;
                $.each(root._supportedFormat, function(index, sFormat) {
                    if (format.indexOf(sFormat) > -1) {
                        format = format.replace(sFormat, root._displayNumber(time[index]));
                        isValid = true;
                    }
                });
                if (!isValid)
                    throw "not recognize date format param";
            } else
                throw "object pass as param is not datetime type";
            return format;
        };
        String.prototype.toTimeString = function(fromFormat, toFormat) {
            var string = this;
            if (string.length === fromFormat.length) {
                $.each(root._supportedFormat, function(index, sFormat) {
                    let idx = fromFormat.indexOf(sFormat);
                    let length = sFormat.length;
                    if (idx > -1)
                        toFormat = toFormat.replace(sFormat, root._displayNumber(Number(string.substring(idx, idx + length))));
                });
            } else
                throw "value and date format is not match";
            return toFormat;
        }
    }
    _displayNumber(number, type) {
        var root = this;
        let standardLength = type === root._supportedFormat.YEAR ? 4 : 2;
        let length = number.toString().length;
        if (standardLength > length)
            for (let i = length; i < standardLength; i++) {
                number = "0" + number;
            }
        return number;
    }
}

const TimeUtil = new __TimeUtil();