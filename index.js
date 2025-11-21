/**
 * Module dependencies.
 */

const express = require("express");
const logger = require('morgan');
const path = require('path');
const app = express();

const handlebars = require('express-handlebars');
const port = process.env.PORT || 3000;

const calculate = require('./calculate')
const enjson = require('./locales/en-eur.json');
const dejson = require('./locales/de.json');
const frjson = require('./locales/fr.json');
const esjson = require('./locales/es.json');
const itjson = require('./locales/it.json');
const nljson = require('./locales/nl.json');
const ptjson = require('./locales/pt.json');
const pljson = require('./locales/pl.json');
const bgjson = require('./locales/bg.json');
const hrjson = require('./locales/hr.json');
const csjson = require('./locales/cs.json');
const dajson = require('./locales/da.json');
const etjson = require('./locales/et.json');
const fijson = require('./locales/fi.json');
const eljson = require('./locales/el.json');
const hujson = require('./locales/hu.json');
const gajson = require('./locales/ga.json');
const lvjson = require('./locales/lv.json');
const ltjson = require('./locales/lt.json');
const mtjson = require('./locales/mt.json');
const rojson = require('./locales/ro.json');
const skjson = require('./locales/sk.json');
const sljson = require('./locales/sl.json');
const svjson = require('./locales/sv.json');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views')

app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'main',
    extname: 'hbs',
}));

app.use(express.static('public'))

// log requests
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'css')));


// Language mapping from browser codes to app routes
const languageMap = {
    'en': '/en-eur',
    'en-US': '/en-eur',
    'en-GB': '/en-eur',
    'de': '/de',
    'de-DE': '/de',
    'de-AT': '/de',
    'de-CH': '/de',
    'fr': '/fr',
    'fr-FR': '/fr',
    'fr-CA': '/fr',
    'fr-BE': '/fr',
    'es': '/es',
    'es-ES': '/es',
    'es-MX': '/es',
    'es-AR': '/es',
    'it': '/it',
    'it-IT': '/it',
    'nl': '/nl',
    'nl-NL': '/nl',
    'nl-BE': '/nl',
    'pt': '/pt',
    'pt-PT': '/pt',
    'pt-BR': '/pt',
    'pl': '/pl',
    'pl-PL': '/pl',
    'bg': '/bg',
    'bg-BG': '/bg',
    'hr': '/hr',
    'hr-HR': '/hr',
    'cs': '/cs',
    'cs-CZ': '/cs',
    'da': '/da',
    'da-DK': '/da',
    'et': '/et',
    'et-EE': '/et',
    'fi': '/fi',
    'fi-FI': '/fi',
    'el': '/el',
    'el-GR': '/el',
    'hu': '/hu',
    'hu-HU': '/hu',
    'ga': '/ga',
    'ga-IE': '/ga',
    'lv': '/lv',
    'lv-LV': '/lv',
    'lt': '/lt',
    'lt-LT': '/lt',
    'mt': '/mt',
    'mt-MT': '/mt',
    'ro': '/ro',
    'ro-RO': '/ro',
    'sk': '/sk',
    'sk-SK': '/sk',
    'sl': '/sl',
    'sl-SI': '/sl',
    'sv': '/sv',
    'sv-SE': '/sv'
};

function getLanguageFromHeader(acceptLanguage) {
    if (!acceptLanguage) return '/en-eur';

    // Parse Accept-Language header
    const languages = acceptLanguage.split(',').map(lang => {
        const [locale, quality = 'q=1.0'] = lang.trim().split(';');
        const q = quality.split('=')[1] || '1.0';
        return { locale, q: parseFloat(q) };
    });

    // Sort by quality (highest first)
    languages.sort((a, b) => b.q - a.q);

    // Find first supported language
    for (const { locale } of languages) {
        // Check exact match first
        if (languageMap[locale]) {
            return languageMap[locale];
        }

        // Check primary language (e.g., 'en' from 'en-US')
        const primaryLang = locale.split('-')[0];
        if (languageMap[primaryLang]) {
            return languageMap[primaryLang];
        }
    }

    // Default to English if no supported language found
    return '/en-eur';
}

app.get('/', function(req, res) {
    const acceptLanguage = req.headers['accept-language'];
    const targetLanguage = getLanguageFromHeader(acceptLanguage);
    res.redirect(targetLanguage);
});

// EUR routes
app.get('/en-eur', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let endata = Object.assign(enjson, yeardata)
        res.render('sats', endata)
    })
});

app.get('/de', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let dedata = Object.assign(dejson, yeardata)
        res.render('sats', dedata)
    })
});

app.get('/fr', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let frdata = Object.assign(frjson, yeardata)
        res.render('sats', frdata)
    })
});

app.get('/es', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let esdata = Object.assign(esjson, yeardata)
        res.render('sats', esdata)
    })
});

app.get('/it', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let itdata = Object.assign(itjson, yeardata)
        res.render('sats', itdata)
    })
});

app.get('/nl', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let nldata = Object.assign(nljson, yeardata)
        res.render('sats', nldata)
    })
});

app.get('/pt', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let ptdata = Object.assign(ptjson, yeardata)
        res.render('sats', ptdata)
    })
});

app.get('/pl', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let pldata = Object.assign(pljson, yeardata)
        res.render('sats', pldata)
    })
});

app.get('/bg', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let bgdata = Object.assign(bgjson, yeardata)
        res.render('sats', bgdata)
    })
});

app.get('/hr', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let hrdata = Object.assign(hrjson, yeardata)
        res.render('sats', hrdata)
    })
});

app.get('/cs', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let csdata = Object.assign(csjson, yeardata)
        res.render('sats', csdata)
    })
});

app.get('/da', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let dadata = Object.assign(dajson, yeardata)
        res.render('sats', dadata)
    })
});

app.get('/et', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let etdata = Object.assign(etjson, yeardata)
        res.render('sats', etdata)
    })
});

app.get('/fi', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let fidata = Object.assign(fijson, yeardata)
        res.render('sats', fidata)
    })
});

app.get('/el', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let eldata = Object.assign(eljson, yeardata)
        res.render('sats', eldata)
    })
});

app.get('/hu', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let hudata = Object.assign(hujson, yeardata)
        res.render('sats', hudata)
    })
});

app.get('/ga', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let gadata = Object.assign(gajson, yeardata)
        res.render('sats', gadata)
    })
});

app.get('/lv', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let lvdata = Object.assign(lvjson, yeardata)
        res.render('sats', lvdata)
    })
});

app.get('/lt', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let ltdata = Object.assign(ltjson, yeardata)
        res.render('sats', ltdata)
    })
});

app.get('/mt', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let mtdata = Object.assign(mtjson, yeardata)
        res.render('sats', mtdata)
    })
});

app.get('/ro', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let rodata = Object.assign(rojson, yeardata)
        res.render('sats', rodata)
    })
});

app.get('/sk', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let skdata = Object.assign(skjson, yeardata)
        res.render('sats', skdata)
    })
});

app.get('/sl', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let sldata = Object.assign(sljson, yeardata)
        res.render('sats', sldata)
    })
});

app.get('/sv', function(req, res) {
    calculate.get10yr().then(pydata => {
        const yeardata = { 'yeardata': pydata }
        let svdata = Object.assign(svjson, yeardata)
        res.render('sats', svdata)
    })
});


//Makes the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`));