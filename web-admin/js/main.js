// Main JavaScript file for WebAdmin
let scrollPosition = 0;
// Xoá dòng 'let scrollPosition = 0;' ở các vị trí khác ngoài đầu file

// Global variables
var addressData = null;

// Employee Management Data
// Dữ liệu mẫu nhân viên (trong thực tế sẽ lấy từ API)
const employeesData = {
    'NV001': {
        id: 'NV001',
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '090xxxx123',
        department: 'Thu gom',
        position: 'Nhân viên thu gom',
        hireDate: '01/01/2024',
        role: 'ADMIN',
        status: 'Đang làm việc',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        idCard: '123456789012',
        salary: '15,000,000 VNĐ',
        manager: 'Trần Văn C',
        emergencyContact: 'Nguyễn Thị D - 098xxxx789'
    },
    'NV002': {
        id: 'NV002',
        name: 'Trần Thị B',
        email: 'tranthib@example.com',
        phone: '091xxxx456',
        department: 'Kế toán',
        position: 'Kế toán viên',
        hireDate: '15/03/2024',
        role: 'ADMIN',
        status: 'Đang làm việc',
        address: '456 Đường XYZ, Quận 2, TP.HCM',
        idCard: '987654321098',
        salary: '18,000,000 VNĐ',
        manager: 'Lê Văn E',
        emergencyContact: 'Trần Văn F - 097xxxx456'
    }
};
document.addEventListener('DOMContentLoaded', function() {
    initializeWebAdmin();

    // Lọc Thôn/Ấp/Khu phố theo tỉnh/thành phố
    const villageProvinceFilter = document.getElementById('village-province-filter');
    if (villageProvinceFilter) {
        villageProvinceFilter.addEventListener('change', function() {
            const selectedProvince = this.value;
            document.querySelectorAll('#villages-table .village-row').forEach(row => {
                const province = row.getAttribute('data-province');
                if (!selectedProvince || province === selectedProvince) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // Lọc Dự án/Toà nhà theo tỉnh/thành phố
    const projectProvinceFilter = document.getElementById('project-province-filter');
    if (projectProvinceFilter) {
        projectProvinceFilter.addEventListener('change', function() {
            const selectedProvince = this.value;
            document.querySelectorAll('#projects-table .project-row').forEach(row => {
                const province = row.getAttribute('data-province');
                if (!selectedProvince || province === selectedProvince) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});

function initializeWebAdmin() {
    // Initialize role management
    initializeRoleManagement();
    
    // Initialize navigation
    initializeNavigation();
    
    // Sidebar toggle is now handled in WebAdmin object
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize customer form
    initializeAddCustomerForm();
    
    // Initialize payment collection modal
    initializeCollectPaymentModal();
    
    // Load default dashboard
    loadContent('dashboard-grac-admin');
}

// Role Management
function initializeRoleManagement() {
    const roleToggleBtn = document.getElementById('role-toggle-btn');
    const roleSelectionPanel = document.getElementById('role-selection-panel');
    const roleButtons = document.querySelectorAll('.role-button');
    
    if (roleToggleBtn) {
        roleToggleBtn.addEventListener('click', function() {
            toggleRoleSelection();
        });
    }
    
    roleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const role = this.getAttribute('data-role');
            switchRole(role);
        });
    });
}

function toggleRoleSelection() {
    const panel = document.getElementById('role-selection-panel');
    const icon = document.getElementById('role-toggle-icon');
    const isCollapsed = panel.classList.contains('collapsed');
    
    if (isCollapsed) {
        panel.classList.remove('collapsed');
        panel.style.maxHeight = '200px';
        panel.style.opacity = '1';
        panel.style.padding = '1.5rem';
        icon.style.transform = 'rotate(180deg)';
    } else {
        panel.classList.add('collapsed');
        panel.style.maxHeight = '0';
        panel.style.opacity = '0';
        panel.style.padding = '0';
        icon.style.transform = 'rotate(0deg)';
    }
}

function switchRole(role) {
    // Hide all sidebars
    const sidebars = document.querySelectorAll('.sidebar');
    sidebars.forEach(sidebar => sidebar.classList.add('hidden'));
    
    // Show selected sidebar
    const selectedSidebar = document.getElementById(`sidebar-${role}`);
    if (selectedSidebar) {
        selectedSidebar.classList.remove('hidden');
    }
    
    // Hide all mobile menus
    const mobileMenus = document.querySelectorAll('.mobile-menu-content');
    mobileMenus.forEach(menu => menu.classList.add('hidden'));
    
    // Show selected mobile menu
    const selectedMobileMenu = document.getElementById(`mobile-menu-${role}`);
    if (selectedMobileMenu) {
        selectedMobileMenu.classList.remove('hidden');
    }
    
    // Update role display
    const roleNames = {
        'grac-admin': 'GRAC Admin',
        'dv-quanly': 'Đơn vị quản lý',
        'dv-coso': 'Đơn vị cơ sở',
        'dv-thugom': 'Đơn vị thu gom',

    };
    
    const userRoleName = document.getElementById('user-role-name');
    const currentRoleDisplay = document.getElementById('current-role-display');
    
    if (userRoleName) {
        userRoleName.textContent = roleNames[role] || 'Unknown Role';
    }
    
    if (currentRoleDisplay) {
        currentRoleDisplay.innerHTML = `Vai trò hiện tại: <strong>${roleNames[role] || 'Unknown Role'}</strong>`;
    }
    
    // Update active role button
    const roleButtons = document.querySelectorAll('.role-button');
    roleButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-role') === role) {
            btn.classList.add('active');
        }
    });
    
    // Load appropriate dashboard
    const dashboardId = `dashboard-${role}`;
    loadContent(dashboardId);
    
    // Collapse role selection panel
    toggleRoleSelection();
}

// Navigation Management
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.web-nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active', 'bg-blue-50', 'text-blue-700', 'font-semibold'));
            navLinks.forEach(l => l.classList.add('text-gray-600'));
            
            // Add active class to clicked link
            this.classList.remove('text-gray-600');
            this.classList.add('active', 'bg-blue-50', 'text-blue-700', 'font-semibold');
            
            // Load content
            const target = this.getAttribute('data-target');
            loadContent(target);
            
            // Update breadcrumb
            updateBreadcrumb(this.textContent.trim());
        });
    });
}

function loadContent(contentId) {
    const contentContainer = document.getElementById('content-container');
    
    if (!contentContainer) {
        console.error('Content container not found');
        return;
    }
    
    console.log('Loading content:', contentId);
    
    // Show loading state
    contentContainer.innerHTML = '<div class="flex items-center justify-center h-64"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>';
    
    // Load content based on ID
    fetch(`pages/${contentId}.html`)
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            console.log('Content loaded successfully');
            contentContainer.innerHTML = html;
            
            // Initialize page-specific functionality
            initializePageContent(contentId);
            // Đảm bảo gán lại sự kiện cho các nút credit-card sau khi DOM đã render
            setTimeout(() => {
              if (contentId === 'payment-collection-content' && typeof initializePaymentCollectionPage === 'function') {
                initializePaymentCollectionPage();
              }
            }, 100);
        })
        .catch(error => {
            console.error('Error loading content:', error);
            contentContainer.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow-sm">
                    <div class="text-center">
                        <i class="fas fa-exclamation-triangle text-yellow-500 text-4xl mb-4"></i>
                        <h2 class="text-xl font-semibold text-gray-700 mb-2">Lỗi tải trang</h2>
                        <p class="text-gray-500 mb-4">Không thể tải trang: ${contentId}</p>
                        <p class="text-sm text-gray-400">Lỗi: ${error.message}</p>
                        <button onclick="WebAdmin.loadContent('dashboard-grac-admin')" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                            Quay về Dashboard
                        </button>
                    </div>
                </div>
            `;
        });
}

function initializePageContent(contentId) {
    // Initialize page-specific functionality based on content ID
    switch(contentId) {
        case 'dashboard-grac-admin':
            initializeDashboardGracAdmin();
            break;
        case 'dashboard-dv-quanly':
            initializeDashboardDvQuanly();
            break;
        case 'dashboard-dv-coso':
            // Dashboard for Đơn vị cơ sở doesn't need chart initialization
            initializeDashboardDvCoSo();
            break;
        case 'dashboard-dv-thugom':
            // Dashboard for Đơn vị thu gom doesn't need chart initialization
            break;
        case 'customers-content':
            initializeCustomersPage();
            break;
        case 'contracts-content':
            initializeContractsPage();
            break;
        case 'invoices-content':
            initializeInvoicesPage();
            break;
        case 'employees-content':
            initializeEmployeesPage();
            initializeEmployeeModalEvents();
            break;
        case 'customers-content':
            initializeCustomersPage();
            initializeAddCustomerForm();
            break;
        case 'services-content':
            initializeServicesPage();
            break;
        case 'address-categories-content':
            initializeAddressCategoriesPage();
            break;
        case 'street-names-content':
            initializeStreetNamesPage();
            break;
        case 'payment-tracking-content':
            initializePaymentTrackingPage();
            break;
        case 'payment-collection-content':
            initializePaymentCollectionPage();
            break;
        case 'customer-detail':
            if (typeof initCustomerDetailTabs === 'function') {
                initCustomerDetailTabs();
            }
            break;
        case 'contract-detail':
            initializeContractDetailTabsAndDropdown();
            break;
        case 'collection-unit-detail-content':
            // Initialize tabs for collection unit detail page
            setTimeout(() => {
                if (typeof showTab === 'function') {
                    showTab('teams');
                }
            }, 100);
            break;
        case 'page-placeholder':
            // Placeholder page doesn't need initialization
            break;
        case 'users-content':
            if (typeof initializeUsersPage === 'function') initializeUsersPage();
            break;
        default:
            // Handle other pages
            break;
    }
}

function updateBreadcrumb(pageName) {
    const breadcrumb = document.getElementById('page-name-breadcrumb');
    if (breadcrumb) {
        breadcrumb.textContent = pageName.toUpperCase();
    }
}

// Sidebar Toggle - now handled in WebAdmin object

// Mobile Menu
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.remove('hidden');
            document.body.classList.add('modal-open');
        });
    }
    
    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('modal-open');
        });
    }
    
    // Close mobile menu when clicking outside
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                mobileMenu.classList.add('hidden');
                document.body.classList.remove('modal-open');
            }
        });
    }
}

// Mobile sidebar overlay click outside to close
document.addEventListener('DOMContentLoaded', function() {
    const mobileSidebarOverlay = document.getElementById('mobile-sidebar-overlay');
    if (mobileSidebarOverlay) {
        mobileSidebarOverlay.addEventListener('mousedown', function(e) {
            if (e.target === mobileSidebarOverlay) {
                mobileSidebarOverlay.classList.add('hidden');
            }
        });
    }
});

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date(date));
}

function formatDateTime(dateTime) {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(dateTime));
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'warning' ? 'bg-yellow-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' :
                type === 'error' ? 'fa-exclamation-circle' :
                type === 'warning' ? 'fa-exclamation-triangle' :
                'fa-info-circle'
            } mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

function logout() {
    confirmAction('Bạn có chắc chắn muốn đăng xuất?', function() {
        // Perform logout action
        showNotification('Đã đăng xuất thành công', 'success');
        // Redirect to login page or reload
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    });
}

// Export functions for use in other modules
// WebAdmin object
const WebAdmin = {
    currentRole: 'grac-admin',
    currentPage: 'dashboard-grac-admin',
    
    init: function() {
        console.log('Initializing WebAdmin...');
        this.setupEventListeners();
        this.loadContent(this.currentPage);
        console.log('WebAdmin initialized successfully');
    },
    
    setupEventListeners: function() {
        console.log('Setting up event listeners...');
        
        // Navigation links
        document.querySelectorAll('.web-nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('data-target');
                console.log('Navigation clicked:', target);
                WebAdmin.loadContent(target);
            });
        });
        
        // Role toggle
        const roleToggleBtn = document.getElementById('role-toggle-btn');
        if (roleToggleBtn) {
            roleToggleBtn.addEventListener('click', function() {
                console.log('Role toggle clicked');
                WebAdmin.toggleRoleSelection();
            });
        }
        
        // Role buttons
        document.querySelectorAll('.role-button').forEach(button => {
            button.addEventListener('click', function() {
                const role = this.getAttribute('data-role');
                console.log('Role selected:', role);
                WebAdmin.switchRole(role);
            });
        });
        
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function() {
                console.log('Sidebar toggle clicked');
                WebAdmin.toggleSidebar();
            });
        }
        
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', function() {
                console.log('Mobile menu toggle clicked');
                WebAdmin.toggleMobileMenu();
            });
        }
        
        // Mobile menu close
        const closeMobileSidebar = document.getElementById('close-mobile-sidebar');
        if (closeMobileSidebar) {
            closeMobileSidebar.addEventListener('click', function() {
                console.log('Mobile sidebar close clicked');
                WebAdmin.closeMobileMenu();
            });
        }
        
        // Mobile sidebar overlay click outside to close
        const mobileSidebarOverlay = document.getElementById('mobile-sidebar-overlay');
        if (mobileSidebarOverlay) {
            mobileSidebarOverlay.addEventListener('mousedown', function(e) {
                if (e.target === mobileSidebarOverlay) {
                    WebAdmin.closeMobileMenu();
                }
            });
        }
        
        // Mobile menu navigation links - close menu when clicked
        const mobileNavLinks = document.querySelectorAll('#mobile-sidebar-overlay .web-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                console.log('Mobile nav link clicked, closing menu');
                WebAdmin.closeMobileMenu();
            });
        });
        
        console.log('Event listeners setup completed');
    },
    
    loadContent: loadContent,
    
    toggleRoleSelection: function() {
        const panel = document.getElementById('role-selection-panel');
        const icon = document.getElementById('role-toggle-icon');
        
        if (panel.style.maxHeight === '0px' || panel.style.maxHeight === '') {
            panel.style.maxHeight = panel.scrollHeight + 'px';
            panel.style.opacity = '1';
            panel.style.padding = '1.5rem';
            icon.style.transform = 'rotate(180deg)';
        } else {
            panel.style.maxHeight = '0';
            panel.style.opacity = '0';
            panel.style.padding = '0';
            icon.style.transform = 'rotate(0deg)';
        }
    },
    
    switchRole: function(role) {
        console.log('Switching to role:', role);
        this.currentRole = role;
        
        // Update UI
        this.updateRoleDisplay(role);
        this.updateSidebar(role);
        this.updateUserRoleName(role);
        
        // Load default page for role
        const defaultPages = {
            'grac-admin': 'dashboard-grac-admin',
            'dv-quanly': 'dashboard-dv-quanly',
            'dv-coso': 'dashboard-dv-coso',
            'dv-thugom': 'dashboard-dv-thugom'
        };
        
        const defaultPage = defaultPages[role] || 'dashboard-grac-admin';
        this.loadContent(defaultPage);
        
        // Close role selection panel
        this.toggleRoleSelection();
    },
    
    updateRoleDisplay: function(role) {
        const roleNames = {
            'grac-admin': 'GRAC Admin',
            'dv-quanly': 'Đơn vị quản lý',
            'dv-coso': 'Đơn vị cơ sở',
            'dv-thugom': 'Đơn vị thu gom'
        };
        
        const currentRoleDisplay = document.getElementById('current-role-display');
        if (currentRoleDisplay) {
            currentRoleDisplay.innerHTML = `Vai trò hiện tại: <strong>${roleNames[role]}</strong>`;
        }
    },
    
    updateSidebar: function(role) {
        // Hide all sidebars
        document.querySelectorAll('.sidebar').forEach(sidebar => {
            sidebar.classList.add('hidden');
        });
        
        // Show selected sidebar
        const selectedSidebar = document.getElementById(`sidebar-${role}`);
        if (selectedSidebar) {
            selectedSidebar.classList.remove('hidden');
        }
        
        // Hide all mobile menus
        document.querySelectorAll('.mobile-menu-content').forEach(menu => {
            menu.classList.add('hidden');
        });
        
        // Show selected mobile menu
        const selectedMobileMenu = document.getElementById(`mobile-menu-${role}`);
        if (selectedMobileMenu) {
            selectedMobileMenu.classList.remove('hidden');
        }
    },
    
    updateUserRoleName: function(role) {
        const roleNames = {
            'grac-admin': 'GRAC Admin',
            'dv-quanly': 'Đơn vị quản lý',
            'dv-coso': 'Đơn vị cơ sở',
            'dv-thugom': 'Đơn vị thu gom'
        };
        
        const userRoleName = document.getElementById('user-role-name');
        if (userRoleName) {
            userRoleName.textContent = roleNames[role];
        }
    },
    
    toggleSidebar: function() {
        const sidebarContainer = document.getElementById('sidebar-container');
        const toggleBtn = document.getElementById('sidebar-toggle');
        const icon = toggleBtn.querySelector('i');
        
        if (sidebarContainer.classList.contains('collapsed')) {
            sidebarContainer.classList.remove('collapsed');
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-left');
        } else {
            sidebarContainer.classList.add('collapsed');
            icon.classList.remove('fa-chevron-left');
            icon.classList.add('fa-chevron-right');
        }
    },
    
    toggleMobileMenu: function() {
        const mobileSidebarOverlay = document.getElementById('mobile-sidebar-overlay');
        if (mobileSidebarOverlay) {
            mobileSidebarOverlay.classList.remove('hidden');
        }
    },
    
    closeMobileMenu: function() {
        const mobileSidebarOverlay = document.getElementById('mobile-sidebar-overlay');
        if (mobileSidebarOverlay) {
            mobileSidebarOverlay.classList.add('hidden');
        }
    },
    
    showNotification: function(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${this.getNotificationClasses(type)}`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${this.getNotificationIcon(type)} mr-2"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    },
    
    getNotificationClasses: function(type) {
        const classes = {
            'success': 'bg-green-100 border border-green-400 text-green-700',
            'error': 'bg-red-100 border border-red-400 text-red-700',
            'warning': 'bg-yellow-100 border border-yellow-400 text-yellow-700',
            'info': 'bg-blue-100 border border-blue-400 text-blue-700'
        };
        return classes[type] || classes.info;
    },
    
    getNotificationIcon: function(type) {
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}; 

// Export WebAdmin object to global scope
window.WebAdmin = WebAdmin;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing WebAdmin...');
    WebAdmin.init();
});

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('vi-VN').format(new Date(date));
}

function formatDateTime(date) {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

function confirmAction(message) {
    return confirm(message);
}

function logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        // Redirect to login page or perform logout
        window.location.href = '../index.html';
    }
} 

