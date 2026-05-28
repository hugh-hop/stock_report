#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔨 开始构建微信小游戏版本...\n');

const sourceDir = path.join(__dirname);
const outputDir = path.join(__dirname, 'dist');

// 创建输出目录
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 复制项目文件
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            if (entry.name !== 'node_modules' && entry.name !== 'dist') {
                copyDir(srcPath, destPath);
            }
        } else {
            if (entry.name.endsWith('.html')) {
                const content = fs.readFileSync(srcPath, 'utf8');
                fs.writeFileSync(path.join(dest, 'game.js'), `window.define && window.define(function(require, module, exports) { ${content} });`);
                console.log(`✓ 转换: ${entry.name} -> game.js`);
            } else {
                fs.copyFileSync(srcPath, destPath);
                console.log(`✓ 复制: ${entry.name}`);
            }
        }
    }
}

copyDir(sourceDir, outputDir);

console.log('\n✅ 构建完成！');
console.log(`📁 输出目录: ${outputDir}`);
console.log('\n下一步：');
console.log('1. 打开微信开发者工具');
console.log('2. 导入 dist 目录');
console.log('3. 配置 AppID');
console.log('4. 上传发布\n');
