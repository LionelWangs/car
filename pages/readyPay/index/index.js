import { API_PATH } from "../../../config/appConfig";
const api = require("../../../utils/api.js");
// pages/readyPay/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: {
      normal: "../../../images/unchecked.png",
      active: "../../../images/check.png",
    },
    order:[],
    show:false,
    cause:[
      {
        id:1,
        cause:'收货地址或手机号填错了'
      },
      {
        id:2,
        cause:'忘记支付密码/余额不足'
      },
      {
        id:3,
        cause:'无法正常支付'
      },
      {
        id:4,
        cause:'不想买了'
      },
      {
        id:5,
        cause:'其他原因'
      }

    ],
    radio:1,
    orderId:""
  },
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    this.getOrder(options.orderId)
  },
  //获取订单
  getOrder(orderId){
    var token = wx.getStorageSync("token");
    this.setData({
      orderId
    })
    api.getOrder({
      Authorization: token,
      orderId
    },(success)=>{
      console.log(success)
      this.setData({
        order:success.data.dto
      })
    }
    )
  },
//取消订单
cancle(){
  this.setData({
    show:true
  })
},
//发送取消请求
submit(){
    var token = wx.getStorageSync("token");
    var index = this.data.radio;
    var data = "";
    for(var i = 0 ; i < this.data.cause.length ; i++ ){
      if(index == this.data.cause[i].id){
        data = this.data.cause[i].cause
      }
    }
    api.cancleOrder({
      Authorization: token,
      orderId:this.data.orderId,
      remark:data,
      statusFlag:2
    },(success) =>{
      wx.reLaunch({
        url: '../../order/index/index?active=1'
      })
    }
    )
},
  //唤起支付
  onSubmit(){
    var token = wx.getStorageSync("token");
    api.prepareWeixinPay({
      orderId:this.data.orderId,
      Authorization: token,
    },(success)=>{
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
            url:
              "../../readyPay/index/index?orderId=" +
              success.data.dto.orderId,
          });
        },
      })
    }
    )
  }

})