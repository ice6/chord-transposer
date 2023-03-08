const fs = require('fs');
const glob = require('glob');

function replaceCode(code) {
  return code.replace('import * as XRegExp from "xregexp";', '')
             .replace("import * as XRegExp from 'xregexp';", '')
             .replace("import { Enum, EnumValue } from 'ts-enums';", 
             "import { Enum, EnumValue } from '../node_modules/ts-enums/dist/ts-enums.es5';")
}

function exportTransposeMethodToWindow(f, code) {
  if(!f.endsWith('index.js')) {
    return code
  }
  if(code.indexOf("window.transpose = (text) => new Transposer(text);") > -1) {
    return code;
  }
  return code + "\n" + "window.transpose = (text) => new Transposer(text);";
}

glob('./dist/*.js', function (err, files) {
  if (err) {
    console.error(err);
  } else {
    files.forEach(f => {
      const code = fs.readFileSync(f, 'utf-8');
      let newCode = replaceCode(code);
      newCode = exportTransposeMethodToWindow(f, newCode)
      fs.writeFileSync(f, newCode, 'utf-8');
    });
  }
});


// read file synchronously
// write file synchronously