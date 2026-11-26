// L3 외부평가 준비실 · Google Apps Script backend
// 학생: 이름 + 생년월일(최초 접속 시 자동 등록)
// 교사: teacher / 2580 (기본값, Script Properties에서 변경 가능)

const APP_TITLE = 'L3 외부평가 준비실';
const EXAM_DATE = '2026-12-10';
const SCORE = {A: 1, B: 0.75, C: 0.4, D: 0};

const PLANS = [
  {date:'2026-11-30', title:'하드웨어 부품 선정 Q1~15', tasks:['사전 진단','Q1~15 핵심개념','랜덤 구두면접','실기: 회로 구조·핀 확인']},
  {date:'2026-12-01', title:'하드웨어 부품 선정 Q16~30', tasks:['Q16~30 핵심개념','Q1~30 랜덤','2문장 답변','실기: 7490 Clock·Reset']},
  {date:'2026-12-02', title:'제품 자체 인증 Q1~15', tasks:['EMC·EMI·EMS','ESD','Shielding·Filtering·Grounding','실기: 7447·7-Segment']},
  {date:'2026-12-03', title:'제품 자체 인증 Q16~30', tasks:['Q16~30 핵심개념','제품인증 30문제 랜덤','실기: 전체 회로 완성']},
  {date:'2026-12-04', title:'60문제 통합 평가', tasks:['60문제 랜덤','학생별 취약문제 추출','실기: 첫 타임어택']},
  {date:'2026-12-07', title:'개인별 취약문제 집중', tasks:['취약문제 반복','꼬리질문','실기: 고장진단']},
  {date:'2026-12-08', title:'실전 모의면접 1차', tasks:['힌트 없이 실전','학생별 6문제','실기: 모의실기 1차']},
  {date:'2026-12-09', title:'D-1 최종정리', tasks:['60문제 초압축','취약문제 최종 확인','실전 모의면접 2차','실기: 마지막 전체 제작']},
  {date:'2026-12-10', title:'외부평가 당일', tasks:['핵심 키워드만 확인','새 내용 학습 금지','전원·핀·Reset·Clock 최종점검']}
];

