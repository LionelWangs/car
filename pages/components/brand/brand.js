// components/shop/shop.js
const app = getApp()
const api = require('../../../utils/api.js')
import {
  IMG_PATH
} from "../../../config/appConfig.js"

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    IMG_PATH,
    tabActive: 0,
    carouselList: [],
    activityList: [],
    storePageEnd: false,
    storeLoading: false,
    storePageSize: 10,
    storePageNo: 1,
    loadingFail: false,
    logoUrl:'',
    brandName:'',
    brandId :'',
    status:1,
  },
  lifetimes:{
    created() {
      const id = wx.getStorageSync("brandId");
      this.setData({
        brandId : id
      })
      this.getGoodsListWithBrandId(id)
      this.getActivityListByBrandId(id)
      this.getBrandDetails(id)
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

 //获取轮播图列表
  getGoodsListWithBrandId(id) {
  api.getGoodsListWithBrandId({
    pageNo: 1,
    maxResults: 99,
    brandId : id,
    type : 3
  }, success => {
    this.setData({
      carouselList: success.data.dto.list
    })
  })
},
//获取品牌
getBrandDetails(id){
    api.getBrandDetails({
      brandId:id
    },
    success=>{
      this.setData({
        brandName : success.data.dto.brandName,
        logoUrl : success.data.dto.logoUrl
      })
    }

    )
}
,
    //获取活动列表
    getActivityListByBrandId(id) {
      api.getActivityListByBrandId({
        pageNo:this.data.storePageNo,
        maxResults:this.data.storePageSize,
        status:this.data.status,
        brandId:id
      }, success => {
        this.setData({
          activityList: success.data.dto.list
        })
      })
    },
  back(){
    wx.reLaunch({
      url:"../index/index?tabActive=2"
    })
  },
   // 标签切换
   onChange(e) {
    var index =  e.detail.name;
    if(index == 1){
      this.setData({
        status : 0
      })
    }
    else{
    this.setData({
      status : 1
    })
    }
    this.getActivityListByBrandId(this.data.brandId);
  },

  shopping(e){
    var id = e.currentTarget.dataset.operation.id
    var shopId = e.currentTarget.dataset.operation.shopId
    console.log(shopId)
    wx.navigateTo({
      url:"../shopping/index/index?shopId=" + shopId +"&id="+id+'&status='+this.data.status
    })
  }

  }
})
