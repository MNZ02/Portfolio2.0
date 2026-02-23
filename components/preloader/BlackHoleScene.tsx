'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import React, { memo, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

export type SceneQuality = 'low' | 'medium' | 'high';

type BlackHoleSceneProps = {
    quality: SceneQuality;
    collapseRef: React.MutableRefObject<number>;
    interactive: boolean;
    onPerformanceDip?: () => void;
};

type ScenePreset = {
    dpr: [number, number];
    diskLayers: number;
    diskSegments: number;
    swirlParticles: number;
    infallParticles: number;
    starParticles: number;
    ringSegments: number;
    singularitySegments: number;
    antialias: boolean;
    precision: 'highp' | 'mediump';
};

const QUALITY_PRESETS: Record<SceneQuality, ScenePreset> = {
    low: {
        dpr: [0.7, 1.05],
        diskLayers: 3,
        diskSegments: 96,
        swirlParticles: 330,
        infallParticles: 92,
        starParticles: 300,
        ringSegments: 160,
        singularitySegments: 48,
        antialias: false,
        precision: 'mediump',
    },
    medium: {
        dpr: [0.85, 1.4],
        diskLayers: 5,
        diskSegments: 132,
        swirlParticles: 620,
        infallParticles: 164,
        starParticles: 620,
        ringSegments: 212,
        singularitySegments: 64,
        antialias: true,
        precision: 'highp',
    },
    high: {
        dpr: [1, 1.85],
        diskLayers: 7,
        diskSegments: 168,
        swirlParticles: 920,
        infallParticles: 224,
        starParticles: 960,
        ringSegments: 256,
        singularitySegments: 80,
        antialias: true,
        precision: 'highp',
    },
};

const clampFrameDelta = (delta: number) => Math.min(delta, 1 / 28);

const DISK_VERTEX_SHADER = `
varying vec2 vUv;
uniform float uTime;
uniform float uLayer;
uniform float uCollapse;

void main() {
    vUv = uv;

    vec3 transformed = position;
    float sink = pow(clamp(uCollapse, 0.0, 1.0), 1.6);

    float ripple = sin((position.x + position.z) * 0.45 + uTime * (1.1 + uLayer)) * 0.018;
    float shear = sin(position.x * 0.18 + uTime * 0.9 + uLayer * 7.0) * 0.012;

    transformed.y += (ripple + shear) * (1.0 - sink);
    transformed.xz *= 1.0 - sink * 0.82;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const DISK_FRAGMENT_SHADER = `
varying vec2 vUv;
uniform float uTime;
uniform float uLayer;
uniform float uCollapse;

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float radius = length(uv);
    float theta = atan(uv.y, uv.x);

    float inner = 0.26;
    float outer = 1.06;

    float innerEdge = smoothstep(inner, inner + 0.13, radius);
    float outerEdge = 1.0 - smoothstep(outer - 0.24, outer, radius);
    float diskMask = innerEdge * outerEdge;

    float sink = pow(clamp(uCollapse, 0.0, 1.0), 1.9);

    float spiralA = sin(theta * 9.0 - uTime * 2.0 + radius * 24.0 + uLayer * 8.0) * 0.5 + 0.5;
    float spiralB = sin(theta * 17.0 + uTime * 2.6 - radius * 32.0 - uLayer * 6.0) * 0.5 + 0.5;
    float ribbons = mix(spiralA, spiralB, 0.46);

    float shear = sin(theta * 4.0 - uTime * 0.75 + radius * 12.0) * 0.5 + 0.5;
    float radialBoost = smoothstep(0.35, 0.92, radius) * (1.0 - smoothstep(0.86, 1.05, radius));
    float luminance = smoothstep(0.18, 1.0, mix(ribbons, shear, 0.24) + radialBoost * 0.35);

    vec3 deepBlue = vec3(0.02, 0.05, 0.14);
    vec3 violet = vec3(0.34, 0.24, 0.86);
    vec3 cyan = vec3(0.17, 0.84, 0.98);
    vec3 white = vec3(0.8, 0.9, 1.0);

    vec3 chroma = mix(violet, cyan, clamp(ribbons * 0.78 + shear * 0.22, 0.0, 1.0));
    vec3 color = mix(deepBlue, chroma, diskMask);
    color += white * pow(luminance, 1.8) * diskMask * (0.45 + uLayer * 0.35);

    float alpha = diskMask * (0.16 + luminance * 0.56 + radialBoost * 0.12 + uLayer * 0.14) * (1.0 - sink);
    alpha *= 1.0 - smoothstep(0.98, 1.08, radius) * 0.55;

    gl_FragColor = vec4(color, alpha);
}
`;

const SWIRL_VERTEX_SHADER = `
attribute float aRadius;
attribute float aAngle;
attribute float aHeight;
attribute float aSpeed;
attribute float aSize;
attribute float aHueMix;

