# datatransfer-files-promise
Get a promise for a flat array of files from the 'drop' event, like `<input type="file"/>.files`. Directories are traversed recursively.


## Usage:
```
const { getFilesFromDataTransferItems } = require('datatransfer-files-promise')

const dropArea = document.querySelector('.drop-area')
dropArea.addEventListener('drop', event => {
  event.preventDefault()
  const items = event.dataTransfer.items
  getFilesFromDataTransferItems(items)
    .then(files => {
      ...
      console.log(files[0].filepath)
    })
}, false)
```
`filepath` is the property added to each file for convenience. If you don't want it for some reason then use `getFilesFromDataTransferItems(items, {raw: true})`.