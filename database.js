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



// Trinket Database
const TRINKETS = [
    {
        id: "coin_purse",
        name: "Coin Purse",
        description: "Start the round with 30 extra Tapes.",
        rarity: "common",
        slotType: "passive",
        effects: [{
            type: "resource",
            resource: "tapes",
            value: 30,
            condition: {
                type: "roundStart"
            }
        }]
    },
    {
        id: "research_map",
        name: "Research Map",
        description: "Highlights all Research Capsules every 10 seconds during matches.",
        rarity: "common",
        slotType: "passive",
        effects: [{
            type: "highlight",
            target: "researchCapsules",
            interval: 10
        }]
    },
    {
        id: "wrench",
        name: "Wrench", 
        description: "Instantly adds a large amount of completion to the first Machine you extract from on any Floor.",
        rarity: "rare",
        slotType: "conditional",
        effects: [{
            type: "extraction",
            value: 0.5, // 50% completion
            condition: {
                type: "firstMachine",
                perFloor: true,
                uses: 1
            }
        }]
    },
    {
        id: "machine_manual",
        name: "Machine Manual",
        description: "Increases your Extraction Speed by 5%.",
        rarity: "common",
        slotType: "passive",
        effects: [{
            stats: ["extract"],
            type: "multiplier",
            value: 1.05
        }]
    },
    {
        id: "speedy_shoes",
        name: "Speedy Shoes",
        description: "Increases both Walk and Run Speed by 5%.",
        rarity: "common",
        slotType: "passive",
        effects: [{
            stats: ["speed"],
            type: "multiplier",
            value: 1.05
        }]
    },
    {
        id: "speedometer",
        name: "Speedometer",
        description: "Grants the user 15 more Stamina.",
        rarity: "common",
        slotType: "passive",
        effects: [{
            stats: ["stam"],
            type: "flat",
            value: 15
        }]
    },
    {
        id: "thinking_cap",
        name: "Thinking Cap",
        description: "Increases Skill Check Window size by 40 units.",
        rarity: "uncommon",
        slotType: "passive",
        effects: [{
            type: "skillCheck",
            property: "size",
            value: 40
        }]
    },
    {
        id: "alarm",
        name: "Alarm",
        description: "Increases Movement Speed by 25% when Panic Mode activates for 10 seconds.",
        rarity: "rare",
        slotType: "conditional",
        effects: [{
            stats: ["speed"],
            type: "multiplier",
            value: 1.25,
            duration: 10,
            condition: {
                type: "panicMode"
            }
        }]
    },
    {
        id: "thermos",
        name: "Thermos",
        description: "Increases your Stamina Regeneration by 15%.",
        rarity: "common",
        slotType: "passive",
        effects: [{
            type: "stamRegen",
            value: 1.15
        }]
    },
    {
        id: "pull_toy",
        name: "Pull Toy",
        description: "Increases Movement Speed by 25% when a new Floor arrives for 10 seconds.",
        rarity: "uncommon",
        slotType: "conditional",
        effects: [{
            stats: ["speed"],
            type: "multiplier",
            value: 1.25,
            duration: 10,
            condition: {
                type: "newFloor"
            }
        }]
    },
    {
        id: "pop_pack",
        name: "Pop Pack",
        description: "Grants the 'Pop' Item every new Floor (if user's inventory has a slot open).",
        rarity: "uncommon",
        slotType: "conditional",
        effects: [{
            type: "grantItem",
            item: "pop",
            condition: {
                type: "newFloor",
                requiresSlot: true
            }
        }]
    },
    {
        id: "megaphone",
        name: "Megaphone",
        description: "Grants the 'Air Horn' Item every other Floor (If user's inventory has a slot open)",
        rarity: "uncommon",
        slotType: "conditional",
        effects: [{
            type: "grantItem",
            item: "airHorn",
            condition: {
                type: "floorNumber",
                operator: "even",
                requiresSlot: true
            }
        }]
    },
    {
        id: "cooler",
        name: "Cooler",
        description: "Grants the user 50 more Stamina, but lowers Movement Speed by 5%.",
        rarity: "uncommon",
        slotType: "passive",
        effects: [
            {
                stats: ["stam"],
                type: "flat",
                value: 50
            },
            {
                stats: ["speed"],
                type: "multiplier",
                value: 0.95
            }
        ]
    },
    {
        id: "cardboard_armor",
        name: "Cardboard Armor",
        description: "Protects the user from long-ranged Twisted attacks. Limit of 1 activation per Floor.",
        rarity: "rare",
        slotType: "conditional",
        effects: [{
            type: "protection",
            attackType: "longRange",
            condition: {
                type: "perFloor",
                uses: 1
            }
        }]
    },
    {
        id: "blue_bandana",
        name: "Blue Bandana",
        description: "Increases your Extraction Speed by 7.5%, but reduces Skill Check chances by 5%.",
        rarity: "uncommon",
        slotType: "passive",
        effects: [
            {
                stats: ["extract"],
                type: "multiplier",
                value: 1.075
            },
            {
                type: "skillCheck",
                property: "chance",
                value: 0.95
            }
        ]
    },
    {
        id: "bone",
        name: "Bone",
        description: "Increases Movement Speed by 25% for 4 seconds upon collecting or receiving an Item. Effect can stack but caps at 40 Speed.",
        rarity: "uncommon",
        slotType: "conditional",
        effects: [{
            stats: ["speed"],
            type: "multiplier",
            value: 1.25,
            maxStacks: 40,
            duration: 4,
            condition: {
                type: "itemPickup",
                excludes: ["capsule", "tape"]
            }
        }]
    },
    {
        id: "brick",
        name: "Brick",
        description: "Lowers both Walk and Run Speed by 10%. It's a brick, what did you expect?",
        rarity: "common",
        slotType: "passive",
        effects: [{
            stats: ["speed"],
            type: "multiplier",
            value: 0.90
        }]
    },
    {
        id: "clown_horn",
        name: "Clown Horn",
        description: "Increases Walk and Run speed by 10% on odd-numbered Floors.",
        rarity: "uncommon",
        slotType: "conditional",
        effects: [{
            stats: ["speed"],
            type: "multiplier",
            value: 1.10,
            condition: {
                type: "floorNumber",
                operator: "odd"
            }
        }]
    },
    {
        id: "crayon_set",
        name: "Crayon Set",
        description: "Get an Item from the Uncommon tier at the start of every Floor. Dandy's Shop exclusive Items are included",
        rarity: "rare",
        slotType: "conditional",
        effects: [{
            type: "grantItem",
            itemTier: "uncommon",
            includeShop: true,
            condition: {
                type: "newFloor"
            }
        }]
    },
    {
        id: "dandy_plush",
        name: "Dandy Plush",
        description: "Grants the user a 50% discount on all Dandy's Shop Items during intermissions on even Floors.",
        rarity: "rare",
        slotType: "conditional",
        effects: [{
            type: "shopDiscount",
            value: 0.5,
            condition: {
                type: "floorNumber",
                operator: "even",
                phase: "intermission"
            }
        }]
    },
    {
        id: "diary",
        name: "Diary",
        description: "Increases Stealth by 25%.",
        rarity: "uncommon",
        slotType: "passive",
        effects: [{
            stats: ["stealth"],
            type: "multiplier",
            value: 1.25
        }]
    },
    {
        id: "dog_plush",
        name: "Dog Plush",
        description: "Increases Walk Speed by 10%.",
        rarity: "common",
        slotType: "passive",
        effects: [{
            stats: ["speed"],
            type: "multiplier",
            value: 1.10
        }]
    },
    {
        id: "fancy_purse",
        name: "Fancy Purse",
        description: "Start with 100 extra Tapes.",
        rarity: "rare",
        slotType: "passive",
        effects: [{
            type: "resource",
            resource: "tapes",
            value: 100,
            condition: {
                type: "roundStart"
            }
        }]
    },
    {
        id: "feather_duster",
        name: "Feather Duster",
        description: "Restores 20 Stamina when picking up an Item.",
        rarity: "uncommon",
        slotType: "conditional",
        effects: [{
            stats: ["stam"],
            type: "heal",
            value: 20,
            condition: {
                type: "itemPickup",
                excludes: ["capsule", "tape"]
            }
        }]
    },
    {
        id: "fishing_rod",
        name: "Fishing Rod",
        description: "Start with 3 random Items from the Common to Rare tiers.",
        rarity: "rare",
        slotType: "passive",
        effects: [{
            type: "grantItem",
            count: 3,
            itemTiers: ["common", "uncommon", "rare"],
            excludeShop: true,
            condition: {
                type: "roundStart"
            }
        }]
    },
    {
        id: "friendship_bracelet",
        name: "Friendship Bracelet",
        description: "Gain 5 more Stamina for every alive Toon in the round. Maxes out at 40 Stamina.",
        rarity: "uncommon",
        slotType: "passive",
        effects: [{
            stats: ["stam"],
            type: "dynamic",
            value: 5,
            maxValue: 40,
            condition: {
                type: "aliveToons"
            }
        }]
    },
    {
        id: "ghost_snakes",
        name: "Ghost Snakes In A Can",
        description: "Reduces your Active Ability cooldown by 5 seconds.",
        rarity: "rare",
        slotType: "passive",
        effects: [{
            type: "abilityCooldown",
            value: -5
        }]
    },
    {
        id: "lucky_coin",
        name: "Lucky Coin",
        description: "Boosts a random Stat by 12% once every Floor, effect wears off at the start of each Floor.",
        rarity: "uncommon",
        slotType: "conditional",
        effects: [{
            type: "randomStat",
            value: 1.12,
            duration: "floor",
            condition: {
                type: "newFloor"
            }
        }]
    },
    {
        id: "magnifying_glass",
        name: "Magnifying Glass",
        description: "Adds slightly more completion when performing a successful Skill Check, but decreases Skill Check Size by 33%.",
        rarity: "rare",
        slotType: "passive",
        effects: [
            {
                type: "skillCheck",
                property: "size",
                value: 0.67,
                type: "multiplier"
            },
            {
                type: "skillCheck",
                property: "successValue",
                value: 1.75
            }
        ]
    },
    {
        id: "mime_makeup",
        name: "Mime Makeup",
        description: "Twisteds will no longer be alerted if a Skill Check is failed.",
        rarity: "rare",
        slotType: "passive",
        effects: [{
            type: "skillCheck",
            property: "silentFail",
            value: true
        }]
    },
    {
        id: "paint_bucket",
        name: "Paint Bucket",
        description: "Increases Skill Check size and chance by 5%.",
        rarity: "common",
        slotType: "passive",
        effects: [
            {
                type: "skillCheck",
                property: "size",
                value: 1.05,
                type: "multiplier"
            },
            {
                type: "skillCheck",
                property: "chance",
                value: 1.05,
                type: "multiplier"
            }
        ]
    },
    {
        id: "participation_award",
        name: "Participation Award",
        description: "Increases Skill Check Chance by 25%, but decreases Skill Check Size by 10%.",
        rarity: "uncommon",
        slotType: "passive",
        effects: [
            {
                type: "skillCheck",
                property: "chance",
                value: 1.25,
                type: "multiplier"
            },
            {
                type: "skillCheck",
                property: "size",
                value: 0.90,
                type: "multiplier"
            }
        ]
    },
    {
        id: "party_popper",
        name: "Party Popper",
        description: "When starting to work on a Machine, Twisteds in the initial nearby radius are highlighted for 5 seconds.",
        rarity: "uncommon",
        slotType: "conditional",
        effects: [{
            type: "highlight",
            target: "twisteds",
            radius: "nearby",
            duration: 5,
            condition: {
                type: "startMachine"
            }
        }]
    },
    {
        id: "pink_bow",
        name: "Pink Bow",
        description: "Increases Run Speed by 7.5%.",
        rarity: "common",
        slotType: "passive",
        effects: [{
            stats: ["speed"],
            type: "multiplier",
            value: 1.075
        }]
    },
    {
        id: "ribbon_spool",
        name: "Ribbon Spool",
        description: "Increases Walk and Run speed by 10% on even-numbered Floors.",
        rarity: "uncommon",
        slotType: "conditional",
        effects: [{
            stats: ["speed"],
            type: "multiplier",
            value: 1.10,
            condition: {
                type: "floorNumber",
                operator: "even"
            }
        }]
    },
    {
        id: "savory_charm",
        name: "Savory Charm",
        description: "Saves the user from a fatal attack, granting them invincibility for 10 seconds. Can only activate once.",
        rarity: "epic",
        slotType: "conditional",
        effects: [{
            type: "protection",
            value: "fatal",
            duration: 10,
            condition: {
                type: "fatalHit",
                uses: 1,
                excludes: ["lethal"]
            }
        }]
    },
    {
        id: "spare_bulb",
        name: "Spare Bulb",
        description: "Increases Blackout light radius by 25%. Also increases light radius for light-producing Toons.",
        rarity: "uncommon",
        slotType: "passive",
        effects: [{
            type: "light",
            value: 1.25,
            affects: ["blackout", "toonLight"]
        }]
    },
    {
        id: "star_pillow",
        name: "Star Pillow",
        description: "Increases Stamina Regeneration by 100% while extracting from a Machine.",
        rarity: "rare",
        slotType: "conditional",
        effects: [{
            type: "stamRegen",
            value: 2.0,
            condition: {
                type: "whileExtracting"
            }
        }]
    },
    {
        id: "sweet_charm",
        name: "Sweet Charm",
        description: "Decreases Active Ability Cooldown by 8%.",
        rarity: "uncommon",
        slotType: "passive",
        effects: [{
            type: "abilityCooldown",
            value: 0.92,
            type: "multiplier"
        }]
    },
    {
        id: "train_whistle",
        name: "Train Whistle",
        description: "Makes the user immune to the Slow Debuff.",
        rarity: "uncommon",
        slotType: "passive",
        effects: [{
            type: "immunity",
            debuff: "slow"
        }]
    },
    {
        id: "vanity_mirror",
        name: "Vanity Mirror",
        description: "Increases Run Speed by 30% during Panic Mode.",
        rarity: "rare",
        slotType: "conditional",
        effects: [{
            stats: ["speed"],
            type: "multiplier",
            value: 1.30,
            condition: {
                type: "panicMode"
            }
        }]
    },
    {
        id: "vees_remote",
        name: "Vees Remote",
        description: "Instantly completes the first Machine you extract from on any Floor, but only if the number of Machines completed is below 50%.",
        rarity: "legendary",
        slotType: "conditional",
        effects: [{
            type: "extraction",
            value: 1.0,
            condition: {
                type: "firstMachine",
                perFloor: true,
                uses: 1,
                requireMachineProgress: {
                    type: "below",
                    value: 0.5
                }
            }
        }]
    },
    {
        id: "soul_sword",
        name: "Soul Sword",
        description: "When a Twisted damages the user, the Twisted receives 15% speed Debuff for 30 seconds. Does not stack.",
        rarity: "epic",
        slotType: "conditional",
        effects: [{
            type: "debuff",
            stats: ["speed"],
            value: 0.85,
            duration: 30,
            condition: {
                type: "onDamaged",
                source: "twisted",
                noStack: true
            }
        }]
    },
    {
        id: "memory_locket",
        name: "Memory Locket",
        description: "If the user is not at full health, highlights all healing Items currently on the Floor to the user until the user is healed.",
        rarity: "rare",
        slotType: "conditional",
        effects: [{
            type: "highlight",
            target: "healingItems",
            condition: {
                type: "notFullHealth"
            }
        }]
    },
    {
        id: "blushy_bat",
        name: "Blushy Bat",
        description: "Increases the Attack Cooldown of any Twisted that attacks the user by 3 seconds.",
        rarity: "epic",
        slotType: "conditional",
        effects: [{
            type: "debuff",
            property: "attackCooldown",
            value: 3,
            condition: {
                type: "onDamaged",
                source: "twisted"
            }
        }]
    }
];

// Constants for trinket system
const TRINKET_TYPES = {
    PASSIVE: "passive",
    ACTIVE: "active",
    CONDITIONAL: "conditional"
};

const TRINKET_RARITY = {
    COMMON: "common",
    UNCOMMON: "uncommon",
    RARE: "rare",
    EPIC: "epic",
    LEGENDARY: "legendary"
};

const EFFECT_TYPES = {
    MULTIPLIER: "multiplier",
    FLAT: "flat",
    RESOURCE: "resource",
    HIGHLIGHT: "highlight",
    PROTECTION: "protection",
    SKILL_CHECK: "skillCheck",
    EXTRACTION: "extraction",
    GRANT_ITEM: "grantItem"
};