uniform float uTime;
uniform float uCollapse;

varying float vAlpha;
varying float vHueMix;

void main() {
    float sink = pow(clamp(uCollapse, 0.0, 1.0), 1.5);
    float angle = aAngle + uTime * aSpeed;
    float radius = max(0.05, aRadius * (1.0 - sink * 0.93));

    float wave = sin(angle * 2.2 + uTime * 0.58) * 0.048;
    float vertical = (aHeight + wave) * (1.0 - sink);

    vec3 transformed = vec3(cos(angle) * radius, vertical, sin(angle) * radius);

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depthScale = clamp(1.42 / -mvPosition.z, 0.0, 2.5);
    gl_PointSize = (1.1 + aSize * 2.8) * depthScale;

    vAlpha = (1.0 - sink) * clamp(depthScale, 0.22, 1.0);
    vHueMix = aHueMix;
}
`;

const SWIRL_FRAGMENT_SHADER = `
varying float vAlpha;
varying float vHueMix;

void main() {
    vec2 centered = gl_PointCoord - vec2(0.5);
    float dist = length(centered);
    float glow = smoothstep(0.54, 0.0, dist);

    vec3 cyan = vec3(0.18, 0.9, 1.0);
    vec3 violet = vec3(0.47, 0.35, 0.94);
    vec3 white = vec3(0.82, 0.92, 1.0);

    vec3 blend = mix(violet, cyan, vHueMix);
    vec3 color = mix(blend, white, glow * 0.45);

    gl_FragColor = vec4(color, glow * vAlpha * 0.62);
}
`;

const INFALL_VERTEX_SHADER = `
attribute float aRadius;
attribute float aAngle;
attribute float aPhase;
attribute float aSpeed;
attribute float aSize;
attribute float aHeight;

uniform float uTime;
uniform float uCollapse;

varying float vAlpha;

void main() {
    float sink = pow(clamp(uCollapse, 0.0, 1.0), 1.65);
    float cycle = fract(aPhase + uTime * aSpeed);
    float inward = smoothstep(0.0, 1.0, cycle);

    float radius = mix(aRadius, 0.13, inward) * (1.0 - sink * 0.95);
    float angle = aAngle + inward * 8.4 + uTime * 0.29;
    float height = aHeight * (1.0 - inward) * (1.0 - sink);

    vec3 transformed = vec3(cos(angle) * radius, height, sin(angle) * radius);

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depthScale = clamp(1.52 / -mvPosition.z, 0.0, 2.8);
    gl_PointSize = (1.15 + aSize * 2.55) * depthScale;

    vAlpha = (1.0 - inward) * (1.0 - sink) * clamp(depthScale, 0.2, 1.0);
}
`;

const INFALL_FRAGMENT_SHADER = `
varying float vAlpha;

