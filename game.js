// ============================================
// DUSAR GAME - COMPLETE LOGIC
// ============================================

class DUSARGame {
    constructor() {
        // Players
        this.players = [];
        this.playerNames = ['You', 'Bot Ahmed', 'Bot Hira', 'Bot Hassan'];
        
        // Game state
        this.deck = [];
        this.hands = [[], [], [], []];  // 13 cards each
        this.initialHands = [[], [], [], []];  // For 5-card phase
        this.phase = 'setup';  // setup, dealing5, bidding, trump, dealing8, playing
        
        // Bidding
        this.bids = [null, null, null, null];
        this.currentBidder = 0;
        this.highestBid = 0;
        this.highestBidder = -1;
        this.canBid = [true, true, true, true];
        
        // Trump
        this.trumpSuit = null;
        this.trumpRevealed = false;
        
        // Playing
        this.currentTrick = [];
        this.currentPlayer = 0;
        this.leadSuit = null;
        this.tricksWon = [0, 0];  // Team A, Team B
        this.teamScores = [0, 0];
        this.gameHistory = [];
        
        this.initDOM();
        this.loadGameHistory();
        this.setupEventListeners();
    }

    initDOM() {
        this.els = {
            gameContainer: document.querySelector('.game-container'),
            homeScreen: document.getElementById('homeScreen'),
            rulesScreen: document.getElementById('rulesScreen'),
            setupScreen: document.getElementById('setupScreen'),
            gameScreen: document.getElementById('gameScreen'),
            
            // Game elements
            playerHand: document.getElementById('playerHand'),
            tableArea: document.getElementById('tableArea'),
            trumpDisplay: document.getElementById('trumpDisplay'),
            trumpSuit: document.getElementById('trumpSuit'),
            trumpSmall: document.getElementById('trumpSmall'),
            bidInfo: document.getElementById('bidInfo'),
            gameStatus: document.getElementById('gameStatus'),
            
            // Scores
            teamAScore: document.getElementById('teamAScore'),
            teamBScore: document.getElementById('teamBScore'),
            teamADots: document.getElementById('teamADots'),
            teamBDots: document.getElementById('teamBDots'),
            
            // Player displays
            p1Cards: document.getElementById('playerHand'),
            p2Cards: document.getElementById('p2Cards'),
            p3Cards: document.getElementById('p3Cards'),
            p4Cards: document.getElementById('p4Cards'),
            p1Count: document.getElementById('p1Count'),
            p2Count: document.getElementById('p2Count'),
            p3Count: document.getElementById('p3Count'),
            p4Count: document.getElementById('p4Count'),
            
            // Modals
            modalOverlay: document.getElementById('modalOverlay'),
            dealingModal: document.getElementById('dealingModal'),
            biddingModal: document.getElementById('biddingModal'),
            trumpModal: document.getElementById('trumpModal'),
            handOverModal: document.getElementById('handOverModal'),
            gameOverModal: document.getElementById('gameOverModal'),
        };
    }

    setupEventListeners() {
        // Home screen
        const startGameBtn = document.getElementById('startGameBtn');
        const rulesBtn = document.getElementById('rulesBtn');
        
        if (startGameBtn) startGameBtn.addEventListener('click', () => {
            console.log('Start Game clicked');
            this.showScreen('setupScreen');
        });
        
        if (rulesBtn) rulesBtn.addEventListener('click', () => {
            console.log('Rules clicked');
            this.showScreen('rulesScreen');
        });
        
        // Setup screen
        const setupBackBtn = document.getElementById('setupBackBtn');
        const startBtn = document.getElementById('startBtn');
        
        if (setupBackBtn) setupBackBtn.addEventListener('click', () => {
            console.log('Setup Back clicked');
            this.showScreen('homeScreen');
        });
        
        if (startBtn) startBtn.addEventListener('click', () => {
            console.log('Start Game Button clicked');
            this.startNewGame();
        });
        
        // Rules screen
        const backBtn = document.getElementById('backBtn');
        if (backBtn) backBtn.addEventListener('click', () => {
            console.log('Back from rules clicked');
            this.showScreen('homeScreen');
        });
        
        // Bidding - attach dynamically
        this.attachBiddingListeners();
        
        // Trump selection - attach dynamically
        this.attachTrumpListeners();
        
        // Modals
        const nextHandBtn = document.getElementById('nextHandBtn');
        const playAgainBtn = document.getElementById('playAgainBtn');
        const homeBtn = document.getElementById('homeBtn');
        
        if (nextHandBtn) nextHandBtn.addEventListener('click', () => {
            console.log('Next Hand clicked');
            this.startNewHand();
        });
        
        if (playAgainBtn) playAgainBtn.addEventListener('click', () => {
            console.log('Play Again clicked');
            this.startNewGame();
        });
        
        if (homeBtn) homeBtn.addEventListener('click', () => {
            console.log('Home clicked');
            this.showScreen('homeScreen');
        });
    }

