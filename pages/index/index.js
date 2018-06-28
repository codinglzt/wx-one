//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    contents: {},
    picContent: {},
    idList: [],
    id: ''
  },

  //事件处理函数
  onLoad: function () {
    var idListUrl = app.globalData.oneBase + "/api/onelist/idlist";
    var contentUrl = app.globalData.oneBase + "/api/onelist/4799/0";

    this.getListIdDemo(idListUrl);
  },

  // getOneContentData: function (url) {
  //   var that = this;
  //   wx.request({
  //     url: url,
  //     method: 'GET',
  //     header: {
  //       "Content-Type": "json"
  //     },
  //     success: function (res) {
  //       that.processOneContentData(res.data.data);
        
  //     },
  //     fail: function (error) {
  //       console.log(error)
  //     }
  //   })
  // },

  getOneContentDataDemo: function () {
    util.$get(`http://v3.wufazhuce.com:8000/api/onelist/${this.data.idList[0]}/0`).then((res) => {
      // console.log(res.data.data);
      this.processOneContentData(res.data.data);
    }).catch(e => {
      wx.showToast({ title: `网络错误!`, duration: 1000, icon: "none" });
    })
  },

  // getListId: function (url) {
  //   var that = this;
  //   wx.request({
  //     url: url,
  //     method: 'GET',
  //     header: {
  //       "Content-Type": "json"
  //     },
  //     success: function (res) {
  //       console.log(res.data);
  //       // that.setData({
  //       //   idList: res.data.data
  //       // })
  //       that.processIdListData(res.data.data);
  //     },
  //     fail: function (error) {
  //       console.log(error)
  //     }
  //   })
  // },

  getListIdDemo: function (url) {
    // var idListUrl = app.globalData.oneBase + "/api/onelist/idlist";
    util.$get(url, { id: this.data.id }).then((res) => {
      // console.log(res.data.data);
      this.setData({
        idList: res.data.data
      });
      this.getOneContentDataDemo();
    }).catch(e => {
      wx.showToast({ title: `网络错误!`, duration: 1000, icon: "none" });
    })
  },

  // processIdListData: function (idListData) {
  //   var list = [];
  //   for (var idx in idListData) {
  //     var id = idListData[idx];
  //     var temp = {
  //       id: id
  //     }
  //     list.push(temp);
  //   }
  //   this.setData({
  //     idList: list
  //   })
  //   return list;
  // },

  processOneContentData: function (oneCotents) {
    var contents = [];
    var picContent = [];
    for (var idx in oneCotents.content_list) {
      var content = oneCotents.content_list[idx];
      var title = content.title;
      var categoryText = util.getCategoryByType(content.category);
      if (!content.author.user_name) {
        var author = content.pic_info;
      } else {
        var author = content.author.user_name;
      }
      var forward = content.forward;
      var temp = {
        id: content.content_id,
        title: title,
        wordsFrom: content.words_info,
        author: author,
        imgUrl: content.img_url,
        forward: forward,
        category: content.category,
        categoryText: categoryText
      }
      if (idx == 0) {
        picContent.push(temp);
      } else {
        contents.push(temp);
      }
    }
    // console.log(contents)
    this.setData({ contents, picContent});
  },

  viewImg: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },

  openDeteil: function (event) {
    var textId = event.currentTarget.dataset.contents;
    wx.navigateTo({
      url: 'index-detail/index-detail?id=' + textId.id + '&category=' + textId.category
    })
  }
})
