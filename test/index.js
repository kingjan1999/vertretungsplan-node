import test from "tape";
import Vertretungsplan from "../src";
//import _test from 'tape-promise'
//const test = _test(tape) // decorate tape

test("vertretretungsplan-load", (t) => {
  t.plan(1);

  var plan = new Vertretungsplan('http://ohgspringe.de/phocadownload/plan/subst_001.htm');

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

test("vertretungsplan-info", (t) => {
  t.plan(1);
  var plan = new Vertretungsplan('file://test/plan_subst_001.htm');

  plan.load().then(() => {
    t.deepEqual(plan.table[0], {
      stunde: '5 - 6',
      '(fach)': 'Fr',
      '(raum)': 'P12',
      fach: 'Fr',
      raum: 'M02',
      klasse: '9F1'
    }, "check first subst.");
  });
});

test("hasAusfall", (t) => {
  t.plan(3);
  var plan = new Vertretungsplan('file://test/plan_subst_001.htm');

  plan.load().then(() => {
    console.log(plan.getForClass('9F1'));
    t.equal(plan.getForClass('9F1').length, 2, "check 9F1");
    t.equal(plan.getForClass('9F1')[0].fach, 'Fr', "check 9F1 fach");
    t.equal(plan.getForClass('13').length, 0 , "year 13");
  });
});