void main() {
    vec2 centered = gl_PointCoord - vec2(0.5);
    float dist = length(centered);

    float core = smoothstep(0.56, 0.0, dist);
    float tail = smoothstep(0.3, -0.28, centered.x);
    float streak = core * mix(0.65, 1.0, tail);

    vec3 color = mix(vec3(0.3, 0.74, 0.98), vec3(0.82, 0.92, 1.0), streak * 0.82);
    gl_FragColor = vec4(color, streak * vAlpha * 0.66);
}
`;

const LENS_VERTEX_SHADER = `
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
uniform float uCollapse;

void main() {
    vec3 transformed = position * (1.0 - uCollapse * 0.16);
    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);

    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const LENS_FRAGMENT_SHADER = `
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
uniform float uCollapse;
uniform float uTime;

void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(normalize(vWorldNormal), viewDir), 0.0), 2.8);
    float halo = smoothstep(0.08, 1.0, fresnel);
    float pulse = 0.88 + sin(uTime * 1.6) * 0.12;

    vec3 deep = vec3(0.05, 0.13, 0.34);
    vec3 bright = vec3(0.74, 0.9, 1.0);
    vec3 color = mix(deep, bright, halo);

    float alpha = halo * (0.11 + fresnel * 0.62) * pulse * (1.0 - uCollapse * 0.9);
    gl_FragColor = vec4(color, alpha);
}
`;

const PHOTON_RING_VERTEX_SHADER = `
varying vec2 vUv;
uniform float uTime;
uniform float uCollapse;

void main() {
    vUv = uv;

    float sink = pow(clamp(uCollapse, 0.0, 1.0), 1.75);
    vec3 transformed = position;

    float pulse = sin(uv.x * 6.28318 * 3.0 - uTime * 2.0) * 0.018;
    transformed += normal * pulse * (1.0 - sink);
    transformed *= 1.0 - sink * 0.24;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const PHOTON_RING_FRAGMENT_SHADER = `
varying vec2 vUv;
uniform float uTime;
uniform float uCollapse;

void main() {
    float x = vUv.x * 6.28318;
    float y = abs(vUv.y - 0.5) * 2.0;

    float core = exp(-pow(y * 8.5, 2.0));
    float flare = pow(max(0.0, sin(x * 2.0 - uTime * 2.4) * 0.5 + 0.5), 6.0);
    float shimmer = sin(x * 14.0 + uTime * 5.0) * 0.5 + 0.5;

    float energy = core * (0.52 + flare * 0.85 + shimmer * 0.28);

    vec3 cyan = vec3(0.22, 0.9, 1.0);
    vec3 violet = vec3(0.48, 0.36, 0.95);
    vec3 white = vec3(0.84, 0.93, 1.0);

    vec3 color = mix(violet, cyan, 0.55 + sin(x - uTime * 0.35) * 0.18);
    color = mix(color, white, pow(energy, 1.3) * 0.72);

    float alpha = energy * (1.0 - uCollapse * 0.94);
    gl_FragColor = vec4(color, alpha);
}
`;

const SINGULARITY_RIM_VERTEX_SHADER = `
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
uniform float uCollapse;

void main() {
    vec3 transformed = position * (1.0 - uCollapse * 0.08);
    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);

    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const SINGULARITY_RIM_FRAGMENT_SHADER = `
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
uniform float uCollapse;

void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(normalize(vWorldNormal), viewDir), 0.0), 5.2);

    vec3 edgeA = vec3(0.22, 0.3, 0.72);
    vec3 edgeB = vec3(0.76, 0.93, 1.0);
    vec3 color = mix(edgeA, edgeB, fresnel);

    float alpha = fresnel * 0.24 * (1.0 - uCollapse * 0.84);
    gl_FragColor = vec4(color, alpha);
}
`;

