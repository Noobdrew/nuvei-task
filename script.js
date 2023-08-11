async function getData() {
    const resp = await fetch('./example.json');
    return await resp.json();
}
const createElement = (type, attributes) => {
    const element = document.createElement(type);
    Object.assign(element, attributes);
    return element;
};

const jsonData = await getData();


setupForm()
// Main function to set up the form
async function setupForm() {
    const container = document.getElementById('container');
    // Create form elements based on JSON data
    for (const key in jsonData.meta) {
        const metaItem = jsonData.meta[key];
        const label = createElement('label', { textContent: metaItem.label });

        let inputElement;

        if (metaItem.type === 'dropdown') {
            inputElement = createDropdown(metaItem);
        } else if (metaItem.type === 'radio') {
            inputElement = createRadioGroup(key, metaItem);
        } else if (metaItem.type === 'checkbox') {
            inputElement = createCheckbox(metaItem);
        } else {
            inputElement = createInput(metaItem);
        }

        setCommonAttributes(inputElement, key, jsonData.props[key], metaItem.defaultValue);
        label.appendChild(inputElement);
        container.appendChild(label);
    }

    createButtons();
}

// Create dropdown element
function createDropdown(metaItem) {
    const selectElement = createElement('select');
    for (const valueObj of metaItem.values) {
        const [value, label] = Object.entries(valueObj)[0];
        const option = createElement('option', { value, textContent: label });
        selectElement.appendChild(option);
    }
    return selectElement;
}

// Create radio group element
function createRadioGroup(key, metaItem) {
    const radioContainer = createElement('div', { className: 'radio' });
    for (const valueObj of metaItem.values) {
        const [value, label] = Object.entries(valueObj)[0];
        const radioInput = createElement('input', {
            type: 'radio',
            name: key,
            value,
            id: `${key}-${value}`
        });
        const radioLabel = createElement('label', {
            textContent: label,
            htmlFor: `${key}-${value}`
        });
        radioContainer.appendChild(radioInput);
        radioContainer.appendChild(radioLabel);
        if (value === (jsonData.props[key] || metaItem.defaultValue)) {
            radioInput.checked = true;
        }
    }
    return radioContainer;
}

// Create checkbox element
function createCheckbox(metaItem) {
    const checkbox = createElement('input', { type: 'checkbox' });
    if (jsonData.props[metaItem] === 'true') {
        checkbox.checked = true;
    }
    return checkbox;
}

// Create input element
function createInput(metaItem) {
    return createElement('input', { type: metaItem.type });
}

// Set common attributes for form elements
function setCommonAttributes(inputElement, key, propValue, defaultValue) {
    inputElement.id = key;
    inputElement.name = key;
    inputElement.value = propValue || defaultValue;
}

// Create buttons and attach event listeners
function createButtons() {
    const setDefaultsButton = createElement('button', { textContent: 'Set Defaults' });
    const resetButton = createElement('button', { textContent: 'Reset' });
    const saveButton = createElement('button', { textContent: 'Save' });

    setDefaultsButton.addEventListener('click', setDefaults);
    resetButton.addEventListener('click', resetForm);
    saveButton.addEventListener('click', saveForm);

    container.appendChild(setDefaultsButton);
    container.appendChild(resetButton);
    container.appendChild(saveButton);
}

function setDefaults() {
    for (const key in jsonData.meta) {
        const metaItem = jsonData.meta[key];
        const inputElement = document.getElementById(key);

        if (inputElement.type === 'checkbox') {
            const strValue = jsonData.meta[key].defaultValue
            const boolValue = strValue === "false" ? false : true;
            console.log(boolValue)
            inputElement.checked = boolValue
        } else if (inputElement.className === 'radio') {
            const radioGroup = document.getElementsByName(key);
            for (let i = 0; i < radioGroup.length; i++) {
                const element = radioGroup[i]

                if (element.value === jsonData.meta[key].defaultValue) {
                    element.checked = jsonData.meta[key].defaultValue
                }
            }
        } else {
            inputElement.value = metaItem.defaultValue;
        }
    }
}


function resetForm() {
    for (const key in jsonData.meta) {
        const metaItem = jsonData.meta[key];
        const inputElement = document.getElementById(key);

        if (inputElement.type === 'checkbox') {
            inputElement.checked = jsonData.props[key] === 'true';
        } else if (inputElement.className === 'radio') {
            const radioGroup = document.getElementsByName(key);
            for (let i = 0; i < radioGroup.length; i++) {
                const element = radioGroup[i]
                if (element.value === jsonData.props[key]) {
                    element.checked = true

                }
            }
        } else {
            inputElement.value = jsonData.props[key] || metaItem.defaultValue;
        }
    }
}

function saveForm() {
    const savedProps = {};
    for (const key in jsonData.meta) {

        const inputElement = document.getElementById(key);
        if (inputElement.type === 'checkbox') {

            savedProps[key] = inputElement.checked ? 'true' : 'false';
        } else if (inputElement.className === 'radio') {
            const radioGroup = document.getElementsByName(key);
            for (let i = 0; i < radioGroup.length; i++) {
                const element = radioGroup[i]
                if (element.checked) {
                    savedProps[key] = element.value
                }
            }
        }
        else {

            savedProps[key] = inputElement.value;
        }
    }
    console.log(savedProps)
    alert(JSON.stringify(savedProps, null, 2));
}