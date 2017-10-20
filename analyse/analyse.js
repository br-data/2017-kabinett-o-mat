const fs = require('fs');
const path = require('path');

const results = require('./input/results.json');

const departmentOrder = ['Bundeskanzleramt', 'Auswärtiges Amt', 'Finanzen', 'Inneres', 'Arbeit und Soziales', 'Wirtschaft', 'Verteidigung', 'Justiz', 'Umwelt', 'Verkehr', 'Bildung und Forschung', 'Familie', 'Gesundheit', 'Landwirtschaft', 'Entwicklungshilfe'];
const politicianOrder = { ab: 'Wolfgang Schäuble', ac: 'Ursula von der Leyen', ad: 'Peter Altmaier', ae: 'Thomas de Maizière', af: 'Hermann Gröhe', ag: 'Volker Kauder', ah: 'Johanna Wanka', ai: 'Ralph Brinkhaus', aj: 'Julia Klöckner', ak: 'Annegret Kramp-Karrenbauer', al: 'Volker Bouffier', am: 'Armin Laschet', an: 'Jens Spahn', ao: 'Annette Widmann-Mauz', ap: 'Norbert Röttgen', aq: 'Peter Tauber', ar: 'Günther Oettinger', as: 'Jens Weidmann', at: 'Karl-Theodor zu Guttenberg', au: 'Joachim Herrmann', av: 'Andreas Scheuer', aw: 'Hans-Peter Friedrich', ax: 'Manfred Weber', ay: 'Ilse Aigner', az: 'Markus Söder', ba: 'Alexander Dobrindt', bb: 'Christian Schmidt', bc: 'Horst Seehofer', bd: 'Dorothee Bär', be: 'Gerd Müller', bf: 'Christian Lindner', bg: 'Wolfgang Kubicki', bh: 'Alexander Graf Lambsdorff', bi: 'Nicola Beer', bj: 'Johannes Vogel', bk: 'Katja Suding', bl: 'Carl-Ludwig Thiele', bm: 'Werner Hoyer', bn: 'Volker Wissing', bo: 'Hermann Otto Solms', bp: 'Philipp Rösler', bq: 'Marie-Agnes Strack-Zimmermann', br: 'Michael Theurer', bs: 'Gesine Meißner', bt: 'Cem Özdemir', bu: 'Katrin Göring-Eckardt', bv: 'Anton Hofreiter', bw: 'Simone Peter', bx: 'Omid Nouripour', by: 'Claudia Roth', bz: 'Jürgen Trittin', ca: 'Konstantin von Notz', cb: 'Renate Künast', cc: 'Ska Keller', cd: 'Sven Giegold', ce: 'Rebecca Harms', cf: 'Winfried Kretschmann', cg: 'Boris Palmer', ch: 'Robert Habeck' };

let common = [];
let clean = {};

console.log('Total number of tracking strings:', results.length)

results.forEach(function (r) {

  let lineup = r.hash.split('-')

  if (lineup.indexOf('xx') == -1 && !hasDuplicates(lineup)) {

    common.push(r.hash);
    clean[r.user] = lineup;
  }
});

// common = count(common);
// Object.keys(common).forEach(function (c) {

//   if (common[c] > 5) {
//     console.log(c, common[c]);
//   }
// });

console.log('Number of valid tracking strings:', Object.keys(clean).length);

let politicianCount = {};
let departmentCount = {};

Object.keys(clean).forEach(function (c) {

  clean[c].forEach(function (pol, i) {

    pol = politicianOrder[pol]

    politicianCount[pol] = politicianCount[pol] ? politicianCount[pol] + 1 : 1;

    departmentCount[departmentOrder[i]] = departmentCount[departmentOrder[i]] || {}
    departmentCount[departmentOrder[i]][pol] = departmentCount[departmentOrder[i]][pol] ? departmentCount[departmentOrder[i]][pol] + 1 : 1;
  })
});

// saveFile('./output/gesamt.csv', toCSV(politicianCount));

// Object.keys(departmentCount).forEach(function (dep) {

//   saveFile(`./output/${dep.toLowerCase()}.csv`, toCSV(departmentCount[dep]));
// });

function hasDuplicates(array) {

    let valuesSoFar = [];

    for (const value of array) {

        if (valuesSoFar.includes(value)) {

            return true;
        }
        valuesSoFar.push(value);
    }

    return false;
}

function count(arr) {

  return arr.reduce(function (acc, curr) {

    if (typeof acc[curr] == 'undefined') {

      acc[curr] = 1;
    } else {

      acc[curr] += 1;
    }

    return acc;
  }, {});
}

function toCSV(obj) {

  let str = '"name",count\r\n';

  Object.keys(obj).forEach(function (o) {
    let line = '';

    str += `"${o}",${obj[o]}\r\n`;
  })

  return str;
}

function saveFile(relativePath, string) {

  relativePath = path.normalize(relativePath);

  console.log('Saved file', relativePath);

  try {

    return fs.writeFileSync(relativePath, string, 'utf8');
  } catch (error) {

    console.log(error);
  }
}
