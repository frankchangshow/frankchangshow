import * as THREE from "three";

type Role = "innocent" | "sheriff" | "murderer";

type Rect = { minX: number; maxX: number; minZ: number; maxZ: number };

type Actor = {
  id: number;
  name: string;
  isPlayer: boolean;
  role: Role;
  lives: number;
  x: number;
  z: number;
  yaw: number;
  down: boolean;
  shield: number;
  shieldCd: number;
  attackCd: number;
  ultCd: number;
  volley: number;
  volleyGap: number;
  windup: number;
  lunge: number;
  lungeX: number;
  lungeZ: number;
  lungeHit: Set<number>;
  suspect: number | null;
  flee: number;
  threatX: number;
  threatZ: number;
  wanderX: number;
  wanderZ: number;
  wanderWait: number;
  moving: boolean;
  walk: number;
  swing: number;
  flash: number;
  mesh: THREE.Group;
  arm: THREE.Group;
  legs: [THREE.Object3D, THREE.Object3D];
  cloth: THREE.MeshStandardMaterial;
  bubble: THREE.Mesh;
  label: THREE.Sprite;
};

const LIVES = 3;
const RADIUS = 0.42;
const WALK = 4.5;
const SPRINT = 7.5;
const SHIELD_TIME = 0.55;
const SHIELD_CD = 7.5;
const MELEE_CD = 0.72;
const GUN_CD = 0.52;
const MELEE_RANGE = 2.45;
const GUN_RANGE = 22;
const ULT_CD = 12;
const WORLD = 36.5;

const el = {
  hud: document.querySelector("#hud") as HTMLElement,
  overlay: document.querySelector("#overlay") as HTMLElement,
  play: document.querySelector("#play") as HTMLButtonElement,
  copy: document.querySelector("#overlay-copy") as HTMLElement,
  title: document.querySelector("#overlay h1") as HTMLElement,
  role: document.querySelector("#role") as HTMLElement,
  hint: document.querySelector("#hint") as HTMLElement,
  hearts: document.querySelector("#hearts") as HTMLElement,
  attack: document.querySelector("#attack") as HTMLElement,
  shield: document.querySelector("#shield") as HTMLElement,
  ultimate: document.querySelector("#ultimate") as HTMLElement,
  toast: document.querySelector("#toast") as HTMLElement,
  down: document.querySelector("#down-banner") as HTMLElement,
  minimap: document.querySelector("#minimap") as HTMLCanvasElement,
  canvas: document.querySelector("#view") as HTMLCanvasElement,
};

const hurt = document.createElement("div");
hurt.id = "hurt";
document.body.appendChild(hurt);

const keys = new Set<string>();
const pressed = new Set<string>();
let wantAttack = false;
let started = false;
let roundOver = false;
let grace = 2.2;
let toastTimer = 0;
let hurtTimer = 0;
let audioCtx: AudioContext | null = null;

const colliders: Rect[] = [];
const nav: { x: number; z: number }[] = [];

const renderer = new THREE.WebGLRenderer({ canvas: el.canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xb7c9da);
scene.fog = new THREE.Fog(0xc5d4e2, 26, 78);

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 200);
let pitch = 0.42;

const hemi = new THREE.HemisphereLight(0xd5e7f7, 0x6d8a49, 0.95);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffe0b0, 1.2);
sun.position.set(28, 36, 14);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
const shadow = sun.shadow.camera;
shadow.near = 2;
shadow.far = 90;
shadow.left = -40;
shadow.right = 40;
shadow.top = 40;
shadow.bottom = -40;
scene.add(sun);

const fx: { obj: THREE.Object3D; life: number; max: number }[] = [];

function stoneMat(color: number) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.92 });
}

const grass = stoneMat(0x6e8d4c);
const pathMat = stoneMat(0xc3b093);
const manorMat = stoneMat(0xd7d0c4);
const cottageMat = stoneMat(0xc4a27a);
const barnMat = stoneMat(0x8d5a3c);
const hedgeMat = stoneMat(0x3f6a3c);
const trunkMat = stoneMat(0x5a4030);
const leafMat = stoneMat(0x3d6a3a);
const waterMat = new THREE.MeshStandardMaterial({
  color: 0x7eafc0,
  roughness: 0.18,
  metalness: 0.05,
});

function addWall(x1: number, z1: number, x2: number, z2: number, h: number, mat: THREE.Material) {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minZ = Math.min(z1, z2);
  const maxZ = Math.max(z1, z2);
  colliders.push({ minX, maxX, minZ, maxZ });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.2, maxX - minX), h, Math.max(0.2, maxZ - minZ)), mat);
  mesh.position.set((minX + maxX) / 2, h / 2, (minZ + maxZ) / 2);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

function addFloor(x: number, z: number, w: number, d: number, color: number) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, d), stoneMat(color));
  mesh.position.set(x, 0.025, z);
  mesh.receiveShadow = true;
  scene.add(mesh);
}

