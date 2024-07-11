async function sendMessage() {
    const input = document.getElementById('input').value;
    const response = await fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: input })
    });
    const data = await response.json();
    document.getElementById('response').innerText = data;
}

async function runScript() {
    const script = document.getElementById('script').value;
    const response = await fetch('/run_script', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ script: script })
    });
    const data = await response.json();
    document.getElementById('scriptOutput').innerText = data.output || data.error;
}

async function modifyFile() {
    const filePath = document.getElementById('filePath').value;
    const modifications = document.getElementById('modifications').value;
    const response = await fetch('/modify_file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file_path: filePath, modifications: modifications })
    });
    const data = await response.json();
    document.getElementById('modificationStatus').innerText = data.status;
}

async function setPermission() {
    const permission = document.getElementById('permission').value;
    const response = await fetch('/permissions/set_permission', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ permission: permission === 'true' })
    });
    const data = await response.json();
    console.log('Permission set to:', data.permission_required);
}

async function setSystemMessage() {
    const system_message = document.getElementById('system_message').value;
    const response = await fetch('/permissions/set_system_message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ system_message })
    });
    const data = await response.json();
    console.log('System message set to:', data.system_message);
}

async function setAllowedActions() {
    const allowed_actions = document.getElementById('allowed_actions').value.split(',');
    const response = await fetch('/permissions/set_allowed_actions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ allowed_actions })
    });
    const data = await response.json();
    console.log('Allowed actions set to:', data.allowed_actions);
}

function showCustomizationOptions() {
    document.getElementById('customization').style.display = 'block';
}

function loadModule() {
    alert('Load module functionality to be implemented.');
}

function showActiveModules() {
    alert('Show active modules functionality to be implemented.');
}

function showIntegratedModules() {
    alert('Show integrated modules functionality to be implemented.');
}

function showConfiguredModules() {
    alert('Show configured modules functionality to be implemented.');
}
