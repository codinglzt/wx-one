// pages/reading/reading-detail/reading-detail.js
const util = require('../../../utils/util.js');
const app = getApp();
const oneBaseUrl = app.globalData.oneBase;
var WxParse = require('../../../utils/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const readingId = options.id;
    console.log(readingId);
    this.getReadingDetail(readingId);
  },

  getReadingDetail: function(id) {
    util.$get(`${oneBaseUrl}/api/movie/${id}/story/1/0`).then((res) => {
      console.log(res.data.data);
      this.setData({
        detailContent: res.data.data.data[0]
      })
      WxParse.wxParse('movie', 'html', res.data.data.data[0].content, this, 5);
    }).catch(e => {
      wx.showToast({ title: `网络错误!`, duration: 1000, icon: "none" });
    })
  }
})