// pages/order/index/index.js
const app = getApp();
const api = require("../../../utils/api.js");
import Dialog from "../../../miniprogram_npm/@vant/weapp/dialog/dialog";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cancel: [],
    expire: [],
    standby: [],
    obligation: [],
    obligationCount: 0,
    standbyCount: 0,
    alreadyListCount: 0,
    expireCount: 0,
    cancelCount: 0,
    alreadyList: [],
    pageEnd: false,
    pageLoading: false,
    alreadyLoading: false,
    alredayPageEnd: false,
    active: 0,
    activityList: [],
    maxResult: 10,
    pageNo: 1,
    alreagrPageNo: 1,
    redPay: [],
    orderList: [],
    orderId: "",
    time: 30 * 60 * 60 * 1000,
    timeData: {},
    show: false,
    cause: [
      {
        id: 1,
        cause: "收货地址或手机号填错了",
      },
      {
        id: 2,
        cause: "忘记支付密码/余额不足",
      },
      {
        id: 3,
        cause: "无法正常支付",
      },
      {
        id: 4,
        cause: "不想买了",
      },
      {
        id: 5,
        cause: "其他原因",
      },
    ],
    activityPageEnd: false,
    activityLoading: false,
    activityPageSize: 10,
    activityPageNo: 1,
  },
  onShow: function () {
    this.setData({
      cancel: [],
      expire: [],
      standby: [],
      obligation: [],
      alreadyList: [],
      activityList: [],
      orderList: [],
      obligationCount: 0,
      standbyCount: 0,
      alreadyListCount: 0,
      expireCount: 0,
      cancelCount: 0,
      pageNo: 1,
    });
    this.getActivityList();
    //全部
    this.orderAllList();
    //已过期
    this.obligation();
    //待使用
    this.standby();
    //已完成和待评价
    this.remark();
    //y已过期
    this.expire();
    //已取消
    this.cancel();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (JSON.stringify(options) != "{}") {
      var index = parseInt(options.active);
    } else {
      index = 0;
    }
    this.setData({
      active: index,
    });

    this.getActivityList();
    //全部
    // this.orderAllList();
    //已过期
    // this.obligation();
    // //待使用
    // this.standby();
    // //已完成和待评价
    // this.remark();
    // //y已过期
    // this.expire();
    // //已取消
    // this.cancel();
  },
  onReachBottom: function () {
    //上拉4s店
    if (this.data.active == 0) {
      console.log(this.data.pageEnd + "  " + this.data.pageLoading);
      if (!this.data.pageEnd && !this.data.pageLoading) {
        this.setData({
          pageNo: this.data.pageNo + 1,
        });
        this.orderAllList();
      }
    }
  },
  onRadio(event) {
    this.setData({
      radio: event.detail,
    });
  },
  onChange(event) {
    this.setData({
      active: event.detail.name,
      show: false,
    });
  },
  onClose() {
    this.setData({
      show: false,
    });
  },
  /**
   * 获取所有订单
   */
  orderAllList() {
    var token = wx.getStorageSync("token");
    api.orderAllList(
      {
        Authorization: token,
        maxResult: this.data.maxResult,
        pageNo: this.data.pageNo,
        statusFlag: "",
      },
      (success) => {
        if (this.data.pageNo <= success.data.dto.pagination.pageCount) {
          this.setData({
            orderList: this.data.orderList.concat(success.data.dto.list),
          });
        }
        //判断是否长度大于总条数
        console.log(success.data.dto.pagination.recordCount);
        console.log(this.data.orderList.length + "zheshi ");
        if (this.data.pageNo == success.data.dto.pagination.pageCount) {
          this.setData({
            pageEnd: true,
            pageLoading: true,
          });
        }
        console.log(this.data.orderList);
      }
    );
  },
  //加载已完成和待评价列表
  remark() {
    var token = wx.getStorageSync("token");
    debugger;
    api.orderAllList(
      {
        Authorization: token,
        maxResult: 10,
        pageNo: 1,
        statusFlag: 4,
      },
      (success) => {
        this.setData({
          alreadyList: this.data.alreadyList.concat(success.data.dto.list),
          alreadyListCount: success.data.dto.pagination.recordCount,
        });
      }
    );
    api.orderAllList(
      {
        Authorization: token,
        maxResult: this.data.maxResult,
        pageNo: this.data.pageNo,
        statusFlag: 5,
      },
      (success) => {
        this.setData({
          alreadyList: this.data.alreadyList.concat(success.data.dto.list),
          alreadyListCount:
            this.data.alreadyListCount +
            success.data.dto.pagination.recordCount,
        });
      }
    );
  },
  /**
   * 获取待付款订单
   */
  obligation() {
    var token = wx.getStorageSync("token");
    api.orderAllList(
      {
        Authorization: token,
        maxResult: this.data.maxResult,
        pageNo: this.data.pageNo,
        statusFlag: 1,
      },
      (success) => {
        this.setData({
          obligation: success.data.dto.list,
          obligationCount: success.data.dto.pagination.recordCount,
        });
      }
    );
  },
  /**
   * 获取待使用订单
   */
  standby() {
    var token = wx.getStorageSync("token");
    api.orderAllList(
      {
        Authorization: token,
        maxResult: this.data.maxResult,
        pageNo: this.data.pageNo,
        statusFlag: 3,
      },
      (success) => {
        this.setData({
          standby: success.data.dto.list,
          standbyCount: success.data.dto.pagination.recordCount,
        });
      }
    );
  },
  /**
   * 获取已过期订单
   */
  expire() {
    var token = wx.getStorageSync("token");
    api.orderAllList(
      {
        Authorization: token,
        maxResult: this.data.maxResult,
        pageNo: this.data.pageNo,
        statusFlag: 6,
      },
      (success) => {
        this.setData({
          expire: success.data.dto.list,
          expireCount: success.data.dto.pagination.recordCount,
        });
      }
    );
  },
  /**
   * 获取已取消订单
   */
  cancel() {
    var token = wx.getStorageSync("token");
    api.orderAllList(
      {
        Authorization: token,
        maxResult: this.data.maxResult,
        pageNo: this.data.pageNo,
        statusFlag: 2,
      },
      (success) => {
        this.setData({
          cancel: success.data.dto.list,
          cancelCount: success.data.dto.pagination.recordCount,
        });
      }
    );
  },
  //获取活动列表
  getActivityList() {
    api.getActivityList(
      {
        maxResults: 10,
        pageNo: 1,
        shopId: "",
        status: 1,
      },
      (success) => {
        this.setData({
          activityList: success.data.dto.list,
        });
      }
    );
  },
  /**
   * 获取待付款商品
   *  */
  getOrder(orderId) {
    var token = wx.getStorageSync("token");
    api.getOrder(
      {
        Authorization: token,
        orderId,
      },
      (success) => {
        this.setData({
          redPay: success.data.dto,
        });
      }
    );
  },
  /***
   * 去支付
   */
  goPay(e) {
    console.log(e);
    var token = wx.getStorageSync("token");
    var orderId = e.currentTarget.dataset.operation.id;
    api.prepareWeixinPay(
      {
        orderId,
        Authorization: token,
      },
      (success) => {
        wx.requestPayment({
          nonceStr: success.data.dto.nonce_str,
          package: success.data.dto.package,
          paySign: success.data.dto.paySign,
          timeStamp: success.data.dto.timeStamp,
          signType: "MD5",
          success: (result) => {
            wx.reLaunch({
              url: "../../order/index/index",
            });
          },
          fail: (res) => {
            //跳转到待付款页面
            wx.reLaunch({
              url: "../../readyPay/index/index?orderId=" + orderId,
            });
          },
        });
      }
    );
  },
  timeChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },
  cancle(e) {
    console.log(e);
    //发送取消请求
    this.setData({
      show: true,
      orderId: e.currentTarget.dataset.operation.id,
    });
  },
  //发送取消请求
  submit() {
    var index = this.data.radio;
    var data = "";
    for (var i = 0; i < this.data.cause.length; i++) {
      if (index == this.data.cause[i].id) {
        data = this.data.cause[i].cause;
      }
    }
    var token = wx.getStorageSync("token");
    api.cancleOrder(
      {
        Authorization: token,
        orderId: this.data.orderId,
        remark: data,
        statusFlag: 2,
      },
      (success) => {
        this.setData({
          orderList: [],
          show: false,
        });
        wx.showToast({
          title: "订单取消成功",
          icon: "none",
        });
        this.onShow();
      }
    );
  },

  //弹窗
  delete(e) {
    var token = wx.getStorageSync("token");
    var orderId = e.currentTarget.dataset.operation.id;
    Dialog.confirm({
      title: "确认删除订单?",
      message: "删除之后订单无法恢复，无法处理您的售后 问题，请慎重考虑",
    })
      .then(() => {
        api.cancleOrder(
          {
            Authorization: token,
            //  orderId: ,
            orderId,
            remark: "",
            statusFlag: 7,
          },
          (success) => {
            this.setData({
              cancel: [],
            });
            this.cancel();
          }
        );
      })
      .catch(() => {
        // on cancel
      });
  },
  //去使用
  goUse(e) {
    wx.navigateTo({
      url:
        "../../useCoupon/index/index?orderId=" +
        e.currentTarget.dataset.operation.id,
    });
  },
  //去评论
  goRemark(e) {
    console.log(e);
    wx.navigateTo({
      url:
        "../../remark/index/index?orderId=" +
        e.currentTarget.dataset.operation.id 
    });
  },
  //再次购买
  buyAgain(e) {
    var activityId = e.currentTarget.dataset.operation.activityId;
    wx.navigateTo({
      url: "../../submit/index/index?id=" + activityId,
    });
  },
  checkAll() {
    this.setData({
      active: 0,
    });
  },
});