function addTree(x: number, z: number, scale = 1) {
  colliders.push({ minX: x - 0.32, maxX: x + 0.32, minZ: z - 0.32, maxZ: z + 0.32 });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16 * scale, 0.24 * scale, 1.35 * scale, 6), trunkMat);
  trunk.position.set(x, 0.68 * scale, z);
  trunk.castShadow = true;
  const crown = new THREE.Mesh(new THREE.SphereGeometry(1.15 * scale, 8, 6), leafMat);
  crown.position.set(x, 1.85 * scale, z);
  crown.castShadow = true;
  scene.add(trunk, crown);
}

function buildWorld() {
  const ground = new THREE.Mesh(new THREE.CircleGeometry(52, 48), grass);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  addFloor(0, 6, 3.4, 42, 0xc3b093);
  addFloor(0, 8, 52, 3.4, 0xc3b093);
  const plaza = new THREE.Mesh(new THREE.CircleGeometry(7.2, 24), pathMat);
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.set(0, 0.03, 8);
  plaza.receiveShadow = true;
  scene.add(plaza);

  const fence = 36;
  addWall(-fence, -fence, fence, -fence + 0.5, 1.4, hedgeMat);
  addWall(-fence, fence - 0.5, fence, fence, 1.4, hedgeMat);
  addWall(-fence, -fence, -fence + 0.5, fence, 1.4, hedgeMat);
  addWall(fence - 0.5, -fence, fence, fence, 1.4, hedgeMat);

  // Manor, door faces south toward the path.
  addFloor(0, -22, 16.6, 11.2, 0xddd4c6);
  addWall(-9.2, -28.2, 9.2, -27.5, 3.3, manorMat);
  addWall(-9.2, -28.2, -8.5, -15.6, 3.3, manorMat);
  addWall(8.5, -28.2, 9.2, -15.6, 3.3, manorMat);
  addWall(-9.2, -16.3, -1.4, -15.6, 3.3, manorMat);
  addWall(1.4, -16.3, 9.2, -15.6, 3.3, manorMat);

  // Cottage, door on the east.
  addFloor(-24, 8.3, 7.2, 6.4, 0xe4d2b5);
  addWall(-28, 4.6, -20.4, 5.3, 2.8, cottageMat);
  addWall(-28, 11.6, -20.4, 12.3, 2.8, cottageMat);
  addWall(-28, 4.6, -27.3, 12.3, 2.8, cottageMat);
  addWall(-20.8, 4.6, -20.1, 6.7, 2.8, cottageMat);
  addWall(-20.8, 9.6, -20.1, 12.3, 2.8, cottageMat);

  // Barn, wide door on the west.
  addFloor(24.2, 8.2, 10.2, 10.2, 0xd8c2a4);
  addWall(18.8, 2.6, 30, 3.3, 3.1, barnMat);
  addWall(18.8, 13.4, 30, 14.1, 3.1, barnMat);
  addWall(29.3, 2.6, 30, 14.1, 3.1, barnMat);
  addWall(18.8, 2.6, 19.5, 6.5, 3.1, barnMat);
  addWall(18.8, 9.8, 19.5, 14.1, 3.1, barnMat);

  const basin = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.9, 0.7, 16), stoneMat(0xbfc6c8));
  basin.position.set(0, 0.35, 2);
  basin.castShadow = true;
  const water = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.16, 16), waterMat);
  water.position.set(0, 0.62, 2);
  scene.add(basin, water);
  colliders.push({ minX: -1.9, maxX: 1.9, minZ: 0.1, maxZ: 3.9 });

  addWall(-7.2, 16.2, -2.2, 16.9, 1.15, hedgeMat);
  addWall(3.4, 16.2, 8.6, 16.9, 1.15, hedgeMat);
  addWall(11.2, -4.2, 11.9, 1.2, 1.15, hedgeMat);
  addWall(-14.5, -2.2, -9.2, -1.5, 1.15, hedgeMat);

  const crateMat = stoneMat(0x6e5138);
  for (const [x, z] of [
    [6.2, 13.2],
    [-6.4, 12.4],
    [11.5, 5.2],
    [-12.2, 5.4],
  ] as const) {
    addWall(x - 0.55, z - 0.55, x + 0.55, z + 0.55, 0.9, crateMat);
  }

  for (const [x, z, s] of [
    [-16, -8, 1.05],
    [-20, 18, 1.2],
    [-31, 18, 0.9],
    [-32, -12, 1.1],
    [-12, 28, 1],
    [14, 27, 1.15],
    [20, 22, 0.95],
    [31, 18, 1.1],
    [32, -10, 1],
    [16, -14, 1.2],
    [-24, -20, 1],
    [24, -18, 1.1],
    [10, -30, 0.9],
    [-14, -28, 1.15],
    [28, 30, 1],
    [-30, 30, 0.85],
    [6, 32, 1],
  ] as const) {
    addTree(x, z, s);
  }

  const windowMat = new THREE.MeshStandardMaterial({
    color: 0xf6e2a8,
    emissive: 0xf0c56a,
    emissiveIntensity: 0.6,
    roughness: 0.4,
  });
  for (const [x, y, z] of [
    [-4, 1.6, -15.55],
    [4, 1.6, -15.55],
    [-23.2, 1.5, 4.55],
    [24, 1.7, 2.55],
  ] as const) {
    const pane = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.08), windowMat);
    pane.position.set(x, y, z);
    scene.add(pane);
  }

  const rawNav = [
    { x: 0, z: 8 },
    { x: 0, z: 18 },
    { x: 0, z: -8 },
    { x: 0, z: -12 },
    { x: -14, z: 8 },
    { x: 14, z: 8 },
    { x: -24, z: 8.3 },
    { x: 24, z: 8.2 },
    { x: 0, z: -22 },
    { x: -18, z: 20 },
    { x: 18, z: -8 },
    { x: 8, z: 22 },
    { x: -8, z: -4 },
    { x: 22, z: 20 },
    { x: -28, z: -4 },
  ];
  for (const point of rawNav) {
    if (!overlaps(point.x, point.z, 0.5)) nav.push(point);
  }
}

