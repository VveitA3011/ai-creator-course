const {chromium}=require('playwright');
const B='http://localhost:3214';
const log=(...a)=>console.log(...a);
let fails=0;const check=(name,ok,extra='')=>{if(!ok)fails++;log(ok?'PASS':'FAIL',name,extra)};
const state=async()=>(await (await fetch('http://localhost:54321/__debug/state')).json());
(async()=>{const b=await chromium.launch();const errs=[];
const mk=async()=>{const c=await b.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});const p=await c.newPage();p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error'&&!/406|409|400|401|403/.test(m.text()))errs.push(m.text())});return [c,p]};
const doneCount=async p=>{await p.goto(B+'/hoc-tap');await p.waitForTimeout(800);return p.locator('.check.on').count()};
for(let i=0;i<30;i++){try{await fetch(B);break}catch(e){await new Promise(r=>setTimeout(r,500))}}

// 1. khách học 2 bài + thêm prompt
const [c1,p1]=await mk();
await p1.goto(B+'/khoa-hoc/module-0/nghe-ai-creator');await p1.click('text=Đánh dấu hoàn thành');
await p1.goto(B+'/khoa-hoc/module-0/bo-cong-cu');await p1.click('text=Đánh dấu hoàn thành');
await p1.goto(B+'/cong-cu/prompt');await p1.waitForTimeout(500);await p1.fill('.prompt-form textarea','prompt cua khach');await p1.click('text=Lưu vào thư viện');
check('rail has account link',await p1.locator('a[aria-label="Tài khoản"]').count()===1);

// 2. tạo tài khoản
await p1.goto(B+'/dang-nhap');await p1.click('role=tab[name="Tạo tài khoản"]');
await p1.fill('#auth-email','a@test.dev');await p1.fill('#auth-password','abc');await p1.click('form >> button[type=submit]');
await p1.waitForTimeout(500);check('weak password blocked by form',await p1.evaluate(()=>!document.querySelector('#auth-password').checkValidity()) && p1.url().includes('dang-nhap'));
await p1.fill('#auth-password','secret123');await p1.click('form >> button[type=submit]');
await p1.waitForURL('**/tai-khoan',{timeout:10000});await p1.waitForTimeout(2500);
check('sync pill ok',/Đã đồng bộ/.test(await p1.textContent('.sync-pill')),await p1.textContent('.sync-pill'));
let st=await state();const a=st.find(r=>r.email==='a@test.dev');
const prog=a?JSON.parse(a.data['aic-progress-v1']||'{}'):{};
check('guest progress moved to account',Object.keys(prog).length===2,JSON.stringify(Object.keys(prog)));
check('guest prompt moved to account',a&&(a.data['aic-tool-prompts-v1']||'').includes('prompt cua khach'));
check('greeting uses name',/a<\/b>|>a</.test(await p1.innerHTML('.greeting')),await p1.textContent('.greeting'));

// 3. hồ sơ
await p1.fill('#pf-handle','Có Dấu');await p1.click('text=Lưu hồ sơ');await p1.waitForTimeout(300);
check('bad handle rejected',(await p1.textContent('form .notice')||'').includes('chữ thường'),await p1.textContent('form .notice'));
await p1.fill('#pf-handle','minh-anh');await p1.fill('#pf-name','Minh Anh');await p1.fill('#pf-headline','AI Short-form Video Creator');await p1.fill('#pf-contact','minhanh@example.com');
await p1.click('text=Lưu hồ sơ');await p1.waitForTimeout(800);
check('profile saved',(await p1.textContent('form .notice')||'').includes('Đã lưu'),await p1.textContent('form .notice'));
check('greeting shows display name',(await p1.textContent('.greeting')).includes('Minh Anh'));

// portfolio
await p1.goto(B+'/portfolio');await p1.waitForTimeout(800);
await p1.click('text=+ Thêm sản phẩm');await p1.fill('#pi-title','Quảng cáo nước hoa');await p1.fill('#pi-video','https://www.youtube.com/shorts/dQw4w9WgXcQ');
await p1.fill('#pi-brief','Ra mắt dòng nước hoa mới');await p1.fill('#pi-notes','9 giờ, 2 vòng sửa');
check('video preview embeds youtube',await p1.locator('.video-preview iframe').count()===1);
await p1.locator('.check-row input').nth(1).check();await p1.click('text=Lưu sản phẩm');await p1.waitForTimeout(800);
await p1.click('text=+ Thêm sản phẩm');await p1.fill('#pi-title','Bản nháp riêng');await p1.selectOption('#pi-cat','storytelling');await p1.click('text=Lưu sản phẩm');await p1.waitForTimeout(800);
check('two items listed',await p1.locator('.pf-row').count()===2);
await p1.locator('.pf-row').nth(1).locator('button[aria-label^="Đưa"]').first().click();await p1.waitForTimeout(800);
check('reorder works',(await p1.locator('.pf-row b').first().textContent())==='Bản nháp riêng');

// nộp đầu ra
await p1.goto(B+'/khoa-hoc/tuan-1');await p1.waitForTimeout(800);
await p1.fill('#sub-url-tuan-1','https://drive.google.com/x');await p1.fill('#sub-note-tuan-1','6 kịch bản');await p1.click('role=button[name="Nộp"]');await p1.waitForTimeout(800);
check('submission listed',await p1.locator('.sub-list li').count()===1);

// trang công khai, người xem chưa đăng nhập
const [c0,p0]=await mk();
await p0.goto(B+'/p/minh-anh');await p0.waitForTimeout(1200);
check('public page shows name',(await p0.textContent('.pf-hero h1'))==='Minh Anh');
check('public page only public item',await p0.locator('.pf-card').count()===1, String(await p0.locator('.pf-card h3').allTextContents()));
check('spec label shown',(await p0.textContent('.pf-card')).includes('Self-initiated project'));
await p0.goto(B+'/p/khong-co-ai');await p0.waitForTimeout(1000);check('missing handle message',(await p0.textContent('main')).includes('Không tìm thấy'));
check('guest rail has account link',await p0.locator('a[aria-label="Tài khoản"]').count()===1);
await p0.goto(B+'/portfolio');await p0.waitForTimeout(800);check('portfolio asks login',(await p0.textContent('main')).includes('Cần đăng nhập'));

// 4. đăng xuất
await p1.goto(B+'/tai-khoan');await p1.waitForTimeout(800);await p1.click('role=button[name="Đăng xuất"]');await p1.waitForURL(B+'/');await p1.waitForTimeout(500);
check('local cleared after sign out',(await doneCount(p1))===0);

// 5. máy 2
const [c2,p2]=await mk();
await p2.goto(B+'/dang-nhap');await p2.fill('#auth-email','a@test.dev');await p2.fill('#auth-password','wrongpw');await p2.click('form >> button[type=submit]');await p2.waitForTimeout(600);
check('wrong password message',(await p2.textContent('.notice')||'').includes('chưa đúng'),await p2.textContent('.notice'));
await p2.fill('#auth-password','secret123');await p2.click('form >> button[type=submit]');await p2.waitForURL('**/tai-khoan');await p2.waitForTimeout(2000);
check('device 2 pulled progress',(await doneCount(p2))===2);
await p2.goto(B+'/cong-cu/prompt');await p2.waitForTimeout(800);check('device 2 pulled prompt',(await p2.textContent('.prompt-grid')).includes('prompt cua khach'));
// 6. bỏ đánh dấu trên máy 2
await p2.goto(B+'/khoa-hoc/module-0/bo-cong-cu');await p2.waitForTimeout(800);await p2.locator('.lesson-foot button').click();await p2.waitForTimeout(3000);
st=await state();check('unmark synced to account',Object.keys(JSON.parse(st.find(r=>r.email==='a@test.dev').data['aic-progress-v1'])).length===1);
// máy 1 đăng nhập lại
await p1.goto(B+'/dang-nhap');await p1.fill('#auth-email','a@test.dev');await p1.fill('#auth-password','secret123');await p1.click('form >> button[type=submit]');await p1.waitForURL('**/tai-khoan');await p1.waitForTimeout(2000);
check('device 1 sees unmark',(await doneCount(p1))===1);
// máy 2 đánh dấu 1 bài, máy 1 nhận khi focus lại
await p2.goto(B+'/khoa-hoc/tuan-1/hook-3-giay-dau');await p2.waitForTimeout(800);await p2.locator('.lesson-foot button').click();await p2.waitForTimeout(3000);
await p1.goto(B+'/hoc-tap');await p1.evaluate(()=>window.dispatchEvent(new Event('focus')));await p1.waitForTimeout(2000);
check('device 1 picks up change on focus',(await p1.locator('.check.on').count())===2);

// người dùng B
const [c3,p3]=await mk();
await p3.goto(B+'/dang-nhap');await p3.click('role=tab[name="Tạo tài khoản"]');await p3.fill('#auth-email','b@test.dev');await p3.fill('#auth-password','secret123');await p3.click('form >> button[type=submit]');await p3.waitForURL('**/tai-khoan');await p3.waitForTimeout(1500);
await p3.fill('#pf-handle','minh-anh');await p3.click('text=Lưu hồ sơ');await p3.waitForTimeout(800);
check('duplicate handle rejected',(await p3.textContent('form .notice')||'').includes('đã có người dùng'),await p3.textContent('form .notice'));
await p3.goto(B+'/portfolio');await p3.waitForTimeout(800);check('B sees empty portfolio',(await p3.textContent('main')).includes('Chưa có sản phẩm'));
await p3.goto(B+'/khoa-hoc/tuan-1');await p3.waitForTimeout(800);check('B cannot see A submissions',await p3.locator('.sub-list li').count()===0);
check('B progress empty',(await doneCount(p3))===0);

// điện thoại
const m=await b.newPage({viewport:{width:390,height:800},reducedMotion:'reduce'});
for(const u of ['/dang-nhap','/p/minh-anh','/portfolio','/tai-khoan']){await m.goto(B+u);await m.waitForTimeout(600);const w=await m.evaluate(()=>document.documentElement.scrollWidth);check('mobile width '+u,w<=390,String(w));}
log('errors',JSON.stringify(errs.slice(0,8)));log('FAILS',fails);await b.close();process.exit(fails?1:0)})();
