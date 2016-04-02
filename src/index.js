import jsdom from "jsdom";
const tabletojson = require('tabletojson');

class Vertretungsplan {

  constructor(url) {
    this.loaded = false;
    this.url = url;
    if (url.indexOf('file://') == 0) { //test fallback
      this.file = url.substring(7);
    }
  }

  load() {
    const t = this;
    return new Promise((resolve, reject) => {
      jsdom.env({
        file: this.file,
        url: this.url,
        scripts: ["http://code.jquery.com/jquery.js"],
        done: function (err, window) {
          if (err) {
            reject(err);
          }
          resolve(window);
        }
      });
    }).then((window) => {
      t.loaded = true;
      t._loadMeta(window);
      t._loadInfo(window);
    });
  }


  _loadMeta(window) {
    var $ = window.$;

    this.untis_ver = $('meta[name=generator]').attr('content');

    this.messages = $("table.info tr.info").eq(1).text().split("\n").filter((value) => {
      return value.trim() !== "";
    });

    this.last_updated = $('.mon_head tr').last().text().trim();

  }

  _loadInfo(window) {
    this.table = tabletojson.convert($('table.mon_list').outerHTML);
  }
}

export {Vertretungsplan as default};
