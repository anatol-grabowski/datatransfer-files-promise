# datatransfer-files-promise

Get a promise for a flat array of files from the 'drop' event, like `<input type="file"/>.files`.

## Features

- Directories are traversed recursively.
- Correctly handles > 100 entries per directory.
- Correctly handles selections of files instead of a directory.
- `filepath` is the property added to each file for convenience. If you don't want it for some reason then use `getFilesFromDataTransferItems(items, {raw: true})`.

## Usage:

```
const { getFilesFromDataTransferItems } = require('datatransfer-files-promise')

const dropzone = document.querySelector('.drop-area')
dropzone.addEventListener('dragover', evt => evt.preventDefault())
dropzone.addEventListener('drop', async evt => {
  evt.preventDefault()
  const files = await getFilesFromDataTransferItems(evt.dataTransfer.items)
  console.log('files', files)
  files.forEach((file, i) => {
    console.log(i, file.filepath)
  })
})
```

[open example in browser](https://datatransfer-files-promise-occf8akg5.now.sh/)
