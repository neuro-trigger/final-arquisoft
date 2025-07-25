#!/bin/bash

# Monitor HPA scaling during performance test
# This script collects scaling metrics for knee graph analysis

echo "🔍 Starting HPA Scaling Monitor for Nova Performance Test"
echo "========================================================"

# Create output directory for monitoring data
mkdir -p performance-tests/results
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_FILE="performance-tests/results/hpa_scaling_${TIMESTAMP}.csv"
METRICS_FILE="performance-tests/results/resource_metrics_${TIMESTAMP}.csv"

# Initialize CSV files with headers
echo "timestamp,service,current_replicas,desired_replicas,min_replicas,max_replicas,cpu_percent,memory_percent,targets" > "$OUTPUT_FILE"
echo "timestamp,pod_name,cpu_cores,memory_bytes,service" > "$METRICS_FILE"

echo "📊 Monitoring data will be saved to:"
echo "   HPA Data: $OUTPUT_FILE"
echo "   Resource Data: $METRICS_FILE"
echo ""

# Function to collect HPA data
collect_hpa_data() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Get HPA status for all services
    kubectl get hpa -n nova --no-headers -o custom-columns=NAME:.metadata.name,REPLICAS:.status.currentReplicas,DESIRED:.status.desiredReplicas,MIN:.spec.minReplicas,MAX:.spec.maxReplicas,CPU:.status.currentMetrics[0].resource.current.averageUtilization,MEMORY:.status.currentMetrics[1].resource.current.averageUtilization,TARGETS:.status.currentMetrics 2>/dev/null | while read line; do
        if [[ -n "$line" ]]; then
            # Parse the line (handle missing values)
            name=$(echo "$line" | awk '{print $1}')
            current=$(echo "$line" | awk '{print $2}' | sed 's/<none>/0/g')
            desired=$(echo "$line" | awk '{print $3}' | sed 's/<none>/0/g')
            min=$(echo "$line" | awk '{print $4}')
            max=$(echo "$line" | awk '{print $5}')
            cpu=$(echo "$line" | awk '{print $6}' | sed 's/<unknown>/0/g' | sed 's/%//g')
            memory=$(echo "$line" | awk '{print $7}' | sed 's/<unknown>/0/g' | sed 's/%//g')
            targets=$(echo "$line" | cut -d' ' -f8- | tr ' ' '_')
            
            echo "$timestamp,$name,$current,$desired,$min,$max,$cpu,$memory,$targets" >> "$OUTPUT_FILE"
        fi
    done
}

# Function to collect resource metrics
collect_resource_metrics() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Get pod resource usage
    kubectl top pods -n nova --no-headers 2>/dev/null | while read line; do
        if [[ -n "$line" ]]; then
            pod_name=$(echo "$line" | awk '{print $1}')
            cpu=$(echo "$line" | awk '{print $2}' | sed 's/m//g')
            memory=$(echo "$line" | awk '{print $3}' | sed 's/Mi//g')
            
            # Determine service from pod name
            service=""
            if [[ $pod_name == *"api-gateway"* ]]; then
                service="api-gateway"
            elif [[ $pod_name == *"frontend"* ]]; then
                service="frontend"
            elif [[ $pod_name == *"auth-svc"* ]]; then
                service="auth-svc"
            elif [[ $pod_name == *"user-product"* ]]; then
                service="user-product-svc"
            fi
            
            echo "$timestamp,$pod_name,$cpu,$memory,$service" >> "$METRICS_FILE"
        fi
    done
}

# Function to display real-time status
display_status() {
    clear
    echo "🔍 Nova HPA Scaling Monitor - $(date)"
    echo "========================================"
    echo ""
    
    echo "📊 Current HPA Status:"
    kubectl get hpa -n nova 2>/dev/null || echo "❌ Could not fetch HPA status"
    echo ""
    
    echo "🏃 Current Pods:"
    kubectl get pods -n nova --no-headers | wc -l | xargs echo "Total pods:"
    kubectl get pods -n nova -o wide --no-headers | awk '{print $1 " - " $3 " - " $7}' | head -10
    if [[ $(kubectl get pods -n nova --no-headers | wc -l) -gt 10 ]]; then
        echo "... and $(( $(kubectl get pods -n nova --no-headers | wc -l) - 10 )) more pods"
    fi
    echo ""
    
    echo "💾 Resource Usage:"
    kubectl top pods -n nova 2>/dev/null | head -10 || echo "❌ Metrics not available"
    echo ""
    
    echo "📈 Scaling Events (last 5):"
    kubectl get events -n nova --sort-by=.metadata.creationTimestamp | grep -i "horizontal\|scale" | tail -5 || echo "No scaling events yet"
    echo ""
    
    echo "💡 Monitoring files:"
    echo "   HPA: $OUTPUT_FILE ($(wc -l < "$OUTPUT_FILE") records)"
    echo "   Metrics: $METRICS_FILE ($(wc -l < "$METRICS_FILE") records)"
    echo ""
    echo "⏹️  Press Ctrl+C to stop monitoring"
}

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping HPA monitoring..."
    echo "📊 Final data summary:"
    echo "   HPA records: $(wc -l < "$OUTPUT_FILE")"
    echo "   Resource records: $(wc -l < "$METRICS_FILE")"
    echo ""
    echo "📁 Results saved to:"
    echo "   $OUTPUT_FILE"
    echo "   $METRICS_FILE"
    echo ""
    echo "🔍 Use these files for knee graph analysis!"
    exit 0
}

# Set up signal handling
trap cleanup SIGINT SIGTERM

# Main monitoring loop
echo "🚀 Starting monitoring loop (collecting data every 15 seconds)..."
echo "📊 Data collection started at $(date)"
echo ""

counter=0
while true; do
    # Collect data
    collect_hpa_data
    collect_resource_metrics
    
    # Display status every 4 iterations (1 minute)
    if [[ $((counter % 4)) -eq 0 ]]; then
        display_status
    fi
    
    counter=$((counter + 1))
    sleep 15
done 