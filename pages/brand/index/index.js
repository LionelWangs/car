// pages/brand/index/index.js
const api = require('../../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    canvas_width: 200,
    canvas_height: 300,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var id = options.brandId;
      this.setData({
        brandId:id
      })
      this.getGoodsListWithBrandId(id)
      this.getActivityListByBrandId(id)
      this.getBrandDetails(id)
  },

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
        console.log(success)
        this.setData({
          activityList: success.data.dto.list
        })
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
    wx.navigateTo({
      url:"../../shopping/index/index?shopId=" + shopId +"&id="+id+'&status='+this.data.status
    })
  },
  canvas() {
    var ctx = wx.createCanvasContext('my_canvas', this)
    var canvas_width = this.data.canvas_width,
      canvas_height = this.data.canvas_height;
    var img = this.data.img;
    wx.getImageInfo({
      src: img,
      success(res) {
        console.log(res.width, res.height);

        var img_width = res.width,
          img_height = res.height;

        var clip_left, clip_top, //左偏移值，上偏移值，
          clip_width, clip_height; //截取宽度，截取高度

        clip_height = img_width * (canvas_height / canvas_width);
        if (clip_height > img_height) {
          clip_height = img_height;
          clip_width = clip_height * (canvas_width / canvas_height);
          clip_left = (img_width - clip_width) / 2;
          clip_top = 0;
        } else {
          clip_left = 0;
          clip_top = (img_height - clip_height) / 2;
          clip_width = img_width
        }

        var data = {
          clip_left,
          clip_top,
          clip_width,
          clip_height
        }

        ctx.drawImage(img, clip_left, clip_top, clip_width, clip_height, 0, 0, canvas_width, canvas_height);
        ctx.draw();
      }
    })
  }
})