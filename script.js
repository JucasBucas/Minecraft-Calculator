const translations = {
    en: {
        compressorTitle: "Block Compressor",
        compressorSub: "Convert blocks ↔ ingots (9:1 ratio)",
        materialLabel: "Material type",
        quantityUnitLabel: "Quantity & unit",
        convertBtn: "Convert",
        compressorResultLabel: "RESULT",
        buildTitle: "Build Material Calculator",
        buildSub: "Add components → total raw materials",
        buildResultLabel: "REQUIRED RAW MATERIALS",
        blockOption: "Blocks",
        ingotOption: "Ingots / Units",
        addComp: "+ Add Component",
        calculate: "Calculate Total",
        reset: "Reset List",
        emptyBuildMsg: "No components. Press 'Add Component' to start.",
        rawTotalPrefix: "Raw total:",
        footer: "Block = 9 raw units | No typing needed — just select and enter numbers",
        removeBtn: "Remove",
        componentTypes: { block: "Block", ingot: "Ingot/Unit", custom: "Custom Item" },
        materialNames: {
            "Iron Ingot": "Iron", "Gold Ingot": "Gold", "Diamond": "Diamond",
            "Emerald": "Emerald", "Coal": "Coal", "Redstone": "Redstone",
            "Lapis Lazuli": "Lapis", "Copper Ingot": "Copper", "Netherite Ingot": "Netherite"
        }
    },
    ru: {
        compressorTitle: "Компрессор блоков",
        compressorSub: "Перевод блоков в слитки (9:1)",
        materialLabel: "Тип материала",
        quantityUnitLabel: "Количество и единица",
        convertBtn: "Конвертировать",
        compressorResultLabel: "РЕЗУЛЬТАТ",
        buildTitle: "Калькулятор стройматериалов",
        buildSub: "Добавьте компоненты → общие ресурсы",
        buildResultLabel: "НЕОБХОДИМЫЕ РЕСУРСЫ",
        blockOption: "Блоки",
        ingotOption: "Слитки / Единицы",
        addComp: "+ Добавить компонент",
        calculate: "Рассчитать всё",
        reset: "Сбросить",
        emptyBuildMsg: "Нет компонентов. Нажмите 'Добавить компонент'.",
        rawTotalPrefix: "Всего ресурсов:",
        footer: "Блок = 9 единиц | Никакого ввода текста — только выбор и числа",
        removeBtn: "Удалить",
        componentTypes: { block: "Блок", ingot: "Слиток/Ед.", custom: "Особый предмет" },
        materialNames: {
            "Iron Ingot": "Железо", "Gold Ingot": "Золото", "Diamond": "Алмаз",
            "Emerald": "Изумруд", "Coal": "Уголь", "Redstone": "Редстоун",
            "Lapis Lazuli": "Лазурит", "Copper Ingot": "Медь", "Netherite Ingot": "Незерит"
        }
    }
};

let currentLang = 'en';

function t(key, vars = {}) {
    let str = translations[currentLang][key];
    if (!str && key.includes('.')) {
        const parts = key.split('.');
        if (translations[currentLang][parts[0]] && translations[currentLang][parts[0]][parts[1]]) {
            str = translations[currentLang][parts[0]][parts[1]];
        }
    }
    if (!str) str = translations['en'][key] || key;
    for (let k in vars) {
        str = str.replace(`{${k}}`, vars[k]);
    }
    return str;
}

function updateLanguageUI() {
    document.getElementById('compressorTitle').innerText = t('compressorTitle');
    document.getElementById('compressorSub').innerText = t('compressorSub');
    document.getElementById('materialLabel').innerText = t('materialLabel');
    document.getElementById('quantityUnitLabel').innerText = t('quantityUnitLabel');
    document.getElementById('compressBtn').innerText = t('convertBtn');
    document.getElementById('compressorResultLabel').innerText = t('compressorResultLabel');
    document.getElementById('buildTitle').innerText = t('buildTitle');
    document.getElementById('buildSub').innerText = t('buildSub');
    document.getElementById('buildResultLabel').innerText = t('buildResultLabel');
    document.getElementById('addBuildItemBtn').innerText = t('addComp');
    document.getElementById('calculateBuildBtn').innerText = t('calculate');
    document.getElementById('resetBuildBtn').innerText = t('reset');
    document.getElementById('globalFooter').innerText = t('footer');
    
    const unitSelect = document.getElementById('compressorUnit');
    unitSelect.options[0].text = t('blockOption');
    unitSelect.options[1].text = t('ingotOption');
    
    const matSelect = document.getElementById('compressorMaterial');
    for (let i = 0; i < matSelect.options.length; i++) {
        const val = matSelect.options[i].value;
        if (translations[currentLang].materialNames[val]) {
            matSelect.options[i].text = translations[currentLang].materialNames[val];
        }
    }
    
    renderBuildUI();
    updateCompressorResult();
    updateBuildResultPreview();
}

