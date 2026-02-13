const fs = require('fs');
const path = require('path');

// Configuration
const IGNORED_DIRS = ['.git', 'node_modules', '.next', 'build', 'coverage', '.husky'];
const IGNORED_FILES = ['package-lock.json', 'yarn.lock', 'security-scan.js', 'audit.log'];

// Regex Patterns for Secrets
const SECRET_PATTERNS = [
    { name: 'Google API Key', regex: /AIza[0-9A-Za-z\\-_]{35}/ },
    { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/ },
    { name: 'Generic API Key', regex: /(api_key|apikey|secret|token)[\s]*[:=][\s]*['"][A-Za-z0-9\\-_]{16,}['"]/i },
    { name: 'DB Password', regex: /(password|passwd|pwd)[\s]*[:=][\s]*['"][^'"]{6,}['"]/i },
    { name: 'Hardcoded JWT', regex: /eyJ[A-Za-z0-9\\-_]+\.eyJ[A-Za-z0-9\\-_]+\.[A-Za-z0-9\\-_]+/ },
    { name: 'Private Key', regex: /-----BEGIN PRIVATE KEY-----/ },
    { name: 'GitHub Token', regex: /ghp_[0-9a-zA-Z]{36}/ }
];

let issuesFound = 0;

function scanFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let fileIssues = 0;

        SECRET_PATTERNS.forEach(pattern => {
            if (pattern.regex.test(content)) {
                // Ignore if it looks like an environment variable reference (process.env)
                if (!content.includes('process.env')) {
                    console.error(`[CRITICAL] Possible ${pattern.name} found in: ${filePath}`);
                    fileIssues++;
                }
            }
        });

        if (fileIssues > 0) {
            issuesFound += fileIssues;
        }
    } catch (err) {
        console.warn(`Could not read file ${filePath}: ${err.message}`);
    }
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!IGNORED_DIRS.includes(file)) {
                traverseDir(fullPath);
            }
        } else {
            if (!IGNORED_FILES.includes(file) && !file.endsWith('.map') && !file.endsWith('.png') && !file.endsWith('.jpg')) {
                scanFile(fullPath);
            }
        }
    });
}

console.log('🔍 Starting Security Scan...');
traverseDir(process.cwd());

if (issuesFound > 0) {
    console.error(`\n❌ SECURITY FAIL: Found ${issuesFound} potential secrets in the codebase.`);
    console.error('Please remove them or use environment variables before committing.');
    process.exit(1);
} else {
    console.log('\n✅ SECURITY PASS: No secrets detected.');
    process.exit(0);
}
