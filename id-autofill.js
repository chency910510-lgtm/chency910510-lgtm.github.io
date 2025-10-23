// id-autofill.js
function debounce(fn, delay = 400) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

function fhirNameToText(n) {
  if (!n) return '';
  if (n.text) return n.text;
  const family = n.family || '';
  const given  = Array.isArray(n.given) ? n.given.join('') : (n.given || '');
  return (family + given).trim();
}

function populateNameCandidates(candidates) {
  const dl = document.getElementById('name_candidates');
  const nameInput = document.getElementById('name');
  dl.innerHTML = '';
  const uniq = Array.from(new Set(candidates.filter(Boolean)));
  uniq.forEach(n => {
    const opt = document.createElement('option');
    opt.value = n;
    dl.appendChild(opt);
  });
  if (uniq.length === 1) nameInput.value = uniq[0];
}

async function lookupNameByIdentifier(nationalId) {
  const msg = document.getElementById('idLookupMsg');
  const nameInput = document.getElementById('name');

  if (!nationalId || nationalId.trim().length < 2) {
    nameInput.value = '';
    document.getElementById('name_candidates').innerHTML = '';
    msg.textContent = '';
    return;
  }
  try {
    msg.textContent = '查詢中…';
    const fd = new FormData();
    fd.append('userURL', `/Patient?identifier=${encodeURIComponent(nationalId.trim())}`);
    const res = await fetch(`${API_BASE_URL}/view`, { method: 'POST', body: fd });
    if (!res.ok) throw new Error('查詢失敗');
    const data = JSON.parse(await res.text());

    if (data.resourceType === 'Bundle' && Array.isArray(data.entry) && data.entry.length) {
      const names = data.entry
        .map(e => e?.resource?.name?.[0])
        .map(fhirNameToText)
        .filter(Boolean);
      populateNameCandidates(names);
      msg.textContent = names.length > 1 ? `找到 ${names.length} 筆，請選擇姓名。` : '已帶入姓名。';
      // 需要的話可存 patientId：window.currentPatientId = data.entry[0].resource.id;
    } else {
      populateNameCandidates([]);
      nameInput.value = '';
      msg.textContent = '查無此病患，請確認身分證或先建立病患資料。';
    }
  } catch {
    populateNameCandidates([]);
    nameInput.value = '';
    msg.textContent = '查詢發生錯誤。';
  }
}

/** 這個會在表單被插入到 DOM 之後再綁事件 */
export function initIdAutoFill() {
  const userIDInput = document.getElementById('userID');
  if (!userIDInput) return; // 表單尚未插入
  const debounced = debounce(() => lookupNameByIdentifier(userIDInput.value), 500);
  userIDInput.addEventListener('input', debounced);
  userIDInput.addEventListener('blur', () => lookupNameByIdentifier(userIDInput.value));
}
