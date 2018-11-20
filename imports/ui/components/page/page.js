import './jbootstrappage/jBootstrapPage.js';

PageTools = {
    /**
     * 初始化 分页所有的配置
     */
    init: function (skip, limit, total) {
        if (skip != null)
            Session.set("TableSkipKey", skip);
        else
            Session.set("TableSkipKey", 0);
        if (limit != null)
            Session.set("TableLimitKey", limit);
        else
            Session.set("TableLimitKey", 10);
        if (total != null)
            Session.set("TableTotalKey", total);
        else
            Session.set("TableTotalKey", 0);
    },
    /**
     * 刷新分页控件
     */
    refresh: function () {
        $(".pagination").jBootstrapPage({
            pageSize: Session.get("TableLimitKey"),
            total: Session.get("TableTotalKey"),
            maxPageButton: 10,
            onPageClicked: function (obj, pageIndex) {
                // alert((pageIndex+1)+'页');
                Session.set("TableSkipKey", Session.get("TableLimitKey") * (pageIndex));
            }
        });
    },
    /**
     * 设置总条数
     * @param total
     */
    setTotal: function (total) {
        if (total != null)
            Session.set("TableTotalKey", total);
        else
            Session.set("TableTotalKey", 0);
    },
    /**
     * 设置 skip
     * @param skip
     */
    setSkip: function (skip) {
        if (skip != null)
            Session.set("TableSkipKey", skip);
        else
            Session.set("TableSkipKey", 0);
    },
    /**
     * 设置每页大大小 limit
     * @param limit
     */
    setLimit: function (limit) {
        if (limit != null) {
            Session.set("TableLimitKey", limit);
            PageTools.refresh();
        }
        else
            Session.set("TableLimitKey", 20);
    },
    getCollectionCount: function (methodName, search) {
        Meteor.call(methodName, search, function (err, count) {
            PageTools.setTotal(count);
            PageTools.refresh();
        });
    },
}