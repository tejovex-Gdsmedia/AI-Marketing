import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const topoFieldSource = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NexusNode</title>
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
</head>
<body class="bg-black text-white font-sans min-h-screen relative overflow-x-hidden selection:bg-white/20 selection:text-white font-light" style="background-color:#000;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;">
<div class="fixed inset-0 z-0 pointer-events-none">
<canvas id="topo-canvas" class="w-full h-full"></canvas>
<div class="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black z-10"></div>
<div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-90 z-10"></div>
</div>
<main class="relative z-20 flex flex-col min-h-screen">
<header class="container mx-auto px-6 py-6 flex items-center justify-between reveal opacity-0 translate-y-4 transition-all duration-1000 ease-out">
<div class="flex items-center gap-2 text-white hover:text-neutral-300 transition-colors cursor-pointer">
<iconify-icon icon="solar:radar-linear" width="24"></iconify-icon>
<span class="font-light text-sm tracking-tight">NexusNode</span>
</div>
</header>
<section class="flex-grow flex flex-col items-center justify-center text-center px-6 py-24 md:py-32">
<div class="max-w-4xl mx-auto flex flex-col items-center">
<div class="reveal opacity-0 translate-y-4 transition-all duration-1000 ease-out inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
<span class="flex h-2 w-2 relative"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span></span>
<span class="text-xs font-extralight text-neutral-300 tracking-wide uppercase">Nexus OS v4.2 deployment ready</span>
</div>
<h1 class="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[1.1]">
<span>Orchestrate the neural compute fabric.</span>
</h1>
</div>
</section>
</main>
<script>
setTimeout(()=>{document.querySelectorAll('.reveal').forEach(el=>el.classList.remove('opacity-0','translate-y-4'))},100);
gsap.registerPlugin(ScrollTrigger);
document.querySelectorAll('.mask-container').forEach(container=>{
const words=container.querySelectorAll('.mask-word');
gsap.to(words,{scrollTrigger:{trigger:container,start:"top 95%"},y:"0%",opacity:1,duration:1.1,stagger:0.05,ease:"power4.out",delay:0.1});
});
const canvas=document.getElementById('topo-canvas');
const gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false});
if(gl){
const vsSource=`attribute vec2 a_position; void main(){gl_Position=vec4(a_position,0.0,1.0);}`;
const fsSource=`precision highp float; uniform vec2 u_resolution; uniform float u_time; uniform float u_dpr; vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);} float snoise(vec2 v){ const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439); vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx); vec2 i1; i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0); vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod(i,289.0); vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0)); vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m; m=m*m; vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox; m*=1.79284291400159-0.85373472095314*(a0*a0+h*h); vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw; return 130.0*dot(m,g); } void main(){ vec2 st=gl_FragCoord.xy/u_resolution.xy; st.x*=u_resolution.x/u_resolution.y; float gridSize=48.0*u_dpr; vec2 gridSt=gl_FragCoord.xy/gridSize; vec2 gridFract=fract(gridSt); float lineThickness=1.0/gridSize; float gridLines=step(1.0-lineThickness,gridFract.x)+step(1.0-lineThickness,gridFract.y); gridLines=clamp(gridLines,0.0,1.0)*0.12; float noiseScale=1.4; vec2 noisePos=st*noiseScale+vec2(u_time*0.015,u_time*0.025); float n=snoise(noisePos)*0.5+0.5; float numBands=10.0; float bandVal=n*numBands; float triangleWave=abs(fract(bandVal)-0.5)*2.0; float topoLines=smoothstep(0.02,0.00,triangleWave)*0.45; vec3 color=vec3(0.0); color+=vec3(1.0)*gridLines; color+=vec3(1.0)*topoLines; gl_FragColor=vec4(color,1.0); }`;
function createShader(gl,type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);return shader;}
const vertexShader=createShader(gl,gl.VERTEX_SHADER,vsSource);
const fragmentShader=createShader(gl,gl.FRAGMENT_SHADER,fsSource);
const program=gl.createProgram();
gl.attachShader(program,vertexShader);
gl.attachShader(program,fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);
const positionBuffer=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
const positionLocation=gl.getAttribLocation(program,"a_position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation,2,gl.FLOAT,false,0,0);
const resolutionLocation=gl.getUniformLocation(program,"u_resolution");
const timeLocation=gl.getUniformLocation(program,"u_time");
const dprLocation=gl.getUniformLocation(program,"u_dpr");
function resizeCanvas(){const dpr=window.devicePixelRatio||1;canvas.width=window.innerWidth*dpr;canvas.height=window.innerHeight*dpr;gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(resolutionLocation,canvas.width,canvas.height);gl.uniform1f(dprLocation,dpr);}
window.addEventListener('resize',resizeCanvas);
resizeCanvas();
let startTime=performance.now();
function render(time){gl.uniform1f(timeLocation,(time-startTime)*0.001);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);requestAnimationFrame(render);}
requestAnimationFrame(render);
}
</script>
</body>
</html>`;

type TopoFieldMode = "dark" | "light";

export type TopoFieldProps = {
  mode?: TopoFieldMode | "auto";
  speed?: number;
  length?: number;
  density?: number;
  opacity?: number;
  hue?: number;
  saturation?: number;
  brightness?: number;
  className?: string;
  style?: CSSProperties;
};

const LIGHT_PAPER = "#eef1f6";

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function buildFocusedDocument(knobs: { mode: TopoFieldMode; length: number; density: number }) {
  const background = knobs.mode === "light" ? LIGHT_PAPER : "#000000";
  const patched = topoFieldSource;
  return patched;
}

export default function TopoField({
  mode = "dark",
  speed = 1,
  length = 1,
  density = 1,
  opacity = 1,
  hue = 0,
  saturation = 1,
  brightness = 1,
  className,
  style,
}: TopoFieldProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const safeSpeed = clamp(speed, 0, 3);
  const safeLength = clamp(length, 0.35, 2.5);
  const safeDensity = clamp(density, 0.25, 2.5);
  const safeOpacity = clamp(opacity, 0.05, 1);
  const safeHue = clamp(hue, -180, 180);
  const safeSaturation = clamp(saturation, 0, 2);
  const safeBrightness = clamp(brightness, 0.35, 1.65);

  const source = useMemo(
    () => buildFocusedDocument({ mode: mode === "light" ? "light" : "dark", length: safeLength, density: safeDensity }),
    [mode, safeLength, safeDensity],
  );

  useEffect(() => {
    const frame = iframeRef.current?.contentWindow;
    if (!frame) return;
    frame.postMessage(
      { type: "threeui-controls", controls: { speed: safeSpeed, opacity: safeOpacity } },
      "*",
    );
  }, [safeSpeed, safeOpacity, source]);

  const filter =
    safeHue === 0 && safeSaturation === 1 && safeBrightness === 1
      ? undefined
      : `hue-rotate(${safeHue}deg) saturate(${safeSaturation}) brightness(${safeBrightness})`;

  return (
    <iframe
      ref={iframeRef}
      className={className}
      title="Topo Field"
      srcDoc={source}
      sandbox="allow-scripts"
      loading="eager"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        border: 0,
        background: mode === "light" ? LIGHT_PAPER : "#000",
        filter,
        ...style,
      }}
    />
  );
}
