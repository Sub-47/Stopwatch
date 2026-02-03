(() => {
  const timeMain     = document.getElementById('timeMain');
  const timeMs       = document.getElementById('timeMs');
  const btnStart     = document.getElementById('btnStart');
  const btnLap       = document.getElementById('btnLap');
  const btnReset     = document.getElementById('btnReset');
  const ringProgress = document.getElementById('ringProgress');
  const lapsList     = document.getElementById('lapsList');
  const lapsSection  = document.getElementById('lapsSection');

  let running       = false;
  let pausedElapsed = 0;
  let tickStart     = 0;
  let lapStart      = 0;
  let animFrame     = null;
  let laps          = [];

  const RING_CIRC   = 628;

  function fmtTime(ms) {
    const m  = Math.floor(ms / 60000);
    const s  = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return {
      main: String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0'),
      ms  : '.' + String(cs).padStart(2, '0')
    };
  }

  function getCurrentTime() {
    return running ? pausedElapsed + (performance.now() - tickStart) : pausedElapsed;
  }

  function render(ms) {
    const t = fmtTime(ms);
    timeMain.textContent = t.main;
    timeMs.textContent   = t.ms;
    const frac = (ms % 60000) / 60000;
    ringProgress.style.strokeDashoffset = RING_CIRC - (frac * RING_CIRC);
  }

  function tick() {
    render(getCurrentTime());
    animFrame = requestAnimationFrame(tick);
  }

  async function fetchLaps() {
    const res  = await fetch('/api/laps/');
    const data = await res.json();
    laps = data.reverse();
    lapStart      = laps.length ? laps[laps.length - 1].total_time : 0;
    pausedElapsed = lapStart;
    renderLaps();
    render(pausedElapsed);
  }

  async function saveLap(lapNumber, lapTime, totalTime) {
    const res = await fetch('/api/laps/save/', {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify({ lap_number: lapNumber, lap_time: lapTime, total_time: totalTime })
    });
    const data = await res.json();
    return data.id;
  }

  async function deleteLap(lapId) {
    await fetch('/api/laps/delete/' + lapId + '/', { method: 'DELETE' });
  }

  async function clearAllLaps() {
    await fetch('/api/laps/clear/', { method: 'DELETE' });
  }

  btnStart.addEventListener('click', () => {
    if (running) {
      pausedElapsed = getCurrentTime();
      cancelAnimationFrame(animFrame);
      running = false;
      btnStart.textContent = 'Start';
      btnStart.classList.remove('running');
      btnLap.disabled   = true;
      btnReset.disabled = false;
    } else {
      tickStart = performance.now();
      running   = true;
      btnStart.textContent = 'Stop';
      btnStart.classList.add('running');
      btnLap.disabled   = false;
      btnReset.disabled = true;
      animFrame = requestAnimationFrame(tick);
    }
  });

  btnLap.addEventListener('click', async () => {
    if (!running) return;
    const total     = getCurrentTime();
    const lapTime   = total - lapStart;
    const lapNumber = laps.length + 1;
    lapStart        = total;

    const id = await saveLap(lapNumber, lapTime, total);
    laps.push({ id, lap_number: lapNumber, lap_time: lapTime, total_time: total });
    renderLaps();
  });

  btnReset.addEventListener('click', async () => {
    await clearAllLaps();
    pausedElapsed = 0;
    lapStart      = 0;
    laps          = [];
    render(0);
    renderLaps();
    btnStart.textContent = 'Start';
    btnStart.classList.remove('running');
    btnLap.disabled   = true;
    btnReset.disabled = true;
  });

  function renderLaps() {
    if (!laps.length) {
      lapsSection.style.display = 'none';
      lapsList.innerHTML = '';
      return;
    }
    lapsSection.style.display = 'block';

    let fastestIdx = 0;
    let slowestIdx = 0;
    laps.forEach((l, i) => {
      if (l.lap_time < laps[fastestIdx].lap_time) fastestIdx = i;
      if (l.lap_time > laps[slowestIdx].lap_time) slowestIdx = i;
    });

    lapsList.innerHTML = [...laps].reverse().map((l) => {
      const origIdx = laps.indexOf(l);
      let cls = 'lap-row';
      if (laps.length > 1) {
        if (origIdx === fastestIdx) cls += ' fastest';
        if (origIdx === slowestIdx) cls += ' slowest';
      }
      const lt = fmtTime(l.lap_time);
      const tt = fmtTime(l.total_time);
      return '<div class="' + cls + '">' +
        '<span class="lap-num">#' + l.lap_number + '</span>' +
        '<span>' + lt.main + lt.ms + '</span>' +
        '<span>' + tt.main + tt.ms + '</span>' +
        '<button class="btn-delete" onclick="removeLap(' + l.id + ')">✕</button>' +
      '</div>';
    }).join('');
  }

  window.removeLap = async function(id) {
    await deleteLap(id);
    laps = laps.filter(l => l.id !== id);
    renderLaps();
  };

  fetchLaps();
})();