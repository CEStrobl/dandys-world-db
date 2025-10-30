// Database of toons converted to a JavaScript data structure
// Fields: name, health, skill, speed, stam, stealth, extract

const TOONS = [
	{ name: 'Astro', health: 2, skill: 2, speed: 3, stam: 3, stealth: 5, extract: 3 },
	{ name: 'Bassie', health: 2, skill: 1, speed: 5, stam: 4, stealth: 4, extract: 2 },
	{ name: 'Blot', health: 3, skill: 1, speed: 4, stam: 5, stealth: 3, extract: 2 },
	{ name: 'Bobette', health: 2, skill: 4, speed: 3, stam: 5, stealth: 2, extract: 2 },
	{ name: 'Boxten', health: 3, skill: 3, speed: 3, stam: 3, stealth: 3, extract: 3 },
	{ name: 'Brightney', health: 3, skill: 3, speed: 3, stam: 4, stealth: 1, extract: 4 },
	{ name: 'Coal', health: 3, skill: 2, speed: 4, stam: 4, stealth: 3, extract: 2 },
	{ name: 'Cocoa', health: 3, skill: 3, speed: 4, stam: 2, stealth: 4, extract: 2 },
	{ name: 'Connie', health: 3, skill: 2, speed: 1, stam: 3, stealth: 5, extract: 4 },
	{ name: 'Cosmo', health: 3, skill: 1, speed: 3, stam: 4, stealth: 4, extract: 3 },
	{ name: 'Eclipse', health: 3, skill: 3, speed: 4, stam: 3, stealth: 2, extract: 3 },
	{ name: 'Eggson', health: 3, skill: 3, speed: 3, stam: 3, stealth: 3, extract: 3 },
	{ name: 'Finn', health: 3, skill: 4, speed: 3, stam: 2, stealth: 3, extract: 3 },
	{ name: 'Flutter', health: 3, skill: 2, speed: 4, stam: 4, stealth: 3, extract: 2 },
	{ name: 'Flyte', health: 3, skill: 2, speed: 4, stam: 2, stealth: 3, extract: 4 },
	{ name: 'Gigi', health: 3, skill: 5, speed: 3, stam: 1, stealth: 3, extract: 3 },
	{ name: 'Ginger', health: 3, skill: 3, speed: 2, stam: 3, stealth: 4, extract: 3 },
	{ name: 'Glisten', health: 3, skill: 2, speed: 3, stam: 3, stealth: 2, extract: 5 },
	{ name: 'Goob', health: 3, skill: 3, speed: 4, stam: 4, stealth: 2, extract: 2 },
	{ name: 'Gourdy', health: 2, skill: 5, speed: 4, stam: 1, stealth: 1, extract: 5 },
	{ name: 'Looey', health: 3, skill: 4, speed: 3, stam: 3, stealth: 2, extract: 3 },
	{ name: 'Pebble', health: 2, skill: 3, speed: 5, stam: 4, stealth: 3, extract: 1 },
	{ name: 'Poppy', health: 3, skill: 3, speed: 3, stam: 3, stealth: 3, extract: 3 },
	{ name: 'RazzleDazzle', health: 3, skill: 3, speed: 3, stam: 3, stealth: 3, extract: 3 },
	{ name: 'Ribecca', health: 3, skill: 3, speed: 3, stam: 3, stealth: 3, extract: 3 },
	{ name: 'Rodger', health: 3, skill: 3, speed: 2, stam: 3, stealth: 3, extract: 4 },
	{ name: 'Rudie', health: 3, skill: 3, speed: 3, stam: 3, stealth: 3, extract: 3 },
	{ name: 'Scraps', health: 3, skill: 2, speed: 2, stam: 5, stealth: 3, extract: 3 },
	{ name: 'Shelly', health: 2, skill: 5, speed: 3, stam: 2, stealth: 3, extract: 3 },
	{ name: 'Shrimpo', health: 3, skill: 1, speed: 1, stam: 1, stealth: 1, extract: 1 },
	{ name: 'Soulvester', health: 4, skill: 5, speed: 1, stam: 1, stealth: 3, extract: 5 },
	{ name: 'Sprout', health: 2, skill: 2, speed: 4, stam: 5, stealth: 3, extract: 2 },
	{ name: 'Teagen', health: 3, skill: 3, speed: 3, stam: 4, stealth: 2, extract: 3 },
	{ name: 'Tisha', health: 3, skill: 4, speed: 4, stam: 2, stealth: 3, extract: 2 },
	{ name: 'Toodles', health: 3, skill: 3, speed: 3, stam: 3, stealth: 4, extract: 2 },
	{ name: 'Vee', health: 2, skill: 4, speed: 2, stam: 3, stealth: 2, extract: 5 },
	{ name: 'Yatta', health: 3, skill: 3, speed: 4, stam: 1, stealth: 2, extract: 5 }
];

// Convenience helpers
const STATS = ['health','skill','speed','stam','stealth','extract'];

function getToon(name) {
	return TOONS.find(t => t.name.toLowerCase() === String(name).toLowerCase()) || null;
}

function toChartSeries(stat) {
	// returns an array of { name, value } for the given stat
	if (!STATS.includes(stat)) throw new Error('Unknown stat: ' + stat);
	return TOONS.map(t => ({ name: t.name, value: t[stat] }));
}

// Export for CommonJS/ESModule/browser globals
// Value chart converted to JS dataset
// Each star rating maps to various game values
const STAR_VALUE = [
    { 
        star: 1, 
        skill: [1.0, 50],
        speed: [10.0, 20.0],
        stamina: 100, 
        stealth: 0, 
        extract: 0.75
    },
    { 
        star: 2, 
        skill: [1.5, 100], 
        speed: [12.5, 22.5], 
        stamina: 125, 
        stealth: 5, 
        extract: 0.85 
    },
    { 
        star: 3, 
        skill: [2.0, 150], 
        speed: [15.0, 25.0], 
        stamina: 150, 
        stealth: 10, 
        extract: 1.00
    },
    { 
        star: 4, 
        skill: [2.5, 200], 
        speed: [17.5, 27.5],
        stamina: 175, 
        stealth: 15, 
        extract: 1.20
    },
    { 
        star: 5, 
        skill: [3.0, 250],
        speed : [20.0, 30.0],
        stamina: 200, 
        stealth: 20, 
        extract: 1.50
    }
];

const VALUE_KEYS = ['skill', 'skillSize', 'speed', 'walk', 'run', 'stamina', 'stealth', 'extract'];

function getValueRow(v) {
	return STAR_VALUE.find(r => r.star === Number(v)) || null;
}

function valueSeries(key) {
	if (!VALUE_KEYS.includes(key)) throw new Error('Unknown value key: ' + key);
	return STAR_VALUE.map(r => ({ star: r.star, [key]: r[key] }));
}

// Export extended API
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { TOONS, STATS, getToon, toChartSeries, STAR_VALUE, VALUE_KEYS, getValueRow, valueSeries };
} else {
	window.TOONS = TOONS;
	window.STATS = STATS;
	window.getToon = getToon;
	window.toChartSeries = toChartSeries;
	window.STAR_VALUE = STAR_VALUE;
	window.VALUE_KEYS = VALUE_KEYS;
	window.getValueRow = getValueRow;
	window.valueSeries = valueSeries;
}