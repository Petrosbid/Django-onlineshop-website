// Global function declarations - make them available immediately
window.showAddAddressForm = function() {
    const addAddressForm = document.getElementById('addAddressForm');
    const addAddressBtn = document.querySelector('.btn-add-address');
    if (addAddressForm && addAddressBtn) {
        addAddressForm.style.display = 'block';
        addAddressBtn.style.display = 'none';
    }
};

window.hideAddAddressForm = function() {
    const addAddressForm = document.getElementById('addAddressForm');
    const addAddressBtn = document.querySelector('.btn-add-address');
    if (addAddressForm && addAddressBtn) {
        addAddressForm.style.display = 'none';
        addAddressBtn.style.display = 'flex';
        // Clear form
        addAddressForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.value = '';
        });
    }
};

window.saveNewAddress = function() {
    const province = document.getElementById('newProvince')?.value;
    const city = document.getElementById('newCity')?.value;
    const address = document.getElementById('newAddress')?.value;
    const postalCode = document.getElementById('newPostalCode')?.value;

    if (!province || !city || !address || !postalCode) {
        showMessage('لطفاً تمام فیلدهای آدرس را پر کنید', 'error');
        return;
    }

    if (!validatePostalCode(postalCode)) {
        showMessage('کد پستی نامعتبر است', 'error');
        return;
    }

    const data = {
        province: province,
        city: city,
        address: address,
        postalCode: postalCode
    };

    fetch('/add-address/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage(data.message, 'success');
            hideAddAddressForm();
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showMessage(data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('خطا در ذخیره آدرس', 'error');
    });
};

window.editAddress = function(addressId) {
    const addressCard = document.querySelector(`[data-address-id="${addressId}"]`);
    if (!addressCard) return;
    
    const displayDiv = addressCard.querySelector('.address-display');
    const formDiv = addressCard.querySelector('.address-form');
    
    if (displayDiv && formDiv) {
        displayDiv.style.display = 'none';
        formDiv.style.display = 'block';
        
        // Initialize provinces for this address
        initializeProvinces(`province_${addressId}`, `city_${addressId}`);
        
        // Set current values
        const currentProvince = addressCard.querySelector('.address-display p:first-child')?.textContent.split(':')[1]?.trim();
        const currentCity = addressCard.querySelector('.address-display p:nth-child(2)')?.textContent.split(':')[1]?.trim();
        
        // Set province and load cities
        const provinceSelect = document.getElementById(`province_${addressId}`);
        if (provinceSelect && currentProvince) {
            // Find and set the province
            Array.from(provinceSelect.options).forEach(option => {
                if (option.textContent === currentProvince) {
                    option.selected = true;
                    fetchCities(option.value, `city_${addressId}`);
                }
            });
        }
    }
};

window.cancelEdit = function(addressId) {
    const addressCard = document.querySelector(`[data-address-id="${addressId}"]`);
    if (!addressCard) return;
    
    const displayDiv = addressCard.querySelector('.address-display');
    const formDiv = addressCard.querySelector('.address-form');
    
    if (displayDiv && formDiv) {
        displayDiv.style.display = 'block';
        formDiv.style.display = 'none';
    }
};

window.saveAddress = function(addressId) {
    const province = document.getElementById(`province_${addressId}`)?.value;
    const city = document.getElementById(`city_${addressId}`)?.value;
    const address = document.getElementById(`address_${addressId}`)?.value;
    const postalCode = document.getElementById(`postalCode_${addressId}`)?.value;

    if (!province || !city || !address || !postalCode) {
        showMessage('لطفاً تمام فیلدهای آدرس را پر کنید', 'error');
        return;
    }

    const data = {
        address_id: addressId,
        province: province,
        city: city,
        address: address,
        postalCode: postalCode
    };

    fetch('/update-address/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage(data.message, 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showMessage(data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('خطا در بروزرسانی آدرس', 'error');
    });
};

window.deleteAddress = function(addressId) {
    if (!confirm('آیا از حذف این آدرس اطمینان دارید؟')) {
        return;
    }

    const data = {
        address_id: addressId
    };

    fetch('/delete-address/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage(data.message, 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showMessage(data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('خطا در حذف آدرس', 'error');
    });
};

window.setDefaultAddress = function(addressId) {
    const data = {
        address_id: addressId
    };

    fetch('/set-default-address/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage(data.message, 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showMessage(data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('خطا در تنظیم آدرس پیش‌فرض', 'error');
    });
};

// Utility functions
function validateNationalCode(code) {
    if (!code || code.length !== 10) return false;
    const digits = code.split('').map(Number);
    const lastDigit = digits.pop();
    const sum = digits.reduce((acc, digit, index) => acc + digit * (10 - index), 0);
    const remainder = sum % 11;
    return remainder < 2 ? lastDigit === remainder : lastDigit === 11 - remainder;
}

function validateMobile(mobile) {
    return mobile && /^09[0-9]{9}$/.test(mobile);
}

