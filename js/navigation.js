// Navigation and Role Management JavaScript
// Page-specific initialization functions
function initializeDashboardGracAdmin() {
    // Initialize revenue chart
    const ctx = document.getElementById('revenueChart');
    if (ctx) {
        // Dữ liệu mẫu chi tiết cho biểu đồ doanh thu
        const revenueData = {
            labels: ['T1/2025', 'T2/2025', 'T3/2025', 'T4/2025', 'T5/2025', 'T6/2025'],
            datasets: [
                {
                    label: 'Số lượng tài khoản',
                    data: [120, 140, 135, 160, 180, 200],
                    borderColor: 'rgb(91, 239, 68)',
                    backgroundColor: 'transparent',
                    borderDash: [8, 4],
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false
                }
            ]
        };

        // Cấu hình biểu đồ nâng cao
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toLocaleString('vi-VN');
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return value.toLocaleString('vi-VN');
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 6
                }
            }
        };

        new Chart(ctx, {
            type: 'line',
            data: revenueData,
            options: chartOptions
        });
    }
}



function initializeDashboardDvQuanly() {
    // Initialize performance chart
    const ctx = document.getElementById('performanceChart');
    if (ctx) {
        // Dữ liệu mẫu chi tiết cho biểu đồ hiệu suất
        const performanceData = {
            labels: ['T1/2025', 'T2/2025', 'T3/2025', 'T4/2025', 'T5/2025', 'T6/2025'],
            datasets: [
                {
                    label: 'Hiệu suất thu gom (%)',
                    data: [88, 90, 92, 89, 92, 94],
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    borderColor: 'rgb(34, 197, 94)',
                    borderWidth: 2,
                    borderRadius: 4,
                    borderSkipped: false
                },
                {
                    label: 'Mục tiêu (%)',
                    data: [85, 87, 90, 88, 90, 92],
                    backgroundColor: 'rgba(239, 68, 68, 0.6)',
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 2,
                    borderRadius: 4,
                    borderSkipped: false
                }
            ]
        };

        // Cấu hình biểu đồ nâng cao
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        };

        new Chart(ctx, {
            type: 'bar',
            data: performanceData,
            options: chartOptions
        });
    }
}

