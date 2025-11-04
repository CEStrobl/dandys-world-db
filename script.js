// party count updater
let partyCount = 0;
function updatePartyCount(x) {
	partyCount = x;
	const el = document.getElementById('party-count');
	if (el) el.textContent = partyCount;
}

updatePartyCount(0);

// Helper to find a toon object by name (fallback to TOONS array if getToon isn't present)
function findToonGlobal(toonName) {
	return (typeof getToon === 'function') ? getToon(toonName) : (TOONS.find(x => x.name.toLowerCase() === String(toonName).toLowerCase()) || null);
}

// Sort party member slots by a given stat key (e.g. 'stealth', 'speed', 'skill')
function sortPartyByStat(statKey) {
	const partyMembers = document.querySelector('.party-members');
	if (!partyMembers) return;
	const addButton = partyMembers.querySelector('.add-slot');
	// collect filled slots (ignore add button and empty slots)
	const slots = Array.from(partyMembers.querySelectorAll('.slot.filled'));
	if (slots.length === 0) return;

	// Map slots to values and stable-sort
	const decorated = slots.map((slot, idx) => {
		const nameEl = slot.querySelector('span');
		const name = nameEl ? nameEl.textContent.trim() : '';
		const toon = findToonGlobal(name);
		const val = toon && typeof toon[statKey] === 'number' ? toon[statKey] : 0;
		return { slot, val, idx };
	});

	decorated.sort((a, b) => {
		if (b.val !== a.val) return b.val - a.val; // descending by stat
		return a.idx - b.idx; // stable fallback
	});

	// Reinsert slots in sorted order (before the add button so it stays last)
	decorated.forEach(d => {
		if (addButton) partyMembers.insertBefore(d.slot, addButton);
		else partyMembers.appendChild(d.slot);
	});
}

// Build a sorted view under the View panel without reordering the main party row
function updateSortedView(statKey, displayMode) {
	// If not provided, read from selects
	const viewSelect = document.getElementById('viewby');
	const modeSelect = document.getElementById('viewmode');
	if (!statKey && viewSelect) {
		statKey = viewSelect.value.toLowerCase().replace(/[^a-z]/g, '');
		// normalize some common labels back to keys
		if (viewSelect.value === 'Skill check') statKey = 'skill';
		if (viewSelect.value === 'Stamina') statKey = 'stam';
		if (viewSelect.value === 'Extraction') statKey = 'extract';
	}
	if (!displayMode && modeSelect) displayMode = modeSelect.value;

	const container = document.querySelector('.view-sorted');
	if (!container) return;
	container.innerHTML = '';

	const partyMembers = document.querySelectorAll('.party-members .slot.filled');
	const list = Array.from(partyMembers).map((slot, idx) => {
		const nameEl = slot.querySelector('span');
		const name = nameEl ? nameEl.textContent.trim() : '';
		const toon = findToonGlobal(name);
		const val = toon && typeof toon[statKey] === 'number' ? toon[statKey] : 0;
		return { name, val, toon, idx };
	});

	list.sort((a,b) => {
		if (b.val !== a.val) return b.val - a.val;
		return a.idx - b.idx;
	});

	list.forEach(item => {
		const it = document.createElement('div');
		it.className = 'sorted-item';

		const thumb = document.createElement('div');
		thumb.className = 'sorted-thumb';
		const img = document.createElement('img');
		img.src = item.toon ? `img/toons/${item.name.toLowerCase()}.png` : 'img/toons/goob.png';
		img.onerror = function(){ this.src = 'img/toons/goob.png'; };
		thumb.appendChild(img);

		const nameEl = document.createElement('div');
		nameEl.className = 'sorted-name';
		nameEl.textContent = item.name || 'Unknown';

		const valueEl = document.createElement('div');
		valueEl.className = 'sorted-value';
		if (!displayMode || displayMode === 'Stars') {
			valueEl.textContent = item.val > 0 ? '★'.repeat(item.val) : '';
		} else {
			// format using existing formatter when possible
			const formatted = typeof formatValueForStat === 'function' ? formatValueForStat(statKey, item.val) : String(item.val);
			valueEl.textContent = item.val > 0 ? formatted : '';
		}

		it.appendChild(thumb);
		it.appendChild(nameEl);
		it.appendChild(valueEl);

		container.appendChild(it);
	});
}

