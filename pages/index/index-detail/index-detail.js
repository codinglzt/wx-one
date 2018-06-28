// pages/index/index-detail/index-detail.js
var app = getApp();
var util = require('../../../utils/util.js');
const musicUrl = getApp().globalData.musicBase;
const QQMusicUrl = getApp().globalData.QQMusicBase;
var WxParse = require('../../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailContent: {},
    categoryId: '',
    music_id: '',
    isPlayingMusic: false,
    isLoding: true,
    isPlay: false,
    isMusic: false,
    musicSrc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var textId = options.id;
    var category = options.category;
    console.log(textId);

    this.setData({
      categoryId: category
    })
    if (category == 5) {
      var detailUrl = app.globalData.oneBase + '/api/movie/' + textId + '/story/1/0';
    } else {
      var detailUrl = app.globalData.oneBase + util.getRouterByType(category) + textId;
    }
    this.getTextDetail(detailUrl, category);

    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === this.data.id) {
      this.setData({
        isLoding: false,
        isMusic: true,
        isPlay: true
      })
    } else if (!app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === this.data.id) {
      this.setData({
        isLoding: false,
        isMusic: true,
        isPlay: false
      })
    }
    this.setMusicMonitor();
  },

  getTextDetail: function (url, category) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        console.log(res.data.data);
        that.setData({
          detailContent: res.data.data
        })
        if (res.data.data.hp_content) {
          WxParse.wxParse('article', 'html', res.data.data.hp_content, that, 15);
        } else if (res.data.data.content) {
          WxParse.wxParse('article', 'html', res.data.data.content, that, 15);
        } else if (res.data.data.answer_content) {
          WxParse.wxParse('article', 'html', res.data.data.answer_content, that, 15);
        } else if (res.data.data.story) {
          WxParse.wxParse('article', 'html', res.data.data.story, that, 15);
        } else {
          WxParse.wxParse('article', 'html', res.data.data.data[0].content, that, 15);
        }
        if (category == 4) {
          that.initMusic();
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },

  setMusicMonitor() {
    wx.onBackgroundAudioPlay((event) => { // 点击播放图标和总控开关都会触发这个函数
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 1];
      if (currentPage.data.id === this.data.id) {
        // 打开多个post-detail页面后，每个页面不会关闭，只会隐藏。通过页面栈拿到到
        // 当前页面的id，只处理当前页面的音乐播放。
        if (app.globalData.g_currentMusicPostId == this.data.id) {
          // 播放当前页面音乐才改变图标
          this.setData({
            isLoding: false,
            isMusic: true,
            isPlay: true
          })
        }
        // if(app.globalData.g_currentMusicPostId == this.data.id )
        // app.globalData.g_currentMusicPostId = this.data.id;
      }
      app.globalData.g_isPlayingMusic = true;
    });
    wx.onBackgroundAudioPause(() => {
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 1];
      if (currentPage.data.id === this.data.id) {
        if (app.globalData.g_currentMusicPostId == this.data.id) {
          this.setData({
            isLoding: false,
            isMusic: true,
            isPlay: false
          })
        }
      }
      app.globalData.g_isPlayingMusic = false;
      // app.globalData.g_currentMusicPostId = null;
    });
    wx.onBackgroundAudioStop(() => {
      this.setData({
        isLoding: false,
        isMusic: true,
        isPlay: false
      })
      app.globalData.g_isPlayingMusic = false;
      // app.globalData.g_currentMusicPostId = null;
    });
  },
  initMusic() { // 初始化音乐，由于没有解决音乐接口，用虾米音乐代替;
      util.$get(`${QQMusicUrl}/soso/fcgi-bin/search_for_qq_cp?g_tk=5381&uin=0&format=jsonp&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&w=${this.data.detailContent.title}${this.data.detailContent.author.user_name}&zhidaqu=1&catZhida=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&perpage=20&n=20&p=1&remoteplace=txt.mqq.all&_=1520833663464`).then(res => {
        let list = JSON.parse(res.data.match(/callback\((.*)\)/)[1]).data.song.list;
        if (list.length) {
          this.data.music_id = list[0].songmid;
          this.setData({
            isLoding: false, // 结束loding动画
            isMusic: true, //  歌曲存在
            musicSrc: `http://ws.stream.qqmusic.qq.com/C100${this.data.music_id}.m4a?fromtag=0&guid=126548448`
          })
        } else {
          this.setData({
            isLoding: false, // 结束loding动画
            isMusic: false //  歌曲存在
          })
          wx.showToast({ title: `暂无音乐版权!`, duration: 1000, icon: "none" })
          console.log('1');
        }
      }).catch(e => {
        wx.showToast({ title: `网络错误!`, duration: 1000, icon: "none" })
      })
  },

  onMusicTap: function (e) {
    if (this.data.isLoding) {
      return;
    }
    if (!this.data.isMusic) {
      wx.showToast({ title: `暂无音乐版权!`, duration: 1000, icon: "none" })
      return;
    }
    if (this.data.isPlay) { // 暂停音乐
      wx.pauseBackgroundAudio();
      this.setData({
        isPlay: false
      })
      // app.globalData.g_currentMusicPostId = null;
      app.globalData.g_isPlayingMusic = false; // 总开关 关闭
    }
    else {
      wx.playBackgroundAudio({ // 播放音乐
        dataUrl: this.data.musicSrc,
        title: `${this.data.detailContent.title}-${this.data.detailContent.author.user_name}`,
        coverImgUrl: this.data.detailContent.cover
      })
      this.setData({
        isPlay: true
      })
      app.globalData.g_currentMusicPostId = this.data.id;
      app.globalData.g_isPlayingMusic = true;
    }
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