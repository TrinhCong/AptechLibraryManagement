var ResponseCodes = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_AUTHORIZED: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    ERROR: 417
};

var ChartUnitEnum = [
    { VarName: ["t", "td", "Tmax", "Tmin"], Name: "degree", SymBol: "°C" },
    { VarName: ["ps", "pmsl"], Name: "hPa", SymBol: "hPa" },
    { VarName: ["vv"], Name: "km", SymBol: "km" },
    { VarName: ["h"], Name: "m", SymBol: "m" },
    { VarName: ["ff", "T.độ"], Name: "ms", SymBol: "m/s" },
    { VarName: ["Rain06", "Rain12", "Rain18", "Rain24"], Name: "mmh", SymBol: "mm/h" },
    { VarName: ["ww", "dd", "n"], Name: "unknown", SymBol: "" },
    { VarName: ["Đ.ẩm"], Name: "Độ ẩm tương đối", SymBol: "%" },
    { VarName: ["T.tiết"], Name: "Hiện tượng thời tiết", SymBol: "" },
    { VarName: ["H.gió"], Name: "Hướng gió", SymBol: "Theo 16 hướng gió chính" }
];

var EnumStepType = {
    All: 1,
    Text: 2,
    Check: 3
}
var EnumStepTypeString = ["", "All", "Text", "Check"];

var EnumStep = {
    First: "first-step",
    Last: "last-step",
    Normal: "normal-step",
    Final: "final-step",
    Start: "start-step",
    RiskDeter: "risk-deter",
    BullProvider: "bull-provider"
}
var EnumFileNameRules = {
    yyyy: "yyyy",
    yy: "yy",
    mm: "mm",
    dd: "dd",
    pp: "pp",
    ymd: "ymd",
    ymdh: "ymdh",
    ymdhp: "ymdhp",
    hhpp: "hhpp",
    sid: "sid",
    var: "var",
    txt: "txt",
    dvdb: "dvdb",
    loai: "loai"
}

var EnumRiskType = {
    R: "R",
    E: "E",
    H: "H",
    V: "V"
}