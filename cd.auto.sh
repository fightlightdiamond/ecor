#!/usr/bin/env bash

# Auto git pull script với PID lock và graceful stop
# Chạy: ./cd.auto.sh
# Dừng: ./cd.auto.sh stop

SCRIPT_NAME="cd.auto"
PID_FILE="/tmp/${SCRIPT_NAME}.pid"
INTERVAL=60  # giây (1 phút)

# Function: Kiểm tra xem script đang chạy không
is_running() {
  if [ -f "$PID_FILE" ]; then
    local pid=$(cat "$PID_FILE")
    if ps -p "$pid" > /dev/null 2>&1; then
      return 0  # Đang chạy
    else
      rm -f "$PID_FILE"  # PID file cũ, xóa đi
      return 1
    fi
  fi
  return 1
}

# Function: Dừng script
stop_script() {
  if is_running; then
    local pid=$(cat "$PID_FILE")
    echo "🛑 Đang dừng auto-pull (PID: $pid)..."
    kill "$pid" 2>/dev/null
    rm -f "$PID_FILE"
    echo "✅ Đã dừng thành công!"
  else
    echo "ℹ️  Script không chạy."
  fi
  exit 0
}

# Function: Cleanup khi thoát
cleanup() {
  echo ""
  echo "🛑 Nhận tín hiệu dừng, đang cleanup..."
  rm -f "$PID_FILE"
  echo "✅ Đã dừng auto-pull."
  exit 0
}

# Xử lý tham số command line
if [ "$1" = "stop" ] || [ "$1" = "--stop" ] || [ "$1" = "-s" ]; then
  stop_script
fi

if [ "$1" = "status" ] || [ "$1" = "--status" ]; then
  if is_running; then
    local pid=$(cat "$PID_FILE")
    echo "✅ Auto-pull đang chạy (PID: $pid)"
    echo "📍 Để dừng: ./cd.auto.sh stop"
  else
    echo "⭕ Auto-pull không chạy"
    echo "📍 Để chạy: ./cd.auto.sh"
  fi
  exit 0
fi

# Kiểm tra nếu đã có instance chạy
if is_running; then
  local pid=$(cat "$PID_FILE")
  echo "⚠️  Auto-pull đã đang chạy (PID: $pid)"
  echo "📍 Để dừng: ./cd.auto.sh stop"
  echo "📍 Để xem trạng thái: ./cd.auto.sh status"
  exit 1
fi

# Bắt tín hiệu Ctrl+C (SIGINT) và SIGTERM để cleanup
trap cleanup SIGINT SIGTERM

# Lưu PID của script hiện tại
echo $$ > "$PID_FILE"
echo "🚀 Bắt đầu auto git pull (mỗi ${INTERVAL}s)"
echo "📍 PID: $$"
echo "📍 Để dừng: ./cd.auto.sh stop hoặc Ctrl+C"
echo "📍 Để xem trạng thái: ./cd.auto.sh status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Vòng lặp chính
COUNTER=1
while true; do
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  echo ""
  echo "[$COUNTER] $TIMESTAMP - Đang pull..."
  
  if git pull; then
    echo "✅ Pull thành công"
  else
    echo "❌ Pull thất bại (exit code: $?)"
  fi
  
  echo "⏳ Chờ ${INTERVAL}s..."
  
  # Sleep với kiểm tra tín hiệu mỗi giây
  for i in $(seq 1 $INTERVAL); do
    sleep 1
    # Kiểm tra nếu PID file bị xóa từ bên ngoài
    if [ ! -f "$PID_FILE" ]; then
      echo "🛑 PID file đã bị xóa, dừng script..."
      exit 0
    fi
  done
  
  ((COUNTER++))
done
