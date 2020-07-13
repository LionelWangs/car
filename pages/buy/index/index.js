//获取应用实例
const app = getApp();
const api = require("../../../utils/api.js");

Page({
  data: {
    maxResults:10,
    pageNo:1,
    activityList:[]
  },

  onLoad: function (option) {
    wx.setNavigationBarTitle({
      title:option.title
    })
    let serveTypeId = option.serveTypeId;
    this.getActivityListByServerTypeId(serveTypeId)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  //获取该服务下的
  getActivityListByServerTypeId(serveTypeId){
    api.getActivityListByServerTypeId({
      maxResults:this.data.maxResults,
      pageNo:this.data.pageNo,
      status:1,
      serveTypeId
    },(success)=>{
      console.log(success)
      this.setData({
        activityList:success.data.dto.list
      })
    }
    )
  },
  goactivity(e) {
    debugger
    var shopId = e.currentTarget.dataset.operation.shopId;
    var activityId = e.currentTarget.dataset.operation.id;
    var status = 1;
    wx.navigateTo({
      url:
        "../../shopping/index/index?shopId=" +
        shopId +
        "&id=" +
        activityId +
        "&status=" +
        status,
    });
  },
});