function updateCompressorResult() {
    const materialVal = document.getElementById('compressorMaterial').value;
    const amount = parseFloat(document.getElementById('compressorAmount').value) || 0;
    const unit = document.getElementById('compressorUnit').value;
    const displayDiv = document.getElementById('compressorDisplay');
    
    if (amount <= 0) {
        displayDiv.innerHTML = `0`;
        return;
    }
    
    function getShortName(val) {
        const map = {
            'Iron Ingot': 'Iron Ingot', 'Gold Ingot': 'Gold Ingot', 'Diamond': 'Diamond',
            'Emerald': 'Emerald', 'Coal': 'Coal', 'Redstone': 'Redstone',
            'Lapis Lazuli': 'Lapis', 'Copper Ingot': 'Copper', 'Netherite Ingot': 'Netherite Ingot'
        };
        let raw = map[val] || val;
        if (currentLang === 'ru') {
            const ruMap = {
                'Iron Ingot': 'Железный слиток', 'Gold Ingot': 'Золотой слиток', 'Diamond': 'Алмаз',
                'Emerald': 'Изумруд', 'Coal': 'Уголь', 'Redstone': 'Редстоун',
                'Lapis': 'Лазурит', 'Copper Ingot': 'Медный слиток', 'Netherite Ingot': 'Незеритовый слиток'
            };
            return ruMap[raw] || raw;
        }
        return raw;
    }
    
    const matShort = getShortName(materialVal);
    const matDisplay = translations[currentLang].materialNames[materialVal] || materialVal;
    
    if (unit === 'block') {
        const rawTotal = amount * 9;
        displayDiv.innerHTML = `${amount} ${matDisplay} ${t('blockOption').toLowerCase()} = ${rawTotal} ${matShort}<br><span style="font-size:0.75rem;">${t('rawTotalPrefix')} ${rawTotal} ${matShort}</span>`;
    } else {
        const rawTotal = amount;
        const blocksEquivalent = amount / 9;
        const blockWhole = Math.floor(blocksEquivalent);
        const remainder = amount % 9;
        let breakdown = '';
        if (blockWhole > 0 && remainder > 0) {
            breakdown = `${blockWhole} ${t('blockOption').toLowerCase()} + ${remainder} ${matShort}`;
        } else if (blockWhole > 0) {
            breakdown = `${blockWhole} ${t('blockOption').toLowerCase()}`;
        } else {
            breakdown = `${remainder} ${matShort}`;
        }
        displayDiv.innerHTML = `${amount} ${matShort} = ${breakdown}<br><span style="font-size:0.75rem;">${t('rawTotalPrefix')} ${rawTotal} ${matShort}</span>`;
    }
}

let buildComponents = [];

function materialLocalName(matValue) {
    return translations[currentLang].materialNames[matValue] || matValue;
}

function computeBuildMaterialsMap() {
    const map = new Map();
    for (const comp of buildComponents) {
        let raw = 0;
        if (comp.type === 'block') {
            raw = comp.quantity * 9;
        } else if (comp.type === 'ingot') {
            raw = comp.quantity;
        } else if (comp.type === 'custom') {
            raw = comp.customRaw * comp.quantity;
        }
        const key = comp.materialValue;
        const existing = map.get(key) || 0;
        map.set(key, existing + raw);
    }
    return map;
}

