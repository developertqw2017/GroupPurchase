//index.js
//获取应用实例
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goodsDetail:{},
    swiperCurrent: 0,
    hasMoreSelect:false,
    hasCoupons:false,
    couponsList:[],
    couponsList1:[],
    selectSize:"选择：",
    selectSizePrice:0,
    shopNum:0,
    hideShopPopup:true,
    hideCouponPopup:true ,
    buyNumber:0,
    buyNumMin:1,
    buyNumMax:0,
    propertyChildIds:"",
    propertyChildNames:"",
    canSubmit:false, //  选中规格尺寸时候是否允许加入购物车
    shopCarInfo:{},
    shopType: "addShopCar",//购物类型，加入购物车或立即购买，默认为加入购物车
  },

  //事件处理函数
  swiperchange: function(e) {
      //console.log(e.detail.current)
       this.setData({
        swiperCurrent: e.detail.current
    })
  },
  onLoad: function (e) {
    if (e.inviter_id) {
      wx.setStorage({
        key: 'inviter_id_' + e.id,
        data: e.inviter_id
      })
    }
    var that = this;
    // 获取购物车数据
    wx.getStorage({
      key: 'shopCarInfo',
      success: function(res) {
        that.setData({
          shopCarInfo:res.data,
          shopNum:res.data.shopNum
        });
      }
    })
    wx.request({
      url: 'https://qgdxsw.com:8000/league/goods/detail',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      data: {
        id: e.id
      },
      success: function(res) {
        console.log(res)
        var selectSizeTemp = "";
        console.log(res.data.data.properties)
        if (res.data.data.properties) {
          for(var i=0;i<res.data.data.properties.length;i++){
            selectSizeTemp = selectSizeTemp + " " + res.data.data.properties[i].name;
          }
          that.setData({
            hasMoreSelect:true,
            selectSize:that.data.selectSize + selectSizeTemp,
            selectSizePrice: res.data.data.basicInfo[0].fields.original_price,
          });
        }
        that.data.goodsDetail = res.data.data;
        console.log(res.data.data)
        that.setData({
          goodsDetail:res.data.data,
          selectSizePrice: res.data.data.basicInfo[0].fields.original_price,
          buyNumMax: res.data.data.basicInfo[0].fields.stores,
          buyNumber: (res.data.data.basicInfo[0].fields.stores>0) ? 1: 0
        });
        WxParse.wxParse('article', 'html', res.data.data.content, that, 5);
      }
    })
    this.reputation(e.id);
    this.getCoupons(e.id);
  },
  //获取商品优惠券
  getCoupons(id){
    var self = this ;
    wx.request({
      url: 'https://qgdxsw.com:8000/league/coupons',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      data:{
        refId:id
      },
      success:function(res){
        console.log('coupons')
        console.log(res.data.data)
        if(res.data.code == 0){
          self.setData({
            hasCoupons:true,
            couponsList:res.data.data
          })
        }
      }
    })
    wx.request({
      url: 'https://qgdxsw.com:8000/league/coupons',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      data:{},
      success: function (res) {
        if (res.data.code == 0) {
          self.setData({
            hasCoupons: true,
            couponsList1: res.data.data
          })
        }
      }
    })
  },
  //用户领取优惠券
  receiveCoupons(e){
    var that = this;
    console.log(e)
    wx.request({
      url: 'https://qgdxsw.com:8000/league/coupons/fetch',
      data: {
        id: e.currentTarget.dataset.id,
        token: wx.getStorageSync('token')
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      success: function (res) {
        console.log(res)
        if (res.data.code == 20001 || res.data.code == 20002) {
          wx.showModal({
            title: '错误',
            content: '来晚了',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 20003) {
          wx.showModal({
            title: '错误',
            content: '你领过了，别贪心哦~',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 30001) {
          wx.showModal({
            title: '错误',
            content: '您的积分不足',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 20004) {
          wx.showModal({
            title: '错误',
            content: '已过期~',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 0) {
          wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  goShopCar: function () {
    wx.reLaunch({
      url: "/pages/shop-cart/index"
    });
  },
  toAddShopCar: function () {
    this.setData({
      shopType: "addShopCar"
    })
    this.bindGuiGeTap();
  },
  tobuy: function () {
    this.setData({
      shopType: "tobuy"
    });
    this.bindGuiGeTap();
    /*    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
          this.bindGuiGeTap();
          return;
        }
        if(this.data.buyNumber < 1){
          wx.showModal({
            title: '提示',
            content: '暂时缺货哦~',
            showCancel:false
          })
          return;
        }
        this.addShopCar();
        this.goShopCar();*/
  },
  /**
   * 规格选择弹出框
   */
  bindGuiGeTap: function() {
     this.setData({
        hideShopPopup: false
    })
  },
  /**
   * 优惠券弹出框
   */
  bindCouponTap:function(){
    this.setData({
      hideCouponPopup: false
    })
  },
  /**
   * 规格选择弹出框隐藏
   */
  closePopupTap: function() {
     this.setData({
        hideShopPopup: true ,
        hideCouponPopup: true
    })
  },
  numJianTap: function() {
     if(this.data.buyNumber > this.data.buyNumMin){
        var currentNum = this.data.buyNumber;
        currentNum--;
        this.setData({
            buyNumber: currentNum
        })
     }
  },
  numJiaTap: function() {
     if(this.data.buyNumber < this.data.buyNumMax){
        var currentNum = this.data.buyNumber;
        currentNum++ ;
        this.setData({
            buyNumber: currentNum
        })
     }
  },
  /**
   * 选择商品规格
   * @param {Object} e
   */
  labelItemTap: function(e) {
    var that = this;
    /*
    console.log(e)
    console.log(e.currentTarget.dataset.propertyid)
    console.log(e.currentTarget.dataset.propertyname)
    console.log(e.currentTarget.dataset.propertychildid)
    console.log(e.currentTarget.dataset.propertychildname)
    */
    // 取消该分类下的子栏目所有的选中状态
    var childs = that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods;
    for(var i = 0;i < childs.length;i++){
      that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[i].active = false;
    }
    // 设置当前选中状态
    that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[e.currentTarget.dataset.propertychildindex].active = true;
    // 获取所有的选中规格尺寸数据
    var needSelectNum = that.data.goodsDetail.properties.length;
    var curSelectNum = 0;
    var propertyChildIds= "";
    var propertyChildNames = "";
    for (var i = 0;i < that.data.goodsDetail.properties.length;i++) {
      childs = that.data.goodsDetail.properties[i].childsCurGoods;
      for (var j = 0;j < childs.length;j++) {
        if(childs[j].active){
          curSelectNum++;
          propertyChildIds = propertyChildIds + that.data.goodsDetail.properties[i].id + ":"+ childs[j].id +",";
          propertyChildNames = propertyChildNames + that.data.goodsDetail.properties[i].name + ":"+ childs[j].name +"  ";
        }
      }
    }
    var canSubmit = false;
    if (needSelectNum == curSelectNum) {
      canSubmit = true;
    }
    // 计算当前价格
    if (canSubmit) {
      wx.request({
        url: app.globalData.baseUrl +'/shop/goods/price',
        data: {
          goodsId: that.data.goodsDetail.basicInfo[0].pk,
          propertyChildIds:propertyChildIds
        },
        success: function(res) {
          that.setData({
            selectSizePrice:res.data.data.price,
            propertyChildIds:propertyChildIds,
            propertyChildNames:propertyChildNames,
            buyNumMax:res.data.data.stores,
            buyNumber:(res.data.data.stores>0) ? 1: 0
          });
        }
      })
    }


    this.setData({
      goodsDetail: that.data.goodsDetail,
      canSubmit:canSubmit
    })
  },
  /**
  * 加入购物车
  */
  addShopCar:function(){
    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
      if (!this.data.canSubmit){
        wx.showModal({
          title: '提示',
          content: '请选择商品规格！',
          showCancel: false
        })
      }
      this.bindGuiGeTap();
      return;
    }
    if(this.data.buyNumber < 1){
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel:false
      })
      return;
    }
    //组建购物车
    var shopCarInfo = this.bulidShopCarInfo();

    this.setData({
      shopCarInfo:shopCarInfo,
      shopNum:shopCarInfo.shopNum
    });

    // 写入本地存储
    wx.setStorage({
      key:"shopCarInfo",
      data:shopCarInfo
    })
    this.closePopupTap();
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 2000
    })
    //console.log(shopCarInfo);

    //shopCarInfo = {shopNum:12,shopList:[]}
  },
	/**
	  * 立即购买
	  */
  buyNow:function(){
    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
      if (!this.data.canSubmit) {
        wx.showModal({
          title: '提示',
          content: '请选择商品规格！',
          showCancel: false
        })
      }
      this.bindGuiGeTap();
      wx.showModal({
        title: '提示',
        content: '请先选择规格尺寸哦~',
        showCancel:false
      })
      return;
    }
    if(this.data.buyNumber < 1){
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel:false
      })
      return;
    }
    //组建立即购买信息
    var buyNowInfo = this.buliduBuyNowInfo();
    // 写入本地存储
    wx.setStorage({
      key:"buyNowInfo",
      data:buyNowInfo
    })
    this.closePopupTap();

    wx.navigateTo({
      url: "/pages/to-pay-order/index?orderType=buyNow"
    })
  },
  /**
   * 组建购物车信息
   */
  bulidShopCarInfo: function () {
    // 加入购物车
    var shopCarMap = {};
    console.log(this.data.goodsDetail)
    shopCarMap.goodsId = this.data.goodsDetail.basicInfo[0].pk;
    shopCarMap.pic = this.data.goodsDetail.basicInfo[0].fields.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo[0].fields.name;
    // shopCarMap.label=this.data.goodsDetail.basicInfo[0].id; 规格尺寸
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticsType = this.data.goodsDetail.basicInfo[0].fields.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    shopCarMap.weight = this.data.goodsDetail.basicInfo[0].fields.weight;

    var shopCarInfo = this.data.shopCarInfo;
    if (!shopCarInfo.shopNum) {
      shopCarInfo.shopNum = 0;
    }
    if (!shopCarInfo.shopList) {
      shopCarInfo.shopList = [];
    }
    var hasSameGoodsIndex = -1;
    for (var i = 0; i < shopCarInfo.shopList.length; i++) {
      var tmpShopCarMap = shopCarInfo.shopList[i];
      if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
        hasSameGoodsIndex = i;
        shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
        break;
      }
    }

    shopCarInfo.shopNum = shopCarInfo.shopNum + this.data.buyNumber;
    if (hasSameGoodsIndex > -1) {
      shopCarInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
    } else {
      shopCarInfo.shopList.push(shopCarMap);
    }
    return shopCarInfo;
  },
	/**
	 * 组建立即购买信息
	 */
  buliduBuyNowInfo: function () {
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail.basicInfo[0].pk;
    shopCarMap.pic = this.data.goodsDetail.basicInfo[0].fields.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo[0].fields.name;
    // shopCarMap.label=this.data.goodsDetail.basicInfo[0].id; 规格尺寸
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticsType = this.data.goodsDetail.basicInfo[0].fields.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    shopCarMap.weight = this.data.goodsDetail.basicInfo[0].fields.weight;

    var buyNowInfo = {};
    if (!buyNowInfo.shopNum) {
      buyNowInfo.shopNum = 0;
    }
    if (!buyNowInfo.shopList) {
      buyNowInfo.shopList = [];
    }
    /*    var hasSameGoodsIndex = -1;
        for (var i = 0; i < toBuyInfo.shopList.length; i++) {
          var tmpShopCarMap = toBuyInfo.shopList[i];
          if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
            hasSameGoodsIndex = i;
            shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
            break;
          }
        }
        toBuyInfo.shopNum = toBuyInfo.shopNum + this.data.buyNumber;
        if (hasSameGoodsIndex > -1) {
          toBuyInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
        } else {
          toBuyInfo.shopList.push(shopCarMap);
        }*/

    buyNowInfo.shopList.push(shopCarMap);
    return buyNowInfo;
  },
  onShareAppMessage: function () {
    return {
      title: this.data.goodsDetail.basicInfo[0].fields.name,
      path: '/pages/goods-details/index?id=' + this.data.goodsDetail.basicInfo[0].pk + '&inviter_id=' + app.globalData.uid,
      success: function (res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败')
      }
    }
  },
  reputation: function (goodsId) {
    var that = this;
    wx.request({
      url: 'https://qgdxsw.com:8000/league/goods/reputation',
      data: {
        goodsId: goodsId
      },
      success: function (res) {
        if (res.data.code == 0) {
          console.log(res.data.data);
          that.setData({
            reputation: res.data.data
          });
        }
      }
    })
  },
  getKanjiaInfo: function (gid) {
    var that = this;
    if (!app.globalData.kanjiaList || app.globalData.kanjiaList.length == 0) {
      that.setData({
        curGoodsKanjia: null
      });
      return;
    }
    let curGoodsKanjia = app.globalData.kanjiaList.find(ele => {
      return ele.goodsId == gid
    });
    if (curGoodsKanjia) {
      that.setData({
        curGoodsKanjia: curGoodsKanjia
      });
    } else {
      that.setData({
        curGoodsKanjia: null
      });
    }
  },
    goKanjia: function () {
    var that = this;
      if (!that.data.goodsDetail.basicInfo[0].fields.pingtuan) {
      return;
    }
      console.log(that.data.goodsDetail.basicInfo[0].pk)
    wx.request({
      url: 'https://qgdxsw.com:8000/league/bargain/detail/',
      data: {
        goods_id: that.data.goodsDetail.basicInfo[0].pk,
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res.data.data);

        if (res.data.code == 0) {
          wx.navigateTo({
            url: "/pages/kanjia/index?kjId=" + res.data.data.bargain[0].pk + "&joiner=" + res.data.data.bargainUser[0].fields.user_id + "&id=" + res.data.data.bargain[0].fields.goods_id
          })
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
})