// API Version Data
const API_VERSIONS = {
    "@minecraft/server": [
        "2.0.0-beta", "1.17.0", "1.16.0", "1.15.0", "1.14.0", 
        "1.13.0", "1.12.0", "1.11.0", "1.10.0", "1.9.0",
        "1.8.0", "1.7.0", "1.6.0", "1.5.0", "1.4.0",
        "1.3.0", "1.2.0", "1.1.0", "1.0.0"
    ],
    "@minecraft/server-ui": [
        "2.0.0-beta", "1.3.0", "1.2.0", "1.1.0", "1.0.0"
    ],
    "@minecraft/server-net": ["1.0.0-beta"],
    "@minecraft/server-admin": ["1.0.0-beta"]
};

let currentTab = 'rp';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set up module toggles
    document.getElementById('enable-data').addEventListener('change', function() {
        document.getElementById('data-module-section').style.display = 
            this.checked ? 'block' : 'none';
    });
    
    document.getElementById('enable-script').addEventListener('change', function() {
        document.getElementById('script-module-section').style.display = 
            this.checked ? 'block' : 'none';
    });
    
    // Generate default UUIDs
    generateUUID('rp-uuid-header');
    generateUUID('rp-uuid-module');
    generateUUID('bp-uuid-data');
    generateUUID('bp-uuid-script');
});

// Tab switching
function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.form-section').forEach(el => el.classList.add('hidden'));
    document.getElementById(tab + '-form').classList.remove('hidden');
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// UUID generation
function generateUUID(id) {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    const element = document.getElementById(id);
    if (element) {
        element.value = uuid;
    }
    return uuid;
}

// Subpack management
function addSubpack() {
    const container = document.getElementById('subpacks-container');
    const div = document.createElement('div');
    div.className = 'subpack-item';
    div.innerHTML = `
        <button class="remove-btn" onclick="this.parentNode.remove()">×</button>
        <input type="text" placeholder="Subpack Name" class="subpack-name" required>
        <input type="text" placeholder="Folder Name" class="subpack-folder" required>
        <select class="subpack-tier">
            <option value="1">Tier 1 (Low Memory)</option>
            <option value="2">Tier 2 (Medium)</option>
            <option value="3">Tier 3 (High)</option>
        </select>
    `;
    container.appendChild(div);
}

// Dependency management
function addDependency() {
    const container = document.getElementById('bp-dependencies');
    const div = document.createElement('div');
    div.className = 'dependency-item';
    div.innerHTML = `
        <button class="remove-btn" onclick="this.parentNode.remove()">×</button>
        <input type="text" placeholder="UUID or Module Name" required>
        <input type="text" placeholder="Version (e.g. 1.0.0 or [1,0,0])" required>
    `;
    container.appendChild(div);
}

// API Module management
function addApiModule() {
    const container = document.getElementById('script-apis');
    const div = document.createElement('div');
    div.className = 'api-item';
    div.innerHTML = `
        <select class="api-module" onchange="updateApiVersions(this)">
            <option value="">Choose Module</option>
            <option value="@minecraft/server">@minecraft/server</option>
            <option value="@minecraft/server-ui">@minecraft/server-ui</option>
            <option value="@minecraft/server-net">@minecraft/server-net</option>
            <option value="@minecraft/server-admin">@minecraft/server-admin</option>
        </select>
        <select class="api-version">
            <option value="">Choose Version</option>
        </select>
        <button class="remove-btn" onclick="this.parentNode.remove()">×</button>
    `;
    container.appendChild(div);
}

// Update API versions when module is selected
function updateApiVersions(selectElement) {
    const versionSelect = selectElement.parentNode.querySelector('.api-version');
    const moduleName = selectElement.value;
    
    versionSelect.innerHTML = '<option value="">Choose Version</option>';
    
    if (moduleName && API_VERSIONS[moduleName]) {
        API_VERSIONS[moduleName].forEach(version => {
            const option = document.createElement('option');
            option.value = version;
            option.textContent = version;
            versionSelect.appendChild(option);
        });
    }
}

