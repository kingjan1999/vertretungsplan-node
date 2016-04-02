import jsdom from "jsdom";
import _ from "lodash";

const tabletojson = require('tabletojson');

/**
 * Core Vertretungsplan class
 */
class Vertretungsplan {

  /**
   *
   * @param url URL of the plan (like http://ohgspringe.de/phocadownload/plan/subst_001.htm), usually ends with subst_00x <br /> If prefixed with file:// the file will be loaded
   */
  constructor(url) {
    this.loaded = false;
    this.url = url;
    if (url.indexOf('file://') == 0) { //test fallback
      this.file = url.substring(7);
    }
  }

  /**
   * Loads plan into a JSDOM-Environment
   * @returns {Promise.<window>} Promise
   */
  load() {
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
      this.loaded = true;
      this._loadMeta(window);
      this._loadInfo(window);
    });
  }

  /**
   * Extracts Meta-Information (Untis version, MOTD, last updated) from the plan
   * @param window jsdom window containing the plan
   * @private
   */
  _loadMeta(window) {
    var $ = window.$;

    this.untis_ver = $('meta[name=generator]').attr('content');

    this.messages = $("table.info tr.info").eq(1).text().split("\n").filter((value) => {
      return value.trim() !== "";
    });

    this.last_updated = $('.mon_head tr').last().text().trim();

  }

  /**
   * Extracts the substitutions from the plan
   * @param window jsdom window containing the plan
   * @private
   */
  _loadInfo(window) {
    var $ = window.$;
    var table = tabletojson.convert($('table.mon_list')[0].outerHTML)[0];
    this.table = table.map((val) => {

      if (val['Klasse(n)'] && val['Klasse(n)'].indexOf(',') > 0) { //transform "10A, 10B, 10C" to arry
        val['Klasse(n)'] = val['Klasse(n)'].split(',');
      }

      if (typeof(val['Klasse(n)']) !== 'undefined') { //replace "Klasse(n)" with "Klasse"
        val['Klasse'] = val['Klasse(n)'];
        delete val['Klasse(n)'];
      }

      val = _.transform(val, function (result, val, key) { //lowercase all keys
        result[key.toLowerCase()] = val;
      });

      return val;
    })
  }

  getForClass(search) {
    return _.filter(this.table, {klasse: search})
  }

}

export {Vertretungsplan as default};
