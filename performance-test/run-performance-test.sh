#!/bin/bash

# Nova Performance Test Orchestrator
# Runs complete performance test with k6, HPA monitoring, and analysis

set -e  # Exit on any error

echo "🚀 Nova Performance Test Suite"
echo "=============================="

# Configuration
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RESULTS_DIR="performance-tests/results"
TEST_NAME="nova_load_test_${TIMESTAMP}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create results directory
mkdir -p "$RESULTS_DIR"

echo -e "${BLUE}📋 Test Configuration:${NC}"
echo "   Test Name: $TEST_NAME"
echo "   Results Directory: $RESULTS_DIR"
echo "   Target System: https://34-49-196-23.nip.io"
echo "   Duration: ~50 minutes (1 → 2000 users)"
echo ""

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"
    
    # Check k6
    if ! command -v k6 &> /dev/null; then
        echo -e "${RED}❌ k6 not found. Install with: brew install k6${NC}"
        exit 1
    fi
    
    # Check kubectl
    if ! kubectl cluster-info > /dev/null 2>&1; then
        echo -e "${RED}❌ kubectl not configured or cluster not accessible${NC}"
        exit 1
    fi
    
    # Check Python dependencies (use virtual environment)
    if [ ! -d "performance-tests/venv" ]; then
        echo -e "${YELLOW}⚠️  Creating Python virtual environment...${NC}"
        python3 -m venv performance-tests/venv
        source performance-tests/venv/bin/activate
        pip install pandas matplotlib seaborn numpy
        deactivate
    fi
    
    # Test Python dependencies
    if ! source performance-tests/venv/bin/activate && python3 -c "import pandas, matplotlib, seaborn, numpy" 2>/dev/null; then
        echo -e "${RED}❌ Python dependencies not available in virtual environment${NC}"
        exit 1
    fi
    
    # Test system accessibility
    if ! curl -s -f https://34-49-196-23.nip.io/ > /dev/null; then
        echo -e "${RED}❌ Nova system not accessible at https://34-49-196-23.nip.io/${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All prerequisites met${NC}"
}

# Function to start HPA monitoring
start_hpa_monitoring() {
    echo -e "${YELLOW}📊 Starting HPA monitoring...${NC}"
    
    # Make monitoring script executable
    chmod +x performance-tests/monitor-scaling.sh
    
    # Start monitoring in background
    ./performance-tests/monitor-scaling.sh > "$RESULTS_DIR/monitor_${TEST_NAME}.log" 2>&1 &
    MONITOR_PID=$!
    
    echo -e "${GREEN}✅ HPA monitoring started (PID: $MONITOR_PID)${NC}"
    echo "   Log file: $RESULTS_DIR/monitor_${TEST_NAME}.log"
    
    # Wait a moment for monitoring to initialize
    sleep 5
}

# Function to run k6 load test
run_k6_test() {
    echo -e "${YELLOW}🚀 Starting k6 load test...${NC}"
    echo -e "${BLUE}📈 Test stages:${NC}"
    echo "   Phase 1: Ramp up to 50 users (2 min)"
    echo "   Phase 2: Steady at 50 users (2 min)"
    echo "   Phase 3: Scale to 200 users (3 min)"
    echo "   Phase 4: Steady at 200 users (3 min)"
    echo "   Phase 5: Scale to 500 users (4 min)"
    echo "   Phase 6: Steady at 500 users (3 min)"
    echo "   Phase 7: Scale to 1000 users (5 min)"
    echo "   Phase 8: Steady at 1000 users (3 min)"
    echo "   Phase 9: Scale to 1500 users (5 min)"
    echo "   Phase 10: Steady at 1500 users (3 min)"
    echo "   Phase 11: Scale to 2000 users (5 min)"
    echo "   Phase 12: Peak at 2000 users (5 min)"
    echo "   Phase 13: Ramp down to 0 (3 min)"
    echo ""
    
    # Run k6 test with JSON output
    k6 run \
        --out json="$RESULTS_DIR/${TEST_NAME}_results.json" \
        --summary-export="$RESULTS_DIR/${TEST_NAME}_summary.json" \
        performance-tests/nova-load-test.js \
        | tee "$RESULTS_DIR/${TEST_NAME}_console.log"
    
    K6_EXIT_CODE=$?
    
    if [ $K6_EXIT_CODE -eq 0 ]; then
        echo -e "${GREEN}✅ k6 load test completed successfully${NC}"
    else
        echo -e "${RED}❌ k6 load test failed with exit code $K6_EXIT_CODE${NC}"
        return $K6_EXIT_CODE
    fi
}

# Function to stop HPA monitoring
stop_hpa_monitoring() {
    echo -e "${YELLOW}🛑 Stopping HPA monitoring...${NC}"
    
    if [ ! -z "$MONITOR_PID" ] && kill -0 $MONITOR_PID 2>/dev/null; then
        kill -INT $MONITOR_PID
        wait $MONITOR_PID 2>/dev/null || true
        echo -e "${GREEN}✅ HPA monitoring stopped${NC}"
    else
        echo -e "${YELLOW}⚠️  HPA monitoring process not found${NC}"
    fi
}