function initializeDashboardDvCoSo() {
    const yAxisLabelPlugin = {
  id: 'yAxisLabelPlugin',
  afterDraw(chart) {
    const {
      ctx,
      chartArea: { top, left },
      scales: { y }
    } = chart;

    // Lấy cấu hình font, màu từ options
    const { size, family, weight } = y.options.title.font;
    const color = y.options.title.color;
    const text = y.options.title.text;

    ctx.save();
    ctx.font = `${weight} ${size}px ${family || 'Arial'}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    // Xác định tọa độ: 
    //    X = left (góc trên của trục Y) => ta đẩy thêm nửa khoảng chartArea.height để căn giữa theo chiều dọc
    //    Y = top - padding để đẩy text lên trên
    const xPos = left;
    const yPos = top - (y.options.title.padding.top || 10);

    // Vẽ text thẳng (rotation = 0)
    ctx.fillText(text, xPos, yPos);
    ctx.restore();
  }
};

// 2. Đăng ký plugin
Chart.register(yAxisLabelPlugin);
    // Initialize performance chart
    const ctx = document.getElementById('performanceChart');
    if (ctx) {
        // Dữ liệu mẫu chi tiết cho biểu đồ hiệu suất
        const performanceData = {
            labels: ['T1/2025', 'T2/2025', 'T3/2025', 'T4/2025', 'T5/2025', 'T6/2025', 'T7/2025'],
            datasets: [
                {
                    label: 'Đã thanh toán',
                    data: [30, 45, 40, 60, 80, 70, 120],
                    backgroundColor: 'rgba(33, 146, 61, 1)',
                    borderColor: 'rgb(34, 197, 94)',
                    borderWidth: 2,
                    borderRadius: 4,
                    borderSkipped: false
                },
                {
                    label: 'Chưa thanh toán',
                    data: [4, 5, 5, 10, 20, 30, 45],
                    backgroundColor:'rgba(133, 133, 133, 0.8)',
                    borderColor: 'rgb(209, 213, 219, 0.6)',
                    borderWidth: 2,
                    borderRadius: 4,
                    borderSkipped: false
                }
            ]
        };

        // Cấu hình biểu đồ nâng cao
        const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            yAxisLabelPlugin: {
            text: 'Số hợp đồng (nghìn)',
            color: '#444',
            font: { size: 12, weight: 'bold', family: 'Arial' },
            padding: 20
        },
            legend: {
            position: 'top',
            labels: {
                usePointStyle: true,
                padding: 20,
                font: { size: 12 }
            }
            },
            tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            callbacks: {
                label(ctx) {
                return `${ctx.dataset.label}: ${ctx.parsed.y} nghìn hợp đồng`;
                }
            }
            }
        },
        scales: {
            x: {
            grid: { display: false },
            ticks: { font: { size: 11 } }
            },
            y: {
            beginAtZero: true,
            max: 200,
            ticks: {
                font: { size: 11 },
                callback(v) { return v; }
            },
            grid: { color: 'rgba(0,0,0,0.1)' },

            // Label ngang, trên cùng trục Y
            title: {
                display: true,
                text: 'Số hợp đồng (đơn vị nghìn)',
                color: '#444',
                font: {
                size: 12,
                weight: 'bold',
                family: 'Arial'
                },
                padding: { bottom: 20, top: 20 }
            }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
        };

        new Chart(ctx, {
        type: 'bar',
        data: performanceData,
        options: chartOptions
        });

    }
}

function setupLogoUpload(inputId, previewId) {
      const input = document.getElementById(inputId);
      const preview = document.getElementById(previewId);

      input.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            preview.src = e.target.result;
            preview.classList.remove('hidden');
          };
          reader.readAsDataURL(file);
        } else {
          preview.src = '';
          preview.classList.add('hidden');
        }
      });
    }

    // Gọi function khi trang tải
    window.onload = function () {
      setupLogoUpload('logoInput', 'logoPreview');
    };




function initializeCustomersPage() {
    // Initialize customer search and filtering
    initializeCustomerSearch();
    initializeCustomerStatusFilter();
    initializeCustomerActions();

    // Dropdown menu cho nút ba chấm trong bảng khách hàng
    document.querySelectorAll('.dropdown-toggle').forEach(function(btn) {
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            // Đóng tất cả dropdown menu khác
            document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
                if (menu !== btn.parentNode.querySelector('.dropdown-menu')) {
                    menu.classList.add('hidden');
                }
            });
            // Toggle menu của chính nút này
            const menu = btn.parentNode.querySelector('.dropdown-menu');
            if (menu) {
                menu.classList.toggle('hidden');
            }
        });
    });
    // Đóng dropdown khi click ra ngoài
    document.addEventListener('click', function(event) {
        document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
            menu.classList.add('hidden');
        });
    });
}

function initializeCustomerSearch() {
    const searchInput = document.querySelector('input[placeholder*="Tìm kiếm"]');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const customerRows = document.querySelectorAll('.customer-row');
            
            customerRows.forEach(row => {
                const customerName = row.querySelector('.col-name').textContent.toLowerCase();
                const customerCode = row.querySelector('.col-code').textContent.toLowerCase();
                const customerAddress = row.querySelector('.col-address').textContent.toLowerCase();
                
                if (customerName.includes(searchTerm) || 
                    customerCode.includes(searchTerm) || 
                    customerAddress.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
}

function initializeCustomerStatusFilter() {
    const statusRadios = document.querySelectorAll('input[name="status-filter"]');
    statusRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const status = this.value;
            const customerRows = document.querySelectorAll('.customer-row');
            
            customerRows.forEach(row => {
                const rowStatus = row.getAttribute('data-status');
                if (status === 'all' || rowStatus === status) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });
}

function initializeCustomerActions() {
    // Add customer button
    // Đã chuyển sang modal chuyên nghiệp, không còn gọi showCustomerModal ở đây nữa
    // View customer detail links
    const viewDetailLinks = document.querySelectorAll('.view-customer-detail, .btn-view-customer-detail');
    viewDetailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            WebAdmin.loadContent('customer-detail', () => {
                initCustomerDetailTabs();
            });
        });
    });
}

function showCustomerDetail(customerCode) {
    WebAdmin.loadContent('customer-detail'); // Đúng tên file: customer-detail.html
    // Có thể lưu customerCode vào localStorage/sessionStorage nếu cần truyền dữ liệu
    
    // Khởi tạo tabs sau khi load content
    setTimeout(() => {
        if (typeof window.initializeCustomerDetailTabs === 'function') {
            window.initializeCustomerDetailTabs();
        }
    }, 100);
}

function initializeContractsPage() {
    // Initialize contract search and filtering
    console.log('Initializing contracts page');
    
    // Dropdown menu cho nút ba chấm trong bảng hợp đồng
    document.querySelectorAll('.dropdown-toggle').forEach(function(btn) {
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            // Đóng tất cả dropdown menu khác
            document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
                if (menu !== btn.parentNode?.querySelector('.dropdown-menu')) {
                    menu.classList.add('hidden');
                }
            });
            // Toggle menu của chính nút này
            const menu = btn.parentNode?.querySelector('.dropdown-menu');
            if (menu) {
                menu.classList.toggle('hidden');
            }
        });
    });
    
    // Đóng dropdown khi click ra ngoài
    document.addEventListener('click', function(event) {
        document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
            menu.classList.add('hidden');
        });
    });
    
    // Xử lý các action trong dropdown
    document.querySelectorAll('.view-contract-detail').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            if (row) {
                const contractIdCell = row.querySelector('td:nth-child(3)');
                if (contractIdCell) {
                    const contractId = contractIdCell.textContent; // Lấy mã hợp đồng
                    WebAdmin.loadContent('contract-detail');
                }
            }
        });
    });
}

function initializeInvoicesPage() {
    // Initialize invoice and payment management
    console.log('Initializing invoices page');
    // Xem chi tiết
    document.querySelectorAll('button[title="Xem chi tiết"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = btn.closest('tr');
            const invoiceId = row?.querySelector('td:nth-child(3)')?.textContent.trim() || '';
            if (typeof window.openInvoiceDetail === 'function') {
                window.openInvoiceDetail(invoiceId);
            } else {
                alert('Chức năng xem chi tiết chưa sẵn sàng!\nMã HĐ: ' + invoiceId);
            }
        });
    });
    // Chỉnh sửa
    document.querySelectorAll('button[title="Chỉnh sửa"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = btn.closest('tr');
            const invoiceId = row?.querySelector('td:nth-child(3)')?.textContent.trim() || '';
            if (typeof window.openEditInvoiceModal === 'function') {
                window.openEditInvoiceModal(invoiceId);
            } else {
                alert('Chức năng chỉnh sửa chưa sẵn sàng!\nMã HĐ: ' + invoiceId);
            }
        });
    });
    // Xóa
    document.querySelectorAll('button[title="Xóa"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = btn.closest('tr');
            const invoiceId = row?.querySelector('td:nth-child(3)')?.textContent.trim() || '';
            if (confirm('Bạn có chắc chắn muốn xóa hóa đơn này?\nMã HĐ: ' + invoiceId)) {
                if (typeof window.deleteInvoice === 'function') {
                    window.deleteInvoice(invoiceId, row);
                } else {
                    row.remove();
                    alert('Đã xóa (demo)');
                }
            }
        });
    });
    // Nhắc nhở
    document.querySelectorAll('button[title="Nhắc nhở"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = btn.closest('tr');
            const customerName = row?.querySelector('td:nth-child(4)')?.textContent.trim() || '';
            if (confirm(`Gửi nhắc nhở cho khách hàng ${customerName}?`)) {
                alert('Đã gửi nhắc nhở (demo)');
            }
        });
    });
    // Gán sự kiện cho các nút Thanh toán trong Quản lý hóa đơn (Đơn vị quản lý)
    document.querySelectorAll('.collect-payment-btn.payment-credit-card-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // Lấy thông tin từ data attribute
            const invoiceId = btn.getAttribute('data-invoice-id') || '';
            const customerName = btn.getAttribute('data-customer-name') || '';
            const period = btn.getAttribute('data-period') || '';
            const amount = btn.getAttribute('data-amount') || '';
            // Truyền vào modal (ví dụ với modal #paymentModal)
            if (document.getElementById('paymentModal')) {
                document.getElementById('modalInvoiceId').textContent = invoiceId;
                document.getElementById('modalCustomerName').textContent = customerName;
                document.getElementById('modalPeriod').textContent = period;
                document.getElementById('modalAmount').textContent = amount;
                // Hiện modal
                document.getElementById('paymentModal').classList.remove('hidden');
            } else if (typeof window.openPaymentModal === 'function') {
                // Nếu dùng logic chung
                window.openPaymentModal({ code: invoiceId, name: customerName, period, totalDebt: amount });
            } else {
                alert('Chức năng thanh toán chưa sẵn sàng!');
            }
        });
    });
    setupTabs();
}

function initializeEmployeesPage() {
    // Initialize employee management
    console.log('Initializing employees page');
}

function initializeServicesPage() {
    // Initialize service management
    console.log('Initializing services page');
    window.openServicePriceManagerModal = function(serviceCode) {
        document.getElementById('servicePriceManagerModal').classList.remove('hidden');
    }
    window.closeServicePriceManagerModal = function() {
        document.getElementById('servicePriceManagerModal').classList.add('hidden');
    }
    // Đã dùng dữ liệu cứng trong HTML, không cần render động bằng JS nữa
}

function initializeAddressCategoriesPage() {
    // Initialize address categories management
    console.log('Initializing address categories page');
    
    // Tab switching functionality
    const addressTabs = document.querySelectorAll('.address-tab');
    const addressTabContents = document.querySelectorAll('.address-tab-content');
    
    addressTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            addressTabs.forEach(t => {
                t.classList.remove('active');
                t.classList.remove('border-blue-500', 'text-blue-600');
                t.classList.add('border-transparent', 'text-gray-500');
            });
            
            // Add active class to clicked tab
            this.classList.add('active', 'border-blue-500', 'text-blue-600');
            this.classList.remove('border-transparent', 'text-gray-500');
            
            // Hide all tab contents
            addressTabContents.forEach(content => {
                content.classList.add('hidden');
            });
            
            // Show target tab content
            const targetContent = document.getElementById(`${targetTab}-tab`);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        });
    });
    
    // Add button functionality
    const addProvinceBtn = document.getElementById('add-province-btn');
    const addWardBtn = document.getElementById('add-ward-btn');
    const addVillageBtn = document.getElementById('add-village-btn');
    
    if (addProvinceBtn) {
        addProvinceBtn.addEventListener('click', function() {
            showAddressModal('province');
        });
    }
    
    if (addWardBtn) {
        addWardBtn.addEventListener('click', function() {
            showAddressModal('ward');
        });
    }
    
    if (addVillageBtn) {
        addVillageBtn.addEventListener('click', function() {
            showAddressModal('village');
        });
    }
    
    // Action buttons functionality
    initializeAddressActionButtons();

    // Add project button
    const addProjectBtn = document.getElementById('add-project-btn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', function() {
            showProjectModal();
        });
    }
}

function showAddressModal(type) {
    closeModal(); // Đảm bảo chỉ có 1 modal
    const typeNames = {
        'province': 'Tỉnh/Thành phố',
        'ward': 'Phường/Xã',
        'village': 'Thôn/Ấp/Khu phố'
    };
    const typeName = typeNames[type] || 'Địa chỉ';
    // Demo data
    const provinces = [
        { code: '79', name: 'TP. Hồ Chí Minh' },
        { code: '01', name: 'Hà Nội' },
        { code: '48', name: 'Đà Nẵng' }
    ];
    const wardsByProvince = {
        '79': [ { code: '760101', name: 'Phường Bến Nghé' }, { code: '760102', name: 'Phường Bến Thành' } ],
        '01': [ { code: '010101', name: 'Phường Hàng Bạc' }, { code: '010102', name: 'Phường Hàng Đào' } ],
        '48': [ { code: '480101', name: 'Phường Hải Châu 1' }, { code: '480102', name: 'Phường Hải Châu 2' } ]
    };
    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay fixed inset-0 bg-black bg-opacity-40 z-50 animate-fade-in';
    overlay.onclick = closeModal;
    document.body.appendChild(overlay);
    // Modal
    const modal = document.createElement('div');
    modal.className = 'modal fixed inset-0 z-50 flex items-center justify-center';
    let formFields = '';
    if (type === 'province') {
        formFields = `
            <div class="form-group">
                <label class="font-medium text-gray-700 mb-1 block">Mã ${typeName}</label>
                <input type="text" class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="code" required>
                <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
            </div>
            <div class="form-group">
                <label class="font-medium text-gray-700 mb-1 block">Tên ${typeName}</label>
                <input type="text" class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="name" required>
                <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
            </div>
            <div class="form-group">
                <label class="font-medium text-gray-700 mb-1 block">Vùng miền</label>
                <select class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="region" required>
                    <option value="">Chọn vùng miền</option>
                    <option value="north">Miền Bắc</option>
                    <option value="central">Miền Trung</option>
                    <option value="south">Miền Nam</option>
                </select>
                <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
            </div>
            <div class="form-group">
                <label class="font-medium text-gray-700 mb-1 block">Số phường/xã</label>
                <input type="number" class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="wards" min="0">
            </div>
        `;
    } else if (type === 'ward') {
        formFields = `
            <div class="form-group">
                <label class="font-medium text-gray-700 mb-1 block">Mã ${typeName}</label>
                <input type="text" class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="code" required>
                <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
            </div>
            <div class="form-group">
                <label class="font-medium text-gray-700 mb-1 block">Tên ${typeName}</label>
                <input type="text" class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="name" required>
                <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
            </div>
            <div class="form-group md:col-span-2">
                <label class="font-medium text-gray-700 mb-1 block">Thuộc Tỉnh/Thành phố</label>
                <select class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="province" required>
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    ${provinces.map(p => `<option value="${p.code}">${p.name}</option>`).join('')}
                </select>
                <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
            </div>
        `;
    } else if (type === 'village') {
        formFields = `
            <div class="form-group">
                <label class="font-medium text-gray-700 mb-1 block">Mã ${typeName}</label>
                <input type="text" class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="code" required>
                <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
            </div>
            <div class="form-group">
                <label class="font-medium text-gray-700 mb-1 block">Tên ${typeName}</label>
                <input type="text" class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="name" required>
                <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
            </div>
            <div class="form-group md:col-span-2">
                <label class="font-medium text-gray-700 mb-1 block">Thuộc Tỉnh/Thành phố</label>
                <select class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="province" id="village-province-select" required>
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    ${provinces.map(p => `<option value="${p.code}">${p.name}</option>`).join('')}
                </select>
                <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
            </div>
            <div class="form-group md:col-span-2">
                <label class="font-medium text-gray-700 mb-1 block">Thuộc Phường/Xã</label>
                <select class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="ward" id="village-ward-select" required disabled>
                    <option value="">Chọn Phường/Xã</option>
                </select>
                <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
            </div>
            <div class="form-group">
                <label class="font-medium text-gray-700 mb-1 block">Số hộ dân</label>
                <input type="number" class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="households" min="0">
            </div>
        `;
    }
    modal.innerHTML = `
        <div class="modal-content relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto p-0 animate-fade-in">
            <button class="modal-close absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl" onclick="closeModal()"><i class="fas fa-times"></i></button>
            <div class="px-6 py-6">
                <h2 class="text-xl font-semibold mb-4">Thêm ${typeName} mới</h2>
                <form id="address-form">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${formFields}</div>
                    <div class="flex justify-end space-x-2 mt-6">
                        <button type="button" class="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition" onclick="closeModal()">Hủy</button>
                        <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Thêm mới</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    // Dynamic dropdown cho village
    if (type === 'village') {
        const provinceSelect = modal.querySelector('#village-province-select');
        const wardSelect = modal.querySelector('#village-ward-select');
        provinceSelect.addEventListener('change', function() {
            const provinceCode = this.value;
            if (provinceCode && wardsByProvince[provinceCode]) {
                wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>' + wardsByProvince[provinceCode].map(w => `<option value="${w.code}">${w.name}</option>`).join('');
                wardSelect.disabled = false;
            } else {
                wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>';
                wardSelect.disabled = true;
            }
        });
    }
    // Validate & submit
    const form = modal.querySelector('#address-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let valid = true;
        form.querySelectorAll('[required]').forEach(input => {
            const errorDiv = input.parentElement.querySelector('.input-error');
            if (!input.value) {
                input.classList.add('border-red-500');
                if (errorDiv) {
                    errorDiv.textContent = 'Trường này là bắt buộc';
                    errorDiv.classList.remove('hidden');
                }
                valid = false;
            } else {
                input.classList.remove('border-red-500');
                if (errorDiv) errorDiv.classList.add('hidden');
            }
        });
        if (!valid) return;
        const formData = new FormData(form);
        const addressData = Object.fromEntries(formData);
        saveAddress(addressData, type);
        closeModal();
    });
}
window.showAddressModal = showAddressModal;

function initializeAddressActionButtons() {
    // Edit buttons
    document.querySelectorAll('[title="Chỉnh sửa"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const code = row.querySelector('td:first-child').textContent;
            const name = row.querySelector('td:nth-child(2)').textContent;
            
            showAddressEditModal(code, name);
        });
    });
    
    // View detail buttons
    document.querySelectorAll('[title="Xem chi tiết"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const code = row.querySelector('td:first-child').textContent;
            const name = row.querySelector('td:nth-child(2)').textContent;
            
            showAddressDetail(code, name);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('[title="Xóa"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const code = row.querySelector('td:first-child').textContent;
            const name = row.querySelector('td:nth-child(2)').textContent;
            
            if (confirm(`Bạn có chắc chắn muốn xóa "${name}" (${code})?`)) {
                deleteAddress(code);
            }
        });
    });
}

