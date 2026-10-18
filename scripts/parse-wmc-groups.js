const fs = require('fs');
const html = fs.readFileSync('scripts/wmc-full.html', 'utf8');

// The HTML contains blocks or field containers with data-name or data-group,
// and inside each container are the <li> or options with data-src, alt/title, etc.
// Let's parse all containers or elements that have data-name or class containing ndkackFieldItem or recap_group

// Let's find each field block
const blockRegex = /<(?:div|ul|fieldset)[^>]*data-name="([^"]+)"[^>]*>([\s\S]*?)<\/(?:div|ul|fieldset)>/gi;
let match;
const fields = {};

// Alternatively, let's search for ndkackFieldItem
// Let's see how options are grouped
const optionRegex = /<li[^>]*data-src="([^"]+)"[^>]*>([\s\S]*?)<\/li>/gi;

// Let's check how the DOM structure associates an option with its field/group
// Let's inspect a chunk of HTML around data-name="second hands"
const secHandPos = html.indexOf('data-name="second hands"');
if (secHandPos !== -1) {
  console.log('--- AROUND second hands ---');
  console.log(html.substring(secHandPos, secHandPos + 2500));
}

const handsPos = html.indexOf('data-name=" hands"');
if (handsPos !== -1) {
  console.log('--- AROUND hands ---');
  console.log(html.substring(handsPos, handsPos + 2000));
}

const casebackPos = html.indexOf('data-name="case back"');
if (casebackPos !== -1) {
  console.log('--- AROUND case back ---');
  console.log(html.substring(casebackPos, casebackPos + 2000));
}
