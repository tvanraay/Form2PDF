const api = window.electronAPI;

function uploadFile(input, isPDF) {
    const filepath = input.files[0].path;

    if (isPDF) {
        api.postPDF(filepath);
    } else {
        api.postCSV(filepath);
    }

    const filename = sanitzeFilename(filepath);
    const id = isPDF ? "pdf" : "csv";

    removeElementById(id);
    addStringToList(filename, id);
}

async function processPDF() {
    await api.processPDF();
    
    alert("sucessfully processed PDF");
}

function sanitzeFilename(filename) {
    return filename.replace(/^.*[\\\/]/, '');
}

function removeElementById(id) {
    const element = document.getElementById(id);
    if (typeof(element) != 'undefined' && element != null) {
        element.remove();
    }
}

function addStringToList(string, id) {
    const list = document.getElementById("file-list");
    const entry = document.createElement('li');

    entry.appendChild(document.createTextNode(string));
    entry.setAttribute("id", id);

    list.appendChild(entry);
}
