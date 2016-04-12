import _ from "lodash";
import fsp from "fs-promise";
import rp from "request-promise";
import cheerio from "cheerio";
import iconv from "iconv-lite";

const tabletojson = require('tabletojson');

/**
 * Core Vertretungsplan class
 * @property {Array} table - Array containing substitution objects. The keys are determined by the table headings, but lowercased and singularized (Klasse(n) => klasse).
 * @property {String} untis_ver - Version of Untis used
 * @property {String} last_updated - Time, the plan was last updated
 * @property {Array] messages - Array of MOTDs
 * @property {String} date - Date of the plan
 */
class Vertretungsplan {

  /**
   *
   * @param url URL of the plan (like http://ohgspringe.de/phocadownload/plan/subst_001.htm), usually ends with subst_00x <br /> If prefixed with file:// the file will be loaded
   * @param encoding Encoding of the Document. Defaults to ISO-8859-1
   */
  constructor(url, encoding = "ISO-8859-1") {
    this.loaded = false;
    this.url = url;
    this.encoding = encoding;
    if (url.indexOf('file://') == 0) { //test fallback
      this.file = url.substring(7);
    }
  }

  /**
   * Loads plan into a cheerio-object
   * @returns {Promise.<cheerio>} Promise
   */
  load() {
    const encoding = this.encoding;

    return this._fetchHtml().then((body) => {
        var decoded = iconv.decode(new Buffer(body), encoding);
        return decoded;
      })
      .then((html) => {
        return cheerio.load(html);
      })
      .then((window) => {
        this.loaded = true;
        this._loadMeta(window);
        this._loadInfo(window);
      });
  }

  /**
   * Loads HTML-String from file || url
   * @returns {Promise.<string>} Promise returning the html string
   * @private
   */
  _fetchHtml() {

    if (this.file) {
      return fsp.readFile(this.file);
    }
    return rp({
      url: this.url,
      method: "GET",
      encoding: null
    });
  }

  /**
   * Extracts Meta-Information (Untis version, MOTD, last updated) from the plan
   * @param $ cheerio object
   * @private
   */
  _loadMeta($) {

    this.untis_ver = $('meta[name=generator]').attr('content');
    this.messages = $("table.info tr.info").eq(1).text().split("\r").filter((value) => {
      return value.trim() !== "";
    });

    this.last_updated = $('.mon_head tr').last().text().trim();
    this.date = _.words($('.mon_title').text(), /[^, ]+/g)[0];

  }

  /**
   * Extracts the substitutions from the plan
   * @param $ cheerio object
   * @private
   */
  _loadInfo($) {
    var table = tabletojson.convert($.html($('table.mon_list')))[0];
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

  /**
   *
   * @param {string} search Class to search for (like '11')
   * @returns {Array} array containing found objects
   */
  getForClass(search) {
    return _.filter(this.table, {klasse: search})
  }

}

export default Vertretungsplan;
