/*
Aurora background
Source: React Bits — https://github.com/DavidHDev/react-bits
Copyright (c) 2026 David Haz
License: MIT + Commons Clause License Condition v1.0

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, and distribute the Software as part of
an application, website, or product, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

Commons Clause Restriction
You may use this Software, including for any commercial purpose, so long as you
do not sell, sublicense, or redistribute the components themselves — whether
alone, in a bundle, or as a ported version.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

This file is adapted for Fitnet (pause, drawing-buffer resolution, DPR cap,
ResizeObserver, context-loss fallback). OGL is used under the Unlicense.
Full notices: /licenses/react-bits-LICENSE.md and /licenses/ogl-UNLICENSE.txt
*/
'use client';

import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';

import './Aurora.css';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uLightMode;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ),
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  vec3 auroraColor = intensity * rampColor;

  if (uLightMode > 0.5) {
    float energy = clamp(max(intensity, 0.0), 0.0, 1.0);
    float coverage = clamp(auroraAlpha * (0.55 + 0.45 * energy), 0.0, 0.86);
    vec3 chroma = pow(clamp(rampColor, 0.0, 1.0), vec3(1.2));
    float chromaPeak = max(chroma.r, max(chroma.g, chroma.b));
    chroma /= max(chromaPeak, 0.0001);
    fragColor = vec4(mix(vec3(1.0), chroma, min(coverage * 1.08, 0.94)), 1.0);
  } else {
    fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
  }
}
`;

function cappedDpr() {
  const raw = window.devicePixelRatio || 1;
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  return Math.min(raw, mobile ? 1.25 : 1.5);
}

function stopsToVecs(stops) {
  return stops.map((hex) => {
    const c = new Color(hex);
    return [c.r, c.g, c.b];
  });
}

export default function Aurora(props) {
  const { colorStops = ['#5227FF', '#7cff67', '#5227FF'], amplitude = 1.0, blend = 0.5, lightMode = false } = props;
  const propsRef = useRef(props);
  const ctnDom = useRef(null);

  useEffect(() => {
    propsRef.current = props;
  });

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      dpr: cappedDpr(),
      webgl: 2,
    });
    const gl = renderer.gl;
    if (!renderer.isWebgl2 || !gl) {
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
      return;
    }

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = 'transparent';
    gl.canvas.setAttribute('aria-hidden', 'true');

    let alive = true;
    let running = true;
    let animateId = 0;
    let elapsed = 0;
    let lastStamp = 0;
    let stopKey = '';
    let cachedStops = stopsToVecs(colorStops);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: cachedStops },
        uResolution: { value: [1, 1] },
        uBlend: { value: blend },
        uLightMode: { value: lightMode ? 1 : 0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    function resize() {
      if (!alive || !ctn) return;
      const width = ctn.clientWidth;
      const height = ctn.clientHeight;
      if (width < 1 || height < 1) return;
      renderer.dpr = cappedDpr();
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
    }

    const observer = new ResizeObserver(resize);
    observer.observe(ctn);

    const frame = (t) => {
      if (!alive) return;
      animateId = requestAnimationFrame(frame);
      if (!running) {
        lastStamp = 0;
        return;
      }
      if (!lastStamp) lastStamp = t;
      const dt = Math.min(32, t - lastStamp);
      lastStamp = t;
      elapsed += dt;

      const current = propsRef.current;
      const speed = current.speed ?? 1;
      program.uniforms.uTime.value = elapsed * 0.01 * speed * 0.1;
      program.uniforms.uAmplitude.value = current.amplitude ?? 1;
      program.uniforms.uBlend.value = current.blend ?? blend;
      program.uniforms.uLightMode.value = current.lightMode ? 1 : 0;
      const stops = current.colorStops ?? colorStops;
      const key = stops.join('|');
      if (key !== stopKey) {
        stopKey = key;
        cachedStops = stopsToVecs(stops);
      }
      program.uniforms.uColorStops.value = cachedStops;
      renderer.render({ scene: mesh });
    };

    function setRunning(next) {
      running = next;
      if (next) lastStamp = 0;
    }

    function onVisibility() {
      setRunning(document.visibilityState === 'visible' && onScreen);
    }

    let onScreen = true;
    const intersection = new IntersectionObserver((entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting);
      setRunning(onScreen && document.visibilityState === 'visible');
    });
    intersection.observe(ctn);

    function onContextLost(event) {
      event.preventDefault();
      alive = false;
      cancelAnimationFrame(animateId);
      gl.canvas.remove();
    }

    gl.canvas.addEventListener('webglcontextlost', onContextLost);
    document.addEventListener('visibilitychange', onVisibility);
    resize();
    animateId = requestAnimationFrame(frame);

    return () => {
      alive = false;
      cancelAnimationFrame(animateId);
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      gl.canvas.removeEventListener('webglcontextlost', onContextLost);
      if (gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amplitude, blend, lightMode]);

  return <div ref={ctnDom} className="aurora-container" />;
}