function overlaps(x: number, z: number, r: number) {
  if (Math.abs(x) > WORLD - r || Math.abs(z) > WORLD - r) return true;
  for (const box of colliders) {
    const cx = Math.min(Math.max(x, box.minX), box.maxX);
    const cz = Math.min(Math.max(z, box.minZ), box.maxZ);
    const dx = x - cx;
    const dz = z - cz;
    if (dx * dx + dz * dz < r * r) return true;
  }
  return false;
}

function segmentBlocked(x1: number, z1: number, x2: number, z2: number) {
  const dx = x2 - x1;
  const dz = z2 - z1;
  for (const box of colliders) {
    let t0 = 0;
    let t1 = 1;
    const checks = [
      { p: -dx, q: x1 - box.minX },
      { p: dx, q: box.maxX - x1 },
      { p: -dz, q: z1 - box.minZ },
      { p: dz, q: box.maxZ - z1 },
    ];
    let hit = true;
    for (const check of checks) {
      if (Math.abs(check.p) < 1e-8) {
        if (check.q < 0) {
          hit = false;
          break;
        }
      } else {
        const t = check.q / check.p;
        if (check.p < 0) {
          if (t > t1) {
            hit = false;
            break;
          }
          if (t > t0) t0 = t;
        } else {
          if (t < t0) {
            hit = false;
            break;
          }
          if (t < t1) t1 = t;
        }
      }
    }
    if (hit && t0 <= t1) return true;
  }
  return false;
}

function makeLabel(text: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  ctx.clearRect(0, 0, 256, 64);
  ctx.fillStyle = "rgba(20,16,12,0.55)";
  ctx.fillRect(28, 10, 200, 40);
  ctx.fillStyle = "#f7f3ea";
  ctx.font = "600 28px Georgia";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 128, 32);
  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
  sprite.scale.set(2.1, 0.52, 1);
  sprite.position.y = 2.2;
  return sprite;
}

function createPerson(coat: number, hat: boolean) {
  const group = new THREE.Group();
  const cloth = new THREE.MeshStandardMaterial({ color: coat, roughness: 0.78 });
  const skin = new THREE.MeshStandardMaterial({ color: 0xf0c7a2, roughness: 0.65 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x2c2622, roughness: 0.9 });
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.26, 0.46, 4, 8), cloth);
  torso.position.y = 1.05;
  torso.castShadow = true;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), skin);
  head.position.y = 1.62;
  head.castShadow = true;
  group.add(torso, head);
  if (hat) {
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 12), dark);
    brim.position.y = 1.8;
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.22, 10), cloth);
    cap.position.y = 1.94;
    group.add(brim, cap);
  }
  const arm = new THREE.Group();
  arm.position.set(0.34, 1.35, 0);
  const armMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.28, 3, 6), cloth);
  armMesh.position.y = -0.26;
  armMesh.castShadow = true;
  arm.add(armMesh);
  const armL = arm.clone();
  armL.position.x = -0.34;
  group.add(arm, armL);
  const legGeo = new THREE.CapsuleGeometry(0.09, 0.28, 3, 6);
  const legL = new THREE.Mesh(legGeo, dark);
  legL.position.set(-0.12, 0.4, 0);
  legL.castShadow = true;
  const legR = new THREE.Mesh(legGeo, dark);
  legR.position.set(0.12, 0.4, 0);
  legR.castShadow = true;
  group.add(legL, legR);
  const bubble = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, 18, 12),
    new THREE.MeshStandardMaterial({
      color: 0xb9ddf5,
      transparent: true,
      opacity: 0.28,
      emissive: 0x1c3c4e,
      depthWrite: false,
    }),
  );
  bubble.position.y = 1.1;
  bubble.visible = false;
  group.add(bubble);
  return { group, arm, legs: [legL, legR] as [THREE.Object3D, THREE.Object3D], cloth, bubble };
}

const names = ["Rowan", "Nell", "Ivo", "Sera", "Bram", "Quinn"];
const coats = [0x314863, 0x6d4a34, 0x3c5a44, 0x6a3e4d, 0x4c463c, 0x3a5160];
const spawns = [
  { x: 0, z: 11 },
  { x: -6.5, z: 6.5 },
  { x: 7, z: 6.2 },
  { x: -3.5, z: 16 },
  { x: 4.5, z: 18 },
  { x: 1.5, z: -6 },
];

