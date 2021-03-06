const fs = require('fs');
const presets = require('./presets.json');
const plugins = require('./plugins.json');
const browsers = require('./browsers.json');

function build(browsers, presets){
  return template`${head()}
    <table class="highlight">
      <thead>
        <tr>
          <th></th>
          ${browsers.map(browser => browserCell(browser))}
        </tr>
      </thead>
      ${presets.map(preset => presetBody(browsers, preset))}
    </table>
  ${tail()}`;
}

function head(){
  return template`<!DOCTYPE html>
    <html>
      <head>
        <!--Import Google Icon Font-->
        <link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <!--Import materialize.css-->
        <link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/css/materialize.min.css"  media="screen,projection"/>
        <link type="text/css" rel="stylesheet" href="/css/style.css" />

        <!--Let browser know website is optimized for mobile-->
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Do I need Babel today?</title>
      </head>
    <body>`;
}

function tail(){
  return template`
        <footer class="page-footer">
          <div class="container">
            <div class="row">
              <div class="col l6 s12">
                <h5 class="white-text">Sources</h5>
                <ul>
                  <li><a class="grey-text text-lighten-3" href="http://babeljs.io/docs/plugins/">Babel plugins</a></li>
                  <li><a class="grey-text text-lighten-3" href="https://raw.githubusercontent.com/babel/babel-preset-env/master/data/plugins.json">Plugin browser support</a></li>
                  <li><a class="grey-text text-lighten-3" href="https://github.com/mariusGundersen/DoIneedBabelToday">Source code</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="footer-copyright">
            <div class="container">
            </div>
          </div>
        </footer>
      </body>
    </html>`;
}

function browserCell(browser){
  return template`<th data-field="${browser.id}">${browser.name} (${browser.version})</th>`;
}

function presetBody(browsers, preset){
  return template`
    <tbody data-id="${preset.name}">
      ${presetRow(browsers, preset)}
      ${preset.plugins.map(plugin => pluginRow(browsers, plugin))}
    </tbody>`;
}

function presetRow(browsers, preset){
  return template`
    <tr class="preset-row">
      <td class="preset-name"><a href="http://babeljs.io/docs/plugins/preset-${preset.name}">${preset.name}</a></td>
      ${browsers.map(browser => presetCell(browser, preset.plugins))}
    </tr>`;
}

function presetCell(browser, plugins){
  const pluginVersions = plugins.map(plugin => plugin.values && plugin.values[browser.id] || 'Use plugin');
  const supportCount = pluginVersions.filter(pluginVersion => pluginVersion <= browser.version).length;
  const isSupported = supportCount == plugins.length;
  return template`<td class="${isSupported ? 'is-supported' : ''}">${isSupported ? 'Yes' : `Use plugin (${supportCount}/${plugins.length})`}</td>`;
}

function pluginRow(browsers, plugin){
  return template`
    <tr class="plugin-row">
      <td class="plugin-name"><a href="http://babeljs.io/docs/plugins/${plugin.key}">${plugin.key}</a></td>
      ${browsers.map(browser => pluginCell(browser, plugin.values))}
    </tr>`;
}

function pluginCell(browser, plugin){
  const pluginVersion = plugin && plugin[browser.id] || 'Use plugin';
  const isSupported = pluginVersion <= browser.version;
  return template`<td class="${isSupported ? 'is-supported' : ''}">${pluginVersion}</td>`;
}

function entries(object){
  return Object.keys(object).map(key => ({
    key,
    values: object[key]
  }));
}

function join(presets, plugins){
  return entries(presets).map(preset => ({
    name: preset.key,
    plugins: preset.values.map(key => ({key: key, values: plugins[key]}))
  }))
}

function template(strings, ...values){
  return String.raw(
    strings,
    ...values.map(v => Array.isArray(v)
      ? v.join('')
      : v));
}

const output = build(browsers, join(presets, plugins));
console.log(output);