const QUESTIONS = [{"id":"hw-1","unit":"hw","n":1,"topic":"기초·신뢰성·응용","question":"BOM이란 무엇이며, 왜 중요한지 설명해보세요.","blank":"부품 목록·수량 + 원가·구매·생산 계획의 기준","concept":"제품을 만들 때 필요한 '부품 장보기 목록'을 떠올리세요.","answer":"BOM = 자재명세서. 제품 생산에 필요한 모든 부품 목록과 수량을 정의한 문서이며 원가 산정, 자재 구매, 생산 계획, 부품 스펙과 PCB Footprint 결정의 기준입니다.","key":"부품 목록·수량 + 원가·구매·생산 계획의 기준"},{"id":"hw-2","unit":"hw","n":2,"topic":"기초·신뢰성·응용","question":"부품 선정 시 데이터시트에서 가장 먼저 확인해야 할 '최대 정격'은 무엇입니까?","blank":"Absolute Maximum Ratings","concept":"데이터시트에서 '넘으면 안 되는 한계값'입니다.","answer":"절대 최대 정격(Absolute Maximum Ratings)입니다. 이를 초과하면 부품 파손 또는 수명 저하가 발생할 수 있으므로 반드시 범위 내에서 사용해야 합니다.","key":"Absolute Maximum Ratings"},{"id":"hw-3","unit":"hw","n":3,"topic":"기초·신뢰성·응용","question":"저항을 선정할 때 고려해야 할 주요 스펙 3가지는 무엇입니까?","blank":"Ω / Wattage / Tolerance","concept":"값·전력·오차 세 가지를 떠올리세요.","answer":"저항값(Ω), 정격 전력(W), 허용 오차(Tolerance)입니다.","key":"Ω / Wattage / Tolerance"},{"id":"hw-4","unit":"hw","n":4,"topic":"기초·신뢰성·응용","question":"커패시터 선정 시 내압(Voltage Rating)은 보통 어떻게 설정합니까?","blank":"최대전압 × 1.5~2배 이상","concept":"실제 최대전압보다 '여유 있게' 잡습니다.","answer":"회로에 인가되는 최대 전압의 1.5배에서 2배 이상의 내압을 가진 부품을 선정합니다.","key":"최대전압 × 1.5~2배 이상"},{"id":"hw-5","unit":"hw","n":5,"topic":"기초·신뢰성·응용","question":"MLCC와 전해 커패시터의 주된 용도 차이를 설명해보세요.","blank":"MLCC 노이즈 / 전해 평활","concept":"MLCC=고주파, 전해=큰 용량을 떠올리세요.","answer":"MLCC는 고주파 특성이 좋아 노이즈 제거·커플링에, 전해 커패시터는 큰 용량을 이용해 전원 평활과 리플 제거에 주로 사용합니다.","key":"MLCC 노이즈 / 전해 평활"},{"id":"hw-6","unit":"hw","n":6,"topic":"기초·신뢰성·응용","question":"인덕터 선정 시 정격 전류가 중요한 이유는 무엇입니까?","blank":"포화 → L 감소 → 발열/소손","concept":"전류 초과 → 코어가 어떻게 되는지 생각하세요.","answer":"허용 전류를 초과하면 코어가 포화되어 인덕턴스가 급격히 떨어지고 발열로 소손될 수 있기 때문입니다.","key":"포화 → L 감소 → 발열/소손"},{"id":"hw-7","unit":"hw","n":7,"topic":"기초·신뢰성·응용","question":"다이오드의 주요 기능과 선정 시 확인해야 할 PIV란 무엇입니까?","blank":"정류 / 최대 역전압","concept":"정류 + 거꾸로 걸리는 전압 한계입니다.","answer":"다이오드는 전류를 한 방향으로 흐르게 하는 정류 작용을 합니다. PIV는 역방향으로 걸릴 수 있는 최대 전압으로, 초과 시 다이오드가 파괴될 수 있습니다.","key":"정류 / 최대 역전압"},{"id":"hw-8","unit":"hw","n":8,"topic":"기초·신뢰성·응용","question":"트랜지스터 데이터시트에서 안전작동 영역(SOA)이란 무엇입니까?","blank":"안전한 전압·전류 범위","concept":"Safe Operating Area의 뜻 그대로 생각하세요.","answer":"트랜지스터가 파손되지 않고 안정적으로 동작할 수 있는 전압과 전류의 범위입니다.","key":"안전한 전압·전류 범위"},{"id":"hw-9","unit":"hw","n":9,"topic":"기초·신뢰성·응용","question":"칩 저항 표기 중 F급과 J급의 차이는 무엇입니까?","blank":"F ±1% / J ±5%","concept":"F가 더 정밀합니다.","answer":"F급은 허용 오차 ±1%, J급은 ±5%입니다. F급이 더 정밀합니다.","key":"F ±1% / J ±5%"},{"id":"hw-10","unit":"hw","n":10,"topic":"기초·신뢰성·응용","question":"산업용 장비 개발 시 IC의 동작 온도 범위는 보통 어떻게 됩니까?","blank":"-40℃ ~ +85℃ 이상","concept":"상업용보다 훨씬 넓은 온도 범위입니다.","answer":"일반 상업용보다 넓은 -40℃~+85℃ 또는 그 이상의 산업용 등급을 사용합니다.","key":"-40℃ ~ +85℃ 이상"},{"id":"hw-11","unit":"hw","n":11,"topic":"기초·신뢰성·응용","question":"신규 부품 업체를 선정할 때 고려해야 할 4가지 요소(QCDT)는 무엇입니까?","blank":"품질 / 비용 / 납기 / 기술","concept":"Q-C-D-T를 영어 단어로 풀어보세요.","answer":"Quality, Cost, Delivery, Technology 즉 품질, 비용, 납기, 기술지원 능력입니다.","key":"품질 / 비용 / 납기 / 기술"},{"id":"hw-12","unit":"hw","n":12,"topic":"기초·신뢰성·응용","question":"부품 데이터시트 검토 시 주의해야 할 점(제약 사항)은 무엇입니까?","blank":"상세도 차이 / 기본회로 누락 / 비교정보 부족","concept":"데이터시트가 항상 완벽하진 않습니다.","answer":"제조사별로 상세 수준이 다르고 기본 응용회로가 누락되거나 타사 제품과의 비교 정보가 없을 수 있어 추가 자료 확인이 필요합니다.","key":"상세도 차이 / 기본회로 누락 / 비교정보 부족"},{"id":"hw-13","unit":"hw","n":13,"topic":"기초·신뢰성·응용","question":"부품의 디레이팅(Derating)이란 무엇이며 왜 필요합니까?","blank":"정격보다 낮게 사용 → 수명·신뢰성 향상","concept":"정격을 100% 꽉 채워 쓰지 않는 개념입니다.","answer":"부품 정격보다 낮은 수준(예: 50~70%)으로 여유를 두고 사용해 스트레스를 줄이고 수명과 신뢰성을 높이는 설계 기법입니다.","key":"정격보다 낮게 사용 → 수명·신뢰성 향상"},{"id":"hw-14","unit":"hw","n":14,"topic":"기초·신뢰성·응용","question":"트랜지스터나 FET 사용 시 방열판은 언제 필요합니까?","blank":"Tj 초과 예상 시","concept":"데이터시트의 Tj를 떠올리세요.","answer":"소자에서 발생하는 열로 접합온도(Tj)가 허용치를 초과할 것으로 예상될 때 방열판을 사용합니다.","key":"Tj 초과 예상 시"},{"id":"hw-15","unit":"hw","n":15,"topic":"기초·신뢰성·응용","question":"부품 승인원(Approval Sheet)에는 어떤 내용들이 포함되어야 합니까?","blank":"품명/승인자/검토결과/데이터시트/규격/샘플","concept":"부품을 회사가 공식 승인하기 위한 묶음 자료입니다.","answer":"BOM 등록번호(품명), 승인 담당자·승인권자, 관련 부서 검토 결과, 데이터시트, 환경·안전 규격, 샘플 등이 포함됩니다.","key":"품명/승인자/검토결과/데이터시트/규격/샘플"},{"id":"hw-16","unit":"hw","n":16,"topic":"기초·신뢰성·응용","question":"RoHS란 무엇이며, 어떤 물질들이 규제됩니까?","blank":"Pb / Hg / Cd / Cr6+ / PBB / PBDE","concept":"유럽의 '유해물질 사용 제한' 규제입니다.","answer":"EU의 유해물질 사용 제한 지침으로 납, 수은, 카드뮴, 6가 크롬, PBB, PBDE 등의 사용을 제한합니다.","key":"Pb / Hg / Cd / Cr6+ / PBB / PBDE"},{"id":"hw-17","unit":"hw","n":17,"topic":"기초·신뢰성·응용","question":"신규 부품 검증 시 진행하는 환경 시험의 종류는?","blank":"고온 / 저온 / 고온다습 / 열충격","concept":"온도·습도·급격한 온도변화를 생각하세요.","answer":"고온 동작, 저온 동작, 고온다습(습도), 열충격 시험 등이 있습니다.","key":"고온 / 저온 / 고온다습 / 열충격"},{"id":"hw-18","unit":"hw","n":18,"topic":"기초·신뢰성·응용","question":"부품 단종(EOL) 발생 시 대체품 선정 기준은?","blank":"Pin-to-Pin + 동등/우수 전기특성","concept":"핀과 전기적 특성을 함께 봅니다.","answer":"Pin-to-Pin 호환성(핀 배열·패키지 일치)과 전기적 특성(전압, 전류, 속도 등)이 유사하거나 더 우수한 제품을 선정해야 합니다.","key":"Pin-to-Pin + 동등/우수 전기특성"},{"id":"hw-19","unit":"hw","n":19,"topic":"기초·신뢰성·응용","question":"부품의 신뢰성을 나타내는 MTBF란 무엇입니까?","blank":"평균 고장 간격","concept":"고장과 고장 사이 평균 시간을 떠올리세요.","answer":"Mean Time Between Failures의 약자로, 수리 가능한 시스템의 평균 고장 간격 시간을 의미합니다.","key":"평균 고장 간격"},{"id":"hw-20","unit":"hw","n":20,"topic":"기초·신뢰성·응용","question":"LBO(Last Buy Order)란 무엇입니까?","blank":"단종 전 마지막 대량 구매","concept":"단종 전 마지막 구매 기회입니다.","answer":"부품 단종 전에 마지막으로 필요한 물량을 일괄 구매하여 재고를 확보하는 것입니다.","key":"단종 전 마지막 대량 구매"},{"id":"hw-21","unit":"hw","n":21,"topic":"기초·신뢰성·응용","question":"저항의 색 띠가 3개일 때와 5개일 때 읽는 법의 차이는 무엇입니까?","blank":"3색=2자리+승수 / 5색=3자리+승수+오차","concept":"유효숫자의 개수가 다릅니다.","answer":"3색 띠는 2개의 유효숫자와 승수, 5색 띠는 3개의 유효숫자와 승수, 오차를 나타내며 5색 띠가 더 정밀합니다.","key":"3색=2자리+승수 / 5색=3자리+승수+오차"},{"id":"hw-22","unit":"hw","n":22,"topic":"기초·신뢰성·응용","question":"탄탈 커패시터를 사용할 때 특히 주의해야 할 점은 무엇입니까?","blank":"역극성·과전압·리플전류 주의","concept":"극성과 과전압을 특히 조심합니다.","answer":"극성이 있어 역전압 인가 시 파손될 수 있으며, 과전압이나 허용 리플 전류 초과 시 발화 위험이 있어 충분한 마진을 두어야 합니다.","key":"역극성·과전압·리플전류 주의"},{"id":"hw-23","unit":"hw","n":23,"topic":"기초·신뢰성·응용","question":"쇼트키 다이오드의 특징과 용도는 무엇입니까?","blank":"낮은 순방향 전압 / 빠른 스위칭","concept":"낮은 Vf + 빠른 속도입니다.","answer":"순방향 전압 강하가 낮고 스위칭 속도가 빨라 고속 스위칭 회로에 주로 사용됩니다.","key":"낮은 순방향 전압 / 빠른 스위칭"},{"id":"hw-24","unit":"hw","n":24,"topic":"기초·신뢰성·응용","question":"트랜지스터 품명 2SC1815에서 2SC가 의미하는 바는 무엇입니까?","blank":"2=트랜지스터, S=반도체, C=NPN 고주파","concept":"2 / S / C 각각의 의미를 나눠보세요.","answer":"2는 트랜지스터 계열, S는 Semiconductor, C는 NPN형 고주파용 트랜지스터를 의미합니다.","key":"2=트랜지스터, S=반도체, C=NPN 고주파"},{"id":"hw-25","unit":"hw","n":25,"topic":"기초·신뢰성·응용","question":"풀업 저항과 풀다운 저항의 용도는 무엇입니까?","blank":"Pull-up=High / Pull-down=Low / Floating 방지","concept":"입력이 떠 있지 않게 High나 Low로 잡아줍니다.","answer":"풀업은 신호선을 전원 전압(High)으로, 풀다운은 접지(Low)로 연결해 플로팅을 방지하고 초기 논리 레벨을 정합니다.","key":"Pull-up=High / Pull-down=Low / Floating 방지"},{"id":"hw-26","unit":"hw","n":26,"topic":"기초·신뢰성·응용","question":"인덕터가 고주파 회로에서 필터로 사용될 때 어떤 원리가 적용됩니까?","blank":"고주파에서 높은 임피던스","concept":"주파수가 높을수록 인덕터가 더 막습니다.","answer":"인덕터는 고주파 신호에 대해 높은 임피던스를 가지므로 고주파 노이즈를 차단하고 저주파 신호를 통과시키는 원리가 적용됩니다.","key":"고주파에서 높은 임피던스"},{"id":"hw-27","unit":"hw","n":27,"topic":"기초·신뢰성·응용","question":"부품 선정 시 단종(EOL) 관리를 위해 개발자가 평소에 해야 할 일은?","blank":"단종 모니터링 / 대체품 확보 / LBO 관리","concept":"단종은 미리 감지하고 대비합니다.","answer":"주요 부품의 단종 정보를 주기적으로 확인하고 대체품을 미리 검색하며 제조사와 소통해 LBO 기회를 놓치지 않아야 합니다.","key":"단종 모니터링 / 대체품 확보 / LBO 관리"},{"id":"hw-28","unit":"hw","n":28,"topic":"기초·신뢰성·응용","question":"부품의 오차가 회로 동작에 미치는 영향을 전압 분배 회로를 예로 들어 설명해보세요.","blank":"저항오차 → 분압비 변화 → 출력전압 변화","concept":"저항값이 달라지면 분압비도 달라집니다.","answer":"저항 오차가 누적되면 전압 분배 비율이 설계값과 달라져 출력전압이 허용 범위를 벗어나고 회로 오작동을 일으킬 수 있습니다.","key":"저항오차 → 분압비 변화 → 출력전압 변화"},{"id":"hw-29","unit":"hw","n":29,"topic":"기초·신뢰성·응용","question":"FET가 BJT보다 유리한 점은 무엇입니까?","blank":"고입력임피던스 / 저구동전력 / 빠른 스위칭 / 열폭주 적음","concept":"입력 임피던스와 스위칭을 생각하세요.","answer":"입력 임피던스가 매우 높아 구동 전력이 적고, 스위칭 속도가 빠르며 열폭주가 적어 전력 제어에 유리합니다.","key":"고입력임피던스 / 저구동전력 / 빠른 스위칭 / 열폭주 적음"},{"id":"hw-30","unit":"hw","n":30,"topic":"기초·신뢰성·응용","question":"다이오드를 사용하여 회로를 보호하는 방법(리미터, 클램퍼 등)을 설명해보세요.","blank":"Limiter 진폭 제한 / Clamper 레벨 이동","concept":"리미터=폭 제한, 클램퍼=레벨 이동입니다.","answer":"리미터는 신호 진폭을 제한해 회로를 보호하고, 클램퍼는 신호 전체의 전압 레벨을 이동시켜 특정 범위에 위치하도록 합니다.","key":"Limiter 진폭 제한 / Clamper 레벨 이동"},{"id":"cert-1","unit":"cert","n":1,"topic":"인증·EMC·신뢰성","question":"전자 제품 인증과 관련된 주요 규제 2가지(안전, 전자파)는 무엇입니까?","blank":"안전 인증 / 전자파 적합성","concept":"안전 쪽 법과 전자파 쪽 법을 구분하세요.","answer":"안전 인증(전기용품 및 생활용품 안전관리법)과 전자파 적합성 인증(전파법, KC)입니다.","key":"안전 인증 / 전자파 적합성"},{"id":"cert-2","unit":"cert","n":2,"topic":"인증·EMC·신뢰성","question":"EMC의 두 가지 구성 요소(EMI, EMS)를 설명해보세요.","blank":"EMI=방출 / EMS=내성","concept":"내가 내보내는 것과, 밖에서 들어오는 것을 견디는 것으로 구분하세요.","answer":"EMI는 전자파 방출(남에게 피해를 주지 않음), EMS는 전자파 내성(외부 노이즈에 견딤)을 의미합니다.","key":"EMI=방출 / EMS=내성"},{"id":"cert-3","unit":"cert","n":3,"topic":"인증·EMC·신뢰성","question":"전도성 노이즈와 방사성 노이즈의 차이는?","blank":"도체를 탐 / 공기 중 방사","concept":"선을 타는지, 공간으로 퍼지는지 구분하세요.","answer":"전도성 노이즈는 전원선 등 도체를 타고 흐르는 노이즈이고, 방사성 노이즈는 공기 중으로 방사되는 노이즈입니다.","key":"도체를 탐 / 공기 중 방사"},{"id":"cert-4","unit":"cert","n":4,"topic":"인증·EMC·신뢰성","question":"전자파 노이즈를 줄이는 대표적인 3가지 대책은 무엇입니까?","blank":"Shielding / Filtering / Grounding","concept":"S-F-G를 떠올리세요.","answer":"차폐(Shielding), 필터링(Filtering), 접지(Grounding)입니다.","key":"Shielding / Filtering / Grounding"},{"id":"cert-5","unit":"cert","n":5,"topic":"인증·EMC·신뢰성","question":"PCB 설계 시 노이즈를 줄이기 위해 그라운드는 어떻게 처리해야 합니까?","blank":"GND 분리 / 면적 확대 / Loop 최소화","concept":"분리·넓게·루프 최소화입니다.","answer":"아날로그와 디지털 그라운드를 분리하거나, 접지 면적을 넓히고, 그라운드 루프를 최소화해야 합니다.","key":"GND 분리 / 면적 확대 / Loop 최소화"},{"id":"cert-6","unit":"cert","n":6,"topic":"인증·EMC·신뢰성","question":"전원 라인의 노이즈 제거를 위해 주로 사용하는 부품들은 무엇입니까?","blank":"Ferrite / EMI Filter / Decoupling C / Coil","concept":"고주파를 막거나 우회시키는 부품들을 생각하세요.","answer":"페라이트 비드, EMI 필터, 바이패스(Decoupling) 커패시터, 코일 등을 사용합니다.","key":"Ferrite / EMI Filter / Decoupling C / Coil"},{"id":"cert-7","unit":"cert","n":7,"topic":"인증·EMC·신뢰성","question":"ESD 시험의 목적과 판정 기준은 무엇입니까?","blank":"오동작·파손 없음 / 기능 정상 / 데이터 유지","concept":"정전기에도 정상 동작과 데이터 유지가 핵심입니다.","answer":"정전기로 인한 제품의 오동작이나 파손 여부를 확인하며, 기능 수행에 문제가 없고 데이터가 손실되지 않아야 합니다.","key":"오동작·파손 없음 / 기능 정상 / 데이터 유지"},{"id":"cert-8","unit":"cert","n":8,"topic":"인증·EMC·신뢰성","question":"쉴딩의 원리와 목적은 무엇입니까?","blank":"금속 차폐로 방출·유입 차단","concept":"전자파 방패라고 생각하세요.","answer":"금속 케이스 등으로 회로를 감싸 전자파가 밖으로 나가거나 외부에서 들어오는 것을 차단하는 것입니다.","key":"금속 차폐로 방출·유입 차단"},{"id":"cert-9","unit":"cert","n":9,"topic":"인증·EMC·신뢰성","question":"페라이트 비드는 회로에서 어떤 역할을 합니까?","blank":"고주파 노이즈 억제","concept":"고주파만 골라 약화시키는 부품입니다.","answer":"고주파 노이즈를 열로 변환하여 제거하는 필터 역할을 합니다.","key":"고주파 노이즈 억제"},{"id":"cert-10","unit":"cert","n":10,"topic":"인증·EMC·신뢰성","question":"바이패스 커패시터는 어디에 배치해야 가장 효과적입니까?","blank":"IC VCC 핀 최대한 근접","concept":"노이즈를 잡을 대상 바로 옆에 둡니다.","answer":"IC의 전원 핀(VCC)에 최대한 가깝게 배치해야 합니다.","key":"IC VCC 핀 최대한 근접"},{"id":"cert-11","unit":"cert","n":11,"topic":"인증·EMC·신뢰성","question":"자체 인증(신뢰성 시험)을 수행하는 목적은 무엇입니까?","blank":"신뢰성 평가 + 문제 사전 발견·개선","concept":"본 인증 전 문제를 미리 잡는 단계입니다.","answer":"개발 단계에서 제품의 신뢰성(수명, 고장률)을 평가하고 공인 인증 전 문제점을 사전에 발견해 개선하기 위함입니다.","key":"신뢰성 평가 + 문제 사전 발견·개선"},{"id":"cert-12","unit":"cert","n":12,"topic":"인증·EMC·신뢰성","question":"환경 시험 중 열충격 시험은 어떤 조건에서 진행합니까?","blank":"저온 ↔ 고온 급격한 반복","concept":"천천히가 아니라 급격한 온도 변화가 핵심입니다.","answer":"저온과 고온을 급격하게 오가는 환경에 제품을 노출시켜 내구성을 평가합니다.","key":"저온 ↔ 고온 급격한 반복"},{"id":"cert-13","unit":"cert","n":13,"topic":"인증·EMC·신뢰성","question":"고온/고습 방치 시험(85/85 Test)의 목적은 무엇입니까?","blank":"85℃ / 85%RH / 내습성·내구성","concept":"이름 자체가 숫자를 알려줍니다.","answer":"고온(85℃) 및 고습(85%) 환경에 장시간 방치하여 제품의 내습성 및 내구성을 평가합니다.","key":"85℃ / 85%RH / 내습성·내구성"},{"id":"cert-14","unit":"cert","n":14,"topic":"인증·EMC·신뢰성","question":"인증 신청 시 제출해야 할 기술 문서에는 어떤 것들이 있습니까?","blank":"사양서 / 회로도 / 배치도 / 패턴도 / BOM / 설명서","concept":"제품 구조와 사용법을 설명하는 설계 자료 묶음입니다.","answer":"제품 사양서, 회로도, 부품 배치도, PCB 패턴도, 부품 목록(BOM), 사용자 설명서 등이 있습니다.","key":"사양서 / 회로도 / 배치도 / 패턴도 / BOM / 설명서"},{"id":"cert-15","unit":"cert","n":15,"topic":"인증·EMC·신뢰성","question":"제품 사양서에 반드시 포함되어야 할 항목은 무엇입니까?","blank":"제품·모델 / 정격 / 기능 / 크기·무게 / 환경","concept":"제품이 누구이고, 전기를 얼마나 쓰고, 무엇을 하는지 적습니다.","answer":"제품명, 모델명, 정격 전압·전류, 주요 기능, 크기·무게, 사용 환경(온습도) 등이 포함되어야 합니다.","key":"제품·모델 / 정격 / 기능 / 크기·무게 / 환경"},{"id":"cert-16","unit":"cert","n":16,"topic":"인증·EMC·신뢰성","question":"인증 받은 제품의 주요 부품이 변경될 경우 어떻게 해야 합니까?","blank":"변경 신고 / 중요 부품은 재시험","concept":"인증 당시 구성과 달라졌다면 변경 절차가 필요합니다.","answer":"변경 사항을 인증 기관에 신고하거나, 중요 부품 변경 시 재시험(변경 인증)을 받아야 합니다.","key":"변경 신고 / 중요 부품은 재시험"},{"id":"cert-17","unit":"cert","n":17,"topic":"인증·EMC·신뢰성","question":"제품 평가 단계(Proto → DVT → MP)를 설명해보세요.","blank":"Proto → DVT → MVT → MP","concept":"시제품 → 신뢰성 → 양산성 → 양산 순서입니다.","answer":"개발 시작(Proto) → 개발 검증(DVT: 신뢰성 확보) → 시양산(MVT: 양산성 확보) → 양산(MP) 단계로 진행됩니다.","key":"Proto → DVT → MVT → MP"},{"id":"cert-18","unit":"cert","n":18,"topic":"인증·EMC·신뢰성","question":"가속 수명 시험이란 무엇입니까?","blank":"가혹조건 → 짧은 시간에 수명 예측","concept":"정상보다 센 조건으로 시간을 압축합니다.","answer":"실제 사용 조건보다 가혹한 조건(고온, 고전압 등)에서 시험하여 짧은 시간 내에 수명을 예측하는 시험입니다.","key":"가혹조건 → 짧은 시간에 수명 예측"},{"id":"cert-19","unit":"cert","n":19,"topic":"인증·EMC·신뢰성","question":"인증 결과 보고서 작성 시 포함되어야 할 내용은?","blank":"개요·사양 / 시험·데이터 / 판정 / 장비·조건","concept":"무엇을 어떤 조건에서 시험했고 결과가 어땠는지 기록합니다.","answer":"제품 개요, 상세 사양, 수행한 시험 항목 및 결과 데이터, 판정 결과, 시험 장비 및 조건 등이 포함됩니다.","key":"개요·사양 / 시험·데이터 / 판정 / 장비·조건"},{"id":"cert-20","unit":"cert","n":20,"topic":"인증·EMC·신뢰성","question":"공인 인증 기관에 가기 전 Pre-test를 하는 이유는?","blank":"재시험 비용·시간 절약 / 일정 지연 방지","concept":"본시험에서 떨어졌을 때의 비용과 시간을 줄입니다.","answer":"인증 실패 시 발생하는 재시험 비용과 시간을 절약하고 개발 일정 지연을 막기 위해서입니다.","key":"재시험 비용·시간 절약 / 일정 지연 방지"},{"id":"cert-21","unit":"cert","n":21,"topic":"인증·EMC·신뢰성","question":"WEEE와 RoHS 규제의 차이점은 무엇입니까?","blank":"WEEE=재활용 / RoHS=유해물질 제한","concept":"버린 뒤 처리 vs 만들 때 쓰는 물질로 구분하세요.","answer":"WEEE는 폐가전 제품의 재활용 의무화 규제이고, RoHS는 유해 물질 사용 자체를 제한하는 규제입니다.","key":"WEEE=재활용 / RoHS=유해물질 제한"},{"id":"cert-22","unit":"cert","n":22,"topic":"인증·EMC·신뢰성","question":"정전용량 방식 터치스크린의 동작 원리는 무엇입니까?","blank":"터치 → 정전용량 변화 감지","concept":"손가락이 닿을 때 C가 변합니다.","answer":"인체(손가락)의 정전용량을 이용하여 터치 시 변화하는 커패시턴스 값을 감지해 위치를 인식합니다.","key":"터치 → 정전용량 변화 감지"},{"id":"cert-23","unit":"cert","n":23,"topic":"인증·EMC·신뢰성","question":"저온 동작 시험 시 배터리 특성 변화에 대해 설명해보세요.","blank":"내부저항↑ / 전압강하↑ / 용량↓","concept":"추워지면 내부 저항이 어떻게 되는지 생각하세요.","answer":"저온에서는 배터리 내부 저항이 증가해 전압 강하가 커지고 용량이 감소하여 동작 시간이 줄어듭니다.","key":"내부저항↑ / 전압강하↑ / 용량↓"},{"id":"cert-24","unit":"cert","n":24,"topic":"인증·EMC·신뢰성","question":"KC 인증 마크의 의미와 표시 방법은?","blank":"국가통합인증마크 / 제품·포장 표시","concept":"여러 인증을 하나로 통합한 국가 마크입니다.","answer":"안전, 보건, 환경, 품질 등 분야별 인증 마크를 단일화한 국가통합인증마크이며 제품이나 포장에 알아보기 쉽게 표시해야 합니다.","key":"국가통합인증마크 / 제품·포장 표시"},{"id":"cert-25","unit":"cert","n":25,"topic":"인증·EMC·신뢰성","question":"안전 인증 대상 품목과 자율 안전 확인 대상 품목의 차이는?","blank":"안전인증=고위험+공장심사 / 자율안전=저위험+성적서","concept":"위험도가 높은 쪽이 절차도 더 엄격합니다.","answer":"안전 인증은 위험도가 높은 제품으로 공장 심사가 필요하고, 자율 안전 확인은 위험도가 낮은 제품으로 시험 성적서 제출만으로 가능합니다.","key":"안전인증=고위험+공장심사 / 자율안전=저위험+성적서"},{"id":"cert-26","unit":"cert","n":26,"topic":"인증·EMC·신뢰성","question":"EMI 대책 중 노이즈 필터의 원리는 무엇입니까?","blank":"L+C로 차단 또는 GND 우회","concept":"L과 C를 조합합니다.","answer":"코일(L)과 커패시터(C)를 조합하여 특정 주파수 대역의 노이즈를 차단하거나 접지로 바이패스시키는 원리입니다.","key":"L+C로 차단 또는 GND 우회"},{"id":"cert-27","unit":"cert","n":27,"topic":"인증·EMC·신뢰성","question":"제품 신뢰성 시험에서 샘플 수는 어떻게 결정합니까?","blank":"신뢰성 수준 / 허용불량률 / 경제성 / 통계규격","concept":"임의가 아니라 신뢰성·불량률·규격을 봅니다.","answer":"신뢰성 수준과 허용 불량률, 경제성 등을 고려하여 통계적인 방법(KS, IEC 규격 등)에 따라 결정합니다.","key":"신뢰성 수준 / 허용불량률 / 경제성 / 통계규격"},{"id":"cert-28","unit":"cert","n":28,"topic":"인증·EMC·신뢰성","question":"리턴 패스(Return Path)가 EMI에 미치는 영향은 무엇입니까?","blank":"Return Path 길어짐 → Loop↑ → EMI↑","concept":"가는 길과 돌아오는 길이 멀어지면 큰 루프가 됩니다.","answer":"신호 전류의 귀환 경로가 길어지면 루프 면적이 커져 방사 노이즈(EMI)가 증가하므로 최단 경로로 설계해야 합니다.","key":"Return Path 길어짐 → Loop↑ → EMI↑"},{"id":"cert-29","unit":"cert","n":29,"topic":"인증·EMC·신뢰성","question":"ESD 보호 소자인 TVS 다이오드의 역할은 무엇입니까?","blank":"ESD 과전압 시 빠른 도통·클램프","concept":"순간적인 과전압을 대신 받아주는 보호소자입니다.","answer":"외부 인터페이스 라인에 과도한 정전기 전압이 들어올 때 빠르게 도통되어 회로를 보호합니다.","key":"ESD 과전압 시 빠른 도통·클램프"},{"id":"cert-30","unit":"cert","n":30,"topic":"인증·EMC·신뢰성","question":"제품 출하 검사 성적서에 포함되어야 할 주요 항목은?","blank":"외관 / 기능 / 구성품 / 포장 / 판정","concept":"출하 직전 마지막 확인 항목들입니다.","answer":"외관 검사, 기능 검사, 구성품 확인, 포장 상태 등을 확인하고 합격·불합격 여부를 판정합니다.","key":"외관 / 기능 / 구성품 / 포장 / 판정"}];

