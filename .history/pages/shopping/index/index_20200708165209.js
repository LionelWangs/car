//获取应用实例
const app = getApp();
const api = require("../../../utils/api.js");
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    carouselList: [],
    activityList: [],
    stores: [],
    storePageEnd: false,
    storeLoading: false,
    storePageSize: 10,
    storePageNo: 1,
    activity: "",
    shopId: "",
    id: "",
    allowance: "",
    activityInfo: "",
    remarkList:[],
    remarkNum:0,
    status:1,
    bargain:false,
    mobile :'',
    user:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log(e);
    this.setData({
      shopId: e.shopId,
      id: e.id,
      status:e.status
    });
    this.getActivityListRemove(e.shopId, e.id);
    this.getActivity(e.id);
    this.getStores(e.shopId);
    this.getGoodsListWithActivityId(e.id);
    this.getRemarkList(e.id)
    this.getMember();
  },
  //获取轮播图列表
  getGoodsListWithActivityId(id) {
    api.getGoodsListWithActivityId(
      {
        pageNo: 1,
        maxResults: 99,
        activityId: id,
      },
      (success) => {
        console.log(success);
        this.setData({
          carouselList: success.data.dto.list,
        });
      }
    );
  },
  //获取活动列表
  getActivityListRemove(shopId, id) {
    api.getActivityListRemove(
      {
        pageNo: this.data.storePageNo,
        maxResults: this.data.storePageSize,
        status: 1,
        shopId: shopId,
        activityId: id,
      },
      (success) => {
        console.log(success);
        this.setData({
          activityList: success.data.dto.list,
        });
      }
    );
  },
  //获取4S店
  getStores(id) {
    api.getStores(
      {
        shopId: id,
      },
      (success) => {
        console.log(success)
        this.setData({
          stores: success.data.dto,
        });
      }
    );
  },
  //获取指定活动
  getActivity(id) {
    api.getActivity(
      {
        activityId: id,
      },
      (success) => {
        console.log(success);
        var activityInfo = success.data.dto.activityInfo.replace(
          /\<img/gi,
          '<img style="max-width:100%;height:auto"'
        );
        this.setData({
          activity: success.data.dto,
          activityInfo: activityInfo,
        });
        var a = (
          (this.data.activity.currentPrice / this.data.activity.originalPrice) *
          10
        ).toFixed(2); // 输出结果为 15.77
        this.setData({
          allowance: a,
        });
      }
    );
  },
  goBrand(e) {
    const shopId = e.currentTarget.dataset.operation.shopId;
    console.log(e);
    // const logoUrl = e.currentTarget.dataset.operation.logoUrl
    // wx.setStorage({
    //   key:"logoUrl",
    //   data:logoUrl
    // })
    wx.setStorage({
      key: "shopId",
      data: shopId,
    });
    wx.reLaunch({
      url: "../../index/index?tabActive=4",
    });
  },
  shopping(e) {
    console.log(e);
    //activityId
    var id = e.currentTarget.dataset.operation.id;
    // shopId
    var shopId = e.currentTarget.dataset.operation.shopId;
    this.getActivity(id);
    this.getActivityListRemove(shopId, id);
  },
  onShareAppMessage(e) {
    //页面分享
    if(e.target.dataset.operation == 1){
      return {
        title: "优惠券",
        desc: "分享页面的内容",
        link: "https://www.aoshuomusic.com",
        path:
          "pages/shopping/index/index?shopId=" +
          this.data.shopId +
          "&id=" +
          this.data.id +
          "", // 路径，传递参数到指定页面。
      };
    }
    //砍价分享
    else{
      return {
        title: this.data.user.memberName+"正在邀请您砍单，就差你这刀",
        desc: "分享页面的内容",
        link: "https://www.aoshuomusic.com",
        path:
          "pages/bargain/index/index?mobile="+this.data.mobile+"&activityId="+this.data.activity.id, // 路径，传递参数到指定页面。
        imageUrl:this.data.activity.listImage
      };
    }

   
  },
  //点击立即购买
  clickBuy() {
   var mobile =  wx.getStorageSync("mobile")
    if(mobile != ""){
    wx.navigateTo({
      url: "../../submit/index/index?id=" + this.data.id + "",
    });
  }
  else{
    Dialog.confirm({
      message: '请先登录或获取手机号',
    })
      .then(() => {
        wx.reLaunch({
          url:'../../my/index/index'
        })
      })
      .catch(() => {
        // on cancel
      });
  }
  },
  //获取评价列表
  getRemarkList(id){
    api.remarkList({
        activityId:id,
        pageNo:1,
    },(success)=>{
      console.log(success)
      this.setData({
        remarkList:success.data.dto.list,
        remarkNum:success.data.dto.pagination.recordCount
      })
    }
    )
  },
  //砍价
  showBargain(){
    var mobile =  wx.getStorageSync("mobile")
    if(mobile == ''){
      Dialog.confirm({
        message: '请先登录或获取手机号',
      })
        .then((e) => {
          wx.reLaunch({
            url:'../../my/index/index'
          })
        })
        .catch(() => {
          // on cancel
        });
    }
    else{
      this.setData({
        bargain : true,
        mobile
      })
    }
  },
  bargainClose(){
    this.setData({
      bargain:false
    })
  },
  //获取用户信息
  getMember(){
    var mobile =  wx.getStorageSync("mobile")
    api.getMember({
      mobile : mobile,
      unionId:''
    },(success)=>{
      this.setData({
        user:success.data.dto
      })
    }
    )
  }
});
