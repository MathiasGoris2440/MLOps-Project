document.addEventListener('DOMContentLoaded', function() {
    const predictionForm = document.getElementById('predictionForm');
    const resultDiv = document.getElementById('result');
    const predictedValueSpan = document.getElementById('predictedValue');
    const messageBox = document.getElementById('messageBox');
    const errorMessageSpan = document.getElementById('errorMessage');
    const submitButton = predictionForm.querySelector('button[type="submit"]');
    const inputFieldsContainer = document.getElementById('input-fields-container');

    // Define all 44 fields from SmurfFeatures schema with their types and user-friendly labels
    const smurfFeaturesSchema = {
        income_am: { type: 'float', label: 'Income Amount' },
        profit_last_am: { type: 'float', label: 'Profit Last Amount' },
        profit_am: { type: 'float', label: 'Profit Amount' },
        damage_am: { type: 'float', label: 'Damage Amount' },
        damage_inc: { type: 'bool', label: 'Damage Incident (0=No, 1=Yes)' },
        crd_lim_rec: { type: 'float', label: 'Credit Limit Recommended' },
        credit_use_ic: { type: 'bool', label: 'Credit Usage (0=No, 1=Yes)' },
        gluten_ic: { type: 'bool', label: 'Gluten Allergy (0=No, 1=Yes)' },
        lactose_ic: { type: 'bool', label: 'Lactose Intolerance (0=No, 1=Yes)' },
        insurance_ic: { type: 'bool', label: 'Insurance (0=No, 1=Yes)' },
        spa_ic: { type: 'bool', label: 'Spa Use (0=No, 1=Yes)' },
        empl_ic: { type: 'bool', label: 'Employed (0=No, 1=Yes)' },
        cab_requests: { type: 'float', label: 'Cab Requests' },
        married_cd: { type: 'bool', label: 'Married (0=No, 1=Yes)' },
        bar_no: { type: 'float', label: 'Bar Visits' },
        sport_ic: { type: 'bool', label: 'Sports Activity (0=No, 1=Yes)' },
        neighbor_income: { type: 'float', label: 'Neighbor Income' },
        age: { type: 'float', label: 'Age' },
        marketing_permit: { type: 'bool', label: 'Marketing Permit (0=No, 1=Yes)' },
        urban_ic: { type: 'bool', label: 'Urban Resident (0=No, 1=Yes)' },
        client_segment: { type: 'float', label: 'Client Segment' },
        sect_empl: { type: 'float', label: 'Sector of Employment' },
        prev_stay: { type: 'bool', label: 'Previous Stay (0=No, 1=Yes)' },
        prev_all_in_stay: { type: 'bool', label: 'Previous All-Inclusive Stay (0=No, 1=Yes)' },
        divorce: { type: 'bool', label: 'Divorced (0=No, 1=Yes)' },
        fam_adult_size: { type: 'float', label: 'Family Adult Size' },
        children_no: { type: 'float', label: 'Number of Children' },
        tenure_mts: { type: 'float', label: 'Tenure in Months' },
        company_ic: { type: 'bool', label: 'Company Client (0=No, 1=Yes)' },
        claims_no: { type: 'float', label: 'Number of Claims' },
        claims_am: { type: 'float', label: 'Claims Amount' },
        nights_booked: { type: 'float', label: 'Nights Booked' },
        shop_am: { type: 'float', label: 'Shopping Amount' },
        shop_use: { type: 'bool', label: 'Shop Use (0=No, 1=Yes)' },
        retired: { type: 'bool', label: 'Retired (0=No, 1=Yes)' },
        gold_status: { type: 'bool', label: 'Gold Status (0=No, 1=Yes)' },
        gender_M: { type: 'bool', label: 'Gender: Male (0=No, 1=Yes)' },
        gender_V: { type: 'bool', label: 'Gender: Other (0=No, 1=Yes)' }, // Assuming 'V' is for 'Various' or similar non-binary
        score_pos: { type: 'float', label: 'Positive Score' },
        score_neg: { type: 'float', label: 'Negative Score' },
        tenure_started_in_season: { type: 'bool', label: 'Tenure Started in Season (0=No, 1=Yes)' },
        dining_ic_False: { type: 'bool', label: 'Dining: Not Indicated (0=No, 1=Yes)' }, // Assuming these are one-hot encoded
        dining_ic_True: { type: 'bool', label: 'Dining: Indicated (0=No, 1=Yes)' },
        dining_ic_missing: { type: 'bool', label: 'Dining: Missing Data (0=No, 1=Yes)' },
        presidential_False: { type: 'bool', label: 'Presidential: Not Indicated (0=No, 1=Yes)' },
        presidential_True: { type: 'bool', label: 'Presidential: Indicated (0=No, 1=Yes)' },
        presidential_missing: { type: 'bool', label: 'Presidential: Missing Data (0=No, 1=Yes)' },
        is_return_customer: { type: 'bool', label: 'Is Return Customer (0=No, 1=Yes)' }
    };

    // Function to generate input fields
    function generateInputFields() {
        let htmlInputs = '';
        for (const fieldKey in smurfFeaturesSchema) {
            if (smurfFeaturesSchema.hasOwnProperty(fieldKey)) {
                const fieldDef = smurfFeaturesSchema[fieldKey];
                const type = fieldDef.type;
                const labelText = fieldDef.label;

                let inputType = 'text';
                let step = '';
                let min = '';
                let max = '';
                let placeholder = '';

                if (type === 'float') {
                    inputType = 'number';
                    step = '0.01'; // Default step for floats
                    placeholder = 'e.g., 123.45';
                } else if (type === 'bool') {
                    inputType = 'number'; // Use number input for 0/1 for booleans
                    step = '1';
                    min = '0';
                    max = '1';
                    placeholder = '0 or 1';
                }

                htmlInputs += `
                    <div>
                        <label for="${fieldKey}" class="block text-sm font-medium text-gray-700 mb-1">${labelText}</label>
                        <input type="${inputType}" step="${step}" id="${fieldKey}" name="${fieldKey}" 
                               ${min ? `min="${min}"` : ''} ${max ? `max="${max}"` : ''} 
                               ${placeholder ? `placeholder="${placeholder}"` : ''}
                               required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out">
                    </div>
                `;
            }
        }
        inputFieldsContainer.innerHTML = htmlInputs;
    }

    // Generate fields on page load
    generateInputFields();

    predictionForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(predictionForm);
        const data = {};

        // Parse form data according to schema types
        for (const fieldKey in smurfFeaturesSchema) {
            if (smurfFeaturesSchema.hasOwnProperty(fieldKey)) {
                const value = formData.get(fieldKey);
                const type = smurfFeaturesSchema[fieldKey].type;

                if (type === 'float') {
                    data[fieldKey] = parseFloat(value);
                    if (isNaN(data[fieldKey])) {
                        showError(`Invalid number for ${smurfFeaturesSchema[fieldKey].label}. Please enter a valid number.`);
                        return;
                    }
                } else if (type === 'bool') {
                    data[fieldKey] = value === '1'; // "1" -> true, "0" -> false
                    if (value !== '0' && value !== '1') {
                         showError(`Invalid value for ${smurfFeaturesSchema[fieldKey].label}. Please enter 0 or 1.`);
                         return;
                    }
                } else {
                    data[fieldKey] = value;
                }
            }
        }

        submitButton.textContent = 'Predicting...';
        submitButton.disabled = true;
        hideMessages();

        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            predictedValueSpan.textContent = `Predicted Value: ${result.predicted_value.toFixed(2)}`;
            resultDiv.classList.remove('hidden');

        } catch (error) {
            console.error('Prediction failed:', error);
            showError(`Failed to get prediction: ${error.message}`);
        } finally {
            submitButton.textContent = 'Predict Smurf Behavior';
            submitButton.disabled = false;
        }
    });

    function showError(message) {
        errorMessageSpan.textContent = message;
        messageBox.classList.remove('hidden');
    }

    function hideMessages() {
        resultDiv.classList.add('hidden');
        messageBox.classList.add('hidden');
    }
});
