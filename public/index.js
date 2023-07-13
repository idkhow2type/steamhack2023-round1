const fileInput = document.querySelector('input[type=file]');

fileInput.addEventListener('change', async (e) => {
    const file = fileInput.files[0];
    const preview = document.querySelector('.preview pre');
    const submit = document.querySelector('.preview button');

    preview.innerText = await file.text();
    preview.parentElement.querySelector('h3').innerText = file.name; // this is hacky idfc

    submit.addEventListener('click', makedoc.bind(null, file));

    fileInput.value = null;
    fileInput.blur();
});

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
    }).then(async (res) => {
        preview.classList.remove('loading')
        downloadFile(await res.arrayBuffer(), file.name);
    });
    preview.classList.add('loading')
}
