import test from "tape";
import Vertretungsplan from "../src";
//import util from "util";

test("vertretretungsplan-load", (t) => {
  t.plan(1);

  var plan = new Vertretungsplan('file://test/plan_subst_001.htm');

  plan.load().then(() => {
    t.equal(plan.loaded, true, "loaded data");
  });

});

test("vertretungsplans-meta", (t) => {
  t.plan(3);

  var plan = new Vertretungsplan('file://test/plan_subst_001.htm');

  plan.load().then(() => {
    t.equal(plan.untis_ver, "Untis 2016", "untis version");
    t.equal(plan.last_updated, "20.03.2016 16:49", "last updated");
    t.deepEqual(plan.messages, ['Vertretungsplan: Bk',
      'Jg. 11: Ausgabe der Facharbeitsthemen durch die Fachlehrer in der 3. großen Pause in der Aula!',
      'P-Trakt ist vom 4.04.-29.04.2016 gesperrt: Schriftliches Abitur!'], "messages");
  });

});

/*test("vertretungsplan-info", (t) => {
  t.plan(0);
  var plan = new Vertretungsplan('file://test/plan_subst_001.htm');

  plan.load().then(() => {
    console.log(util.inspect(plan.table));
  });

});

*/