    attachBiddingListeners() {
        const bidButtons = document.querySelectorAll('.bid-btn:not(.btn-pass)');
        const passBtn = document.getElementById('passBtn');
        
        bidButtons.forEach(btn => {
            btn.onclick = (e) => {
                const bid = parseInt(e.target.dataset.bid);
                console.log('Bid clicked:', bid);
                this.placeBid(bid);
            };
        });
        
        if (passBtn) {
            passBtn.onclick = () => {
                console.log('Pass clicked');
                this.passBid();
            };
        }
    }

    attachTrumpListeners() {
        const trumpButtons = document.querySelectorAll('.trump-btn');
        
        trumpButtons.forEach(btn => {
            btn.onclick = (e) => {
                const suit = e.target.dataset.suit;
                console.log('Trump selected:', suit);
                this.selectTrump(suit);
            };
        });
    }

    // ============================================
    // SCREEN MANAGEMENT
    // ============================================

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    showModal(modalId) {
        this.els.modalOverlay.classList.add('active');
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        const targetModal = document.getElementById(modalId);
        if (targetModal) {
            targetModal.classList.add('active');
            // Reattach listeners after modal shows
            if (modalId === 'biddingModal') {
                setTimeout(() => this.attachBiddingListeners(), 100);
            } else if (modalId === 'trumpModal') {
                setTimeout(() => this.attachTrumpListeners(), 100);
            }
        }
    }

    hideModal() {
        this.els.modalOverlay.classList.remove('active');
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    }

    // ============================================
    // GAME INITIALIZATION
    // ============================================

    startNewGame() {
        // Get player names
        this.playerNames[0] = document.getElementById('player1Name').value || 'You';
        this.playerNames[1] = document.getElementById('player2Name').value || 'Bot Ahmed';
        this.playerNames[2] = document.getElementById('player3Name').value || 'Bot Hira';
        this.playerNames[3] = document.getElementById('player4Name').value || 'Bot Hassan';

        // Update player names in game
        document.getElementById('p1Name').textContent = `${this.playerNames[0]} (You)`;
        document.getElementById('p2Name').textContent = this.playerNames[1];
        document.getElementById('p3Name').textContent = this.playerNames[2];
        document.getElementById('p4Name').textContent = this.playerNames[3];

        this.phase = 'dealing5';
        this.teamScores = [0, 0];
        this.tricksWon = [0, 0];
        this.updateScores();
        this.showScreen('gameScreen');
        this.startNewHand();
    }

    startNewHand() {
        this.deck = this.createAndShuffleDeck();
        this.hands = [[], [], [], []];
        this.initialHands = [[], [], [], []];
        this.bids = [null, null, null, null];
        this.canBid = [true, true, true, true];
        this.currentBidder = 0;
        this.highestBid = 0;
        this.highestBidder = -1;
        this.trumpSuit = null;
        this.currentTrick = [];
        this.leadSuit = null;
        this.tricksWon = [0, 0];

        this.hideModal();
        this.dealPhase1();
    }

    // ============================================
    // CARD DEALING
    // ============================================

    createAndShuffleDeck() {
        const deck = [];
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

        for (let suit of suits) {
            for (let value of values) {
                deck.push(value + suit);
            }
        }

        // Shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        return deck;
    }

    dealPhase1() {
        this.showModal('dealingModal');
        
        // Deal 5 cards to each player (total 20 cards)
        let cardIdx = 0;
        for (let i = 0; i < 5; i++) {
            for (let p = 0; p < 4; p++) {
                this.initialHands[p].push(this.deck[cardIdx++]);
            }
        }

        // Sort hands for display
        this.initialHands.forEach(hand => hand.sort((a, b) => this.cardValue(a) - this.cardValue(b)));

        setTimeout(() => {
            this.phase = 'bidding';
            this.hideModal();
            this.renderAll();
            this.startBidding();
        }, 2000);
    }

