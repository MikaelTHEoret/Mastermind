document.getElementById('send-btn').addEventListener('click', function () {
    const userInput = document.getElementById('user-input').value;
    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: userInput })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('response').textContent = JSON.stringify(data, null, 2);
    });
});

document.getElementById('run-script-btn').addEventListener('click', function () {
    const scriptInput = document.getElementById('script-input').value;
    fetch('/run_script', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ script: scriptInput })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('script-output').textContent = JSON.stringify(data, null, 2);
    });
});

document.getElementById('modify-file-btn').addEventListener('click', function () {
    const filePath = document.getElementById('file-path').value;
    const fileModifications = document.getElementById('file-modifications').value;
    fetch('/modify_file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file_path: filePath, modifications: fileModifications })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('modification-status').textContent = JSON.stringify(data, null, 2);
    });
});