// Toon selection functionality
function createToonSelector() {
	const popup = document.querySelector('.toon-selector-popup');
	const toonGrid = popup ? popup.querySelector('.toon-grid') : null;
	const addButton = document.querySelector('.add-slot');
	const partyMembers = document.querySelector('.party-members');
	const MAX_PARTY_SIZE = 8;
	let activeSlot = null;

	function updateAddButton() {
		const toonCount = partyMembers ? partyMembers.querySelectorAll('.slot.filled').length : 0;
		if (addButton) addButton.style.display = toonCount >= MAX_PARTY_SIZE ? 'none' : 'flex';
		updatePartyCount(toonCount);
		// Ensure add button is always last
		if (partyMembers && addButton) partyMembers.appendChild(addButton);
		// Update the sorted view (if present)
		if (typeof updateSortedView === 'function') {
			// read current view and mode selects if available
			const viewSelect = document.getElementById('viewby');
			const modeSelect = document.getElementById('viewmode');
			const statKey = viewSelect ? (viewSelect.value === 'Skill check' ? 'skill' : (viewSelect.value === 'Stamina' ? 'stam' : (viewSelect.value === 'Extraction' ? 'extract' : viewSelect.value.toLowerCase()))) : 'stealth';
			const mode = modeSelect ? modeSelect.value : 'Stars';
			updateSortedView(statKey, mode);
		}
	}

	// Populate the toon grid for selection
	function buildToonGrid() {
		if (!toonGrid) return;
		// clear existing
		toonGrid.innerHTML = '';
		TOONS.forEach(toon => {
			const toonItem = document.createElement('div');
			toonItem.className = 'toon-item';
			toonItem.innerHTML = `
				<img src="img/toons/${toon.name.toLowerCase()}.png" alt="${toon.name}" 
					onerror="this.src='img/toons/goob.png'">
				<span>${toon.name}</span>
			`;

			toonItem.addEventListener('click', () => {
				if (!activeSlot) return;

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

				// Remove button
				const removeBtn = toonSlot.querySelector('.remove-toon');
				removeBtn.addEventListener('click', (e) => {
					e.stopPropagation();
					toonSlot.remove();
					updateAddButton();
				});

				// Replace or insert
				if (activeSlot.classList && activeSlot.classList.contains('filled')) {
					activeSlot.replaceWith(toonSlot);
				} else if (partyMembers && addButton) {
					partyMembers.insertBefore(toonSlot, addButton);
				}

				// Make slot clickable to edit
				toonSlot.addEventListener('click', () => {
					activeSlot = toonSlot;
					if (popup) popup.classList.add('active');
				});

				updateAddButton();
				if (popup) popup.classList.remove('active');
				activeSlot = null;
			});

			toonGrid.appendChild(toonItem);
		});
	}

	// Open popup when clicking add button
	if (addButton && popup) {
		addButton.addEventListener('click', () => {
			activeSlot = addButton;
			popup.classList.add('active');
		});
	}

	// Close popup when clicking outside
	if (popup) {
		popup.addEventListener('click', (e) => {
			if (e.target === popup) {
				popup.classList.remove('active');
				activeSlot = null;
			}
		});
	}

	// Initialize
	buildToonGrid();
	updateAddButton();
}