    dealPhase2() {
        // Deal remaining 8 cards (4 then 4)
        let cardIdx = 20;
        
        // First batch of 4
        for (let i = 0; i < 4; i++) {
            for (let p = 0; p < 4; p++) {
                this.initialHands[p].push(this.deck[cardIdx++]);
            }
        }

        // Second batch of 4
        for (let i = 0; i < 4; i++) {
            for (let p = 0; p < 4; p++) {
                this.initialHands[p].push(this.deck[cardIdx++]);
            }
        }

        // Copy to working hands and sort
        this.hands = JSON.parse(JSON.stringify(this.initialHands));
        this.hands.forEach(hand => hand.sort((a, b) => this.cardValue(a) - this.cardValue(b)));

        this.phase = 'playing';
        this.currentPlayer = this.highestBidder;
        this.renderAll();
        this.nextTurn();
    }

    // ============================================
    // BIDDING PHASE
    // ============================================

    startBidding() {
        this.currentBidder = 0;
        this.proceedBidding();
    }

    proceedBidding() {
        if (this.passCount() >= 3) {
            // At least 3 have passed
            if (this.highestBidder === -1) {
                // Everyone passed, player 1 must bid
                this.currentBidder = 0;
                this.canBid[0] = true;
                this.showBiddingForPlayer();
            } else {
                // Highest bidder exists, proceed to trump selection
                this.phase = 'trump';
                this.showTrumpSelection();
                return;
            }
        } else if (!this.canBid[this.currentBidder]) {
            // This player already bid or passed, skip
            this.currentBidder = (this.currentBidder + 1) % 4;
            this.proceedBidding();
        } else if (this.currentBidder === 0) {
            // Human player's turn
            this.showBiddingForPlayer();
        } else {
            // Bot's turn
            setTimeout(() => this.botBid(), 800);
        }
    }

    passCount() {
        return this.canBid.filter(b => !b).length;
    }

    showBiddingForPlayer() {
        const bidDisplay = document.getElementById('bidDisplay');
        let html = `<div>Current Highest: ${this.highestBid > 0 ? this.highestBid : 'None'}</div>`;
        
        if (this.highestBid === 0) {
            html += '<div style="margin-top: 10px; font-size: 0.9rem;">First to bid</div>';
        } else {
            html += `<div style="margin-top: 10px; font-size: 0.9rem;">Must bid ${this.highestBid + 1} or higher</div>`;
        }
        bidDisplay.innerHTML = html;

        this.showModal('biddingModal');
        this.updateBidButtons();
    }

    updateBidButtons() {
        document.querySelectorAll('.bid-btn:not(.btn-pass)').forEach(btn => {
            const bid = parseInt(btn.dataset.bid);
            const canBid = bid > this.highestBid;
            btn.disabled = !canBid;
            btn.style.opacity = canBid ? '1' : '0.3';
        });
    }

    placeBid(bid) {
        this.bids[this.currentBidder] = bid;
        this.highestBid = bid;
        this.highestBidder = this.currentBidder;
        this.canBid[this.currentBidder] = false;

        this.hideModal();
        this.currentBidder = (this.currentBidder + 1) % 4;
        this.proceedBidding();
    }

    passBid() {
        this.canBid[this.currentBidder] = false;
        this.hideModal();
        this.currentBidder = (this.currentBidder + 1) % 4;
        this.proceedBidding();
    }

    botBid() {
        const hand = this.initialHands[this.currentBidder];
        const strength = this.evaluateHand(hand);

        let shouldBid = false;
        let bid = null;

        if (this.highestBid === 0) {
            // First bidder
            shouldBid = strength > 0.5;
            bid = Math.min(13, Math.floor(strength * 5 + 9));
        } else {
            // Subsequent bidders
            shouldBid = strength > 0.6 && strength * 4 + 9 > this.highestBid;
            if (shouldBid) {
                bid = Math.min(13, Math.max(this.highestBid + 1, Math.floor(strength * 5 + 9)));
            }
        }

        if (shouldBid && bid !== null) {
            this.placeBid(bid);
        } else {
            this.passBid();
        }
    }

    evaluateHand(hand) {
        const aces = hand.filter(c => c[0] === 'A').length;
        const faces = hand.filter(c => ['K', 'Q', 'J'].includes(c[0])).length;
        const tens = hand.filter(c => c.includes('10')).length;

        return Math.min((aces * 0.3 + faces * 0.15 + tens * 0.1) / 5, 1);
    }