// Main generator function
function generateManifest() {
    const manifest = {
        format_version: 2,
        header: {
            name: document.getElementById(currentTab === 'rp' ? 'rp-name' : 'bp-name').value,
            description: document.getElementById(currentTab === 'rp' ? 'rp-description' : 'bp-description').value,
            uuid: document.getElementById(currentTab === 'rp' ? 'rp-uuid-header' : 'bp-uuid-data').value,
            version: [
                parseInt(document.getElementById(currentTab === 'rp' ? 'rp-version-major' : 'bp-version-major').value),
                parseInt(document.getElementById(currentTab === 'rp' ? 'rp-version-minor' : 'bp-version-minor').value),
                parseInt(document.getElementById(currentTab === 'rp' ? 'rp-version-rev' : 'bp-version-rev').value)
            ],
            min_engine_version: [
                parseInt(document.getElementById(currentTab === 'rp' ? 'rp-min-engine-major' : 'bp-min-engine-major').value),
                parseInt(document.getElementById(currentTab === 'rp' ? 'rp-min-engine-minor' : 'bp-min-engine-minor').value),
                parseInt(document.getElementById(currentTab === 'rp' ? 'rp-min-engine-rev' : 'bp-min-engine-rev').value)
            ]
        },
        modules: [
            {
                type: currentTab === 'rp' ? 'resources' : 'data',
                uuid: document.getElementById(currentTab === 'rp' ? 'rp-uuid-module' : 'bp-uuid-script').value,
                version: [
                    parseInt(document.getElementById(currentTab === 'rp' ? 'rp-version-major' : 'bp-version-major').value),
                    parseInt(document.getElementById(currentTab === 'rp' ? 'rp-version-minor' : 'bp-version-minor').value),
                    parseInt(document.getElementById(currentTab === 'rp' ? 'rp-version-rev' : 'bp-version-rev').value)
                ]
            }
        ]
    };

    document.getElementById('output').textContent = JSON.stringify(manifest, null, 4);
}

// Utility functions
function copyToClipboard() {
    const output = document.getElementById('output').textContent;
    if(!output || output.startsWith('//') || output.startsWith('Error:')) {
        alert('Generate a valid manifest first!');
        return;
    }
    
    navigator.clipboard.writeText(output)
        .then(() => alert('Copied to clipboard!'))
        .catch(err => alert('Failed to copy: ' + err));
}

function downloadManifest() {
    const output = document.getElementById('output').textContent;
    if(!output || output.startsWith('//') || output.startsWith('Error:')) {
        alert('Generate a valid manifest first!');
        return;
    }
    
    const blob = new Blob([output], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Fungsi untuk membuat file .mcpack atau .mcaddon
function downloadPack(format) {
    const output = document.getElementById('output').textContent;
    if (!output || output.startsWith('//') || output.startsWith('Error:')) {
        alert('Generate a valid manifest first!');
        return;
    }

    try {
        JSON.parse(output); // Validasi JSON
    } catch (e) {
        alert('The manifest content is not valid JSON!');
        return;
    }

    const zip = new JSZip();

    // Tambahkan manifest.json
    zip.file('manifest.json', output);

    // Tambahkan file tambahan berdasarkan tab aktif (RP atau BP)
    if (currentTab === 'rp') {
        // Resource Pack: Tambahkan folder textures, sounds, dll.
        zip.file('textures/texture.png', ''); // Placeholder untuk file texture
        zip.file('sounds/sound.ogg', ''); // Placeholder untuk file sound
    } else if (currentTab === 'bp') {
        // Behavior Pack: Tambahkan folder scripts jika Script Module diaktifkan
        const enableScript = document.getElementById('enable-script').checked;
        if (enableScript) {
            zip.file('scripts/main.js', '// Example script content'); // Placeholder untuk file script
        }

        // Tambahkan folder functions sebagai contoh
        zip.file('functions/example.mcfunction', '# Example function content'); // Placeholder untuk file function
    }

    // Generate ZIP dan unduh
    zip.generateAsync({ type: 'blob' }).then((content) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = `pack.${format}`; // Ekstensi file sesuai format
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }).catch((err) => {
        alert('Failed to generate the pack: ' + err.message);
    });
}

function clearForm() {
    if(confirm('Are you sure you want to clear all fields?')) {
        document.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(el => {
            el.value = '';
        });
        document.getElementById('rp-version-major').value = '1';
        document.getElementById('rp-version-minor').value = '0';
        document.getElementById('rp-version-rev').value = '0';
        document.getElementById('enable-data').checked = true;
        document.getElementById('enable-script').checked = true;
        document.getElementById('data-module-section').style.display = 'block';
        document.getElementById('script-module-section').style.display = 'block';
        document.getElementById('subpacks-container').innerHTML = '';
        document.getElementById('bp-dependencies').innerHTML = '';
        document.getElementById('script-apis').innerHTML = `
            <div class="api-item">
                <select class="api-module" onchange="updateApiVersions(this)">
                    <option value="">Choose Module</option>
                    <option value="@minecraft/server">@minecraft/server</option>
                    <option value="@minecraft/server-ui">@minecraft/server-ui</option>
                    <option value="@minecraft/server-net">@minecraft/server-net</option>
                    <option value="@minecraft/server-admin">@minecraft/server-admin</option>
                </select>
                <select class="api-version">
                    <option value="">Choose Version</option>
                </select>
                <button class="remove-btn" onclick="this.parentNode.remove()">×</button>
            </div>
        `;
        document.getElementById('output').textContent = '// Your manifest will appear here';
    }
}