#!/usr/bin/env node

// Data integrity verification script for RPG game files

const fs = require('fs');
const path = require('path');

// Load the modules
let data, skills, questgen;
try {
    data = require('./js/data.js');
    skills = require('./js/skills.js');
    questgen = require('./js/questgen.js');
} catch (err) {
    console.error('Failed to load modules:', err.message);
    process.exit(1);
}

const issues = [];
const warnings = [];

console.log('='.repeat(70));
console.log('RPG DATA INTEGRITY VERIFICATION');
console.log('='.repeat(70));

// ============================================================================
// A. Verify all files parse correctly (already done by require)
// ============================================================================
console.log('\n[A] FILE SYNTAX CHECK');
console.log('✓ data.js - Syntax OK');
console.log('✓ skills.js - Syntax OK');
console.log('✓ questgen.js - Syntax OK');

// ============================================================================
// B. Verify all grantedSkill IDs in EQUIPMENT exist in SKILLS
// ============================================================================
console.log('\n[B] EQUIPMENT -> SKILLS REFERENCES');

const EQUIPMENT = data.EQUIPMENT || {};
const LOOT_ITEMS = data.LOOT_ITEMS || {};
const SKILLS = skills.SKILLS || {};
const skillKeys = Object.keys(SKILLS);

let equipmentWithSkills = 0;
let skillReferencesChecked = 0;

for (const [equipId, equip] of Object.entries(EQUIPMENT)) {
    if (equip.grantedSkill) {
        equipmentWithSkills++;
        skillReferencesChecked++;
        if (!SKILLS[equip.grantedSkill]) {
            issues.push(`EQUIPMENT[${equipId}].grantedSkill references non-existent SKILL: "${equip.grantedSkill}"`);
        }
    }
}

if (issues.filter(i => i.includes('grantedSkill')).length === 0) {
    console.log(`✓ All ${equipmentWithSkills} equipment items with grantedSkill reference valid SKILLS`);
} else {
    console.log(`✗ Found issues with grantedSkill references (see details below)`);
}

// ============================================================================
// C. Verify item IDs in RANK_LOOT_POOLS exist in EQUIPMENT or LOOT_ITEMS
// ============================================================================
console.log('\n[C] RANK_LOOT_POOLS -> DATA REFERENCES');

const RANK_LOOT_POOLS = questgen.RANK_LOOT_POOLS || {};
const allItemIds = new Set([...Object.keys(EQUIPMENT), ...Object.keys(LOOT_ITEMS)]);

let poolItemsChecked = 0;
for (const [rank, pool] of Object.entries(RANK_LOOT_POOLS)) {
    if (Array.isArray(pool)) {
        for (const itemId of pool) {
            poolItemsChecked++;
            if (!allItemIds.has(itemId)) {
                issues.push(`RANK_LOOT_POOLS[${rank}] references non-existent item: "${itemId}"`);
            }
        }
    }
}

if (issues.filter(i => i.includes('RANK_LOOT_POOLS')).length === 0) {
    console.log(`✓ All ${poolItemsChecked} items in RANK_LOOT_POOLS exist in EQUIPMENT or LOOT_ITEMS`);
} else {
    console.log(`✗ Found missing item references in RANK_LOOT_POOLS (see details below)`);
}

// ============================================================================
// D. Check QUESTS object for item references
// ============================================================================
console.log('\n[D] QUESTS OBJECT LOOT VALIDATION');

const QUESTS = data.QUESTS || {};
let questItemsChecked = 0;
let questsWithLoot = 0;

for (const [questId, quest] of Object.entries(QUESTS)) {
    if (quest.lootTable && Array.isArray(quest.lootTable)) {
        questsWithLoot++;
        for (const lootItem of quest.lootTable) {
            let itemId = lootItem;

            // Handle different loot formats
            if (typeof lootItem === 'object' && lootItem.itemId) {
                itemId = lootItem.itemId;
            } else if (typeof lootItem === 'object' && lootItem.item) {
                itemId = lootItem.item;
            } else if (typeof lootItem === 'object' && lootItem.id) {
                itemId = lootItem.id;
            }

            questItemsChecked++;
            if (!allItemIds.has(itemId)) {
                issues.push(`QUESTS[${questId}].lootTable references non-existent item: "${itemId}"`);
            }
        }
    }
}

if (issues.filter(i => i.includes('QUESTS')).length === 0) {
    console.log(`✓ All ${questItemsChecked} items in ${questsWithLoot} quests exist in EQUIPMENT or LOOT_ITEMS`);
} else {
    console.log(`✗ Found missing item references in QUESTS (see details below)`);
}

// ============================================================================
// E. Summary and Issues
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log('VERIFICATION SUMMARY');
console.log('='.repeat(70));

console.log(`\nObjects Analyzed:`);
console.log(`  • EQUIPMENT entries: ${Object.keys(EQUIPMENT).length}`);
console.log(`  • LOOT_ITEMS entries: ${Object.keys(LOOT_ITEMS).length}`);
console.log(`  • SKILLS entries: ${Object.keys(SKILLS).length}`);
console.log(`  • RANK_LOOT_POOLS entries: ${Object.keys(RANK_LOOT_POOLS).length}`);
console.log(`  • QUESTS entries: ${Object.keys(QUESTS).length}`);

console.log(`\nReferences Checked:`);
console.log(`  • Equipment -> Skills references: ${skillReferencesChecked}`);
console.log(`  • Loot pool items: ${poolItemsChecked}`);
console.log(`  • Quest loot items: ${questItemsChecked}`);

if (issues.length === 0 && warnings.length === 0) {
    console.log('\n✓ ALL CHECKS PASSED - No integrity issues found!');
    console.log('\n' + '='.repeat(70));
    process.exit(0);
} else {
    console.log('\n' + '='.repeat(70));
    if (issues.length > 0) {
        console.log(`\n✗ ISSUES FOUND (${issues.length}):\n`);
        issues.forEach((issue, idx) => {
            console.log(`  ${idx + 1}. ${issue}`);
        });
    }
    if (warnings.length > 0) {
        console.log(`\n⚠ WARNINGS (${warnings.length}):\n`);
        warnings.forEach((warning, idx) => {
            console.log(`  ${idx + 1}. ${warning}`);
        });
    }
    console.log('\n' + '='.repeat(70));
    process.exit(issues.length > 0 ? 1 : 0);
}
