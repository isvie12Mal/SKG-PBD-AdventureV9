import * as B from '@babylonjs/core';
import './style.css';

const canvas=document.getElementById('renderCanvas');
const engine=new B.Engine(canvas,true,{antialias:true,stencil:true,preserveDrawingBuffer:false});
engine.setHardwareScalingLevel(Math.min(1.5,Math.max(1,window.devicePixelRatio/1.5)));
const scene=new B.Scene(engine);scene.clearColor=new B.Color4(.58,.81,.98,1);
scene.fogMode=B.Scene.FOGMODE_EXP2;scene.fogDensity=.009;scene.fogColor=new B.Color3(.63,.82,.94);
scene.ambientColor=new B.Color3(.72,.78,.88);
scene.imageProcessingConfiguration.contrast=1.12;scene.imageProcessingConfiguration.exposure=1.1;
const hemi=new B.HemisphericLight('skylight',new B.Vector3(0,1,0),scene);hemi.intensity=1.45;
const sun=new B.DirectionalLight('sun',new B.Vector3(-.45,-1,.55),scene);sun.position=new B.Vector3(-14,27,-18);sun.intensity=1.8;
const shadows=new B.ShadowGenerator(1024,sun);shadows.useBlurExponentialShadowMap=true;shadows.blurKernel=24;shadows.setDarkness(.34);
const shadowCaster=mesh=>{if(mesh && mesh.getClassName && mesh.getClassName()==='Mesh')shadows.addShadowCaster(mesh);return mesh;};
const camera=new B.FreeCamera('camera',new B.Vector3(-5,6,-18),scene);camera.setTarget(new B.Vector3(1,2,0));camera.fov=.76;camera.minZ=.1;camera.maxZ=300;
function mat(name,hex,emissive=0){const m=new B.StandardMaterial(name,scene);m.diffuseColor=B.Color3.FromHexString(hex);m.specularColor=new B.Color3(.22,.22,.22);if(emissive)m.emissiveColor=m.diffuseColor.scale(emissive);return m;}
const m={grass:mat('mint grass','#57d477'),ground:mat('earth','#a77056'),stone:mat('warm stone','#f5d3aa'),wood:mat('bark','#85503e'),leaf:mat('leaf','#34b77d'),leaf2:mat('leaf turquoise','#32cbb7'),leaf3:mat('leaf lilac','#a87bdc'),gold:mat('gold','#ffda5b',.35),fox:mat('fox fur','#fa9246'),foxLight:mat('fox cream','#ffe3b6'),foxDark:mat('fox paws','#693b3d'),eyes:mat('eyes','#1b2947'),pink:mat('cheek','#f98c97'),enemy:mat('slime','#8b59d9'),enemyLight:mat('slime highlight','#bca0ff'),shot:mat('magic','#ff8af1',.85),portal:mat('portal','#74fff1',.75),mount:mat('mountains','#779cc7'),mount2:mat('mountains far','#a9bbdf'),cloud:mat('cloud','#fff9ef',.1),flower:mat('flower','#ff8cce'),flower2:mat('flower yellow','#ffdc79'),moss:mat('moss','#329a65'),rock:mat('rock','#94b2c3'),water:mat('water','#46bce3',.15),stem:mat('mushroom stem','#fff0d5'),cap:mat('mushroom cap','#f26672'),butterfly:mat('butterfly','#ffe79d',.25),sparkle:mat('sparkle','#ffffff',.8)};
function box(name,w,h,d,x,y,z,material,parent){const o=B.MeshBuilder.CreateBox(name,{width:w,height:h,depth:d},scene);o.position.set(x,y,z);o.material=material;if(parent)o.parent=parent;if(!name.includes('cloud')&&!name.includes('mountain')){o.receiveShadows=true;if(/character|torso|head|paw|arm|tail|slime|trunk|crown|portal/.test(name))shadowCaster(o);}return o;}
function sphere(name,diam,x,y,z,material,parent,segments=12){const o=B.MeshBuilder.CreateSphere(name,{diameter:diam,segments},scene);o.position.set(x,y,z);o.material=material;if(parent)o.parent=parent;if(!name.includes('cloud')&&!name.includes('mountain')){o.receiveShadows=true;if(/character|torso|head|paw|arm|tail|slime|trunk|crown|portal/.test(name))shadowCaster(o);}return o;}
function cyl(name,top,bottom,height,x,y,z,material,parent){const o=B.MeshBuilder.CreateCylinder(name,{diameterTop:top,diameterBottom:bottom,height,tessellation:10},scene);o.position.set(x,y,z);o.material=material;if(parent)o.parent=parent;if(!name.includes('cloud')&&!name.includes('mountain')){o.receiveShadows=true;if(/character|torso|head|paw|arm|tail|slime|trunk|crown|portal/.test(name))shadowCaster(o);}return o;}
function cone(name,diam,height,x,y,z,material,parent){return cyl(name,0,diam,height,x,y,z,material,parent);}
const world=new B.TransformNode('world',scene);
box('main island',55,2,8,17,-1.2,0,m.ground,world);box('lush grass',55,.32,8,17,-.08,0,m.grass,world);
// Floating jumping platforms with real collision heights.
const platforms=[{x:7,y:1.25,w:3.6},{x:14,y:2.3,w:3.8},{x:22,y:1.5,w:4},{x:31,y:2.4,w:4.2}];
for(const p of platforms){box('floating soil',p.w,.75,3.6,p.x,p.y-.5,0,m.ground,world);box('platform grass',p.w,.25,3.6,p.x,p.y-.06,0,m.grass,world);for(let k=-1;k<=1;k++)sphere('platform flower',.18,p.x+k*.9,p.y+.1,1.4,k===0?m.flower:m.flower2,world);}
// Decorative distant mountain silhouettes, forests and clouds.
for(let i=0;i<18;i++){const x=-25+i*7;const h=10+(i*17%9);cone('far mountain',10,h,x,h/2-2,28,i%2?m.mount:m.mount2,world);}
for(let i=0;i<28;i++){const x=-18+i*3.2;const z=7+(i%4)*1.5;const h=3+(i%5)*.6;cyl('tree trunk',.55,.8,h,x,h/2,z,m.wood,world);sphere('tree crown',2.9,x,h+.3,z,i%3===0?m.leaf3:i%3===1?m.leaf2:m.leaf,world);sphere('tree crown side',2.3,x-1,h-.2,z,i%3===0?m.leaf3:m.leaf,world);}
for(let i=0;i<12;i++){const x=-12+i*7;const y=12+i%3*2;for(let k=0;k<3;k++)sphere('fluffy cloud',2.6,x+k*1.4,y+(k%2)*.5,38,m.cloud,world);}
for(let i=0;i<75;i++){const x=-9+(i*19%510)/10;const z=-3.6+(i*13%70)/10;sphere('tiny blossom',.12,x,.15,z,i%3===0?m.flower:m.flower2,world);}
// Premium woodland set dressing: stones, mushrooms, ferns, fireflies and layered canopy.
for(let i=0;i<110;i++){
 const x=-8+(i*37%530)/10,z=-3.4+(i*19%70)/10;
 if(i%4===0){const r=sphere('smooth river pebble',.35+(i%3)*.13,x,.12,z,m.rock,world);r.scaling.set(1,.48,.78);}
 else if(i%4===1){const h=.25+(i%3)*.1;cyl('mushroom stalk',.1,.15,h,x,h/2,z,m.stem,world);const cap=sphere('mushroom top',.37,x,h+.04,z,m.cap,world);cap.scaling.y=.45;}
 else{for(let j=0;j<3;j++){const blade=cone('grass blade',.13,.48,x+(j-1)*.14,.28,z,m.moss,world);blade.rotation.z=(j-1)*.36;}}
}
const fireflies=[];
for(let i=0;i<36;i++){const x=-8+(i*31%530)/10,z=-2+(i*7%60)/10;const dot=sphere('floating forest firefly',.1,x,1.1+i%4*.6,z,m.sparkle,world);fireflies.push({dot,x,phase:i*.9});}
const glow=new B.GlowLayer('magical highlights',scene,{blurKernelSize:20});glow.intensity=.38;
// A model built from genuine 3D meshes (not a billboard or flat sprite).
const hero=new B.TransformNode('PLAYER CHARACTER',scene);
const heroBody=new B.TransformNode('character visual',scene);heroBody.parent=hero;
const bodyParts=[];let legs=[],arms=[],tailPart=null,ears=[];
function part(mesh){bodyParts.push(mesh);return mesh;}
const torso=part(sphere('soft character torso',1.18,0,.73,0,m.fox,heroBody));torso.scaling.set(.83,1.05,.65);
const belly=part(sphere('belly',.8,0,.65,-.4,m.foxLight,heroBody));belly.scaling.set(.9,1,.25);
const head=part(sphere('rounded character head',1.12,0,1.48,-.07,m.fox,heroBody));head.scaling.set(1.05,.9,.83);
const muzzle=part(sphere('muzzle',.73,0,1.24,-.52,m.foxLight,heroBody));muzzle.scaling.set(1.05,.55,.5);
const nose=part(sphere('nose',.19,0,1.35,-.76,m.eyes,heroBody));
for(const side of [-1,1]){
 const ear=part(cone('character ear',.55,.83,side*.38,2.12,-.03,m.fox,heroBody));ears.push(ear);
 part(cone('inner ear',.28,.49,side*.38,2.17,-.25,m.pink,heroBody));
 part(sphere('eye',.18,side*.25,1.59,-.65,m.eyes,heroBody));
 part(sphere('eye glint',.055,side*.25-.045,1.65,-.74,m.cloud,heroBody));
 part(sphere('cheek',.16,side*.43,1.27,-.52,m.pink,heroBody));
 const leg=part(sphere('animated paw',.34,side*.36,.19,-.04,m.foxDark,heroBody));legs.push(leg);
 const arm=part(sphere('animated arm',.32,side*.58,.75,-.06,m.fox,heroBody));arms.push(arm);
}
tailPart=part(sphere('animated tail',.93,.73,.76,.38,m.fox,heroBody));tailPart.scaling.set(1.2,.5,.55);tailPart.rotation.z=-.4;
const tailTip=part(sphere('tail tip',.4,1.14,.94,.4,m.foxLight,heroBody));
const characterSkins={fox:{main:'#fa9246',light:'#ffe3b6',dark:'#693b3d',ear:1,tail:1},rabbit:{main:'#e9e9ff',light:'#ffffff',dark:'#ac91ce',ear:1.7,tail:.5},panda:{main:'#f4f5f7',light:'#ffffff',dark:'#333747',ear:.48,tail:.4},cat:{main:'#edb36d',light:'#fff3d7',dark:'#a36a60',ear:.8,tail:1.2}};
let chosenCharacter='fox';
function chooseCharacter(type){
 chosenCharacter=type;const skin=characterSkins[type];
 const main=mat('skin '+type+' main',skin.main),light=mat('skin '+type+' light',skin.light),dark=mat('skin '+type+' dark',skin.dark);
 torso.material=head.material=main;muzzle.material=belly.material=tailTip.material=light;tailPart.material=main;
 arms.forEach(a=>a.material=main);legs.forEach(a=>a.material=dark);
 ears.forEach(e=>{e.material=type==='panda'?dark:main;e.scaling.y=skin.ear;e.position.y=type==='rabbit'?2.32:2.12;});
 tailPart.scaling.x=skin.tail;tailTip.position.x=.73+.41*skin.tail;
 document.querySelectorAll('[data-character]').forEach(b=>b.classList.toggle('selected',b.dataset.character===type));
 document.getElementById('selectedCharacter').textContent={fox:'Fox',rabbit:'Rabbit',panda:'Panda',cat:'Cat'}[type];
}
document.querySelectorAll('[data-character]').forEach(btn=>btn.addEventListener('click',()=>chooseCharacter(btn.dataset.character)));
chooseCharacter('fox');hero.position.set(-6,0,0);

