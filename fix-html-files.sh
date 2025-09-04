#!/bin/bash

# This script helps identify and fix HTML files that should be React components

echo "Finding HTML files that need to be converted to React components..."

# Find all files with HTML DOCTYPE
HTML_FILES=$(find /Users/test/Startups/zenith/src/app -name "*.tsx" -exec grep -l "<!DOCTYPE html>" {} \;)

if [ -z "$HTML_FILES" ]; then
    echo "No HTML files found that need conversion."
    exit 0
fi

echo "Found the following files that need to be converted:"
echo "$HTML_FILES"

echo ""
echo "To fix these files, you need to:"
echo "1. Replace HTML syntax with React JSX syntax"
echo "2. Wrap content in a React component"
echo "3. Add 'use client' directive at the top"
echo "4. Remove HTML/HEAD/BODY tags"
echo "5. Convert class attributes to className"
echo "6. Convert href/src attributes to appropriate React props"

echo ""
echo "Example conversion pattern:"
echo "-------------------------"
echo "FROM:"
echo '<!DOCTYPE html>'
echo '<html lang="en">'
echo '<head>'
echo '    <title>Page Title</title>'
echo '</head>'
echo '<body class="bg-gray-50">'
echo '    <div class="container">Content</div>'
echo '</body>'
echo '</html>'

echo ""
echo "TO:"
echo "'use client';"
echo ""
echo "import React from 'react';"
echo ""
echo "export default function PageComponent() {"
echo "  return ("
echo "    <div className=\"min-h-screen bg-gray-50\">"
echo "      <div className=\"container\">Content</div>"
echo "    </div>"
echo "  );"
echo "}"