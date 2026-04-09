// DUSAR GAME - ULTRA SIMPLE VERSION
console.log('✅ game.js script loaded');

// Wait for page to fully load
window.addEventListener('load', function() {
    console.log('✅ Page loaded - starting initialization');
    initGame();
});

function initGame() {
    console.log('🔧 Initializing...');
    
    // Get screen elements
    const homeScreen = document.getElementById('homeScreen');
    const rulesScreen = document.getElementById('rulesScreen');
    const setupScreen = document.getElementById('setupScreen');
    const gameScreen = document.getElementById('gameScreen');
    
    console.log('✓ Screens:', {
        home: !!homeScreen,
        rules: !!rulesScreen,
        setup: !!setupScreen,
        game: !!gameScreen
    });

    // Screen switch function
    function switchToScreen(screenName) {
        console.log('🔄 [SWITCH] Going to:', screenName);
        
        // Hide all screens
        homeScreen.classList.remove('active');
        rulesScreen.classList.remove('active');
        setupScreen.classList.remove('active');
        gameScreen.classList.remove('active');
        
        // Show target
        if (screenName === 'home') homeScreen.classList.add('active');
        else if (screenName === 'rules') rulesScreen.classList.add('active');
        else if (screenName === 'setup') setupScreen.classList.add('active');
        else if (screenName === 'game') gameScreen.classList.add('active');
        
        console.log('✅ [SWITCH] Now showing:', screenName);
    }

    // HOME SCREEN
    console.log('🔗 Attaching HOME screen buttons...');
    
    const btnStart = document.getElementById('startGameBtn');
    if (btnStart) {
        btnStart.onclick = function() {
            console.log('🖱️  [CLICK] Home - Start Game');
            switchToScreen('setup');
        };
        console.log('✓ Home Start Game button');
    }
    
    const btnRules = document.getElementById('rulesBtn');
    if (btnRules) {
        btnRules.onclick = function() {
            console.log('🖱️  [CLICK] Home - Rules');
            switchToScreen('rules');
        };
        console.log('✓ Home Rules button');
    }

    // RULES SCREEN
    console.log('🔗 Attaching RULES screen buttons...');
    
    const btnRulesBack = document.getElementById('backBtn');
    if (btnRulesBack) {
        btnRulesBack.onclick = function() {
            console.log('🖱️  [CLICK] Rules - Back');
            switchToScreen('home');
        };
        console.log('✓ Rules Back button');
    }

    // SETUP SCREEN
    console.log('🔗 Attaching SETUP screen buttons...');
    
    const btnSetupBack = document.getElementById('setupBackBtn');
    if (btnSetupBack) {
        btnSetupBack.onclick = function() {
            console.log('🖱️  [CLICK] Setup - Back');
            switchToScreen('home');
        };
        console.log('✓ Setup Back button');
    }
    
    const btnSetupStart = document.getElementById('startBtn');
    if (btnSetupStart) {
        btnSetupStart.onclick = function() {
            console.log('🖱️  [CLICK] Setup - Start Game CLICKED');
            console.log('📍 About to call startGameFromSetup()');
            startGameFromSetup();
        };
        console.log('✓ Setup Start Game button - READY');
    } else {
        console.log('❌ startBtn NOT FOUND');
    }

    // GAME FLOW
    function startGameFromSetup() {
        console.log('⚙️  [FLOW] startGameFromSetup() called');
        
        try {
            // Get names
            const p1 = document.getElementById('player1Name');
            const p2 = document.getElementById('player2Name');
            const p3 = document.getElementById('player3Name');
            const p4 = document.getElementById('player4Name');
            
            console.log('👤 [NAMES] Input elements found:', {
                p1: !!p1,
                p2: !!p2,
                p3: !!p3,
                p4: !!p4
            });
            
            const name1 = p1 ? p1.value : 'You';
            const name2 = p2 ? p2.value : 'Bot Ahmed';
            const name3 = p3 ? p3.value : 'Bot Hira';
            const name4 = p4 ? p4.value : 'Bot Hassan';
            
            console.log('👤 [NAMES] Players:', {
                p1: name1,
                p2: name2,
                p3: name3,
                p4: name4
            });
            
            // Update game screen labels
            const p1Label = document.getElementById('p1Name');
            const p2Label = document.getElementById('p2Name');
            const p3Label = document.getElementById('p3Name');
            const p4Label = document.getElementById('p4Name');
            
            console.log('🏷️  [LABELS] Label elements found:', {
                p1: !!p1Label,
                p2: !!p2Label,
                p3: !!p3Label,
                p4: !!p4Label
            });
            
            if (p1Label) p1Label.textContent = `${name1} (You)`;
            if (p2Label) p2Label.textContent = name2;
            if (p3Label) p3Label.textContent = name3;
            if (p4Label) p4Label.textContent = name4;
            
            console.log('✅ [LABELS] Names updated');
            
            // Switch to game screen
            console.log('🎮 [SWITCH] Switching to game screen...');
            switchToScreen('game');
            
            console.log('🎴 [DEAL] Starting deal...');
            startDeal();
            
        } catch (error) {
            console.error('❌ [ERROR] In startGameFromSetup():', error);
            console.error('Stack:', error.stack);
        }
    }

    // DEAL CARDS
    function startDeal() {
        console.log('🎴 [DEAL] Deal starting - showing modal...');
        
        const modal = document.getElementById('dealingModal');
        const overlay = document.getElementById('modalOverlay');
        
        if (modal && overlay) {
            modal.classList.add('active');
            overlay.classList.add('active');
            console.log('✓ [DEAL] Dealing modal shown');
        }
        
        // After 2 seconds, show cards
        setTimeout(function() {
            console.log('🎴 [DEAL] 2 seconds passed - hiding modal...');
            
            if (modal && overlay) {
                modal.classList.remove('active');
                overlay.classList.remove('active');
            }
            
            // Create sample cards in hand
            const hand = document.getElementById('playerHand');
            if (hand) {
                hand.innerHTML = '';
                const cards = ['A♠', 'K♥', 'Q♦', 'J♣', '10♠', '9♥', '8♦', '7♣', '6♠'];
                cards.forEach(card => {
                    const el = document.createElement('div');
                    el.className = 'card spade';
                    const v = card.slice(0, -1);
                    const s = card[card.length-1];
                    el.innerHTML = `<div class="card-value">${v}</div><div class="card-suit">${s}</div>`;
                    hand.appendChild(el);
                });
                console.log('✓ [CARDS] Cards shown in hand');
            }
            
            // Show bidding modal
            setTimeout(function() {
                const bidModal = document.getElementById('biddingModal');
                if (bidModal && overlay) {
                    bidModal.classList.add('active');
                    overlay.classList.add('active');
                    console.log('✓ [BID] Bidding modal shown');
                }
                
                // Add bid button clicks
                const bidBtns = document.querySelectorAll('.bid-btn:not(.btn-pass)');
                bidBtns.forEach(btn => {
                    btn.onclick = function() {
                        const bid = btn.dataset.bid;
                        console.log('💰 [BID] Player bid:', bid);
                        
                        if (bidModal && overlay) {
                            bidModal.classList.remove('active');
                            overlay.classList.remove('active');
                        }
                        
                        // Show trump modal
                        const trumpModal = document.getElementById('trumpModal');
                        if (trumpModal && overlay) {
                            trumpModal.classList.add('active');
                            overlay.classList.add('active');
                            console.log('✓ [TRUMP] Trump modal shown');
                        }
                        
                        // Add trump button clicks
                        const trumpBtns = document.querySelectorAll('.trump-btn');
                        trumpBtns.forEach(tbtn => {
                            tbtn.onclick = function() {
                                const suit = tbtn.dataset.suit;
                                console.log('🏆 [TRUMP] Trump selected:', suit);
                                
                                // Update display
                                const trumpDisplay = document.getElementById('trumpSuit');
                                if (trumpDisplay) trumpDisplay.textContent = suit;
                                
                                const trumpSmall = document.getElementById('trumpSmall');
                                if (trumpSmall) trumpSmall.textContent = suit;
                                
                                // Hide modal
                                if (trumpModal && overlay) {
                                    trumpModal.classList.remove('active');
                                    overlay.classList.remove('active');
                                }
                                
                                console.log('✅ [READY] GAME READY TO PLAY!');
                            };
                        });
                    };
                });
                
                const passBtn = document.getElementById('passBtn');
                if (passBtn) {
                    passBtn.onclick = function() {
                        console.log('💰 [BID] Player passed');
                        
                        if (bidModal && overlay) {
                            bidModal.classList.remove('active');
                            overlay.classList.remove('active');
                        }
                        
                        // Show trump modal
                        const trumpModal = document.getElementById('trumpModal');
                        if (trumpModal && overlay) {
                            trumpModal.classList.add('active');
                            overlay.classList.add('active');
                        }
                    };
                }
            }, 500);
        }, 2000);
    }

    console.log('✅✅✅ GAME FULLY INITIALIZED - ALL BUTTONS READY ✅✅✅');
    console.log('Screens showing:', {
        current: homeScreen.classList.contains('active') ? 'HOME' : 'NOT HOME'
    });
}

console.log('✅ game.js initialization complete');
