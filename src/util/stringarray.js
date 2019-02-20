const objectToBin = (object) => {
  const str = JSON.stringify(object)
  const ret = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) {
    ret[i] = str.charCodeAt(i)
  }
  return ret
}

const binToObject = (binArray) => {
  let str = ''
  for (let i = 0; i < binArray.length; i++) {
    str += String.fromCharCode(binArray[i])
  }
  return JSON.parse(str)
}

module.exports.objectToBin = objectToBin
module.exports.binToObject = binToObject