const stars=[];const starLocations=[[-2,.95],[7,2.45],[14,3.5],[22,2.7],[31,3.6]];
for(const [i,[x,y]] of starLocations.entries()){const root=new B.TransformNode('star'+i,scene);root.position.set(x,y,-.2);const core=sphere('gold star orb',.45,0,0,0,m.gold,root);for(let k=0;k<5;k++){const a=k*Math.PI*2/5;const ray=cone('star ray',.25,.5,Math.sin(a)*.35,Math.cos(a)*.35,0,m.gold,root);ray.rotation.z=-a;}stars.push({root,got:false,base:y});}
const enemies=[];
for(const [i,x] of [4,18,27].entries()){const root=new B.TransformNode('shadow slime '+i,scene);root.position.set(x,0,0);sphere('slime body',1.05,0,.53,0,m.enemy,root).scaling.set(1,.8,.8);sphere('slime top',.64,0,1.02,0,m.enemyLight,root);for(const s of [-1,1])sphere('slime eye',.16,s*.24,.67,-.44,m.eyes,root);enemies.push({root,alive:true,hp:2,x,phase:i*2});}
const portal=new B.TransformNode('golden finish portal',scene);portal.position.set(41,0,0);for(let i=0;i<18;i++){const a=i*Math.PI*2/18;const x=Math.cos(a)*1.2,y=2+Math.sin(a)*2;const gem=sphere('portal rune',.35,x,y,0,i%3===0?m.gold:m.portal,portal);gem.scaling.set(.8,1.1,.8);}const portalCore=B.MeshBuilder.CreateDisc('portal glow',{radius:1.55,tessellation:48,sideOrientation:B.Mesh.DOUBLESIDE},scene);portalCore.parent=portal;portalCore.position.y=2;portalCore.material=m.portal;portalCore.visibility=.25;
const projectiles=[];const keys={left:false,right:false,jump:false,fire:false};let running=false,completed=false,lives=3,collected=0,kills=0,vy=0,grounded=true,invuln=0,fireCooldown=0,elapsed=0,toastUntil=0,lastCheckpoint=-6,face=1,prevJump=false,prevFire=false;
const particles=[];
function burst(x,y,z,color=m.shot,count=12){for(let i=0;i<count;i++){const mesh=sphere('impact spark',.12,x,y,z,color);const a=i*Math.PI*2/count;particles.push({mesh,vx:Math.cos(a)*(2+i%3),vy:Math.sin(a)*(2+i%4),ttl:.48});}}
const stats=document.getElementById('stats'),overlay=document.getElementById('overlay'),toast=document.getElementById('toast');
function notify(msg,seconds=1.6){toast.textContent=msg;toast.classList.add('show');toastUntil=elapsed+seconds;}
function refresh(){stats.textContent=`${'❤️'.repeat(lives)}${'🖤'.repeat(3-lives)}　⭐ ${collected}/5　🎯 ${kills}/3`;}
function start(){running=true;completed=false;lives=3;collected=0;kills=0;vy=0;grounded=true;invuln=0;fireCooldown=0;elapsed=0;lastCheckpoint=-6;hero.position.set(-6,0,0);hero.setEnabled(true);for(const s of stars){s.got=false;s.root.setEnabled(true);}for(const e of enemies){e.alive=true;e.hp=2;e.root.setEnabled(true);}for(const p of projectiles)p.mesh.dispose();projectiles.length=0;for(const p of particles)p.mesh.dispose();particles.length=0;overlay.classList.remove('show');refresh();notify('Collect stars and defeat slimes!');}
function end(win){running=false;completed=win;overlay.classList.add('show');overlay.querySelector('h1').innerHTML=win?'🏆 Adventure Complete!':'💔 Try Again!';overlay.querySelector('h2').textContent=win?'Amazing work, adventurer!':'The forest needs you!';overlay.querySelector('p').textContent=win?'You collected all stars and defeated the shadow slimes.':'Collect stars, jump on platforms and use magic to defeat enemies.';document.getElementById('start').textContent=win?'▶ PLAY AGAIN':'↻ RETRY';}
function damage(){if(invuln>0)return;lives--;invuln=1.5;burst(hero.position.x,hero.position.y+1,0,m.pink,18);notify('Ouch! Watch out!');refresh();if(lives<=0){end(false);return;}hero.position.set(lastCheckpoint,0,0);vy=0;}
function shoot(){burst(hero.position.x+face*.6,hero.position.y+1.1,-.1,m.shot,5);const mesh=sphere('real 3D magic projectile',.33,hero.position.x+face*.8,hero.position.y+1.05,-.1,m.shot);projectiles.push({mesh,dir:face,ttl:1.8});fireCooldown=.38;}
function surfaceAt(x,oldFeet,newFeet){let surface=0;for(const p of platforms){if(Math.abs(x-p.x)<p.w/2+.18 && oldFeet>=p.y-.15 && newFeet<=p.y+.16)surface=Math.max(surface,p.y);}return surface;}
function update(dt){elapsed+=dt;if(toastUntil<elapsed)toast.classList.remove('show');for(const f of fireflies){f.dot.position.y=1.2+Math.sin(elapsed*1.5+f.phase)*.35;f.dot.position.x=f.x+Math.cos(elapsed*.7+f.phase)*.3;}for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.ttl-=dt;p.mesh.position.x+=p.vx*dt;p.mesh.position.y+=p.vy*dt;p.vy-=7*dt;p.mesh.scaling.setAll(Math.max(.01,p.ttl/.48));if(p.ttl<=0){p.mesh.dispose();particles.splice(i,1);}}for(const s of stars){if(!s.got){s.root.rotation.y+=dt*2;s.root.position.y=s.base+Math.sin(elapsed*2+s.base)*.13;}}for(const e of enemies){if(e.alive){e.root.position.x=e.x+Math.sin(elapsed*1.25+e.phase)*1.05;e.root.position.y=Math.sin(elapsed*3+e.phase)*.09;}}portal.rotation.y=Math.sin(elapsed)*.12;
if(!running)return;
invuln=Math.max(0,invuln-dt);fireCooldown=Math.max(0,fireCooldown-dt);
const dx=((keys.right?1:0)-(keys.left?1:0));if(dx)face=Math.sign(dx);hero.position.x=B.Scalar.Clamp(hero.position.x+dx*5.8*dt,-8,43);
if(keys.jump&&!prevJump&&grounded){vy=10.4;grounded=false;notify('Super jump!',.5);}prevJump=keys.jump;
if(keys.fire&&!prevFire&&fireCooldown<=0)shoot();prevFire=keys.fire;
const oldY=hero.position.y;vy-=23*dt;let newY=oldY+vy*dt;const floor=surfaceAt(hero.position.x,oldY,newY);if(vy<=0&&newY<=floor){newY=floor;vy=0;grounded=true;}else grounded=false;hero.position.y=newY;
hero.rotation.y=B.Scalar.Lerp(hero.rotation.y,face===1?-.14:Math.PI+.14,Math.min(1,dt*10));hero.rotation.z=Math.sin(elapsed*11)*(grounded&&dx?.045:0);heroBody.position.y=grounded&&dx?Math.abs(Math.sin(elapsed*12))*.09:Math.sin(elapsed*2)*.025;for(let i=0;i<2;i++){legs[i].position.y=.19+(grounded&&dx?Math.max(0,Math.sin(elapsed*12+i*Math.PI))*.18:0);arms[i].rotation.z=(grounded&&dx?Math.sin(elapsed*12+i*Math.PI)*.45:Math.sin(elapsed*2+i)*.08);}tailPart.rotation.z=-.4+Math.sin(elapsed*5)*.19;head.rotation.z=Math.sin(elapsed*2.5)*.025;hero.scaling.setAll(invuln>0&&Math.floor(elapsed*12)%2===0?.94:1);
for(const s of stars){if(!s.got&&Math.abs(hero.position.x-s.root.position.x)<.8&&Math.abs(hero.position.y+1-s.root.position.y)<1){s.got=true;s.root.setEnabled(false);collected++;burst(s.root.position.x,s.root.position.y,0,m.gold,17);lastCheckpoint=hero.position.x;notify('⭐ Star collected!');refresh();}}
for(const p of projectiles){p.mesh.position.x+=p.dir*13*dt;p.ttl-=dt;for(const e of enemies){if(e.alive&&Math.abs(p.mesh.position.x-e.root.position.x)<.75&&Math.abs(p.mesh.position.y-(e.root.position.y+.6))<1){e.hp--;p.ttl=0;notify(e.hp<=0?'✨ Slime defeated!':'💥 Hit!');burst(e.root.position.x,e.root.position.y+.7,0,m.gold,20);if(e.hp<=0){e.alive=false;e.root.setEnabled(false);kills++;refresh();}break;}}}for(let i=projectiles.length-1;i>=0;i--){if(projectiles[i].ttl<=0){projectiles[i].mesh.dispose();projectiles.splice(i,1);}}
for(const e of enemies){if(e.alive&&Math.abs(hero.position.x-e.root.position.x)<.78&&hero.position.y<1.05)damage();}
if(hero.position.x>39.6){if(collected>=5&&kills>=3){end(true);}else if(Math.floor(elapsed*2)%3===0)notify(`Need ${5-collected} stars and ${3-kills} slimes!`,.9);hero.position.x=39.3;}
}
engine.runRenderLoop(()=>{const dt=Math.min(engine.getDeltaTime()/1000,.033);update(dt);const targetX=hero.position.x+2;camera.position.x=B.Scalar.Lerp(camera.position.x,targetX,Math.min(1,dt*3.5));camera.position.y=B.Scalar.Lerp(camera.position.y,Math.max(5.6,hero.position.y+5.3),Math.min(1,dt*3));camera.setTarget(new B.Vector3(hero.position.x+1.5,Math.max(1.8,hero.position.y+1.1),0));scene.render();});
window.addEventListener('resize',()=>engine.resize());
window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup',' '].includes(k))e.preventDefault();if(k==='a'||k==='arrowleft')keys.left=true;if(k==='d'||k==='arrowright')keys.right=true;if(k===' '||k==='arrowup'||k==='w')keys.jump=true;if(k==='x'||k==='j')keys.fire=true;});
window.addEventListener('keyup',e=>{const k=e.key.toLowerCase();if(k==='a'||k==='arrowleft')keys.left=false;if(k==='d'||k==='arrowright')keys.right=false;if(k===' '||k==='arrowup'||k==='w')keys.jump=false;if(k==='x'||k==='j')keys.fire=false;});
window.addEventListener('blur',()=>Object.keys(keys).forEach(k=>keys[k]=false));
for(const id of ['left','right','jump','fire']){const btn=document.getElementById(id);const release=e=>{e.preventDefault();keys[id]=false;};btn.addEventListener('pointerdown',e=>{e.preventDefault();btn.setPointerCapture(e.pointerId);keys[id]=true;});btn.addEventListener('pointerup',release);btn.addEventListener('pointercancel',release);btn.addEventListener('lostpointercapture',()=>keys[id]=false);}
document.getElementById('start').addEventListener('click',start);
document.getElementById('fullscreen').addEventListener('click',async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();}catch{notify('Fullscreen not supported');}});
let soundOn=true;document.getElementById('sound').addEventListener('click',()=>{soundOn=!soundOn;document.getElementById('sound').textContent=soundOn?'🔊 Sound':'🔇 Muted';});
refresh();
