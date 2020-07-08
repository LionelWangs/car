const api = require('../../../utils/api.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    icon: {
      normal: '../../../images/unchecked.png',
      active: '../../../images/check.png',
    }
    ,
    radio: "",
    nowPrice: 0,
    color: "#999999",
    coupon: [],
  },

  lifetimes: {
    created() {
      this.getCouponList()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //根据手机号获取优惠券
    getCouponList(){
    var mobile =  wx.getStorageSync("mobile")
    api.getCouponList(
      {
       mobile
      },
      (success) => {
        console.log(success)
        this.setData({
          coupon:success.data.dto.list
        })
      }
    );
    }
,
    onChange(event) {
      console.log(event)
      if (event.detail == this.data.radio) {
        this.setData({
          radio: 0,
        });
      } else
        this.setData({
          radio: event.detail,
        });
    },
    onShow(e) {
      console.log(e)
      this.setData({
        nowPrice: e,
      });
    },
    //点击确定后
    confim(e) {
      // 获取选中的id
      var coupon = this.data.radio;
      console.log(coupon)
      var data = [];
      //获取对应Id所属对象
      var couponList  = this.data.coupon;
      for(var i = 0 ; i < couponList.length ; i ++){
        for(var j = 0 ; j < coupon.length ; j++ ){
          if(couponList[i].id == coupon[j]){
            data.push(couponList[i])
          }
        }
      }
      console.log(data)
      this.triggerEvent("myevent", data);
    },
  },
});