function getMaterialShort(matValue) {
    const map = {
        'Iron Ingot': 'Iron Ingot', 'Gold Ingot': 'Gold Ingot', 'Diamond': 'Diamond',
        'Emerald': 'Emerald', 'Coal': 'Coal', 'Redstone': 'Redstone',
        'Lapis Lazuli': 'Lapis', 'Copper Ingot': 'Copper', 'Netherite Ingot': 'Netherite Ingot'
    };
    let raw = map[matValue] || matValue;
    if (currentLang === 'ru') {
        const ruMap = {
            'Iron Ingot': 'Железный слиток', 'Gold Ingot': 'Золотой слиток', 'Diamond': 'Алмаз',
            'Emerald': 'Изумруд', 'Coal': 'Уголь', 'Redstone': 'Редстоун',
            'Lapis': 'Лазурит', 'Copper Ingot': 'Медный слиток', 'Netherite Ingot': 'Незеритовый слиток'
        };
        return ruMap[raw] || raw;
    }
    return raw;
}

function updateBuildResultPreview() {
    const outputDiv = document.getElementById('buildMaterialOutput');
    const matMap = computeBuildMaterialsMap();
    if (buildComponents.length === 0 || matMap.size === 0) {
        outputDiv.innerHTML = `<div style="padding: 12px; text-align:center;">${t('emptyBuildMsg')}</div>`;
        return;
    }
    let tableHtml = `<table class="material-table"><thead><tr><th>${currentLang === 'ru' ? 'Материал' : 'Material'}</th><th>${currentLang === 'ru' ? 'Всего единиц' : 'Total raw units'}</th><th>${currentLang === 'ru' ? 'Разложение' : 'Breakdown'}</th></tr></thead><tbody>`;
    for (let [matVal, totalRaw] of matMap.entries()) {
        const blocks = Math.floor(totalRaw / 9);
        const loose = totalRaw % 9;
        let breakdown = '';
        const matShort = getMaterialShort(matVal);
        if (blocks > 0 && loose > 0) breakdown = `${blocks} ${t('blockOption').toLowerCase()} + ${loose} ${matShort}`;
        else if (blocks > 0) breakdown = `${blocks} ${t('blockOption').toLowerCase()}`;
        else breakdown = `${loose} ${matShort}`;
        tableHtml += `<tr><td><strong>${materialLocalName(matVal)}</strong></td><td>${totalRaw}</td><td>${breakdown}</td></tr>`;
    }
    tableHtml += `</tbody></table><div style="font-size:0.7rem; margin-top:6px;">1 ${t('blockOption').toLowerCase()} = 9 raw units</div>`;
    outputDiv.innerHTML = tableHtml;
}

function renderBuildUI() {
    const container = document.getElementById('buildItemsContainer');
    if (!container) return;
    if (buildComponents.length === 0) {
        container.innerHTML = `<div style="background:#f1f5f9; border-radius:1rem; padding:1rem; text-align:center;">${t('emptyBuildMsg')}</div>`;
        return;
    }
    let html = '';
    const materialOptions = ['Iron Ingot', 'Gold Ingot', 'Diamond', 'Emerald', 'Coal', 'Redstone', 'Lapis Lazuli', 'Copper Ingot', 'Netherite Ingot'];
    
    buildComponents.forEach((comp, idx) => {
        const typeVal = comp.type;
        const matVal = comp.materialValue;
        const qty = comp.quantity;
        const customRawVal = comp.customRaw || 1;
        html += `<div class="build-item-row" data-idx="${idx}">
                    <select class="build-type" data-idx="${idx}" style="width:120px;">
                        <option value="block" ${typeVal === 'block' ? 'selected' : ''}>${t('componentTypes.block')}</option>
                        <option value="ingot" ${typeVal === 'ingot' ? 'selected' : ''}>${t('componentTypes.ingot')}</option>
                        <option value="custom" ${typeVal === 'custom' ? 'selected' : ''}>${t('componentTypes.custom')}</option>
                    </select>
                    <select class="build-material" data-idx="${idx}" style="min-width:130px;">`;
        for (let mat of materialOptions) {
            const displayName = materialLocalName(mat);
            html += `<option value="${mat}" ${matVal === mat ? 'selected' : ''}>${displayName}</option>`;
        }
        html += `</select>
                    <input type="number" class="build-qty" data-idx="${idx}" value="${qty}" step="1" min="0" style="width:100px;">
                    ${typeVal === 'custom' ? `<input type="number" class="build-custom-raw-val" data-idx="${idx}" value="${customRawVal}" step="1" min="1" placeholder="Raw/ea" style="width:100px;">` : ''}
                    <button class="remove-build-btn" data-idx="${idx}" style="background:#dc2626; padding:6px 12px;">${t('removeBtn')}</button>
                </div>`;
    });
    container.innerHTML = html;
    attachBuildEvents();
}

