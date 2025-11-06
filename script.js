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

// Shared formatter: convert a star rating for a given stat into a display string
function formatStatValueGlobal(stat, starRating) {
	const row = (typeof getValueRow === 'function') ? getValueRow(starRating) : (STAR_VALUE.find(r => r.star === Number(starRating)) || null);
	if (!row) return String(starRating || '');
	// For skill and speed we return labeled values to make the meaning clear
	// Assumptions:
	//  - row.skill is [skillValue, skillSize] -> display as "Skill: <skill> (Size: <size>)"
	//  - row.speed is [walkSpeed, runSpeed]     -> display as "Walk: <walk> (Run: <run>)"
	// These labels clarify primary vs secondary values without changing Stars mode elsewhere.
	if (stat === 'skill') {
		const v = row.skill;
		if (Array.isArray(v)) return `Skill: ${v[0]} (Size: ${v[1]})`;
		return `Skill: ${String(v)}`;
	}
	if (stat === 'speed') {
		const v = row.speed;
		if (Array.isArray(v)) return `Walk: ${v[0]} (Run: ${v[1]})`;
		return `Speed: ${String(v)}`;
	}
	if (stat === 'stam') return String(row.stamina);
	if (stat === 'stealth') return String(row.stealth);
	if (stat === 'extract') return String(row.extract);
	return String(starRating);
}

// Compact HTML formatter for Value mode (returns different formats for table vs profile)
function formatStatValueHTML(stat, starRating, mode = 'table') {
	const row = (typeof getValueRow === 'function') ? getValueRow(starRating) : (STAR_VALUE.find(r => r.star === Number(starRating)) || null);
	if (!row) return '';
	
	if (stat === 'skill') {
		const v = row.skill;
		if (Array.isArray(v)) {
			if (mode === 'profile') {
				return `<div class="value-cell type-profile"><span class="number">${v[0]}, ${v[1]}</span><span class="label">Check/Size</span></div>`;
			} else {
				return `<td class="sorted-stat col-skill"><div class="value-cell type-table"><span class="number">${v[0]}</span></div></td>
					<td class="sorted-stat col-skill"><div class="value-cell type-table"><span class="number">${v[1]}</span></div></td>`;
			}
		}
		return mode === 'profile' ? 
			`<div class="value-cell type-profile"><span class="number">${String(v)}</span><span class="label">Value</span></div>` :
			`<td class="sorted-stat col-skill"><div class="value-cell type-table"><span class="number">${String(v)}</span></div></td>`;
	}
	if (stat === 'speed') {
		const v = row.speed;
		if (Array.isArray(v)) {
			if (mode === 'profile') {
				return `<div class="value-cell type-profile"><span class="number">${v[0]}, ${v[1]}</span><span class="label">Walk/Run</span></div>`;
			} else {
				return `<td class="sorted-stat col-speed"><div class="value-cell type-table"><span class="number">${v[0]}</span></div></td>
					<td class="sorted-stat col-speed"><div class="value-cell type-table"><span class="number">${v[1]}</span></div></td>`;
			}
		}
		return mode === 'profile' ?
			`<div class="value-cell type-profile"><span class="number">${String(v)}</span><span class="label">Speed</span></div>` :
			`<td class="sorted-stat col-speed"><div class="value-cell type-table"><span class="number">${String(v)}</span></div></td>
			<td class="sorted-stat col-speed"><div class="value-cell type-table"><span class="number">-</span></div></td>`;
	}
	
	const simpleValue = stat === 'stam' ? row.stamina : 
		(stat === 'stealth' ? row.stealth : 
		(stat === 'extract' ? row.extract : starRating));
		
	const label = stat === 'stam' ? 'Stamina' :
		(stat === 'stealth' ? 'Stealth' :
		(stat === 'extract' ? 'Extract' : stat));
	
	return mode === 'profile' ?
		`<div class="value-cell type-profile"><span class="number">${String(simpleValue)}</span><span class="label">${label}</span></div>` :
		`<td class="sorted-stat col-${stat}" colspan="2"><div class="value-cell type-table"><span class="number">${String(simpleValue)}</span></div></td>`;
}

