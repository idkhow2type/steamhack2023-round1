const fileInput = document.querySelector('input[type=file]');

fileInput.addEventListener('change', async (e) => {
    const file = fileInput.files[0];
    const preview = document.querySelector('.preview pre');
    const submit = document.querySelector('.preview button');

    if (file.name.endsWith('.zip')) {
        const zip = new JSZip();

        // Read the zip file
        const zipData = await zip.loadAsync(file);

        // Display the tree view of the file structure
        const treeView = createTreeView(zipData, '');
        preview.innerText = treeView;

        // Reset the submit button event listener
        submit.removeEventListener('click', makedoc);
        submit.addEventListener('click', makedoc.bind(null, file));
    } else {
        // For non-zip files, display the content as text
        preview.innerText = await file.text();
    }

    preview.parentElement.querySelector('h3').innerText = file.name;

    fileInput.value = null;
    fileInput.blur();
});

function createTreeView(zipData, indent) {
    let treeView = '';

    const zipObjs = zipData.filter((path) => !/^([\w.]+\/)+[\w.]+$/.test(path));
    zipObjs.forEach((zipEntry, i) => {
        const relativePath = zipEntry.name;
        const isDirectory = zipEntry.dir;
        const fileName = isDirectory ? relativePath : zipEntry.name;

        const isLast = i === zipObjs.length - 1;
        treeView += indent + (isLast ? '└── ' : '├── ') + fileName + '\n';

        if (isDirectory) {
            const subZipData = zipData.folder(relativePath);
            const subIndent = indent + (isLast ? '    ' : '│   ');
            treeView += createTreeView(subZipData, subIndent);
        }
    });

    return treeView;
}

function downloadFile(arrayBuffer, fileName) {
    // Create a Blob from the ArrayBuffer
    const blob = new Blob([arrayBuffer]);

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    // Trigger a click event on the link
    link.dispatchEvent(new MouseEvent('click'));

    // Clean up the URL object
    URL.revokeObjectURL(url);
}

/**
 * @param  {File} file
 * @param  {} e
 */
function makedoc(file, e) {
    const preview = document.querySelector('.preview pre');
    var formData = new FormData();
    formData.append('document', file);

    fetch('/makedoc', {
        method: 'POST',
        body: formData,
    })
        .then(async (res) => {
            downloadFile(await res.arrayBuffer(), file.name);
        })
        .catch((err) => {
            alert(err);
        })
        .finally(() => {
            preview.classList.remove('loading');
        });
    preview.classList.add('loading');
}