function doGet() {
  ensureDb_();
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle(APP_TITLE)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport','width=device-width, initial-scale=1');
}

function setup() {
  const ss = ensureDb_();
  const p = PropertiesService.getScriptProperties();
  if (!p.getProperty('TOKEN_SECRET')) p.setProperty('TOKEN_SECRET', Utilities.getUuid()+Utilities.getUuid());
  if (!p.getProperty('DOB_SALT')) p.setProperty('DOB_SALT', Utilities.getUuid()+Utilities.getUuid());
  if (!p.getProperty('TEACHER_ID')) p.setProperty('TEACHER_ID','teacher');
  if (!p.getProperty('TEACHER_PASSWORD')) p.setProperty('TEACHER_PASSWORD','2580');
  return {spreadsheetUrl:ss.getUrl(), teacherId:p.getProperty('TEACHER_ID')};
}

function loginStudent(name, dob) {
  setup();
  name = normalizeName_(name);
  const dobNorm = normalizeDob_(dob);
  if (!name || name.length < 2) return {ok:false, message:'이름을 정확히 입력해 주세요.'};
  if (!dobNorm) return {ok:false, message:'생년월일을 6자리 또는 8자리 숫자로 입력해 주세요.'};
  const hash = hashDob_(dobNorm);
  const sh = getSheet_('Students');
  const rows = sheetObjects_(sh);
  const same = rows.find(r => normalizeName_(r.name) === name);
  const now = new Date();
  let studentId;
  if (same) {
    if (String(same.dob_hash) !== hash) return {ok:false, message:'등록된 이름입니다. 생년월일을 다시 확인해 주세요.'};
    studentId = String(same.id);
    updateCellById_(sh, same._row, 'last_login', now);
  } else {
    studentId = 'S-' + Utilities.getUuid();
    sh.appendRow([studentId, name, hash, now, now]);
  }
  return {ok:true, token:makeToken_({role:'student', studentId:studentId})};
}

