const fs = require('fs')
const path = require('path');

function* walkDir(dir) {
  for(f of fs.readdirSync(dir)){
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if(isDirectory){
      yield* walkDir(dirPath)
    } else {
      yield dirPath
    }
  }
};
index = {}
for(fileName of walkDir(__dirname)){
  fileName = fileName.replace(__dirname + path.posix.sep, "")
  const parts = fileName.split(path.posix.sep)
  let i = Math.max(parts.indexOf('male'),parts.indexOf('female'))
  if(i === -1){
    continue
  }
  const key = parts.slice(0,i).join(path.posix.sep)
  if(!index[key]){
    index[key] = {
      male:[],
      female:[]
    }
  }
  index[key][parts[i]].push(parts.slice(i+1).join(path.posix.sep))
}

module.exports = index