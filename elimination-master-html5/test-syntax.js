#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 检查《消除达人》项目文件...\n');

const projectDir = __dirname;
let allPassed = true;

// 检查必需文件
const requiredFiles = [
    'index.html',
    'package.json',
    'README.md',
    'game.json'
];

console.log('📁 文件完整性检查:');
requiredFiles.forEach(file => {
    const filePath = path.join(projectDir, file);
    const exists = fs.existsSync(filePath);
    console.log(`${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allPassed = false;
});

// 检查 index.html 内容
console.log('\n📝 HTML 内容检查:');
const htmlPath = path.join(projectDir, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

const checks = [
    { name: '游戏容器', pattern: 'id="game-container"' },
    { name: '开始场景', pattern: 'id="start-scene"' },
    { name: '关卡选择', pattern: 'id="level-select-scene"' },
    { name: '游戏场景', pattern: 'id="game-scene"' },
    { name: '结算场景', pattern: 'id="result-scene"' },
    { name: '网格容器', pattern: 'id="grid-container"' },
    { name: '游戏类定义', pattern: 'class EliminationGame' },
    { name: '道具系统', pattern: 'useProp' },
    { name: '广告系统', pattern: 'simulateAd' },
    { name: '数据存储', pattern: 'localStorage' },
    { name: '计时器', pattern: 'startTimer' },
    { name: '消除逻辑', pattern: 'tryEliminate' },
    { name: '提示功能', pattern: 'findHint' },
    { name: '星星计算', pattern: 'calculateStars' }
];

checks.forEach(check => {
    const found = htmlContent.includes(check.pattern);
    console.log(`${found ? '✅' : '❌'} ${check.name}`);
    if (!found) allPassed = false;
});

// 统计代码行数
console.log('\n📊 代码统计:');
const lines = htmlContent.split('\n').length;
const characters = htmlContent.length;
console.log(`总行数: ${lines}`);
console.log(`总字符: ${characters}`);
console.log(`预计大小: ${(characters / 1024).toFixed(2)} KB`);

// 检查 JavaScript 语法（简单检查）
console.log('\n🔧 JavaScript 语法检查:');
const jsMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>/);
if (jsMatch) {
    const jsCode = jsMatch[1];
    const functionCount = (jsCode.match(/function\s+\w+/g) || []).length;
    const classCount = (jsCode.match(/class\s+\w+/g) || []).length;
    const methodCount = (jsCode.match(/\w+\s*\([^)]*\)\s*{/g) || []).length;
    
    console.log(`类定义: ${classCount}`);
    console.log(`函数定义: ${functionCount}`);
    console.log(`方法定义: ${methodCount}`);
}

console.log('\n========================================\n');

if (allPassed) {
    console.log('✅ 所有检查通过！项目文件完整。\n');
    console.log('🚀 下一步:');
    console.log('1. 直接用浏览器打开 index.html 测试游戏');
    console.log('2. 或运行 npm install && npm start 启动开发服务器\n');
} else {
    console.log('❌ 部分检查失败，请修复后再试。\n');
}
