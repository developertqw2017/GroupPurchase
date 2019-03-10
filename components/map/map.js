// components/map/map.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    markers: {
      type:Array,
      value:[]
    },
    polyline: {
      type:Array,
      value:[]
    },
    controls:{
      type:Array,
      vlaue:[{}]
    },
    longitude:{
      type:Number,
      value: 113.298569
    },
    latitude:{
      type:Number,
      value: 23.095207
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    markers: [],
    gourmetsMap:{}
  },


  created: function () {
    var that = this;
    app.getLocationInfo(function (locationInfo) {
      console.log('map', locationInfo);
      that.setData({
        longitude: locationInfo.longitude
        , latitude: locationInfo.latitude
      })
    })
    //
    var gourmets = app.globalData.gourmets;
    //清空
    var markers = [];
    for (var x in gourmets) {
      //
      gourmets[x].index = x;
      gourmetsMap[gourmets[x].objectId] = gourmets[x];
      var marker = {
        id: gourmets[x].objectId
        , iconPath: "/imgs/ic_position_nor.png"
        , longitude: gourmets[x].location.longitude
        , latitude: gourmets[x].location.latitude
        , width: 30
        , height: 30
        , data: gourmets[x]
      }
      //console.log('marker',marker);
      markers.push(marker);
    }
    if (markers.length > 0) {
      //console.log('onLoaddddddddddddd',markers);
      markers[0].iconPath = "/imgs/ic_position_sel.png";
      that.setData({
        markers: markers
      })
    }

  },

  /**
   * 组件的方法列表
   */
  methods: {
      regionchange(e) {
      console.log(e.type)
    }
    , markertap(e) {
      console.log(e);
      //
      var gourmet = gourmetsMap[e.markerId];
      this.setData({
        current: gourmet.index
      })
    }
    , controltap(e) {
      console.log(e.controlId)
    }


    //
    , gotoDetail: function (e) {
      var item = e.target.dataset.item;
      if (item) {
        wx.navigateTo({
          url: '../detail/detail?item=' + JSON.stringify(item)
        })
      }
    }

    //
    , currentChange: function (e) {
      var current = e.detail.current;
      //console.log('current',current);
      //console.log('data',markers[current].data);
      var gourmet = markers[current].data;
      this.setData({
        longitude: gourmet.location.longitude
        , latitude: gourmet.location.latitude
      });
      //
      for (var i = 0; i < markers.length; i++) {
        markers[i].iconPath = "/imgs/ic_position_nor.png"
      }
      markers[current].iconPath = "/imgs/ic_position_sel.png";
      //console.log('currentChangeeeeeeeeeeeeeeeeeeeeeeeeee',markers);
      this.setData({
        markers: markers
      })
    }

    //组织事件冒泡
    , stopScroll: function () {

    }

  }
})
