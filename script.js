// party count updater
let partyCount = 0;
function updatePartyCount(x) {
	partyCount = x;
	document.getElementById('party-count').textContent = partyCount;
}

updatePartyCount(0)

// Toon selection functionality
function createToonSelector() {
    const popup = document.querySelector('.toon-selector-popup');
    const toonGrid = popup.querySelector('.toon-grid');
    const addButton = document.querySelector('.add-slot');
    const partyMembers = document.querySelector('.party-members');
    const MAX_PARTY_SIZE = 8;
    let activeSlot = null;

    function updateAddButton() {
        const toonCount = partyMembers.querySelectorAll('.slot.filled').length;
        addButton.style.display = toonCount >= MAX_PARTY_SIZE ? 'none' : 'flex';
		updatePartyCount(toonCount)
		// Ensure add button is always last
        partyMembers.appendChild(addButton);
    }

    // Create toon grid items
    TOONS.forEach(toon => {
        const toonItem = document.createElement('div');
        toonItem.className = 'toon-item';
        toonItem.innerHTML = `
            <img src="img/toons/${toon.name.toLowerCase()}.png" alt="${toon.name}" 
                 onerror="this.src='img/toons/goob.png'">
            <span>${toon.name}</span>
        `;

        toonItem.addEventListener('click', () => {
            if (activeSlot) {
                // Create or update the toon slot
                const toonSlot = document.createElement('div');
                toonSlot.className = 'slot filled';
                toonSlot.innerHTML = `
                    <div class="toon-wrapper">
                        <img src="img/toons/${toon.name.toLowerCase()}.png" alt="${toon.name}"
                             onerror="this.src='img/toons/goob.png'">
                        <button class="remove-toon" aria-label="Remove ${toon.name}">×</button>
                    </div>
                    <span>${toon.name}</span>
                `;

                // Add remove button functionality
                const removeBtn = toonSlot.querySelector('.remove-toon');
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent slot click
                    toonSlot.remove();
                    updateAddButton();
                });
                
                if (activeSlot.classList.contains('filled')) {
                    // Replacing existing toon
                    activeSlot.replaceWith(toonSlot);
                } else {
                    // Adding new toon
                    partyMembers.insertBefore(toonSlot, addButton);
                }
                
                // Make the new slot clickable for changes
                toonSlot.addEventListener('click', () => {
                    activeSlot = toonSlot;
                    popup.classList.add('active');
                });

                updateAddButton();
            }
            popup.classList.remove('active');
            activeSlot = null;
        });

        toonGrid.appendChild(toonItem);
    });

    // Open popup when clicking add button
    addButton.addEventListener('click', () => {
        activeSlot = addButton;
        popup.classList.add('active');
    });

    // Close popup when clicking outside
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('active');
            activeSlot = null;
        }
    });

    // Initialize add button state
    updateAddButton();
}

// small UI helpers
// Profile picture selector functionality
function createProfileSelector() {
    const popup = document.querySelector('.profile-selector-popup');
    const profileGrid = popup.querySelector('.profile-grid');
    const avatar = document.querySelector('.avatar');
    let currentProfile = null;

    // Create profile grid items
    TOONS.forEach(toon => {
        const profileItem = document.createElement('div');
        profileItem.className = 'toon-item';
        if (currentProfile === toon.name) {
            profileItem.classList.add('selected');
        }
        profileItem.innerHTML = `
            <img src="img/toons/${toon.name.toLowerCase()}.png" alt="${toon.name}" 
                 onerror="this.src='img/toons/goob.png'">
            <span>${toon.name}</span>
        `;

        profileItem.addEventListener('click', () => {
            // Update avatar
            avatar.innerHTML = `
                <img src="img/toons/${toon.name.toLowerCase()}.png" alt="${toon.name}"
                     onerror="this.src='img/toons/goob.png'">
            `;
            currentProfile = toon.name;
            
            // Update selected state
            profileGrid.querySelectorAll('.toon-item').forEach(item => {
                item.classList.remove('selected');
            });
            profileItem.classList.add('selected');
            
            popup.classList.remove('active');
        });

        profileGrid.appendChild(profileItem);
    });

    // Open popup when clicking avatar
    avatar.addEventListener('click', () => {
        popup.classList.add('active');
    });

    // Close popup when clicking outside
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize toon selector and profile selector
    createToonSelector();
    createProfileSelector();
	const roomInput = document.getElementById('roomcode');
	const enterBtn = document.getElementById('enterRoom');

	const profileToggle = document.getElementById('profileToggle');
	const rightCol = document.querySelector('.right-col');
	const backdrop = document.getElementById('backdrop');
	const profilePanel = document.querySelector('.profile-panel');
	const minimizeBtn = document.querySelector('.minimize-btn');

	if (roomInput) {
		roomInput.addEventListener('input', e => {
			// always uppercase
			e.target.value = e.target.value.toUpperCase();
		});
	}

	if (enterBtn) {
		enterBtn.addEventListener('click', () => {
			const code = roomInput ? roomInput.value.trim() : '';
			if (!code) {
				alert('Please enter a room code.');
				return;
			}
			// goob behavior
			alert('Joining room: ' + code);
		});
	}

		// Profile overlay toggle behaviour (small screens)
		function setProfileOpen(open) {
			if (!rightCol) return;
			rightCol.classList.toggle('open', open);
			if (backdrop) backdrop.classList.toggle('show', open);
			if (profileToggle) {
				profileToggle.setAttribute('aria-expanded', String(Boolean(open)));
				// change glyph: show left-pointing when closed (❮), right when open (❯)
				profileToggle.textContent = open ? '❯' : '❮';
			}
		}

		if (profileToggle && rightCol) {
			profileToggle.addEventListener('click', () => {
				const isOpen = rightCol.classList.contains('open');
				setProfileOpen(!isOpen);
			});
		}

		if (backdrop) {
			backdrop.addEventListener('click', () => setProfileOpen(false));
		}

		// Handle minimize button on wide screens
		if (minimizeBtn && rightCol) {
			minimizeBtn.addEventListener('click', () => {
				const isMinimized = rightCol.classList.toggle('minimized');
				minimizeBtn.textContent = isMinimized ? '❮' : '❯';
				minimizeBtn.setAttribute('aria-expanded', (!isMinimized).toString());
			});
		}

		// Reset minimized state when switching to mobile
		window.addEventListener('resize', () => {
			const isMobile = window.innerWidth <= 900;
			if (isMobile && rightCol.classList.contains('minimized')) {
				rightCol.classList.remove('minimized');
				minimizeBtn.textContent = '❯';
				minimizeBtn.setAttribute('aria-expanded', 'true');
			}
		});
});