// === Payment Modal Logic (robust version) ===
(function() {
    let selectedPeriods = [];
    let totalAmount = 0;
    let eventBound = false;

    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }

    function updatePaymentSummary() {
        const periodsCount = document.getElementById('selected-periods-count');
        const totalAmountElement = document.getElementById('total-payment-amount');
        const periodsList = document.getElementById('selected-periods-list');
        if (periodsCount) periodsCount.textContent = selectedPeriods.length;
        if (totalAmountElement) totalAmountElement.textContent = formatCurrency(totalAmount);
        if (periodsList) periodsList.textContent = selectedPeriods.length > 0 ? selectedPeriods.join(', ') : 'Chưa chọn';
    }

    function generatePaymentPeriods() {
        const currentYear = new Date().getFullYear();
        const container = document.getElementById('payment-periods-container');
        if (!container) return;
        container.innerHTML = '';
        for (let month = 1; month <= 12; month++) {
            const periodLabel = `T${month}/${currentYear}`;
            const amount = 35000;
            const periodElement = document.createElement('label');
            periodElement.className = 'flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 payment-period-option';
            periodElement.innerHTML = `
                <input type="checkbox" class="period-checkbox mr-2" value="${periodLabel}" data-amount="${amount}">
                <div>
                    <div class="font-medium text-sm">${periodLabel}</div>
                    <div class="text-xs text-gray-500">${formatCurrency(amount)}</div>
                </div>
            `;
            container.appendChild(periodElement);
        }
    }

    function resetPaymentForm() {
        selectedPeriods = [];
        totalAmount = 0;
        generatePaymentPeriods();
        updatePaymentSummary();
        document.getElementById('payment-note').value = '';
        document.querySelector('input[name="payment-method"][value="cash"]').checked = true;
    }

    function bindPaymentModalEvents() {
        if (eventBound) return; // Chỉ bind 1 lần
        eventBound = true;
        // Đóng modal
        document.getElementById('close-payment-modal').addEventListener('click', window.closePaymentModal);
        document.getElementById('cancel-payment').addEventListener('click', window.closePaymentModal);
        // Checkbox kỳ thanh toán (event delegation)
        document.getElementById('payment-periods-container').addEventListener('change', function(e) {
            if (e.target.classList.contains('period-checkbox')) {
                const period = e.target.value;
                const amount = parseInt(e.target.dataset.amount);
                if (e.target.checked) {
                    if (!selectedPeriods.includes(period)) {
                        selectedPeriods.push(period);
                        totalAmount += amount;
                    }
                } else {
                    const idx = selectedPeriods.indexOf(period);
                    if (idx > -1) {
                        selectedPeriods.splice(idx, 1);
                        totalAmount -= amount;
                    }
                }
                updatePaymentSummary();
            }
        });
        // Chọn tất cả
        document.getElementById('select-all-periods').addEventListener('click', function() {
            const checkboxes = Array.from(document.querySelectorAll('.payment-period-checkbox'));
            checkboxes.forEach(cb => {
                cb.checked = true;
                const item = cb.closest('.payment-period-item');
                if (item) {
                    updateItemSelection(item, true);
                }
            });
            
            calculateTotalAmount();
        });
        // 3 tháng gần nhất
        document.getElementById('select-last-3-months').addEventListener('click', function() {
            const checkboxes = Array.from(document.querySelectorAll('.payment-period-checkbox'));
            checkboxes.forEach(cb => cb.checked = false);
            
            // Chọn 3 kỳ gần nhất (có status pending - chưa thu)
            const pendingCheckboxes = checkboxes.filter(cb => {
                const item = cb.closest('.payment-period-item');
                return item && item.dataset.status === 'pending';
            });
            
            const last3 = pendingCheckboxes.slice(-3);
            last3.forEach(cb => {
                cb.checked = true;
                const item = cb.closest('.payment-period-item');
                if (item) {
                    updateItemSelection(item, true);
                }
            });
            
            calculateTotalAmount();
        });
        
        // Chỉ quá hạn (các kỳ có status pending)
        document.getElementById('select-overdue').addEventListener('click', function() {
            const checkboxes = Array.from(document.querySelectorAll('.payment-period-checkbox'));
            checkboxes.forEach(cb => cb.checked = false);
            
            // Chọn tất cả kỳ có status pending (chưa thu)
            const pendingCheckboxes = checkboxes.filter(cb => {
                const item = cb.closest('.payment-period-item');
                return item && item.dataset.status === 'pending';
            });
            
            pendingCheckboxes.forEach(cb => {
                cb.checked = true;
                const item = cb.closest('.payment-period-item');
                if (item) {
                    updateItemSelection(item, true);
                }
            });
            
            calculateTotalAmount();
        });
        
        // Bỏ chọn tất cả
        document.getElementById('clear-selection').addEventListener('click', function() {
            const checkboxes = Array.from(document.querySelectorAll('.payment-period-checkbox'));
            checkboxes.forEach(cb => {
                cb.checked = false;
                const item = cb.closest('.payment-period-item');
                if (item) {
                    updateItemSelection(item, false);
                }
            });
            
            calculateTotalAmount();
        });
        // Xác nhận thanh toán (chuyên nghiệp)
        document.getElementById('confirm-payment').addEventListener('click', function() {
            const selectedCheckboxes = document.querySelectorAll('.payment-period-checkbox:checked');
            if (selectedCheckboxes.length === 0) {
                window.showWarning('Vui lòng chọn ít nhất một kỳ thanh toán!', 'Thiếu thông tin');
                return;
            }
            
            const selectedPeriods = Array.from(selectedCheckboxes).map(cb => cb.dataset.period);
            const totalAmount = Array.from(selectedCheckboxes).reduce((sum, cb) => sum + parseInt(cb.dataset.amount), 0);
            const customerName = document.getElementById('payment-customer-name').textContent;
            const note = document.getElementById('payment-note').value;
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
            
            const confirmMsg = `Khách hàng: ${customerName}\nKỳ thanh toán: ${selectedPeriods.join(', ')}\nTổng tiền: ${formatCurrency(totalAmount)}\nPhương thức: ${paymentMethod === 'momo' ? 'Momo' : paymentMethod}\nGhi chú: ${note || 'Không có'}`;
            window.showConfirm(confirmMsg, 'Xác nhận thanh toán', function() {
                if (paymentMethod === 'momo') {
                    window.showQRCodePayment(paymentMethod, note, totalAmount, customerName, selectedPeriods);
                } else {
                    window.showPaymentSuccess(customerName, totalAmount, selectedPeriods, paymentMethod, note);
                }
            }, function() {
                // Hủy
            });
        });
    }

    window.openPaymentModal = function(customerData) {
        const modal = document.getElementById('payment-modal');
        if (!modal) return;
        // Reset trạng thái hiển thị các phần trong modal
        const modalContent = modal.querySelector('.bg-white.rounded-2xl.shadow-2xl') || modal.querySelector('.bg-white.rounded-lg.shadow-xl') || modal.querySelector('.bg-white');
        const qrContent = document.getElementById('qr-payment-content');
        const successContent = document.getElementById('payment-success-content');
        if (modalContent) modalContent.style.display = 'block';
        if (qrContent) qrContent.style.display = 'none';
        if (successContent) successContent.style.display = 'none';
        document.getElementById('payment-customer-code').textContent = customerData.code || '';
        document.getElementById('payment-customer-name').textContent = customerData.name || '';
        document.getElementById('payment-customer-address').textContent = customerData.address || '';
        document.getElementById('payment-total-debt').textContent = customerData.totalDebt || '';
        resetPaymentForm();
        bindPaymentModalEvents();
        const scrollY = window.scrollY;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${scrollY}px`;
        modal.scrollY = scrollY;
        modal.classList.remove('hidden');
    };

    window.closePaymentModal = function() {
        const modal = document.getElementById('payment-modal');
        if (!modal) return;
        const scrollY = modal.scrollY || 0;
        modal.classList.add('hidden');
        // Reset body scroll/position
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
        // Ẩn overlay nếu có
        const overlay = document.getElementById('payment-processing-overlay');
        if (overlay) overlay.classList.add('hidden');
    };
    // Expose for QR/Success logic
    // window.showQRCodePayment = window.showQRCodePayment; // This line is removed as per the new_code
    // window.showPaymentSuccess = window.showPaymentSuccess; // This line is removed as per the new_code
})();
// === End Payment Modal Logic === 

// === Notification & Payment Flow Logic (restored & improved confirm UI) ===
(function() {
    // Notification modal helpers
    function hideAllNotifications() {
        ["success-notification","error-notification","warning-notification","confirm-notification","info-notification"].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.classList.add("hidden"); }
        });
    }
    function showNotification(type, title, message, callback, isHtml) {
        const modal = document.getElementById('notification-modal');
        hideAllNotifications();
        let boxId = '';
        if (type === 'success') boxId = 'success-notification';
        else if (type === 'error') boxId = 'error-notification';
        else if (type === 'warning') boxId = 'warning-notification';
        else if (type === 'info') boxId = 'info-notification';
        else if (type === 'confirm') boxId = 'confirm-notification';
        const box = document.getElementById(boxId);
        if (!box) return;
        box.classList.remove('hidden');
        modal.classList.remove('hidden');
        // Set content
        if (title) box.querySelector('h3').textContent = title;
        const msgEl = box.querySelector('p');
        if (msgEl) {
            if (isHtml) {
                msgEl.innerHTML = message;
            } else {
                msgEl.textContent = message;
            }
        }
        // Button events
        if (type === 'success') {
            box.querySelector('button').onclick = function() {
                modal.classList.add('hidden');
                box.classList.add('hidden');
                if (callback) callback();
            };
        } else if (type === 'error') {
            box.querySelector('button').onclick = function() {
                modal.classList.add('hidden');
                box.classList.add('hidden');
                if (callback) callback();
            };
        } else if (type === 'warning') {
            box.querySelector('button').onclick = function() {
                modal.classList.add('hidden');
                box.classList.add('hidden');
                if (callback) callback();
            };
        } else if (type === 'info') {
            box.querySelector('button').onclick = function() {
                modal.classList.add('hidden');
                box.classList.add('hidden');
                if (callback) callback();
            };
        } else if (type === 'confirm') {
            const okBtn = box.querySelector('#confirm-ok-btn');
            const cancelBtn = box.querySelector('#confirm-cancel-btn');
            if (okBtn) {
                okBtn.onclick = function() {
                    modal.classList.add('hidden');
                    box.classList.add('hidden');
                    if (window.confirmCallback) window.confirmCallback();
                };
            }
            if (cancelBtn) {
                cancelBtn.onclick = function() {
                    modal.classList.add('hidden');
                    box.classList.add('hidden');
                    if (window.cancelCallback) window.cancelCallback();
                };
            }
        }
    }
    window.showSuccess = function(message, title = 'Thành công!', callback, isHtml = true) { showNotification('success', title, message, callback, isHtml); };
    window.showError = function(message, title = 'Lỗi!', callback) { showNotification('error', title, message, callback); };
    window.showWarning = function(message, title = 'Cảnh báo!', callback) { showNotification('warning', title, message, callback); };
    window.showInfo = function(message, title = 'Thông tin', callback) { showNotification('info', title, message, callback); };
    window.showConfirm = function(message, title = 'Xác nhận', onConfirm, onCancel, isHtml) {
        window.confirmCallback = onConfirm;
        window.cancelCallback = onCancel;
        showNotification('confirm', title, message, null, isHtml);
    };

    // Payment QR & Success logic
    function showQRCodePayment(method, note, totalAmount, customerName, selectedPeriods) {
        console.log('showQRCodePayment called', {method, note, totalAmount, customerName, selectedPeriods});
        // Ẩn notification modal nếu còn hiển thị
        const notificationModal = document.getElementById('notification-modal');
        if (notificationModal) notificationModal.classList.add('hidden');
        // Hide main modal content
        const modal = document.getElementById('payment-modal');
        // Sửa selector để tương thích UI mới
        const modalContent = modal.querySelector('.bg-white.rounded-2xl.shadow-2xl') || modal.querySelector('.bg-white.rounded-lg.shadow-xl') || modal.querySelector('.bg-white');
        const qrContent = document.getElementById('qr-payment-content');
        const qrCodeImage = document.getElementById('qr-code-image');
        const statusText = document.getElementById('qr-status-text');
        const progressBar = document.getElementById('qr-progress-bar');
        const cancelBtn = document.getElementById('qr-cancel-btn');
        if (!modal || !modalContent || !qrContent || !qrCodeImage || !statusText || !progressBar || !cancelBtn) {
            console.error('QR Payment: Missing required DOM elements', {modal, modalContent, qrContent, qrCodeImage, statusText, progressBar, cancelBtn});
            window.showError('Không thể hiển thị QR code do thiếu thành phần giao diện!', 'Lỗi QR');
            return;
        }
        modalContent.style.display = 'none';
        qrContent.style.display = 'block';
        qrContent.classList.remove('hidden');
        modal.classList.remove('hidden');
        console.log('QR modal visibility:', {
            modalDisplay: modal.style.display,
            modalHidden: modal.classList.contains('hidden'),
            qrContentDisplay: qrContent.style.display,
            qrContentHidden: qrContent.classList.contains('hidden')
        });
        // Set QR info
        document.getElementById('qr-payment-text').textContent = 'Thanh toán qua Momo';
        document.getElementById('qr-amount-text').textContent = formatCurrency(totalAmount);
        // Fake QR code
        qrCodeImage.innerHTML = `<svg width="200" height="200"><rect width="200" height="200" fill="white"/><text x="100" y="100" text-anchor="middle" dy=".3em" font-size="12" fill="#333">QR Code Demo</text><text x="100" y="120" text-anchor="middle" dy=".3em" font-size="10" fill="#666">${formatCurrency(totalAmount)}</text></svg>`;
        // Simulate payment progress
        let progress = 0;
        statusText.textContent = 'Đang xử lý thanh toán...';
        statusText.className = 'text-blue-600 font-semibold';
        progressBar.style.width = '0%';
        progressBar.className = 'bg-blue-500 h-3 rounded-full transition-all duration-500';
        cancelBtn.style.display = 'block';
        if (window.qrPaymentInterval) clearInterval(window.qrPaymentInterval);
        window.qrPaymentInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(window.qrPaymentInterval);
                statusText.textContent = 'Thanh toán thành công!';
                statusText.className = 'text-green-600 font-semibold';
                progressBar.style.width = '100%';
                progressBar.className = 'bg-green-500 h-3 rounded-full transition-all duration-500';
                cancelBtn.style.display = 'none';
                setTimeout(() => {
                    hideQRPayment();
                    showPaymentSuccess(customerName, totalAmount, selectedPeriods, 'Momo', note);
                }, 2000);
            } else {
                statusText.textContent = 'Đang xử lý thanh toán...';
                progressBar.style.width = progress + '%';
            }
        }, 500);
    }
    function showPaymentSuccess(customerName, totalAmount, selectedPeriods, method, note) {
        const modal = document.getElementById('payment-modal');
        // Sửa selector để tương thích UI mới
        const modalContent = modal.querySelector('.bg-white.rounded-2xl.shadow-2xl') || modal.querySelector('.bg-white.rounded-lg.shadow-xl') || modal.querySelector('.bg-white');
        const qrContent = document.getElementById('qr-payment-content');
        const successContent = document.getElementById('payment-success-content');
        if (modalContent) modalContent.style.display = 'none';
        if (qrContent) qrContent.style.display = 'none';
        if (successContent) {
            successContent.style.display = 'block';
            document.getElementById('success-customer-name').textContent = customerName;
            document.getElementById('success-amount').textContent = formatCurrency(totalAmount);
            document.getElementById('success-periods').textContent = selectedPeriods.join(', ');
            document.getElementById('success-method').textContent = method;
            document.getElementById('success-note').textContent = note || 'Không có';
            setTimeout(() => {
                // Hiển thị popup thông báo thành công nổi bật trước khi đóng modal
                window.showSuccess(
                    `Khách hàng: ${customerName}<br>Kỳ thanh toán: ${selectedPeriods.join(', ')}<br>Tổng tiền: ${formatCurrency(totalAmount)}<br>Phương thức: ${method}<br>Ghi chú: ${note || 'Không có'}`,
                    'Thanh toán thành công!',
                    function() {
                        window.closePaymentModal();
                        successContent.style.display = 'none';
                    },
                    true
                );
            }, 1000);
        }
    }
    // Định nghĩa lại window.hideQRPayment để không bị lỗi
    window.hideQRPayment = function() {
        const modal = document.getElementById('payment-modal');
        const modalContent = modal.querySelector('.bg-white.rounded-lg.shadow-xl');
        const qrContent = document.getElementById('qr-payment-content');
        if (window.qrPaymentInterval) clearInterval(window.qrPaymentInterval);
        if (modalContent) modalContent.style.display = 'block';
        if (qrContent) qrContent.style.display = 'none';
        document.getElementById('qr-status-text').textContent = 'Đang xử lý thanh toán...';
        document.getElementById('qr-status-text').className = 'text-blue-600 font-semibold';
        document.getElementById('qr-progress-bar').style.width = '0%';
        document.getElementById('qr-progress-bar').className = 'bg-blue-500 h-3 rounded-full transition-all duration-500';
        document.getElementById('qr-cancel-btn').style.display = 'block';
    };
    // Gán vào window sau khi định nghĩa
    window.showQRCodePayment = showQRCodePayment;
    window.showPaymentSuccess = showPaymentSuccess;
    // Gắn lại logic cho nút xác nhận thanh toán với UI chuyên nghiệp
    const oldConfirmBtn = document.getElementById('confirm-payment');
    if (oldConfirmBtn) {
        oldConfirmBtn.onclick = function() {
            // Lấy thông tin kỳ, tổng tiền, phương thức, ghi chú
            const selectedPeriods = Array.from(document.querySelectorAll('.period-checkbox:checked')).map(cb => cb.value);
            const totalAmount = selectedPeriods.length * 35000;
            const customerName = document.getElementById('payment-customer-name').textContent;
            const note = document.getElementById('payment-note').value;
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
            if (selectedPeriods.length === 0) {
                window.showWarning('Vui lòng chọn ít nhất một kỳ thanh toán!', 'Thiếu thông tin');
                return;
            }
            // Tạo HTML chuyên nghiệp
            const confirmHtml = `
                <div class="text-left space-y-2">
                    <div><span class="font-medium text-gray-700">Khách hàng:</span> <span class="float-right text-gray-900">${customerName}</span></div>
                    <div><span class="font-medium text-gray-700">Kỳ thanh toán:</span> <span class="float-right text-gray-900">${selectedPeriods.join(', ')}</span></div>
                    <div><span class="font-medium text-gray-700">Tổng tiền:</span> <span class="float-right text-green-600 font-bold">${formatCurrency(totalAmount)}</span></div>
                    <div><span class="font-medium text-gray-700">Phương thức:</span> <span class="float-right text-blue-700 font-semibold">${paymentMethod === 'momo' ? 'Momo' : paymentMethod}</span></div>
                    <div><span class="font-medium text-gray-700">Ghi chú:</span> <span class="float-right text-gray-900">${note || 'Không có'}</span></div>
                </div>
            `;
            window.showConfirm(confirmHtml, 'Xác nhận thanh toán', function() {
                console.log('Xác nhận thanh toán callback được gọi', {paymentMethod, selectedPeriods, totalAmount, customerName, note});
                setTimeout(function() {
                    if (paymentMethod === 'momo') {
                        window.showQRCodePayment(paymentMethod, note, totalAmount, customerName, selectedPeriods);
                    } else {
                        // Hiển thị popup "Thanh toán thành công" cho tiền mặt
                        window.showSuccess(
                            `Khách hàng: ${customerName}<br>Kỳ thanh toán: ${selectedPeriods.join(', ')}<br>Tổng tiền: ${formatCurrency(totalAmount)}<br>Phương thức: ${paymentMethod}<br>Ghi chú: ${note || 'Không có'}`,
                            'Thanh toán thành công!',
                            function() {
                                window.closePaymentModal();
                            },
                            true
                        );
                        // Tự đóng popup sau 1 giây
                        setTimeout(function() {
                            window.closePaymentModal();
                        }, 1000);
                    }
                }, 0);
            }, function() {
                // Hủy
            }, true);
        };
    }
})();
// === End Notification & Payment Flow Logic === 

// === Dropdown Thao tác cho contract-detail ===
function initializeContractDetailTabsAndDropdown() {
  // Dropdown hover/click
  document.querySelectorAll('.dropdown').forEach(function(drop) {
    drop.addEventListener('mouseenter', function() {
      const menu = this.querySelector('.dropdown-menu');
      if (menu) menu.classList.remove('hidden');
    });
    drop.addEventListener('mouseleave', function() {
      const menu = this.querySelector('.dropdown-menu');
      if (menu) menu.classList.add('hidden');
    });
    // Click để mở/đóng trên mobile
    const btn = drop.querySelector('button');
    if (btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const menu = drop.querySelector('.dropdown-menu');
        if (menu) menu.classList.toggle('hidden');
      });
    }
  });
  // Đóng dropdown khi click ra ngoài
  document.addEventListener('click', function(e) {
    document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
      if (!menu.parentNode.contains(e.target)) menu.classList.add('hidden');
    });
  });

  // === Tabs động cho contract-detail ===
  const tabButtons = document.querySelectorAll('.status-tab');
  const tabContents = document.querySelectorAll('#tab-content > div');
  if (tabButtons.length && tabContents.length) {
    tabButtons.forEach((btn, idx) => {
      btn.addEventListener('click', function() {
        tabButtons.forEach(b => b.classList.remove('active', 'text-gray-600'));
        this.classList.add('active', 'text-gray-600');
        tabContents.forEach((c, i) => c.style.display = (i === idx ? 'block' : 'none'));
      });
    });
    // Hiện tab đầu tiên mặc định
    tabContents.forEach((c, i) => c.style.display = (i === 0 ? 'block' : 'none'));
  }

  // Bổ sung event cho nút Thu tiền nhiều tháng
  const multiPayBtn = document.getElementById('multi-pay-btn');
  if (multiPayBtn) {
    multiPayBtn.addEventListener('click', function() {
      // Lấy thông tin hợp đồng từ DOM
      const code = document.querySelector('h2 .text-blue-600') ? document.querySelector('h2 .text-blue-600').textContent.trim() : (document.getElementById('contract-code')?.textContent?.trim() || '');
      const name = document.getElementById('contract-customer')?.textContent?.trim() || document.getElementById('customer-name')?.textContent?.trim() || '';
      const address = document.getElementById('customer-address')?.textContent?.trim() || '';
      const totalDebt = document.querySelector('.bg-blue-50 .text-2xl')?.textContent?.trim() || '';
      const customerData = { code, name, address, totalDebt };
      if (typeof window.openPaymentModal === 'function') {
        window.openPaymentModal(customerData);
      } else {
        alert('Chức năng thanh toán chưa sẵn sàng!');
      }
    });
  }
}
// === End Dropdown Thao tác cho contract-detail === 

// Hàm chuyển đến trang chi tiết đơn vị thu gom
function navigateToUnitDetail(unitId) {
    console.log('Navigate to unit detail:', unitId);
    // Load trang chi tiết đơn vị thu gom trong layout chính
    try {
        loadContent('collection-unit-detail-content');
        // Cập nhật breadcrumb
        updateBreadcrumb('Chi tiết Đơn vị Thu gom');
    } catch (error) {
        console.error('Error loading unit detail:', error);
    }
}

// Hàm chuyển tab cho trang chi tiết đơn vị thu gom
function showTab(tabName) {
    console.log('Showing tab:', tabName);
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.status-tab');
    tabButtons.forEach(button => {
        button.classList.remove('active', 'border-b-2', 'border-blue-600');
        button.classList.add('text-gray-500');
    });

    // Show selected tab content
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active', 'border-b-2', 'border-blue-600');
        event.target.classList.remove('text-gray-500');
        event.target.classList.add('text-gray-600');
    }
}

// ==== Đơn vị Cơ sở: Navigation & Actions ====
function navigateToBaseUnitDetail(unitId) {
    console.log('Navigate to base unit detail:', unitId);
    // Load trang chi tiết đơn vị cơ sở trong layout chính
    try {
        WebAdmin.loadContent('base-unit-detail-content');
        // Cập nhật breadcrumb
        updateBreadcrumb('Chi tiết Đơn vị Cơ sở');
    } catch (error) {
        console.error('Error loading base unit detail:', error);
    }
}

function openAddBaseUnitModal() {
    alert('Chức năng thêm Đơn vị Cơ sở sẽ được phát triển sau!');
}
function editBaseUnitInfo() {
    alert('Chức năng sửa thông tin Đơn vị Cơ sở sẽ được phát triển sau!');
}
function manageBaseUnitStaff() {
    alert('Chức năng quản lý nhân sự sẽ được phát triển sau!');
}
function deleteBaseUnit() {
    if (confirm('Bạn có chắc chắn muốn xóa đơn vị này?')) {
        alert('Đã xóa đơn vị thành công!');
        WebAdmin.loadContent('base-units-content');
    }
}

// Tab switching for base unit detail
function initializeBaseUnitDetailTabs() {
    document.querySelectorAll('.status-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.status-tab').forEach(t => {
                t.classList.remove('active', 'text-gray-600', 'border-blue-600');
                t.classList.add('text-gray-500');
            });
            // Add active class to clicked tab
            this.classList.add('active', 'text-gray-600', 'border-blue-600');
            this.classList.remove('text-gray-500');
            // Hide all tab contents
            document.querySelectorAll('.detail-tab-content').forEach(c => c.classList.add('hidden'));
            // Show selected tab content
            const target = this.getAttribute('data-target');
            const targetElement = document.getElementById(target);
            if (targetElement) {
                targetElement.classList.remove('hidden');
            }
        });
    });
}

// Tự động khởi tạo tab khi load trang chi tiết đơn vị cơ sở
function initializePageContent(contentId) {
    if (contentId === 'base-unit-detail-content') {
        setTimeout(() => {
            if (typeof initializeBaseUnitDetailTabs === 'function') {
                initializeBaseUnitDetailTabs();
            }
        }, 100);
    }
    // Initialize page-specific functionality based on content ID
    switch(contentId) {
        case 'dashboard-grac-admin':
            initializeDashboardGracAdmin();
            break;
        case 'dashboard-dv-quanly':
            initializeDashboardDvQuanly();
            break;
        case 'dashboard-dv-coso':
            initializeDashboardDvCoSo();
            // Dashboard for Đơn vị cơ sở doesn't need chart initialization
            break;
        case 'dashboard-dv-thugom':
            // Dashboard for Đơn vị thu gom doesn't need chart initialization
            break;
        case 'customers-content':
            initializeCustomersPage();
            break;
        case 'contracts-content':
            initializeContractsPage();
            break;
        case 'invoices-content':
            initializeInvoicesPage();
            break;
        case 'employees-content':
            initializeEmployeesPage();
            break;
        case 'services-content':
            initializeServicesPage();
            break;
        case 'address-categories-content':
            initializeAddressCategoriesPage();
            break;
        case 'payment-tracking-content':
            initializePaymentTrackingPage();
            break;
        case 'payment-collection-content':
            initializePaymentCollectionPage();
            break;
        case 'customer-detail':
            if (typeof initCustomerDetailTabs === 'function') {
                initCustomerDetailTabs();
            }
            break;
        case 'contract-detail':
            initializeContractDetailTabsAndDropdown();
            break;
        case 'collection-unit-detail-content':
            // Initialize tabs for collection unit detail page
            setTimeout(() => {
                if (typeof showTab === 'function') {
                    showTab('teams');
                }
            }, 100);
            break;
        case 'page-placeholder':
            // Placeholder page doesn't need initialization
            break;
        case 'users-content':
            if (typeof initializeUsersPage === 'function') initializeUsersPage();
            break;
        default:
            // Handle other pages
            break;
    }
}

// Export global
window.navigateToUnitDetail = navigateToUnitDetail;
window.showTab = showTab;
window.navigateToBaseUnitDetail = navigateToBaseUnitDetail;
window.openAddBaseUnitModal = openAddBaseUnitModal;
window.editBaseUnitInfo = editBaseUnitInfo;
window.manageBaseUnitStaff = manageBaseUnitStaff;
window.deleteBaseUnit = deleteBaseUnit;
window.initializeBaseUnitDetailTabs = initializeBaseUnitDetailTabs;

// Customer detail functions
function openPaymentModalFromCustomer() {
    console.log('Opening payment modal from customer detail');
    
    // Close all dropdowns before opening payment modal
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
    });
    
    // Lấy thông tin khách hàng từ trang hiện tại
    const customerName = document.querySelector('h2')?.textContent?.trim() || 'Công ty TNHH ABC';
    const customerCode = 'KH003'; // Có thể lấy từ DOM hoặc truyền qua parameter
    const totalDebt = '105.000 ₫';
    
    const customerData = {
        code: customerCode,
        name: customerName,
        address: '789 Hai Bà Trưng, P. Đa Kao, TP. Hồ Chí Minh',
        totalDebt: totalDebt
    };
    
    if (typeof window.openPaymentModal === 'function') {
        window.openPaymentModal(customerData);
    } else {
        alert('Chức năng thanh toán chưa sẵn sàng!');
    }
}

function editCustomerInfo() {
    console.log('Editing customer info');
    alert('Chỉnh sửa thông tin khách hàng');
}

function unlockCustomerAccount() {
    console.log('Unlocking customer account');
    alert('Mở khóa tài khoản khách hàng');
}

function createNewContract() {
    console.log('Creating new contract');
    alert('Tạo hợp đồng mới');
}

function exportCustomerPDF() {
    console.log('Exporting customer PDF');
    alert('Xuất PDF thông tin khách hàng');
}

function printCustomerInfo() {
    console.log('Printing customer info');
    alert('In thông tin khách hàng');
}

// Export functions to global scope
window.initializeCustomerDetailTabs = initializeCustomerDetailTabs;
window.initializeContractDetailTabs = initializeContractDetailTabs;
window.initializeCollectionUnitDetailTabs = initializeCollectionUnitDetailTabs;
window.initializeDropdowns = initializeDropdowns;
window.initializePage = initializePage;
window.showTab = showTab;
window.openPaymentModalFromCustomer = openPaymentModalFromCustomer;
window.editCustomerInfo = editCustomerInfo;
window.unlockCustomerAccount = unlockCustomerAccount;
window.createNewContract = createNewContract;
window.exportCustomerPDF = exportCustomerPDF;
window.printCustomerInfo = printCustomerInfo;

// Customer detail tabs functionality
function initializeCustomerDetailTabs() {
    console.log('Initializing customer detail tabs');
    
    // Tab functionality
    document.querySelectorAll('.status-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            console.log('Tab clicked:', this.getAttribute('data-target'));
            
            // Remove active class from all tabs
            document.querySelectorAll('.status-tab').forEach(t => {
                t.classList.remove('active', 'text-gray-600', 'border-blue-600');
                t.classList.add('text-gray-500');
            });
            
            // Add active class to clicked tab
            this.classList.add('active', 'text-gray-600', 'border-blue-600');
            this.classList.remove('text-gray-500');
            
            // Hide all tab contents
            document.querySelectorAll('.detail-tab-content').forEach(c => c.classList.add('hidden'));
            
            // Show selected tab content
            const target = this.getAttribute('data-target');
            const targetElement = document.getElementById(target);
            if (targetElement) {
                targetElement.classList.remove('hidden');
                console.log('Showing tab:', target);
            } else {
                console.error('Tab target not found:', target);
            }
        });
    });

    // Dropdown functionality - Complete rewrite
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (!toggle || !menu) return;
        
        // Click to toggle
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
                if (otherMenu !== menu) {
                    otherMenu.classList.remove('show');
                }
            });
            
            // Toggle current dropdown
            menu.classList.toggle('show');
            console.log('Dropdown toggled:', menu.classList.contains('show') ? 'visible' : 'hidden');
        });
        
        // Prevent menu clicks from closing dropdown immediately
        menu.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Only close dropdown if clicking on a menu item (not the menu container)
            if (e.target.classList.contains('dropdown-item') || 
                e.target.tagName === 'A' || 
                e.target.tagName === 'BUTTON' ||
                e.target.closest('a') ||
                e.target.closest('button')) {
                
                // Close dropdown after a short delay to allow the action to complete
                setTimeout(() => {
                    menu.classList.remove('show');
                }, 100);
            }
        });
        
        // Mouse enter/leave for desktop hover behavior
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) { // Only on desktop
                menu.classList.add('show');
            }
        });
        
        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) { // Only on desktop
                menu.classList.remove('show');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // Check if click is outside any dropdown
        let isInsideDropdown = false;
        let currentElement = target;
        
        while (currentElement && currentElement !== document.body) {
            if (currentElement.classList.contains('dropdown')) {
                isInsideDropdown = true;
                break;
            }
            currentElement = currentElement.parentElement;
        }
        
        if (!isInsideDropdown) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });

    // Close dropdowns when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
    
    // Re-initialize dropdowns after modal closes
    if (typeof window.closePaymentModal === 'function') {
        const originalClosePaymentModal = window.closePaymentModal;
        window.closePaymentModal = function() {
            originalClosePaymentModal.call(this);
            // Re-initialize dropdowns after modal closes
            setTimeout(() => {
                initializeCustomerDetailTabs();
            }, 100);
        };
    }
}

// Initialize dropdowns for all content pages
function initializeDropdowns() {
    console.log('Initializing dropdowns for content pages');
    
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (!toggle || !menu) return;
        
        // Click to toggle
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
                if (otherMenu !== menu) {
                    otherMenu.classList.remove('show');
                }
            });
            
            // Toggle current dropdown
            menu.classList.toggle('show');
            console.log('Dropdown toggled:', menu.classList.contains('show') ? 'visible' : 'hidden');
        });
        
        // Prevent menu clicks from closing dropdown immediately
        menu.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Only close dropdown if clicking on a menu item (not the menu container)
            if (e.target.classList.contains('dropdown-item') || 
                e.target.tagName === 'A' || 
                e.target.tagName === 'BUTTON' ||
                e.target.closest('a') ||
                e.target.closest('button')) {
                
                // Close dropdown after a short delay to allow the action to complete
                setTimeout(() => {
                    menu.classList.remove('show');
                }, 100);
            }
        });
        
        // Mouse enter/leave for desktop hover behavior
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) { // Only on desktop
                menu.classList.add('show');
            }
        });
        
        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) { // Only on desktop
                menu.classList.remove('show');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // Check if click is outside any dropdown
        let isInsideDropdown = false;
        let currentElement = target;
        
        while (currentElement && currentElement !== document.body) {
            if (currentElement.classList.contains('dropdown')) {
                isInsideDropdown = true;
                break;
            }
            currentElement = currentElement.parentElement;
        }
        
        if (!isInsideDropdown) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });

    // Close dropdowns when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
    
    // Re-initialize dropdowns after modal closes
    if (typeof window.closePaymentModal === 'function') {
        const originalClosePaymentModal = window.closePaymentModal;
        window.closePaymentModal = function() {
            originalClosePaymentModal.call(this);
            // Re-initialize dropdowns after modal closes
            setTimeout(() => {
                initializeDropdowns();
            }, 100);
        };
    }
}

// Initialize page functionality
function initializePage() {
    console.log('Initializing page functionality');
    
    // Initialize dropdowns for content pages
    initializeDropdowns();
    
    // Initialize customer detail tabs if on customer detail page
    if (document.getElementById('customer-detail-content')) {
        initializeCustomerDetailTabs();
    }
    
    // Initialize contract detail tabs if on contract detail page
    if (document.getElementById('contract-detail-content')) {
        initializeContractDetailTabs();
    }
    
    // Initialize collection unit detail tabs if on collection unit detail page
    if (document.getElementById('collection-unit-detail-content')) {
        initializeCollectionUnitDetailTabs();
    }
    
    // Listen for modal close events
    const paymentModal = document.getElementById('payment-modal');
    if (paymentModal) {
        // Create a MutationObserver to watch for modal visibility changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isHidden = paymentModal.classList.contains('hidden');
                    if (isHidden) {
                        // Modal was closed, re-initialize dropdowns
                        setTimeout(() => {
                            initializeDropdowns();
                            if (document.getElementById('customer-detail-content')) {
                                initializeCustomerDetailTabs();
                            }
                        }, 100);
                    }
                }
            });
        });
        
        observer.observe(paymentModal, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
}

// Call initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

// Also call initialize when content is loaded dynamically
if (typeof WebAdmin !== 'undefined' && WebAdmin.loadContent) {
    const originalLoadContent = WebAdmin.loadContent;
    WebAdmin.loadContent = function(page) {
        originalLoadContent.call(this, page);
        // Wait a bit for content to load, then initialize
        setTimeout(initializePage, 100);
    };
}

// Export functions to global scope
window.initializeCustomerDetailTabs = initializeCustomerDetailTabs;
window.initializeContractDetailTabs = initializeContractDetailTabs;
window.initializeCollectionUnitDetailTabs = initializeCollectionUnitDetailTabs;
window.initializeDropdowns = initializeDropdowns;
window.initializePage = initializePage;
window.showTab = showTab;

function getCurrentServicePrice(service, unitId, managerUnitId, servicePrices, unitServicePrices) {
  // 1. Kiểm tra giá riêng tại đơn vị cơ sở
  const unitPrice = unitServicePrices.find(p => p.service_id === service.id && p.unit_id === unitId && (!p.end_date || new Date(p.end_date) > new Date()));
  if (unitPrice) return unitPrice.price;
  // 2. Kiểm tra giá theo đơn vị quản lý
  const managerPrice = servicePrices.find(p => p.service_id === service.id && p.manager_unit_id === managerUnitId && (!p.end_date || new Date(p.end_date) > new Date()));
  if (managerPrice) return managerPrice.price;
  // 3. Giá toàn hệ thống
  const globalPrice = servicePrices.find(p => p.service_id === service.id && !p.manager_unit_id && (!p.end_date || new Date(p.end_date) > new Date()));
  if (globalPrice) return globalPrice.price;
  return null;
}

function renderServiceTable(services, serviceGroups, servicePrices, unitServicePrices, unitId, managerUnitId) {
  const tbody = document.getElementById('serviceTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  services.forEach((service, idx) => {
    const group = serviceGroups.find(g => g.id === service.group_id);
    const price = getCurrentServicePrice(service, unitId, managerUnitId, servicePrices, unitServicePrices);
    const tr = document.createElement('tr');
    tr.className = 'bg-white border-b hover:bg-gray-50';
    tr.innerHTML = `
      <td class="text-center">${idx + 1}</td>
      <td class="text-center">
        <div class="relative inline-block text-left dropdown">
          <button type="button" class="dropdown-toggle flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none" title="Hành động">
            <i class="fas fa-ellipsis-v text-gray-600"></i>
          </button>
          <div class="dropdown-menu hidden bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
            <button class="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onclick="openServiceDetailModal('${service.code}')"><i class="fas fa-eye mr-2"></i>Xem chi tiết</button>
            <button class="w-full flex items-center px-4 py-2 text-sm text-green-700 hover:bg-gray-100"><i class="fas fa-edit mr-2"></i>Chỉnh sửa</button>
            <button class="w-full flex items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100"><i class="fas fa-trash mr-2"></i>Ngừng áp dụng</button>
          </div>
        </div>
      </td>
      <td class="font-medium text-gray-900">${service.code}</td>
      <td class="font-medium text-gray-900 cursor-pointer hover:underline" onclick="openServiceDetailModal('${service.code}')">${service.name}</td>
      <td>${group ? group.name : ''}</td>
      <td><span class="badge bg-info">${service.scope === 'global' ? 'Toàn hệ thống' : service.scope === 'unit_manager' ? 'Đơn vị quản lý' : 'Đơn vị cơ sở'}</span></td>
      <td>${service.unit}</td>
      <td class="font-semibold">${price ? formatCurrency(price) : '-'}</td>
      <td>${service.is_mandatory ? '<span class="badge bg-success">Có</span>' : '<span class="badge bg-secondary">Không</span>'}</td>
      <td><span class="status-tag ${service.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">${service.is_active ? 'Đang áp dụng' : 'Ngừng áp dụng'}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderServiceCards(services, serviceGroups, servicePrices, unitServicePrices, unitId, managerUnitId) {
  const cardList = document.querySelector('.service-card-list');
  if (!cardList) return;
  cardList.innerHTML = '';
  services.forEach(service => {
    const group = serviceGroups.find(g => g.id === service.group_id);
    const price = getCurrentServicePrice(service, unitId, managerUnitId, servicePrices, unitServicePrices);
    const card = document.createElement('div');
    card.className = 'card mb-2';
    card.innerHTML = `
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <div class="fw-bold">${service.name}</div>
            <div class="text-muted small">Mã: ${service.code} | Nhóm: ${group ? group.name : ''}</div>
            <div class="small">Giá: <b>${price ? formatCurrency(price) : '-'}</b> | Đơn vị: ${service.unit}</div>
            <div>
              <span class="badge bg-info">${service.scope === 'global' ? 'Toàn hệ thống' : service.scope === 'unit_manager' ? 'Đơn vị quản lý' : 'Đơn vị cơ sở'}</span>
              ${service.is_mandatory ? '<span class="badge bg-success">Bắt buộc</span>' : ''}
              <span class="badge ${service.is_active ? 'bg-success' : 'bg-warning'}">${service.is_active ? 'Đang áp dụng' : 'Ngừng áp dụng'}</span>
            </div>
          </div>
          <div>
            <button class="btn btn-sm btn-light" data-bs-toggle="dropdown">⋮</button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#" onclick="openServiceDetailModal('${service.code}')">Xem chi tiết</a></li>
              <li><a class="dropdown-item" href="#">Sửa</a></li>
              <li><a class="dropdown-item" href="#">Ngừng áp dụng</a></li>
            </ul>
          </div>
        </div>
      </div>
    `;
    cardList.appendChild(card);
  });
}

// Service detail modal functions are now handled in the new implementation below

// ==== DỮ LIỆU MẪU CHO MÀN HÌNH DỊCH VỤ ====
window.servicesData = [
  { id: 1, code: 'DV001', name: 'Thu gom rác thải sinh hoạt', group_id: 1, scope: 'global', unit: 'm3', is_mandatory: true, is_active: true, description: 'Thu gom rác thải sinh hoạt hàng ngày' },
  { id: 2, code: 'DV002', name: 'Thu gom rác thải công nghiệp', group_id: 2, scope: 'unit_manager', unit: 'tấn', is_mandatory: false, is_active: true, description: 'Thu gom rác thải công nghiệp theo lịch' },
  { id: 3, code: 'DV003', name: 'Thu gom rác thải nguy hại', group_id: 3, scope: 'unit', unit: 'kg', is_mandatory: false, is_active: false, description: 'Thu gom rác thải nguy hại theo yêu cầu' }
];
window.serviceGroupsData = [
  { id: 1, code: 'GRP1', name: 'Vệ sinh' },
  { id: 2, code: 'GRP2', name: 'Công nghiệp' },
  { id: 3, code: 'GRP3', name: 'Nguy hại' }
];
window.servicePricesData = [
  { id: 1, service_id: 1, price: 35000, start_date: '2024-01-01', end_date: null, manager_unit_id: null, note: 'Giá toàn hệ thống' },
  { id: 2, service_id: 2, price: 500000, start_date: '2024-01-01', end_date: null, manager_unit_id: 10, note: 'Giá theo đơn vị quản lý' },
  { id: 3, service_id: 3, price: 1000000, start_date: '2024-01-01', end_date: null, manager_unit_id: null, note: 'Giá toàn hệ thống' }
];
window.unitServicePricesData = [
  { id: 1, unit_id: 100, service_id: 3, price: 1200000, start_date: '2024-03-01', end_date: null, note: 'Giá riêng tại đơn vị cơ sở' }
];
window.unitsData = [
  { id: 100, code: 'CS001', name: 'Đơn vị cơ sở A', type: 'base', status: true },
  { id: 101, code: 'CS002', name: 'Đơn vị cơ sở B', type: 'base', status: true },
  { id: 10, code: 'QL001', name: 'Đơn vị quản lý X', type: 'manager', status: true }
];
window.unitServicesData = [
  { id: 1, unit_id: 100, service_id: 1 },
  { id: 2, unit_id: 100, service_id: 2 },
  { id: 3, unit_id: 100, service_id: 3 },
  { id: 4, unit_id: 101, service_id: 1 }
];
window.currentUnitId = 100; // Đơn vị cơ sở đang đăng nhập
window.currentManagerUnitId = 10;

// Khi load trang dịch vụ, gọi các hàm render với dữ liệu mẫu
if (document.getElementById('serviceTableBody')) {
  renderServiceTable(window.servicesData, window.serviceGroupsData, window.servicePricesData, window.unitServicePricesData, window.currentUnitId, window.currentManagerUnitId);
}
if (document.querySelector('.service-card-list')) {
  renderServiceCards(window.servicesData, window.serviceGroupsData, window.servicePricesData, window.unitServicePricesData, window.currentUnitId, window.currentManagerUnitId);
}

// ... existing code ...
window.openServicePriceManagerModal = function(serviceCode) {
    document.getElementById('servicePriceManagerModal').classList.remove('hidden');
}
window.closeServicePriceManagerModal = function() {
    document.getElementById('servicePriceManagerModal').classList.add('hidden');
}
// ... existing code ...

// toggleBaseUnitField function is now handled in the new implementation below

// Service modal functions are now handled in the new implementation below

// ... existing code ...
// ====== PHÂN QUYỀN: MODAL LOGIC ======

function openRoleDetailModal(roleCode) {
    // Demo dữ liệu, thực tế lấy từ bảng hoặc API
    const roleData = {
        'ADMIN': {
            code: 'ADMIN', name: 'Quản trị hệ thống', unit: 'Grac Admin', desc: 'Toàn quyền hệ thống', status: 'Đang sử dụng'
        },
        'MANAGER': {
            code: 'MANAGER', name: 'Quản lý đơn vị', unit: 'Đơn vị quản lý', desc: 'Quản lý các đơn vị cơ sở', status: 'Đang sử dụng'
        },
        'BASE': {
            code: 'BASE', name: 'Đơn vị cơ sở', unit: 'Đơn vị cơ sở', desc: 'Quản lý hoạt động cơ sở', status: 'Đang sử dụng'
        }
    };
    const d = roleData[roleCode] || roleData['ADMIN'];
    document.getElementById('roleDetailCode').innerText = d.code;
    document.getElementById('roleDetailName').innerText = d.name;
    document.getElementById('roleDetailUnit').innerText = d.unit;
    document.getElementById('roleDetailDesc').innerText = d.desc;
    document.getElementById('roleDetailStatus').innerText = d.status;
    document.getElementById('roleDetailModal').classList.remove('hidden');
    lockBodyScroll();
}
function closeRoleDetailModal() {
    document.getElementById('roleDetailModal').classList.add('hidden');
    unlockBodyScroll();
}

function openPermissionModal(roleCode) {
    // Demo: cập nhật tên vai trò
    const roleNames = {
        'ADMIN': 'Quản trị hệ thống',
        'MANAGER': 'Quản lý đơn vị',
        'BASE': 'Đơn vị cơ sở'
    };
    document.getElementById('permissionRoleName').innerText = roleCode;
    // Reset form (demo)
    document.querySelectorAll('#permissionForm input[type=checkbox]').forEach(cb => cb.checked = false);
    document.getElementById('permissionModal').classList.remove('hidden');
    lockBodyScroll();
}
function closePermissionModal() {
    document.getElementById('permissionModal').classList.add('hidden');
    unlockBodyScroll();
}

// Lock body scroll when modal open
function lockBodyScroll() {
    scrollPosition = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
}
function unlockBodyScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollPosition);
}