function showAddressEditModal(code, name) {
    // Similar to showAddressModal but with pre-filled data
    console.log('Edit address:', code, name);
    WebAdmin.showNotification('Chức năng chỉnh sửa đang được phát triển', 'info');
}

function showAddressDetail(code, name) {
    // Show address detail modal
    console.log('View address detail:', code, name);
    WebAdmin.showNotification('Chức năng xem chi tiết đang được phát triển', 'info');
}

function saveAddress(addressData, type) {
    // Simulate API call
    console.log('Saving address:', addressData, type);
    
    const typeNames = {
        'province': 'Tỉnh/Thành phố',
        'ward': 'Phường/Xã',
        'village': 'Thôn/Ấp/Khu phố'
    };
    
    WebAdmin.showNotification(`${typeNames[type] || 'Địa chỉ'} đã được thêm thành công`, 'success');
    
    // Reload address list
    setTimeout(() => {
        WebAdmin.loadContent('address-categories-content');
    }, 1000);
}

function deleteAddress(code) {
    // Simulate API call
    console.log('Deleting address:', code);
    WebAdmin.showNotification('Địa chỉ đã được xóa thành công', 'success');
    
    // Reload address list
    setTimeout(() => {
        WebAdmin.loadContent('address-categories-content');
    }, 1000);
}

