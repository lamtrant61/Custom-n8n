export const generatePassword = (length: number = 12): string => {
	if (length < 3) {
		throw new Error('Password length must be at least 3 to include all character types.');
	}

	const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
	const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const numbers = '0123456789';
	const allChars = lowerChars + upperChars + numbers;

	// Pick at least one of each required type
	const password = [
		lowerChars[Math.floor(Math.random() * lowerChars.length)],
		upperChars[Math.floor(Math.random() * upperChars.length)],
		numbers[Math.floor(Math.random() * numbers.length)],
	];

	// Fill the rest
	for (let i = password.length; i < length; i++) {
		password.push(allChars[Math.floor(Math.random() * allChars.length)]);
	}

	// Shuffle to avoid predictable positions
	for (let i = password.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[password[i], password[j]] = [password[j], password[i]];
	}

	return password.join('');
};
