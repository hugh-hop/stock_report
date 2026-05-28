
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Cocos Creator 项目资源复制工具

功能：
1. 保持原有的目录层级与资源引用关系不变
2. 自动适配目标 Cocos Creator 项目的版本与配置文件格式
3. 若目标路径存在同名文件，提供覆盖、跳过或重命名选项
4. 处理完成后输出详细的文件操作日志
"""

import os
import shutil
import argparse
import json
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict, Any


class FileOperation:
    SKIP = 'skip'
    OVERWRITE = 'overwrite'
    RENAME = 'rename'
    ASK = 'ask'


class CocosProjectCopier:
    def __init__(self, source_dir: str, target_dir: str, mode: str = 'ask'):
        self.source_dir = os.path.abspath(source_dir)
        self.target_dir = os.path.abspath(target_dir)
        self.mode = mode
        self.log_entries: List[Dict[str, Any]] = []
        self.copied_count = 0
        self.skipped_count = 0
        self.renamed_count = 0
        self.overwritten_count = 0
        self.start_time = datetime.now()
        
        # Cocos Creator 特定文件
        self.cocos_specific_files = [
            'project.json',
            'settings/',
            'library/',
            'temp/',
            'build/'
        ]
        
        # 需要复制的资源类型
        self.allowed_extensions = [
            '.ts', '.json', '.md', '.png', '.jpg', '.jpeg', '.webp',
            '.mp3', '.wav', '.ogg', '.prefab', '.scene', '.anim',
            '.material', '.effect', '.fbx', '.glb', '.gltf', '.atlas'
        ]
    
    def log(self, action: str, source: str, target: str, status: str, reason: str = ''):
        """记录文件操作日志"""
        self.log_entries.append({
            'timestamp': datetime.now().isoformat(),
            'action': action,
            'source': source,
            'target': target,
            'status': status,
            'reason': reason
        })
    
    def should_include_file(self, filename: str) -> bool:
        """判断是否应该包含该文件"""
        # 跳过隐藏文件
        if filename.startswith('.'):
            return False
        
        # 跳过特定文件
        for specific in self.cocos_specific_files:
            if specific.endswith('/'):
                if filename == specific[:-1]:
                    return False
            else:
                if filename == specific:
                    return False
        
        # 检查扩展名
        ext = os.path.splitext(filename)[1].lower()
        if ext in self.allowed_extensions or ext == '':
            return True
        
        return False
    
    def should_include_directory(self, dirname: str) -> bool:
        """判断是否应该包含该目录"""
        if dirname.startswith('.'):
            return False
        if dirname in ['node_modules', '.git', 'library', 'temp', 'build']:
            return False
        return True
    
    def get_operation_mode(self, target_path: str) -> str:
        """获取文件操作模式"""
        if self.mode == 'ask':
            print(f"\n目标文件已存在: {target_path}")
            print("请选择操作:")
            print("  [S] 跳过 (Skip)")
            print("  [O] 覆盖 (Overwrite)")
            print("  [R] 重命名 (Rename)")
            print("  [A] 全部覆盖 (All)")
            print("  [S] 全部跳过 (Skip All)")
            
            while True:
                choice = input("请输入选择 (S/O/R/A/S): ").strip().upper()
                if choice in ['S', 'O', 'R', 'A', 'SKIP', 'OVERWRITE', 'RENAME', 'ALL']:
                    if choice in ['A', 'ALL']:
                        self.mode = 'overwrite'
                        return 'overwrite'
                    elif choice in ['S', 'SKIP']:
                        # 检查是否是全局跳过
                        if len(input("是否全部跳过? (Y/N): ").strip().upper()) == 'Y':
                            self.mode = 'skip'
                        return 'skip'
                    elif choice in ['O', 'OVERWRITE']:
                        return 'overwrite'
                    elif choice in ['R', 'RENAME']:
                        return 'rename'
        else:
            return self.mode
    
    def copy_file(self, source_path: str, target_path: str):
        """复制单个文件"""
        try:
            # 确保目标目录存在
            os.makedirs(os.path.dirname(target_path), exist_ok=True)
            
            if os.path.exists(target_path):
                mode = self.get_operation_mode(target_path)
                
                if mode == 'skip':
                    self.log('COPY', source_path, target_path, 'SKIPPED', '文件已存在，选择跳过')
                    self.skipped_count += 1
                    return
                
                elif mode == 'rename':
                    base, ext = os.path.splitext(target_path)
                    counter = 1
                    new_target = f"{base}_{counter}{ext}"
                    while os.path.exists(new_target):
                        counter += 1
                        new_target = f"{base}_{counter}{ext}"
                    shutil.copy2(source_path, new_target)
                    self.log('COPY', source_path, new_target, 'RENAMED', '文件已存在，已重命名')
                    self.renamed_count += 1
                    return
                
                elif mode == 'overwrite':
                    shutil.copy2(source_path, target_path)
                    self.log('COPY', source_path, target_path, 'OVERWRITTEN', '文件已存在，已覆盖')
                    self.overwritten_count += 1
                    return
            
            # 正常复制
            shutil.copy2(source_path, target_path)
            self.log('COPY', source_path, target_path, 'COPIED', '成功复制')
            self.copied_count += 1
            
        except Exception as e:
            self.log('COPY', source_path, target_path, 'ERROR', str(e))
            print(f"❌ 复制失败: {source_path} -> {target_path}")
            print(f"   错误: {e}")
    
    def copy_directory(self, source_dir: str, target_dir: str):
        """递归复制目录"""
        if not os.path.isdir(source_dir):
            return
        
        for item in os.listdir(source_dir):
            source_path = os.path.join(source_dir, item)
            target_path = os.path.join(target_dir, item)
            
            if os.path.isdir(source_path):
                if self.should_include_directory(item):
                    self.copy_directory(source_path, target_path)
            else:
                if self.should_include_file(item):
                    self.copy_file(source_path, target_path)
    
    def update_project_json(self):
        """更新目标项目的 project.json 配置"""
        target_project_json = os.path.join(self.target_dir, 'project.json')
        
        if os.path.exists(target_project_json):
            try:
                with open(target_project_json, 'r', encoding='utf-8') as f:
                    project_config = json.load(f)
                
                # 更新必要的配置
                project_config['name'] = project_config.get('name', 'elimination-master')
                project_config['engineVersion'] = project_config.get('engineVersion', '3.8.0')
                
                with open(target_project_json, 'w', encoding='utf-8') as f:
                    json.dump(project_config, f, ensure_ascii=False, indent=2)
                
                self.log('UPDATE', 'project.json', target_project_json, 'UPDATED', '配置已更新')
                print("✅ 更新 project.json 配置")
            
            except Exception as e:
                self.log('UPDATE', 'project.json', target_project_json, 'ERROR', str(e))
                print(f"⚠️ 更新 project.json 失败: {e}")
    
    def generate_import_config(self):
        """生成资源导入配置"""
        config_dir = os.path.join(self.target_dir, 'settings')
        os.makedirs(config_dir, exist_ok=True)
        
        import_config = {
            "texture": {
                "default": {
                    "type": "png",
                    "width": 2048,
                    "height": 2048,
                    "format": "compressed",
                    "premultiplyAlpha": True,
                    "mipmap": False
                }
            },
            "audio": {
                "default": {
                    "loadMode": 1,
                    "compress": True,
                    "quality": 0.7
                }
            }
        }
        
        config_path = os.path.join(config_dir, 'import-config.json')
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(import_config, f, ensure_ascii=False, indent=2)
        
        self.log('GENERATE', 'import-config.json', config_path, 'CREATED', '导入配置已生成')
        print("✅ 生成资源导入配置")
    
    def print_summary(self):
        """打印操作摘要"""
        end_time = datetime.now()
        duration = (end_time - self.start_time).total_seconds()
        
        print("\n" + "="*60)
        print("📊 复制操作摘要")
        print("="*60)
        print(f"源目录: {self.source_dir}")
        print(f"目标目录: {self.target_dir}")
        print(f"开始时间: {self.start_time.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"结束时间: {end_time.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"耗时: {duration:.2f} 秒")
        print("-"*60)
        print(f"📥 复制成功: {self.copied_count} 个文件")
        print(f"🔄 覆盖替换: {self.overwritten_count} 个文件")
        print(f"📝 重命名保存: {self.renamed_count} 个文件")
        print(f"⏭️ 跳过忽略: {self.skipped_count} 个文件")
        print(f"📋 总操作数: {len(self.log_entries)}")
        print("="*60)
    
    def save_log(self, log_path: Optional[str] = None):
        """保存操作日志到文件"""
        if log_path is None:
            log_path = os.path.join(self.target_dir, 'copy_log.json')
        
        log_data = {
            'summary': {
                'source_dir': self.source_dir,
                'target_dir': self.target_dir,
                'start_time': self.start_time.isoformat(),
                'end_time': datetime.now().isoformat(),
                'copied_count': self.copied_count,
                'overwritten_count': self.overwritten_count,
                'renamed_count': self.renamed_count,
                'skipped_count': self.skipped_count
            },
            'operations': self.log_entries
        }
        
        with open(log_path, 'w', encoding='utf-8') as f:
            json.dump(log_data, f, ensure_ascii=False, indent=2)
        
        print(f"\n📝 操作日志已保存到: {log_path}")
    
    def run(self):
        """执行复制操作"""
        print("🚀 开始复制项目资源到 Cocos Creator 项目")
        print(f"源目录: {self.source_dir}")
        print(f"目标目录: {self.target_dir}")
        print(f"模式: {self.mode}")
        print("-"*60)
        
        # 复制 assets 目录
        source_assets = os.path.join(self.source_dir, 'assets')
        target_assets = os.path.join(self.target_dir, 'assets')
        
        if os.path.exists(source_assets):
            print("📂 开始复制 assets 目录...")
            self.copy_directory(source_assets, target_assets)
        
        # 更新 project.json
        print("⚙️ 更新项目配置...")
        self.update_project_json()
        
        # 生成导入配置
        print("📋 生成导入配置...")
        self.generate_import_config()
        
        # 打印摘要
        self.print_summary()
        
        # 保存日志
        self.save_log()


def main():
    parser = argparse.ArgumentParser(
        description='Cocos Creator 项目资源复制工具',
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    
    parser.add_argument(
        '--source', '-s',
        required=True,
        help='源项目目录路径'
    )
    
    parser.add_argument(
        '--target', '-t',
        required=True,
        help='目标 Cocos Creator 项目目录路径'
    )
    
    parser.add_argument(
        '--mode', '-m',
        choices=['ask', 'overwrite', 'skip', 'rename'],
        default='ask',
        help='文件冲突处理模式: ask(询问), overwrite(覆盖), skip(跳过), rename(重命名)'
    )
    
    parser.add_argument(
        '--log', '-l',
        help='日志输出文件路径 (默认: target/copy_log.json)'
    )
    
    args = parser.parse_args()
    
    # 验证路径
    if not os.path.isdir(args.source):
        print(f"❌ 源目录不存在: {args.source}")
        return
    
    if not os.path.isdir(args.target):
        print(f"❌ 目标目录不存在: {args.target}")
        return
    
    # 创建复制器并执行
    copier = CocosProjectCopier(args.source, args.target, args.mode)
    copier.run()
    
    # 如果指定了日志路径，额外保存一份
    if args.log:
        copier.save_log(args.log)
    
    print("\n🎉 操作完成!")


if __name__ == '__main__':
    main()
