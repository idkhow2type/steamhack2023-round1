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
        const treeView = generateTree(Object.keys(zipData.files));
        preview.innerText = treeView;
    } else {
        // For non-zip files, display the content as text
        preview.innerText = await file.text();
    }
    // Reset the submit button event listener
    const newSubmit = submit.cloneNode(true)
    submit.parentElement.replaceChild(newSubmit,submit)
    newSubmit.addEventListener('click', makedoc.bind(null, file));
    submit.remove()

    preview.parentElement.querySelector('h3').innerText = file.name;

    fileInput.value = null;
    fileInput.blur();
});

function generateTree(fileList) {
    const tree = {};

    // Helper function to create directories and files in the tree
    function createNode(path, nodeType) {
        const parts = path.split('/');
        let currentNode = tree;

        for (const part of parts) {
            if (!currentNode[part]) {
                currentNode[part] = {};
            }
            currentNode = currentNode[part];
        }

        currentNode.__name = parts[parts.length - 1];
        currentNode.__type = nodeType;
    }

    // Populate the tree with directories and files
    for (const file of fileList) {
        if (file.includes('/')) {
            const [dirPath, fileName] = file.split('/');

            createNode(dirPath, 'directory');
            createNode(`${dirPath}/${fileName}`, 'file');
        } else {
            createNode(file, 'file');
        }
    }

    // Helper function to generate the ASCII tree view
    function generateAsciiTree(node, prefix = '', isLast = true) {
        const marker = isLast ? '└── ' : '├── ';

        let output = '';
        if (node.__name) {
            output = prefix + marker + node.__name;

            if (node.__type === 'directory') {
                output += '/';
            }
            output += '\n';
        }


        const children = Object.keys(node)
            .filter((key) => key !== '__type' && key !== '__name')
            .map((key) => node[key]);

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const isLastChild = i === children.length - 1;
            const newPrefix =
                prefix + (isLast ? (node.__name ? '    ' : '') : '│   ');

            output += generateAsciiTree(child, newPrefix, isLastChild);
        }

        return output;
    }

    // Start generating the tree view from the root
    return generateAsciiTree(tree);
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
            if (!res.ok) alert(await res.text());
            downloadFile(await res.arrayBuffer(), file.name);
        })
        .finally(() => {
            preview.classList.remove('loading');
        });
    preview.classList.add('loading');
}
