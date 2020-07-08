// pages/components/redenvelopes/redenvelopes.js
const api = require("../../../utils/api.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {},
  lifetimes: {
    created() {
      this.getredList();
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    icon: {
      normal: "../../../images/unchecked.png",
      active: "../../../images/check.png",
    },
    radio: [],
    red: [],
    nowPrice: "",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取父组件传来的值
    Show(e) {
      console.log(e);
      this.setData({
        nowPrice: e,
      });
    },
    //根据手机号获取红包
    getredList() {
      var mobile = wx.getStorageSync("mobile");
      api.getredList(
        {
          mobile,
        },
        (success) => {
          console.log(success);
          this.setData({
            red: success.data.dto.list,
          });
        }
      );
    },
    onChange(event) {
      this.setData({
        radio: event.detail,
      });
    },
    //点击确定后
    confim() {
      // 获取选中的id
      var red = this.data.radio;
      console.log(red)
      var data = [];
      //获取对应Id所属对象
      var redList  = this.data.red;
      for(var i = 0 ; i < redList.length ; i ++){
        console.log(redList[i].id)
        for(var j = 0 ; j < red.length ; j++ ){
          if(redList[i].id == red[j]){
            data.push(redList[i])
          }
        }
      }
      console.log(data)
      this.triggerEvent("myevent", data);
    },
  },
});
