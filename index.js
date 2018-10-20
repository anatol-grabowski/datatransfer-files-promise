function getFilesFromDataTransferItems(dataTransferItems, options={raw: false}) {
  function traverseFileTreePromise(item, path='') {
    return new Promise( resolve => {
      if (item.isFile) {
        item.file(file => {
          if (!options.raw) {
            file.filepath = path + file.name //save full path
          }
          files.push(file)
          resolve(file)
        })
      } else if (item.isDirectory) {
        let dirReader = item.createReader()
        dirReader.readEntries(entries => {
          let entriesPromises = []
          for (let entr of entries)
            entriesPromises.push(traverseFileTreePromise(entr, path + item.name + "/"))
          resolve(Promise.all(entriesPromises))
        })
      }
    })
  }

  let files = []
  return new Promise((resolve, reject) => {
    let entriesPromises = []
    for (let it of dataTransferItems)
      entriesPromises.push(traverseFileTreePromise(it.webkitGetAsEntry()))
    Promise.all(entriesPromises)
      .then(entries => {
        //console.log(entries)
        resolve(files)
      })
  })
}

exports.getFilesFromDataTransferItems = getFilesFromDataTransferItems