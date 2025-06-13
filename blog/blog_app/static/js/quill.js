document.addEventListener('DOMContentLoaded', function() {
    var quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'link'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['image']
            ]
        }
    });

    quill.getModule('toolbar').addHandler('image', function() {
        document.getElementById('image-upload').click();
    });

    document.getElementById('image-upload').addEventListener('change', function(e) {
        var file = e.target.files[0];
        var formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.url) {
                quill.insertEmbed(quill.getSelection().index, 'image', data.url);
                document.getElementById('image_path').value = data.url;
            }
        });
    });

    document.querySelector('form').onsubmit = function() {
        document.getElementById('content').value = quill.root.innerHTML;
    };
});