// small UI helpers
document.addEventListener('DOMContentLoaded', () => {
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
			// placeholder behavior
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
