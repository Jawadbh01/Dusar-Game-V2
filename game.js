// DUSAR GAME - SIMPLE VERSION
console.log('🎮 game.js loaded');

// Wait for page to load
window.addEventListener('load', function() {
    console.log('✅ Page fully loaded');
    initializeGame();
});

function initializeGame() {
    console.log('🔧 Initializing game...');
    
    // Get all screen elements
    const screens = {
        home: document.getElementById('homeScreen'),
        rules: document.getElementById('rulesScreen'),
        setup: document.getElementById('setupScreen'),
        game: document.getElementById('gameScreen')
    };
    
    console.log('Screens found:', {
        home: !!screens.home,
        rules: !!screens.rules,
        setup: !!screens.setup,
        game: !!screens.game
    });

    // Function to switch screens
    function goToScreen(screenName) {
        console.log('🔄 Going to:', screenName);
        
        // Hide all
        Object.values(screens).forEach(s => {
            if (s) s.classList.remove('active');
        });
        
        // Show target
        if (screens[screenName]) {
            screens[screenName].classList.add('active');
            console.log('✅ Now on:', screenName);
        }
    }

    // HOME SCREEN BUTTONS
    const startGameBtn = document.getElementById('startGameBtn');
    if (startGameBtn) {
        startGameBtn.onclick = function(e) {
            e.preventDefault();
            console.log('👉 Start Game clicked');
            goToScreen('setup');
        };
        console.log('✓ Start Game button ready');
    }

    const rulesBtn = document.getElementById('rulesBtn');
    if (rulesBtn) {
        rulesBtn.onclick = function(e) {
            e.preventDefault();
            console.log('👉 Rules clicked');
            goToScreen('rules');
        };
        console.log('✓ Rules button ready');
    }

    // RULES SCREEN BUTTONS
    const backFromRulesBtn = document.getElementById('backBtn');
    if (backFromRulesBtn) {
        backFromRulesBtn.onclick = function(e) {
            e.preventDefault();
            console.log('👉 Back from Rules clicked');
            goToScreen('home');
        };
        console.log('✓ Back from Rules button ready');
    }

    // SETUP SCREEN BUTTONS
    const backFromSetupBtn = document.getElementById('setupBackBtn');
    if (backFromSetupBtn) {
        backFromSetupBtn.onclick = function(e) {
            e.preventDefault();
            console.log('👉 Back from Setup clicked');
            goToScreen('home');
        };
        console.log('✓ Back from Setup button ready');
    }

    const startGameFromSetupBtn = document.getElementById('startBtn');
    if (startGameFromSetupBtn) {
        startGameFromSetupBtn.onclick = function(e) {
            e.preventDefault();
            console.log('👉 Start Game from Setup clicked');
            startGameFlow();
        };
        console.log('✓ Start Game from Setup button ready');
    }

    console.log('✅✅✅ GAME READY! Click a button to test. ✅✅✅');
    console.log('Check console for messages as you click buttons.');

    // GAME FLOW
    function startGameFlow() {
        console.log('🎮 Starting game flow...');

        // Get player names
        const p1Name = document.getElementById('player1Name').value || 'You';
        const p2Name = document.getElementById('player2Name').value || 'Bot Ahmed';
        const p3Name = document.getElementById('player3Name').value || 'Bot Hira';
        const p4Name = document.getElementById('player4Name').value || 'Bot Hassan';

        console.log('Players:', { p1: p1Name, p2: p2Name, p3: p3Name, p4: p4Name });

        // Update game screen with names
        document.getElementById('p1Name').textContent = `${p1Name} (You)`;
        document.getElementById('p2Name').textContent = p2Name;
        document.getElementById('p3Name').textContent = p3Name;
        document.getElementById('p4Name').textContent = p4Name;

        // Go to game
        goToScreen('game');

        // Start dealing
        dealCards();
    }

    // GAME LOGIC
    function dealCards() {
        console.log('🎴 Dealing cards...');

        // Show dealing modal
        const dealingModal = document.getElementById('dealingModal');
        const overlay = document.getElementById('modalOverlay');
        if (dealingModal && overlay) {
            dealingModal.classList.add('active');
            overlay.classList.add('active');
        }

        // After 2 seconds, hide modal and show cards
        setTimeout(function() {
            console.log('✓ Done dealing');
            
            if (dealingModal && overlay) {
                dealingModal.classList.remove('active');
                overlay.classList.remove('active');
            }

            // Create sample cards
            const cards = ['A♠', 'K♥', 'Q♦', 'J♣', '10♠'];
            
            const hand = document.getElementById('playerHand');
            if (hand) {
                hand.innerHTML = '';
                cards.forEach(card => {
                    const cardEl = createCard(card);
                    hand.appendChild(cardEl);
                });
            }

            console.log('✓ Cards displayed');

            // Show bidding modal
            setTimeout(function() {
                showBidModal();
            }, 500);
        }, 2000);
    }

    function createCard(cardStr) {
        const el = document.createElement('div');
        el.className = 'card spade';
        el.innerHTML = `<div class="card-value">${cardStr.slice(0, -1)}</div><div class="card-suit">${cardStr[cardStr.length-1]}</div>`;
        return el;
    }

    function showBidModal() {
        console.log('📋 Showing bid modal');

        const biddingModal = document.getElementById('biddingModal');
        const overlay = document.getElementById('modalOverlay');
        
        if (biddingModal && overlay) {
            // Hide other modals first
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
            
            biddingModal.classList.add('active');
            overlay.classList.add('active');
        }

        // Add bid button listeners
        document.querySelectorAll('.bid-btn:not(.btn-pass)').forEach(btn => {
            btn.onclick = function(e) {
                e.preventDefault();
                const bid = e.target.dataset.bid;
                console.log('💰 Player bid:', bid);
                
                if (biddingModal && overlay) {
                    biddingModal.classList.remove('active');
                    overlay.classList.remove('active');
                }
                
                showTrumpModal();
            };
        });

        const passBtn = document.getElementById('passBtn');
        if (passBtn) {
            passBtn.onclick = function(e) {
                e.preventDefault();
                console.log('💰 Player passed');
                
                if (biddingModal && overlay) {
                    biddingModal.classList.remove('active');
                    overlay.classList.remove('active');
                }
                
                showTrumpModal();
            };
        }
    }

    function showTrumpModal() {
        console.log('🏆 Showing trump modal');

        const trumpModal = document.getElementById('trumpModal');
        const overlay = document.getElementById('modalOverlay');
        
        if (trumpModal && overlay) {
            // Hide other modals first
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
            
            trumpModal.classList.add('active');
            overlay.classList.add('active');
        }

        // Add trump button listeners
        document.querySelectorAll('.trump-btn').forEach(btn => {
            btn.onclick = function(e) {
                e.preventDefault();
                const suit = e.target.dataset.suit;
                console.log('🏆 Trump selected:', suit);
                
                // Update display
                document.getElementById('trumpSuit').textContent = suit;
                document.getElementById('trumpSmall').textContent = suit;
                
                if (trumpModal && overlay) {
                    trumpModal.classList.remove('active');
                    overlay.classList.remove('active');
                }

                console.log('🎮 Game board ready! You can now play.');
            };
        });
    }
}
