#!/bin/bash

LOG_FILE="server-monitor.log"
PID_FILE="dev-server.pid"

echo "=== 增强型开发服务器监控 ===" | tee -a $LOG_FILE
echo "开始时间: $(date)" | tee -a $LOG_FILE
echo "监控PID: $$" | tee -a $LOG_FILE
echo "==============================" | tee -a $LOG_FILE

# 函数：检查服务器状态
check_server() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # 检查端口3000
    if lsof -i :3000 > /dev/null 2>&1; then
        echo "[$timestamp] ✅ 端口3000正在监听" | tee -a $LOG_FILE
        
        # 检查进程详情
        local pid=$(lsof -ti :3000)
        if [ ! -z "$pid" ]; then
            echo "[$timestamp] 📊 进程PID: $pid" | tee -a $LOG_FILE
            
            # 记录内存使用
            local mem_usage=$(ps -o pid,ppid,rss,vsz,pcpu,pmem,comm -p $pid 2>/dev/null)
            if [ $? -eq 0 ]; then
                echo "[$timestamp] 💾 内存使用:" | tee -a $LOG_FILE
                echo "$mem_usage" | tee -a $LOG_FILE
            fi
            
            # 保存PID到文件
            echo $pid > $PID_FILE
        fi
        
        # 测试HTTP响应
        if curl -s --max-time 5 http://localhost:3000 > /dev/null; then
            echo "[$timestamp] 🌐 HTTP响应正常" | tee -a $LOG_FILE
        else
            echo "[$timestamp] ❌ HTTP响应失败" | tee -a $LOG_FILE
        fi
        
        return 0
    else
        echo "[$timestamp] ❌ 端口3000未监听 - 服务器已停止" | tee -a $LOG_FILE
        
        # 检查是否有残留进程
        if [ -f $PID_FILE ]; then
            local old_pid=$(cat $PID_FILE)
            if ps -p $old_pid > /dev/null 2>&1; then
                echo "[$timestamp] 🔍 发现残留进程: $old_pid" | tee -a $LOG_FILE
            else
                echo "[$timestamp] 💀 进程 $old_pid 已终止" | tee -a $LOG_FILE
                rm -f $PID_FILE
            fi
        fi
        
        return 1
    fi
}

# 函数：记录系统状态
log_system_status() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] 📈 系统状态:" | tee -a $LOG_FILE
    
    # CPU和内存使用
    top -l 1 | head -10 | tail -8 | tee -a $LOG_FILE
    
    # 磁盘空间
    df -h / | tee -a $LOG_FILE
    
    echo "---" | tee -a $LOG_FILE
}

# 主监控循环
monitor_count=0
consecutive_failures=0

while [ $monitor_count -lt 20 ]; do
    monitor_count=$((monitor_count + 1))
    echo "=== 检查 #$monitor_count ===" | tee -a $LOG_FILE
    
    if check_server; then
        consecutive_failures=0
        
        # 每5次检查记录一次系统状态
        if [ $((monitor_count % 5)) -eq 0 ]; then
            log_system_status
        fi
    else
        consecutive_failures=$((consecutive_failures + 1))
        echo "连续失败次数: $consecutive_failures" | tee -a $LOG_FILE
        
        # 如果连续失败，记录更详细的信息
        if [ $consecutive_failures -ge 2 ]; then
            echo "检测到服务器异常，记录详细状态..." | tee -a $LOG_FILE
            log_system_status
            
            # 检查是否有相关的错误日志
            if [ -f "dev-server.log" ]; then
                echo "最近的开发服务器日志:" | tee -a $LOG_FILE
                tail -20 dev-server.log | tee -a $LOG_FILE
            fi
        fi
    fi
    
    echo "等待30秒..." | tee -a $LOG_FILE
    sleep 30
done

echo "=== 监控结束 ===" | tee -a $LOG_FILE
echo "结束时间: $(date)" | tee -a $LOG_FILE

# 清理
rm -f $PID_FILE
