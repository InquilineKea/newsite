const RUBRIC = ['grounding', 'mechanism', 'falsifiability', 'feasibility'];
const $ = id => document.getElementById(id);
const list = value => Array.isArray(value) ? value : [];
const text = value => typeof value === 'string' ? value : value == null ? '' : JSON.stringify(value);
const number = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const titleCase = value => text(value).replace(/(^|[-_ ])\w/g, c => c.toUpperCase()).replace(/[_-]/g, ' ');
const fmt = value => number(value).toFixed(2);

export function sourceIds(candidate) {
  return [...new Set([...list(candidate.sourceIds), ...list(candidate.sources).map(source => source.paperId)].filter(Boolean))];
}
export function meanQuality(evaluations) {
  const values = list(evaluations).flatMap(e => RUBRIC.map(key => e.scores?.[key]).filter(v => typeof v === 'number' && Number.isFinite(v)));
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length / 4 * 100 : 0;
}
export function candidateEligible(candidate, evaluations, papers, sourceRequirements) {
  const ids = sourceIds(candidate);
  const known = new Map(list(papers).map(p => [p.id, p]));
  const families = ids.map(id => known.get(id)?.family);
  const requirements = sourceRequirements || {minimumDistinctPapers: 2, minimumDistinctFamilies: 2, requiredFamilies: ['alife', 'buehler']};
  const familyFit = new Set(families.filter(Boolean)).size >= (requirements.minimumDistinctFamilies ?? 2) && list(requirements.requiredFamilies).every(family => families.includes(family)) && (!requirements.requireTargetFamily || families.includes(candidate.target));
  const sources = list(candidate.sources);
  return ids.length >= (requirements.minimumDistinctPapers ?? 2) && ids.every(id => known.has(id)) && familyFit && sources.length >= 2 && sources.every(s => text(s.locator).trim() && text(s.use).trim() && text(s.boundary).trim()) && evaluations.length >= 2 && evaluations.every(e => e.nicheFit === true && e.fatal === false && number(e.scores?.grounding) >= 2);
}
export function filterCandidates(candidates, {selectedSources, query = '', status = 'all', eliteIds = new Set(), evaluations = [], papers = [], sourceRequirements}) {
  const queryLower = query.trim().toLowerCase();
  return list(candidates).filter(candidate => {
    if (!sourceIds(candidate).some(id => selectedSources.has(id))) return false;
    if (queryLower && !JSON.stringify(candidate).toLowerCase().includes(queryLower)) return false;
    if (status === 'elites' && !eliteIds.has(candidate.id)) return false;
    if (status === 'revised' && !list(candidate.parentIds).length) return false;
    if (status === 'rejected' && candidateEligible(candidate, evaluations.filter(e => e.candidateId === candidate.id), papers, sourceRequirements)) return false;
    return true;
  });
}
export function summarizeArchive(archive) {
  const entries = list(archive);
  const qdScore = entries.reduce((sum, e) => sum + number(e.quality), 0);
  return {coverage: entries.length, qdScore, meanQuality: entries.length ? qdScore / entries.length : 0};
}
export function validateRun(data) {
  if (!data || !data.config || !Array.isArray(data.config.papers) || !Array.isArray(data.config.targets) || !Array.isArray(data.config.levers) || !Array.isArray(data.candidates) || !Array.isArray(data.evaluations) || !Array.isArray(data.archive) || !Array.isArray(data.snapshots)) throw new Error('The recorded run has an unsupported format.');
  if (!data.config.targets.length || !data.config.levers.length || new Set(data.candidates.map(c => c.id)).size !== data.candidates.length) throw new Error('The recorded run has invalid niches or duplicate candidate IDs.');
  return data;
}
function el(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = text(content);
  return node;
}
function replace(node, ...children) { node.replaceChildren(...children.filter(Boolean)); }
function safeLink(url, label, className = '') {
  const a = el('a', className, label);
  try { const parsed = new URL(url); if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('Invalid URL'); a.href = parsed.href; a.target = '_blank'; a.rel = 'noopener noreferrer'; } catch { a.removeAttribute('href'); }
  return a;
}
function block(label, content) {
  if (!text(content).trim()) return null;
  const section = el('section', 'detail-block');
  section.append(el('h4', '', label), el('p', '', content));
  return section;
}