// Profile picture selector functionality
function createProfileSelector() {
	const rightCol = document.querySelector('.right-col');
	const avatar = document.querySelector('.avatar');
	const grids = Array.from(document.querySelectorAll('.profile-grid'));
	let currentProfile = null;

	// Pager modes: 'Stars' shows star glyphs, 'Value' shows numeric game values from STAR_VALUE
	const pagerModes = ['Stars', 'Value'];
	let pagerIndex = 0; // 0 = Stars, 1 = Value

	// Helper: map toonName -> toon object
	function findToon(toonName) {
		return (typeof getToon === 'function') ? getToon(toonName) : (TOONS.find(x => x.name.toLowerCase() === String(toonName).toLowerCase()) || null);
	}

	// Helper to format a value for a given stat and star rating
	function formatValueForStat(stat, starRating) {
		const row = (typeof getValueRow === 'function') ? getValueRow(starRating) : (STAR_VALUE.find(r => r.star === Number(starRating)) || null);
		if (!row) return '';
		if (stat === 'skill') {
			const v = row.skill; // [x, y]
			return Array.isArray(v) ? `${v[0]} (${v[1]})` : String(v);
		}
		if (stat === 'speed') {
			const v = row.speed; // [x, y]
			return Array.isArray(v) ? `${v[0]} (${v[1]})` : String(v);
		}
		if (stat === 'stam') return String(row.stamina);
		if (stat === 'stealth') return String(row.stealth);
		if (stat === 'extract') return String(row.extract);
		// health doesn't have a mapping in STAR_VALUE; just return the raw star number
		return String(starRating);
	}

	// Helper to update the stat UI for a given toon name, respecting pager mode
	function updateProfileStats(toonName) {
		const t = findToon(toonName);
		const stats = ['health','skill','speed','stam','stealth','extract'];
		stats.forEach(stat => {
			const el = document.querySelector(`.stat-stars[data-stat="${stat}"]`);
			if (!el) return;
			const val = t && typeof t[stat] === 'number' ? t[stat] : 0;
			// Set the data-mode attribute
			el.setAttribute('data-mode', pagerIndex === 0 ? 'stars' : 'numbers');
			if (pagerIndex === 0) {
				// Stars mode
				const star = '★';
				el.textContent = val > 0 ? star.repeat(val) : '';
			} else {
				// Value mode
				el.textContent = val > 0 ? formatValueForStat(stat, val) : '';
			}
		});

		// Update profile name display
		const nameEl = document.querySelector('.profile-name');
		if (nameEl) nameEl.textContent = t ? t.name : 'No Toon';
	}

	// Setup pager controls
	const pagerLabel = document.querySelector('.pager-label');
	const pagerBtns = Array.from(document.querySelectorAll('.pager-btn'));
	function updatePagerLabel() {
		if (pagerLabel) pagerLabel.textContent = pagerModes[pagerIndex];
	}
	updatePagerLabel();

	if (pagerBtns.length >= 2) {
		const [leftBtn, rightBtn] = pagerBtns;
		leftBtn.addEventListener('click', () => {
			pagerIndex = (pagerIndex - 1 + pagerModes.length) % pagerModes.length;
			updatePagerLabel();
			if (currentProfile) updateProfileStats(currentProfile);
		});
		rightBtn.addEventListener('click', () => {
			pagerIndex = (pagerIndex + 1) % pagerModes.length;
			updatePagerLabel();
			if (currentProfile) updateProfileStats(currentProfile);
		});
	}

	// Clear and populate all grids
	grids.forEach(grid => {
		grid.innerHTML = '';
		TOONS.forEach(toon => {
			const profileItem = document.createElement('div');
			profileItem.className = 'toon-item';
			profileItem.setAttribute('data-toon', toon.name);
			profileItem.innerHTML = `
				<img src="img/toons/${toon.name.toLowerCase()}.png" alt="${toon.name}" 
					onerror="this.src='img/toons/goob.png'">
				<span>${toon.name}</span>
			`;

			profileItem.addEventListener('click', () => {
				// Update avatar image
				if (avatar) {
					avatar.innerHTML = `\n                        <img src="img/toons/${toon.name.toLowerCase()}.png" alt="${toon.name}"\n                             onerror="this.src='img/toons/goob.png'">\n                    `;
				}
				currentProfile = toon.name;

				// Sync selected state across all grids
				document.querySelectorAll('.profile-grid .toon-item').forEach(item => {
					item.classList.toggle('selected', item.getAttribute('data-toon') === toon.name);
				});

				// Update stat display for the selected toon
				updateProfileStats(toon.name);

				// Close the popup after selection
				const profilePopup = document.querySelector('.profile-selector-popup');
				if (profilePopup) {
					profilePopup.style.display = 'none';
				}
			});

			grid.appendChild(profileItem);
		});
	});

	// Clicking avatar shows profile selection popup and expands if minimized
	if (avatar) {
		avatar.addEventListener('click', () => {
			// First ensure the panel is expanded
			if (rightCol && rightCol.classList.contains('minimized')) {
				rightCol.classList.remove('minimized');
				const btn = document.querySelector('.minimize-btn');
				if (btn) {
					btn.textContent = '❮';
					btn.setAttribute('aria-expanded', 'true');
				}
			}

			// Show profile selection popup
			const profilePopup = document.querySelector('.profile-selector-popup');
			if (profilePopup) {
				profilePopup.style.display = 'flex';

				// Add click outside to close
				const closePopup = (e) => {
					if (e.target === profilePopup) {
						profilePopup.style.display = 'none';
						profilePopup.removeEventListener('click', closePopup);
					}
				};
				profilePopup.addEventListener('click', closePopup);
			}
		});
	}
}

    // DOM ready: initialize UI
