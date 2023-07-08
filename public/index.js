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

async function makedoc(file, e) {
    var formData = new FormData();
    formData.append('document', file);

    const res = await fetch('/makedoc', {
        method: 'POST',
        body: formData,
    });

    console.log(await res.text());
}