// Xử lý submit form phân quyền (demo)
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('permissionForm');
    if(form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            // Lấy danh sách quyền đã chọn
            const checked = Array.from(form.querySelectorAll('input[name=perm]:checked')).map(cb => cb.value);
            alert('Đã lưu phân quyền: ' + checked.join(', '));
            closePermissionModal();
        };
    }
});

// ... existing code ...

// ====== PHÂN QUYỀN: MODAL USER CỦA VAI TRÒ ======
function openRoleUsersModal(roleCode) {
    // Dữ liệu mẫu
    const usersByRole = {
        'ADMIN': [
            { code: 'NV001', name: 'Nguyễn Văn A', unit: 'Grac Admin', status: 'Đang hoạt động' },
            { code: 'NV002', name: 'Trần Thị B', unit: 'Grac Admin', status: 'Đang hoạt động' }
        ],
        'MANAGER': [
            { code: 'NV003', name: 'Lê Văn C', unit: 'Đơn vị quản lý', status: 'Đang hoạt động' },
            { code: 'NV004', name: 'Phạm Thị D', unit: 'Đơn vị quản lý', status: 'Tạm nghỉ' },
            { code: 'NV005', name: 'Ngô Văn E', unit: 'Đơn vị quản lý', status: 'Đang hoạt động' },
            { code: 'NV006', name: 'Đỗ Thị F', unit: 'Đơn vị quản lý', status: 'Đang hoạt động' },
            { code: 'NV007', name: 'Bùi Văn G', unit: 'Đơn vị quản lý', status: 'Đang hoạt động' }
        ],
        'BASE': [
            { code: 'NV008', name: 'Nguyễn Văn H', unit: 'Đơn vị cơ sở', status: 'Đang hoạt động' },
            { code: 'NV009', name: 'Trần Thị I', unit: 'Đơn vị cơ sở', status: 'Đang hoạt động' },
            { code: 'NV010', name: 'Lê Văn K', unit: 'Đơn vị cơ sở', status: 'Tạm nghỉ' },
            { code: 'NV011', name: 'Phạm Thị L', unit: 'Đơn vị cơ sở', status: 'Đang hoạt động' },
            { code: 'NV012', name: 'Ngô Văn M', unit: 'Đơn vị cơ sở', status: 'Đang hoạt động' },
            { code: 'NV013', name: 'Đỗ Thị N', unit: 'Đơn vị cơ sở', status: 'Đang hoạt động' },
            { code: 'NV014', name: 'Bùi Văn O', unit: 'Đơn vị cơ sở', status: 'Đang hoạt động' },
            { code: 'NV015', name: 'Nguyễn Thị P', unit: 'Đơn vị cơ sở', status: 'Đang hoạt động' },
            { code: 'NV016', name: 'Trần Văn Q', unit: 'Đơn vị cơ sở', status: 'Đang hoạt động' },
            { code: 'NV017', name: 'Lê Thị R', unit: 'Đơn vị cơ sở', status: 'Đang hoạt động' }
        ]
    };
    document.getElementById('roleUsersRoleName').innerText = roleCode;
    const tbody = document.getElementById('roleUsersTableBody');
    tbody.innerHTML = '';
    (usersByRole[roleCode] || []).forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td class='px-4 py-2'>${u.code}</td><td class='px-4 py-2'>${u.name}</td><td class='px-4 py-2'>${u.unit}</td><td class='px-4 py-2'>${u.status}</td>`;
        tbody.appendChild(tr);
    });
    document.getElementById('roleUsersModal').classList.remove('hidden');
    lockBodyScroll();
}
function closeRoleUsersModal() {
    document.getElementById('roleUsersModal').classList.add('hidden');
    unlockBodyScroll();
}
// ... existing code ...

// ... existing code ...
// ====== NGƯỜI DÙNG: MODAL CHI TIẾT USER ======
function openUserDetailModal(username) {
    // Dữ liệu mẫu
    const userData = {
        'admin': {
            username: 'admin', name: 'Nguyễn Văn A', email: 'admin@grac.vn', phone: '090xxxx123', employee: 'NV001', unit: 'Grac Admin', role: 'ADMIN', status: 'Đang hoạt động'
        },
        'manager1': {
            username: 'manager1', name: 'Lê Văn C', email: 'manager1@grac.vn', phone: '091xxxx456', employee: 'NV003', unit: 'Đơn vị quản lý', role: 'MANAGER', status: 'Đang hoạt động'
        },
        'userbase1': {
            username: 'userbase1', name: 'Trần Thị I', email: 'userbase1@grac.vn', phone: '092xxxx789', employee: 'NV009', unit: 'Đơn vị cơ sở', role: 'BASE', status: 'Đang hoạt động'
        },
        'guest1': {
            username: 'guest1', name: 'Nguyễn Thị P', email: 'guest1@grac.vn', phone: '093xxxx111', employee: '-', unit: 'Đơn vị cơ sở', role: 'BASE', status: 'Đã khóa'
        }
    };
    const d = userData[username] || userData['admin'];
    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.innerText = value;
    };
    set('userDetailUsername', d.username);
    set('userDetailName', d.name);
    set('userDetailEmail', d.email);
    set('userDetailPhone', d.phone);
    set('userDetailEmployee', d.employee);
    set('userDetailUnit', d.unit);
    set('userDetailRole', d.role);
    set('userDetailStatus', d.status);
    const modal = document.getElementById('userDetailModal');
    if (modal) {
        modal.classList.remove('hidden');
        lockBodyScroll();
    }
}
function closeUserDetailModal() {
    document.getElementById('userDetailModal').classList.add('hidden');
    unlockBodyScroll();
}
// ... existing code ...

// ... existing code ...
// ====== KỲ THANH TOÁN: MODAL LỊCH SỬ GỬI THÔNG BÁO ======
function openNotificationHistoryModal(contractCode) {
    // Dữ liệu mẫu
    const notiHistory = {
        'HD001': [
            { time: '2025-05-01 08:00', channel: 'App', status: 'Thành công', read: 'Đã đọc' },
            { time: '2025-05-02 09:00', channel: 'SMS', status: 'Thành công', read: 'Chưa đọc' }
        ],
        'HD002': [
            { time: '2025-05-01 08:05', channel: 'SMS', status: 'Thành công', read: 'Chưa đọc' }
        ]
    };
    const tbody = document.getElementById('notificationHistoryTableBody');
    tbody.innerHTML = '';
    (notiHistory[contractCode] || []).forEach(n => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td class='px-4 py-2'>${n.time}</td><td class='px-4 py-2'>${n.channel}</td><td class='px-4 py-2'>${n.status}</td><td class='px-4 py-2'>${n.read}</td>`;
        tbody.appendChild(tr);
    });
    document.getElementById('notificationHistoryModal').classList.remove('hidden');
    lockBodyScroll();
}
function closeNotificationHistoryModal() {
    document.getElementById('notificationHistoryModal').classList.add('hidden');
    unlockBodyScroll();
}
// ... existing code ...

