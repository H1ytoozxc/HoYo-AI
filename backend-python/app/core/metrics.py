"""
Prometheus metrics for monitoring
"""
from typing import Dict, Any
import time
import psutil
import os

# Simple metrics storage (in production, use prometheus_client)
metrics_data = {
    "requests_total": 0,
    "requests_success": 0,
    "requests_error": 0,
    "response_time_seconds": [],
    "active_connections": 0,
}

def increment_request():
    """Increment total requests counter"""
    metrics_data["requests_total"] += 1

def increment_success():
    """Increment successful requests counter"""
    metrics_data["requests_success"] += 1

def increment_error():
    """Increment error requests counter"""
    metrics_data["requests_error"] += 1

def record_response_time(duration: float):
    """Record response time"""
    metrics_data["response_time_seconds"].append(duration)
    # Keep only last 1000 measurements
    if len(metrics_data["response_time_seconds"]) > 1000:
        metrics_data["response_time_seconds"] = metrics_data["response_time_seconds"][-1000:]

def set_active_connections(count: int):
    """Set active connections count"""
    metrics_data["active_connections"] = count

def generate_metrics() -> str:
    """Generate Prometheus-compatible metrics"""
    process = psutil.Process(os.getpid())
    
    # Calculate average response time
    avg_response_time = 0
    if metrics_data["response_time_seconds"]:
        avg_response_time = sum(metrics_data["response_time_seconds"]) / len(metrics_data["response_time_seconds"])
    
    metrics = f"""# HELP hoyo_requests_total Total number of requests
# TYPE hoyo_requests_total counter
hoyo_requests_total {metrics_data["requests_total"]}

# HELP hoyo_requests_success Total number of successful requests
# TYPE hoyo_requests_success counter
hoyo_requests_success {metrics_data["requests_success"]}

# HELP hoyo_requests_error Total number of error requests
# TYPE hoyo_requests_error counter
hoyo_requests_error {metrics_data["requests_error"]}

# HELP hoyo_response_time_seconds Average response time in seconds
# TYPE hoyo_response_time_seconds gauge
hoyo_response_time_seconds {avg_response_time:.6f}

# HELP hoyo_active_connections Number of active WebSocket connections
# TYPE hoyo_active_connections gauge
hoyo_active_connections {metrics_data["active_connections"]}

# HELP hoyo_memory_usage_bytes Memory usage in bytes
# TYPE hoyo_memory_usage_bytes gauge
hoyo_memory_usage_bytes {process.memory_info().rss}

# HELP hoyo_cpu_usage_percent CPU usage percentage
# TYPE hoyo_cpu_usage_percent gauge
hoyo_cpu_usage_percent {process.cpu_percent()}
"""
    
    return metrics
