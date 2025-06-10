document.addEventListener('DOMContentLoaded', function() {
    const predictionForm = document.getElementById('predictionForm');
    const resultDiv = document.getElementById('result');
    const predictedValueSpan = document.getElementById('predictedValue');
    const messageBox = document.getElementById('messageBox');
    const errorMessageSpan = document.getElementById('errorMessage');
    const submitButton = predictionForm.querySelector('button[type="submit"]');
    const inputFieldsContainer = document.getElementById('input-fields-container');

    // Define all 44 fields from SmurfFeatures schema with their types
    const smurfFeaturesSchema = {
        income_am: 'float',
        profit_last_am: 'float',
        profit_am: 'float',
        damage_am: 'float',
        damage_inc: 'float', // Note: damage_inc is float in schema, but often 0/1. Keep as float.
        crd_lim_rec: 'float',
        credit_use_ic: 'bool',
        gluten_ic: 'bool',
        lactose_ic: 'bool',
        insurance_ic: 'bool',
        spa_ic: 'bool',
        empl_ic: 'bool',
        cab_requests: 'float',
        married_cd: 'bool',
        bar_no: 'float',
        sport_ic: 'bool',
        neighbor_income: 'float',
        age: 'float',
        marketing_permit: 'bool',
        urban_ic: 'bool',
        client_segment: 'float',
        sect_empl: 'float',
        prev_stay: 'bool',
        prev_all_in_stay: 'bool',
        divorce: 'bool',
        fam_adult_size: 'float',
        children_no: 'float',
        tenure_mts: 'float',
        company_ic: 'bool',
        claims_no: 'float',
        claims_am: 'float',
        nights_booked: 'float',
        shop_am: 'float',
        shop_use: 'bool',
        retired: 'bool',
        gold_status: 'bool',
        gender_M: 'bool',
        gender_V: 'bool',
        score_pos: 'float',
        score_neg: 'float',
        tenure_started_in_season: 'bool',
        dining_ic_False: 'bool',
        dining_ic_True: 'bool',
        dining_ic_missing: 'bool',
        presidential_False: 'bool',
        presidential_True: 'bool',
        presidential_missing: 'bool',
        is_return_customer: 'bool'
    };

    // Function to generate input fields
    function generateInputFields() {
        let htmlInputs = '';
        for (const field in smurfFeaturesSchema) {
            if (smurfFeaturesSchema.hasOwnProperty(field)) {
                const type = smurfFeaturesSchema[field];
                const labelText = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); // Nicer label

                let inputType = 'text';
                let step = '';
                let min = '';
                let max = '';

                if (type === 'float') {
                    inputType = 'number';
                    step = '0.01'; // Default step for floats
                } else if (type === 'bool') {
                    inputType = 'number'; // Use number input for 0/1 for booleans
                    step = '1';
                    min = '0';
                    max = '1';
                }

                htmlInputs += `
                    <div>
                        <label for="${field}" class="block text-sm font-medium text-gray-700 mb-1">${labelText}</label>
                        <input type="${inputType}" step="${step}" id="${field}" name="${field}" ${min ? `min="${min}"` : ''} ${max ? `max="${max}"` : ''} required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out">
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
        for (const field in smurfFeaturesSchema) {
            if (smurfFeaturesSchema.hasOwnProperty(field)) {
                const value = formData.get(field);
                const type = smurfFeaturesSchema[field];

                if (type === 'float') {
                    data[field] = parseFloat(value);
                    if (isNaN(data[field])) {
                        // Handle case where float input might be empty or invalid
                        showError(`Invalid number for ${field}. Please enter a valid number.`);
                        return; // Stop processing
                    }
                } else if (type === 'bool') {
                    // Convert 0/1 to true/false boolean values for JSON
                    data[field] = value === '1'; // "1" -> true, "0" -> false
                    if (value !== '0' && value !== '1') {
                         showError(`Invalid value for ${field}. Please enter 0 or 1.`);
                         return; // Stop processing
                    }
                } else {
                    // Default for other types (if any, though schema only has float/bool)
                    data[field] = value;
                }
            }
        }

        // Validate all required fields are present and not empty (handled by 'required' attribute in HTML)
        // Additional validation can be added here if needed (e.g., specific ranges)

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