// Chart sorting state shared across renders
const chartSortState = { col: null, dir: 0 }; // dir: 0 = none, 1 = asc, -1 = desc

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
		if (viewSelect.value === 'Skill check') statKey = 'skill';
		if (viewSelect.value === 'Stamina') statKey = 'stam';
		if (viewSelect.value === 'Extraction') statKey = 'extract';
	}
	if (!displayMode && modeSelect) displayMode = modeSelect.value;

	const container = document.querySelector('.view-sorted');
	if (!container) return;
	container.innerHTML = '';

	const statsOrder = ['health','skill','speed','stam','stealth','extract'];
	const partyMembers = document.querySelectorAll('.party-members .slot.filled');
	const list = Array.from(partyMembers).map((slot, idx) => {
		const nameEl = slot.querySelector('span');
		const name = nameEl ? nameEl.textContent.trim() : '';
		const toon = findToonGlobal(name);
		const stats = {};
		statsOrder.forEach(s => { stats[s] = toon && typeof toon[s] === 'number' ? toon[s] : 0; });
		return { name, toon, stats, idx };
	});

	// Determine sorting: header clicks control chartSortState; if none set, default to statKey desc
	let sorted = list.slice();
	if (chartSortState.col) {
		const col = chartSortState.col;
		const dir = chartSortState.dir || 0;
		if (col === 'name') {
			sorted.sort((a,b) => {
				const av = (a.name || '').toLowerCase();
				const bv = (b.name || '').toLowerCase();
				if (av !== bv) return av < bv ? -1 * dir : 1 * dir;
				return a.idx - b.idx;
			});
		} else if (statsOrder.includes(col)) {
			sorted.sort((a,b) => {
				const av = a.stats[col] || 0;
				const bv = b.stats[col] || 0;
				if (av !== bv) return (av - bv) * dir;
				return a.idx - b.idx;
			});
		}
	} else if (statKey) {
		sorted.sort((a,b) => {
			const av = a.stats[statKey] || 0;
			const bv = b.stats[statKey] || 0;
			if (bv !== av) return bv - av;
			return a.idx - b.idx;
		});
	}

	// Build table
	const table = document.createElement('table');
	table.className = 'view-table';
	const thead = document.createElement('thead');
	const headRow = document.createElement('tr');

	// helper to create header cell with click-to-cycle sort
	function makeTh(key, label) {
		const th = document.createElement('th');
		th.setAttribute('data-stat', key);
		th.tabIndex = 0;
		// give the name column a class so we can align it left
		th.className = 'view-th' + (key && key !== 'thumb' ? ' col-' + key : '');
		th.textContent = label;
		th.addEventListener('click', () => {
			// cycle: none -> desc -> asc -> none
			if (chartSortState.col !== key) { chartSortState.col = key; chartSortState.dir = -1; }
			else if (chartSortState.dir === -1) chartSortState.dir = 1;
			else { chartSortState.col = null; chartSortState.dir = 0; }
			updateSortedView(statKey, displayMode);
		});
		return th;
	}

	// Combined name column that will contain both image and name
	const nameHeader = makeTh('name', 'Name');
	nameHeader.className = 'view-th col-name';
	headRow.appendChild(nameHeader);
	headRow.appendChild(makeTh('health', 'Health'));
	
	// Create headers for skill and speed (split into specific values in Value mode)
	if (displayMode === 'Value') {
		// Create split headers for Value mode
		const skillValueHeader = document.createElement('th');
		skillValueHeader.className = 'view-th col-skill';
		skillValueHeader.textContent = 'Value';
		skillValueHeader.addEventListener('click', () => {
			if (chartSortState.col !== 'skill') { chartSortState.col = 'skill'; chartSortState.dir = -1; }
			else if (chartSortState.dir === -1) chartSortState.dir = 1;
			else { chartSortState.col = null; chartSortState.dir = 0; }
			updateSortedView(statKey, displayMode);
		});
		headRow.appendChild(skillValueHeader);

		const skillSizeHeader = document.createElement('th');
		skillSizeHeader.className = 'view-th col-skill';
		skillSizeHeader.textContent = 'Size';
		skillSizeHeader.addEventListener('click', () => {
			if (chartSortState.col !== 'skill') { chartSortState.col = 'skill'; chartSortState.dir = -1; }
			else if (chartSortState.dir === -1) chartSortState.dir = 1;
			else { chartSortState.col = null; chartSortState.dir = 0; }
			updateSortedView(statKey, displayMode);
		});
		headRow.appendChild(skillSizeHeader);

		const speedWalkHeader = document.createElement('th');
		speedWalkHeader.className = 'view-th col-speed';
		speedWalkHeader.textContent = 'Walk';
		speedWalkHeader.addEventListener('click', () => {
			if (chartSortState.col !== 'speed') { chartSortState.col = 'speed'; chartSortState.dir = -1; }
			else if (chartSortState.dir === -1) chartSortState.dir = 1;
			else { chartSortState.col = null; chartSortState.dir = 0; }
			updateSortedView(statKey, displayMode);
		});
		headRow.appendChild(speedWalkHeader);

		const speedRunHeader = document.createElement('th');
		speedRunHeader.className = 'view-th col-speed';
		speedRunHeader.textContent = 'Run';
		speedRunHeader.addEventListener('click', () => {
			if (chartSortState.col !== 'speed') { chartSortState.col = 'speed'; chartSortState.dir = -1; }
			else if (chartSortState.dir === -1) chartSortState.dir = 1;
			else { chartSortState.col = null; chartSortState.dir = 0; }
			updateSortedView(statKey, displayMode);
		});
		headRow.appendChild(speedRunHeader);
	} else {
		// Single column headers for Stars mode
		const skillHeader = document.createElement('th');
		skillHeader.className = 'view-th col-skill';
		skillHeader.textContent = 'Skill';
		skillHeader.colSpan = 2;
		skillHeader.addEventListener('click', () => {
			if (chartSortState.col !== 'skill') { chartSortState.col = 'skill'; chartSortState.dir = -1; }
			else if (chartSortState.dir === -1) chartSortState.dir = 1;
			else { chartSortState.col = null; chartSortState.dir = 0; }
			updateSortedView(statKey, displayMode);
		});
		headRow.appendChild(skillHeader);

	const speedHeader = document.createElement('th');
	speedHeader.className = 'view-th col-speed';
	speedHeader.textContent = 'Speed';
	speedHeader.colSpan = 2;
	speedHeader.addEventListener('click', () => {
		if (chartSortState.col !== 'speed') { chartSortState.col = 'speed'; chartSortState.dir = -1; }
		else if (chartSortState.dir === -1) chartSortState.dir = 1;
		else { chartSortState.col = null; chartSortState.dir = 0; }
		updateSortedView(statKey, displayMode);
	});
	headRow.appendChild(speedHeader);
	}

	headRow.appendChild(makeTh('stam', 'Stamina'));
	headRow.appendChild(makeTh('stealth', 'Stealth'));
	headRow.appendChild(makeTh('extract', 'Extract'));
	thead.appendChild(headRow);

	
	table.appendChild(thead);

	const tbody = document.createElement('tbody');

	// Update header indicators for sort direction
	function refreshHeaderIndicators() {
		const ths = thead.querySelectorAll('th');
		ths.forEach(th => {
			const key = th.getAttribute('data-stat');
			// clear marker
			const marker = th.querySelector('.sort-marker');
			if (marker) marker.remove();
			if (chartSortState.col === key) {
				const m = document.createElement('span');
				m.className = 'sort-marker';
				m.textContent = chartSortState.dir === -1 ? ' ▼' : (chartSortState.dir === 1 ? ' ▲' : '');
				th.appendChild(m);
			}
		});
	}

	refreshHeaderIndicators();

	// Render rows
	sorted.forEach(item => {
		const tr = document.createElement('tr');

		const tdName = document.createElement('td');
		tdName.className = 'sorted-name';
		// Create a container for image and name
		const nameContainer = document.createElement('div');
		nameContainer.className = 'name-container';
		
		const img = document.createElement('img');
		img.src = item.toon ? `img/toons/${item.name.toLowerCase()}.png` : 'img/toons/goob.png';
		img.onerror = function(){ this.src = 'img/toons/goob.png'; };
		img.className = 'toon-thumb';
		
		const nameSpan = document.createElement('span');
		nameSpan.textContent = item.name || 'Unknown';
		
		nameContainer.appendChild(img);
		nameContainer.appendChild(nameSpan);
		tdName.appendChild(nameContainer);
		tr.appendChild(tdName);

		statsOrder.forEach(stat => {
			const val = item.stats[stat] || 0;
			if (!displayMode || displayMode === 'Stars') {
				const td = document.createElement('td');
				td.className = 'sorted-stat col-' + stat;
				if (stat === 'health') td.textContent = val > 0 ? '❤'.repeat(val) : '';
				else td.textContent = val > 0 ? '★'.repeat(val) : '';
				if (stat === 'skill' || stat === 'speed') td.colSpan = 2;
				tr.appendChild(td);
			} else {
				if (stat === 'skill' || stat === 'speed') {
					// For skill and speed in value mode, we create split cells
					tr.insertAdjacentHTML('beforeend', formatStatValueHTML(stat, val, 'table'));
				} else {
					const td = document.createElement('td');
					td.className = 'sorted-stat col-' + stat;
					td.textContent = val > 0 ? formatStatValueGlobal(stat, val) : '';
					tr.appendChild(td);
				}
			}
		});		tbody.appendChild(tr);
	});

	table.appendChild(tbody);
	container.appendChild(table);
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

		// Use global formatter for converting star rating to value

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
				if (stat === 'health') {
					const heart = '❤';
					el.textContent = val > 0 ? heart.repeat(val) : '';
				} else {
					const star = '★';
					el.textContent = val > 0 ? star.repeat(val) : '';
				}
		} else {
			// Value mode: use compact HTML for skill/speed to be more aesthetic
			if (val > 0) {
				if (stat === 'skill' || stat === 'speed') {
					el.innerHTML = formatStatValueHTML(stat, val);
				} else {
					el.textContent = formatStatValueGlobal(stat, val);
				}
			} else {
				el.textContent = '';
			}
		}
	});		// Update profile name display
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
