var util = require('../../utils/util.js');
var app = getApp();
// pages/welcome/js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // date: {}
    test: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.oneBase + '/api/onelist/4797/0',
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        that.processOneData(res.data.data)
        console.log(res.data);
      }
    })
  },

  processOneData: function (oneData) {
    var datas = [];
    for (var idx in oneData.content_list) {
      var content = oneData.content_list[idx];
      var forward = content.forward;
      var volume = content.volume;
      var temp = {
        forward: forward,
        volume: volume
      }
      datas.push(temp);
    }
    
    console.log(datas);
    this.setData({
      datas
    }
    )
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})