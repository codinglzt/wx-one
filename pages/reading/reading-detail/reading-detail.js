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
    this.getReadingDetail(readingId);
  },

  getReadingDetail: function(id) {
    util.$get(`${oneBaseUrl}/api/essay/${id}`).then((res) => {
      console.log(res.data.data.hp_content);
      this.setData({
        detailContent: res.data.data
      })
      WxParse.wxParse('reading', 'html', res.data.data.hp_content, this, 15);
    }).catch(e => {
      wx.showToast({ title: `网络错误!`, duration: 1000, icon: "none" });
    })
  }
})