async function getFilesFromDataTransferItems (dataTransferItems, options = { raw: false }) {
  const readFile = (entry, path = '') => {
    return new Promise((resolve, reject) => {
      entry.file(file => {
        if (!options.raw) file.filepath = path + file.name // save full path
        resolve(file)
      }, reject)
    })
  }

  const dirReadEntries = (dirReader, path) => {
    return new Promise((resolve, reject) => {
      dirReader.readEntries(async entries => {
        let files = []
        for (let entry of entries) {
          const itemFiles = await getFilesFromEntry(entry, path)
          files = files.concat(itemFiles)
        }
        resolve(files)
      }, reject)
    })
  }

  const readDir = async (entry, path) => {
    const dirReader = entry.createReader()
    const newPath = path + entry.name + '/'
    let files = []
    let newFiles
    do {
      newFiles = await dirReadEntries(dirReader, newPath)
      files = files.concat(newFiles)
    } while (newFiles.length > 0)
    return files
  }

  const getFilesFromEntry = async (entry, path = '') => {
    if (entry.isFile) {
      const file = await readFile(entry, path)
      return [file]
    }
    if (entry.isDirectory) {
      const files = await readDir(entry, path)
      return files
    }
    // throw new Error('Entry not isFile and not isDirectory - unable to get files')
  }

  let files = []
  let entries = []

  // Pull out all entries before reading them
  for (let i = 0, ii = dataTransferItems.length; i < ii; i++) {
    entries.push(dataTransferItems[i].webkitGetAsEntry())
  }

  // Recursively read through all entries
  for (let entry of entries) {
    const newFiles = await getFilesFromEntry(entry)
    files = files.concat(newFiles)
  }

  return files
}

if (this === window) var exports = window
exports.getFilesFromDataTransferItems = getFilesFromDataTransferItems