function initializePaymentTrackingPage() {
    // Initialize payment tracking
    console.log('Initializing payment tracking page');
}

function initializePaymentCollectionPage() {
    // Initialize payment collection
    console.log('Initializing payment collection page');
    // Gán sự kiện cho nút Thu tiền trong danh sách thu tiền
    document.querySelectorAll('button, a').forEach(btn => {
        if (btn.textContent.trim() === 'Thu tiền') {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const row = btn.closest('tr');
                if (!row) return;
                // Lấy thông tin từ các cột
                const code = row.querySelector('td:nth-child(1)')?.textContent?.trim() || '';
                const name = row.querySelector('td:nth-child(2)')?.textContent?.trim() || '';
                const period = row.querySelector('td:nth-child(3)')?.textContent?.trim() || '';
                const amount = row.querySelector('td:nth-child(4)')?.textContent?.trim() || '';
                // Có thể lấy thêm các trường khác nếu cần
                const customerData = {
                    code,
                    name,
                    address: '',
                    totalDebt: amount
                };
                if (typeof window.openPaymentModal === 'function') {
                    window.openPaymentModal(customerData);
                } else {
                    alert('Chức năng thanh toán chưa sẵn sàng!');
                }
            });
        }
    });
    // Gán sự kiện cho các button .collect-payment-btn (trừ .payment-credit-card-btn)
    if (typeof initializeCollectPaymentModal === 'function') {
        // Chỉ gán cho các button không phải credit-card
        document.querySelectorAll('.collect-payment-btn:not(.payment-credit-card-btn)').forEach(btn => {
            btn.addEventListener('click', function() {
                openCollectPaymentModal();
            });
        });
    }
    // Gán sự kiện cho các button credit-card để mở modal nhiều kỳ (clone node để tránh trùng sự kiện)
    document.querySelectorAll('.payment-credit-card-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Credit card icon clicked!', newBtn);
            const customer = {
                code: newBtn.getAttribute('data-customer-id') || '',
                name: newBtn.getAttribute('data-customer-name') || '',
                address: '',
                totalDebt: ''
            };
            if (typeof window.openPaymentModal === 'function') {
                window.openPaymentModal(customer);
            } else {
                alert('Chức năng thanh toán nhiều kỳ chưa sẵn sàng!');
            }
        });
    });
    // Gán sự kiện cho các button Thanh toán (icon credit-card) không cần class đặc biệt
    document.querySelectorAll('button[title="Thanh toán"] i.fas.fa-credit-card').forEach(icon => {
        const btn = icon.closest('button');
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // Lấy thông tin từ dòng hiện tại
            const row = btn.closest('tr');
            const code = row?.querySelector('td:nth-child(1)')?.textContent.trim() || '';
            const name = row?.querySelector('td:nth-child(4)')?.textContent.trim() || '';
            const totalDebt = row?.querySelector('td:nth-child(6)')?.textContent.trim() || '';
            const customer = { code, name, address: '', totalDebt };
            if (typeof window.openPaymentModal === 'function') {
                window.openPaymentModal(customer);
            } else {
                alert('Chức năng thanh toán nhiều kỳ chưa sẵn sàng!');
            }
        });
    });
} 

