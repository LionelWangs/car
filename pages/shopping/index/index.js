//获取应用实例
const app = getApp()
const api = require('../../../utils/api.js')
import {
  IMG_PATH
} from "../../../config/appConfig.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carouselList: [],
    activityList:[],
    stores:[],
    storePageEnd: false,
    storeLoading: false,
    storePageSize: 10,
    storePageNo: 1,
    activity:"",
    shopId:'',
    allowance:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log(e)
    this.getActivityList(e.shopId);
    this.getActivity(e.id);
    this.getStores(e.shopId)
    this.getGoodsListWithShopId(e.shopId)
  },
  //   /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {
  //   //上拉4查询服务
  //     if (!this.data.storePageEnd && !this.data.storeLoading) {
  //       this.setData({
  //         storeLoading: true,
  //         storePageNo: this.data.storePageNo + 1
  //       });
  //       this.getActivityList();
  //     }
  // },
    //获取轮播图列表
    getGoodsListWithShopId(id) {
      api.getGoodsListWithShopId({
        pageNo: 1,
        maxResults: 99,
        shopId : id,
        type : 3
      }, success => {
        console.log(success)
        this.setData({
          carouselList: success.data.dto.list
        })
      })
    },

   //获取活动列表
   getActivityList(id) {
    api.getActivityList({
      pageNo:this.data.storePageNo,
      maxResults:this.data.storePageSize,
      status:1,
      shopId:id
    }, success => {
      this.setData({
        activityList: success.data.dto.list
      })
    })
  },
  //获取4S店
  getStores(id){
    api.getStores({
      shopId : id
    } , success => {
      this.setData({
        stores:success.data.dto
      })
    }
    )
  }
,
  clickBuy(){
    wx.showToast({
      title: '还未开发',
      duration: 2000
    })
  }
  ,
  //获取指定活动
  getActivity(id){
    api.getActivity({
      activityId:id
    } ,success =>{
      this.setData({
        activity:success.data.dto
      })
      var a = ((this.data.activity.currentPrice / this.data.activity.originalPrice) * 10).toFixed(1); // 输出结果为 15.77
      this.setData({
        allowance:a
      })
    }
    
    )
  }
  ,
  goBrand(e){
    const  brandId = e.currentTarget.dataset.operation.brandId
    // const logoUrl = e.currentTarget.dataset.operation.logoUrl
    // wx.setStorage({
    //   key:"logoUrl",
    //   data:logoUrl
    // })
    wx.setStorage({
      key:"brandId",
      data:brandId
    })
    wx.reLaunch({
      url:"../../index/index?tabActive=5"
    })
  }

})