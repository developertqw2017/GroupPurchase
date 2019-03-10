//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    addressList:[]
  },

  selectTap: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: 'https://qgdxsw.com:8000/league/address/update',
      method: "POST",
      header: { "Content-Type": "application/x-www-form-urlencoded", 'Authorization': 'Token ' + token},
      data: {
        token: wx.getStorageSync('token'),
        id:id,
        isDefault:'true'
      },
      success: (res) =>{
        console.log(res)
        wx.navigateBack({})
      }
    })
  },

  addAddess : function () {
    wx.navigateTo({
      url:"/pages/address-add/index"
    })
  },

  editAddess: function (e) {
    wx.navigateTo({
      url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
    })
  },

  onLoad: function () {
    console.log('onLoad')


  },
  onShow : function () {
    this.initShippingAddress();
  },
  initShippingAddress: function () {
    var that = this;
    wx.request({
      url: "https://qgdxsw.com:8000/league/addressss/",
      method:"GET",
      header: { 'Content-Type': 'application/json',
                'Authorization': 'Token '+wx.getStorageSync('token')},
      success: (res) =>{
        if (res.data.data) {
          console.log(res)
          that.setData({
            addressList:res.data.data
          });
        } else if (res.statusCode != 200){
          that.setData({
            addressList: null
          });
        }
      }
    })
  }

})