function loginTeacher(id, password) {
  setup();
  const p = PropertiesService.getScriptProperties();
  if (String(id||'').trim() !== p.getProperty('TEACHER_ID') || String(password||'') !== p.getProperty('TEACHER_PASSWORD')) {
    return {ok:false, message:'교사 아이디 또는 비밀번호가 올바르지 않습니다.'};
  }
  return {ok:true, token:makeToken_({role:'teacher'})};
}

function getBootstrap(token) {
  const auth = verifyToken_(token);
  const students = listStudents_();
  const attempts = listAttempts_();
  const practicals = listPracticals_();
  if (auth.role === 'student') {
    const s = students.find(x=>x.id===auth.studentId);
    if (!s) throw new Error('삭제되었거나 존재하지 않는 계정입니다.');
    return {role:'student', student:s, questions:clientQuestions_(), plans:PLANS,
      attempts:attempts.filter(a=>a.studentId===s.id), practicals:practicals.filter(p=>p.studentId===s.id)};
  }
  const dash = students.map(s=>studentSummary_(s, attempts.filter(a=>a.studentId===s.id)));
  const weak = overallWeak_(students, attempts);
  return {role:'teacher', questions:clientQuestions_(), plans:PLANS, students:students, dashboard:dash,
    weak:weak, recentPracticals:practicals.slice(-100)};
}

