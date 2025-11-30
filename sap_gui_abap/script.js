var app = angular.module('sapGuiApp', []);

app.controller('MainController', function($scope, $timeout, $location, $window) {
    var vm = this;

    // --- Navigation State ---
    // 'VA01' = Sales Order
    // 'ZKAP' = Kaprekar Routine
    vm.currentScreen = 'VA01';

    // --- Menu State ---
    vm.openMenu = null;

    // --- Common State ---
    vm.tCode = "/nVA01";
    vm.screenTitle = "Create Standard Order: Overview";
    
    // --- Sales Order State ---
    vm.activeTab = 'overview';
    vm.orderData = {
        orderType: 'OR',
        salesOrg: '1000',
        distChannel: '10',
        division: '00',
        soldTo: '',
        soldToName: '',
        poNumber: '',
        poDate: '30.11.2025'
    };
    vm.items = [
        { pos: '10', material: 'M-01-T500', qty: '10', uom: 'PC', desc: 'Turbo Drive 500', plant: '1000', value: '5,000.00', selected: false },
        { pos: '20', material: 'P-99-X100', qty: '5', uom: 'PC', desc: 'Power Supply Unit', plant: '1000', value: '250.00', selected: false }
    ];

    // --- Kaprekar State ---
    vm.kapInput = "";
    vm.kapResults = [];

    // --- Modal State ---
    vm.showModal = null;

    // Status Bar State
    vm.statusMessage = "Please enter Sold-To Party.";
    vm.statusIcon = "fas fa-exclamation-circle text-error";

    // --- LocalStorage Handling ---
    vm.saveToStorage = function() {
        try {
            var data = {
                currentScreen: vm.currentScreen,
                orderData: vm.orderData,
                items: vm.items,
                kapInput: vm.kapInput,
                kapResults: vm.kapResults,
                activeTab: vm.activeTab
            };
            localStorage.setItem('sapGuiData', JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    };

    vm.loadFromStorage = function() {
        try {
            var data = localStorage.getItem('sapGuiData');
            if (data) {
                var parsed = JSON.parse(data);
                
                // Restore order data
                if (parsed.orderData) {
                    vm.orderData = parsed.orderData;
                }
                
                // Restore items
                if (parsed.items && parsed.items.length > 0) {
                    vm.items = parsed.items;
                }
                
                // Restore Kaprekar data
                if (parsed.kapInput !== undefined) {
                    vm.kapInput = parsed.kapInput;
                }
                if (parsed.kapResults && parsed.kapResults.length > 0) {
                    vm.kapResults = parsed.kapResults;
                }
                
                // Restore active tab
                if (parsed.activeTab) {
                    vm.activeTab = parsed.activeTab;
                }
                
                // Restore current screen (if no URL parameter)
                var params = $location.search();
                if (!params.tcode && !params.transaction && parsed.currentScreen) {
                    if (parsed.currentScreen === 'ZKAP') {
                        vm.switchToKaprekar();
                    } else {
                        vm.switchToSales();
                    }
                }
                
                return true;
            }
            return false;
        } catch (e) {
            console.error('Error loading from localStorage:', e);
            return false;
        }
    };

    vm.clearStorage = function() {
        try {
            localStorage.removeItem('sapGuiData');
            vm.statusMessage = "All data cleared from storage";
            vm.statusIcon = "fas fa-info-circle";
        } catch (e) {
            console.error('Error clearing localStorage:', e);
        }
    };

    // Auto-save on data changes
    $scope.$watch(function() {
        return {
            orderData: vm.orderData,
            items: vm.items,
            kapInput: vm.kapInput,
            kapResults: vm.kapResults,
            currentScreen: vm.currentScreen,
            activeTab: vm.activeTab
        };
    }, function(newVal, oldVal) {
        if (newVal !== oldVal) {
            vm.saveToStorage();
        }
    }, true); // deep watch

    // --- URL Parameter Handling ---
    vm.initFromUrl = function() {
        var params = $location.search();
        if (params.tcode || params.transaction) {
            var tcode = (params.tcode || params.transaction).toUpperCase();
            if (tcode === 'VA01') {
                vm.switchToSales();
            } else if (tcode === 'ZKAP') {
                vm.switchToKaprekar();
            }
        }
    };

    vm.updateUrl = function(tcode) {
        $location.search('transaction', tcode);
    };

    // --- Menu Handling ---
    vm.toggleMenu = function(menuName, event) {
        if (event) {
            event.stopPropagation();
        }
        if (vm.openMenu === menuName) {
            vm.openMenu = null;
        } else {
            vm.openMenu = menuName;
        }
    };

    vm.menuAction = function(action) {
        vm.openMenu = null;
        vm.statusMessage = "Function '" + action + "' selected.";
        vm.statusIcon = "fas fa-info-circle text-success";
    };

    vm.navigateToTransaction = function(tcode) {
        vm.openMenu = null;
        vm.tCode = '/n' + tcode;
        vm.handleEnter();
    };

    // Close menus when clicking elsewhere
    $window.document.addEventListener('click', function() {
        $scope.$apply(function() {
            vm.openMenu = null;
        });
    });

    // --- Navigation Logic ---
    vm.checkEnter = function(event) {
        if (event.which === 13) {
            vm.handleEnter();
        }
    };

    vm.handleEnter = function() {
        // Check Command Field first
        if (vm.tCode.toUpperCase().startsWith('/N')) {
            var code = vm.tCode.toUpperCase().substring(2);
            if (code === 'ZKAP') {
                vm.switchToKaprekar();
            } else if (code === 'VA01') {
                vm.switchToSales();
            } else {
                vm.statusMessage = "Transaction " + code + " does not exist.";
                vm.statusIcon = "fas fa-times-circle text-error";
            }
            return;
        }

        // If not navigating, perform screen action
        if (vm.currentScreen === 'VA01') {
            vm.simulateSalesEnter();
        } else if (vm.currentScreen === 'ZKAP') {
            // Enter usually triggers Execute on selection screens
            vm.executeKaprekar(); 
        }
    };

    vm.switchToKaprekar = function() {
        vm.currentScreen = 'ZKAP';
        vm.screenTitle = "Kaprekar Constant Routine (ZKAPREKAR)";
        vm.tCode = "";
        vm.statusMessage = "Please enter 4-digit number and execute (F8)";
        vm.statusIcon = "";
        // Don't clear results on switch - they're loaded from storage
        vm.updateUrl('ZKAP');
        vm.saveToStorage();
    };

    vm.switchToSales = function() {
        vm.currentScreen = 'VA01';
        vm.screenTitle = "Create Standard Order: Overview";
        vm.tCode = "";
        vm.statusMessage = "Please enter Sold-To Party.";
        vm.statusIcon = "fas fa-exclamation-circle text-error";
        vm.updateUrl('VA01');
        vm.saveToStorage();
    };

    // --- Kaprekar Logic ---
    vm.executeKaprekar = function() {
        vm.kapResults = [];
        var numStr = vm.kapInput;

        // Validation
        if (!numStr || numStr.length !== 4 || isNaN(numStr)) {
            vm.statusMessage = "Please enter a valid 4-digit number.";
            vm.statusIcon = "fas fa-times-circle text-error";
            return;
        }

        // Check for at least two different digits
        var uniqueDigits = new Set(numStr.split(''));
        if (uniqueDigits.size < 2) {
            vm.statusMessage = "Number must have at least two different digits.";
            vm.statusIcon = "fas fa-times-circle text-error";
            return;
        }

        vm.statusMessage = "Program executing...";
        vm.statusIcon = "fas fa-spinner fa-spin";

        // Artificial delay for "processing" feel
        $timeout(function() {
            vm.runKaprekarLoop(parseInt(numStr));
            vm.statusMessage = "Calculation finished.";
            vm.statusIcon = "fas fa-check-circle text-success";
        }, 500);
    };

    vm.resetKaprekar = function() {
        vm.kapResults = [];
        vm.kapInput = "";
        vm.statusMessage = "Enter parameters.";
        vm.statusIcon = "";
        vm.saveToStorage();
    };

    vm.runKaprekarLoop = function(startNum) {
        var current = startNum;
        var count = 0;
        var KAPREKAR = 6174;
        
        // Helper to pad with zeros
        var pad = (n) => String(n).padStart(4, '0');

        // Header
        vm.kapResults.push(`STARTING VALUE: ${pad(current)}`);
        vm.kapResults.push("--------------------------------------------------");
        vm.kapResults.push("ITER  | DESCENDING | ASCENDING  | DIFFERENCE");
        vm.kapResults.push("--------------------------------------------------");

        while (current !== KAPREKAR && count < 20) {
            count++;
            var s = pad(current);
            
            // Sort Desc
            var descStr = s.split('').sort((a,b) => b - a).join('');
            var descNum = parseInt(descStr);

            // Sort Asc
            var ascStr = s.split('').sort((a,b) => a - b).join('');
            var ascNum = parseInt(ascStr);

            var diff = descNum - ascNum;

            // Format Line: SAP Style Spacing
            var line = `   ${String(count).padEnd(3)}| ${descStr.padEnd(11)}| ${ascStr.padEnd(11)}| ${String(diff)}`;
            
            vm.kapResults.push(line);

            if (diff === 0) {
                vm.kapResults.push("Error: Result is 0. Cannot converge.");
                break;
            }

            current = diff;
        }

        if (current === KAPREKAR) {
             vm.kapResults.push("--------------------------------------------------");
             vm.kapResults.push(`CONVERGED TO ${KAPREKAR} IN ${count} STEPS.`);
        }
    };

    // --- Modal Functions ---
    vm.showDocumentation = function() {
        vm.showModal = 'documentation';
    };

    vm.showHeaderData = function() {
        vm.showModal = 'header_data';
        vm.statusMessage = "Displaying header data";
        vm.statusIcon = "fas fa-info-circle";
    };

    vm.showConditions = function() {
        vm.showModal = 'conditions';
        vm.statusMessage = "Displaying conditions";
        vm.statusIcon = "fas fa-info-circle";
    };

    vm.showIncompletionLog = function() {
        vm.showModal = 'incompletion_log';
        vm.statusMessage = "Displaying incompletion log";
        vm.statusIcon = "fas fa-info-circle";
    };

    // --- Help Functions ---
    vm.showApplicationHelp = function() {
        vm.openMenu = null;
        vm.showModal = 'application_help';
        vm.statusMessage = "Displaying application help";
        vm.statusIcon = "fas fa-info-circle";
    };

    vm.showSAPLibrary = function() {
        vm.openMenu = null;
        vm.showModal = 'sap_library';
        vm.statusMessage = "SAP Library opened";
        vm.statusIcon = "fas fa-book";
    };

    vm.showGlossary = function() {
        vm.openMenu = null;
        vm.showModal = 'glossary';
        vm.statusMessage = "Displaying glossary";
        vm.statusIcon = "fas fa-book-open";
    };

    vm.showReleaseNotes = function() {
        vm.openMenu = null;
        vm.showModal = 'release_notes';
        vm.statusMessage = "Displaying release notes";
        vm.statusIcon = "fas fa-file-alt";
    };

    vm.showAbout = function() {
        vm.openMenu = null;
        vm.showModal = 'about';
        vm.statusMessage = "About SAP GUI";
        vm.statusIcon = "fas fa-info-circle";
    };

    vm.closeModal = function() {
        vm.showModal = null;
    };

    vm.closeAllModals = function() {
        vm.showModal = null;
        vm.showF4 = false;
    };

    // --- Sales Order Logic ---
    vm.simulateSalesEnter = function() {
        if (!vm.orderData.soldTo) {
            vm.statusMessage = "Fill in all required entry fields";
            vm.statusIcon = "fas fa-times-circle text-error";
        } else {
            vm.statusMessage = "Standard Order data checking...";
            vm.statusIcon = "fas fa-spinner fa-spin";
            $timeout(function() {
                vm.statusMessage = "Data is valid.";
                vm.statusIcon = "fas fa-check-circle text-success";
                if (!vm.orderData.soldToName) {
                    vm.orderData.soldToName = "Tech Solutions Inc.";
                }
            }, 800);
        }
    };

    vm.save = function() {
        if(!vm.orderData.soldTo) {
            vm.simulateSalesEnter();
            return;
        }
        vm.statusMessage = "Standard Order 120003495 has been saved.";
        vm.statusIcon = "fas fa-check-circle text-success";
        vm.tCode = "";
        vm.saveToStorage();
    };

    vm.goBack = function() {
        if (vm.currentScreen === 'ZKAP') {
            vm.switchToSales(); 
        } else {
            vm.statusMessage = "Data will be lost. Do you want to save?";
            vm.statusIcon = "fas fa-question-circle";
        }
    };
    
    vm.exit = function() {
        document.body.innerHTML = "<div style='display:flex;justify-content:center;align-items:center;height:100%;background:#002e6e;color:white;'><h1>SAP Logoff Successful</h1></div>";
    };
    
    vm.cancel = function() {
        vm.statusMessage = "Action cancelled.";
        vm.statusIcon = "fas fa-ban";
    };

    // Grid Logic
    vm.selectRow = function(index) {
        vm.items.forEach(i => i.selected = false);
        vm.items[index].selected = true;
    };

    vm.addItem = function() {
        var nextPos = (vm.items.length + 1) * 10;
        vm.items.push({ pos: nextPos, material: '', qty: '', uom: '', desc: '', plant: '1000', value: '0.00', selected: false });
    };

    vm.deleteItem = function() {
        vm.items = vm.items.filter(i => !i.selected);
    };

    // F4 Help Mock
    vm.showF4 = false;
    vm.f4Title = "";
    
    vm.openF4 = function(fieldTitle) {
        vm.f4Title = fieldTitle;
        vm.showF4 = true;
    };
    
    vm.closeF4 = function() {
        vm.showF4 = false;
    };
    
    vm.selectF4 = function(code, name) {
        if(vm.f4Title === 'Sold-To Party') {
            vm.orderData.soldTo = code;
            vm.orderData.soldToName = name;
        } else if(vm.f4Title === 'Order Type') {
            vm.orderData.orderType = code;
        }
        vm.showF4 = false;
    };

    vm.toggleStatusDetails = function() {
        vm.statusMessage = "System: S4H / Client: 020 / User: DEMO";
        vm.statusIcon = "fas fa-info-circle";
    };

    // --- Initialize Application ---
    // Load data from storage first
    vm.loadFromStorage();
    
    // Then initialize from URL (which may override storage)
    vm.initFromUrl();
});