// ... existing code ...
// ====== LỊCH SỬ GỬI THÔNG BÁO: MODAL CHI TIẾT THÔNG BÁO ======
function openNotificationDetailModal(id) {
    // Dữ liệu mẫu
    const notiData = {
        1: {
            contract: 'HD001', customer: 'Nguyễn Văn An', period: 'T5/2025', channel: 'App', time: '2025-05-01 08:00', status: 'Thành công', read: 'Đã đọc', content: 'Thông báo kỳ thanh toán T5/2025: Số tiền 35.000 ₫, hạn nộp 15/05/2025. Vui lòng thanh toán đúng hạn để tránh bị gián đoạn dịch vụ.'
        },
        2: {
            contract: 'HD002', customer: 'Trần Thị Bích', period: 'T5/2025', channel: 'SMS', time: '2025-05-01 08:05', status: 'Thành công', read: 'Chưa đọc', content: 'Thông báo kỳ thanh toán T5/2025: Số tiền 35.000 ₫, hạn nộp 15/05/2025. Vui lòng thanh toán đúng hạn để tránh bị gián đoạn dịch vụ.'
        }
    };
    const d = notiData[id] || notiData[1];
    document.getElementById('notiDetailContract').innerText = d.contract;
    document.getElementById('notiDetailCustomer').innerText = d.customer;
    document.getElementById('notiDetailPeriod').innerText = d.period;
    document.getElementById('notiDetailChannel').innerText = d.channel;
    document.getElementById('notiDetailTime').innerText = d.time;
    document.getElementById('notiDetailStatus').innerText = d.status;
    document.getElementById('notiDetailRead').innerText = d.read;
    document.getElementById('notiDetailContent').innerText = d.content;
    document.getElementById('notificationDetailModal').classList.remove('hidden');
    lockBodyScroll();
}
function closeNotificationDetailModal() {
    document.getElementById('notificationDetailModal').classList.add('hidden');
    unlockBodyScroll();
}
// ... existing code ...

