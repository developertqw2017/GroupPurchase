Page({
  data: {
    title: '果果铺',
    swipers: [
      { 'pic': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552031581823&di=57cab66f5f08ea62d7487f1bc88a9657&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F4afbfbedab64034f75552a3fa4c379310a551d6a.jpg', 'link': '/pages/video/video' },
      { 'pic': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552031581823&di=57cab66f5f08ea62d7487f1bc88a9657&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F4afbfbedab64034f75552a3fa4c379310a551d6a.jpg', 'link': '' }
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,

    news: [
      {
        'id': 0,
        'pic': 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2842108233,694686227&fm=26&gp=0.jpg',
        'title': '柑橘家族种类多 营养功效各不同',
        'content': '常见品种有普通甜橙、脐橙、血橙等。橙子又称黄果，柑果球形，果皮橙黄色，不易剥离，汁味甜而香。它含有大量的糖和一定量的',
      },
      {
        'id': 1,
        'pic': 'http://i2.chuimg.com/f67383c57d4311e58f7a590a901d631a.jpg?imageView2/2/w/660/interlace/1/q/90',
        'title': '木瓜椰奶冻',
        'content': '牛奶可以换成椰浆或者椰奶，这样就不用放椰子粉了，不喜欢椰子味道的可以只用牛奶，最好加点鲜奶油这样奶味更足，放白糖的时候可以边放边尝，按照自己的口味决定量的多少',
      },
      {
        'id': 2,
        'pic': 'https://img0.pclady.com.cn/pclady/1810/04/1856441_48680984_1496305348527.jpg',
        'title': '杯子香蕉蛋糕',
        'content': '杯子香蕉蛋糕 1. 香蕉先用牛奶打成香蕉泥待用。再把面粉，发粉及烘培用的苏打粉过筛均匀待用。2. 把牛油切成小块和细砂糖搅打至牛油发白(大约5～7分钟)3. 逐个加入冷鸡蛋(先存放在冰箱门的鸡蛋格最少2小时)打匀。',
      }
    ]
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
    console.log('onShareAppMessage')
    return {
      title: '盛世华安',
      desc: '小程序',
      path: '/pages/index/index'
    }
  },
});
