let didShowInfo = false

export async function getFilesFromDataTransferItems (dataTransferItems: DataTransferItemList, options = { raw: false }): Promise<File[]> {
  const checkErr = (err) => {
    if (didShowInfo) return
    if (err.name !== 'EncodingError') return
    didShowInfo = true
    const infoMsg = `${err.name} occured within datatransfer-files-promise module\n`
      + `Error message: "${err.message}"\n`
      + 'Try serving html over http if currently you are running it from the filesystem.'
    console.warn(infoMsg)
  }

  const readFile = (entry, path = '') => {
    return new Promise((resolve, reject) => {
      entry.file(file => {
        if (!options.raw) file.filepath = path + file.name // save full path
        resolve(file)
      }, (err) => {
        checkErr(err)
        reject(err)
      })
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
      }, (err) => {
        checkErr(err)
        reject(err)
      })
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
    const newEntry = dataTransferItems[i].webkitGetAsEntry()
    entries.push(newEntry)
  }

  // Recursively read through all entries
  for (let entry of entries) {
    const newFiles = await getFilesFromEntry(entry)
    files = files.concat(newFiles)
  }

  return files
}
