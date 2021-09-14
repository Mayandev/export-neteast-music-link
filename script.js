// ==UserScript==
// @name        导出网易云链接
// @description 导出网易云链接，请提前登陆网易云
// @namespace   https://github.com/mayandev/export-neteast-music-link
// @version     0.0.1
// @author      mayandev
// @match       http*://music.163.com/*
// @supportURL  https://github.com/mayandev/export-neteast-music-link/issues
// @license     GPL License
// @run-at      document-end
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// ==/UserScript==

(function () {
  'use strict';

  function addStyle(code) {
    let y = document.createElement('style');
    y.innerHTML = code;
    document.getElementsByTagName('head')[0].appendChild(y);
  }

  function addButton() {
    const btnCode = '<button id="export-button">导出内容</button>'
    return $('.m-tabs.m-tabs-srch.f-cb.ztag').before(btnCode);
  }

  function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','

        line += array[i][index];
      }

      str += line + '\r\n';
    }

    return str;
  }

  function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
      items.unshift(headers);
    }

    var jsonObject = JSON.stringify(items);
    var csv = convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) {
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportedFilenmae);
        link.setAttribute('target','_blank');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  function getMusicList() {
    let list = [];
    $('.item.f-cb').each(function (index, item) {
      const map = {};
      const link = 'https://music.163.com/' + $(item).find('.w0').find('a').attr('href');
      const songName = $(item).find('.w0').find('b').attr('title');
      const artist = $(item).find('.w1').find('a').text();
      list.push({ link, songName, artist });
    })
    var headers = {
      link: '歌曲链接', // remove commas to avoid errors
      songName: '歌曲名称',
      artist: "歌手",
    };
    exportCSVFile(headers,list,'export')
  }

  addButton();
  addStyle(`
  #export-button { background-color: red; color: white; padding: 5px; border-radius: 2px; margin-bottom: 5px; }
  `)
  $('#export-button').click(getMusicList);

})();
