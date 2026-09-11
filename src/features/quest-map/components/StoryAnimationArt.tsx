import type { ReactNode } from 'react';
import type { MissionId } from '../../../contexts/published-content/domain/mission';

type ArtProps = { scene: number; time: number };
const ink = '#183d4d', green = '#386b52', blue = '#277f9d', rust = '#a44f35', gold = '#d0a24b', cream = '#fff9e9';
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const tween = (time: number, from: number, to: number) => { const t = clamp((time - from) / (to - from)); return t * t * (3 - 2 * t); };
const stageOf = (time: number) => Math.min(2, Math.floor(time / 6));
function Label({ x, y, children, color = ink, small = false, anchor = 'middle' }: { x: number; y: number; children: ReactNode; color?: string; small?: boolean; anchor?: 'start' | 'middle' | 'end' }) {
  return <text x={x} y={y} textAnchor={anchor} fill={color} fontSize={small ? 19 : 23} fontWeight={small ? 500 : 700}>{children}</text>;
}
function Arrow({ x, y, toX, toY, color = green, opacity = 1 }: { x: number; y: number; toX: number; toY: number; color?: string; opacity?: number }) {
  const a = Math.atan2(toY - y, toX - x) * 180 / Math.PI;
  return <g opacity={opacity}><path d={`M${x} ${y}L${toX} ${toY}`} fill="none" stroke={color} strokeWidth="4" strokeDasharray="7 6" /><path transform={`translate(${toX} ${toY}) rotate(${a})`} d="M-12 -7L0 0 -12 7" fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round" /></g>;
}
function People({ x, y, count = 3, color = green }: { x: number; y: number; count?: number; color?: string }) {
  return <g transform={`translate(${x} ${y})`}>{Array.from({ length: count }, (_, i) => <g key={i} transform={`translate(${i * 26} 0)`}><circle cy="-23" r="8" fill={color} /><path d="M-9 5V-8Q0-20 9-8V5M-5 5V19M5 5V19" stroke={color} fill="none" strokeWidth="6" strokeLinecap="round" /></g>)}</g>;
}
function House({ x, y, w = 90, label, color = green }: { x: number; y: number; w?: number; label?: string; color?: string }) {
  return <g transform={`translate(${x} ${y})`}><path d={`M0 15L${w / 2} -17 ${w} 15Z`} fill={color} /><rect y="15" width={w} height="63" rx="3" fill={cream} stroke={color} strokeWidth="3" /><path d={`M${w * .42} 78V40H${w * .62}V78`} fill={color} /><rect x="12" y="31" width="15" height="18" fill="#aacbc7" />{label ? <Label x={w / 2} y={105} small>{label}</Label> : null}</g>;
}
function Paper({ x, y, title, color = green, w = 130 }: { x: number; y: number; title: string; color?: string; w?: number }) {
  return <g transform={`translate(${x} ${y})`}><rect width={w} height="119" rx="8" fill={cream} stroke={color} strokeWidth="3" /><Label x={w / 2} y={34} color={color}>{title}</Label>{[57, 73, 89].map((v, i) => <path key={v} d={`M20 ${v}H${w - 20 - i * 10}`} stroke={color} strokeWidth="3" opacity=".45" />)}</g>;
}
function Boat({ x, y, scale = 1, modern = false }: { x: number; y: number; scale?: number; modern?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${scale} ${Math.abs(scale)})`}><path d="M-49 0H55L36 22H-30Z" fill={ink} /><path d="M-40 8H44" stroke={gold} strokeWidth="3" />{modern ? <><rect x="-30" y="-26" width="32" height="26" fill={rust} /><rect x="5" y="-26" width="32" height="26" fill={gold} /><rect x="-46" y="-40" width="16" height="40" fill={cream} stroke={ink} strokeWidth="2" /></> : <><path d="M0 0V-85" stroke={rust} strokeWidth="4" /><path d="M-4-79L-39-16H-4ZM5-72L38-20H5Z" fill={cream} stroke="#b2a78c" strokeWidth="2" /><path d="M0-87L23-79 0-72" fill={rust} /></>}</g>;
}
function Barrel({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M-14-20Q-24 0-14 20H14Q24 0 14-20Z" fill="#b38651" stroke="#634a31" strokeWidth="2" /><path d="M-17-11H17M-18 11H18M-5-18V18M6-18V18" stroke="#634a31" strokeWidth="3" /></g>;
}
function Plant({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M0 5V-48" stroke={green} strokeWidth="4" /><path d="M0-12Q-30-12-28-35Q-6-38 0-12M0-30Q24-58 29-37Q23-17 0-30" fill="#6f9657" stroke={green} strokeWidth="2" /></g>;
}
function Train({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}><path d="M-52-12H18V-43H43V-4H-52Z" fill={rust} stroke={ink} strokeWidth="3" /><path d="M-35-13V-35H-24V-13M43-4L57 5H-56" fill={ink} stroke={ink} strokeWidth="4" /><rect x="23" y="-36" width="13" height="17" fill={cream} /><rect x="-123" y="-28" width="62" height="25" fill={gold} stroke={ink} strokeWidth="2" />{[-108, -75, -36, -10, 30].map(cx => <circle key={cx} cx={cx} cy="6" r="9" fill={ink} stroke={cream} strokeWidth="2" />)}</g>;
}
function Factory({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}><path d="M0 90V32L35 10V32L70 10V32H106V90Z" fill="#d4b592" stroke={ink} strokeWidth="3" /><path d="M82 32V-12H99V32" fill={rust} stroke={ink} strokeWidth="3" />{[12, 43, 74].map(cx => <rect key={cx} x={cx} y="46" width="19" height="24" fill={cream} stroke={ink} strokeWidth="2" />)}</g>;
}
function Ground() { return <><path d="M0 270Q130 210 290 260T640 245V360H0Z" fill="#dce5c8" /><path d="M0 301Q260 275 640 315" fill="none" stroke="#b9cda4" strokeWidth="2" /></>; }
function RouteDot({ points, fraction, color = blue }: { points: number[][]; fraction: number; color?: string }) {
  const pos = clamp(fraction) * (points.length - 1), i = Math.min(points.length - 2, Math.floor(pos)), f = pos - i;
  return <circle cx={points[i][0] + (points[i + 1][0] - points[i][0]) * f} cy={points[i][1] + (points[i + 1][1] - points[i][1]) * f} r="7" fill={color} stroke={cream} strokeWidth="2" />;
}

function Rivers({ scene, time }: ArtProps) {
  const phase = stageOf(time);
  if (scene === 0) return <>
    <path d="M0 310L112 101 202 219 285 154 388 279 640 315V360H0Z" fill="#b3c9b2" /><path d="M0 340L115 198 210 266 290 224 410 303 640 325V360H0Z" fill="#7eab8c" />
    <path d="M114 194L188 245 260 266 330 302 444 309 620 330M287 224L260 266" fill="none" stroke="#c1e7ed" strokeWidth="17" strokeLinecap="round" />
    <path d="M114 194L188 245 260 266 330 302 444 309 620 330" fill="none" stroke={blue} strokeWidth="8" strokeDasharray="14 15" strokeDashoffset={-time * 16} />
    <g fill={cream} stroke="#95b7bd" strokeWidth="2"><path d="M40 83Q31 59 56 57Q61 27 88 43Q119 24 134 57Q162 59 150 83Z" /></g>
    {[0, 1, 2, 3].map(i => <path key={i} d={`M${59 + i * 24} ${96 + ((time * 19 + i * 15) % 60)}l-5 11`} stroke={blue} strokeWidth="4" strokeLinecap="round" />)}
    {phase >= 1 ? <><RouteDot points={[[114, 194], [188, 245], [260, 266]]} fraction={(time % 3) / 3} /><RouteDot points={[[287, 224], [260, 266]]} fraction={(time % 3) / 3} /><Label x={362} y={200}>Streams join</Label><Arrow x={349} y={211} toX={276} toY={254} /></> : null}
    {phase === 2 ? <RouteDot points={[[260, 266], [330, 302], [444, 309], [620, 330]]} fraction={(time - 12) / 6} /> : null}
    <Label x={425} y={65}>Gravity pulls water downhill</Label><Label x={97} y={145} small>Higher ground</Label><Label x={510} y={284} small>Lower ground</Label>
  </>;
  if (scene === 1) { const boatX = 543 - 132 * tween(time, 0, 5); const cargo = tween(time, 12, 18); return <>
    <path d="M0 158H263L335 276H640V360H0Z" fill="#b5c7a0" /><path d="M0 165H248Q280 165 291 208L319 276H640" stroke="#9bcbd1" strokeWidth="38" fill="none" /><path d="M0 165H250L285 211 320 276H640" stroke={blue} strokeWidth="8" strokeDasharray="11 14" strokeDashoffset={-time * 17} fill="none" />
    <path d="M271 197L302 186 306 218 286 230M311 251L332 237 344 268 318 282" fill="#6a7d70" />
    <Boat x={boatX} y={259} scale={-.7} /><Label x={479} y={319} small>Boat travels upstream</Label><Label x={117} y={143}>Piedmont</Label><Label x={491} y={100}>Coastal Plain</Label><Label x={307} y={69}>Fall Line</Label><path d="M303 82V168" stroke={rust} strokeWidth="2" strokeDasharray="4 5" />
    {phase >= 1 ? <><path d="M385 221V275" stroke={rust} strokeWidth="6" /><Label x={464} y={175} color={rust}>Boat stops</Label></> : null}
    {phase === 2 ? <><House x={61} y={32} w={75} /><path d="M399 226Q380 117 173 138" stroke={rust} strokeWidth="3" strokeDasharray="6 6" fill="none" /><Barrel x={395 - 220 * cargo} y={227 - 100 * Math.sin(cargo * Math.PI / 2)} scale={.7} /><Label x={148} y={331}>Carry cargo around</Label></> : null}
  </>; }
  return <>
    <path d="M0 0H640V360H0Z" fill="#dceacb" /><path d="M0 260Q155 210 245 268T400 230L431 0H640V360H398Q268 330 179 290T0 304Z" fill="#a5d3de" /><path d="M447 0Q420 143 454 360" stroke={blue} strokeWidth="2" strokeDasharray="6 6" fill="none" />
    <House x={44} y={110} label="River town" /><Label x={305} y={100}>Chesapeake</Label><Label x={305} y={128}>Bay</Label><Label x={546} y={73}>Atlantic</Label><Label x={546} y={102}>Ocean</Label><Label x={208} y={333} small>Navigable river</Label>
    <path d="M107 260Q222 239 310 278T554 240" stroke={blue} strokeWidth="3" strokeDasharray="8 8" fill="none" /><Boat x={100 + 445 * tween(time, 1, 17)} y={252 + 16 * Math.sin(time / 18 * Math.PI)} scale={.65} />
  </>;
}
function Indigenous({ scene, time }: ArtProps) {
  const phase = stageOf(time);
  if (scene === 1) return <>
    <path d="M0 122H640V202H0Z" fill="#c8d7ac" /><path d="M0 202H640V267H0Z" fill="#cfb18b" /><path d="M0 267H640V360H0Z" fill="#ad8969" /><Plant x={80} y={121} /><Plant x={572} y={121} />
    <path d="M256 207L324 195 352 237 291 247Z" fill="#b76242" stroke="#70452f" strokeWidth="3" /><path d="M273 214L317 212 329 229" fill="none" stroke={cream} strokeWidth="3" />
    <Label x={310} y={67}>Leave the fragment in place</Label>
    {phase >= 1 ? <><circle cx="306" cy="222" r={56 + 4 * Math.sin(time)} stroke={ink} strokeWidth="3" strokeDasharray="5 5" fill="none" /><path d="M246 209L154 174M340 252L439 290" stroke={ink} strokeWidth="2" /><Label x={112} y={164} small>Soil layer</Label><Label x={489} y={310} small>Nearby evidence</Label><ellipse cx="451" cy="267" rx="19" ry="9" fill="#6b6962" /></> : null}
    {phase === 2 ? <><Paper x={447} y={38} title="Record" w={130} /><Arrow x={361} y={205} toX={467} toY={151} /></> : null}
  </>;
  const cards = scene === 0 ? ['Community', 'Educators', 'Museum'] : ['Oral history', 'Objects', 'Records'];
  return <><Ground /><People x={276} y={177} count={4} /><Label x={317} y={233}>{scene === 0 ? 'Living tribal nations' : 'A fuller explanation'}</Label>
    {cards.map((name, i) => { const x = [104, 321, 535][i], y = i === 1 ? 55 : 112; return <g key={name} opacity={phase >= i ? 1 : .33}><rect x={x - 82} y={y - 31} width="164" height="57" rx="16" fill={cream} stroke={green} strokeWidth="2" /><Label x={x} y={y + 6} small>{name}</Label><Arrow x={x} y={y + 33} toX={300 + i * 17} toY={147} opacity={phase >= i ? 1 : .3} /></g>; })}
    <path d="M120 289H522" stroke={green} strokeWidth="3" strokeDasharray="5 8" strokeDashoffset={-time * 8} /><Label x={320} y={329} small>{scene === 0 ? 'Past and present • distinct communities' : 'Compare who, when, where, and why'}</Label>
  </>;
}
function Jamestown({ scene, time }: ArtProps) {
  const phase = stageOf(time);
  if (scene === 2) return <><Ground /><House x={240} y={53} w={157} /><Label x={321} y={43}>Assembly · 1619</Label><People x={78} y={176} count={3} /><Arrow x={160} y={159} toX={247} toY={143} opacity={phase >= 1 ? 1 : .25} /><People x={284} y={192} count={3} color={ink} /><Label x={117} y={241} small>Some colonists</Label><Label x={333} y={241} small>Representatives</Label>{phase === 2 ? <><path d="M55 279H585" stroke={rust} strokeWidth="3" /><Label x={320} y={312} color={rust} small>Many people excluded from representation</Label></> : null}</>;
  return <>
    <path d="M0 0H640V196Q479 223 281 184T0 214Z" fill="#c5d6ac" /><path d="M0 211Q190 171 300 198T640 216V360H0Z" fill="#a7d1d8" />
    <path d="M81 166L153 63 243 166Z" fill="#e5d6ae" stroke="#85613b" strokeWidth="8" strokeLinejoin="round" />{[120, 158, 197].map(x => <House key={x} x={x - 14} y={126} w={29} />)}
    <Label x={397} y={43}>Powhatan homeland</Label><Label x={146} y={204} small>Jamestown</Label><Label x={381} y={330}>James River</Label>
    {scene === 0 ? <><Boat x={555 - 220 * tween(time, 0, 11)} y={278} scale={-.8} /><Arrow x={565} y={305} toX={315} toY={305} color={blue} />{phase === 2 ? <><rect x="347" y="93" width="265" height="97" rx="12" fill={cream} stroke={rust} strokeWidth="2" /><Label x={480} y={130} color={green} small>Deep water: ships can reach</Label><Label x={480} y={162} color={rust} small>Drinking water: unsafe</Label></> : null}</> : <>
      <Boat x={551} y={278} scale={-.6} /><path d="M480 255L269 212" stroke={phase ? rust : blue} strokeWidth="4" strokeDasharray="8 8" /><Barrel x={360 - 70 * tween(time, 0, 5)} y={231} scale={.7} />
      {phase >= 1 ? <><path d="M389 211L414 238M414 211L389 238" stroke={rust} strokeWidth="5" /><Label x={472} y={190} color={rust} small>Supplies delayed</Label></> : null}
      <Label x={430} y={84}>1609–1610</Label>{phase === 2 ? <><Label x={420} y={119} color={rust}>Food • disease • conflict</Label><Label x={420} y={148} small>Several causes combine</Label></> : null}
    </>}
  </>;
}
function Tobacco({ scene, time }: ArtProps) {
  const phase = stageOf(time);
  if (scene === 0) return <><Ground /><path d="M26 244H352M40 271H371M50 300H382" stroke="#b39469" strokeWidth="6" />{[97, 169, 241].map((x, i) => <Plant key={x} x={x} y={244 + i * 12} scale={.6 + .5 * tween(time, 0, 5)} />)}<People x={46 + 210 * tween(time, 6, 11)} y={223} count={1} /><House x={450} y={154} w={132} label="Drying barn" />{phase === 2 ? <>{[480, 508, 536].map(x => <path key={x} d={`M${x} 190q-17 14 0 31q17-17 0-31`} fill={gold} />)}<Arrow x={306} y={210} toX={428} toY={210} /></> : null}<Label x={319} y={53}>Plant → tend → harvest → dry</Label><Label x={314} y={332} small>Every stage requires people’s work</Label></>;
  if (scene === 1) return <><Ground /><path d="M0 294H640V360H0Z" fill="#9fced5" /><House x={47} y={144} label="Storage" /><path d="M352 237H550V247H352Z" fill="#886a47" /><path d="M370 247V307M530 247V307" stroke="#886a47" strokeWidth="10" /><Boat x={547} y={291} scale={.7} /><Barrel x={155 + 361 * tween(time, 1, 17)} y={phase < 2 ? 227 : 227 + 38 * tween(time, 12, 17)} /><Label x={327} y={75}>A hogshead connects many workers</Label><Label x={306} y={124} small>Pack the crop • carry it • load the ship</Label></>;
  return <><Ground /><path d="M181 178Q320 135 459 178V283H181Z" fill="#acd4dc" /><House x={36} y={150} label="Virginia" /><House x={506} y={150} label="Buyers" /><Boat x={196 + 241 * tween(time, 0, 6)} y={241} scale={.55} /><Label x={320} y={130}>Atlantic trade</Label>{phase >= 1 ? <><Arrow x={491} y={82} toX={154} toY={82} color={gold} /><circle cx={487 - 326 * tween(time, 6, 12)} cy="82" r="12" fill={gold} /><Label x={320} y={59} small>Payment to owners</Label></> : null}{phase === 2 ? <><path d="M37 291H602" stroke={rust} strokeWidth="3" /><Label x={320} y={330} small color={rust}>Enslaved workers denied freedom and control</Label></> : null}</>;
}
function Revolution({ scene, time }: ArtProps) {
  const phase = stageOf(time);
  if (scene === 1) return <>
    <path d="M0 0H451Q401 146 459 231L489 360H0Z" fill="#cbd7ac" /><path d="M451 0H640V360H489L459 231Q401 146 451 0Z" fill="#abd6df" />
    <House x={280} y={151} w={100} color={rust} /><Label x={330} y={279}>British forces</Label><Label x={330} y={131}>Yorktown</Label>
    <path d="M314 77Q128 77 145 246Q164 301 264 315" fill="none" stroke={blue} strokeWidth="7" strokeDasharray="11 7" strokeDashoffset={-time * 3} opacity={.4 + .6 * tween(time, 0, 5)} /><Label x={115} y={54} small>American + French</Label><Label x={115} y={80} small>armies on land</Label>
    {[0, 1, 2].map(i => <g key={i} opacity={.25 + .75 * tween(time, 0, 5)}><circle cx={183 - i * 12} cy={128 + i * 52} r="12" fill={blue} /><Arrow x={211} y={132 + i * 48} toX={267} toY={163 + i * 24} color={blue} /></g>)}
    <Label x={550} y={57} small>Lower</Label><Label x={550} y={83} small>Chesapeake</Label><Label x={550} y={109} small>Bay</Label>
    {phase >= 1 ? <><Boat x={528} y={191 + 48 * (1 - tween(time, 6, 10))} scale={.57} /><Boat x={576} y={270 + 35 * (1 - tween(time, 6, 10))} scale={.57} /><path d="M481 302L612 302" stroke={blue} strokeWidth="6" /><Label x={546} y={340} small>French fleet</Label></> : null}
    {phase === 2 ? <><path d="M398 210V140h30v25h-30" fill={cream} stroke={ink} strokeWidth="2" /><Label x={182} y={345} color={rust} small>1781: surrender</Label></> : null}
  </>;
  return <><Ground /><Paper x={52} y={103} title={scene === 0 ? '1776' : '1781'} /><Paper x={458} y={103} title={scene === 0 ? 'A new claim' : '1783'} w={147} /><Arrow x={205} y={163} toX={433} toY={163} color={rust} /><RouteDot points={[[213, 163], [433, 163]]} fraction={tween(time, 1, 16)} color={rust} /><Label x={119} y={266} small>{scene === 0 ? 'Declaration' : 'Yorktown'}</Label><Label x={531} y={266} small>{scene === 0 ? 'Independence' : 'Treaty of Paris'}</Label><Label x={321} y={55}>{scene === 0 ? 'An announcement is not an agreement' : 'Victory → negotiation → peace'}</Label>{phase >= 1 ? <Label x={320} y={205} small>{scene === 0 ? 'The war continues' : 'Peace talks take time'}</Label> : null}{phase === 2 ? <Label x={321} y={331} color={rust} small>{scene === 0 ? 'Ideals of liberty ≠ equal rights for everyone' : '1783: independence formally recognized'}</Label> : null}</>;
}
function Government({ scene, time }: ArtProps) {
  const phase = stageOf(time);
  if (scene === 2) return <><Paper x={38} y={108} title="Constitution" w={166} /><Arrow x={220} y={169} toX={270} toY={169} /><Label x={417} y={63}>Bill of Rights · 1791</Label>{Array.from({ length: 10 }, (_, i) => <g key={i} opacity={phase === 0 ? .25 : clamp((time - 6) / 5 * 10 - i)}><rect x={282 + i % 5 * 63} y={100 + Math.floor(i / 5) * 76} width="51" height="60" rx="6" fill={cream} stroke={green} strokeWidth="2" /><Label x={307 + i % 5 * 63} y={138 + Math.floor(i / 5) * 76}>{i + 1}</Label></g>)}{phase === 2 ? <><Label x={320} y={295}>Speech • religion • legal protections</Label><Label x={320} y={329} small>Rights also need interpretation and enforcement</Label></> : null}</>;
  return <><Ground /><Label x={320} y={55}>{scene === 0 ? 'Different powers. Shared limits.' : 'A plan needs people to carry it out.'}</Label>{['Congress', 'President', 'Courts'].map((name, i) => <g key={name} opacity={scene === 0 && phase < i ? .3 : 1}><House x={49 + i * 216} y={119} w={106} label={name} color={i === phase ? rust : green} /><Label x={102 + i * 216} y={267} small>{['Make laws', 'Carry out laws', 'Interpret laws'][i]}</Label>{i < 2 ? <Arrow x={170 + i * 216} y={167} toX={242 + i * 216} toY={167} opacity={phase >= i ? 1 : .2} /> : null}</g>)}{scene === 1 ? <><Label x={320} y={99} small>{phase === 0 ? '1787: the Constitution' : phase === 1 ? '1789: Washington becomes president' : 'Early decisions set precedents'}</Label><People x={286} y={308} count={3} /></> : null}</>;
}
function CivilWar({ scene, time }: ArtProps) {
  const phase = stageOf(time);
  if (scene === 1) return <>
    <path d="M0 0H640V360H0Z" fill="#d4dfbc" /><path d="M268 0Q352 90 291 178T323 360H396Q329 262 369 182T340 0Z" fill="#98c9d4" /><path d="M297 0Q375 99 321 185T353 360" fill="none" stroke={blue} strokeWidth="5" strokeDasharray="9 13" strokeDashoffset={-time * 12} />
    <path d="M108 131H537" stroke="#786452" strokeWidth="9" /><path d="M211 131V252M275 131V221M399 131V259M464 131V248" stroke="#917960" strokeWidth="12" /><Label x={321} y={85}>High railroad bridge</Label>
    <path d="M143 286H522" stroke={phase >= 1 ? '#917960' : '#b6a996'} strokeWidth="12" /><path d="M237 286V328M402 286V335" stroke="#917960" strokeWidth="9" /><Label x={487} y={251} small>Wagon bridge</Label><Label x={105} y={45} small>April 7, 1865</Label>
    {phase >= 1 ? <><path d="M231 280L244 294 268 264" stroke={green} strokeWidth="6" fill="none" /><Label x={468} y={320} small>Crossing preserved</Label></> : null}
    <g transform={`translate(${145 + 344 * tween(time, 12, 18)} 263)`}><circle r="15" fill={ink} /><text y="6" textAnchor="middle" fill={cream} fontSize="18" fontWeight="700">U</text></g><Label x={116} y={224} small>Union pursuit</Label><Label x={305} y={351} small>Appomattox River</Label>
  </>;
  if (scene === 0) return <><Ground /><Paper x={43} y={101} title="Secession" w={170} /><Label x={124} y={254} color={rust} small>Protecting slavery</Label><Arrow x={231} y={161} toX={431} toY={161} /><Label x={326} y={138} small>Four years of war</Label><House x={461} y={131} w={121} label="Sailor’s Creek" color={rust} /><Label x={521} y={94} small>April 6, 1865</Label>{phase >= 1 ? <RouteDot points={[[231, 161], [431, 161]]} fraction={tween(time, 6, 15)} color={rust} /> : null}{phase === 2 ? <Label x={320} y={328}>Major losses during Lee’s retreat</Label> : null}</>;
  return <><Ground /><Paper x={40} y={115} title="Surrender" w={172} /><Paper x={425} y={115} title="13th" w={164} /><Label x={126} y={90} small>April 9, 1865</Label><Label x={507} y={90} small>December 1865</Label><Arrow x={229} y={173} toX={406} toY={173} /><Label x={125} y={274} small>Lee’s army</Label><Label x={507} y={274} small>Constitution changes</Label>{phase >= 1 ? <Label x={320} y={54} small>Other Confederate armies surrender later</Label> : null}{phase === 2 ? <><Label x={320} y={316} color={rust}>Two different kinds of change</Label><Label x={320} y={344} small>Equal rights remain unfinished work</Label></> : null}</>;
}
function Reconstruction({ scene, time }: ArtProps) {
  const phase = stageOf(time), names = ['13th · 1865', '14th · 1868', '15th · 1870'];
  return <><Ground /><Paper x={38} y={94} title={names[scene]} w={179} /><Arrow x={234} y={155} toX={330} toY={155} color={phase === 1 && scene === 2 ? rust : green} />
    {scene === 0 ? <><People x={360} y={171} count={3} /><House x={494} y={116} w={100} label="School" /><Label x={416} y={258}>Family • work • education</Label></> : scene === 1 ? <><House x={375} y={113} w={134} label="Community life" /><path d="M341 117Q455 41 565 117V220Q453 288 341 220Z" fill="none" stroke={blue} strokeWidth="4" strokeDasharray={phase === 2 ? '7 7' : undefined} /><Label x={453} y={73} small>Equal protection</Label></> : <><rect x="427" y="156" width="117" height="84" rx="7" fill={cream} stroke={ink} strokeWidth="3" /><path d="M452 171H519" stroke={ink} strokeWidth="4" /><rect x="468" y={109 + 43 * tween(time, 0, 5)} width="34" height="35" rx="3" fill={gold} stroke={ink} strokeWidth="2" /><Label x={485} y={282}>Voting rights</Label>{phase >= 1 ? <><path d="M367 100V251" stroke={rust} strokeWidth="7" /><Label x={354} y={85} color={rust} small>Barriers</Label></> : null}{phase === 2 ? <People x={261} y={236} count={3} color={green} /> : null}</>}
    <Label x={320} y={329} color={phase === 2 ? rust : ink} small>{scene === 0 ? 'Freedom includes choices in everyday life' : scene === 1 ? 'Compare the law with people’s experiences' : 'Written protection does not remove every barrier'}</Label>
  </>;
}
function Railroad({ scene, time }: ArtProps) {
  const phase = stageOf(time);
  return <>
    <path d="M0 241L65 97 152 218 206 158 301 268H640V360H0Z" fill="#bed0b0" /><path d="M298 246L361 247 409 360H281Z" fill="#9dccd7" /><path d="M319 268L371 360" stroke={blue} strokeWidth="5" strokeDasharray="7 10" strokeDashoffset={-time * 9} />
    <path d="M31 264H607M31 274H607" stroke={ink} strokeWidth="3" />{Array.from({ length: 33 }, (_, i) => <path key={i} d={`M${34 + i * 17} 259V280`} stroke="#866e52" strokeWidth="3" />)}
    <path d="M272 280L303 315 336 280 369 315 401 280M273 280H401M303 280V331M370 280V342" stroke="#846749" strokeWidth="6" fill="none" />
    {scene !== 2 ? <><Plant x={47} y={226} scale={1.2} /><path d="M105 238L124 219 147 238Z" fill="#475956" /><Label x={117} y={66}>Resources</Label></> : <House x={38} y={110} label="Workers" />}
    <Factory x={482} y={141} /><Label x={538} y={116}>Market</Label>
    {scene === 0 ? <><People x={165} y={231} count={2} /><Barrel x={190 + 41 * tween(time, 12, 18)} y={253} scale={.6} /><Label x={337} y={112} small>{phase === 0 ? 'Coal and timber' : phase === 1 ? 'Work, skills, tools' : 'Prepare for transport'}</Label></> : <Train x={151 + 348 * tween(time, 0, 17)} y={253} />}
    {scene === 1 ? <><Label x={321} y={184} small>River crossing</Label><path d="M321 194V246" stroke={ink} strokeWidth="2" /></> : null}
    <Label x={321} y={346} small>{scene === 2 ? (phase === 2 ? 'Ask about jobs, pay, hours, and safety' : 'Delivery connects factories and buyers') : 'A connected route carries heavy goods'}</Label>
  </>;
}
function SupplyChain({ scene, time }: ArtProps) {
  const phase = stageOf(time);
  if (scene === 2) return <><Ground /><People x={53} y={192} /><Label x={88} y={260} small>Home front</Label><People x={512} y={192} color={ink} /><Label x={545} y={260} small>In service</Label><Arrow x={157} y={149} toX={478} toY={149} /><Arrow x={477} y={229} toX={157} toY={229} color={blue} /><rect x={162 + 287 * tween(time, 0, 6)} y="134" width="29" height="28" fill={gold} stroke={ink} strokeWidth="2" />{phase >= 1 ? <g transform={`translate(${456 - 276 * tween(time, 6, 12)} 229)`}><rect x="-21" y="-14" width="42" height="28" fill={cream} stroke={blue} strokeWidth="2" /><path d="M-21-14L0 4 21-14" stroke={blue} fill="none" strokeWidth="2" /></g> : null}<Label x={320} y={92}>Supplies →</Label><Label x={320} y={278}>← Letters</Label>{phase === 2 ? <Label x={320} y={335} small>Different sources show different experiences</Label> : null}</>;
  return <><Ground /><Factory x={38} y={130} /><Label x={93} y={110}>Make</Label><House x={266} y={142} w={94} label="Pack" /><path d="M435 273H640V360H435Z" fill="#a9d1da" /><Boat x={549} y={273} scale={.8} modern /><Label x={549} y={163}>Transport</Label><Arrow x={159} y={214} toX={245} toY={214} /><Arrow x={375} y={214} toX={474} toY={249} />
    {[0, 1, 2].map(i => <rect key={i} x={89 + 453 * tween(time - i * .7, 0, 17)} y={218 + 18 * tween(time, 12, 17) - i * 6} width="24" height="23" rx="2" fill={i % 2 ? rust : gold} stroke={ink} strokeWidth="2" />)}
    <Label x={320} y={57}>{scene === 0 ? 'Make • conserve • prepare' : 'A delivery needs every link'}</Label>{scene === 0 && phase >= 1 ? <Label x={302} y={104} small>Use materials carefully</Label> : null}<Label x={310} y={336} small>Workers connect home with people far away</Label>
  </>;
}
function CivilRights({ scene, time }: ArtProps) {
  const phase = stageOf(time);
  if (scene === 2) { const year = 1959 + Math.floor(tween(time, 0, 17) * 5); return <><Ground /><House x={248} y={139} w={145} /><Label x={320} y={71}>Prince Edward County</Label><Label x={320} y={112}>{phase === 2 ? '1964' : year}</Label>{phase < 2 ? <><path d="M302 180L342 221M342 180L302 221" stroke={rust} strokeWidth="6" /><Label x={320} y={262} color={rust}>Public schools closed</Label></> : <Label x={320} y={262} color={green}>Public schools reopen</Label>}<People x={77} y={225} count={4} /><path d="M56 304H583" stroke={rust} strokeWidth="3" />{[1959, 1960, 1961, 1962, 1963, 1964].map((n, i) => <g key={n}><circle cx={64 + i * 103} cy="304" r="7" fill={n === (phase === 2 ? 1964 : year) ? rust : '#c1bca7'} /><Label x={64 + i * 103} y={336} small>{n}</Label></g>)}</>; }
  return <><Ground /><House x={34} y={122} w={139} label="Moton High School" /><House x={461} y={108} w={144} label="Supreme Court" color={ink} /><People x={59 + 173 * tween(time, 0, 10)} y={228} count={4} /><path d="M204 132Q330 71 434 145" stroke={green} strokeWidth="4" strokeDasharray="6 7" fill="none" /><RouteDot points={[[204, 132], [320, 106], [434, 145]]} fraction={tween(time, 6, 17)} color={green} /><Label x={320} y={50}>{scene === 0 ? '1951: students organize' : '1954: Brown v. Board of Education'}</Label>{phase >= 1 ? <Paper x={263} y={148} title={scene === 0 ? 'Lawsuit' : 'Ruling'} w={130} /> : null}<Label x={320} y={325} small>{phase === 2 ? (scene === 0 ? 'Students + families + lawyers + communities' : 'Segregation in public schools is unconstitutional') : 'A local action connects to a national case'}</Label></>;
}
function Presidents({ scene, time }: ArtProps) {
  const phase = stageOf(time);
  if (scene === 0) { const names = ['Washington', 'Jefferson', 'Madison', 'Monroe', 'W. H. Harrison', 'Tyler', 'Taylor', 'Wilson']; return <><Label x={320} y={52}>Born in Virginia</Label>{names.map((name, i) => <g key={name} opacity={phase === 0 && i > 0 ? .3 : 1}><rect x={24 + i % 4 * 154} y={84 + Math.floor(i / 4) * 94} width="138" height="78" rx="10" fill={cream} stroke={green} strokeWidth="2" /><Label x={93 + i % 4 * 154} y={114 + Math.floor(i / 4) * 94}>{i + 1}</Label><Label x={93 + i % 4 * 154} y={144 + Math.floor(i / 4) * 94} small>{name}</Label></g>)}<Label x={320} y={310} small>{phase === 2 ? 'Birthplace is only one part of a biography.' : 'Eight people, eight life stories.'}</Label></>; }
  if (scene === 1) return <><Ground /><Label x={320} y={65}>Four presidencies in order</Label><path d="M83 158H554" stroke={green} strokeWidth="4" />{['Washington', 'Adams', 'Jefferson', 'Madison'].map((name, i) => <g key={name}><circle cx={84 + i * 157} cy="158" r="21" fill={i === 1 ? rust : green} /><Label x={84 + i * 157} y={166} color={cream}>{i + 1}</Label><Label x={84 + i * 157} y={212} small>{name}</Label><Label x={84 + i * 157} y={247}>{[1789, 1797, 1801, 1809][i]}</Label></g>)}<RouteDot points={[[84, 158], [241, 158], [398, 158], [555, 158]]} fraction={tween(time, 0, 17)} color={gold} /><Label x={320} y={323} small>John Adams was born in Massachusetts.</Label></>;
  return <><Ground /><Paper x={44} y={98} title="Decisions" w={149} /><People x={461} y={161} count={4} /><Label x={500} y={227} small>Affected people</Label><Arrow x={210} y={159} toX={420} toY={159} />{phase >= 1 ? <Arrow x={420} y={249} toX={210} toY={249} color={blue} /> : null}<Label x={320} y={53}>Read more than a portrait</Label><Label x={320} y={317} small>{phase === 2 ? 'Achievements, harms, contradictions: use evidence.' : 'Compare a decision with people’s experiences.'}</Label></>;
}
function Trade({ scene, time }: ArtProps) {
  const phase = stageOf(time);
  if (scene === 2) return <><path d="M0 205Q320 168 640 214V360H0Z" fill="#b0d7de" /><House x={35} y={114} w={122} label="United States" /><House x={484} y={114} w={122} label="Buyer’s country" /><Arrow x={185} y={108} toX={449} toY={108} color={blue} /><Boat x={195 + 250 * tween(time, 0, 12)} y={274} scale={.65} modern /><Label x={105} y={69} color={green}>EXPORT</Label><Label x={546} y={69} color={rust}>IMPORT</Label>{phase === 2 ? <><rect x="183" y="168" width="269" height="59" rx="9" fill={cream} stroke={ink} strokeWidth="2" /><Label x={319} y={204} small>Dates • sources • definitions</Label></> : null}<Label x={320} y={334}>The same shipment, two viewpoints</Label></>;
  if (scene === 0) return <><Ground />{[73, 126, 182].map(x => <Plant key={x} x={x} y={228} scale={.6 + .5 * tween(time, 0, 6)} />)}<People x={63} y={275} count={2} /><House x={401} y={128} w={140} label="Prepare an order" /><Arrow x={224} y={205} toX={382} toY={205} /><Barrel x={223 + 155 * tween(time, 6, 17)} y={201} scale={.7} /><Label x={320} y={57}>People + land + weather + equipment</Label><Label x={320} y={329} small>{phase === 2 ? 'Sold to another country = export' : 'A global connection can begin nearby'}</Label></>;
  // Three separate legs show a real transfer: land → crane → ship.
  const truckX = 73 + 137 * tween(time, 0, 5), lift = tween(time, 6, 8), across = tween(time, 8, 10), lower = tween(time, 10, 12), sail = 55 * tween(time, 12, 18);
  const cargoX = phase === 0 ? truckX - 10 : phase === 1 ? 200 + across * 274 : 474 + sail;
  const cargoY = phase === 0 ? 207 : phase === 1 ? 207 - lift * 93 + lower * 95 : 209;
  return <><path d="M0 255H328V360H0Z" fill="#ced2b3" /><path d="M328 255H640V360H328Z" fill="#a7d1db" /><path d="M32 263H286" stroke={ink} strokeWidth="3" /><g transform={`translate(${truckX} 240)`}><path d="M-56-13H32V-34H59L79-12V4H-56Z" fill={rust} stroke={ink} strokeWidth="3" /><circle cx="-31" cy="7" r="10" fill={ink} /><circle cx="55" cy="7" r="10" fill={ink} /></g><path d="M289 253V79M170 79H554M284 95L473 79M291 254L340 79" stroke="#a2763f" strokeWidth="8" fill="none" /><path d={`M${200 + across * 274} 81V${cargoY - 17}`} stroke={ink} strokeWidth="3" /><Boat x={488 + sail} y={238} modern scale={1.08} /><rect x={cargoX - 29} y={cargoY - 23} width="58" height="31" rx="3" fill={gold} stroke={ink} strokeWidth="2" /><path d={`M${cargoX - 17} ${cargoY - 21}v27m14-27v27m14-27v27`} stroke={rust} strokeWidth="2" /><Label x={132} y={321}>Land route</Label><Label x={386} y={49}>Port transfer</Label><Label x={520} y={321}>Ocean route</Label></>;
}

const ART = { 'VS.1': Rivers, 'VS.2': Indigenous, 'VS.3': Jamestown, 'VS.4': Tobacco, 'VS.5': Revolution, 'VS.6': Government, 'VS.7': CivilWar, 'VS.8': Reconstruction, 'VS.9': Railroad, 'VS.10': SupplyChain, 'VS.11': CivilRights, 'VS.12': Presidents, 'VS.13': Trade } satisfies Record<MissionId, (props: ArtProps) => ReactNode>;
export function StoryAnimationArt({ missionId, scene, time }: ArtProps & { missionId: MissionId }) {
  const Drawing = ART[missionId];
  return <Drawing scene={scene} time={time} />;
}