function validatePostalCode(code) {
    return code && /^[0-9]{10}$/.test(code);
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        color: ${type === 'success' ? '#2ed573' : '#ff4757'};
        padding: 1rem;
        margin: 1rem 0;
        background-color: ${type === 'success' ? '#f0fff4' : '#fff3f3'};
        border-radius: 8px;
        border: 1px solid ${type === 'success' ? '#2ed573' : '#ff4757'};
    `;
    
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const container = document.querySelector('.specs-container');
    if (container) {
        container.insertBefore(messageDiv, container.firstChild);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function initializeProvinces(provinceSelectId, citySelectId) {
    const provinceSelect = document.getElementById(provinceSelectId);
    const citySelect = document.getElementById(citySelectId);
    
    if (!provinceSelect) return;

    // Fetch provinces
    fetch('https://iranplacesapi.liara.run/api/provinces')
        .then(response => response.json())
        .then(provinces => {
            provinceSelect.innerHTML = '<option value="">انتخاب استان</option>';
            provinces.forEach(province => {
                const option = document.createElement('option');
                option.value = province.id;
                option.textContent = province.name;
                provinceSelect.appendChild(option);
            });

            // Add change event listener
            provinceSelect.addEventListener('change', function() {
                const selectedProvince = this.value;
                if (selectedProvince) {
                    fetchCities(selectedProvince, citySelectId);
                } else if (citySelect) {
                    citySelect.innerHTML = '<option value="">انتخاب شهر</option>';
                }
            });
        })
        .catch(error => {
            console.error('Error fetching provinces:', error);
            showMessage('خطا در دریافت لیست استان‌ها', 'error');
        });
}

function fetchCities(provinceId, citySelectId) {
    const citySelect = document.getElementById(citySelectId);
    if (!citySelect) return;
    
    fetch(`https://iranplacesapi.liara.run/api/provinces/id/${provinceId}/cities`)
        .then(response => response.json())
        .then(cities => {
            citySelect.innerHTML = '<option value="">انتخاب شهر</option>';
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city.id;
                option.textContent = city.name;
                citySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching cities:', error);
            showMessage('خطا در دریافت لیست شهرها', 'error');
        });
}

// Main initialization when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('accountSpecsForm');
    const addAddressBtn = document.querySelector('.btn-add-address');
    const addAddressForm = document.getElementById('addAddressForm');
    
    // Initialize provinces for new address form
    if (addAddressForm) {
        initializeProvinces('newProvince', 'newCity');
    }

    // Form submission handler
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                return;
            }

            // Submit form data
            submitFormData();
        });
    }

    // Event delegation for address management buttons
    document.addEventListener('click', function(e) {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.getAttribute('data-action');
        const addressId = target.getAttribute('data-address-id');

        switch (action) {
            case 'show-add-form':
                showAddAddressForm();
                break;
            case 'hide-add-form':
                hideAddAddressForm();
                break;
            case 'save-new':
                saveNewAddress();
                break;
            case 'edit':
                editAddress(addressId);
                break;
            case 'cancel':
                cancelEdit(addressId);
                break;
            case 'save':
                saveAddress(addressId);
                break;
            case 'delete':
                deleteAddress(addressId);
                break;
            case 'set-default':
                setDefaultAddress(addressId);
                break;
        }
    });

    // Initialize existing address forms
    initializeExistingAddresses();

    // Validation function
    function validateForm() {
        // Validate national code
        const nationalCode = document.getElementById('nationalCode')?.value;
        if (nationalCode && !validateNationalCode(nationalCode)) {
            showMessage('کد ملی نامعتبر است', 'error');
            return false;
        }

        // Validate mobile number
        const mobile = document.getElementById('mobile')?.value;
        if (mobile && !validateMobile(mobile)) {
            showMessage('شماره موبایل نامعتبر است', 'error');
            return false;
        }

        // Validate password change
        const currentPassword = document.getElementById('currentPassword')?.value;
        const newPassword = document.getElementById('newPassword')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;

        if (newPassword && !currentPassword) {
            showMessage('برای تغییر رمز عبور، رمز فعلی را وارد کنید', 'error');
            return false;
        }

        if (newPassword && newPassword !== confirmPassword) {
            showMessage('رمز عبور جدید و تکرار آن مطابقت ندارند', 'error');
            return false;
        }

        return true;
    }

    // Form submission
    function submitFormData() {
        const formData = new FormData(form);
        const submitButton = form.querySelector('.btn-save');
        
        // Show loading state
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'در حال ذخیره...';
        }
        
        fetch('', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            }
        })
        .then(response => {
            // Check if response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Check content type to see if it's JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                // If not JSON, it might be an HTML error page
                return response.text().then(text => {
                    throw new Error('Server returned HTML instead of JSON. This might be a server error.');
                });
            }
        })
        .then(data => {
            if (data.success) {
                showMessage(data.message || 'اطلاعات با موفقیت ذخیره شد', 'success');
                // Reload page to show updated data
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                showMessage(data.error || 'خطا در ذخیره اطلاعات', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.message.includes('HTML instead of JSON')) {
                showMessage('خطا در سرور. لطفاً صفحه را مجدداً بارگذاری کنید.', 'error');
            } else {
                showMessage('خطا در ارتباط با سرور', 'error');
            }
        })
        .finally(() => {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'ذخیره تغییرات';
            }
        });
    }

    function initializeExistingAddresses() {
        // Initialize provinces for existing address forms
        document.querySelectorAll('.address-form').forEach(form => {
            const addressId = form.closest('.address-card')?.dataset.addressId;
            if (addressId) {
                initializeProvinces(`province_${addressId}`, `city_${addressId}`);
            }
        });
    }
}); 