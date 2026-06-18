#!/usr/bin/env python3
"""
build_dashboard.py — generate a self-contained, offline interactive prototype.

Pure Python 3 standard library only. Idempotent.

Reads data/plans.json, data/stats.json and data/deep_analysis.json and writes a
single self-contained file:

    site/index.html

The page embeds the data inline (no network, no build step, no external JS/CSS)
and provides: full-text search, multi-filter (state, control, type, plan type,
document type, organizing structure, verification, deep-only), a sortable result
list with per-plan evidence quote + source/landing links and the deep-analysis
panel (benchmark score, missing components, essential functions, notable
decisions), live charts that react to the active filter, and one-click CSV/JSON
export of the current slice.
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")
OUT = os.path.join(ROOT, "site", "index.html")


def load(name, default):
    path = os.path.join(DATA, name)
    if not os.path.exists(path):
        return default
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


TEMPLATE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Campus COOP Archive — sourced catalog of higher-ed continuity plans</title>
<style>
  :root{
    --bg:#0f1216; --panel:#171c22; --panel2:#1e242c; --line:#2a323c;
    --ink:#e8edf2; --mut:#9aa7b4; --acc:#36c2a8; --acc2:#5b9dff;
    --warn:#e0a44a; --good:#36c2a8; --bad:#e06a6a; --chip:#222a33;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
    font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
  a{color:var(--acc2);text-decoration:none} a:hover{text-decoration:underline}
  header{padding:28px 22px 14px;border-bottom:1px solid var(--line);
    background:linear-gradient(180deg,#141a20,#0f1216)}
  .eyebrow{color:var(--acc);font-weight:700;letter-spacing:.08em;
    text-transform:uppercase;font-size:12px}
  h1{margin:6px 0 4px;font-size:26px}
  .tag{color:var(--mut);max-width:760px}
  .stats{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}
  .stat{background:var(--panel);border:1px solid var(--line);border-radius:10px;
    padding:10px 14px;min-width:108px}
  .stat b{display:block;font-size:22px;color:var(--acc)}
  .stat span{color:var(--mut);font-size:12px}
  .wrap{max-width:1180px;margin:0 auto;padding:18px 22px 80px}
  .controls{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));
    gap:10px;background:var(--panel);border:1px solid var(--line);
    border-radius:12px;padding:14px;margin:18px 0}
  .controls .full{grid-column:1/-1}
  input,select{width:100%;background:var(--panel2);color:var(--ink);
    border:1px solid var(--line);border-radius:8px;padding:9px 10px;font-size:14px}
  label{font-size:11px;color:var(--mut);text-transform:uppercase;
    letter-spacing:.05em;display:block;margin-bottom:4px}
  .row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
  .btn{background:var(--acc);color:#06231d;border:none;border-radius:8px;
    padding:9px 14px;font-weight:700;cursor:pointer;font-size:13px}
  .btn.alt{background:var(--panel2);color:var(--ink);border:1px solid var(--line)}
  .checkrow{display:flex;align-items:center;gap:8px}
  .checkrow input{width:auto}
  .count{color:var(--mut);margin:6px 2px 14px}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:8px 0 20px}
  @media(max-width:820px){.grid2{grid-template-columns:1fr}}
  .card{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px}
  .card h3{margin:0 0 10px;font-size:14px;color:var(--mut);
    text-transform:uppercase;letter-spacing:.05em}
  .bar{display:grid;grid-template-columns:140px 1fr 42px;gap:8px;
    align-items:center;margin:3px 0;font-size:13px}
  .bar .t{color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .bar .track{background:var(--panel2);border-radius:6px;height:14px;overflow:hidden}
  .bar .fill{height:100%;background:linear-gradient(90deg,var(--acc),var(--acc2))}
  .bar .n{text-align:right;color:var(--mut)}
  .plan{background:var(--panel);border:1px solid var(--line);border-radius:12px;
    padding:14px 16px;margin:10px 0}
  .plan .top{display:flex;justify-content:space-between;gap:12px;cursor:pointer}
  .plan .name{font-weight:700;font-size:16px}
  .meta{color:var(--mut);font-size:13px;margin-top:3px}
  .badges{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
  .b{font-size:11px;padding:3px 8px;border-radius:20px;background:var(--chip);
    border:1px solid var(--line);color:var(--ink);white-space:nowrap}
  .b.ok{color:var(--good);border-color:#21564b}
  .b.link{color:var(--warn);border-color:#5a4622}
  .b.score{color:#06231d;background:var(--acc);font-weight:700;border:none}
  .score.lo{background:var(--bad);color:#fff} .score.mid{background:var(--warn);color:#241a06}
  .detail{display:none;margin-top:12px;border-top:1px dashed var(--line);padding-top:12px}
  .detail.open{display:block}
  .quote{border-left:3px solid var(--acc);padding:6px 12px;color:#cfe;
    background:var(--panel2);border-radius:0 8px 8px 0;margin:8px 0;font-style:italic}
  .kv{display:grid;grid-template-columns:200px 1fr;gap:4px 12px;font-size:13px;margin:8px 0}
  .kv div:nth-child(odd){color:var(--mut)}
  .miss{color:var(--bad)} .pres{color:var(--good)}
  .ud{margin:6px 0;font-size:13px}
  .src{display:flex;gap:14px;margin-top:10px;flex-wrap:wrap}
  footer{color:var(--mut);font-size:12px;border-top:1px solid var(--line);
    padding:18px 22px;max-width:1180px;margin:0 auto}
  .pill{font-size:11px;color:var(--mut)}
  details.bm{margin:14px 0;background:var(--panel);border:1px solid var(--line);
    border-radius:12px;padding:10px 14px}
  details.bm summary{cursor:pointer;font-weight:700}
  .bmgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));
    gap:6px 18px;margin-top:10px;font-size:13px;color:var(--mut)}
</style>
</head>
<body>
<header>
  <div class="eyebrow">A Campus Alert Archive project</div>
  <h1>Campus COOP Archive</h1>
  <div class="tag">An open, fully sourced catalog of US college &amp; university
    <b>continuity</b> plans — COOP, business continuity, academic/instructional
    continuity, and IT disaster recovery. Every record links to its primary
    source and a verbatim evidence quote; a subset is read in full and scored
    against the 22-component continuity benchmark.</div>
  <div class="stats" id="stats"></div>
</header>
<div class="wrap">
  <div class="controls">
    <div class="full">
      <label>Search institution / plan / notes</label>
      <input id="q" placeholder="Type to search… e.g. Cornell, community college, RTO">
    </div>
    <div><label>State</label><select id="f_state"></select></div>
    <div><label>Control</label><select id="f_control"></select></div>
    <div><label>Institution type</label><select id="f_type"></select></div>
    <div><label>Plan type</label><select id="f_plan"></select></div>
    <div><label>Document type</label><select id="f_doc"></select></div>
    <div><label>Organizing structure</label><select id="f_org"></select></div>
    <div><label>Verification</label><select id="f_ver"></select></div>
    <div><label>Sort by</label><select id="f_sort"></select></div>
    <div class="full row">
      <span class="checkrow"><input type="checkbox" id="deeponly"><label style="margin:0">Deep-coded only</label></span>
      <span style="flex:1"></span>
      <button class="btn" onclick="exportData('csv')">Export CSV (filtered)</button>
      <button class="btn alt" onclick="exportData('json')">Export JSON (filtered)</button>
      <button class="btn alt" onclick="resetAll()">Reset</button>
    </div>
  </div>

  <div class="grid2">
    <div class="card"><h3>By state (filtered)</h3><div id="ch_state"></div></div>
    <div class="card"><h3>By institution type (filtered)</h3><div id="ch_type"></div></div>
    <div class="card"><h3>By document type (filtered)</h3><div id="ch_doc"></div></div>
    <div class="card"><h3>Benchmark band — deep-coded (filtered)</h3><div id="ch_band"></div></div>
  </div>

  <details class="bm">
    <summary>The 22-component continuity benchmark</summary>
    <div class="bmgrid" id="bmlist"></div>
  </details>

  <div class="count" id="count"></div>
  <div id="results"></div>
</div>
<footer>
  Source documents remain the work of their respective institutions and are
  linked, not redistributed. This is a research index and analysis layer over
  publicly available material. AI-assisted compilation. Generated offline by
  <code>build_dashboard.py</code>. Sister project to the Higher Ed EOP Atlas and
  the Campus Alert Archive.
</footer>

<script id="data" type="application/json">/*DATA_PLACEHOLDER*/</script>
<script>
const DB = JSON.parse(document.getElementById('data').textContent);
const PLANS = DB.plans, STATS = DB.stats, DEEP = DB.deep, BKEYS = DB.benchmark_keys;
const $ = id => document.getElementById(id);

function uniq(key){return [...new Set(PLANS.map(p=>p[key]).filter(Boolean))].sort();}
function opt(sel, vals, label){
  sel.innerHTML = '<option value="">All '+label+'</option>' +
    vals.map(v=>'<option>'+v+'</option>').join('');
}
opt($('f_state'), uniq('state'),'states');
opt($('f_control'), uniq('control'),'');
opt($('f_type'), uniq('institution_type'),'types');
opt($('f_plan'), uniq('plan_type'),'plan types');
opt($('f_doc'), uniq('document_type'),'doc types');
opt($('f_org'), uniq('organizing_structure'),'structures');
opt($('f_ver'), uniq('verification'),'');
$('f_sort').innerHTML = ['institution_name','state','recency_year (newest)','benchmark (high→low)','flags_present_count']
  .map(v=>'<option>'+v+'</option>').join('');

// header stats
const t = STATS.totals;
$('stats').innerHTML = [
  [t.plans,'plans'],[t.institutions,'institutions'],[t.states_covered,'states + DC'],
  [t.opened_and_confirmed,'opened &amp; confirmed'],[t.deep_coded,'deep-coded'],
  [(t.mean_benchmark==null?'—':t.mean_benchmark+'/22'),'mean benchmark']
].map(s=>'<div class="stat"><b>'+s[0]+'</b><span>'+s[1]+'</span></div>').join('');

// benchmark key list
$('bmlist').innerHTML = BKEYS.map((k,i)=>'<div>'+(i+1)+'. '+k+'</div>').join('');

function activeFilters(){
  return {q:$('q').value.trim().toLowerCase(), state:$('f_state').value,
    control:$('f_control').value, type:$('f_type').value, plan:$('f_plan').value,
    doc:$('f_doc').value, org:$('f_org').value, ver:$('f_ver').value,
    deep:$('deeponly').checked};
}
function match(p,f){
  if(f.state && p.state!==f.state) return false;
  if(f.control && p.control!==f.control) return false;
  if(f.type && p.institution_type!==f.type) return false;
  if(f.plan && p.plan_type!==f.plan) return false;
  if(f.doc && p.document_type!==f.doc) return false;
  if(f.org && p.organizing_structure!==f.org) return false;
  if(f.ver && p.verification!==f.ver) return false;
  if(f.deep && !p.has_deep) return false;
  if(f.q){
    const hay=(p.institution_name+' '+p.state+' '+p.plan_type+' '+p.document_type+' '+
      (p.catalog_notes||'')+' '+(p.framework_alignment||'')+' '+(p.evidence_quote||'')).toLowerCase();
    if(!hay.includes(f.q)) return false;
  }
  return true;
}
function sortPlans(arr){
  const s=$('f_sort').value;
  const c=[...arr];
  if(s.startsWith('institution')) c.sort((a,b)=>a.institution_name.localeCompare(b.institution_name));
  else if(s==='state') c.sort((a,b)=>a.state.localeCompare(b.state)||a.institution_name.localeCompare(b.institution_name));
  else if(s.startsWith('recency')) c.sort((a,b)=>(b.recency_year||0)-(a.recency_year||0));
  else if(s.startsWith('benchmark')) c.sort((a,b)=>(b.benchmark_present==null?-1:b.benchmark_present)-(a.benchmark_present==null?-1:a.benchmark_present));
  else if(s.startsWith('flags')) c.sort((a,b)=>b.flags_present_count-a.flags_present_count);
  return c;
}
function esc(s){return (s==null?'':String(s)).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}

function chart(el, counts, max){
  const m = max || Math.max(1,...Object.values(counts));
  el.innerHTML = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([k,v])=>
    '<div class="bar"><div class="t" title="'+esc(k)+'">'+esc(k)+'</div>'+
    '<div class="track"><div class="fill" style="width:'+(100*v/m)+'%"></div></div>'+
    '<div class="n">'+v+'</div></div>').join('') || '<div class="pill">none</div>';
}
function tally(arr,key){const o={};arr.forEach(p=>{const k=p[key]||'unknown';o[k]=(o[k]||0)+1});return o;}

function scoreClass(v){return v==null?'':(v<=9?'lo':(v<=15?'mid':''));}

function render(){
  const f=activeFilters();
  let res=sortPlans(PLANS.filter(p=>match(p,f)));
  $('count').innerHTML='<b>'+res.length+'</b> plans match · '+
    res.filter(p=>p.has_deep).length+' deep-coded in this slice';
  chart($('ch_state'),tally(res,'state'));
  chart($('ch_type'),tally(res,'institution_type'));
  chart($('ch_doc'),tally(res,'document_type'));
  const bands={};res.filter(p=>p.has_deep).forEach(p=>{bands[p.benchmark_band]=(bands[p.benchmark_band]||0)+1});
  chart($('ch_band'),bands);
  $('results').innerHTML=res.map(planHTML).join('');
}

function planHTML(p){
  const d=DEEP[p.plan_id];
  const verB=p.verification==='opened-and-confirmed'
    ?'<span class="b ok">✓ Confirmed</span>':'<span class="b link">link-only</span>';
  const scoreB=p.has_deep?'<span class="b score '+scoreClass(p.benchmark_present)+'">Benchmark '+p.benchmark_present+'/22</span>':'';
  let det='<div class="quote">“'+esc(p.evidence_quote)+'”</div>';
  det+='<div class="kv">'+
    kv('City',p.city)+kv('Control',p.control)+kv('System',p.system_affiliation)+
    kv('Plan type',p.plan_type)+kv('Document type',p.document_type)+
    kv('Organizing structure',p.organizing_structure)+kv('Framework',p.framework_alignment)+
    kv('Published / revised',p.published_revised)+kv('Catalog notes',p.catalog_notes)+'</div>';
  if(d){
    const miss=new Set(d.benchmark_missing||[]);
    det+='<div class="kv">'+kv('Benchmark',p.benchmark_present+'/22 ('+(d.read_confidence||'')+' confidence)')+
      kv('COOP treatment',d.coop_treatment)+kv('RTO tiers',d.rto_tiers)+
      kv('Succession depth',d.succession_depth)+kv('Alt-facility model',d.alternate_facility_model)+
      kv('TT&E cadence',d.tte_cadence)+'</div>';
    if((d.essential_functions||[]).length)
      det+='<div class="ud"><b>Essential functions:</b> '+esc(d.essential_functions.join('; '))+'</div>';
    det+='<div class="ud"><b>Missing components ('+miss.size+'):</b> <span class="miss">'+
      ([...miss].join(', ')||'none — full marks')+'</span></div>';
    (d.unusual_decisions||[]).forEach(u=>{
      det+='<div class="ud">▸ '+esc(u.decision)+'<div class="quote">“'+esc(u.quote)+'”</div></div>';});
    if(d.analyst_notes) det+='<div class="ud pill">'+esc(d.analyst_notes)+'</div>';
  }
  det+='<div class="src"><a href="'+esc(p.source_url)+'" target="_blank" rel="noopener">View source document ↗</a>'+
    '<a href="'+esc(p.landing_page_url)+'" target="_blank" rel="noopener">Official page ↗</a>'+
    '<span class="pill">Accessed '+esc(p.date_accessed)+'</span></div>';
  return '<div class="plan"><div class="top" onclick="this.parentNode.querySelector(\'.detail\').classList.toggle(\'open\')">'+
    '<div><div class="name">'+esc(p.institution_name)+'</div>'+
    '<div class="meta">'+esc(p.state)+' · '+esc(p.institution_type)+' · '+esc(p.plan_type)+
    (p.recency_year?' · '+p.recency_year:'')+'</div>'+
    '<div class="badges">'+verB+'<span class="b">'+esc(p.document_type)+'</span>'+
    '<span class="b">'+esc(p.file_format)+'</span>'+scoreB+'</div></div>'+
    '<div class="pill">▾</div></div><div class="detail">'+det+'</div></div>';
}
function kv(k,v){return v?('<div>'+esc(k)+'</div><div>'+esc(v)+'</div>'):'';}

function exportData(kind){
  const f=activeFilters();const res=sortPlans(PLANS.filter(p=>match(p,f)));
  let blob,name;
  if(kind==='json'){blob=new Blob([JSON.stringify(res,null,2)],{type:'application/json'});name='campus_coop_filtered.json';}
  else{
    const cols=['plan_id','institution_name','state','control','institution_type','plan_type',
      'document_type','organizing_structure','recency_year','verification','benchmark_present',
      'source_url','landing_page_url','evidence_quote'];
    const rows=[cols.join(',')].concat(res.map(p=>cols.map(c=>{
      let v=p[c]==null?'':String(p[c]);return '"'+v.replace(/"/g,'""')+'"';}).join(',')));
    blob=new Blob([rows.join('\n')],{type:'text/csv'});name='campus_coop_filtered.csv';
  }
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();
}
function resetAll(){['q','f_state','f_control','f_type','f_plan','f_doc','f_org','f_ver'].forEach(id=>$(id).value='');
  $('deeponly').checked=false;$('f_sort').value='institution_name';render();}

['q','f_state','f_control','f_type','f_plan','f_doc','f_org','f_ver','f_sort','deeponly']
  .forEach(id=>$(id).addEventListener('input',render));
render();
</script>
</body>
</html>
"""


