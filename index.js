function getFiles (obj /* <input type='file'> or DataTransfer*/ ) {

  function getFilesFromWebkitDataTransferItems(items) {
    function traverseFileTreePromise(item, path='') {
      return new Promise( resolve => {
        if (item.isFile) {
          item.file(file => {
            file.filepath = path + file.name
            files.push(file)
            resolve(file)
          })
        } else if (item.isDirectory) {
          let dirReader = item.createReader()
          dirReader.readEntries(entries => {
            let entriesPromises = []
            for (entr of entries)
              entriesPromises.push(traverseFileTreePromise(entr, path + item.name + "/"))
            resolve(Promise.all(entriesPromises))
          })
        }
      })
    }

    let files = []
    return new Promise((resolve, reject) => {
      let entriesPromises = []
      for (let it of items)
        entriesPromises.push(traverseFileTreePromise(it.webkitGetAsEntry()))
      Promise.all(entriesPromises)
        .then(entries => {
          //console.log(entries)
          resolve(files)
        })
    })
  }



  // obj is webkit DataTransfer
  if (obj.items && obj.items[0] && obj.items[0].webkitGetAsEntry)
    return getFilesFromWebkitDataTransferItems(obj.items)

  // obj is DataTransfer without webkitGetAsEntry function or <input type="file"/>
  let files = []
  for (let file of obj.files) {
    if (file.webkitRelativePath !== '') {
      let re = new RegExp(file.name + '$')
      if (re.test(file.webkitRelativePath))
        file.filepath = file.webkitRelativePath.replace(re, '') + file.name
    }
    files.push(file)
  }
  return Promise.resolve(files)
}

module.exports = getFiles