    // ============================================
    // TRUMP SELECTION
    // ============================================

    showTrumpSelection() {
        const bidderName = this.playerNames[this.highestBidder];
        document.getElementById('biddingPlayerName').textContent = `${bidderName} will choose`;

        if (this.highestBidder === 0) {
            // Player chooses
            this.showModal('trumpModal');
        } else {
            // Bot chooses automatically
            setTimeout(() => {
                const bestSuit = this.selectBestTrump(this.initialHands[this.highestBidder]);
                this.selectTrump(bestSuit);
            }, 1500);
        }
    }

    selectBestTrump(hand) {
        const suitCounts = { '♠': 0, '♥': 0, '♦': 0, '♣': 0 };
        hand.forEach(card => {
            suitCounts[card[card.length - 1]]++;
        });

        let bestSuit = '♠';
        let maxCount = 0;
        for (let suit in suitCounts) {
            if (suitCounts[suit] > maxCount) {
                maxCount = suitCounts[suit];
                bestSuit = suit;
            }
        }
        return bestSuit;
    }

    selectTrump(suit) {
        this.trumpSuit = suit;
        this.hideModal();
        this.updateTrumpDisplay();
        this.phase = 'dealing8';
        this.dealPhase2();
    }

    // ============================================
    // PLAYING PHASE
    // ============================================

    nextTurn() {
        if (this.currentTrick.length === 4) {
            setTimeout(() => this.resolveTrick(), 600);
            return;
        }

        this.renderAll();

        if (this.currentPlayer === 0) {
            this.allowPlayerPlay();
        } else {
            setTimeout(() => this.botPlay(), 700);
        }
    }

    allowPlayerPlay() {
        const hand = this.hands[0];
        const cards = document.querySelectorAll('#playerHand .card');

        cards.forEach((cardEl, idx) => {
            cardEl.style.cursor = 'default';
            cardEl.classList.remove('selectable');
            cardEl.onclick = null;

            const card = hand[idx];
            const canPlay = this.canPlayCard(0, card);

            if (canPlay) {
                cardEl.classList.add('selectable');
                cardEl.style.cursor = 'pointer';
                cardEl.onclick = () => this.playCard(0, idx);
            } else {
                cardEl.style.opacity = '0.4';
            }
        });
    }

    canPlayCard(player, card) {
        const hand = this.hands[player];

        // First card of trick - can play anything
        if (!this.leadSuit) return true;

        const cardSuit = card[card.length - 1];

        // Must follow suit if possible
        if (hand.some(c => c[c.length - 1] === this.leadSuit)) {
            return cardSuit === this.leadSuit;
        }

        return true;
    }

    playCard(player, cardIdx) {
        const card = this.hands[player].splice(cardIdx, 1)[0];
        const suit = card[card.length - 1];

        if (!this.leadSuit) {
            this.leadSuit = suit;
        }

        this.currentTrick.push({
            player,
            card,
            suit
        });

        this.displayCardOnTable(card, player);
        this.renderAll();

        this.currentPlayer = (this.currentPlayer + 1) % 4;
        this.nextTurn();
    }

    botPlay() {
        const player = this.currentPlayer;
        const hand = this.hands[player];

        const validCards = hand
            .map((card, idx) => ({ idx, card, valid: this.canPlayCard(player, card) }))
            .filter(o => o.valid);

        let chosenIdx = validCards[0].idx;

        // Smart play - try to win if possible
        if (validCards.length > 0) {
            for (let option of validCards) {
                if (this.wouldWinTrick(option.card)) {
                    chosenIdx = option.idx;
                    break;
                }
            }
        }

        this.playCard(player, chosenIdx);
    }

    wouldWinTrick(card) {
        const cardSuit = card[card.length - 1];
        const isTrump = cardSuit === this.trumpSuit;

        for (let trick of this.currentTrick) {
            const trickSuit = trick.suit;
            const isTrickTrump = trickSuit === this.trumpSuit;

            if (isTrickTrump && !isTrump) return false;
        }
        return true;
    }

    displayCardOnTable(card, player) {
        const tableArea = this.els.tableArea;
        const cardEl = this.createCard(card);
        cardEl.style.position = 'absolute';

        // Position based on player
        if (player === 0) cardEl.style.bottom = '10px';
        if (player === 1) cardEl.style.right = '10px';
        if (player === 2) cardEl.style.top = '10px';
        if (player === 3) cardEl.style.left = '10px';

      
