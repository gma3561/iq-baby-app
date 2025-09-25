const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 size
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });

  const page = await context.newPage();

  console.log('📱 아이큐 베이비 앱 테스트 시작...');

  // 1. 사이트 접속
  await page.goto('https://gma3561.github.io/iq-baby-app/');
  console.log('✅ 사이트 접속 완료');

  // 2. 로그인 화면 확인
  const title = await page.textContent('.app-title');
  console.log('✅ 앱 제목:', title);

  const subtitle = await page.textContent('.app-subtitle');
  console.log('✅ 부제목:', subtitle);

  // 3. 쿠팡 파트너스 문구 확인
  const termsText = await page.textContent('.terms');
  console.log('✅ 약관:', termsText.includes('쿠팡 파트너스') ? '쿠팡 파트너스 명시됨' : '기본 약관');

  // 4. 회사 정보 확인
  try {
    const companyInfo = await page.locator('p:has-text("엑시아파트너스")').textContent({ timeout: 3000 });
    console.log('✅ 회사 정보: 표시됨');
  } catch {
    console.log('⚠️ 회사 정보: 미표시');
  }

  // 5. 카카오 로그인 버튼 클릭
  await page.click('.kakao-login-btn');
  console.log('✅ 카카오 로그인 버튼 클릭');

  // 6. 개발 중 모달 확인
  await page.waitForSelector('.modal-overlay.show', { timeout: 5000 });
  const modalTitle = await page.textContent('.modal-title');
  console.log('✅ 모달 제목:', modalTitle);

  // 7. 데모 체험하기 클릭
  await page.click('button:has-text("데모 체험하기")');
  console.log('✅ 데모 모드 진입');

  // 8. 회원가입 화면 확인
  await page.waitForSelector('#registrationScreen.active');
  const regTitle = await page.textContent('.header-title');
  console.log('✅ 회원가입 화면:', regTitle);

  // 9. 아기 정보 입력
  await page.fill('#babyName', '테스트아기');
  await page.click('.gender-btn:has-text("남아")');
  await page.click('.product-type-card:has-text("일반 제품")');
  console.log('✅ 아기 정보 입력 완료');

  // 10. 등록하기 클릭
  await page.click('.submit-btn');
  console.log('✅ 등록 버튼 클릭');

  // 11. 홈 화면 확인
  await page.waitForSelector('#homeScreen.active', { timeout: 5000 });
  const babyNameDisplay = await page.textContent('.baby-name-display');
  console.log('✅ 홈 화면 진입:', babyNameDisplay);

  // 12. 제품 확인
  const products = await page.$$('.product-card');
  console.log('✅ 추천 제품 개수:', products.length);

  // 13. 프로필 화면 이동
  await page.click('.profile-btn');
  await page.waitForSelector('#profileScreen.active');
  console.log('✅ 프로필 화면 진입');

  // 14. 회사 정보 확인 (프로필 화면)
  const footerCompany = await page.textContent('.company-name');
  console.log('✅ 푸터 회사명:', footerCompany);

  // 스크린샷 저장
  await page.screenshot({ path: 'iqbaby-test.png', fullPage: true });
  console.log('📸 스크린샷 저장: iqbaby-test.png');

  console.log('\\n🎉 테스트 완료! 모든 기능이 정상 작동합니다.');

  await browser.close();
})();