const BLOOM_SHELL_FRAGMENT_SHADER = `
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
uniform float uCollapse;
uniform float uTime;

void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(normalize(vWorldNormal), viewDir), 0.0), 1.7);
    float breathing = 0.9 + sin(uTime * 0.9) * 0.1;

    vec3 deep = vec3(0.06, 0.14, 0.35);
    vec3 glow = vec3(0.47, 0.82, 1.0);
    vec3 color = mix(deep, glow, fresnel);

    float alpha = fresnel * 0.14 * breathing * (1.0 - uCollapse * 0.9);
    gl_FragColor = vec4(color, alpha);
}
`;

const StarField = memo(({ count }: { count: number }) => {
    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i += 1) {
            const i3 = i * 3;
            const radius = THREE.MathUtils.randFloat(8.3, 26);
            const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
            const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.cos(phi) * 0.7;
            positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

            const tint = THREE.MathUtils.randFloat(0.65, 1);
            colors[i3] = 0.42 * tint;
            colors[i3 + 1] = 0.72 * tint;
            colors[i3 + 2] = 1.0 * tint;
        }

        const buffer = new THREE.BufferGeometry();
        buffer.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        buffer.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return buffer;
    }, [count]);

    useEffect(
        () => () => {
            geometry.dispose();
        },
        [geometry],
    );

    return (
        <points geometry={geometry} frustumCulled={false}>
            <pointsMaterial
                size={0.028}
                sizeAttenuation
                transparent
                opacity={0.55}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                vertexColors
            />
        </points>
    );
});

StarField.displayName = 'StarField';

const SwirlParticles = memo(
    ({ count, collapseRef }: { count: number; collapseRef: React.MutableRefObject<number> }) => {
        const materialRef = useRef<THREE.ShaderMaterial | null>(null);

        const geometry = useMemo(() => {
            const position = new Float32Array(count * 3);
            const radius = new Float32Array(count);
            const angle = new Float32Array(count);
            const height = new Float32Array(count);
            const speed = new Float32Array(count);
            const size = new Float32Array(count);
            const hueMix = new Float32Array(count);

            for (let i = 0; i < count; i += 1) {
                radius[i] = THREE.MathUtils.randFloat(1.7, 8.7) * Math.pow(Math.random(), 0.35);
                angle[i] = THREE.MathUtils.randFloat(0, Math.PI * 2);
                height[i] = THREE.MathUtils.randFloatSpread(0.6) * Math.pow(radius[i] / 8.7, 0.72);
                speed[i] = THREE.MathUtils.randFloat(0.66, 2.2) / (0.5 + radius[i] * 0.24);
                size[i] = THREE.MathUtils.randFloat(0.44, 1.55);
                hueMix[i] = THREE.MathUtils.randFloat(0.1, 0.95);
            }

            const buffer = new THREE.BufferGeometry();
            buffer.setAttribute('position', new THREE.BufferAttribute(position, 3));
            buffer.setAttribute('aRadius', new THREE.BufferAttribute(radius, 1));
            buffer.setAttribute('aAngle', new THREE.BufferAttribute(angle, 1));
            buffer.setAttribute('aHeight', new THREE.BufferAttribute(height, 1));
            buffer.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
            buffer.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
            buffer.setAttribute('aHueMix', new THREE.BufferAttribute(hueMix, 1));
            return buffer;
        }, [count]);

        const material = useMemo(
            () =>
                new THREE.ShaderMaterial({
                    uniforms: {
                        uTime: { value: 0 },
                        uCollapse: { value: 0 },
                    },
                    vertexShader: SWIRL_VERTEX_SHADER,
                    fragmentShader: SWIRL_FRAGMENT_SHADER,
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                }),
            [],
        );

        useEffect(() => {
            materialRef.current = material;
            return () => {
                material.dispose();
                geometry.dispose();
            };
        }, [geometry, material]);

        useFrame((_, delta) => {
            if (!materialRef.current) return;
            const dt = clampFrameDelta(delta);
            materialRef.current.uniforms.uTime.value += dt;
            materialRef.current.uniforms.uCollapse.value = collapseRef.current;
            materialRef.current.opacity = 1 - collapseRef.current * 0.45;
        });

        return (
            <points geometry={geometry} frustumCulled={false}>
                <primitive object={material} attach="material" />
            </points>
        );
    },
);

