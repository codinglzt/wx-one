const wxParse = require('/wxParse/wxParse.js').wxParse;

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getRouterByType = function (type) {
  const map = {
    '1': '/api/essay/',
    '2': '/api/serialcontent/',
    '3': '/api/question/',
    '4': '/api/music/detail/',
    '5': '/api/movie/{id}/story/1/0'
  }
  return type ? map[type] : '';
}

const getCategoryByType = function (type) {
  const map = {
    '1': 'ONE STORY',
    '2': '连载',
    '3': '问答',
    '4': '音乐',
    '5': '影视'
  }
  return type ? map[type] : ';'
}

const $get = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      header: { 'Content-Type': 'json' },
      success: resolve,
      fail: reject
    })
  })
}

module.exports = {
  formatTime: formatTime,
  wxParse,
  getRouterByType,
  getCategoryByType,
  $get
}