function recordAttempt(token, payload) {
  const auth = verifyToken_(token);
  payload = payload || {};
  const qid = String(payload.questionId||'');
  if (!QUESTIONS.some(q=>q.id===qid)) throw new Error('문항을 찾을 수 없습니다.');
  let studentId, type;
  if (auth.role === 'student') { studentId=auth.studentId; type='student_self'; }
  else { studentId=String(payload.studentId||''); type='teacher_interview'; }
  if (!getStudent_(studentId)) throw new Error('학생을 찾을 수 없습니다.');
  const result = String(payload.result||'');
  if (!['A','B','C','D'].includes(result)) throw new Error('평가값이 올바르지 않습니다.');
  getSheet_('Attempts').appendRow([
    Utilities.getUuid(), studentId, qid, type, result,
    Number(payload.hintUsed||0), Number(payload.answerTime||0), new Date()
  ]);
  return {ok:true, attempts:listAttempts_().filter(a=>a.studentId===studentId)};
}

function savePractical(token, payload) {
  const auth = verifyToken_(token); if (auth.role!=='teacher') throw new Error('교사 권한이 필요합니다.');
  payload=payload||{}; const sid=String(payload.studentId||'');
  if(!getStudent_(sid)) throw new Error('학생을 찾을 수 없습니다.');
  getSheet_('Practicals').appendRow([
    Utilities.getUuid(), sid, new Date(), Number(payload.elapsed||0),
    String(payload.completion||''), String(payload.operation||''), String(payload.diagnosis||''),
    String(payload.errors||''), String(payload.comment||''), new Date()
  ]);
  return {ok:true};
}

