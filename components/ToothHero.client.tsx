"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./tooth-hero.module.css";

export default function ToothHero({ label }: { label: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const current = host.current;
    if (!current) return;
    const element = current;
    let disposed = false;
    let teardown = () => {};
    let started = false;

    async function start() {
      if (started) return;
      started = true;
      try {
        const [T, { GLTFLoader }, { RoomEnvironment }] = await Promise.all([
          import("three"),
          import("three/addons/loaders/GLTFLoader.js"),
          import("three/addons/environments/RoomEnvironment.js"),
        ]);
        if (disposed) return;
        const mobile = matchMedia("(max-width: 899px)").matches;
        const motion = matchMedia("(prefers-reduced-motion: reduce)");
        const renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 1.75));
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = .78;
        element.appendChild(renderer.domElement);
        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(32, 1, .1, 30);
        camera.position.set(0, .1, 6);
        const environment = new RoomEnvironment();
        const generator = new T.PMREMGenerator(renderer);
        const environmentTarget = generator.fromScene(environment, .04);
        scene.environment = environmentTarget.texture;
        environment.dispose();
        generator.dispose();
        scene.add(new T.HemisphereLight(0xffffff, 0xa89c87, .45));
        const key = new T.DirectionalLight(0xfff5e7, 2.2);
        key.position.set(-3, 4, 5);
        scene.add(key);
        const rim = new T.DirectionalLight(0xd7edf5, 1.4);
        rim.position.set(4, 1, -2);
        scene.add(rim);

        const material = new T.MeshPhysicalMaterial({
          color: 0xf2eada, roughness: .28, metalness: 0,
          clearcoat: .7, clearcoatRoughness: .23,
          transmission: 0, ior: 1.5, envMapIntensity: .75, vertexColors: true,
        });
        teardown = () => {
          material.dispose(); environmentTarget.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
        };
        const gltf = await new GLTFLoader().loadAsync("/models/molar.glb");
        if (disposed) {
          gltf.scene.traverse(object => { if (object instanceof T.Mesh) object.geometry.dispose(); });
          material.dispose(); environmentTarget.dispose(); renderer.dispose(); renderer.domElement.remove();
          return;
        }
        const tooth = new T.Group();
        tooth.add(gltf.scene);
        gltf.scene.traverse(object => {
          if (object instanceof T.Mesh) {
            const original = object.material;
            for (const m of Array.isArray(original) ? original : [original]) m.dispose();
            const position = object.geometry.getAttribute("position");
            const colors = new Float32Array(position.count * 3);
            const crown = new T.Color(0xfffcf4), root = new T.Color(0xe3d6bf);
            for (let i=0; i<position.count; i++) {
              const blend = T.MathUtils.smoothstep(position.getY(i), -.7, .5);
              const color = root.clone().lerp(crown, blend);
              colors.set([color.r,color.g,color.b],i*3);
            }
            object.geometry.setAttribute("color",new T.BufferAttribute(colors,3));
            object.material = material;
          }
        });
        tooth.rotation.set(.3, -.55, -.16);
        tooth.position.set(0, .1, 0);
        scene.add(tooth);
        const pedestalMaterial = new T.MeshStandardMaterial({ color: 0xe5dfd3, roughness: .45, metalness: .12 });
        const pedestal = new T.Mesh(new T.CylinderGeometry(1.35,1.38,.14,64),pedestalMaterial);
        pedestal.position.y=-1.65;
        scene.add(pedestal);
        const trimMaterial = new T.MeshStandardMaterial({ color: 0xb19b74, roughness: .36, metalness: .7 });
        const trim = new T.Mesh(new T.TorusGeometry(1.35,.009,6,64),trimMaterial);
        trim.rotation.x=Math.PI/2; trim.position.y=-1.575; scene.add(trim);
        let visible = true, frame = 0, last = 0, elapsed = 0;
        let pointerX = 0, pointerY = 0;
        const render = () => renderer.render(scene, camera);
        const resize = () => {
          const width=element.clientWidth, height=element.clientHeight;
          renderer.setSize(width,height,false);
          camera.aspect=width/height;
          camera.position.z=camera.aspect < .8 ? 7.5 : 6.9;
          camera.position.y=.45; camera.lookAt(0,-.08,0);
          camera.updateProjectionMatrix();
          render();
        };
        const tick = (time: number) => {
          if (disposed || !visible || document.hidden || motion.matches) { frame=0; return; }
          frame=requestAnimationFrame(tick);
          if (time-last < (mobile ? 1000/30 : 1000/45)) return;
          elapsed += Math.min((time-last)/1000, .06);
          last=time;
          tooth.rotation.y=-.55+Math.sin(elapsed*.24)*.65;
          tooth.rotation.x=.3+Math.sin(elapsed*.4)*.04+pointerY;
          tooth.rotation.z=-.16+Math.sin(elapsed*.3)*.025+pointerX;
          tooth.position.y=.1+Math.sin(elapsed*.6)*.045;
          render();
        };
        const resume = () => {
          if (!visible || document.hidden || motion.matches) {
            cancelAnimationFrame(frame); frame=0; render();
          } else if (!frame) { last=performance.now(); frame=requestAnimationFrame(tick); }
        };
        const move = (event: PointerEvent) => {
          if (mobile || motion.matches) return;
          const r=element.getBoundingClientRect();
          pointerX=((event.clientX-r.left)/r.width-.5)*.06;
          pointerY=((event.clientY-r.top)/r.height-.5)*.06;
        };
        const resetPointer = () => { pointerX=0; pointerY=0; };
        const lost = (event: Event) => { event.preventDefault(); cancelAnimationFrame(frame); frame=0; setReady(false); };
        const restored = () => { resize(); setReady(true); resume(); };
        const resizeObserver=new ResizeObserver(resize);
        resizeObserver.observe(element);
        const visibilityObserver=new IntersectionObserver(([entry]) => { visible=entry.isIntersecting; resume(); });
        visibilityObserver.observe(element);
        document.addEventListener("visibilitychange",resume);
        motion.addEventListener("change",resume);
        element.addEventListener("pointermove",move);
        element.addEventListener("pointerleave",resetPointer);
        renderer.domElement.addEventListener("webglcontextlost",lost);
        renderer.domElement.addEventListener("webglcontextrestored",restored);
        resize(); resume(); setReady(true);
        teardown = () => {
          cancelAnimationFrame(frame);
          resizeObserver.disconnect(); visibilityObserver.disconnect();
          document.removeEventListener("visibilitychange",resume); motion.removeEventListener("change",resume);
          element.removeEventListener("pointermove",move); element.removeEventListener("pointerleave",resetPointer);
          renderer.domElement.removeEventListener("webglcontextlost",lost); renderer.domElement.removeEventListener("webglcontextrestored",restored);
          gltf.scene.traverse(object => { if (object instanceof T.Mesh) object.geometry.dispose(); });
          pedestal.geometry.dispose(); trim.geometry.dispose(); pedestalMaterial.dispose(); trimMaterial.dispose();
          material.dispose(); environmentTarget.dispose();
          renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
        };
      } catch {
        teardown();
        // The vector fallback remains visible when WebGL is unavailable.
      }
    }
    const lazyObserver=new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { void start(); lazyObserver.disconnect(); } }, { rootMargin: "200px" });
    lazyObserver.observe(element);
    return () => { disposed=true; lazyObserver.disconnect(); teardown(); };
  }, []);

  return <div className={styles.stage} role="img" aria-label={label}>
    <div className={styles.halo} />
    <div className={styles.shadow} />
    <svg className={styles.fallback} data-hidden={ready} viewBox="0 0 300 340" aria-hidden="true">
      <defs><linearGradient id="tooth-enamel" x1="0" x2="1" y2=".6"><stop stopColor="#d4cebd"/><stop offset=".4" stopColor="#fffef8"/><stop offset=".7" stopColor="#eeeee8"/><stop offset="1" stopColor="#b9c9ce"/></linearGradient></defs>
      <path d="M72 50 C90 23 121 39 148 45 C180 28 216 27 231 61 C251 99 225 134 211 164 C200 193 202 272 182 294 C163 306 164 230 148 211 C133 202 125 276 107 288 C87 297 92 225 83 186 C76 151 44 95 72 50Z" fill="url(#tooth-enamel)" stroke="#fff" strokeWidth="2"/>
      <path d="M99 58 Q129 79 151 64 Q178 46 209 62" fill="none" stroke="#b4ad9b" strokeOpacity=".35" strokeWidth="3"/>
    </svg>
    <div className={styles.canvas} ref={host} data-ready={ready} aria-hidden="true" />
  </div>;
}