function makeActor(index: number): Actor {
  const body = createPerson(coats[index], index % 2 === 0);
  const label = makeLabel(names[index]);
  body.group.add(label);
  scene.add(body.group);
  return {
    id: index,
    name: names[index],
    isPlayer: index === 0,
    role: "innocent",
    lives: LIVES,
    x: spawns[index].x,
    z: spawns[index].z,
    yaw: index === 0 ? Math.PI : 0,
    down: false,
    shield: 0,
    shieldCd: 0,
    attackCd: 0.4,
    ultCd: index === 0 ? 0 : 2 + Math.random() * 2,
    volley: 0,
    volleyGap: 0,
    windup: 0,
    lunge: 0,
    lungeX: 0,
    lungeZ: 0,
    lungeHit: new Set(),
    suspect: null,
    flee: 0,
    threatX: 0,
    threatZ: 0,
    wanderX: spawns[index].x,
    wanderZ: spawns[index].z,
    wanderWait: Math.random(),
    moving: false,
    walk: 0,
    swing: 0,
    flash: 0,
    mesh: body.group,
    arm: body.arm,
    legs: body.legs,
    cloth: body.cloth,
    bubble: body.bubble,
    label,
  };
}

const actors: Actor[] = names.map((_, index) => makeActor(index));
const player = actors[0];

function assignRoles() {
  const roles: Role[] = ["murderer", "sheriff", "innocent", "innocent", "innocent", "innocent"];
  for (let i = roles.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = roles[i];
    roles[i] = roles[j];
    roles[j] = swap;
  }
  actors.forEach((actor, index) => {
    actor.role = roles[index];
  });
}

function roleName(role: Role) {
  if (role === "sheriff") return "Sheriff";
  if (role === "murderer") return "Murderer";
  return "Innocent";
}

function say(text: string) {
  el.toast.textContent = text;
  toastTimer = 2.2;
}

function tone(freq: number, dur: number, type: OscillatorType, gainValue = 0.04) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = gainValue;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
  osc.stop(audioCtx.currentTime + dur);
}

