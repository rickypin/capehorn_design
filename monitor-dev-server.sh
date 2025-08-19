#!/bin/bash

echo "开始监控开发服务器状态..."
echo "时间: $(date)"
echo "PID: $$"
echo "=========================="

# 监控循环
for i in {1..10}; do
    echo "检查 #$i - $(date)"
    
    # 检查端口3000是否在监听
    if lsof -i :3000 > /dev/null 2>&1; then
        echo "✅ 端口3000正在监听"
        
        # 尝试访问主页
        if curl -s http://localhost:3000 > /dev/null; then
            echo "✅ 主页响应正常"
        else
            echo "❌ 主页无响应"
        fi
        
        # 尝试访问监控页面
        if curl -s http://localhost:3000/monitor > /dev/null; then
            echo "✅ 监控页面响应正常"
        else
            echo "❌ 监控页面无响应"
        fi
        
    else
        echo "❌ 端口3000未在监听 - 服务器可能已停止"
    fi
    
    echo "------------------------"
    sleep 30
done

echo "监控完成"
