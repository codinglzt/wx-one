// pages/reading/reading.js
const util = require('../../utils/util.js');
const app = getApp();
const oneBaseUrl = app.globalData.oneBase;
const reg = /\{(.+)\}/ig;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    id: 0,
    readingList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getReadingData(this.data.id);
  },

  getReadingData: function(id) {
    this.setData({
      isLoading: true
    })
    const url = (`${oneBaseUrl}/api/channel/reading/more/{id}`).replace(reg, id);
    util.$get(url, { id: this.data.id }).then((res) => {
        this.processData(res.data.data, id);
    }).catch(e => {
      wx.showToast({ title: `网络错误!`, duration: 1000, icon: "none" });
      this.setData({
        isLoading: true
      })
    })
  },

  processData: function(readingData, id) {
    if (id !== 0) {
      this.setData({
        readingList: this.data.readingList.concat(readingData),
        id: readingData[readingData.length - 1].id,
        isLoading: false
      })
    } else {
      this.setData({
        readingList: readingData,
        id: readingData[readingData.length - 1].id,
        isLoading: false
      })
    }
  },
  onReachBottom() {
    if (this.data.isLoading) { // 防止数据还没回来再次触发加载
      return;
    }
    this.getReadingData(this.data.id);
    console.log('1');
  },
  openReadingDeteil: function(e) {
    var readingContents = e.currentTarget.dataset.contents;
    wx.navigateTo({
      url: 'reading-detail/reading-detail?id=' + readingContents.content_id
    })
  }
})