function dist(a: Actor, b: Actor) {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

function nearestLiving(from: Actor) {
  let best: Actor | null = null;
  let bestD = Infinity;
  for (const other of actors) {
    if (other === from || other.down) continue;
    const d = dist(from, other);
    if (d < bestD) {
      best = other;
      bestD = d;
    }
  }
  return best;
}

function moveActor(actor: Actor, dx: number, dz: number) {
  const beforeX = actor.x;
  const beforeZ = actor.z;
  const nx = actor.x + dx;
  if (!overlaps(nx, actor.z, RADIUS)) actor.x = nx;
  const nz = actor.z + dz;
  if (!overlaps(actor.x, nz, RADIUS)) actor.z = nz;
  return Math.hypot(actor.x - beforeX, actor.z - beforeZ) > 0.0001;
}

function face(actor: Actor, x: number, z: number) {
  actor.yaw = Math.atan2(x - actor.x, z - actor.z);
}

function steer(actor: Actor, x: number, z: number, speed: number, dt: number) {
  const dx = x - actor.x;
  const dz = z - actor.z;
  const d = Math.hypot(dx, dz);
  if (d < 0.55) return false;
  actor.yaw = Math.atan2(dx, dz);
  const stepX = (dx / d) * speed * dt;
  const stepZ = (dz / d) * speed * dt;
  if (!moveActor(actor, stepX, stepZ)) moveActor(actor, -stepZ, stepX);
  actor.moving = true;
  return true;
}

function witness(attacker: Actor) {
  for (const other of actors) {
    if (other === attacker || other.down) continue;
    if (dist(other, attacker) > 18) continue;
    if (segmentBlocked(other.x, other.z, attacker.x, attacker.z)) continue;
    other.threatX = attacker.x;
    other.threatZ = attacker.z;
    if (other.role === "sheriff") other.suspect = attacker.id;
    if (other.role === "innocent" && other.flee <= 0) other.flee = 2.1;
  }
}

function dropActor(actor: Actor) {
  actor.lives = 0;
  actor.down = true;
  actor.shield = 0;
  actor.bubble.visible = false;
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "rgba(20,16,12,0.55)";
    ctx.fillRect(28, 10, 200, 40);
    ctx.fillStyle = "#c8c0b4";
    ctx.font = "600 26px Georgia";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${actor.name} is down`, 128, 32);
    const map = actor.label.material.map;
    if (map) {
      map.image = canvas;
      map.needsUpdate = true;
    }
  }
}

function checkWin() {
  if (roundOver) return;
  const murderer = actors.find((actor) => actor.role === "murderer");
  if (!murderer) return;
  const townDead = actors.every((actor) => actor.role === "murderer" || actor.down);
  if (!murderer.down && !townDead) return;
  roundOver = true;
  document.exitPointerLock();
  el.hud.hidden = true;
  el.overlay.hidden = false;
  el.title.textContent = murderer.down ? "The estate is safe" : "The murderer stands alone";
  el.copy.textContent = `The murderer was ${murderer.name}.`;
  el.play.textContent = "Play again";
  const list = el.overlay.querySelector(".controls");
  if (list) list.setAttribute("hidden", "");
}

function damage(target: Actor, amount: number, attacker: Actor | null = null) {
  if (roundOver || grace > 0 || target.down) return false;
  if (target.shield > 0) {
    target.shield = 0;
    target.bubble.visible = false;
    if (target.isPlayer) say("Shield caught the hit.");
    tone(520, 0.08, "triangle", 0.05);
    return false;
  }
  target.lives = Math.max(0, target.lives - amount);
  target.flash = 0.25;
  tone(140, 0.12, "sawtooth", 0.03);
  if (target.isPlayer) {
    say(target.lives > 0 ? "You were hit." : "That was your last life.");
    hurtTimer = 0.28;
  } else if (attacker?.isPlayer) {
    say(target.lives > 0 ? "You landed a hit." : `${target.name} is down.`);
  }
  if (target.lives <= 0) dropActor(target);
  checkWin();
  return true;
}

function slash(actor: Actor, wide: boolean) {
  actor.swing = wide ? 0.28 : 0.22;
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(wide ? 1.5 : 0.85, 0.12, 0.18),
    new THREE.MeshBasicMaterial({ color: wide ? 0xf6e2a2 : 0xf7f7f7, transparent: true, opacity: 0.85 }),
  );
  const reach = wide ? 1.25 : 1.05;
  mesh.position.set(actor.x + Math.sin(actor.yaw) * reach, 1.2, actor.z + Math.cos(actor.yaw) * reach);
  mesh.rotation.y = actor.yaw;
  scene.add(mesh);
  fx.push({ obj: mesh, life: 0.12, max: 0.12 });
}

function melee(actor: Actor, range: number, arc: number) {
  witness(actor);
  slash(actor, range > MELEE_RANGE);
  const fxDir = Math.sin(actor.yaw);
  const fzDir = Math.cos(actor.yaw);
  for (const other of actors) {
    if (other === actor || other.down) continue;
    const dx = other.x - actor.x;
    const dz = other.z - actor.z;
    const d = Math.hypot(dx, dz);
    if (d > range || d < 0.001) continue;
    const dot = (dx / d) * fxDir + (dz / d) * fzDir;
    if (dot < Math.cos(arc)) continue;
    if (segmentBlocked(actor.x, actor.z, other.x, other.z)) continue;
    damage(other, 1, actor);
  }
}

function tracer(actor: Actor, length: number, color: number) {
  const points = [
    new THREE.Vector3(actor.x, 1.25, actor.z),
    new THREE.Vector3(actor.x + Math.sin(actor.yaw) * length, 1.25, actor.z + Math.cos(actor.yaw) * length),
  ];
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 1 }),
  );
  scene.add(line);
  fx.push({ obj: line, life: 0.09, max: 0.09 });
}

function shoot(actor: Actor, rapid: boolean) {
  witness(actor);
  actor.swing = 0.12;
  const forwardX = Math.sin(actor.yaw);
  const forwardZ = Math.cos(actor.yaw);
  const range = rapid ? 26 : GUN_RANGE;
  let hit: Actor | null = null;
  let best = range;
  for (const other of actors) {
    if (other === actor || other.down) continue;
    const dx = other.x - actor.x;
    const dz = other.z - actor.z;
    const t = dx * forwardX + dz * forwardZ;
    if (t < 0.3 || t > range) continue;
    const px = actor.x + forwardX * t;
    const pz = actor.z + forwardZ * t;
    if ((other.x - px) ** 2 + (other.z - pz) ** 2 > 0.65 ** 2) continue;
    if (segmentBlocked(actor.x, actor.z, other.x, other.z)) continue;
    if (t < best) {
      best = t;
      hit = other;
    }
  }
  tracer(actor, hit ? best : range, rapid ? 0xf6d98a : 0xf4f1ea);
  tone(rapid ? 660 : 420, 0.05, "square", 0.03);
  if (hit) damage(hit, 1, actor);
}

function basicAttack(actor: Actor) {
  if (actor.down || actor.attackCd > 0 || actor.volley > 0 || grace > 0) return;
  if (actor.role === "innocent") {
    if (actor.isPlayer) say("Innocents carry no weapon.");
    return;
  }
  actor.attackCd = actor.role === "sheriff" ? GUN_CD : MELEE_CD;
  if (actor.role === "sheriff") shoot(actor, false);
  else melee(actor, MELEE_RANGE, 0.9);
}

function raiseShield(actor: Actor) {
  if (actor.down || actor.shieldCd > 0 || actor.shield > 0) return;
  actor.shield = SHIELD_TIME;
  actor.shieldCd = SHIELD_CD;
  actor.bubble.visible = true;
  tone(340, 0.1, "sine", 0.04);
  if (actor.isPlayer) say("Shield up.");
}

function startUltimate(actor: Actor) {
  if (actor.down || roundOver) return;
  if (grace > 0) {
    if (actor.isPlayer) say("The round has barely begun.");
    return;
  }
  if (actor.ultCd > 0) return;
  if (actor.role === "innocent") {
    if (actor.isPlayer) say("You have no ultimate.");
    return;
  }
  actor.ultCd = ULT_CD;
  if (actor.role === "sheriff") {
    actor.volley = 3;
    actor.volleyGap = 0;
    if (actor.isPlayer) say("Rapid volley.");
    return;
  }
  actor.lunge = 0.28;
  actor.lungeX = Math.sin(actor.yaw);
  actor.lungeZ = Math.cos(actor.yaw);
  actor.lungeHit.clear();
  actor.attackCd = 0.45;
  witness(actor);
  if (actor.isPlayer) say("Lunge.");
}

function pickWander(actor: Actor) {
  if (nav.length === 0) return;
  const point = nav[Math.floor(Math.random() * nav.length)];
  actor.wanderX = point.x;
  actor.wanderZ = point.z;
  actor.wanderWait = 0.35 + Math.random() * 1.1;
}

function updateAi(actor: Actor, dt: number) {
  if (actor.isPlayer || actor.down || roundOver) return;
  if (actor.lunge > 0) {
    actor.lunge -= dt;
    actor.moving = true;
    moveActor(actor, actor.lungeX * 17 * dt, actor.lungeZ * 17 * dt);
    for (const other of actors) {
      if (other === actor || other.down || actor.lungeHit.has(other.id)) continue;
      if (dist(actor, other) > 2.05) continue;
      if (segmentBlocked(actor.x, actor.z, other.x, other.z)) continue;
      actor.lungeHit.add(other.id);
      slash(actor, true);
      damage(other, 1, actor);
    }
    if (actor.lunge <= 0) melee(actor, 2.35, 1.15);
    return;
  }
  if (actor.volley > 0) {
    actor.volleyGap -= dt;
    if (actor.volleyGap <= 0) {
      shoot(actor, true);
      actor.volley -= 1;
      actor.volleyGap = 0.16;
      actor.attackCd = 0.4;
    }
    return;
  }
  if (grace > 0) {
    steer(actor, actor.wanderX, actor.wanderZ, 2.2, dt);
    return;
  }

  if (actor.role === "murderer") {
    const prey = nearestLiving(actor);
    if (!prey) return;
    face(actor, prey.x, prey.z);
    if (actor.windup > 0) {
      actor.windup -= dt;
      actor.arm.rotation.x = -1.1;
      steer(actor, prey.x, prey.z, 3.4, dt);
      if (actor.windup <= 0) {
        melee(actor, MELEE_RANGE, 1.05);
        actor.attackCd = MELEE_CD;
      }
      return;
    }
    const gap = dist(actor, prey);
    if (gap < MELEE_RANGE - 0.05 && actor.attackCd <= 0) {
      if (actor.ultCd <= 0 && Math.random() < 0.55) startUltimate(actor);
      else actor.windup = 0.28;
      return;
    }
    if (gap < 7 && actor.ultCd <= 0) {
      startUltimate(actor);
      return;
    }
    steer(actor, prey.x, prey.z, 6.15, dt);
    return;
  }

  if (actor.role === "sheriff" && actor.suspect !== null) {
    const suspect = actors[actor.suspect];
    if (suspect && !suspect.down) {
      const see = !segmentBlocked(actor.x, actor.z, suspect.x, suspect.z);
      const gap = dist(actor, suspect);
      if (see && gap < 18 && actor.attackCd <= 0) {
        face(actor, suspect.x, suspect.z);
        if (actor.ultCd <= 0 && gap < 16) startUltimate(actor);
        else shoot(actor, false);
        actor.attackCd = GUN_CD;
        return;
      }
      if (gap > 7) steer(actor, suspect.x, suspect.z, 5.3, dt);
      return;
    }
    actor.suspect = null;
  }

  if (actor.flee > 0) {
    actor.flee -= dt;
    const awayX = actor.x + (actor.x - actor.threatX);
    const awayZ = actor.z + (actor.z - actor.threatZ);
    steer(actor, awayX, awayZ, 4.35, dt);
    return;
  }

  if (actor.wanderWait > 0) {
    actor.wanderWait -= dt;
    return;
  }
  const arrived = !steer(actor, actor.wanderX, actor.wanderZ, 3.2, dt);
  if (arrived) pickWander(actor);
}

function separate() {
  for (let i = 0; i < actors.length; i += 1) {
    for (let j = i + 1; j < actors.length; j += 1) {
      const a = actors[i];
      const b = actors[j];
      if (a.down || b.down) continue;
      const dx = a.x - b.x;
      const dz = a.z - b.z;
      const d = Math.hypot(dx, dz);
      if (d > 0.9 || d < 0.001) continue;
      const push = (0.9 - d) / 2;
      moveActor(a, (dx / d) * push, (dz / d) * push);
      moveActor(b, (-dx / d) * push, (-dz / d) * push);
    }
  }
}

function syncMesh(actor: Actor, dt: number) {
  if (actor.moving) actor.walk += dt * 9;
  actor.moving = false;
  actor.mesh.position.set(actor.x, actor.down ? 0.42 : 0, actor.z);
  actor.mesh.rotation.set(actor.down ? 1.2 : 0, actor.yaw, 0);
  const step = actor.down ? 0 : Math.sin(actor.walk);
  actor.legs[0].rotation.x = step * 0.7;
  actor.legs[1].rotation.x = -step * 0.7;
  if (actor.swing > 0) {
    actor.swing -= dt;
    actor.arm.rotation.x = -1.35 * Math.sin(Math.min(1, 1 - actor.swing / 0.22) * Math.PI);
  } else if (actor.windup <= 0) {
    actor.arm.rotation.x = step * 0.35;
  }
  actor.bubble.visible = actor.shield > 0 && !actor.down;
  if (actor.flash > 0) {
    actor.flash -= dt;
    actor.cloth.emissive.setHex(0x6a1d1d);
  } else {
    actor.cloth.emissive.setHex(0x000000);
  }
}

function updateCamera() {
  const lookY = 1.35;
  const dist = 6.3;
  const horiz = Math.cos(pitch);
  const desiredX = player.x - Math.sin(player.yaw) * dist * horiz;
  const desiredZ = player.z - Math.cos(player.yaw) * dist * horiz;
  const desiredY = lookY + Math.sin(pitch) * dist;
  let scale = 1;
  for (let i = 0; i < 6; i += 1) {
    const x = player.x + (desiredX - player.x) * scale;
    const z = player.z + (desiredZ - player.z) * scale;
    if (!overlaps(x, z, 0.3)) break;
    scale *= 0.62;
  }
  camera.position.set(
    player.x + (desiredX - player.x) * scale,
    lookY + (desiredY - lookY) * Math.max(scale, 0.18),
    player.z + (desiredZ - player.z) * Math.max(scale, 0.18),
  );
  camera.lookAt(player.x, lookY, player.z);
}

function drawMinimap() {
  const ctx = el.minimap.getContext("2d");
  if (!ctx) return;
  const size = el.minimap.width;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "rgba(18, 22, 18, 0.2)";
  ctx.fillRect(0, 0, size, size);
  const span = 84;
  const toX = (x: number) => ((x + 42) / span) * size;
  const toY = (z: number) => ((z + 42) / span) * size;
  ctx.fillStyle = "rgba(244, 239, 228, 0.16)";
  for (const box of colliders) {
    ctx.fillRect(toX(box.minX), toY(box.minZ), ((box.maxX - box.minX) / span) * size, ((box.maxZ - box.minZ) / span) * size);
  }
  for (const actor of actors) {
    ctx.beginPath();
    ctx.fillStyle = actor.down ? "rgba(200,200,200,0.35)" : actor.isPlayer ? "#f4efe4" : "#d5e4c4";
    ctx.arc(toX(actor.x), toY(actor.z), actor.isPlayer ? 4.2 : 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paintHud() {
  el.role.textContent = `Your role: ${roleName(player.role)}`;
  el.hint.textContent = "The murderer is unknown. Watch who attacks.";
  el.hearts.replaceChildren(
    ...Array.from({ length: LIVES }, (_, index) => {
      const heart = document.createElement("span");
      heart.className = index < player.lives ? "heart on" : "heart";
      heart.textContent = "♥";
      return heart;
    }),
  );
  if (player.role === "innocent") el.attack.textContent = "No weapon";
  else if (player.role === "sheriff") {
    el.attack.textContent = player.attackCd <= 0 ? "Fire [LMB] ready" : `Fire [LMB] ${player.attackCd.toFixed(1)}s`;
  } else {
    el.attack.textContent = player.attackCd <= 0 ? "Strike [LMB] ready" : `Strike [LMB] ${player.attackCd.toFixed(1)}s`;
  }
  el.attack.classList.toggle("ready", player.role !== "innocent" && player.attackCd <= 0);
  el.shield.textContent = player.shield > 0 ? "Shield [Q] up" : player.shieldCd <= 0 ? "Shield [Q] ready" : `Shield [Q] ${player.shieldCd.toFixed(1)}s`;
  el.shield.classList.toggle("ready", player.shield <= 0 && player.shieldCd <= 0);
  el.shield.classList.toggle("hot", player.shield > 0);
  if (player.role === "innocent") {
    el.ultimate.textContent = "Ultimate — none";
    el.ultimate.classList.remove("ready", "hot");
  } else {
    const kind = player.role === "sheriff" ? "Volley" : "Lunge";
    el.ultimate.textContent = player.ultCd <= 0 ? `${kind} [R] ready` : `${kind} [R] ${player.ultCd.toFixed(1)}s`;
    el.ultimate.classList.toggle("ready", player.ultCd <= 0);
    el.ultimate.classList.toggle("hot", player.volley > 0 || player.lunge > 0);
  }
  el.down.hidden = !player.down || roundOver;
}

function updatePlayer(dt: number) {
  if (!started || player.down || roundOver) return;
  let ix = 0;
  let iz = 0;
  if (keys.has("KeyW")) iz += 1;
  if (keys.has("KeyS")) iz -= 1;
  if (keys.has("KeyD")) ix += 1;
  if (keys.has("KeyA")) ix -= 1;
  const len = Math.hypot(ix, iz);
  if (len > 0 && player.lunge <= 0) {
    const forwardX = Math.sin(player.yaw);
    const forwardZ = Math.cos(player.yaw);
    const rightX = -Math.cos(player.yaw);
    const rightZ = Math.sin(player.yaw);
    const speed = keys.has("ShiftLeft") || keys.has("ShiftRight") ? SPRINT : WALK;
    moveActor(
      player,
      ((forwardX * iz + rightX * ix) / len) * speed * dt,
      ((forwardZ * iz + rightZ * ix) / len) * speed * dt,
    );
    player.moving = true;
  }
  if (player.lunge > 0) {
    player.lunge -= dt;
    player.moving = true;
    moveActor(player, player.lungeX * 17 * dt, player.lungeZ * 17 * dt);
    for (const other of actors) {
      if (other.down || player.lungeHit.has(other.id)) continue;
      if (dist(player, other) > 2.05) continue;
      if (segmentBlocked(player.x, player.z, other.x, other.z)) continue;
      player.lungeHit.add(other.id);
      slash(player, true);
      damage(other, 1, player);
    }
    if (player.lunge <= 0) melee(player, 2.35, 1.15);
  }
  if (player.volley > 0) {
    player.volleyGap -= dt;
    if (player.volleyGap <= 0) {
      shoot(player, true);
      player.volley -= 1;
      player.volleyGap = 0.16;
      player.attackCd = 0.4;
    }
  }
  if (pressed.has("KeyQ")) raiseShield(player);
  if (pressed.has("KeyR")) startUltimate(player);
  if (wantAttack || pressed.has("KeyF")) basicAttack(player);
}

function tickCooldowns(actor: Actor, dt: number) {
  actor.attackCd = Math.max(0, actor.attackCd - dt);
  actor.shieldCd = Math.max(0, actor.shieldCd - dt);
  actor.ultCd = Math.max(0, actor.ultCd - dt);
  if (actor.shield > 0) {
    actor.shield -= dt;
    if (actor.shield <= 0) actor.bubble.visible = false;
  }
}

let last = performance.now();

function frame(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (grace > 0) grace = Math.max(0, grace - dt);
  if (started && !roundOver) {
    if (keys.has("ArrowLeft")) player.yaw += 1.8 * dt;
    if (keys.has("ArrowRight")) player.yaw -= 1.8 * dt;
    if (keys.has("ArrowUp")) pitch = Math.max(-0.15, pitch - 1.1 * dt);
    if (keys.has("ArrowDown")) pitch = Math.min(1.05, pitch + 1.1 * dt);
  }
  if (toastTimer > 0) {
    toastTimer -= dt;
    if (toastTimer <= 0) el.toast.textContent = "";
  }
  hurt.classList.toggle("on", hurtTimer > 0);
  if (hurtTimer > 0) hurtTimer -= dt;

  updatePlayer(dt);
  for (const actor of actors) {
    tickCooldowns(actor, dt);
    updateAi(actor, dt);
  }
  separate();
  for (const actor of actors) syncMesh(actor, dt);

  for (let i = fx.length - 1; i >= 0; i -= 1) {
    fx[i].life -= dt;
    const material = (fx[i].obj as THREE.Mesh).material as THREE.Material & { opacity?: number };
    if (typeof material.opacity === "number") material.opacity = Math.max(0, fx[i].life / fx[i].max);
    if (fx[i].life <= 0) {
      scene.remove(fx[i].obj);
      fx.splice(i, 1);
    }
  }

  updateCamera();
  if (!roundOver) {
    paintHud();
    drawMinimap();
  }
  renderer.render(scene, camera);
  pressed.clear();
  wantAttack = false;
  requestAnimationFrame(frame);
}

function bootAudio() {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") void audioCtx.resume();
}

function begin() {
  bootAudio();
  if (roundOver) {
    window.location.reload();
    return;
  }
  started = true;
  grace = 1.6;
  el.overlay.hidden = true;
  el.hud.hidden = false;
  paintHud();
  say(`You are ${roleName(player.role)}. The murderer is unknown.`);
  el.canvas.requestPointerLock();
}

el.play.addEventListener("click", begin);
el.canvas.addEventListener("click", () => {
  if (started && !roundOver && document.pointerLockElement !== el.canvas) el.canvas.requestPointerLock();
});
el.canvas.addEventListener("mousedown", (event) => {
  if (event.button === 0 && document.pointerLockElement === el.canvas) wantAttack = true;
});
window.addEventListener("keydown", (event) => {
  if (event.repeat) return;
  keys.add(event.code);
  pressed.add(event.code);
  if (event.code === "KeyQ" || event.code === "KeyR") event.preventDefault();
});
window.addEventListener("keyup", (event) => keys.delete(event.code));
window.addEventListener("blur", () => keys.clear());
window.addEventListener("mousemove", (event) => {
  if (document.pointerLockElement !== el.canvas || roundOver) return;
  player.yaw -= event.movementX * 0.0022;
  pitch = Math.min(1.05, Math.max(-0.15, pitch + event.movementY * 0.0018));
});
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

buildWorld();
assignRoles();
for (const actor of actors) {
  if (overlaps(actor.x, actor.z, RADIUS)) {
    actor.x += 1.5;
    actor.z += 1.5;
  }
  syncMesh(actor, 0);
}
player.label.visible = false;
const ring = new THREE.Mesh(
  new THREE.RingGeometry(0.55, 0.72, 24),
  new THREE.MeshBasicMaterial({ color: 0xf4efe4, side: THREE.DoubleSide }),
);
ring.rotation.x = -Math.PI / 2;
ring.position.y = 0.08;
player.mesh.add(ring);
updateCamera();
requestAnimationFrame(frame);