// ... existing code ...
// ====== VÍ TẠM GIỮ: MODAL CHI TIẾT VÍ ======
function openWalletDetailModal(id) {
    const data = {
        1: {
            customer: 'Nguyễn Văn An', balance: '120.000 ₫', totalIn: '500.000 ₫', totalOut: '380.000 ₫', status: 'Đang hoạt động', recent: ['2025-05-01: Nạp 100.000 ₫', '2025-05-02: Gạch nợ tự động kỳ T5/2025: 35.000 ₫']
        },
        2: {
            customer: 'Trần Thị Bích', balance: '0 ₫', totalIn: '200.000 ₫', totalOut: '200.000 ₫', status: 'Khóa', recent: ['2025-04-01: Nạp 200.000 ₫', '2025-04-15: Gạch nợ tự động kỳ T4/2025: 200.000 ₫']
        }
    };
    const d = data[id] || data[1];
    document.getElementById('walletDetailCustomer').innerText = d.customer;
    document.getElementById('walletDetailBalance').innerText = d.balance;
    document.getElementById('walletDetailTotalIn').innerText = d.totalIn;
    document.getElementById('walletDetailTotalOut').innerText = d.totalOut;
    document.getElementById('walletDetailStatus').innerText = d.status;
    const ul = document.getElementById('walletDetailRecentTx');
    ul.innerHTML = '';
    d.recent.forEach(tx => {
        const li = document.createElement('li');
        li.innerText = tx;
        ul.appendChild(li);
    });
    document.getElementById('walletDetailModal').classList.remove('hidden');
    lockBodyScroll();
}
function closeWalletDetailModal() {
    document.getElementById('walletDetailModal').classList.add('hidden');
    unlockBodyScroll();
}
// ====== LỊCH SỬ GIAO DỊCH VÍ: MODAL CHI TIẾT ======
function openWalletTxDetailModal(id) {
    const data = {
        1: {
            customer: 'Nguyễn Văn An', time: '2025-05-01 08:00', type: 'Nạp tiền', amount: '+100.000 ₫', balance: '120.000 ₫', cycle: '-', note: 'Nạp qua app'
        },
        2: {
            customer: 'Nguyễn Văn An', time: '2025-05-02 09:00', type: 'Gạch nợ tự động', amount: '-35.000 ₫', balance: '85.000 ₫', cycle: 'T5/2025', note: 'Gạch nợ kỳ thanh toán tự động'
        }
    };
    const d = data[id] || data[1];
    document.getElementById('walletTxDetailCustomer').innerText = d.customer;
    document.getElementById('walletTxDetailTime').innerText = d.time;
    document.getElementById('walletTxDetailType').innerText = d.type;
    document.getElementById('walletTxDetailAmount').innerText = d.amount;
    document.getElementById('walletTxDetailBalance').innerText = d.balance;
    document.getElementById('walletTxDetailCycle').innerText = d.cycle;
    document.getElementById('walletTxDetailNote').innerText = d.note;
    document.getElementById('walletTxDetailModal').classList.remove('hidden');
    lockBodyScroll();
}
function closeWalletTxDetailModal() {
    document.getElementById('walletTxDetailModal').classList.add('hidden');
    unlockBodyScroll();
}
// ... existing code ...

// ... existing code ...
// ====== LIÊN KẾT KHÁCH HÀNG/HỢP ĐỒNG (stub) ======
function openCustomerDetail(customerId) {
    alert('Xem chi tiết khách hàng: ' + customerId);
    // TODO: Mở modal hoặc chuyển trang chi tiết khách hàng
}
function openPaymentCycleDetailModal(contractCode) {
    alert('Xem chi tiết kỳ thanh toán/hợp đồng: ' + contractCode);
    // TODO: Mở modal hoặc chuyển trang chi tiết kỳ thanh toán
}
// ... existing code ...

// ... existing code ...
// ==== Đơn vị Cơ sở: Navigation & Actions ====
function openBaseUnitDetail(unitId) {
    // Có thể điều hướng hoặc mở modal chi tiết đơn vị cơ sở
    // Ở đây demo: điều hướng sang trang chi tiết đơn vị cơ sở
    if (typeof WebAdmin !== 'undefined' && typeof WebAdmin.loadContent === 'function') {
        WebAdmin.loadContent('base-unit-detail-content');
        updateBreadcrumb('Chi tiết Đơn vị Cơ sở');
    } else {
        alert('Chức năng xem chi tiết đơn vị cơ sở chưa sẵn sàng!');
    }
}

function editBaseUnit(unitId) {
    // Có thể mở modal chỉnh sửa hoặc alert demo
    alert('Chức năng sửa thông tin Đơn vị Cơ sở sẽ được phát triển sau! (ID: ' + unitId + ')');
}

// Export global
window.openBaseUnitDetail = openBaseUnitDetail;
window.editBaseUnit = editBaseUnit;
// ... existing code ...

// Employee Management Functions

// Hàm mở modal chi tiết nhân viên
function openEmployeeDetail(employeeId) {
    const employee = employeesData[employeeId];
    
    if (employee) {
        const statusClass = employee.status === 'Đang làm việc' ? 'bg-green-100 text-green-800' : 
                           employee.status === 'Tạm nghỉ' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
        
        document.getElementById('employeeDetailContent').innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div class="mb-3">
                    <span class="text-gray-500 font-medium">Mã nhân viên:</span>
                    <span class="font-semibold text-blue-700 ml-2">${employee.id}</span>
                </div>
                <div class="mb-3">
                    <span class="text-gray-500 font-medium">Họ tên:</span>
                    <span class="font-semibold text-gray-800 ml-2">${employee.name}</span>
                </div>
                <div class="mb-3">
                    <span class="text-gray-500 font-medium">Email:</span>
                    <span class="text-gray-700 ml-2">${employee.email}</span>
                </div>
                <div class="mb-3">
                    <span class="text-gray-500 font-medium">Số điện thoại:</span>
                    <span class="text-gray-700 ml-2">${employee.phone}</span>
                </div>
                <div class="mb-3">
                    <span class="text-gray-500 font-medium">Phòng ban:</span>
                    <span class="text-gray-700 ml-2">${employee.department}</span>
                </div>
                <div class="mb-3">
                    <span class="text-gray-500 font-medium">Chức vụ:</span>
                    <span class="text-gray-700 ml-2">${employee.position}</span>
                </div>
                <div class="mb-3">
                    <span class="text-gray-500 font-medium">Ngày vào làm:</span>
                    <span class="text-gray-700 ml-2">${employee.hireDate}</span>
                </div>
                <div class="mb-3">
                    <span class="text-gray-500 font-medium">Vai trò:</span>
                    <span class="font-semibold text-green-700 ml-2">${employee.role}</span>
                </div>
                <div class="mb-3">
                    <span class="text-gray-500 font-medium">Trạng thái:</span>
                    <span class="status-tag ${statusClass} ml-2">${employee.status}</span>
                </div>
                <div class="mb-3 md:col-span-2">
                    <span class="text-gray-500 font-medium">Địa chỉ:</span>
                    <span class="text-gray-700 ml-2">${employee.address}</span>
                </div>
                <div class="mb-3">
                    <span class="text-gray-500 font-medium">CMND/CCCD:</span>
                    <span class="text-gray-700 ml-2">${employee.idCard}</span>
                </div>
                <div class="mb-3">
                    <span class="text-gray-500 font-medium">Lương cơ bản:</span>
                    <span class="font-semibold text-green-700 ml-2">${employee.salary}</span>
                </div>
                <div class="mb-3">
                    <span class="text-gray-500 font-medium">Quản lý trực tiếp:</span>
                    <span class="text-blue-700 underline cursor-pointer hover:text-blue-900 transition ml-2">${employee.manager}</span>
                </div>
                <div class="mb-3 md:col-span-2">
                    <span class="text-gray-500 font-medium">Liên hệ khẩn cấp:</span>
                    <span class="text-gray-700 ml-2">${employee.emergencyContact}</span>
                </div>
            </div>
        `;
        
        document.getElementById('employeeDetailModal').classList.remove('hidden');
        lockBodyScroll();
    }
}

// Hàm đóng modal
function closeEmployeeDetailModal() {
    document.getElementById('employeeDetailModal').classList.add('hidden');
    unlockBodyScroll();
}

// Hàm chỉnh sửa nhân viên
function editEmployee(employeeId) {
    // TODO: Implement edit functionality
    console.log('Edit employee:', employeeId);
    showNotification('info', 'Thông báo', 'Chức năng chỉnh sửa nhân viên sẽ được phát triển sau');
}

// Hàm xóa nhân viên
function deleteEmployee(employeeId) {
    // TODO: Implement delete functionality
    console.log('Delete employee:', employeeId);
    confirmAction('Bạn có chắc chắn muốn xóa nhân viên này?', function() {
        showNotification('info', 'Thông báo', 'Chức năng xóa nhân viên sẽ được phát triển sau');
    });
}

// Hàm khởi tạo events cho employee modal
function initializeEmployeeModalEvents() {
    // Đóng modal khi click bên ngoài
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('employeeDetailModal');
        if (event.target === modal) {
            closeEmployeeDetailModal();
        }
    });

    // Đóng modal khi click vào overlay
    const modalOverlay = document.querySelector('#employeeDetailModal .modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function() {
            closeEmployeeDetailModal();
        });
    }

    // Đóng modal khi nhấn ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeEmployeeDetailModal();
        }
    });

    // Initialize add employee form
    initializeAddEmployeeForm();
}

// Hàm mở modal thêm nhân viên
function openAddEmployeeModal() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('employeeHireDate').value = today;
    
    document.getElementById('addEmployeeModal').classList.remove('hidden');
    lockBodyScroll();
}

// Hàm đóng modal thêm nhân viên
function closeAddEmployeeModal() {
    document.getElementById('addEmployeeModal').classList.add('hidden');
    document.getElementById('addEmployeeForm').reset();
    unlockBodyScroll();
}

// Hàm khởi tạo form thêm nhân viên
function initializeAddEmployeeForm() {
    const form = document.getElementById('addEmployeeForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAddEmployee();
        });
    }
}

// Hàm xử lý thêm nhân viên
function handleAddEmployee() {
    const formData = new FormData(document.getElementById('addEmployeeForm'));
    const employeeData = Object.fromEntries(formData.entries());
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'idCard', 'department', 'position', 'hireDate', 'role'];
    const missingFields = requiredFields.filter(field => !employeeData[field]);
    
    if (missingFields.length > 0) {
        showNotification('error', 'Lỗi', 'Vui lòng điền đầy đủ các trường bắt buộc');
        return;
    }
    
    // Generate employee ID
    const newId = generateEmployeeId();
    
    // Create new employee object
    const newEmployee = {
        id: newId,
        name: employeeData.name,
        email: employeeData.email,
        phone: employeeData.phone,
        department: employeeData.department,
        position: employeeData.position,
        hireDate: formatDateForDisplay(employeeData.hireDate),
        role: employeeData.role,
        status: 'Đang làm việc',
        address: employeeData.address || '',
        idCard: employeeData.idCard,
        salary: employeeData.salary || '',
        manager: employeeData.manager || '',
        emergencyContact: employeeData.emergencyContact || ''
    };
    
    // Add to employees data
    employeesData[newId] = newEmployee;
    
    // Show success message
    showNotification('success', 'Thành công', `Đã thêm nhân viên ${newEmployee.name} thành công!`);
    
    // Close modal
    closeAddEmployeeModal();
    
    // TODO: Refresh employee list or add to table
    console.log('New employee added:', newEmployee);
}

// Hàm tạo mã nhân viên mới
function generateEmployeeId() {
    const existingIds = Object.keys(employeesData);
    const numbers = existingIds.map(id => parseInt(id.replace('NV', '')));
    const maxNumber = Math.max(...numbers, 0);
    const nextNumber = maxNumber + 1;
    return `NV${nextNumber.toString().padStart(3, '0')}`;
}

// Hàm format date cho hiển thị
function formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Customer Management Functions
// Dữ liệu mẫu khách hàng (trong thực tế sẽ lấy từ API)
const customersData = {
    'KH001': {
        id: 'KH001',
        name: 'Nguyễn Văn An',
        type: 'individual',
        phone: '090xxxx123',
        email: 'nguyenvana@email.com',
        address: '123 Lê Lợi, P. Bến Nghé, TP. Hồ Chí Minh',
        collectionUnit: 'ĐV Thu gom A',
        area: 'Quận 1',
        status: 'active',
        registrationDate: '01/01/2024',
        contactPerson: '',
        contactPhone: '',
        notes: ''
    },
    'KH002': {
        id: 'KH002',
        name: 'Trần Thị Bích',
        type: 'individual',
        phone: '091xxxx456',
        email: 'tranthib@email.com',
        address: '456 Nguyễn Huệ, P. Bến Nghé, TP. Hồ Chí Minh',
        collectionUnit: 'ĐV Thu gom A',
        area: 'Quận 1',
        status: 'active',
        registrationDate: '15/03/2024',
        contactPerson: '',
        contactPhone: '',
        notes: ''
    }
};

// Hàm mở modal thêm khách hàng
function openAddCustomerModal() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('customerRegistrationDate').value = today;
    
    document.getElementById('addCustomerModal').classList.remove('hidden');
    lockBodyScroll();
}

// Hàm đóng modal thêm khách hàng
function closeAddCustomerModal() {
    document.getElementById('addCustomerModal').classList.add('hidden');
    document.getElementById('addCustomerForm').reset();
    document.getElementById('taxCodeGroup').style.display = 'none';
    unlockBodyScroll();
}

// Hàm toggle fields dựa trên loại khách hàng
function toggleCustomerTypeFields() {
    const customerType = document.getElementById('customerType').value;
    const taxCodeGroup = document.getElementById('taxCodeGroup');
    
    if (customerType === 'organization') {
        taxCodeGroup.style.display = 'block';
    } else {
        taxCodeGroup.style.display = 'none';
        document.getElementById('customerTaxCode').value = '';
    }
}

// Hàm khởi tạo form thêm khách hàng
function initializeAddCustomerForm() {
    const form = document.getElementById('addCustomerForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAddCustomer();
        });
    }
    
    // Load address data after a short delay to ensure DOM is ready
    setTimeout(() => {
        loadAddressData();
    }, 100);
}

// Hàm xử lý thêm khách hàng
function handleAddCustomer() {
    const formData = new FormData(document.getElementById('addCustomerForm'));
    const customerData = Object.fromEntries(formData.entries());
    
    // Validate required fields
    const requiredFields = ['type', 'name', 'phone', 'address', 'collectionUnit', 'status', 'registrationDate'];
    const missingFields = requiredFields.filter(field => !customerData[field]);
    
    if (missingFields.length > 0) {
        showNotification('error', 'Lỗi', 'Vui lòng điền đầy đủ các trường bắt buộc');
        return;
    }
    
    // Generate customer ID
    const newId = generateCustomerId();
    
    // Create new customer object
    const newCustomer = {
        id: newId,
        name: customerData.name,
        type: customerData.type,
        phone: customerData.phone,
        email: customerData.email || '',
        address: customerData.address,
        collectionUnit: customerData.collectionUnit,
        area: customerData.area || '',
        status: customerData.status,
        registrationDate: formatDateForDisplay(customerData.registrationDate),
        taxCode: customerData.taxCode || '',
        contactPerson: customerData.contactPerson || '',
        contactPhone: customerData.contactPhone || '',
        notes: customerData.notes || ''
    };
    
    // Add to customers data
    customersData[newId] = newCustomer;
    
    // Show success message
    showNotification('success', 'Thành công', `Đã thêm khách hàng ${newCustomer.name} thành công!`);
    
    // Close modal
    closeAddCustomerModal();
    
    // TODO: Refresh customer list or add to table
    console.log('New customer added:', newCustomer);
}

// Hàm tạo mã khách hàng mới
function generateCustomerId() {
    const existingIds = Object.keys(customersData);
    const numbers = existingIds.map(id => parseInt(id.replace('KH', '')));
    const maxNumber = Math.max(...numbers, 0);
    const nextNumber = maxNumber + 1;
    return `KH${nextNumber.toString().padStart(3, '0')}`;
}

// Export employee functions to global scope
window.openEmployeeDetail = openEmployeeDetail;
window.closeEmployeeDetailModal = closeEmployeeDetailModal;
window.editEmployee = editEmployee;
window.deleteEmployee = deleteEmployee;
window.openAddEmployeeModal = openAddEmployeeModal;
window.closeAddEmployeeModal = closeAddEmployeeModal;

// Address Management Functions

// Export customer functions to global scope
window.openAddCustomerModal = openAddCustomerModal;
window.closeAddCustomerModal = closeAddCustomerModal;
window.toggleCustomerTypeFields = toggleCustomerTypeFields;

// Hàm load dữ liệu địa chỉ từ file JSON
async function loadAddressData() {
    try {
        const response = await fetch('data/address-data.json');
        addressData = await response.json();
        loadProvinces();
    } catch (error) {
        console.error('Error loading address data:', error);
        // Fallback: load provinces manually
        loadProvincesFallback();
    }
}

// Hàm load danh sách tỉnh/thành phố
function loadProvinces() {
    if (!addressData) return;
    
    const provinceSelect = document.getElementById('customerProvince');
    if (!provinceSelect) return;
    
    // Clear existing options
    provinceSelect.innerHTML = '<option value="">Chọn Tỉnh/Thành phố</option>';
    
    // Add provinces from data
    addressData.forEach(province => {
        const option = document.createElement('option');
        option.value = province.province_code;
        option.textContent = province.name;
        provinceSelect.appendChild(option);
    });
}

// Fallback function nếu không load được file JSON
function loadProvincesFallback() {
    const provinceSelect = document.getElementById('customerProvince');
    if (!provinceSelect) return;
    
    const provinces = [
        { code: '01', name: 'Thành phố Hà Nội' },
        { code: '79', name: 'Thành phố Hồ Chí Minh' },
        { code: '48', name: 'Thành phố Đà Nẵng' },
        { code: '92', name: 'Thành phố Cần Thơ' },
        { code: '95', name: 'Tỉnh Bạc Liêu' },
        { code: '27', name: 'Tỉnh Bắc Ninh' },
        { code: '24', name: 'Tỉnh Bắc Giang' },
        { code: '06', name: 'Tỉnh Bắc Kạn' },
        { code: '83', name: 'Tỉnh Bến Tre' },
        { code: '52', name: 'Tỉnh Bình Định' },
        { code: '74', name: 'Tỉnh Bình Dương' },
        { code: '70', name: 'Tỉnh Bình Phước' },
        { code: '60', name: 'Tỉnh Bình Thuận' },
        { code: '96', name: 'Tỉnh Cà Mau' },
        { code: '04', name: 'Tỉnh Cao Bằng' },
        { code: '66', name: 'Tỉnh Đắk Lắk' },
        { code: '67', name: 'Tỉnh Đắk Nông' },
        { code: '11', name: 'Tỉnh Điện Biên' },
        { code: '75', name: 'Tỉnh Đồng Nai' },
        { code: '87', name: 'Tỉnh Đồng Tháp' },
        { code: '64', name: 'Tỉnh Gia Lai' },
        { code: '02', name: 'Tỉnh Hà Giang' },
        { code: '35', name: 'Tỉnh Hà Nam' },
        { code: '42', name: 'Tỉnh Hà Tĩnh' },
        { code: '30', name: 'Tỉnh Hải Dương' },
        { code: '31', name: 'Thành phố Hải Phòng' },
        { code: '93', name: 'Tỉnh Hậu Giang' },
        { code: '17', name: 'Tỉnh Hoà Bình' },
        { code: '33', name: 'Tỉnh Hưng Yên' },
        { code: '56', name: 'Tỉnh Khánh Hoà' },
        { code: '91', name: 'Tỉnh Kiên Giang' },
        { code: '62', name: 'Tỉnh Kon Tum' },
        { code: '12', name: 'Tỉnh Lai Châu' },
        { code: '68', name: 'Tỉnh Lâm Đồng' },
        { code: '20', name: 'Tỉnh Lạng Sơn' },
        { code: '10', name: 'Tỉnh Lào Cai' },
        { code: '80', name: 'Tỉnh Long An' },
        { code: '36', name: 'Tỉnh Nam Định' },
        { code: '40', name: 'Tỉnh Nghệ An' },
        { code: '37', name: 'Tỉnh Ninh Bình' },
        { code: '58', name: 'Tỉnh Ninh Thuận' },
        { code: '25', name: 'Tỉnh Phú Thọ' },
        { code: '54', name: 'Tỉnh Phú Yên' },
        { code: '44', name: 'Tỉnh Quảng Bình' },
        { code: '49', name: 'Tỉnh Quảng Nam' },
        { code: '51', name: 'Tỉnh Quảng Ngãi' },
        { code: '22', name: 'Tỉnh Quảng Ninh' },
        { code: '45', name: 'Tỉnh Quảng Trị' },
        { code: '94', name: 'Tỉnh Sóc Trăng' },
        { code: '14', name: 'Tỉnh Sơn La' },
        { code: '72', name: 'Tỉnh Tây Ninh' },
        { code: '34', name: 'Tỉnh Thái Bình' },
        { code: '19', name: 'Tỉnh Thái Nguyên' },
        { code: '38', name: 'Tỉnh Thanh Hoá' },
        { code: '46', name: 'Tỉnh Thừa Thiên Huế' },
        { code: '82', name: 'Tỉnh Tiền Giang' },
        { code: '84', name: 'Tỉnh Trà Vinh' },
        { code: '08', name: 'Tỉnh Tuyên Quang' },
        { code: '86', name: 'Tỉnh Vĩnh Long' },
        { code: '26', name: 'Tỉnh Vĩnh Phúc' },
        { code: '77', name: 'Tỉnh Bà Rịa - Vũng Tàu' },
        { code: '15', name: 'Tỉnh Yên Bái' }
    ];
    
    provinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province.code;
        option.textContent = province.name;
        provinceSelect.appendChild(option);
    });
}

// Hàm load danh sách phường/xã dựa trên tỉnh/thành phố được chọn
function loadWards() {
    const provinceSelect = document.getElementById('customerProvince');
    const wardSelect = document.getElementById('customerWard');
    
    if (!provinceSelect || !wardSelect) return;
    
    const selectedProvince = provinceSelect.value;
    
    // Reset ward select
    wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>';
    wardSelect.disabled = true;
    
    if (!selectedProvince) return;
    
    if (addressData) {
        // Load from JSON data
        const province = addressData.find(p => p.province_code === selectedProvince);
        if (province && province.wards) {
            province.wards.forEach(ward => {
                const option = document.createElement('option');
                option.value = ward.ward_code;
                option.textContent = ward.name;
                wardSelect.appendChild(option);
            });
            wardSelect.disabled = false;
        }
    } else {
        // Fallback: load sample wards for major cities
        const sampleWards = getSampleWards(selectedProvince);
        if (sampleWards) {
            sampleWards.forEach(ward => {
                const option = document.createElement('option');
                option.value = ward.code;
                option.textContent = ward.name;
                wardSelect.appendChild(option);
            });
            wardSelect.disabled = false;
        }
    }
}

// Hàm trả về danh sách phường/xã mẫu cho các thành phố lớn
function getSampleWards(provinceCode) {
    const wardsData = {
        '01': [ // Hà Nội
            { code: '00004', name: 'Phường Ba Đình' },
            { code: '00008', name: 'Phường Ngọc Hà' },
            { code: '00025', name: 'Phường Giảng Võ' },
            { code: '00070', name: 'Phường Hoàn Kiếm' },
            { code: '00082', name: 'Phường Cửa Nam' },
            { code: '00091', name: 'Phường Phú Thượng' },
            { code: '00097', name: 'Phường Hồng Hà' },
            { code: '00103', name: 'Phường Tây Hồ' },
            { code: '00118', name: 'Phường Bồ Đề' },
            { code: '00127', name: 'Phường Việt Hưng' }
        ],
        '79': [ // TP. Hồ Chí Minh
            { code: '76001', name: 'Phường Bến Nghé' },
            { code: '76002', name: 'Phường Bến Thành' },
            { code: '76003', name: 'Phường Cầu Kho' },
            { code: '76004', name: 'Phường Cầu Ông Lãnh' },
            { code: '76005', name: 'Phường Cô Giang' },
            { code: '76006', name: 'Phường Đa Kao' },
            { code: '76007', name: 'Phường Nguyễn Cư Trinh' },
            { code: '76008', name: 'Phường Nguyễn Thái Bình' },
            { code: '76009', name: 'Phường Phạm Ngũ Lão' },
            { code: '76010', name: 'Phường Tân Định' }
        ],
        '48': [ // Đà Nẵng
            { code: '49001', name: 'Phường An Hải Bắc' },
            { code: '49002', name: 'Phường An Hải Đông' },
            { code: '49003', name: 'Phường An Hải Tây' },
            { code: '49004', name: 'Phường Mân Thái' },
            { code: '49005', name: 'Phường Nại Hiên Đông' },
            { code: '49006', name: 'Phường Phước Mỹ' },
            { code: '49007', name: 'Phường Thọ Quang' }
        ]
    };
    
    return wardsData[provinceCode] || null;
}

// Export address functions to global scope
window.loadWards = loadWards;
window.loadAddressData = loadAddressData;

// ... existing code ...

// ====== Payment Collection Modal Logic ======
function openCollectPaymentModal(customer = null) {
    // Nếu truyền customer thì điền thông tin, không thì để mặc định
    document.getElementById('paymentCustomerId').value = customer?.id || '';
    document.getElementById('paymentCustomerName').value = customer?.name || '';
    document.getElementById('paymentAmount').value = '';
    document.getElementById('paymentMethod').value = '';
    document.getElementById('paymentNote').value = '';
    document.getElementById('paymentCollector').value = 'Nguyễn Thị B'; // TODO: lấy từ user đăng nhập
    // Set ngày thu mặc định là hôm nay
    document.getElementById('paymentDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('collectPaymentModal').classList.remove('hidden');
    lockBodyScroll();
}

function closeCollectPaymentModal() {
    document.getElementById('collectPaymentModal').classList.add('hidden');
    document.getElementById('collectPaymentForm').reset();
    unlockBodyScroll();
}

function initializeCollectPaymentModal() {
    document.querySelectorAll('.collect-payment-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (btn.classList.contains('payment-credit-card-btn')) {
                // Lấy thông tin khách hàng từ data attribute
                const customer = {
                    id: btn.getAttribute('data-customer-id') || '',
                    name: btn.getAttribute('data-customer-name') || ''
                };
                openCollectPaymentModal(customer);
            } else {
                openCollectPaymentModal();
            }
        });
    });
    // Xử lý submit form
    const form = document.getElementById('collectPaymentForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCollectPayment();
        });
    }
}

function handleCollectPayment() {
    const form = document.getElementById('collectPaymentForm');
    const data = Object.fromEntries(new FormData(form).entries());
    // Validate các trường bắt buộc
    if (!data.amount || !data.method || !data.date) {
        showNotification('error', 'Lỗi', 'Vui lòng nhập đầy đủ thông tin bắt buộc!');
        return;
    }
    // TODO: Gửi dữ liệu lên server hoặc cập nhật bảng
    showNotification('success', 'Thành công', 'Đã thu tiền khách hàng thành công!');
    closeCollectPaymentModal();
}

// Khởi tạo modal khi load trang payment-collection-content
if (window.location.pathname.includes('payment-collection-content')) {
    document.addEventListener('DOMContentLoaded', initializeCollectPaymentModal);
}

// Export global
window.openCollectPaymentModal = openCollectPaymentModal;
window.closeCollectPaymentModal = closeCollectPaymentModal;

// Alias cho hàm cũ để tránh lỗi
function initializeContractDetailTabs() {
    return initializeContractDetailTabsAndDropdown.apply(this, arguments);
}
window.initializeContractDetailTabs = initializeContractDetailTabs;

// Street management functions
function initializeStreetNamesPage() {
    // Initialize street names page functionality
    console.log('Initializing street names page...');
    
    // The buttons now use onclick attributes, so no need to add event listeners here
    // Just log that the page is initialized
    console.log('Street names page initialized successfully');
}

function openStreetModal(streetId = null) {
    console.log('openStreetModal called with streetId:', streetId);
    const modal = document.getElementById('streetModal');
    const title = document.getElementById('streetModalTitle');
    
    console.log('Modal element:', modal);
    console.log('Title element:', title);
    
    if (!modal) {
        console.error('Modal not found!');
        return;
    }
    
    if (streetId) {
        title.textContent = 'Chỉnh sửa Tên đường';
        // Load street data for editing
        loadStreetDataForEditing(streetId);
    } else {
        title.textContent = 'Thêm Tên đường mới';
        document.getElementById('streetForm').reset();
        // Reset wards selection
        document.getElementById('selectedWardsInModal').innerHTML = '';
        document.getElementById('noWardsSelected').style.display = 'block';
        document.getElementById('availableWardsInModal').innerHTML = '<option value="">Chọn phường/xã...</option>';
    }
    
    modal.classList.remove('hidden');
    console.log('Modal should be visible now');
}

function closeStreetModal() {
    document.getElementById('streetModal').classList.add('hidden');
}

function saveStreet() {
    // Validate form
    const form = document.getElementById('streetForm');
    const formData = new FormData(form);
    
    // Get form values
    const streetCode = formData.get('streetCode') || document.getElementById('streetCode').value;
    const streetName = formData.get('streetName') || document.getElementById('streetName').value;
    const streetType = formData.get('streetType') || document.getElementById('streetType').value;
    const province = formData.get('province') || document.getElementById('province').value;
    const status = formData.get('streetStatus') || document.getElementById('streetStatus').value;
    const note = formData.get('streetNote') || document.getElementById('streetNote').value;
    
    // Validation
    if (!streetCode.trim()) {
        showNotification('error', 'Lỗi', 'Vui lòng nhập mã đường!');
        document.getElementById('streetCode').focus();
        return;
    }
    
    if (!streetName.trim()) {
        showNotification('error', 'Lỗi', 'Vui lòng nhập tên đường!');
        document.getElementById('streetName').focus();
        return;
    }
    
    if (!streetType) {
        showNotification('error', 'Lỗi', 'Vui lòng chọn loại đường!');
        document.getElementById('streetType').focus();
        return;
    }
    
    if (!province) {
        showNotification('error', 'Lỗi', 'Vui lòng chọn tỉnh/thành phố!');
        document.getElementById('province').focus();
        return;
    }
    
    // Get selected wards
    const selectedWards = [];
    const selectedWardsElements = document.querySelectorAll('#selectedWardsInModal [data-ward-code]');
    selectedWardsElements.forEach(element => {
        selectedWards.push(element.getAttribute('data-ward-code'));
    });
    
    // Prepare street data
    const streetData = {
        code: streetCode.trim(),
        name: streetName.trim(),
        type: streetType,
        province: province,
        status: status,
        note: note.trim(),
        wards: selectedWards,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Check if it's edit mode or add mode
    const modalTitle = document.getElementById('streetModalTitle').textContent;
    const isEditMode = modalTitle.includes('Chỉnh sửa');
    
    if (isEditMode) {
        // Update existing street
        updateStreetData(streetData);
    } else {
        // Add new street
        addStreetData(streetData);
    }
}

function addStreetData(streetData) {
    // Validate duplicate street code
    const existingStreets = getStreetData();
    const isDuplicate = existingStreets.some(street => street.code === streetData.code);
    
    if (isDuplicate) {
        showNotification('error', 'Lỗi', 'Mã đường đã tồn tại! Vui lòng chọn mã khác.');
        document.getElementById('streetCode').focus();
        return;
    }
    
    // Add to storage (in real app, this would be API call)
    const streets = getStreetData();
    streets.push(streetData);
    localStorage.setItem('streetData', JSON.stringify(streets));
    
    // Show success message
    showNotification('success', 'Thành công', 'Đã thêm tên đường mới thành công!');
    
    // Close modal
    closeStreetModal();
    
    // Refresh the street list if on street page
    if (typeof refreshStreetList === 'function') {
        refreshStreetList();
    }
}

function updateStreetData(streetData) {
    // Update in storage (in real app, this would be API call)
    const streets = getStreetData();
    const index = streets.findIndex(street => street.code === streetData.code);
    
    if (index !== -1) {
        streets[index] = { ...streets[index], ...streetData };
        localStorage.setItem('streetData', JSON.stringify(streets));
        
        showNotification('success', 'Thành công', 'Đã cập nhật thông tin đường thành công!');
    } else {
        showNotification('error', 'Lỗi', 'Không tìm thấy đường để cập nhật!');
    }
    
    // Close modal
    closeStreetModal();
    
    // Refresh the street list if on street page
    if (typeof refreshStreetList === 'function') {
        refreshStreetList();
    }
}

function getStreetData() {
    const stored = localStorage.getItem('streetData');
    if (stored) {
        return JSON.parse(stored);
    }
    
    // Return demo data if no stored data
    return [
        {
            code: 'ST001',
            name: 'Nguyễn Huệ',
            type: 'main',
            province: '79',
            status: 'active',
            note: 'Đường chính trung tâm TP.HCM',
            wards: ['76001', '76002'],
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
        },
        {
            code: 'ST002',
            name: 'Hai Bà Trưng',
            type: 'main',
            province: '79',
            status: 'active',
            note: 'Đường chính Quận 1',
            wards: ['76001', '76002', '76003'],
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
        },
        {
            code: 'ST003',
            name: 'Lê Lợi',
            type: 'secondary',
            province: '79',
            status: 'active',
            note: 'Đường phụ Quận 1',
            wards: ['76001'],
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
        },
        {
            code: 'ST004',
            name: 'Đồng Khởi',
            type: 'alley',
            province: '79',
            status: 'inactive',
            note: 'Hẻm Quận 1',
            wards: ['76001'],
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
        }
    ];
}

function refreshStreetList() {
    // This function will be called to refresh the street list table
    // For now, just show a message that the list should be refreshed
    console.log('Street list should be refreshed');
    
    // In a real implementation, you would:
    // 1. Reload the street data
    // 2. Re-render the table
    // 3. Update any statistics
}

function openWardMappingModal(streetId, streetName) {
    document.getElementById('streetNameInModal').textContent = streetName;
    document.getElementById('wardMappingModal').classList.remove('hidden');
}

function closeWardMappingModal() {
    document.getElementById('wardMappingModal').classList.add('hidden');
}

function addWard() {
    const select = document.getElementById('availableWardsSelect');
    const selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption.value) {
        const selectedWardsList = document.getElementById('selectedWardsList');
        const wardDiv = document.createElement('div');
        wardDiv.className = 'flex items-center justify-between p-2 bg-white rounded border mb-2';
        wardDiv.innerHTML = `
            <span class="text-sm">${selectedOption.text}</span>
            <button class="text-red-600 hover:text-red-800" onclick="removeWard('${selectedOption.value}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        selectedWardsList.appendChild(wardDiv);
        select.value = '';
    }
}