def main():
    plans = load("plans.json", [])
    stats = load("stats.json", {})
    deep = load("deep_analysis.json", [])
    deep_by_id = {d["plan_id"]: d for d in deep}
    benchmark_keys = [
        "continuity_policy_promulgation", "concept_of_operations", "standards_alignment",
        "budgeting_resources", "plan_maintenance", "essential_functions",
        "business_impact_analysis", "recovery_time_objectives", "risk_threat_assessment",
        "interdependencies", "orders_of_succession", "delegations_of_authority",
        "continuity_facilities", "continuity_communications", "vital_records_management",
        "continuity_personnel", "activation_triggers", "devolution", "reconstitution",
        "it_disaster_recovery", "academic_instructional_continuity", "tests_training_exercises",
    ]
    blob = json.dumps({
        "plans": plans, "stats": stats, "deep": deep_by_id,
        "benchmark_keys": benchmark_keys,
    }, ensure_ascii=False)
    # guard against the closing script tag appearing inside the data
    blob = blob.replace("</script>", "<\\/script>")
    html = TEMPLATE.replace("/*DATA_PLACEHOLDER*/", blob)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as fh:
        fh.write(html)
    print("Wrote site/index.html (%d plans, %d deep, %.0f KB)"
          % (len(plans), len(deep), len(html) / 1024))


if __name__ == "__main__":
    main()