document.addEventListener('DOMContentLoaded', () => {
    // Initialize selectors
    createToonSelector();
    createProfileSelector();
    
    // Set default profile to Boxten
    const boxtenProfile = document.querySelector('.profile-grid .toon-item[data-toon="Boxten"]');
    if (boxtenProfile) {
        boxtenProfile.click();
    }
    	// Wire up the view selector to render the sorted view (does not reorder party)
    	const viewSelect = document.getElementById('viewby');
    	const viewMode = document.getElementById('viewmode');
    	// mapping of labels in the select to stat keys
    	const viewMapping = { 'Skill check': 'skill', 'Speed': 'speed', 'Stamina': 'stam', 'Stealth': 'stealth', 'Extraction': 'extract' };
    	if (viewSelect) {
    		// Update select background color based on chosen trait
    		function updateTraitSelectColor() {
    			viewSelect.setAttribute('data-current', viewSelect.value);
    		}
    		updateTraitSelectColor(); // initial color

            // Scroll-to-cycle for trait select
            viewSelect.addEventListener('wheel', (e) => {
                e.preventDefault(); // Prevent page scroll
                const options = Array.from(viewSelect.options);
                const currentIndex = options.findIndex(opt => opt.selected);
                let newIndex;
                
                if (e.deltaY < 0) { // Scroll up
                    newIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
                } else { // Scroll down
                    newIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
                }
                
                viewSelect.selectedIndex = newIndex;
                // Trigger change event
                viewSelect.dispatchEvent(new Event('change'));
            });

    		viewSelect.addEventListener('change', (e) => {
    			const sel = e.target.value;
    			const statKey = viewMapping[sel] || 'stealth';
    			const mode = viewMode ? viewMode.value : 'Stars';
    			updateSortedView(statKey, mode);
    			updateTraitSelectColor();
    		});
    	}
    	if (viewMode) {
            // Scroll-to-cycle for display mode select
            viewMode.addEventListener('wheel', (e) => {
                e.preventDefault(); // Prevent page scroll
                const options = Array.from(viewMode.options);
                const currentIndex = options.findIndex(opt => opt.selected);
                let newIndex;
                
                if (e.deltaY < 0) { // Scroll up
                    newIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
                } else { // Scroll down
                    newIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
                }
                
                viewMode.selectedIndex = newIndex;
                // Trigger change event
                viewMode.dispatchEvent(new Event('change'));
            });

    		viewMode.addEventListener('change', () => {
    			const sel = viewSelect ? viewSelect.value : 'Stealth';
    			const statKey = viewMapping[sel] || 'stealth';
    			updateSortedView(statKey, viewMode.value);
    		});
    	}
    	// initial render
    	const initialKey = viewSelect ? (viewMapping[viewSelect.value] || 'stealth') : 'stealth';
    	const initialMode = viewMode ? viewMode.value : 'Stars';
    	updateSortedView(initialKey, initialMode);
	const roomInput = document.getElementById('roomcode');
	const enterBtn = document.getElementById('enterRoom');
	const profileToggle = document.getElementById('profileToggle');
	const rightCol = document.querySelector('.right-col');
	const backdrop = document.getElementById('backdrop');
	const profilePanel = document.querySelector('.profile-panel');
	const minimizeBtn = document.querySelector('.minimize-btn');

	if (roomInput) {
		roomInput.addEventListener('input', e => {
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

	// Handle minimize button
	if (minimizeBtn && rightCol) {
		minimizeBtn.addEventListener('click', () => {
			rightCol.classList.toggle('minimized');
			const isMinimized = rightCol.classList.contains('minimized');
			minimizeBtn.textContent = isMinimized ? '❯' : '❮';
			minimizeBtn.setAttribute('aria-expanded', (!isMinimized).toString());
		});
	}

	// Handle responsive behavior for profile panel
	function handleResize() {
		const isMobile = window.innerWidth <= 500;
		if (isMobile && rightCol) {
			rightCol.classList.remove('minimized');
			if (minimizeBtn) minimizeBtn.textContent = '❮';
		}
	}

	handleResize();
	window.addEventListener('resize', handleResize);
});