SwirlParticles.displayName = 'SwirlParticles';

const InfallParticles = memo(
    ({ count, collapseRef }: { count: number; collapseRef: React.MutableRefObject<number> }) => {
        const materialRef = useRef<THREE.ShaderMaterial | null>(null);

        const geometry = useMemo(() => {
            const position = new Float32Array(count * 3);
            const radius = new Float32Array(count);
            const angle = new Float32Array(count);
            const phase = new Float32Array(count);
            const speed = new Float32Array(count);
            const size = new Float32Array(count);
            const height = new Float32Array(count);

            for (let i = 0; i < count; i += 1) {
                radius[i] = THREE.MathUtils.randFloat(2.6, 8.8);
                angle[i] = THREE.MathUtils.randFloat(0, Math.PI * 2);
                phase[i] = Math.random();
                speed[i] = THREE.MathUtils.randFloat(0.3, 0.76);
                size[i] = THREE.MathUtils.randFloat(0.42, 1.35);
                height[i] = THREE.MathUtils.randFloatSpread(0.42);
            }

            const buffer = new THREE.BufferGeometry();
            buffer.setAttribute('position', new THREE.BufferAttribute(position, 3));
            buffer.setAttribute('aRadius', new THREE.BufferAttribute(radius, 1));
            buffer.setAttribute('aAngle', new THREE.BufferAttribute(angle, 1));
            buffer.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
            buffer.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
            buffer.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
            buffer.setAttribute('aHeight', new THREE.BufferAttribute(height, 1));
            return buffer;
        }, [count]);

        const material = useMemo(
            () =>
                new THREE.ShaderMaterial({
                    uniforms: {
                        uTime: { value: 0 },
                        uCollapse: { value: 0 },
                    },
                    vertexShader: INFALL_VERTEX_SHADER,
                    fragmentShader: INFALL_FRAGMENT_SHADER,
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                }),
            [],
        );

        useEffect(() => {
            materialRef.current = material;
            return () => {
                material.dispose();
                geometry.dispose();
            };
        }, [geometry, material]);

        useFrame((_, delta) => {
            if (!materialRef.current) return;
            const dt = clampFrameDelta(delta);
            materialRef.current.uniforms.uTime.value += dt;
            materialRef.current.uniforms.uCollapse.value = collapseRef.current;
            materialRef.current.opacity = 1 - collapseRef.current * 0.55;
        });

        return (
            <points geometry={geometry} frustumCulled={false}>
                <primitive object={material} attach="material" />
            </points>
        );
    },
);

InfallParticles.displayName = 'InfallParticles';

