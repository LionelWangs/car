// pages/remark/index/index.js
const app = getApp();
const api = require("../../../utils/api.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    value: 0,
    remark: "",
    order: [],
    orderId: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrder(options.orderId);
  },
  // getActivity(activityId){
  //   api.getActivity({
  //     activityId
  //   },
  //   (success) =>{
  //     this.setData({
  //       activity : success.data.dto
  //     })
  //   }
  //   )
  // }
  getOrder(orderId) {
    var token = wx.getStorageSync("token");
    api.getOrder(
      {
        Authorization: token,
        orderId,
      },
      (success) => {
        debugger;
        console.log(success);
        this.setData({
          order: success.data.dto,
          orderId
        });
      }
    );
  },
  //获取星级
  onChange(e) {
    this.setData({
      value: e.detail,
    });
  },
  //输入框
  input(e) {
    console.log(e);
    this.setData({
      remark: e.detail.value,
    });
  },
  //上传
  afterRead(event) {
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: "https://aoshuo-music.oss-cn-shanghai.aliyuncs.com/", // 仅为示例，非真实的接口地址
      success(res) {
        // 上传完成需要更新 fileList
        const { fileList = [] } = this.data;
        fileList.push({ ...file, url: res.data });
        this.setData({ fileList });
      },
    });
  },
  //评价
  remarkAdd() {
    var token = wx.getStorageSync("token");
    api.remarkAdd(
      {
        Authorization: token,
        orderId: this.data.orderId,
        remark: this.data.remark,
        stars: this.data.value,
      },
      (success) => {
        wx.navigateBack({});
      }
    );
  },
  //提交评价
  submit() {
    this.remarkAdd();
  },
});