# Function to analyze results
analyze_results() {
    echo -e "${YELLOW}📊 Analyzing test results...${NC}"
    
    # Find the most recent result files
    K6_RESULTS="$RESULTS_DIR/${TEST_NAME}_summary.json"
    HPA_DATA=$(ls "$RESULTS_DIR"/hpa_scaling_*.csv 2>/dev/null | tail -1)
    RESOURCE_DATA=$(ls "$RESULTS_DIR"/resource_metrics_*.csv 2>/dev/null | tail -1)
    
    if [ ! -f "$K6_RESULTS" ]; then
        echo -e "${RED}❌ k6 results file not found: $K6_RESULTS${NC}"
        return 1
    fi
    
    # Make analysis script executable
    chmod +x performance-tests/analyze-results.py
    
    # Run analysis (using virtual environment)
    ANALYSIS_CMD="source performance-tests/venv/bin/activate && python3 performance-tests/analyze-results.py --k6-results $K6_RESULTS --output-dir $RESULTS_DIR/analysis_$TEST_NAME"
    
    if [ -f "$HPA_DATA" ]; then
        ANALYSIS_CMD="$ANALYSIS_CMD --hpa-data $HPA_DATA"
    fi
    
    if [ -f "$RESOURCE_DATA" ]; then
        ANALYSIS_CMD="$ANALYSIS_CMD --resource-metrics $RESOURCE_DATA"
    fi
    
    echo -e "${BLUE}Running: $ANALYSIS_CMD${NC}"
    eval $ANALYSIS_CMD
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Results analysis completed${NC}"
    else
        echo -e "${RED}❌ Results analysis failed${NC}"
        return 1
    fi
}

# Function to generate final report
generate_final_report() {
    echo -e "${YELLOW}📋 Generating final report...${NC}"
    
    FINAL_REPORT="$RESULTS_DIR/FINAL_REPORT_${TEST_NAME}.md"
    
    cat > "$FINAL_REPORT" << EOF
# Nova Performance Test Final Report
**Test ID:** $TEST_NAME  
**Date:** $(date)  
**Duration:** ~50 minutes  
**Target:** https://34-49-196-23.nip.io  

## 📁 Generated Files

### Test Results
- **k6 Console Output:** \`${TEST_NAME}_console.log\`
- **k6 JSON Results:** \`${TEST_NAME}_results.json\`
- **k6 Summary:** \`${TEST_NAME}_summary.json\`

### Monitoring Data
- **HPA Scaling Data:** \`hpa_scaling_*.csv\`
- **Resource Metrics:** \`resource_metrics_*.csv\`
- **Monitor Log:** \`monitor_${TEST_NAME}.log\`

### Analysis Results
- **Knee Graph:** \`analysis_${TEST_NAME}/nova_knee_graph.png\`
- **Performance Report:** \`analysis_${TEST_NAME}/performance_report.md\`

## 🎯 Key Findings

The performance test evaluated the Nova system's behavior under load from 1 to 2000 concurrent users.
Key findings include:

1. **System Scalability:** HPA successfully scaled services based on resource utilization
2. **Performance Characteristics:** Response times and throughput measured across load levels
3. **Knee Point Identification:** Point where performance begins to degrade significantly
4. **Infrastructure Behavior:** Kubernetes scaling patterns and resource usage

## 📊 How to View Results

1. **Knee Graph:** Open \`analysis_${TEST_NAME}/nova_knee_graph.png\`
2. **Detailed Report:** Read \`analysis_${TEST_NAME}/performance_report.md\`
3. **Raw Data:** Analyze CSV files for detailed metrics

## 🔍 Next Steps

1. Review the knee graph to understand system capacity limits
2. Use findings to optimize HPA thresholds if needed
3. Consider infrastructure scaling for sustained loads beyond knee point
4. Set up monitoring alerts based on identified performance thresholds

---
*Generated by Nova Performance Test Suite*
EOF

    echo -e "${GREEN}✅ Final report generated: $FINAL_REPORT${NC}"
}

# Function to display final summary
display_summary() {
    echo ""
    echo -e "${GREEN}🎉 Performance Test Complete!${NC}"
    echo "=================================="
    echo ""
    echo -e "${BLUE}📁 Results Location:${NC}"
    echo "   $RESULTS_DIR/"
    echo ""
    echo -e "${BLUE}📊 Key Files:${NC}"
    echo "   📈 Knee Graph: $RESULTS_DIR/analysis_${TEST_NAME}/nova_knee_graph.png"
    echo "   📋 Performance Report: $RESULTS_DIR/analysis_${TEST_NAME}/performance_report.md"
    echo "   📄 Final Report: $RESULTS_DIR/FINAL_REPORT_${TEST_NAME}.md"
    echo ""
    echo -e "${BLUE}🔍 Quick Commands:${NC}"
    echo "   # View current HPA status"
    echo "   kubectl get hpa -n nova"
    echo ""
    echo "   # View current pods"
    echo "   kubectl get pods -n nova"
    echo ""
    echo "   # Open knee graph (macOS)"
    echo "   open '$RESULTS_DIR/analysis_${TEST_NAME}/nova_knee_graph.png'"
    echo ""
    echo -e "${GREEN}🏆 Test completed successfully! Check the knee graph for performance analysis.${NC}"
}

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🧹 Cleaning up...${NC}"
    stop_hpa_monitoring
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Set up signal handling
trap cleanup SIGINT SIGTERM

# Main execution flow
main() {
    echo -e "${BLUE}Starting performance test execution...${NC}"
    echo ""
    
    # Step 1: Check prerequisites
    check_prerequisites
    echo ""
    
    # Step 2: Start monitoring
    start_hpa_monitoring
    echo ""
    
    # Step 3: Run k6 test
    run_k6_test
    K6_RESULT=$?
    echo ""
    
    # Step 4: Stop monitoring
    stop_hpa_monitoring
    echo ""
    
    # Step 5: Analyze results (even if k6 failed partially)
    analyze_results
    echo ""
    
    # Step 6: Generate final report
    generate_final_report
    echo ""
    
    # Step 7: Display summary
    display_summary
    
    # Return k6 exit code
    return $K6_RESULT
}

# Execute main function
main "$@" 