const LensShell = memo(({ collapseRef }: { collapseRef: React.MutableRefObject<number> }) => {
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);

    const material = useMemo(
        () =>
            new THREE.ShaderMaterial({
                uniforms: {
                    uCollapse: { value: 0 },
                    uTime: { value: 0 },
                },
                vertexShader: LENS_VERTEX_SHADER,
                fragmentShader: LENS_FRAGMENT_SHADER,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide,
            }),
        [],
    );

    useEffect(() => {
        materialRef.current = material;
        return () => {
            material.dispose();
        };
    }, [material]);

    useFrame((_, delta) => {
        if (!materialRef.current) return;
        const dt = clampFrameDelta(delta);
        materialRef.current.uniforms.uTime.value += dt;
        materialRef.current.uniforms.uCollapse.value = collapseRef.current;
    });

    return (
        <mesh scale={[1.9, 1.9, 1.9]} renderOrder={30}>
            <sphereGeometry args={[1.0, 64, 64]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
});

LensShell.displayName = 'LensShell';

const BloomShell = memo(({ collapseRef }: { collapseRef: React.MutableRefObject<number> }) => {
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);

    const material = useMemo(
        () =>
            new THREE.ShaderMaterial({
                uniforms: {
                    uCollapse: { value: 0 },
                    uTime: { value: 0 },
                },
                vertexShader: LENS_VERTEX_SHADER,
                fragmentShader: BLOOM_SHELL_FRAGMENT_SHADER,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide,
            }),
        [],
    );

    useEffect(() => {
        materialRef.current = material;
        return () => {
            material.dispose();
        };
    }, [material]);

    useFrame((_, delta) => {
        if (!materialRef.current) return;
        const dt = clampFrameDelta(delta);
        materialRef.current.uniforms.uTime.value += dt;
        materialRef.current.uniforms.uCollapse.value = collapseRef.current;
    });

    return (
        <mesh scale={[2.5, 2.5, 2.5]} renderOrder={10}>
            <sphereGeometry args={[1.0, 48, 48]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
});

BloomShell.displayName = 'BloomShell';

const LensingRing = memo(
    ({
        collapseRef,
        segments,
    }: {
        collapseRef: React.MutableRefObject<number>;
        segments: number;
    }) => {
        const materialRef = useRef<THREE.ShaderMaterial | null>(null);

        const material = useMemo(
            () =>
                new THREE.ShaderMaterial({
                    uniforms: {
                        uCollapse: { value: 0 },
                        uTime: { value: 0 },
                    },
                    vertexShader: PHOTON_RING_VERTEX_SHADER,
                    fragmentShader: PHOTON_RING_FRAGMENT_SHADER,
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                    side: THREE.DoubleSide,
                }),
            [],
        );

        useEffect(() => {
            materialRef.current = material;
            return () => {
                material.dispose();
            };
        }, [material]);

        useFrame((_, delta) => {
            if (!materialRef.current) return;
            const dt = clampFrameDelta(delta);
            materialRef.current.uniforms.uTime.value += dt;
            materialRef.current.uniforms.uCollapse.value = collapseRef.current;
            materialRef.current.opacity = 1 - collapseRef.current * 0.8;
        });

        return (
            <mesh rotation={[Math.PI * 0.52, 0, 0]} renderOrder={35}>
                <torusGeometry args={[1.54, 0.13, 36, segments]} />
                <primitive object={material} attach="material" />
            </mesh>
        );
    },
);

LensingRing.displayName = 'LensingRing';

const SingularityRim = memo(
    ({
        collapseRef,
        segments,
    }: {
        collapseRef: React.MutableRefObject<number>;
        segments: number;
    }) => {
        const materialRef = useRef<THREE.ShaderMaterial | null>(null);

        const material = useMemo(
            () =>
                new THREE.ShaderMaterial({
                    uniforms: {
                        uCollapse: { value: 0 },
                    },
                    vertexShader: SINGULARITY_RIM_VERTEX_SHADER,
                    fragmentShader: SINGULARITY_RIM_FRAGMENT_SHADER,
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                    side: THREE.DoubleSide,
                }),
            [],
        );

        useEffect(() => {
            materialRef.current = material;
            return () => {
                material.dispose();
            };
        }, [material]);

        useFrame(() => {
            if (!materialRef.current) return;
            materialRef.current.uniforms.uCollapse.value = collapseRef.current;
        });

        return (
            <mesh scale={[1.06, 1.06, 1.06]} renderOrder={24}>
                <sphereGeometry args={[1.0, segments, segments]} />
                <primitive object={material} attach="material" />
            </mesh>
        );
    },
);

SingularityRim.displayName = 'SingularityRim';

const AccretionDiskLayers = memo(
    ({
        layers,
        segments,
        collapseRef,
    }: {
        layers: number;
        segments: number;
        collapseRef: React.MutableRefObject<number>;
    }) => {
        const materialRefs = useRef<THREE.ShaderMaterial[]>([]);

        const layerConfigs = useMemo(
            () =>
                Array.from({ length: layers }).map((_, index) => {
                    const spread = layers <= 1 ? 0 : index / (layers - 1);
                    const yOffset = THREE.MathUtils.lerp(-0.2, 0.2, spread);
                    const scale = THREE.MathUtils.lerp(0.82, 1.19, spread);

                    const material = new THREE.ShaderMaterial({
                        uniforms: {
                            uTime: { value: 0 },
                            uLayer: { value: spread + 0.14 },
                            uCollapse: { value: 0 },
                        },
                        vertexShader: DISK_VERTEX_SHADER,
                        fragmentShader: DISK_FRAGMENT_SHADER,
                        transparent: true,
                        depthWrite: false,
                        side: THREE.DoubleSide,
                        blending: THREE.AdditiveBlending,
                    });

                    return {
                        key: `disk-layer-${index}`,
                        yOffset,
                        scale,
                        material,
                    };
                }),
            [layers],
        );

        useEffect(() => {
            materialRefs.current = layerConfigs.map((layer) => layer.material);

            return () => {
                layerConfigs.forEach((layer) => layer.material.dispose());
                materialRefs.current = [];
            };
        }, [layerConfigs]);

        useFrame((_, delta) => {
            const dt = clampFrameDelta(delta);
            materialRefs.current.forEach((material) => {
                material.uniforms.uTime.value += dt;
                material.uniforms.uCollapse.value = collapseRef.current;
            });
        });

        return (
            <group rotation-x={Math.PI * 0.49}>
                {layerConfigs.map((layer, index) => (
                    <mesh
                        key={layer.key}
                        position={[0, layer.yOffset, 0]}
                        scale={[layer.scale, 1, layer.scale]}
                        renderOrder={index + 1}
                    >
                        <ringGeometry args={[1.16, 4.05, segments, 1]} />
                        <primitive object={layer.material} attach="material" />
                    </mesh>
                ))}
            </group>
        );
    },
);

AccretionDiskLayers.displayName = 'AccretionDiskLayers';

const CameraRig = ({ interactive }: { interactive: boolean }) => {
    useFrame((state, delta) => {
        const dt = clampFrameDelta(delta);

        const idleX = Math.sin(state.clock.elapsedTime * 0.22) * 0.24;
        const idleY = 0.34 + Math.cos(state.clock.elapsedTime * 0.14) * 0.06;

        const targetX = interactive ? state.pointer.x * 0.36 : idleX;
        const targetY = interactive ? 0.34 + state.pointer.y * 0.18 : idleY;
        const targetZ = interactive ? 6.8 : 7.02;

        const damp = 1 - Math.exp(-dt * (interactive ? 3.5 : 2.4));

        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, damp);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, damp);
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, damp);
        state.camera.lookAt(0, 0, 0);
    });

    return null;
};

