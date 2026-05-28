#!/usr/bin/env node

console.log('🧪 开始测试《消除达人》游戏...\n');

// 测试配置
const testResults = [];

function test(name, fn) {
    try {
        fn();
        console.log(`✅ ${name}`);
        testResults.push({ name, status: 'pass' });
    } catch (error) {
        console.log(`❌ ${name}: ${error.message}`);
        testResults.push({ name, status: 'fail', error: error.message });
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

// 测试游戏类
test('游戏类存在', () => {
    assert(typeof EliminationGame !== 'undefined', 'EliminationGame 类未定义');
});

test('游戏实例创建', () => {
    assert(game instanceof EliminationGame, '游戏实例创建失败');
});

test('初始状态正确', () => {
    assert(game.currentLevel === 1, '初始关卡应为1');
    assert(game.data.coins === 100, '初始金币应为100');
});

test('关卡配置正确', () => {
    const config1 = game.getLevelConfig(1);
    assert(config1.gridSize === 4, '第1关应为4x4网格');
    assert(config1.iconTypes === 4, '第1关应有4种图标');
    
    const config15 = game.getLevelConfig(15);
    assert(config15.gridSize === 5, '第15关应为5x5网格');
});

test('网格生成', () => {
    game.generateGrid(4);
    assert(game.grid.length === 4, '网格高度应为4');
    assert(game.grid[0].length === 4, '网格宽度应为4');
});

test('消除判定逻辑', () => {
    const item1 = { x: 0, y: 0, iconType: 0 };
    const item2 = { x: 1, y: 0, iconType: 0 };
    const item3 = { x: 0, y: 0, iconType: 1 };
    
    assert(game.isAdjacent(item1, item2) === true, '相邻判定失败');
    assert(game.isAdjacent(item1, item3) === false, '同位置判定失败');
});

test('道具系统', () => {
    const initialTips = game.data.props.tips;
    game.useProp('tips');
    assert(game.data.props.tips === initialTips - 1, '道具使用失败');
});

test('时间添加', () => {
    game.timeLeft = 10;
    game.addTime(30);
    assert(game.timeLeft === 40, '加时功能失败');
});

test('星星计算', () => {
    assert(game.calculateStars(20) === 3, '50%以内应为3星');
    assert(game.calculateStars(40) === 2, '80%以内应为2星');
    assert(game.calculateStars(55) === 1, '超过80%应为1星');
});

test('数据存储', () => {
    game.data.coins = 999;
    game.saveData();
    const saved = localStorage.getItem('eliminationGameData');
    assert(saved !== null, '数据保存失败');
    const parsed = JSON.parse(saved);
    assert(parsed.coins === 999, '数据读取失败');
});

test('提示功能', () => {
    game.generateGrid(4);
    const hint = game.findHint();
    assert(hint !== null, '应该能找到可消除的对');
});

// 输出测试结果
console.log('\n========================================');
console.log('📊 测试结果汇总');
console.log('========================================\n');

const passed = testResults.filter(r => r.status === 'pass').length;
const failed = testResults.filter(r => r.status === 'fail').length;

console.log(`总计: ${testResults.length} 个测试`);
console.log(`✅ 通过: ${passed} 个`);
console.log(`❌ 失败: ${failed} 个\n`);

if (failed > 0) {
    console.log('失败详情:');
    testResults.filter(r => r.status === 'fail').forEach(r => {
        console.log(`  - ${r.name}: ${r.error}`);
    });
}

console.log('\n========================================\n');

if (failed === 0) {
    console.log('🎉 所有测试通过！游戏功能正常。\n');
} else {
    console.log('⚠️  部分测试失败，请检查相关功能。\n');
}
