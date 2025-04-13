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
    "@minecraft/server-admin": ["1.0.0-beta"],
    "min_engine_versions": [
        "1.0.0", "1.1.0", "1.2.0", "1.3.0", "1.4.0",
        "1.5.0", "1.6.0", "1.7.0", "1.8.0", "1.9.0",
        "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0",
        "1.15.0", "1.16.0", "1.17.0", "1.18.0", "1.19.0",
        "1.20.0", "1.21.0"
    ]
};

let currentTab = 'rp';
let rpManifest = null; // Untuk menyimpan manifest Resource Pack
let bpManifest = null; // Untuk menyimpan manifest Behavior Pack

// Fungsi untuk mengisi dropdown min_engine_version
function populateMinEngineVersionDropdowns() {
    const rpMinEngineSelect = document.getElementById('rp-min-engine-version');
    const bpMinEngineSelect = document.getElementById('bp-min-engine-version');

    // Mengisi dropdown untuk Resource Pack
    API_VERSIONS["min_engine_versions"].forEach(version => {
        const option = document.createElement('option');
        option.value = version;
        option.textContent = version;
        rpMinEngineSelect.appendChild(option);
    });

    // Mengisi dropdown untuk Behavior Pack
    API_VERSIONS["min_engine_versions"].forEach(version => {
        const option = document.createElement('option');
        option.value = version;
        option.textContent = version;
        bpMinEngineSelect.appendChild(option);
    });
}

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

    // Populate min engine version dropdowns
    populateMinEngineVersionDropdowns(); // Panggil fungsi ini di sini
});

// Tab switching
function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    document.getElementById(tab + '-form').classList.remove('hidden');
    document.querySelectorAll('.form-section').forEach(form => {
        form.classList.toggle('hidden', form.id !== `${tab}-form`);
    });

    document.addEventListener('DOMContentLoaded', () => {
        switchTab('rp'); // Force initial state
    });
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

// Behavior Pack Subpack management
function addBpSubpack() {
    const container = document.getElementById('bp-subpacks-container');
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
            min_engine_version: document.getElementById(currentTab === 'rp' ? 'rp-min-engine-version' : 'bp-min-engine-version').value // Update this line
        },
        modules: []
    };

    // Handle Resource Pack
    if (currentTab === 'rp') {
        manifest.modules.push({
            type: 'resources',
            uuid: document.getElementById('rp-uuid-module').value,
            version: [
                parseInt(document.getElementById('rp-version-major').value),
                parseInt(document.getElementById('rp-version-minor').value),
                parseInt(document.getElementById('rp-version-rev').value)
            ]
        });

        // Handle capabilities jika ada yang dicentang
        const capabilities = [];
        document.querySelectorAll('.rp-capability:checked').forEach(cb => {
            capabilities.push(cb.value);
        });
        if (capabilities.length > 0) {
            manifest.header.capabilities = capabilities;
        }

        // Handle subpacks jika ada
        const subpacks = [];
        document.querySelectorAll('.subpack-item').forEach(item => {
            subpacks.push({
                name: item.querySelector('.subpack-name').value,
                folder_name: item.querySelector('.subpack-folder').value,
                memory_tier: parseInt(item.querySelector('.subpack-tier').value)
            });
        });
        if (subpacks.length > 0) {
            manifest.subpacks = subpacks;
        }

        rpManifest = manifest;
    } 
    // Handle Behavior Pack
    else if (currentTab === 'bp') {
        // Data Module
        if (document.getElementById('enable-data').checked) {
            manifest.modules.push({
                type: 'data',
                uuid: document.getElementById('bp-uuid-data').value,
                version: [
                    parseInt(document.getElementById('bp-version-major').value),
                    parseInt(document.getElementById('bp-version-minor').value),
                    parseInt(document.getElementById('bp-version-rev').value)
                ]
            });
        }

        // Script Module
        if (document.getElementById('enable-script').checked) {
            const scriptModule = {
                type: 'script',
                language: 'javascript', // Added language field
                uuid: document.getElementById('bp-uuid-script').value,
                version: [
                    parseInt(document.getElementById('bp-version-major').value),
                    parseInt(document.getElementById('bp-version-minor').value),
                    parseInt(document.getElementById('bp-version-rev').value)
                ],
                entry: document.getElementById('bp-script-entry').value || 'scripts/main.js' // Added default entry
            };

            // Handle API dependencies (module_name format)
            const apiDependencies = [];
            document.querySelectorAll('.api-item').forEach(item => {
                const moduleName = item.querySelector('.api-module').value;
                const version = item.querySelector('.api-version').value; // <-- HAPUS SPASI SEBELUM .api-version
                if (moduleName && version) {
                    apiDependencies.push({
                        module_name: moduleName,
                        version: version
                    });
                }
            });
            if (apiDependencies.length > 0) {
                scriptModule.dependencies = apiDependencies;
            }

            manifest.modules.push(scriptModule);
        }

        // Handle external dependencies (UUID format)
        const uuidDependencies = [];
        document.querySelectorAll('.dependency-item').forEach(item => {
            const inputs = item.querySelectorAll('input');
            if (inputs[0].value && inputs[1].value) {
                uuidDependencies.push({
                    uuid: inputs[0].value,
                    version: inputs[1].value.match(/\d+/g) ? 
                        inputs[1].value.split(',').map(Number) : // Array version [1,0,0]
                        inputs[1].value // String version "1.0.0"
                });
            }
        });
        if (uuidDependencies.length > 0) {
            manifest.dependencies = uuidDependencies;
        }

        // Add capabilities for BP
        manifest.capabilities = ["script_eval"]; // Or get from form inputs

        const subpacks = [];
        document.querySelectorAll('#bp-subpacks-container .subpack-item').forEach(item => {
            subpacks.push({
                name: item.querySelector('.subpack-name').value,
                folder_name: item.querySelector('.subpack-folder').value,
                memory_tier: parseInt(item.querySelector('.subpack-tier').value)
            });
        });
        if (subpacks.length > 0) {
            manifest.subpacks = subpacks;
        }

        bpManifest = manifest;
    }

    // Tampilkan manifest di output
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
    const zip = new JSZip();

    if (format === 'mcpack') {
        // Unduh hanya manifest dari tab aktif
        const manifest = currentTab === 'rp' ? rpManifest : bpManifest;
        if (!manifest) {
            alert(`Please generate the ${currentTab === 'rp' ? 'Resource Pack' : 'Behavior Pack'} manifest first!`);
            return;
        }

        zip.file('manifest.json', JSON.stringify(manifest, null, 4));
    } else if (format === 'mcaddon') {
        // Gabungkan RP dan BP ke dalam satu file
        if (!rpManifest || !bpManifest) {
            alert('Please generate both Resource Pack and Behavior Pack manifests first!');
            return;
        }

        // Tambahkan Resource Pack ke ZIP
        const rpFolder = zip.folder('resource_pack');
        rpFolder.file('manifest.json', JSON.stringify(rpManifest, null, 4));
        rpFolder.file('textures/texture.png', ''); // Placeholder untuk file texture

        // Tambahkan Behavior Pack ke ZIP
        const bpFolder = zip.folder('behavior_pack');
        bpFolder.file('manifest.json', JSON.stringify(bpManifest, null, 4));
        bpFolder.file('scripts/main.js', '// Example script content'); // Placeholder untuk file script
    }

    // Generate ZIP dan unduh
    zip.generateAsync({ type: 'blob' }).then((content) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = `pack.${format}`;
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
        document.getElementById('bp-subpacks-container').innerHTML = '';
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