function renameStudent(token, studentId, newName) {
  const auth=verifyToken_(token); if(auth.role!=='teacher') throw new Error('교사 권한이 필요합니다.');
  newName=normalizeName_(newName); if(!newName) throw new Error('이름을 입력해 주세요.');
  const sh=getSheet_('Students'), rows=sheetObjects_(sh), row=rows.find(r=>String(r.id)===String(studentId));
  if(!row) throw new Error('학생을 찾을 수 없습니다.');
  const duplicate=rows.find(r=>r._row!==row._row && normalizeName_(r.name)===newName);
  if(duplicate) throw new Error('같은 이름의 계정이 이미 있습니다.');
  updateCellById_(sh,row._row,'name',newName); return {ok:true};
}

function deleteStudent(token, studentId) {
  const auth=verifyToken_(token); if(auth.role!=='teacher') throw new Error('교사 권한이 필요합니다.');
  const sh=getSheet_('Students'), rows=sheetObjects_(sh), row=rows.find(r=>String(r.id)===String(studentId));
  if(!row) throw new Error('학생을 찾을 수 없습니다.');
  // 개인정보 최소화를 위해 계정과 관련 학습 기록을 함께 삭제
  deleteRowsByStudent_(getSheet_('Attempts'), studentId, 'student_id');
  deleteRowsByStudent_(getSheet_('Practicals'), studentId, 'student_id');
  sh.deleteRow(row._row);
  return {ok:true};
}

