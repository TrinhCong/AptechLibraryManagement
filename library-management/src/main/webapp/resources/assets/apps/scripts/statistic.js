class Statistic {
    constructor() {
        this.$tBody = $("#statistic_tbl tbody").empty();
        $.post("/library-management/statistic/list").done(xhr => {
            if (xhr.success) {
                xhr.data.forEach(item => {
                    this.$tBody.append(`
<tr class="account-type-row">
    <td class="account-name">
        ${item.name}
    </td>
    <td class="account-count text-${item.color}">${item.total}</td>
    <td class="statistic-percent">
        <table width="100%" cellspacing="0" cellpadding="0" border="0">
            <tbody>
                <tr>
                    <td style="width:${item.percent}%" class="colour-bar-cont" valign="center">
                        <div class="colour-bar border-dark bg-${item.color}"></div>
                    </td>
                    <td class="text-${item.color}" style="width:${100 -item.percent}%">&nbsp;&nbsp;&nbsp;${item.percent.toFixed(2)}%</td>
                </tr>
            </tbody>
        </table>
    </td>
</tr>`);
                });

            }
        });
    }
}
$(document).ready(_ => {
    new Statistic();
});