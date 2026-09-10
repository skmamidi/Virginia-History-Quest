import { useRef, useState } from 'react';
import { BookOpen, Download, Printer } from 'lucide-react';
import { Modal } from './Modal';
import { REGION_LESSONS, VISIT_IDEAS } from '../../../contexts/published-content/adapters/schoolMaterials';
import { parseScrapbook, projectChecklist, visitChecklist, type Scrapbook as Book, type Visit } from '../../../contexts/scrapbook/domain/scrapbook';
import { downloadScrapbook, loadScrapbook, preparePhoto, saveScrapbook } from '../../../contexts/scrapbook/adapters/browserScrapbook';

const PROMPTS = [
  ['why', 'Why did I choose this place?', 'I wanted to find out…'],
  ['history', 'Why is this place historically important?', 'Use a fact from a sign, museum, ranger, or reliable source. Explain it in your own words.'],
  ['learned', 'What did I learn?', 'One thing I understand now is…'],
  ['favorite', 'What was my favorite part?', 'A moment or detail I want to remember…'],
  ['recommend', 'Would I recommend it? Why?', 'I would / would not recommend this visit because…'],
] as const;

export function Scrapbook({ onClose }: { onClose: () => void }) {
  const [initial] = useState(loadScrapbook);
  const [book, setBook] = useState(initial.book);
  const currentBook = useRef(book);
  const [warning, setWarning] = useState(initial.warning);
  const [status, setStatus] = useState('');
  const [active, setActive] = useState(0);
  const [preview, setPreview] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const photoRequest = useRef(0);
  const [pendingImport, setPendingImport] = useState<Book | null>(null);
  const v = book.visits[active];
  const checks = projectChecklist(book);
  const completed = book.visits.filter(entry => Object.values(visitChecklist(entry)).every(Boolean)).length;

  function commit(next: Book) {
    currentBook.current = next; setBook(next);
    const saved = saveScrapbook(next);
    setWarning(saved ? '' : 'Your latest changes are here for this visit, but could not be saved in this browser. Download a backup before closing.');
    setStatus(saved ? 'Saved in this browser.' : '');
  }
  function updateVisit(patch: Partial<Visit>, index = active) {
    const current = currentBook.current;
    commit({ ...current, visits: current.visits.map((entry, i) => i === index ? { ...entry, ...patch } : entry) });
  }
  async function addPhoto(file: File | undefined) {
    if (!file) return;
    const index = active; const request = ++photoRequest.current; setPhotoBusy(true);
    try { const photo = await preparePhoto(file); if (request === photoRequest.current) updateVisit({ photo, studentInPhoto: false }, index); }
    catch (error) { setStatus(error instanceof Error ? error.message : 'Could not read that photo.'); }
    finally { setPhotoBusy(false); }
  }
  async function importBackup(file: File | undefined) {
    if (!file) return;
    if (file.size > 6_000_000) { setStatus('Choose a scrapbook backup smaller than 6 MB.'); return; }
    try { const restored = parseScrapbook(await file.text());
      if (restored) { setPendingImport(restored); setStatus('Backup ready to review. Your current scrapbook has not changed.'); }
      else setStatus('This file is not a compatible scrapbook backup. Your current scrapbook has not changed.');
    } catch { setStatus('Could not read this backup. Your current scrapbook has not changed.'); }
  }
  return <Modal label="My Virginia scrapbook" titleId="scrapbook-title" className="school-workspace scrapbook-workspace" onClose={onClose}>
    <div className="scrapbook-controls">
      <p className="briefing-kicker">Your fourth-grade project · September 2026–May 28, 2027</p>
      <h2 id="scrapbook-title">My Virginia scrapbook</h2>
      <p className="modal-lead">Five places. Five stories. A year of discoveries.</p>
      <p>Visit five different historical sites in Virginia; at most one may be in Washington, D.C. Include yourself in a photo at each site, explain its importance, and reflect on your visit.</p>
      <p className="school-note">Drafts and photos stay in this browser. They are not sent to a teacher or synced to another device. Download a backup to keep a separate copy. You can also use this planner for a paper scrapbook.</p>
      <div className="school-actions">
        <button type="button" className="secondary-action" onClick={() => setPreview(!preview)}><BookOpen aria-hidden="true" />{preview ? 'Keep writing' : 'Preview & present'}</button>
        <button type="button" className="secondary-action" onClick={() => { downloadScrapbook(book); setStatus('Backup downloaded. Keep it somewhere you can find again.'); }}><Download aria-hidden="true" />Download backup</button>
        <label className="school-file">Restore backup<input type="file" accept=".json,application/json" disabled={photoBusy} onChange={e => { void importBackup(e.target.files?.[0]); e.target.value = ''; }} /></label>
      </div>
      {warning ? <p className="school-warning" role="alert">{warning}</p> : null}
      <p className="school-status" role="status">{status}</p>
      {pendingImport ? <div className="school-warning"><strong>Restore this five-page scrapbook?</strong><p>{pendingImport.visits.map((entry, i) => entry.place || `Empty page ${i + 1}`).join(' · ')}</p><p>This replaces your current draft. Download your current backup first if you want to keep it.</p><div className="school-actions"><button type="button" onClick={() => { ++photoRequest.current; commit(pendingImport); setPendingImport(null); }}>Replace with this backup</button><button type="button" onClick={() => setPendingImport(null)}>Keep current draft</button></div></div> : null}
      <div className="scrapbook-progress"><strong>{completed} of 5 pages have their visit, photo, and writing checks</strong><progress value={completed} max={5} aria-label="Scrapbook pages with all checks" /></div>
    </div>
    {preview ? <div className="scrapbook-preview">
      <div className="scrapbook-controls school-actions"><button className="primary-action" type="button" onClick={() => window.print()}><Printer aria-hidden="true" />Print / Save as PDF</button><p>Read each page aloud. Practice a clear voice, looking up, and sharing your own impressions.</p></div>
      <h2 className="scrapbook-print-title">My Virginia scrapbook</h2>
      {book.visits.map((entry, i) => <article className="scrapbook-page" key={i}>
        <p className="briefing-kicker">Discovery {i + 1} · {entry.jurisdiction}{entry.date ? ` · ${entry.date}` : ''}</p>
        <h3>{entry.place || 'A place waiting to be explored'}</h3><p>{entry.region}</p>
        {entry.photo ? <figure><img src={entry.photo} alt={entry.caption || `Visit to ${entry.place || 'a historical site'}`} /><figcaption>{entry.caption}</figcaption></figure> : <p className="photo-placeholder">{entry.physicalPhoto ? 'Photo included in my paper scrapbook.' : 'Add a photo from your visit here.'}</p>}
        {PROMPTS.map(([key, label]) => <section key={key}><h4>{label}</h4><p>{entry[key] || 'My story is still in progress.'}</p></section>)}
      </article>)}
    </div> : <>
      <nav className="scrapbook-pages" aria-label="Scrapbook pages">{book.visits.map((entry, i) => <button type="button" key={i} aria-label={`Visit ${i + 1} ${entry.place || "Choose a place"}`} aria-pressed={active === i} onClick={() => { setActive(i); setStatus(''); }}><span>Visit {i + 1}</span><small>{entry.place || 'Choose a place'}</small></button>)}</nav>
      <div className="scrapbook-editor">
        <h3>Visit {active + 1}: {v.place || 'Start a new discovery'}</h3>
        <div className="school-form-grid">
          <label>Historical site<input maxLength={160} value={v.place} onChange={e => updateVisit({ place: e.target.value })} placeholder="Name of the place" /></label>
          <label>State or district<select value={v.jurisdiction} onChange={e => updateVisit({ jurisdiction: e.target.value as Visit['jurisdiction'] })}><option value="VA">Virginia</option><option value="DC">Washington, D.C.</option><option value="Other">Another state (does not count)</option></select></label>
          <label>Geographic region (optional)<select value={v.region} onChange={e => updateVisit({ region: e.target.value })}><option value="">Not sure yet / not in Virginia</option>{REGION_LESSONS.map(r => <option key={r.name}>{r.name}</option>)}</select></label>
          <label>Visit date (optional)<input type="date" value={v.date} onChange={e => updateVisit({ date: e.target.value })} /></label>
        </div>
        <label className="school-check"><input type="checkbox" checked={v.visited} onChange={e => updateVisit({ visited: e.target.checked })} />I have visited this place.</label>
        <details className="school-details"><summary>Need a place to explore?</summary><p>Ideas from your handout, especially around Northern Virginia. Choose a specific historical site and use its official page to plan with an adult.</p>{VISIT_IDEAS.map(idea => <div className="visit-idea" key={idea.name}><strong>{idea.name}</strong><p>{idea.clue}</p><a href={idea.url} target="_blank" rel="noreferrer">Official site ↗</a><button type="button" disabled={!!v.place.trim()} onClick={() => updateVisit({ place: idea.name, region: idea.region, jurisdiction: 'VA' })}>Use for this empty page</button></div>)}<p>Other ideas from your handout include a specific historic place along the Potomac. A natural area needs a story explaining its historical importance.</p><a href="https://www.nps.gov/kids/every-kid-outdoors.htm" target="_blank" rel="noreferrer">Explore the fourth-grade Every Kid Outdoors pass ↗</a><p>The pass covers eligible entrance or day-use fees at participating federal sites. Check official details with an adult.</p></details>
        <section className="scrapbook-photo"><h4>A picture tells part of the story</h4>
          <label className="school-file">{photoBusy ? 'Preparing photo…' : v.photo ? 'Replace photo' : 'Add a visit photo'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={photoBusy} onChange={e => { void addPhoto(e.target.files?.[0]); e.target.value = ''; }} /></label>
          {v.photo ? <><img src={v.photo} alt={v.caption || 'Your visit photo'} /><button type="button" onClick={() => updateVisit({ photo: '', studentInPhoto: false })}>Remove photo</button></> : null}
          <label>Photo caption<input maxLength={300} value={v.caption} onChange={e => updateVisit({ caption: e.target.value })} placeholder="What does your photo show?" /></label>
          <label className="school-check"><input type="checkbox" checked={v.physicalPhoto} onChange={e => updateVisit({ physicalPhoto: e.target.checked })} />I have a photo in my paper scrapbook.</label>
          <label className="school-check"><input type="checkbox" checked={v.studentInPhoto} onChange={e => updateVisit({ studentInPhoto: e.target.checked })} />I checked: I am in the photo at this site.</label>
        </section>
        {PROMPTS.map(([key, label, hint]) => <label className="scrapbook-prompt" key={key}>{label}<span>{hint}</span><textarea rows={3} maxLength={6000} value={v[key]} onChange={e => updateVisit({ [key]: e.target.value })} /></label>)}
      </div>
    </>}
    <section className="school-details scrapbook-controls"><h3>Ready-to-share checklist</h3><p>A planning guide based on your assignment and rubric. Completed fields are not a grade; reread for accuracy and detail.</p>
      <ul className="school-checklist"><li>{checks.locations ? '✓' : '○'} Five distinct visited sites, with at most one in D.C.</li><li>{checks.photos ? '✓' : '○'} A photo of me at each place (digital or in my paper scrapbook)</li><li>{checks.writing ? '✓' : '○'} Reasons, historical importance, and reflections for all five places</li></ul>
      <label className="school-check"><input type="checkbox" checked={book.organized} onChange={e => commit({ ...book, organized: e.target.checked })} />I reviewed the layout, captions, spelling, and organization.</label>
      <label className="school-check"><input type="checkbox" checked={book.rehearsed} onChange={e => commit({ ...book, rehearsed: e.target.checked })} />I practiced speaking clearly, loudly enough, and making eye contact.</label>
      <p>{Object.values(checks).every(Boolean) ? 'All planning checks are complete! Review your scrapbook with an adult before sharing.' : 'Keep building your stories, one visit at a time.'}</p>
    </section>
  </Modal>;
}
