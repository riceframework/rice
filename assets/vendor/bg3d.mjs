/* RICE 3D network background — three.js module.
   Used as the primary fallback when the video stream is unavailable:
   a slowly-rotating 3D constellation of gold nodes with static link
   topology, depth fog, and mouse parallax. Exposes window.RICE3D.start()
   which returns true on success; app.js falls back to the 2D canvas
   if WebGL is unavailable. */
import * as THREE from './three.module.min.js';

function start() {
  var stage = document.querySelector('.sitebg');
  if (!stage || stage.querySelector('canvas.bg3d')) return true;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) { return false; }
  if (!renderer.getContext()) return false;

  var canvas = renderer.domElement;
  canvas.className = 'bg3d';
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  stage.insertBefore(canvas, stage.firstChild);
  stage.classList.add('fallback3d');

  var W = stage.clientWidth, H = stage.clientHeight;
  var dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  renderer.setPixelRatio(dpr);
  renderer.setSize(W, H);

  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0a0c10, 60, 190);
  var camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 400);
  camera.position.z = 110;

  var group = new THREE.Group();
  scene.add(group);

  /* node cloud: flattened ellipsoid so it reads as a field, not a ball */
  var COUNT = window.matchMedia('(max-width:1023px)').matches ? 260 : 520;
  var positions = new Float32Array(COUNT * 3);
  var pts = [];
  for (var i = 0; i < COUNT; i++) {
    var r = 40 + Math.random() * 60;
    var theta = Math.random() * Math.PI * 2;
    var phi = Math.acos(2 * Math.random() - 1);
    var x = r * Math.sin(phi) * Math.cos(theta) * 1.65;
    var y = r * Math.sin(phi) * Math.sin(theta) * 0.72;
    var z = r * Math.cos(phi);
    positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
    pts.push(new THREE.Vector3(x, y, z));
  }
  var geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  var mat = new THREE.PointsMaterial({
    color: 0xE3C878, size: 1.5, sizeAttenuation: true,
    transparent: true, opacity: 0.85, fog: true
  });
  group.add(new THREE.Points(geo, mat));

  /* static link topology between near neighbours — computed once, rotates with the cloud */
  var linkPositions = [];
  var MAXD = 26, budget = COUNT * 2;
  for (var a = 0; a < COUNT && budget > 0; a++) {
    for (var b = a + 1; b < COUNT && budget > 0; b++) {
      if (pts[a].distanceTo(pts[b]) < MAXD) {
        linkPositions.push(pts[a].x, pts[a].y, pts[a].z, pts[b].x, pts[b].y, pts[b].z);
        budget--;
      }
    }
  }
  var lgeo = new THREE.BufferGeometry();
  lgeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linkPositions), 3));
  var lmat = new THREE.LineBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.14, fog: true });
  group.add(new THREE.LineSegments(lgeo, lmat));

  /* interaction state */
  var mx = 0, my = 0, tx = 0, ty = 0, running = true, raf = null;
  window.addEventListener('pointermove', function (e) {
    tx = (e.clientX / window.innerWidth - 0.5) * 0.35;
    ty = (e.clientY / window.innerHeight - 0.5) * 0.22;
  }, { passive: true });

  var last = 0;
  function tick(now) {
    if (!running) return;
    raf = requestAnimationFrame(tick);
    if (now - last < 33) return; // ~30fps
    last = now;
    group.rotation.y += 0.0009;
    mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
    group.rotation.x = my;
    camera.position.x += (mx * 22 - camera.position.x) * 0.05;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(tick);

  window.addEventListener('resize', function () {
    W = stage.clientWidth; H = stage.clientHeight;
    camera.aspect = W / H; camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { running = false; if (raf) cancelAnimationFrame(raf); }
    else { running = true; last = 0; raf = requestAnimationFrame(tick); }
  });
  return true;
}

window.RICE3D = { start: start };
document.dispatchEvent(new Event('rice:3dready'));