function removeWard(wardId) {
    // Remove ward logic
    event.target.closest('div').remove();
}

function saveWardMapping() {
    // Save ward mapping logic
    alert('Đã lưu mapping phường/xã!');
    closeWardMappingModal();
}

// Street management helper functions
function loadStreetDataForEditing(streetId) {
    // Load street data from storage
    const streets = getStreetData();
    const data = streets.find(street => street.code === streetId);
    
    if (data) {
        document.getElementById('streetCode').value = data.code;
        document.getElementById('streetName').value = data.name;
        document.getElementById('streetType').value = data.type;
        document.getElementById('province').value = data.province;
        document.getElementById('streetStatus').value = data.status;
        document.getElementById('streetNote').value = data.note || '';
        
        // Load wards for the province
        loadWardsForStreet();
        
        // Load selected wards after a short delay to ensure wards are loaded
        setTimeout(() => {
            loadSelectedWards(data.wards || []);
        }, 100);
    } else {
        showNotification('error', 'Lỗi', 'Không tìm thấy thông tin đường!');
        closeStreetModal();
    }
}

function loadWardsForStreet() {
    const provinceSelect = document.getElementById('province');
    const wardSelect = document.getElementById('availableWardsInModal');
    
    if (!provinceSelect || !wardSelect) return;
    
    const selectedProvince = provinceSelect.value;
    
    // Reset ward select
    wardSelect.innerHTML = '<option value="">Chọn phường/xã...</option>';
    
    if (!selectedProvince) return;
    
    // Load sample wards for the selected province
    const sampleWards = getSampleWards(selectedProvince);
    if (sampleWards) {
        sampleWards.forEach(ward => {
            const option = document.createElement('option');
            option.value = ward.code;
            option.textContent = ward.name;
            wardSelect.appendChild(option);
        });
    }
}