function attachBuildEvents() {
    document.querySelectorAll('.build-type').forEach(sel => {
        sel.addEventListener('change', (e) => {
            const idx = parseInt(sel.getAttribute('data-idx'));
            if (!isNaN(idx) && buildComponents[idx]) {
                buildComponents[idx].type = sel.value;
                if (buildComponents[idx].type === 'custom' && !buildComponents[idx].customRaw) {
                    buildComponents[idx].customRaw = 1;
                }
                renderBuildUI();
            }
        });
    });
    document.querySelectorAll('.build-material').forEach(sel => {
        sel.addEventListener('change', (e) => {
            const idx = parseInt(sel.getAttribute('data-idx'));
            if (!isNaN(idx) && buildComponents[idx]) {
                buildComponents[idx].materialValue = sel.value;
                renderBuildUI();
            }
        });
    });
    document.querySelectorAll('.build-qty').forEach(inp => {
        inp.addEventListener('change', (e) => {
            const idx = parseInt(inp.getAttribute('data-idx'));
            if (!isNaN(idx) && buildComponents[idx]) {
                buildComponents[idx].quantity = parseFloat(inp.value) || 0;
            }
        });
    });
    document.querySelectorAll('.build-custom-raw-val').forEach(inp => {
        inp.addEventListener('change', (e) => {
            const idx = parseInt(inp.getAttribute('data-idx'));
            if (!isNaN(idx) && buildComponents[idx] && buildComponents[idx].type === 'custom') {
                buildComponents[idx].customRaw = parseFloat(inp.value) || 1;
            }
        });
    });
    document.querySelectorAll('.remove-build-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.getAttribute('data-idx'));
            if (!isNaN(idx)) {
                buildComponents.splice(idx, 1);
                renderBuildUI();
                updateBuildResultPreview();
            }
        });
    });
}

function addBuildComponent() {
    buildComponents.push({
        type: 'block',
        materialValue: 'Iron Ingot',
        quantity: 1,
        customRaw: 1
    });
    renderBuildUI();
}

function resetBuildList() {
    buildComponents = [];
    renderBuildUI();
    updateBuildResultPreview();
}

function calculateAndShow() {
    updateBuildResultPreview();
}

document.addEventListener('DOMContentLoaded', () => {
    const enBtn = document.getElementById('langEnBtn');
    const ruBtn = document.getElementById('langRuBtn');
    
    enBtn.addEventListener('click', () => {
        currentLang = 'en';
        enBtn.classList.add('active');
        ruBtn.classList.remove('active');
        updateLanguageUI();
    });
    
    ruBtn.addEventListener('click', () => {
        currentLang = 'ru';
        ruBtn.classList.add('active');
        enBtn.classList.remove('active');
        updateLanguageUI();
    });
    
    document.getElementById('compressorAmount').addEventListener('input', updateCompressorResult);
    document.getElementById('compressorUnit').addEventListener('change', updateCompressorResult);
    document.getElementById('compressorMaterial').addEventListener('change', updateCompressorResult);
    document.getElementById('compressBtn').addEventListener('click', updateCompressorResult);
    
    document.getElementById('addBuildItemBtn').addEventListener('click', addBuildComponent);
    document.getElementById('calculateBuildBtn').addEventListener('click', calculateAndShow);
    document.getElementById('resetBuildBtn').addEventListener('click', resetBuildList);
    
    buildComponents = [
        { type: 'block', materialValue: 'Iron Ingot', quantity: 4, customRaw: 1 },
        { type: 'ingot', materialValue: 'Gold Ingot', quantity: 128, customRaw: 1 },
        { type: 'custom', materialValue: 'Netherite Ingot', quantity: 6, customRaw: 4 }
    ];
    renderBuildUI();
    updateCompressorResult();
    updateBuildResultPreview();
    updateLanguageUI();
});