function changeTeacherPassword(token, currentPassword, newPassword) {
  const auth=verifyToken_(token); if(auth.role!=='teacher') throw new Error('교사 권한이 필요합니다.');
  const p=PropertiesService.getScriptProperties();
  if(String(currentPassword||'')!==p.getProperty('TEACHER_PASSWORD')) throw new Error('현재 비밀번호가 다릅니다.');
  if(String(newPassword||'').length<4) throw new Error('새 비밀번호는 4자리 이상으로 설정해 주세요.');
  p.setProperty('TEACHER_PASSWORD',String(newPassword)); return {ok:true};
}

function getDatabaseUrl(token) {
  const auth=verifyToken_(token); if(auth.role!=='teacher') throw new Error('교사 권한이 필요합니다.');
  return ensureDb_().getUrl();
}

function ensureDb_(){
  const p=PropertiesService.getScriptProperties(); let id=p.getProperty('DB_ID'); let ss;
  try{ if(id) ss=SpreadsheetApp.openById(id); }catch(e){ id=null; }
  if(!id){ ss=SpreadsheetApp.create('L3 외부평가 준비실 DB'); p.setProperty('DB_ID',ss.getId()); }
  else ss=SpreadsheetApp.openById(id);
  ensureSheet_(ss,'Students',['id','name','dob_hash','created_at','last_login']);
  ensureSheet_(ss,'Attempts',['id','student_id','question_id','assessment_type','result','hint_used','answer_time','created_at']);
  ensureSheet_(ss,'Practicals',['id','student_id','date','elapsed','completion','operation','diagnosis','errors','comment','created_at']);
  return ss;
}
function ensureSheet_(ss,name,headers){let sh=ss.getSheetByName(name);if(!sh)sh=ss.insertSheet(name);if(sh.getLastRow()===0)sh.appendRow(headers);return sh;}
function getSheet_(name){return ensureDb_().getSheetByName(name);}
function sheetObjects_(sh){const v=sh.getDataRange().getValues(); if(v.length<2)return[]; const h=v[0].map(String);return v.slice(1).map((r,i)=>{const o={_row:i+2};h.forEach((k,j)=>o[k]=r[j]);return o;});}
function updateCellById_(sh,rowIndex,header,value){const h=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];const c=h.indexOf(header)+1;if(c<1)throw new Error('DB 컬럼 오류');sh.getRange(rowIndex,c).setValue(value);}
function deleteRowsByStudent_(sh,sid,header){const rows=sheetObjects_(sh).filter(r=>String(r[header])===String(sid)).sort((a,b)=>b._row-a._row);rows.forEach(r=>sh.deleteRow(r._row));}
function normalizeName_(s){return String(s||'').trim().replace(/\s+/g,' ');}
function normalizeDob_(s){const d=String(s||'').replace(/\D/g,''); return (d.length===6||d.length===8)?d:'';}
function hashDob_(d){const salt=PropertiesService.getScriptProperties().getProperty('DOB_SALT')||'l3';const bytes=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,salt+'|'+d,Utilities.Charset.UTF_8);return bytes.map(b=>(b+256)%256).map(b=>('0'+b.toString(16)).slice(-2)).join('');}
function makeToken_(payload){const p=PropertiesService.getScriptProperties();const secret=p.getProperty('TOKEN_SECRET');const data=Object.assign({},payload,{exp:Date.now()+1000*60*60*24*30});const body=Utilities.base64EncodeWebSafe(JSON.stringify(data));const sig=Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(body,secret));return body+'.'+sig;}
function verifyToken_(token){setup();const parts=String(token||'').split('.');if(parts.length!==2)throw new Error('다시 로그인해 주세요.');const secret=PropertiesService.getScriptProperties().getProperty('TOKEN_SECRET');const sig=Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(parts[0],secret));if(sig!==parts[1])throw new Error('다시 로그인해 주세요.');const p=JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[0])).getDataAsString());if(Number(p.exp)<Date.now())throw new Error('로그인이 만료되었습니다.');return p;}
function listStudents_(){return sheetObjects_(getSheet_('Students')).map(r=>({id:String(r.id),name:String(r.name),createdAt:dateIso_(r.created_at),lastLogin:dateIso_(r.last_login)}));}
function getStudent_(id){return listStudents_().find(s=>s.id===String(id));}
function listAttempts_(){return sheetObjects_(getSheet_('Attempts')).map(r=>({id:String(r.id),studentId:String(r.student_id),questionId:String(r.question_id),assessmentType:String(r.assessment_type),result:String(r.result),hintUsed:Number(r.hint_used||0),answerTime:Number(r.answer_time||0),createdAt:dateIso_(r.created_at)}));}
function listPracticals_(){return sheetObjects_(getSheet_('Practicals')).map(r=>({id:String(r.id),studentId:String(r.student_id),date:dateIso_(r.date),elapsed:Number(r.elapsed||0),completion:String(r.completion||''),operation:String(r.operation||''),diagnosis:String(r.diagnosis||''),errors:String(r.errors||''),comment:String(r.comment||''),createdAt:dateIso_(r.created_at)}));}
function dateIso_(v){if(!v)return'';try{return new Date(v).toISOString();}catch(e){return String(v);}}
function clientQuestions_(){return QUESTIONS.map(q=>({id:q.id,unit:q.unit,number:q.n,topic:q.topic,question:q.question,hint1:q.blank,hint2:q.concept,answer:q.answer,key:q.key}));}
function studentSummary_(s,atts){const latest={};atts.forEach(a=>{const old=latest[a.questionId];if(!old||String(old.createdAt)<String(a.createdAt))latest[a.questionId]=a;});function pct(unit){const qs=QUESTIONS.filter(q=>!unit||q.unit===unit);return Math.round(qs.reduce((n,q)=>n+(SCORE[latest[q.id]?.result]||0),0)/qs.length*100);}const weak=QUESTIONS.filter(q=>['C','D'].includes(latest[q.id]?.result)).length;return {id:s.id,name:s.name,total:pct(),hw:pct('hw'),cert:pct('cert'),weak:weak,attempts:atts.length,lastLogin:s.lastLogin,createdAt:s.createdAt};}
function overallWeak_(students,atts){return QUESTIONS.map(q=>{let count=0,sum=0;students.forEach(s=>{const arr=atts.filter(a=>a.studentId===s.id&&a.questionId===q.id).sort((a,b)=>String(a.createdAt).localeCompare(String(b.createdAt)));const a=arr[arr.length-1];if(a){sum+=SCORE[a.result]||0;if(['C','D'].includes(a.result))count++;}});return {id:q.id,question:q.question,count:count,pct:students.length?Math.round(sum/students.length*100):0};}).filter(x=>x.count>0).sort((a,b)=>b.count-a.count||a.pct-b.pct);}