function loadSelectedWards(wardCodes) {
    const selectedWardsContainer = document.getElementById('selectedWardsInModal');
    const noWardsMessage = document.getElementById('noWardsSelected');
    
    if (!selectedWardsContainer || !noWardsMessage) return;
    
    selectedWardsContainer.innerHTML = '';
    
    if (!wardCodes || wardCodes.length === 0) {
        noWardsMessage.style.display = 'block';
        return;
    }
    
    noWardsMessage.style.display = 'none';
    
    // Get all available wards for the current province
    const provinceSelect = document.getElementById('province');
    const selectedProvince = provinceSelect.value;
    const availableWards = getSampleWards(selectedProvince) || [];
    
    wardCodes.forEach(wardCode => {
        const ward = availableWards.find(w => w.code === wardCode);
        if (ward) {
            const wardDiv = document.createElement('div');
            wardDiv.className = 'flex items-center justify-between p-2 bg-white rounded border mb-2';
            wardDiv.innerHTML = `
                <span class="text-sm">${ward.name}</span>
                <button class="text-red-600 hover:text-red-800" onclick="removeWardFromStreet('${ward.code}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            selectedWardsContainer.appendChild(wardDiv);
        }
    });
}

function addWardToStreet() {
    const select = document.getElementById('availableWardsInModal');
    const selectedOption = select.options[select.selectedIndex];
    
    if (!selectedOption.value) {
        alert('Vui lòng chọn phường/xã để thêm!');
        return;
    }
    
    const selectedWardsContainer = document.getElementById('selectedWardsInModal');
    const noWardsMessage = document.getElementById('noWardsSelected');
    
    // Hide no wards message
    noWardsMessage.style.display = 'none';
    
    // Check if ward is already selected
    const existingWard = selectedWardsContainer.querySelector(`[data-ward-code="${selectedOption.value}"]`);
    if (existingWard) {
        alert('Phường/xã này đã được chọn!');
        return;
    }
    
    const wardDiv = document.createElement('div');
    wardDiv.className = 'flex items-center justify-between p-2 bg-white rounded border mb-2';
    wardDiv.setAttribute('data-ward-code', selectedOption.value);
    wardDiv.innerHTML = `
        <span class="text-sm">${selectedOption.text}</span>
        <button class="text-red-600 hover:text-red-800" onclick="removeWardFromStreet('${selectedOption.value}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    selectedWardsContainer.appendChild(wardDiv);
    
    // Reset select
    select.value = '';
}

function removeWardFromStreet(wardCode) {
    const wardElement = document.querySelector(`[data-ward-code="${wardCode}"]`);
    if (wardElement) {
        wardElement.remove();
        
        // Show no wards message if no wards are selected
        const selectedWardsContainer = document.getElementById('selectedWardsInModal');
        const noWardsMessage = document.getElementById('noWardsSelected');
        
        if (selectedWardsContainer.children.length === 0) {
            noWardsMessage.style.display = 'block';
        }
    }
}

// Export street functions to global scope
window.openStreetModal = openStreetModal;
window.closeStreetModal = closeStreetModal;
window.saveStreet = saveStreet;
window.openWardMappingModal = openWardMappingModal;
window.closeWardMappingModal = closeWardMappingModal;
window.addWard = addWard;
window.removeWard = removeWard;
window.saveWardMapping = saveWardMapping;
window.loadWardsForStreet = loadWardsForStreet;
window.addWardToStreet = addWardToStreet;
window.removeWardFromStreet = removeWardFromStreet;
window.getStreetData = getStreetData;
window.refreshStreetList = refreshStreetList;

function openStreetDetailModal(streetId) {
    const modal = document.getElementById('streetDetailModal');
    if (!modal) return;
    const streets = getStreetData();
    const data = streets.find(street => street.code === streetId);
    if (!data) {
        showNotification('error', 'Lỗi', 'Không tìm thấy thông tin đường!');
        return;
    }
    // Thông tin cơ bản
    document.getElementById('detailStreetCode').textContent = data.code;
    document.getElementById('detailStreetName').textContent = data.name;
    document.getElementById('detailStreetType').textContent = getStreetTypeLabel(data.type);
    document.getElementById('detailProvince').textContent = getProvinceName(data.province);
    document.getElementById('detailStatus').textContent = data.status === 'active' ? 'Hoạt động' : 'Tạm ngưng';
    document.getElementById('detailStatus').className = 'font-semibold ' + (data.status === 'active' ? 'text-green-700' : 'text-yellow-700');
    document.getElementById('detailWardCount').textContent = data.wards ? data.wards.length : 0;
    // Danh sách phường/xã
    const wardsList = document.getElementById('detailWardsList');
    const noWards = document.getElementById('noDetailWards');
    wardsList.innerHTML = '';
    if (data.wards && data.wards.length > 0) {
        noWards.style.display = 'none';
        const provinceWards = getSampleWards(data.province) || [];
        data.wards.forEach(code => {
            const ward = provinceWards.find(w => w.code === code);
            if (ward) {
                const div = document.createElement('div');
                div.className = 'p-2 bg-white rounded border';
                div.textContent = ward.name;
                wardsList.appendChild(div);
            }
        });
    } else {
        noWards.style.display = 'block';
    }
    // Ghi chú
    const note = document.getElementById('detailNote');
    const noNote = document.getElementById('noDetailNote');
    if (data.note && data.note.trim()) {
        note.textContent = data.note;
        note.style.display = 'block';
        noNote.style.display = 'none';
    } else {
        note.textContent = '';
        note.style.display = 'none';
        noNote.style.display = 'block';
    }
    // Thông tin hệ thống
    document.getElementById('detailCreatedAt').textContent = formatDateTime(data.createdAt);
    document.getElementById('detailUpdatedAt').textContent = formatDateTime(data.updatedAt);
    // Hiện modal
    modal.classList.remove('hidden');
}

function closeStreetDetailModal() {
    const modal = document.getElementById('streetDetailModal');
    if (modal) modal.classList.add('hidden');
}

function editFromDetail() {
    // Lấy mã đường đang xem chi tiết
    const code = document.getElementById('detailStreetCode').textContent;
    closeStreetDetailModal();
    setTimeout(() => openStreetModal(code), 200);
}

function getStreetTypeLabel(type) {
    switch(type) {
        case 'main': return 'Đường chính';
        case 'secondary': return 'Đường phụ';
        case 'alley': return 'Hẻm';
        case 'highway': return 'Đường cao tốc';
        default: return '';
    }
}

function getProvinceName(code) {
    switch(code) {
        case '79': return 'TP. Hồ Chí Minh';
        case '01': return 'Hà Nội';
        case '48': return 'Đà Nẵng';
        default: return code;
    }
}

// Đưa các hàm ra global scope
window.openStreetDetailModal = openStreetDetailModal;
window.closeStreetDetailModal = closeStreetDetailModal;
window.editFromDetail = editFromDetail;

// ===== SERVICE MANAGEMENT FUNCTIONS =====

// Test function for price structure
function testPriceStructure() {
    const testData = {
        collection: 25000,
        transport: 20000,
        process: 15000,
        sort: 10000,
        recycle: 5000
    };
    console.log('Testing price structure with:', testData);
    
    // Check if modal is already open
    const modal = document.getElementById('serviceDetailModal');
    if (modal && !modal.classList.contains('hidden')) {
        // Modal is open, load price structure directly
        loadServicePriceStructure(testData);
    } else {
        // Modal is not open, open it first
        openServiceDetailModal('DV001');
        
        // Wait a bit for the modal to open and DOM to update
        setTimeout(() => {
            loadServicePriceStructure(testData);
        }, 200);
    }
}

// Alternative test function that doesn't require modal to be open
function testPriceStructureSimple() {
    const testData = {
        collection: 25000,
        transport: 20000,
        process: 15000,
        sort: 10000,
        recycle: 5000
    };
    
    console.log('Testing price structure (simple mode):', testData);
    
    // Create a temporary container for testing
    const tempContainer = document.createElement('div');
    tempContainer.id = 'tempPriceStructureGrid';
    tempContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg';
    tempContainer.innerHTML = '<h3 class="col-span-full text-lg font-semibold mb-4">Test Price Structure</h3>';
    
    // Add to page temporarily
    document.body.appendChild(tempContainer);
    
    // Simulate the price structure loading
    const priceComponents = [
        { key: 'collection', name: 'Thu gom', icon: 'fa-trash-alt', color: 'text-green-600' },
        { key: 'transport', name: 'Vận chuyển', icon: 'fa-truck', color: 'text-blue-600' },
        { key: 'process', name: 'Xử lý', icon: 'fa-cogs', color: 'text-purple-600' },
        { key: 'sort', name: 'Phân loại', icon: 'fa-sort', color: 'text-orange-600' },
        { key: 'recycle', name: 'Tái chế', icon: 'fa-recycle', color: 'text-teal-600' }
    ];
    
    let totalPrice = 0;
    priceComponents.forEach(component => {
        const price = testData[component.key] || 0;
        totalPrice += price;
        
        const isActive = price > 0;
        const priceColor = isActive ? component.color : 'text-gray-400';
        const bgClass = isActive ? 'bg-white' : 'bg-gray-100';
        
        const html = `
            <div class="flex items-center justify-between p-3 ${bgClass} rounded-lg border border-gray-200 ${isActive ? 'shadow-sm' : ''}">
                <div class="flex items-center">
                    <i class="fas ${component.icon} ${priceColor} mr-3"></i>
                    <span class="text-gray-700 font-medium">${component.name}</span>
                </div>
                <span class="font-semibold ${priceColor} text-lg">${price.toLocaleString()}</span>
            </div>
        `;
        tempContainer.innerHTML += html;
    });
    
    // Add total price
    tempContainer.innerHTML += `
        <div class="col-span-full mt-4 p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-white">
            <div class="text-center">
                <div class="text-sm opacity-90">Tổng giá</div>
                <div class="text-2xl font-bold">${totalPrice.toLocaleString()} VNĐ</div>
            </div>
        </div>
    `;
    
    console.log('Test price structure displayed in temporary container. Total:', totalPrice);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (tempContainer.parentNode) {
            tempContainer.parentNode.removeChild(tempContainer);
            console.log('Test container removed');
        }
    }, 5000);
}

// Service modal management
function openAddServiceModal() {
    document.getElementById('addServiceModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // Set default date to today
    const startDateField = document.getElementById('serviceStartDate');
    if (startDateField) {
        startDateField.value = new Date().toISOString().split('T')[0];
    }
    // Reset form
    resetAddServiceForm();
}

function closeAddServiceModal() {
    document.getElementById('addServiceModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function openServiceDetailModal(serviceId) {
    document.getElementById('serviceDetailModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    console.log('Opening service detail modal for:', serviceId);
    loadServiceDetail(serviceId);
}

function closeServiceDetailModal() {
    document.getElementById('serviceDetailModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function openServicePriceManagerModal(serviceId = null) {
    document.getElementById('servicePriceManagerModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (serviceId) {
        loadServicePriceData(serviceId);
    }
}

function closeServicePriceManagerModal() {
    document.getElementById('servicePriceManagerModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Service form management
function toggleBaseUnitField() {
    const scope = document.getElementById('addServiceScope');
    const baseUnitField = document.getElementById('addServiceBaseUnitField');
    const baseUnitSelect = document.getElementById('baseUnitSelect');
    
    if (!scope || !baseUnitField || !baseUnitSelect) return;
    
    if (scope.value === 'donvicoso') {
        baseUnitField.classList.remove('hidden');
        baseUnitSelect.required = true;
    } else {
        baseUnitField.classList.add('hidden');
        baseUnitSelect.required = false;
        baseUnitSelect.value = '';
    }
}

function resetAddServiceForm() {
    const form = document.getElementById('addServiceForm');
    const totalPriceElement = document.getElementById('totalPrice');
    const baseUnitField = document.getElementById('addServiceBaseUnitField');
    const baseUnitSelect = document.getElementById('baseUnitSelect');
    
    if (form) form.reset();
    if (totalPriceElement) totalPriceElement.textContent = '35.000';
    if (baseUnitField) baseUnitField.classList.add('hidden');
    if (baseUnitSelect) baseUnitSelect.required = false;
    
    // Reset price checkboxes and values
    const priceComponents = ['Collection', 'Transport', 'Process', 'Sort', 'Recycle'];
    priceComponents.forEach(component => {
        const checkbox = document.getElementById(`price${component}`);
        const input = document.getElementById(`price${component}Value`);
        if (checkbox && input) {
            if (component === 'Collection' || component === 'Transport' || component === 'Process') {
                checkbox.checked = true;
            } else {
                checkbox.checked = false;
            }
            // Set default values
            const defaults = { Collection: 15000, Transport: 12000, Process: 8000, Sort: 0, Recycle: 0 };
            input.value = defaults[component];
        }
    });
    calculateTotalPrice();
}

// Price calculation
function calculateTotalPrice() {
    const priceComponents = [
        { id: 'priceCollection', value: 'priceCollectionValue' },
        { id: 'priceTransport', value: 'priceTransportValue' },
        { id: 'priceProcess', value: 'priceProcessValue' },
        { id: 'priceSort', value: 'priceSortValue' },
        { id: 'priceRecycle', value: 'priceRecycleValue' }
    ];
    
    let total = 0;
    priceComponents.forEach(component => {
        const checkbox = document.getElementById(component.id);
        const input = document.getElementById(component.value);
        
        if (checkbox && input && checkbox.checked && input.value && !isNaN(input.value)) {
            total += parseInt(input.value);
        }
    });
    
    const totalElement = document.getElementById('totalPrice');
    if (totalElement) {
        totalElement.textContent = total.toLocaleString();
    }
    
    return total;
}

// Service submission
function submitAddService(event) {
    if (event) {
        event.preventDefault();
    }
    
    // Validate form
    if (!validateServiceForm()) {
        return false;
    }
    
    // Collect form data
    const serviceData = collectServiceFormData();
    
    // Show loading state
    const submitBtn = document.querySelector('#addServiceModal button[onclick="submitAddService()"]');
    if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Đang lưu...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Save to localStorage for demo
            saveServiceToStorage(serviceData);
            
            // Show success message
            showNotification('Dịch vụ đã được tạo thành công!', 'success');
            
            // Close modal and refresh
            closeAddServiceModal();
            refreshServiceList();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }
    
    return false;
}

function validateServiceForm() {
    const requiredFields = [
        'serviceName',
        'serviceGroup', 
        'serviceUnit',
        'addServiceScope',
        'serviceStartDate',
        'serviceMandatory',
        'serviceStatus'
    ];
    
    let isValid = true;
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            field.classList.add('border-red-500');
            isValid = false;
        } else if (field) {
            field.classList.remove('border-red-500');
        }
    });
    
    // Check base unit if scope is donvicoso
    const scope = document.getElementById('addServiceScope');
    if (scope && scope.value === 'donvicoso') {
        const baseUnit = document.getElementById('baseUnitSelect');
        if (baseUnit && !baseUnit.value) {
            baseUnit.classList.add('border-red-500');
            isValid = false;
        } else if (baseUnit) {
            baseUnit.classList.remove('border-red-500');
        }
    }
    
    // Check if at least one price component is selected
    const priceCheckboxes = ['priceCollection', 'priceTransport', 'priceProcess', 'priceSort', 'priceRecycle'];
    const hasSelectedPrice = priceCheckboxes.some(id => {
        const checkbox = document.getElementById(id);
        return checkbox && checkbox.checked;
    });
    
    if (!hasSelectedPrice) {
        showNotification('Vui lòng chọn ít nhất một thành phần giá!', 'error');
        isValid = false;
    }
    
    if (!isValid) {
        showNotification('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
    }
    
    return isValid;
}

function collectServiceFormData() {
    const totalPrice = calculateTotalPrice();
    
    return {
        id: generateServiceId(),
        name: document.getElementById('serviceName')?.value || '',
        group: document.getElementById('serviceGroup')?.value || '',
        unit: document.getElementById('serviceUnit')?.value || '',
        scope: document.getElementById('addServiceScope')?.value || '',
        baseUnit: document.getElementById('baseUnitSelect')?.value || '',
        startDate: document.getElementById('serviceStartDate')?.value || '',
        mandatory: document.getElementById('serviceMandatory')?.value || '',
        status: document.getElementById('serviceStatus')?.value || '',
        description: document.getElementById('serviceDescription')?.value || '',
        totalPrice: totalPrice,
        priceStructure: {
            collection: {
                enabled: document.getElementById('priceCollection')?.checked || false,
                value: parseInt(document.getElementById('priceCollectionValue')?.value) || 0
            },
            transport: {
                enabled: document.getElementById('priceTransport')?.checked || false,
                value: parseInt(document.getElementById('priceTransportValue')?.value) || 0
            },
            process: {
                enabled: document.getElementById('priceProcess')?.checked || false,
                value: parseInt(document.getElementById('priceProcessValue')?.value) || 0
            },
            sort: {
                enabled: document.getElementById('priceSort')?.checked || false,
                value: parseInt(document.getElementById('priceSortValue')?.value) || 0
            },
            recycle: {
                enabled: document.getElementById('priceRecycle')?.checked || false,
                value: parseInt(document.getElementById('priceRecycleValue')?.value) || 0
            }
        },
        createdAt: new Date().toISOString()
    };
}

// Data management
function generateServiceId() {
    const services = JSON.parse(localStorage.getItem('services') || '[]');
    const maxId = services.reduce((max, service) => {
        const idNum = parseInt(service.id.replace('DV', ''));
        return idNum > max ? idNum : max;
    }, 0);
    return `DV${String(maxId + 1).padStart(3, '0')}`;
}

function saveServiceToStorage(serviceData) {
    const services = JSON.parse(localStorage.getItem('services') || '[]');
    services.push(serviceData);
    localStorage.setItem('services', JSON.stringify(services));
}

function loadServiceDetail(serviceId) {
    // For demo, use mock data
    const mockData = {
        'DV001': {
            code: 'DV001',
            name: 'Thu gom rác thải sinh hoạt',
            group: 'Vệ sinh',
            scope: 'Toàn hệ thống',
            unit: 'm³',
            mandatory: 'Có',
            status: 'Đang áp dụng',
            description: 'Dịch vụ thu gom rác thải sinh hoạt hàng ngày',
            priceStructure: {
                collection: 15000,
                transport: 12000,
                process: 8000,
                sort: 0,
                recycle: 0
            }
        },
        'DV002': {
            code: 'DV002',
            name: 'Thu gom rác thải công nghiệp',
            group: 'Công nghiệp',
            scope: 'Đơn vị quản lý',
            unit: 'Tấn',
            mandatory: 'Không',
            status: 'Đang áp dụng',
            description: 'Dịch vụ thu gom rác thải công nghiệp theo định kỳ',
            priceStructure: {
                collection: 200000,
                transport: 180000,
                process: 120000,
                sort: 50000,
                recycle: 0
            }
        },
        'DV003': {
            code: 'DV003',
            name: 'Thu gom rác thải nguy hại',
            group: 'Nguy hại',
            scope: 'Đơn vị cơ sở: Cơ sở A',
            unit: 'kg',
            mandatory: 'Không',
            status: 'Ngừng áp dụng',
            description: 'Dịch vụ thu gom và xử lý rác thải nguy hại đặc biệt',
            priceStructure: {
                collection: 500000,
                transport: 400000,
                process: 300000,
                sort: 0,
                recycle: 0
            }
        }
    };
    
    const service = mockData[serviceId] || mockData['DV001'];
    
    // Populate detail modal
    const setDetail = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };
    
    setDetail('detailCode', service.code);
    setDetail('detailName', service.name);
    setDetail('detailGroup', service.group);
    setDetail('detailScope', service.scope);
    setDetail('detailUnit', service.unit);
    setDetail('detailMandatory', service.mandatory);
    setDetail('detailStatus', service.status);
    setDetail('detailDesc', service.description);
    
    // Load price structure
    loadServicePriceStructure(service.priceStructure);
    
    // Load price history
    loadServicePriceHistory(serviceId);
    
    // Load applied units
    loadServiceAppliedUnits(serviceId);
}

function loadServicePriceStructure(priceStructure) {
    const priceComponents = [
        {
            key: 'collection',
            name: 'Thu gom',
            icon: 'fa-trash-alt',
            color: 'text-green-600'
        },
        {
            key: 'transport',
            name: 'Vận chuyển',
            icon: 'fa-truck',
            color: 'text-blue-600'
        },
        {
            key: 'process',
            name: 'Xử lý',
            icon: 'fa-cogs',
            color: 'text-purple-600'
        },
        {
            key: 'sort',
            name: 'Phân loại',
            icon: 'fa-sort',
            color: 'text-orange-600'
        },
        {
            key: 'recycle',
            name: 'Tái chế',
            icon: 'fa-recycle',
            color: 'text-teal-600'
        }
    ];
    
    // Find the price structure container using ID
    const container = document.getElementById('servicePriceStructureGrid');
    if (!container) {
        console.error('Price structure container not found. Make sure the service detail modal is open.');
        console.log('Available elements with similar IDs:', document.querySelectorAll('[id*="price"]'));
        return;
    }
    
    console.log('Found price structure container:', container);
    
    // Clear existing content
    container.innerHTML = '';
    
    let totalPrice = 0;
    
    // Generate price structure HTML
    priceComponents.forEach(component => {
        const price = priceStructure[component.key] || 0;
        totalPrice += price;
        
        const isActive = price > 0;
        const priceColor = isActive ? component.color : 'text-gray-400';
        const bgClass = isActive ? 'bg-white' : 'bg-gray-100';
        
        const html = `
            <div class="flex items-center justify-between p-3 ${bgClass} rounded-lg border border-gray-200 ${isActive ? 'shadow-sm' : ''}">
                <div class="flex items-center">
                    <i class="fas ${component.icon} ${priceColor} mr-3"></i>
                    <span class="text-gray-700 font-medium">${component.name}</span>
                </div>
                <span class="font-semibold ${priceColor} text-lg">${price.toLocaleString()}</span>
            </div>
        `;
        container.innerHTML += html;
    });
    
    // Update total price using ID
    const totalElement = document.getElementById('serviceTotalPrice');
    if (totalElement) {
        totalElement.textContent = `${totalPrice.toLocaleString()} VNĐ`;
        console.log('Updated total price element:', totalElement.textContent);
    } else {
        console.warn('Total price element not found. Looking for element with ID "serviceTotalPrice"');
    }
    
    console.log('Price structure updated successfully:', priceStructure, 'Total:', totalPrice);
}

function loadServicePriceHistory(serviceId) {
    const tbody = document.getElementById('servicePriceHistoryBody');
    if (!tbody) return;
    
    tbody.innerHTML = `
        <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-3 py-2 text-right font-semibold text-green-600">35.000</td>
            <td class="px-3 py-2 text-center">2024-01-01</td>
            <td class="px-3 py-2 text-center">-</td>
            <td class="px-3 py-2 text-center">Toàn hệ thống</td>
            <td class="px-3 py-2 italic text-gray-500">Giá hiện tại</td>
        </tr>
        <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-3 py-2 text-right line-through text-gray-400">40.000</td>
            <td class="px-3 py-2 text-center">2023-01-01</td>
            <td class="px-3 py-2 text-center">2023-12-31</td>
            <td class="px-3 py-2 text-center">Toàn hệ thống</td>
            <td class="px-3 py-2 italic text-gray-400">Giá cũ</td>
        </tr>
    `;
}

function loadServiceAppliedUnits(serviceId) {
    const tbody = document.getElementById('serviceUnitAppliedBody');
    if (!tbody) return;
    
    tbody.innerHTML = `
        <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-3 py-2">Cơ sở A</td>
            <td class="px-3 py-2">CS001</td>
            <td class="px-3 py-2"><span class="status-tag bg-green-100 text-green-800">Đang áp dụng</span></td>
        </tr>
        <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-3 py-2">Cơ sở B</td>
            <td class="px-3 py-2">CS002</td>
            <td class="px-3 py-2"><span class="status-tag bg-green-100 text-green-800">Đang áp dụng</span></td>
        </tr>
    `;
}

function loadServicePriceData(serviceId) {
    // Populate price manager modal with service data
    const setPriceData = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };
    
    setPriceData('priceServiceCode', serviceId);
    setPriceData('priceServiceName', 'Thu gom rác thải sinh hoạt');
    setPriceData('priceServiceGroup', 'Vệ sinh');
    setPriceData('priceServiceScope', 'Toàn hệ thống');
    setPriceData('priceServiceUnit', 'm³');
    setPriceData('priceServiceStatus', 'Đang áp dụng');
    setPriceData('priceServiceCurrent', '35.000');
    setPriceData('priceServiceCurrentStart', '2024-01-01');
}

function refreshServiceList() {
    // In a real app, this would reload the service list from the server
    // For demo, we'll just show a notification
    console.log('Service list refreshed');
}

// Export service functions to global scope
window.testPriceStructure = testPriceStructure;
window.testPriceStructureSimple = testPriceStructureSimple;
window.openAddServiceModal = openAddServiceModal;
window.closeAddServiceModal = closeAddServiceModal;
window.openServiceDetailModal = openServiceDetailModal;
window.closeServiceDetailModal = closeServiceDetailModal;
window.openServicePriceManagerModal = openServicePriceManagerModal;
window.closeServicePriceManagerModal = closeServicePriceManagerModal;
window.toggleBaseUnitField = toggleBaseUnitField;
window.resetAddServiceForm = resetAddServiceForm;
window.calculateTotalPrice = calculateTotalPrice;
window.submitAddService = submitAddService;
window.validateServiceForm = validateServiceForm;
window.collectServiceFormData = collectServiceFormData;
window.generateServiceId = generateServiceId;
window.saveServiceToStorage = saveServiceToStorage;
window.loadServiceDetail = loadServiceDetail;
window.loadServicePriceStructure = loadServicePriceStructure;
window.loadServicePriceHistory = loadServicePriceHistory;
window.loadServiceAppliedUnits = loadServiceAppliedUnits;
window.loadServicePriceData = loadServicePriceData;
window.refreshServiceList = refreshServiceList;

// ===== PAYMENT COLLECTION FILTER MANAGEMENT =====

// Khởi tạo bộ lọc cho màn hình thu tiền
function initializePaymentFilters() {
    // Load danh sách bộ lọc đã lưu
    loadSavedPaymentFilters();
    
    // Event listeners cho bộ lọc
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const routeFilter = document.getElementById('routeFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    if (searchInput) searchInput.addEventListener('input', applyPaymentFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyPaymentFilters);
    if (routeFilter) routeFilter.addEventListener('change', applyPaymentFilters);
    if (dateFilter) dateFilter.addEventListener('change', applyPaymentFilters);
    
    // Event listeners cho quick filters
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            applyQuickPaymentFilter(filterType);
        });
    });
    
    // Event listeners cho các nút
    const saveFilterBtn = document.getElementById('saveFilterBtn');
    const clearFilterBtn = document.getElementById('clearFilterBtn');
    const clearCurrentFilter = document.getElementById('clearCurrentFilter');
    const savedFilters = document.getElementById('savedFilters');
    
    if (saveFilterBtn) saveFilterBtn.addEventListener('click', openSavePaymentFilterModal);
    if (clearFilterBtn) clearFilterBtn.addEventListener('click', clearAllPaymentFilters);
    if (clearCurrentFilter) clearCurrentFilter.addEventListener('click', clearAllPaymentFilters);
    if (savedFilters) savedFilters.addEventListener('change', loadSavedPaymentFilter);
}

