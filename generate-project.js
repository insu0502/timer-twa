(async () => {
#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');

console.log('=== Bubblewrap Core Android Project Generator ===');

// 1. twa-manifest.json 읽기
const manifestPath = path.join(__dirname, 'www', 'twa-manifest.json');
if (!fs.existsSync(manifestPath)) {
    console.error('❌ twa-manifest.json not found at:', manifestPath);
    process.exit(1);
}

let twaManifest;
try {
    twaManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log('✅ twa-manifest.json loaded');
    console.log('   applicationId:', twaManifest.twaManifest?.applicationId);
    console.log('   name:', twaManifest.twaManifest?.name);
} catch (e) {
    console.error('❌ Failed to parse twa-manifest.json:', e.message);
    process.exit(1);
}

// 2. @bubblewrap/core 로드
let core;
try {
    core = require('@bubblewrap/core');
    console.log('✅ @bubblewrap/core loaded');
} catch (e) {
    console.error('❌ Failed to load @bubblewrap/core:', e.message);
    process.exit(1);
}

// 사용 가능한 exports 확인 (디버깅용)
const exportKeys = Object.keys(core);
console.log('📋 Available exports:', exportKeys.slice(0, 30));

// 3. 안드로이드 프로젝트 생성
const outputDir = path.join(__dirname, 'www');

try {
if (typeof core.TwaGenerator === 'function') {
      console.log('👉 Using TwaGenerator class...');
      const generator = new core.TwaGenerator(twaManifest);
      const result = await generator.createTwaProject(outputDir, twaManifest);
      console.log('✅ TwaGenerator 완료');
      console.log('   결과:', result);
    }
    }
    // 패턴 2: generateProject 함수
    else if (typeof core.generateProject === 'function') {
        console.log('🔄 Using generateProject()...');
        core.generateProject({
            twaManifest: twaManifest,
            outputDirectory: outputDir,
        });
        console.log('✅ generateProject() 완료');
    }
    // 패턴 3: generate 함수
    else if (typeof core.generate === 'function') {
        console.log('🔄 Using core.generate()...');
        core.generate({ twaManifest: twaManifest, directory: outputDir });
        console.log('✅ core.generate() 완료');
    }
    // 패턴 4: createProject
    else if (typeof core.createProject === 'function') {
        console.log('🔄 Using createProject()...');
        core.createProject({ twaManifest: twaManifest, directory: outputDir });
        console.log('✅ createProject() 완료');
    }
    else {
        console.error('❌ 알맞은 generate API를 찾지 못함');
        console.error('   exports:', exportKeys);
        console.error('   → generate-project.js의 API 패턴을 수정해야 함');
        process.exit(1);
    }
} catch (e) {
    console.error('❌ 프로젝트 생성 중 오류:', e.message);
    console.error(e.stack);
    process.exit(1);
}

console.log('=== Android 프로젝트 생성 완료 ===');
console.log('   출력 디렉토리:', outputDir);
    })();