function start(data) {
  const {config} = data;
  const papers = new Map(config.papers.map(p => [p.id, p]));
  const candidates = new Map(data.candidates.map(c => [c.id, c]));
  const evaluations = id => data.evaluations.filter(e => e.candidateId === id);
  const snapshots = [...data.snapshots].sort((a, b) => number(a.round) - number(b.round));
  if (!snapshots.length) snapshots.push({round: 0, archive: data.archive});
  const state = {sources: new Set(papers.keys()), round: snapshots.at(-1).round, selectedId: null, selectedCell: null, query: '', status: 'all'};
  const totalCells = config.targets.length * config.levers.length;
  const snapshot = () => snapshots.find(s => s.round === state.round) || snapshots.at(-1);
  const archive = () => list(snapshot().archive);
  const eliteIds = () => new Set(archive().map(e => e.candidateId));
  const sourceVisible = candidate => candidate && sourceIds(candidate).some(id => state.sources.has(id));
  const roundLabel = snap => `Round ${snap.round}${snap === snapshots[0] ? ' · Initial' : snap === snapshots.at(-1) ? ' · Feedback' : ''}`;
  const finalSummary = summarizeArchive(data.archive);
  const display = config.display || {};
  const familyLabel = family => config.paperFamilies?.[family] || ({alife: 'ARTIFICIAL LIFE', buehler: 'BUEHLER / MATERIALS', method: 'SEARCH METHOD'}[family]) || titleCase(family);
  const requirements = config.sourceRequirements || {minimumDistinctPapers: 2, minimumDistinctFamilies: 2, requiredFamilies: ['alife', 'buehler']};
  const sourceRule = `Use at least ${requirements.minimumDistinctPapers ?? 2} distinct papers from at least ${requirements.minimumDistinctFamilies ?? 2} source families.${list(requirements.requiredFamilies).length ? ' Required families: ' + requirements.requiredFamilies.map(familyLabel).join(', ') + '.' : ''}${requirements.requireTargetFamily ? ' Include evidence from the target application domain.' : ''}`;
  if (display.title) { $('hero-title').textContent = display.title; document.title = `${display.title} · Paper Mixer`; }
  if (display.description) { $('hero-description').textContent = display.description; document.querySelector('meta[name="description"]').content = display.description; }
  if (display.edition) $('edition').textContent = display.edition;
  if (display.sourceHeading) $('sources-heading').textContent = display.sourceHeading;
  if (display.nextDescription) $('next-description').textContent = display.nextDescription + ' Copy a prompt with its source record and feedback to run in your own agent environment.';
  $('tag-papers').textContent = `${config.papers.length} source papers`;
  $('tag-niches').textContent = `${totalCells} research niches`;
  $('source-rule').textContent = `Select source papers to filter proposals using any selected paper. ${sourceRule}`;
  if (display.targetLabel) $('target-axis').textContent = `↓ ${display.targetLabel}`;
  $('controversy-note').hidden = !config.sourceRequirements;
  document.documentElement?.style?.setProperty?.('--lever-count', config.levers.length);


  $('stat-proposals').textContent = data.candidates.length;
  $('stat-rounds').textContent = `${snapshots.length} recorded snapshots · ${data.evaluations.length} critic evaluations`;
  $('stat-coverage').textContent = `${finalSummary.coverage} / ${totalCells}`;
  $('stat-qd').textContent = fmt(finalSummary.qdScore);
  $('method-rule').textContent = text(config.archiveRule);
  $('method-selection').textContent = text(config.selection);
  replace($('limitations'), ...list(config.limitations).map(l => el('li', '', l)));
  if (data.run?.limitation && !list(config.limitations).includes(data.run.limitation)) $('limitations').append(el('li', '', data.run.limitation));
  const date = new Date(data.run?.generatedAt);
  $('run-date').textContent = Number.isNaN(date.valueOf()) ? 'Recorded research experiment' : `Recorded ${date.toLocaleDateString('en', {day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'})} · UTC`;

  function renderSources() {
    replace($('sources'), ...config.papers.map(paper => {
      const card = el('article', `source-card${state.sources.has(paper.id) ? ' selected' : ''}`);
      card.dataset.family = paper.family;
      const top = el('div', 'source-top');
      const tag = familyLabel(paper.family);
      const label = el('label', 'source-toggle');
      const input = document.createElement('input'); input.type = 'checkbox'; input.checked = state.sources.has(paper.id); input.setAttribute('aria-label', `Include proposals using ${paper.id}`);
      input.addEventListener('change', () => { input.checked ? state.sources.add(paper.id) : state.sources.delete(paper.id); card.classList.toggle('selected', input.checked); renderResults(); });
      label.append(input, el('span', '', 'Include'));
      top.append(el('span', 'source-tag', tag), label);
      const bottom = el('div', 'source-bottom');
      const only = el('button', 'source-only', 'View only'); only.type = 'button'; only.setAttribute('aria-label', `Filter to proposals using ${paper.id}`); only.addEventListener('click', () => { state.sources = new Set([paper.id]); renderSources(); renderResults(); });
      bottom.append(el('span', '', paper.id), only, safeLink(paper.url, 'Read paper ↗'));
      card.append(top, el('h3', '', paper.title), el('p', '', paper.mechanism));
      if (paper.status) card.append(el('p', 'source-status', paper.status));
      if (paper.attention) {
        const attention = el('div', 'source-attention');
        attention.append(el('strong', '', 'Why selected'), el('p', '', paper.attention));
        if (paper.attentionUrl) attention.append(safeLink(paper.attentionUrl, 'Attention context ↗'));
        card.append(attention);
      }
      if (list(paper.references).length) {
        const details = el('details', 'source-references');
        details.append(el('summary', '', `Original / challenge / follow-up record (${paper.references.length})`));
        for (const reference of paper.references) {
          const item = el('div', 'reference-item');
          item.append(el('strong', '', titleCase(reference.relation)), safeLink(reference.url, reference.title), el('p', '', reference.scope));
          details.append(item);
        }
        card.append(details);
      }
      card.append(bottom);
      return card;
    }));
  }
  function renderRoundButtons() {
    replace($('round-controls'), ...snapshots.map(snap => {
      const button = el('button', '', roundLabel(snap)); button.type = 'button'; button.setAttribute('aria-pressed', snap.round === state.round ? 'true' : 'false');
      button.addEventListener('click', () => {
        state.round = snap.round;
        const inCell = archive().find(e => `${e.target}:${e.lever}` === state.selectedCell);
        if (inCell && sourceVisible(candidates.get(inCell.candidateId))) state.selectedId = inCell.candidateId;
        renderResults();
      });
      return button;
    }));
  }
  function renderComparison() {
    replace($('comparison-body'), ...snapshots.map(snap => {
      const summary = summarizeArchive(snap.archive);
      const row = el('tr');
      [roundLabel(snap), `${summary.coverage} / ${totalCells}`, fmt(summary.qdScore), `${fmt(summary.meanQuality)} / 100`].forEach(value => row.append(el('td', '', value)));
      return row;
    }));
  }
  function renderArchive() {
    const grid = $('archive');
    replace(grid, el('span', 'axis-corner', `${display.targetLabel || 'TARGET'} / LEVER`), ...config.levers.map(lever => el('span', 'col-heading', lever)));
    let shown = 0;
    for (const target of config.targets) {
      grid.append(el('span', 'row-heading', config.paperFamilies ? familyLabel(target).split(' / ')[0] : target));
      for (const lever of config.levers) {
        const entry = archive().find(e => e.target === target && e.lever === lever);
        const candidate = entry && candidates.get(entry.candidateId);
        const visible = entry && sourceVisible(candidate);
        const button = el('button', `archive-cell${visible ? '' : ' empty'}${visible && state.selectedId === candidate.id ? ' active' : ''}`);
        button.type = 'button';
        if (visible) {
          shown++;
          button.setAttribute('aria-label', `${titleCase(target)}, ${lever}: ${candidate.title}. AI quality ${fmt(entry.quality)} out of 100`);
          button.setAttribute('aria-pressed', String(state.selectedId === candidate.id));
          const id = el('span', 'cell-id'); id.append(el('span', '', candidate.id), el('span', '', '↗'));
          const score = el('span', 'cell-score', fmt(entry.quality)); score.append(el('small', '', ' / 100'));
          button.append(id, el('span', 'cell-title', candidate.title), score);
          button.addEventListener('click', () => { state.selectedId = candidate.id; state.selectedCell = `${target}:${lever}`; renderResults(); if (window.matchMedia('(max-width: 760px)').matches) $('detail').scrollIntoView({behavior: 'smooth', block: 'start'}); });
        } else {
          button.disabled = true;
          button.setAttribute('aria-label', `${target}, ${lever}: ${entry ? 'hidden by source filter' : 'no eligible proposal'}`);
          button.append(el('span', 'cell-id', `${target.slice(0, 3).toUpperCase()} / ${lever.slice(0, 3).toUpperCase()}`), el('span', 'cell-empty', entry ? 'Hidden by source filter' : 'No eligible proposal'), el('span', 'cell-score', '—'));
        }
        grid.append(button);
      }
    }
    $('archive-summary').textContent = `${shown} of ${totalCells} visible`;
  }
  function selectCandidate(id, scroll = false) {
    if (!candidates.has(id)) return;
    state.selectedId = id; const c = candidates.get(id); state.selectedCell = `${c.target}:${c.lever}`; renderResults();
    if (scroll) $('detail').scrollIntoView({behavior: 'smooth', block: 'start'});
  }
  function renderDetail() {
    const panel = $('detail');
    const candidate = candidates.get(state.selectedId);
    panel.classList.toggle('has-selection', Boolean(candidate));
    if (!candidate) { replace(panel, el('p', 'eyebrow', 'PROPOSAL INSPECTOR'), el('h3', '', 'Select an archive cell'), el('p', '', 'Follow the mechanism transfer, source boundaries, and critic feedback behind each proposal.')); return; }
    const reviews = evaluations(candidate.id);
    const eligible = candidateEligible(candidate, reviews, config.papers, config.sourceRequirements);
    const isElite = eliteIds().has(candidate.id);
    const badges = el('div', 'detail-meta');
    badges.append(el('span', `chip${isElite ? ' elite' : ''}`, isElite ? 'Selected-round elite' : eligible ? 'Eligible · outside archive' : 'Ineligible'), el('span', 'chip', `${candidate.target} × ${candidate.lever}`), el('span', 'chip', `Round ${candidate.round}`));
    if (!sourceVisible(candidate)) badges.append(el('span', 'chip', 'Outside source filter'));
    replace(panel, el('p', 'eyebrow', `${candidate.id} / PROPOSAL INSPECTOR`), el('h3', '', candidate.title), badges);
    if (candidate.hypothesis) panel.append(block('Testable hypothesis', candidate.hypothesis));
    panel.append(block('Mechanism transfer', candidate.mechanism));
    const sourceBlock = el('section', 'detail-block'); sourceBlock.append(el('h4', '', 'Sources & transfer boundaries'));
    for (const use of list(candidate.sources)) {
      const paper = papers.get(use.paperId);
      const source = el('div', 'source-use');
      source.append(safeLink(paper?.url, `${use.paperId} · ${paper?.title || 'Source paper'} ↗`), el('p', 'locator', use.locator), el('strong', '', 'Use'), el('p', '', use.use), el('strong', '', 'Boundary'), el('p', '', use.boundary));
      sourceBlock.append(source);
    }
    panel.append(sourceBlock);
    for (const [key, label] of [['experiment', 'Minimal experiment'], ['baseline', 'Baseline / comparison'], ['metric', 'Success metric'], ['falsifier', 'What would falsify it?'], ['confound', 'Confound / alternative explanation'], ['feasibility', 'Feasibility & resources']]) {
      const b = block(label, candidate[key]); if (b) panel.append(b);
    }
    const feedback = el('section', 'detail-block'); feedback.append(el('h4', '', 'Recorded AI feedback'), el('p', '', `${reviews.length} critic evaluations · mean normalized quality ${fmt(meanQuality(reviews))} / 100. These ratings are not experimental evidence.`));
    const scores = el('div', 'score-row');
    for (const key of RUBRIC) {
      const values = reviews.map(e => e.scores?.[key]).filter(v => typeof v === 'number' && Number.isFinite(v));
      const item = el('div', 'score-item'); item.append(el('span', '', titleCase(key)), el('strong', '', values.length ? fmt(values.reduce((a, b) => a + b, 0) / values.length) : '—')); scores.append(item);
    }
    feedback.append(scores);
    for (const review of reviews) {
      const critic = el('article', 'critic');
      const top = el('div', 'critic-top'); top.append(el('strong', '', review.critic || 'Critic'), el('span', '', `${review.nicheFit ? 'Niche fit' : 'Niche mismatch'} · ${review.fatal ? 'Fatal issue' : 'No fatal flag'}`));
      critic.append(top, el('p', '', RUBRIC.map(key => `${titleCase(key)} ${review.scores?.[key] ?? '—'}/4`).join(' · ')), el('p', 'critic-label', 'Exact feedback'), el('p', '', review.feedback));
      if (review.revision) critic.append(el('p', 'critic-label', 'Revision requested'), el('p', '', review.revision));
      feedback.append(critic);
    }
    panel.append(feedback);
    if (list(candidate.parentIds).length || candidate.changes) {
      const lineage = el('section', 'detail-block'); lineage.append(el('h4', '', 'Feedback-guided lineage'));
      for (const parentId of list(candidate.parentIds)) { const b = el('button', 'lineage-link', `← ${parentId}`); b.type = 'button'; b.addEventListener('click', () => selectCandidate(parentId)); lineage.append(b); }
      if (candidate.changes) lineage.append(el('p', '', candidate.changes)); panel.append(lineage);
    }
    const children = data.candidates.filter(c => list(c.parentIds).includes(candidate.id));
    if (children.length) {
      const lineage = el('section', 'detail-block'); lineage.append(el('h4', '', 'Revisions descended from this idea'));
      for (const child of children) { const b = el('button', 'lineage-link', `${child.id} →`); b.type = 'button'; b.addEventListener('click', () => selectCandidate(child.id)); lineage.append(b); } panel.append(lineage);
    }
  }
  function renderCandidates() {
    const filtered = filterCandidates(data.candidates, {selectedSources: state.sources, query: state.query, status: state.status, eliteIds: eliteIds(), evaluations: data.evaluations, papers: config.papers, sourceRequirements: config.sourceRequirements});
    $('candidate-count').textContent = `${filtered.length} / ${data.candidates.length} proposals`;
    replace($('candidate-list'), ...filtered.map(candidate => {
      const reviews = evaluations(candidate.id);
      const isElite = eliteIds().has(candidate.id);
      const button = el('button', `candidate-row${candidate.id === state.selectedId ? ' active' : ''}`); button.type = 'button'; button.setAttribute('aria-label', `Inspect ${candidate.id}: ${candidate.title}`);
      const title = el('span'); title.append(el('span', 'candidate-title', candidate.title), el('span', 'candidate-sources', `${sourceIds(candidate).join(' + ')} · Round ${candidate.round}${list(candidate.parentIds).length ? ' · Feedback-guided child' : ''}`));
      const niche = el('span', 'candidate-niche', `${candidate.target} / ${candidate.lever}`);
      const quality = el('span', 'candidate-quality', fmt(meanQuality(reviews))); quality.append(el('small', '', isElite ? 'ELITE' : candidateEligible(candidate, reviews, config.papers, config.sourceRequirements) ? 'ELIGIBLE' : 'INELIGIBLE'));
      button.append(el('span', 'candidate-id', candidate.id), title, niche, quality, el('span', 'candidate-arrow', '↗'));
      button.addEventListener('click', () => selectCandidate(candidate.id, true)); return button;
    }));
    if (!filtered.length) $('candidate-list').append(el('p', 'empty-message', 'No proposals match this view. Select more sources or clear the search and status filter.'));
  }
  function renderResults() {
    const visible = data.candidates.filter(sourceVisible).length;
    $('filter-summary').textContent = `${state.sources.size} of ${papers.size} papers selected · ${visible} of ${data.candidates.length} proposals use at least one selected source · View filter only`;
    renderRoundButtons(); renderArchive(); renderDetail(); renderCandidates();
  }
  $('sources-clear').addEventListener('click', () => { state.sources = new Set(); renderSources(); renderResults(); });
  $('sources-reset').addEventListener('click', () => { state.sources = new Set(papers.keys()); renderSources(); renderResults(); });
  $('search').addEventListener('input', event => { state.query = event.target.value; renderCandidates(); });
  $('status-filter').addEventListener('change', event => { state.status = event.target.value; renderCandidates(); });
  $('export-json').addEventListener('click', () => { const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'}); const url = URL.createObjectURL(blob); const a = el('a'); a.href = url; a.download = `${text(data.run?.id || config.name || 'paper-mixer-recorded-run').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); });
  $('copy-prompt').addEventListener('click', async () => {
    const candidate = candidates.get(state.selectedId);
    if (!candidate) { $('copy-status').textContent = 'Select a proposal from the archive or list first.'; return; }
    const prompt = [
      'Continue a recorded QDAIF-inspired paper-mixing experiment. Generate one feedback-guided child proposal. All proposals remain untested; do not claim empirical validation.',
      `Research question: ${config.question}`,
      `Target niche: ${candidate.target} × ${candidate.lever}. Keep this niche unless explicitly justified.`,
      `Parent proposal:\n${JSON.stringify(candidate, null, 2)}`,
      `Exact recorded critic feedback:\n${JSON.stringify(evaluations(candidate.id), null, 2)}`,
      `Source paper metadata:\n${JSON.stringify(config.papers.filter(p => sourceIds(candidate).includes(p.id)), null, 2)}`,
      `Additional constraint:\n${$('next-brief').value.trim() || 'Reduce the largest source-transfer or experimental-validity risk identified by the critics.'}`,
      `Return title, target, lever, sourceIds, sources [{paperId,locator,use,boundary}], mechanism, hypothesis, experiment, baseline, metric, falsifier, confound, feasibility, parentIds, and changes. ${sourceRule} Keep the proposal target explicit. State an executable baseline and failure condition. Preserve original claims, challenges, replies and their precise scope. Preserve disagreements and distinguish conceptual, normative and empirical claims. Ratings cannot decide scientific truth. Do not fabricate source details; consult the actual papers.`,
      `Archive rule: ${config.archiveRule}`,
      'Ask two separate critic contexts to score grounding, mechanism, falsifiability and feasibility from 0 to 4, flag nicheFit and fatal issues, and record exact feedback. Same-model critics are not independent scientific replication.'
    ].join('\n\n');
    try { await navigator.clipboard.writeText(prompt); $('copy-status').textContent = `Copied prompt for ${candidate.id}. Run it in your agent environment; no AI call was made here.`; }
    catch { const area = document.createElement('textarea'); area.value = prompt; area.setAttribute('aria-label', 'Next round prompt: select and copy'); area.style.cssText = 'width:100%;min-height:180px;margin-top:12px'; $('copy-status').textContent = 'Clipboard access unavailable. Select and copy the prompt below.'; $('copy-status').append(area); area.focus(); area.select(); }
  });
  renderSources(); renderComparison();
  state.selectedId = data.archive.find(e => candidates.has(e.candidateId))?.candidateId || data.candidates[0]?.id || null;
  const selected = candidates.get(state.selectedId); if (selected) state.selectedCell = `${selected.target}:${selected.lever}`;
  renderResults();
  $('load-status').hidden = true; $('experiment').hidden = false;
}

if (typeof document !== 'undefined') {
  fetch('./run.json', {cache: 'no-cache'}).then(response => { if (!response.ok) throw new Error(`Recorded run unavailable (HTTP ${response.status}).`); return response.json(); }).then(validateRun).then(start).catch(error => {
    const status = $('load-status'); status.classList.add('error'); status.textContent = `${error.message} Try refreshing when the recorded run is available.`;
  });
}