// Áp dụng bộ lọc cho màn hình thu tiền
function applyPaymentFilters() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const routeFilter = document.getElementById('routeFilter')?.value || '';
    const dateFilter = document.getElementById('dateFilter')?.value || '';
    
    // Lọc cho tất cả các view (desktop table, tablet table, mobile cards)
    const rows = document.querySelectorAll('.payment-row');
    let visibleCount = 0;
    
    rows.forEach(row => {
        let customerName = '';
        let customerAddress = '';
        let invoiceCode = '';
        let dueDate = '';
        
        // Xác định loại element (table row hoặc card)
        if (row.tagName === 'TR') {
            // Desktop và Tablet table rows
            customerName = row.cells[3]?.textContent.toLowerCase() || '';
            customerAddress = row.cells[4]?.textContent.toLowerCase() || '';
            invoiceCode = row.cells[2]?.textContent.toLowerCase() || '';
            // Desktop có 11 cột, Tablet có 9 cột
            const isDesktop = row.cells.length === 11;
            dueDate = isDesktop ? (row.cells[8]?.textContent || '') : (row.cells[7]?.textContent || '');
        } else {
            // Mobile card elements
            const cardText = row.textContent.toLowerCase();
            customerName = cardText;
            customerAddress = cardText;
            invoiceCode = cardText;
            // Tìm ngày trong card text
            const dateMatch = cardText.match(/\d{2}\/\d{2}\/\d{4}/);
            dueDate = dateMatch ? dateMatch[0] : '';
        }
        
        const route = row.dataset.route || '';
        const status = row.dataset.status || '';
        
        let show = true;
        
        // Lọc theo tìm kiếm (bao gồm địa chỉ)
        if (searchTerm && !customerName.includes(searchTerm) && !invoiceCode.includes(searchTerm) && !customerAddress.includes(searchTerm)) {
            show = false;
        }
        
        // Lọc theo trạng thái
        if (statusFilter && status !== statusFilter) {
            show = false;
        }
        
        // Lọc theo tuyến đường
        if (routeFilter && route !== routeFilter) {
            show = false;
        }
        
        // Lọc theo ngày
        if (dateFilter && dueDate !== dateFilter) {
            show = false;
        }
        
        row.style.display = show ? '' : 'none';
        if (show) visibleCount++;
    });
    
    // Cập nhật thông tin bộ lọc
    updatePaymentFilterInfo(searchTerm, statusFilter, routeFilter, dateFilter, visibleCount);
    
    // Lưu bộ lọc hiện tại
    saveCurrentPaymentFilterToStorage();
}

// Áp dụng quick filter cho màn hình thu tiền
function applyQuickPaymentFilter(filterType) {
    // Reset tất cả quick filter buttons
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.classList.remove('bg-green-600', 'text-white');
        btn.classList.add('bg-gray-100', 'text-gray-800');
    });
    
    // Highlight button được chọn
    const selectedBtn = document.querySelector(`[data-filter="${filterType}"]`);
    if (selectedBtn) {
        selectedBtn.classList.remove('bg-gray-100', 'text-gray-800');
        selectedBtn.classList.add('bg-green-600', 'text-white');
    }
    
    // Reset các bộ lọc khác
    const searchInput = document.getElementById('searchInput');
    const dateFilter = document.getElementById('dateFilter');
    if (searchInput) searchInput.value = '';
    if (dateFilter) dateFilter.value = '';
    
    const statusFilter = document.getElementById('statusFilter');
    const routeFilter = document.getElementById('routeFilter');
    
    switch(filterType) {
        case 'overdue':
            if (statusFilter) statusFilter.value = 'overdue';
            break;
        case 'recent':
            if (statusFilter) statusFilter.value = 'pending';
            // Có thể thêm logic cho 3 tháng gần nhất
            break;
        case 'route1':
            if (routeFilter) routeFilter.value = 'route1';
            if (statusFilter) statusFilter.value = '';
            break;
        case 'high-value':
            if (statusFilter) statusFilter.value = '';
            if (routeFilter) routeFilter.value = '';
            // Lọc theo giá trị cao (có thể thêm logic)
            break;
        case 'address':
            if (statusFilter) statusFilter.value = '';
            if (routeFilter) routeFilter.value = '';
            // Hiển thị prompt để nhập địa chỉ tìm kiếm
            const addressSearch = prompt('Nhập địa chỉ cần tìm kiếm:');
            if (addressSearch && searchInput) {
                searchInput.value = addressSearch;
            }
            break;
    }
    
    applyPaymentFilters();
}

// Cập nhật thông tin bộ lọc cho màn hình thu tiền
function updatePaymentFilterInfo(search, status, route, date, visibleCount) {
    const filterInfo = document.getElementById('currentFilterInfo');
    const filterSummary = document.getElementById('filterSummary');
    
    if (!filterInfo || !filterSummary) return;
    
    let summary = [];
    if (search) summary.push(`Tìm: "${search}"`);
    if (status) summary.push(`Trạng thái: ${getPaymentStatusText(status)}`);
    if (route) summary.push(`Tuyến: ${getPaymentRouteText(route)}`);
    if (date) summary.push(`Ngày: ${date}`);
    
    if (summary.length > 0) {
        filterSummary.textContent = summary.join(', ');
        filterInfo.classList.remove('hidden');
    } else {
        filterInfo.classList.add('hidden');
    }
}

// Lưu bộ lọc hiện tại vào storage cho màn hình thu tiền
function saveCurrentPaymentFilterToStorage() {
    const currentFilter = {
        search: document.getElementById('searchInput')?.value || '',
        status: document.getElementById('statusFilter')?.value || '',
        route: document.getElementById('routeFilter')?.value || '',
        date: document.getElementById('dateFilter')?.value || '',
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('paymentCollection_lastFilter', JSON.stringify(currentFilter));
}

// Khôi phục bộ lọc cuối cùng cho màn hình thu tiền
function restoreLastPaymentFilter() {
    const lastFilter = localStorage.getItem('paymentCollection_lastFilter');
    if (lastFilter) {
        try {
            const filter = JSON.parse(lastFilter);
            const searchInput = document.getElementById('searchInput');
            const statusFilter = document.getElementById('statusFilter');
            const routeFilter = document.getElementById('routeFilter');
            const dateFilter = document.getElementById('dateFilter');
            
            if (searchInput) searchInput.value = filter.search || '';
            if (statusFilter) statusFilter.value = filter.status || '';
            if (routeFilter) routeFilter.value = filter.route || '';
            if (dateFilter) dateFilter.value = filter.date || '';
            
            applyPaymentFilters();
        } catch (error) {
            console.error('Error restoring last payment filter:', error);
        }
    }
}

// Mở modal lưu bộ lọc cho màn hình thu tiền
function openSavePaymentFilterModal() {
    const modal = document.getElementById('saveFilterModal');
    if (modal) {
        modal.classList.remove('hidden');
        const filterName = document.getElementById('filterName');
        if (filterName) filterName.focus();
    }
}

// Đóng modal lưu bộ lọc cho màn hình thu tiền
function closeSavePaymentFilterModal() {
    const modal = document.getElementById('saveFilterModal');
    if (modal) {
        modal.classList.add('hidden');
        const filterName = document.getElementById('filterName');
        const filterDescription = document.getElementById('filterDescription');
        if (filterName) filterName.value = '';
        if (filterDescription) filterDescription.value = '';
    }
}

// Lưu bộ lọc hiện tại cho màn hình thu tiền
function saveCurrentPaymentFilter() {
    const filterName = document.getElementById('filterName')?.value.trim();
    const filterDescription = document.getElementById('filterDescription')?.value.trim();
    
    if (!filterName) {
        showNotification('Vui lòng nhập tên bộ lọc', 'error');
        return;
    }
    
    const currentFilter = {
        name: filterName,
        description: filterDescription,
        search: document.getElementById('searchInput')?.value || '',
        status: document.getElementById('statusFilter')?.value || '',
        route: document.getElementById('routeFilter')?.value || '',
        date: document.getElementById('dateFilter')?.value || '',
        timestamp: new Date().toISOString()
    };
    
    // Lưu vào localStorage
    try {
        const savedFilters = JSON.parse(localStorage.getItem('paymentCollection_savedFilters') || '[]');
        savedFilters.push(currentFilter);
        localStorage.setItem('paymentCollection_savedFilters', JSON.stringify(savedFilters));
        
        // Cập nhật dropdown
        loadSavedPaymentFilters();
        
        // Đóng modal
        closeSavePaymentFilterModal();
        
        // Thông báo
        showNotification('Bộ lọc đã được lưu thành công!', 'success');
    } catch (error) {
        console.error('Error saving payment filter:', error);
        showNotification('Có lỗi xảy ra khi lưu bộ lọc', 'error');
    }
}

// Load danh sách bộ lọc đã lưu cho màn hình thu tiền
function loadSavedPaymentFilters() {
    try {
        const savedFilters = JSON.parse(localStorage.getItem('paymentCollection_savedFilters') || '[]');
        const select = document.getElementById('savedFilters');
        
        if (!select) return;
        
        // Giữ lại option đầu tiên
        select.innerHTML = '<option value="">Bộ lọc đã lưu...</option>';
        
        savedFilters.forEach(filter => {
            const option = document.createElement('option');
            option.value = filter.name;
            option.textContent = filter.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading saved payment filters:', error);
    }
}

// Load bộ lọc đã lưu cho màn hình thu tiền
function loadSavedPaymentFilter() {
    const selectedName = document.getElementById('savedFilters')?.value;
    if (!selectedName) return;
    
    try {
        const savedFilters = JSON.parse(localStorage.getItem('paymentCollection_savedFilters') || '[]');
        const filter = savedFilters.find(f => f.name === selectedName);
        
        if (filter) {
            const searchInput = document.getElementById('searchInput');
            const statusFilter = document.getElementById('statusFilter');
            const routeFilter = document.getElementById('routeFilter');
            const dateFilter = document.getElementById('dateFilter');
            
            if (searchInput) searchInput.value = filter.search || '';
            if (statusFilter) statusFilter.value = filter.status || '';
            if (routeFilter) routeFilter.value = filter.route || '';
            if (dateFilter) dateFilter.value = filter.date || '';
            
            applyPaymentFilters();
            showNotification(`Đã áp dụng bộ lọc: ${filter.name}`, 'info');
        }
    } catch (error) {
        console.error('Error loading saved payment filter:', error);
        showNotification('Có lỗi xảy ra khi tải bộ lọc', 'error');
    }
}

// Xóa tất cả bộ lọc cho màn hình thu tiền
function clearAllPaymentFilters() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const routeFilter = document.getElementById('routeFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    if (searchInput) searchInput.value = '';
    if (statusFilter) statusFilter.value = '';
    if (routeFilter) routeFilter.value = '';
    if (dateFilter) dateFilter.value = '';
    
    // Reset quick filter buttons
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.classList.remove('bg-green-600', 'text-white');
        btn.classList.add('bg-gray-100', 'text-gray-800');
    });
    
    applyPaymentFilters();
    showNotification('Đã xóa tất cả bộ lọc', 'info');
}

// Cập nhật thông tin tuyến đường cho màn hình thu tiền
function updatePaymentRouteInfo() {
    // Có thể lấy từ API hoặc localStorage
    const currentRoute = 'Tuyến 1 - Khu phố 1';
    const totalCustomers = 25;
    const paidCustomers = 15;
    const progress = Math.round((paidCustomers / totalCustomers) * 100);
    
    const currentRouteElement = document.getElementById('currentRoute');
    const customerCountElement = document.getElementById('customerCount');
    const progressPercentElement = document.getElementById('progressPercent');
    
    if (currentRouteElement) currentRouteElement.textContent = currentRoute;
    if (customerCountElement) customerCountElement.textContent = `${paidCustomers}/${totalCustomers}`;
    if (progressPercentElement) progressPercentElement.textContent = `${progress}%`;
}

// Helper functions cho màn hình thu tiền
function getPaymentStatusText(status) {
    const statusMap = {
        'pending': 'Chưa thu',
        'paid': 'Đã thu',
        'overdue': 'Quá hạn'
    };
    return statusMap[status] || status;
}

function getPaymentRouteText(route) {
    const routeMap = {
        'route1': 'Tuyến 1 - Khu phố 1',
        'route2': 'Tuyến 2 - Khu phố 2',
        'route3': 'Tuyến 3 - Khu phố 3'
    };
    return routeMap[route] || route;
}



// Export các hàm để sử dụng trong HTML
window.initializePaymentFilters = initializePaymentFilters;
window.applyPaymentFilters = applyPaymentFilters;
window.applyQuickPaymentFilter = applyQuickPaymentFilter;
window.openSavePaymentFilterModal = openSavePaymentFilterModal;
window.closeSavePaymentFilterModal = closeSavePaymentFilterModal;
window.saveCurrentPaymentFilter = saveCurrentPaymentFilter;
window.restoreLastPaymentFilter = restoreLastPaymentFilter;
window.clearAllPaymentFilters = clearAllPaymentFilters;
window.updatePaymentRouteInfo = updatePaymentRouteInfo;