const PerformanceWatchdog = ({
    quality,
    onPerformanceDip,
}: {
    quality: SceneQuality;
    onPerformanceDip?: () => void;
}) => {
    const sampleRef = useRef({
        time: 0,
        total: 0,
        frames: 0,
        evaluated: false,
    });

    useFrame((_, delta) => {
        if (!onPerformanceDip || sampleRef.current.evaluated || quality === 'low') return;

        const dt = Math.min(delta, 0.25);
        sampleRef.current.time += dt;
        sampleRef.current.total += dt;
        sampleRef.current.frames += 1;

        if (sampleRef.current.time < 2.1) return;

        sampleRef.current.evaluated = true;
        const fps = sampleRef.current.frames / Math.max(sampleRef.current.total, 0.001);
        const threshold = quality === 'high' ? 52 : 45;

        if (fps < threshold) {
            onPerformanceDip();
        }
    });

    return null;
};

const SceneSystem = ({
    collapseRef,
    diskLayers,
    diskSegments,
    swirlParticles,
    infallParticles,
    starParticles,
    ringSegments,
    singularitySegments,
    interactive,
    quality,
    onPerformanceDip,
}: {
    collapseRef: React.MutableRefObject<number>;
    diskLayers: number;
    diskSegments: number;
    swirlParticles: number;
    infallParticles: number;
    starParticles: number;
    ringSegments: number;
    singularitySegments: number;
    interactive: boolean;
    quality: SceneQuality;
    onPerformanceDip?: () => void;
}) => {
    const groupRef = useRef<THREE.Group>(null);
    const coreRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        const dt = clampFrameDelta(delta);
        const collapse = collapseRef.current;

        groupRef.current.rotation.y += dt * (0.12 + (1 - collapse) * 0.08 + collapse * 0.12);
        groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.24) * 0.034 * (1 - collapse * 0.5);
        groupRef.current.position.z = -collapse * 0.34;

        const scale = 1 - collapse * 0.33;
        groupRef.current.scale.setScalar(scale);

        if (coreRef.current) {
            const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.05) * 0.008 * (1 - collapse);
            coreRef.current.scale.setScalar(pulse + collapse * 0.04);
        }
    });

    return (
        <>
            <color attach="background" args={['#01030a']} />
            <fog attach="fog" args={['#01030a', 8, 30]} />
            <ambientLight intensity={0.19} color="#8bb6ff" />
            <pointLight position={[3.6, 2.2, 4.9]} intensity={9.4} color="#4dd8ff" distance={25} />
            <pointLight position={[-2.8, -1.5, -4]} intensity={7.8} color="#8170ff" distance={21} />

            <PerformanceWatchdog quality={quality} onPerformanceDip={onPerformanceDip} />
            <CameraRig interactive={interactive} />

            <group ref={groupRef}>
                <StarField count={starParticles} />

                <group rotation-y={Math.PI * 0.08}>
                    <BloomShell collapseRef={collapseRef} />

                    <AccretionDiskLayers
                        layers={diskLayers}
                        segments={diskSegments}
                        collapseRef={collapseRef}
                    />

                    <LensingRing collapseRef={collapseRef} segments={ringSegments} />

                    <mesh ref={coreRef} renderOrder={22}>
                        <sphereGeometry args={[0.98, singularitySegments, singularitySegments]} />
                        <meshBasicMaterial color="#010205" />
                    </mesh>

                    <SingularityRim collapseRef={collapseRef} segments={singularitySegments} />
                    <LensShell collapseRef={collapseRef} />
                    <InfallParticles count={infallParticles} collapseRef={collapseRef} />
                    <SwirlParticles count={swirlParticles} collapseRef={collapseRef} />
                </group>
            </group>
        </>
    );
};

const BlackHoleScene = ({
    quality,
    collapseRef,
    interactive,
    onPerformanceDip,
}: BlackHoleSceneProps) => {
    const preset = QUALITY_PRESETS[quality];

    return (
        <Canvas
            dpr={preset.dpr}
            camera={{ position: [0, 0.35, 6.95], fov: 43, near: 0.1, far: 48 }}
            gl={{
                antialias: preset.antialias,
                alpha: false,
                powerPreference: 'high-performance',
                stencil: false,
                depth: true,
                precision: preset.precision,
            }}
            performance={{ min: 0.4, debounce: 220 }}
        >
            <SceneSystem
                collapseRef={collapseRef}
                diskLayers={preset.diskLayers}
                diskSegments={preset.diskSegments}
                swirlParticles={preset.swirlParticles}
                infallParticles={preset.infallParticles}
                starParticles={preset.starParticles}
                ringSegments={preset.ringSegments}
                singularitySegments={preset.singularitySegments}
                interactive={interactive}
                quality={quality}
                onPerformanceDip={onPerformanceDip}
            />
        </Canvas>
    );
};

export default memo(BlackHoleScene);
