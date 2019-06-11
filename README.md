# datatransfer-files-promise
Get a promise for a flat array of files from the 'drop' event, like `<input type="file"/>.files`.

## Features
- Directories are traversed recursively.
- Correctly handles > 100 entries per directory.
- Correctly handles selections of files instead of a directory.
- `filepath` is the property added to each file for convenience. If you don't want it for some reason then use `getFilesFromDataTransferItems(items, {raw: true})`.

## Usage:

### Simple example with raw html and promises
```
<html>
  <body>
    <div class='dropzone' style='width: 500px; height: 500px; border: solid black 2px'></div>
    <script src='path-to/datatransfer-files-promise/index.js'></script>
    <script>
      const dropzone = document.querySelector('.dropzone')
      dropzone.addEventListener('dragover', evt => evt.preventDefault())
      dropArea.addEventListener('drop', event => {
        event.preventDefault()
        const items = event.dataTransfer.items
        window.getFilesFromDataTransferItems(items)
          .then(files => {
            console.log(files[0].filepath)
          })
      }, false)
    </script>
  </body>
</html>
```
[open this example in browser](https://htmlpreview.github.io/?https://github.com/grabantot/datatransfer-files-promise/blob/master/index.html)

### Example with require (through babel or similar tools) and async/await
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