function showProjectModal() {
    closeModal();
    const provinces = [
        { code: '79', name: 'TP. Hồ Chí Minh' },
        { code: '01', name: 'Hà Nội' },
        { code: '48', name: 'Đà Nẵng' }
    ];
    const wardsByProvince = {
        '79': [ { code: '760101', name: 'Phường Bến Nghé' }, { code: '760102', name: 'Phường Bến Thành' } ],
        '01': [ { code: '010101', name: 'Phường Hàng Bạc' }, { code: '010102', name: 'Phường Hàng Đào' } ],
        '48': [ { code: '480101', name: 'Phường Hải Châu 1' }, { code: '480102', name: 'Phường Hải Châu 2' } ]
    };
    const villagesByWard = {
        '760101': [ { code: '76010101', name: 'Khu phố 1' }, { code: '76010102', name: 'Khu phố 2' } ],
        '760102': [ { code: '76010201', name: 'Khu phố 3' } ],
        '010101': [ { code: '01010101', name: 'Thôn A' } ],
        '010102': [ { code: '01010201', name: 'Thôn B' } ],
        '480101': [ { code: '48010101', name: 'Khu phố Đà Nẵng 1' } ],
        '480102': [ { code: '48010201', name: 'Khu phố Đà Nẵng 2' } ]
    };
    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay fixed inset-0 bg-black bg-opacity-40 z-50 animate-fade-in';
    overlay.onclick = closeModal;
    document.body.appendChild(overlay);
    // Modal
    const modal = document.createElement('div');
    modal.className = 'modal fixed inset-0 z-50 flex items-center justify-center';
    modal.innerHTML = `
        <div class="modal-content relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto p-0 animate-fade-in">
            <button class="modal-close absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl" onclick="closeModal()"><i class="fas fa-times"></i></button>
            <div class="px-6 py-6">
                <h2 class="text-xl font-semibold mb-4">Thêm Dự án/Toà nhà</h2>
                <form id="project-form">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="form-group">
                            <label class="font-medium text-gray-700 mb-1 block">Mã dự án/toà nhà</label>
                            <input type="text" class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="code" required>
                            <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
                        </div>
                        <div class="form-group">
                            <label class="font-medium text-gray-700 mb-1 block">Tên dự án/toà nhà</label>
                            <input type="text" class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="name" required>
                            <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
                        </div>
                        <div class="form-group md:col-span-2">
                            <label class="font-medium text-gray-700 mb-1 block">Địa chỉ</label>
                            <input type="text" class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="address" required>
                            <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
                        </div>
                        <div class="form-group">
                            <label class="font-medium text-gray-700 mb-1 block">Tỉnh/Thành phố</label>
                            <select class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="province" id="project-province-select" required>
                                <option value="">Chọn Tỉnh/Thành phố</option>
                                ${provinces.map(p => `<option value="${p.code}">${p.name}</option>`).join('')}
                            </select>
                            <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
                        </div>
                        <div class="form-group">
                            <label class="font-medium text-gray-700 mb-1 block">Phường/Xã</label>
                            <select class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="ward" id="project-ward-select" required disabled>
                                <option value="">Chọn Phường/Xã</option>
                            </select>
                            <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
                        </div>
                        <div class="form-group">
                            <label class="font-medium text-gray-700 mb-1 block">Thôn / ấp / khu phố</label>
                            <select class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="village" id="project-village-select" required disabled>
                                <option value="">Chọn Thôn / ấp / khu phố</option>
                            </select>
                            <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
                        </div>
                        <div class="form-group">
                            <label class="font-medium text-gray-700 mb-1 block">Số căn hộ</label>
                            <input type="number" class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="apartments" min="0">
                        </div>
                        <div class="form-group">
                            <label class="font-medium text-gray-700 mb-1 block">Đơn vị quản lý</label>
                            <input type="text" class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="manager">
                        </div>
                        <div class="form-group">
                            <label class="font-medium text-gray-700 mb-1 block">Trạng thái</label>
                            <select class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="status" required>
                                <option value="active">Hoạt động</option>
                                <option value="inactive">Tạm ngưng</option>
                            </select>
                            <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
                        </div>
                    </div>
                    <div class="flex justify-end space-x-2 mt-6">
                        <button type="button" class="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition" onclick="closeModal()">Hủy</button>
                        <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Thêm mới</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    // Dynamic dropdown
    const provinceSelect = modal.querySelector('#project-province-select');
    const wardSelect = modal.querySelector('#project-ward-select');
    const villageSelect = modal.querySelector('#project-village-select');
    provinceSelect.addEventListener('change', function() {
        const provinceCode = this.value;
        if (provinceCode && wardsByProvince[provinceCode]) {
            wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>' + wardsByProvince[provinceCode].map(w => `<option value="${w.code}">${w.name}</option>`).join('');
            wardSelect.disabled = false;
            villageSelect.innerHTML = '<option value="">Chọn Thôn / ấp / khu phố</option>';
            villageSelect.disabled = true;
        } else {
            wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>';
            wardSelect.disabled = true;
            villageSelect.innerHTML = '<option value="">Chọn Thôn / ấp / khu phố</option>';
            villageSelect.disabled = true;
        }
    });
    wardSelect.addEventListener('change', function() {
        const wardCode = this.value;
        if (wardCode && villagesByWard[wardCode]) {
            villageSelect.innerHTML = '<option value="">Chọn Thôn / ấp / khu phố</option>' + villagesByWard[wardCode].map(v => `<option value="${v.code}">${v.name}</option>`).join('');
            villageSelect.disabled = false;
        } else {
            villageSelect.innerHTML = '<option value="">Chọn Thôn / ấp / khu phố</option>';
            villageSelect.disabled = true;
        }
    });
    // Validate & submit
    const form = modal.querySelector('#project-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let valid = true;
        form.querySelectorAll('[required]').forEach(input => {
            const errorDiv = input.parentElement.querySelector('.input-error');
            if (!input.value) {
                input.classList.add('border-red-500');
                if (errorDiv) {
                    errorDiv.textContent = 'Trường này là bắt buộc';
                    errorDiv.classList.remove('hidden');
                }
                valid = false;
            } else {
                input.classList.remove('border-red-500');
                if (errorDiv) errorDiv.classList.add('hidden');
            }
        });
        if (!valid) return;
        const formData = new FormData(form);
        const projectData = Object.fromEntries(formData);
        saveProject(projectData);
        closeModal();
    });
}
window.showProjectModal = showProjectModal;

function saveProject(projectData) {
    // Simulate API call
    console.log('Saving project:', projectData);
    WebAdmin.showNotification('Dự án/Toà nhà đã được thêm thành công', 'success');
    setTimeout(() => {
        WebAdmin.loadContent('address-categories-content');
    }, 1000);
} 

function initCustomerDetailTabs() {
  const tabButtons = document.querySelectorAll('.detail-tab');
  const tabContents = document.querySelectorAll('.detail-tab-content');
  if (!tabButtons.length || !tabContents.length) return;
  tabButtons.forEach(tab => {
    tab.addEventListener('click', function() {
      tabButtons.forEach(t => t.classList.remove('active', 'text-blue-600', 'border-blue-600'));
      this.classList.add('active', 'text-blue-600', 'border-blue-600');
      tabContents.forEach(c => c.classList.add('hidden'));
      const target = this.getAttribute('data-target');
      const targetContent = document.getElementById(target);
      if (targetContent) targetContent.classList.remove('hidden');
    });
  });
} 

document.addEventListener('click', function(e) {
  // Xử lý nút Thu tiền trong chi tiết khách hàng
  if (e.target && e.target.id === 'collect-payment-from-detail') {
    e.preventDefault();
    // Lấy thông tin khách hàng từ trang chi tiết
    const name = document.querySelector('.customer-detail-header + .flex h2')?.textContent?.trim() || 'Khách hàng';
    const code = 'KH003'; // Có thể lấy động nếu có
    const address = '';
    const totalDebt = document.querySelector('.customer-detail-debt .font-bold')?.textContent?.trim() || '0 ₫';
    const customerData = { code, name, address, totalDebt };
    if (typeof window.openPaymentModal === 'function') {
      window.openPaymentModal(customerData);
    } else {
      alert('Chức năng thanh toán chưa sẵn sàng!');
    }
  }
});

function initializeInvoicePaymentModal() {
    // Đóng modal khi click nút X hoặc overlay
    document.querySelectorAll('#paymentModal .modal-close, #paymentModal .modal-overlay').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('paymentModal').classList.add('hidden');
        });
    });
    // Xác nhận thanh toán
    const confirmBtn = document.getElementById('confirmPaymentBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            const invoiceId = document.getElementById('modalInvoiceId').textContent.trim();
            const customerName = document.getElementById('modalCustomerName').textContent.trim();
            const amount = document.getElementById('modalAmount').textContent.trim();
            const method = document.querySelector('#paymentModal input[name="payment-method"]:checked')?.value || 'cash';
            alert(`Đã thanh toán hóa đơn ${invoiceId} cho ${customerName} (${amount}) bằng ${method} (demo)`);
            document.getElementById('paymentModal').classList.add('hidden');
        });
    }
    // Chọn phương thức thanh toán (nếu có radio)
    document.querySelectorAll('#paymentModal input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Có thể cập nhật UI động ở đây nếu cần
        });
    });
}
// Gọi hàm này sau khi load content hoặc khi mở modal
if (document.getElementById('paymentModal')) {
    initializeInvoicePaymentModal();
}

function initializeInvoicePaymentPopup() {
    // Đóng modal khi click nút Đóng, X hoặc overlay
    document.querySelectorAll('#paymentModal .btn-primary, #paymentModal .modal-close, #paymentModal .modal-overlay').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('paymentModal').classList.add('hidden');
        });
    });
    // Copy mã hóa đơn
    const invoiceIdEl = document.getElementById('modalInvoiceId');
    if (invoiceIdEl) {
        invoiceIdEl.addEventListener('click', function() {
            navigator.clipboard.writeText(invoiceIdEl.textContent.trim());
            alert('Đã copy mã hóa đơn!');
        });
    }
    // Copy số tiền
    const amountEl = document.getElementById('modalAmount');
    if (amountEl) {
        amountEl.addEventListener('click', function() {
            navigator.clipboard.writeText(amountEl.textContent.trim());
            alert('Đã copy số tiền!');
        });
    }
    // Chọn phương thức thanh toán (nếu có radio)
    document.querySelectorAll('#paymentModal input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Có thể cập nhật UI động ở đây nếu cần
        });
    });
    // Xác nhận thanh toán (nếu có nút)
    const confirmBtn = document.getElementById('confirmPaymentBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            alert('Đã xác nhận thanh toán (demo)');
            document.getElementById('paymentModal').classList.add('hidden');
        });
    }
}
if (document.getElementById('paymentModal')) {
    initializeInvoicePaymentPopup();
}

// Export functions to global scope
window.showCustomerDetail = showCustomerDetail;
window.showAddressModal = showAddressModal;
window.showAddressEditModal = showAddressEditModal;
window.showAddressDetail = showAddressDetail;
window.saveAddress = saveAddress;
window.deleteAddress = deleteAddress;
window.showProjectModal = showProjectModal;
window.saveProject = saveProject; 

function showUserModal() {
    closeModal();
    // Demo data
    const unitTypes = [
        { code: 'admin', name: 'Grac Admin' },
        { code: 'manager', name: 'Đơn vị quản lý' },
        { code: 'base', name: 'Đơn vị cơ sở' },
        { code: 'collector', name: 'Đơn vị thu gom' }
    ];
    const units = [
        { code: 'DV001', name: 'Grac Admin', type: 'admin' },
        { code: 'DV002', name: 'Đơn vị quản lý', type: 'manager' },
        { code: 'DV003', name: 'Đơn vị cơ sở', type: 'base' },
        { code: 'DV004', name: 'Đơn vị thu gom 1', type: 'collector' },
        { code: 'DV005', name: 'Đơn vị thu gom 2', type: 'collector' }
    ];
    const employeesByUnit = {
        'DV001': [ { code: 'NV001', name: 'Nguyễn Văn A' } ],
        'DV002': [ { code: 'NV003', name: 'Lê Văn C' } ],
        'DV003': [ { code: 'NV009', name: 'Trần Thị I' } ],
        'DV004': [ { code: 'NV010', name: 'Phạm Văn D' } ],
        'DV005': [ { code: 'NV011', name: 'Vũ Thị E' } ]
    };
    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay fixed inset-0 bg-black bg-opacity-40 z-50 animate-fade-in';
    overlay.onclick = closeModal;
    document.body.appendChild(overlay);
    // Modal
    const modal = document.createElement('div');
    modal.className = 'modal fixed inset-0 z-50 flex items-center justify-center';
    modal.innerHTML = `
        <div class="modal-content relative bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-auto p-0 animate-fade-in">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-2xl bg-gradient-to-r from-blue-50 to-white">
                <div class="flex items-center gap-2">
                    <i class="fas fa-user-plus text-blue-600 text-2xl"></i>
                    <h3 class="text-xl md:text-2xl font-bold text-gray-800">Thêm người dùng mới</h3>
                </div>
                <button class="modal-close text-gray-400 hover:text-red-500 text-2xl" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body px-6 py-6">
                <form id="user-form">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="form-group">
                            <label class="font-medium text-gray-700 mb-1 block">Tên đăng nhập</label>
                            <input type="text" class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="username" required>
                            <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
                        </div>
                        <div class="form-group">
                            <label class="font-medium text-gray-700 mb-1 block">Họ tên</label>
                            <input type="text" class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="fullname" required>
                            <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
                        </div>
                        <div class="form-group">
                            <label class="font-medium text-gray-700 mb-1 block">Mật khẩu</label>
                            <input type="password" class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="password" required>
                            <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
                        </div>
                        <div class="form-group">
                            <label class="font-medium text-gray-700 mb-1 block">Vai trò</label>
                            <select class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="role" required>
                                <option value="">Chọn vai trò</option>
                                <option value="admin">Quản trị</option>
                                <option value="manager">Quản lý</option>
                                <option value="collector">Thu gom</option>
                            </select>
                            <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
                        </div>
                        <div class="form-group md:col-span-2">
                            <label class="font-medium text-gray-700 mb-1 block">Loại đơn vị</label>
                            <select class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="unitType" id="user-unit-type-select" required>
                                <option value="">Chọn loại đơn vị</option>
                                ${unitTypes.map(t => `<option value="${t.code}">${t.name}</option>`).join('')}
                            </select>
                            <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
                        </div>
                        <div class="form-group md:col-span-2">
                            <label class="font-medium text-gray-700 mb-1 block">Đơn vị</label>
                            <select class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="unit" id="user-unit-select" required disabled>
                                <option value="">Chọn đơn vị</option>
                            </select>
                            <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
                        </div>
                        <div class="form-group md:col-span-2">
                            <label class="font-medium text-gray-700 mb-1 block">Nhân viên liên kết</label>
                            <select class="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" name="employee" id="user-employee-select" required disabled>
                                <option value="">Chọn nhân viên</option>
                            </select>
                            <div class="input-error text-red-500 text-xs mt-1 hidden"></div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer flex justify-end space-x-4 px-6 py-4 border-t border-gray-100 rounded-b-2xl bg-gray-50">
                <button type="button" class="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold text-base hover:bg-gray-400 transition" onclick="closeModal()">Hủy</button>
                <button type="submit" form="user-form" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold text-base hover:bg-blue-700 transition">Thêm mới</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    // Dynamic đơn vị theo loại đơn vị
    const unitTypeSelect = modal.querySelector('#user-unit-type-select');
    const unitSelect = modal.querySelector('#user-unit-select');
    const employeeSelect = modal.querySelector('#user-employee-select');
    unitTypeSelect.addEventListener('change', function() {
        const selectedType = this.value;
        unitSelect.innerHTML = '<option value="">Chọn đơn vị</option>';
        if (selectedType) {
            const filteredUnits = units.filter(u => u.type === selectedType);
            filteredUnits.forEach(u => {
                const option = document.createElement('option');
                option.value = u.code;
                option.textContent = u.name;
                unitSelect.appendChild(option);
            });
            unitSelect.disabled = false;
        } else {
            unitSelect.disabled = true;
        }
        // Reset employee select
        employeeSelect.innerHTML = '<option value="">Chọn nhân viên</option>';
        employeeSelect.disabled = true;
    });
    // Dynamic nhân viên theo đơn vị
    unitSelect.addEventListener('change', function() {
        const unitCode = this.value;
        if (unitCode && employeesByUnit[unitCode]) {
            employeeSelect.innerHTML = '<option value="">Chọn nhân viên</option>' +
                employeesByUnit[unitCode].map(e => `<option value="${e.code}">${e.name}</option>`).join('');
            employeeSelect.disabled = false;
        } else {
            employeeSelect.innerHTML = '<option value="">Chọn nhân viên</option>';
            employeeSelect.disabled = true;
        }
    });
    // Validate & submit
    const form = modal.querySelector('#user-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let valid = true;
        form.querySelectorAll('[required]').forEach(input => {
            const errorDiv = input.parentElement.querySelector('.input-error');
            if (!input.value) {
                input.classList.add('border-red-500');
                if (errorDiv) {
                    errorDiv.textContent = 'Trường này là bắt buộc';
                    errorDiv.classList.remove('hidden');
                }
                valid = false;
            } else {
                input.classList.remove('border-red-500');
                if (errorDiv) errorDiv.classList.add('hidden');
            }
        });
        if (!valid) return;
        const formData = new FormData(form);
        const userData = Object.fromEntries(formData);
        // TODO: Gọi API hoặc hàm lưu user ở đây
        closeModal();
        // Có thể reload lại danh sách hoặc hiển thị thông báo thành công
    });
}
window.showUserModal = showUserModal;

function initializeUsersPage() {
    const btn = document.getElementById('add-user-btn');
    if (btn) btn.onclick = showUserModal;
}
window.initializeUsersPage = initializeUsersPage;

document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('add-user-btn');
    if (btn) btn.onclick = showUserModal;
});

function closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.remove();
    const modal = document.querySelector('.modal');
    if (modal) modal.remove();
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
}
window.closeModal = closeModal; 