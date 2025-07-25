#!/bin/bash

# Quick test to verify performance test setup

echo "🧪 Testing Nova Performance Test Setup"
echo "======================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}1. Testing k6 installation...${NC}"
if command -v k6 &> /dev/null; then
    echo -e "${GREEN}✅ k6 installed: $(k6 version)${NC}"
else
    echo -e "${RED}❌ k6 not found${NC}"
    exit 1
fi

echo -e "${YELLOW}2. Testing kubectl connection...${NC}"
if kubectl cluster-info > /dev/null 2>&1; then
    echo -e "${GREEN}✅ kubectl connected to cluster${NC}"
else
    echo -e "${RED}❌ kubectl not connected${NC}"
    exit 1
fi

echo -e "${YELLOW}3. Testing Python virtual environment...${NC}"
if [ -d "performance-tests/venv" ]; then
    echo -e "${GREEN}✅ Virtual environment exists${NC}"
    
    # Test Python dependencies
    if source performance-tests/venv/bin/activate && python3 -c "import pandas, matplotlib, seaborn, numpy; print('All Python dependencies available')" 2>/dev/null; then
        echo -e "${GREEN}✅ Python dependencies working${NC}"
    else
        echo -e "${RED}❌ Python dependencies not working${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Virtual environment not found${NC}"
    exit 1
fi

echo -e "${YELLOW}4. Testing Nova system accessibility...${NC}"
if curl -s -f https://34-49-196-23.nip.io/ > /dev/null; then
    echo -e "${GREEN}✅ Nova system accessible${NC}"
else
    echo -e "${RED}❌ Nova system not accessible${NC}"
    exit 1
fi

echo -e "${YELLOW}5. Testing HPA status...${NC}"
if kubectl get hpa -n nova > /dev/null 2>&1; then
    echo -e "${GREEN}✅ HPA configured and accessible${NC}"
    kubectl get hpa -n nova
else
    echo -e "${RED}❌ HPA not accessible${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 All tests passed! Ready to run performance test.${NC}"
echo ""
echo -e "${YELLOW}📋 To run the full performance test (50 minutes):${NC}"
echo "   ./performance-tests/run-performance-test.sh"
echo ""
echo -e "${YELLOW}📋 To run a quick 5-minute test:${NC}"
echo "   k6 run --duration 5m --vus 10 performance-tests/nova-load-test.js" 