'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import React, { memo, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

export type SceneQuality = 'low' | 'medium' | 'high';

type BlackHoleSceneProps = {
    quality: SceneQuality;
    collapseRef: React.MutableRefObject<number>;
    interactive: boolean;
};

type ScenePreset = {
    dpr: [number, number];
    diskLayers: number;
    diskSegments: number;
    swirlParticles: number;
    infallParticles: number;
    starParticles: number;
    antialias: boolean;
};

const QUALITY_PRESETS: Record<SceneQuality, ScenePreset> = {
    low: {
        dpr: [0.85, 1.2],
        diskLayers: 3,
        diskSegments: 112,
        swirlParticles: 420,
        infallParticles: 120,
        starParticles: 420,
        antialias: false,
    },
    medium: {
        dpr: [1, 1.65],
        diskLayers: 5,
        diskSegments: 144,
        swirlParticles: 760,
        infallParticles: 190,
        starParticles: 780,
        antialias: true,
    },
    high: {
        dpr: [1.2, 2],
        diskLayers: 7,
        diskSegments: 176,
        swirlParticles: 1100,
        infallParticles: 260,
        starParticles: 1180,
        antialias: true,
    },
};

const DISK_VERTEX_SHADER = `
varying vec2 vUv;
uniform float uTime;
uniform float uLayer;
uniform float uCollapse;

void main() {
    vUv = uv;

    vec3 transformed = position;
    float sink = pow(clamp(uCollapse, 0.0, 1.0), 1.6);
    float pulse = sin(uTime * 1.7 + uLayer * 3.2 + position.x * 0.3) * 0.022;

    transformed.y += pulse * (1.0 - sink);
    transformed.xy *= 1.0 - sink * 0.84;

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

    float inner = 0.3;
    float outer = 1.0;
    float ring = smoothstep(inner, inner + 0.08, radius) *
                 (1.0 - smoothstep(outer - 0.16, outer, radius));

    float sink = pow(clamp(uCollapse, 0.0, 1.0), 1.85);
    float twistA = sin(theta * 13.0 - uTime * 2.7 + radius * 28.0 + uLayer * 6.0) * 0.5 + 0.5;
    float twistB = sin(theta * 7.0 + uTime * 1.9 + radius * 17.0 - uLayer * 5.0) * 0.5 + 0.5;
    float turbulence = mix(twistA, twistB, 0.44);

    vec3 deepBlue = vec3(0.02, 0.06, 0.17);
    vec3 violet = vec3(0.35, 0.24, 0.82);
    vec3 cyan = vec3(0.18, 0.84, 0.96);
    vec3 white = vec3(0.94, 0.98, 1.0);

    vec3 base = mix(violet, cyan, turbulence);
    float highlight = pow(smoothstep(0.42, 1.0, turbulence), 2.3);
    vec3 color = mix(deepBlue, base, ring);
    color += white * highlight * ring * 0.52;

    float alpha = ring * (0.18 + turbulence * 0.58 + uLayer * 0.18) * (1.0 - sink);
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

    float wave = sin(angle * 2.5 + uTime * 0.6) * 0.055;
    float vertical = (aHeight + wave) * (1.0 - sink);

    vec3 transformed = vec3(cos(angle) * radius, vertical, sin(angle) * radius);

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depthScale = clamp(1.45 / -mvPosition.z, 0.0, 2.6);
    gl_PointSize = (1.15 + aSize * 2.9) * depthScale;

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

    vec3 cyan = vec3(0.2, 0.88, 0.98);
    vec3 violet = vec3(0.48, 0.38, 0.92);
    vec3 white = vec3(0.95, 0.98, 1.0);

    vec3 blend = mix(violet, cyan, vHueMix);
    vec3 color = mix(blend, white, glow * 0.38);

    gl_FragColor = vec4(color, glow * vAlpha * 0.58);
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

    float radius = mix(aRadius, 0.14, inward) * (1.0 - sink * 0.95);
    float angle = aAngle + inward * 8.4 + uTime * 0.28;
    float height = aHeight * (1.0 - inward) * (1.0 - sink);

    vec3 transformed = vec3(cos(angle) * radius, height, sin(angle) * radius);

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depthScale = clamp(1.55 / -mvPosition.z, 0.0, 2.8);
    gl_PointSize = (1.2 + aSize * 2.5) * depthScale;

    vAlpha = (1.0 - inward) * (1.0 - sink) * clamp(depthScale, 0.2, 1.0);
}
`;

const INFALL_FRAGMENT_SHADER = `
varying float vAlpha;

void main() {
    vec2 centered = gl_PointCoord - vec2(0.5);
    float dist = length(centered);
    float streak = smoothstep(0.56, 0.0, dist);

    vec3 color = mix(vec3(0.34, 0.75, 0.98), vec3(0.96, 0.99, 1.0), streak * 0.8);
    gl_FragColor = vec4(color, streak * vAlpha * 0.62);
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

void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(normalize(vWorldNormal), viewDir), 0.0), 3.3);
    float halo = smoothstep(0.14, 1.0, fresnel);

    vec3 deep = vec3(0.09, 0.19, 0.44);
    vec3 bright = vec3(0.82, 0.95, 1.0);
    vec3 color = mix(deep, bright, halo);

    float alpha = halo * (0.16 + fresnel * 0.52) * (1.0 - uCollapse * 0.9);
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

            const tint = THREE.MathUtils.randFloat(0.68, 1);
            colors[i3] = 0.45 * tint;
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
                size={0.03}
                sizeAttenuation
                transparent
                opacity={0.58}
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
                radius[i] = THREE.MathUtils.randFloat(1.7, 8.6) * Math.pow(Math.random(), 0.35);
                angle[i] = THREE.MathUtils.randFloat(0, Math.PI * 2);
                height[i] = THREE.MathUtils.randFloatSpread(0.62) * Math.pow(radius[i] / 8.6, 0.7);
                speed[i] = THREE.MathUtils.randFloat(0.68, 2.28) / (0.5 + radius[i] * 0.24);
                size[i] = THREE.MathUtils.randFloat(0.45, 1.6);
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
            materialRef.current.uniforms.uTime.value += delta;
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
                speed[i] = THREE.MathUtils.randFloat(0.3, 0.78);
                size[i] = THREE.MathUtils.randFloat(0.45, 1.4);
                height[i] = THREE.MathUtils.randFloatSpread(0.45);
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
            materialRef.current.uniforms.uTime.value += delta;
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

    useFrame(() => {
        if (!materialRef.current) return;
        materialRef.current.uniforms.uCollapse.value = collapseRef.current;
    });

    return (
        <mesh scale={[1.78, 1.78, 1.78]} renderOrder={30}>
            <sphereGeometry args={[1.0, 64, 64]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
});

LensShell.displayName = 'LensShell';

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
                    const yOffset = THREE.MathUtils.lerp(-0.21, 0.21, spread);
                    const scale = THREE.MathUtils.lerp(0.82, 1.16, spread);

                    const material = new THREE.ShaderMaterial({
                        uniforms: {
                            uTime: { value: 0 },
                            uLayer: { value: spread + 0.16 },
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
            materialRefs.current.forEach((material) => {
                material.uniforms.uTime.value += delta;
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
                        <ringGeometry args={[1.18, 3.95, segments, 1]} />
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
        const idleX = Math.sin(state.clock.elapsedTime * 0.21) * 0.24;
        const idleY = 0.34 + Math.cos(state.clock.elapsedTime * 0.15) * 0.06;

        const targetX = interactive ? state.pointer.x * 0.42 : idleX;
        const targetY = interactive ? 0.34 + state.pointer.y * 0.2 : idleY;
        const targetZ = interactive ? 6.82 : 7.02;

        const damp = 1 - Math.exp(-delta * (interactive ? 4.1 : 2.5));

        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, damp);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, damp);
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, damp);
        state.camera.lookAt(0, 0, 0);
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
    interactive,
}: {
    collapseRef: React.MutableRefObject<number>;
    diskLayers: number;
    diskSegments: number;
    swirlParticles: number;
    infallParticles: number;
    starParticles: number;
    interactive: boolean;
}) => {
    const groupRef = useRef<THREE.Group>(null);
    const coreRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        const collapse = collapseRef.current;
        groupRef.current.rotation.y += delta * (0.11 + (1 - collapse) * 0.07 + collapse * 0.12);
        groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.24) * 0.036 * (1 - collapse * 0.5);
        groupRef.current.position.z = -collapse * 0.32;

        const scale = 1 - collapse * 0.33;
        groupRef.current.scale.setScalar(scale);

        if (coreRef.current) {
            const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.9) * 0.01 * (1 - collapse);
            coreRef.current.scale.setScalar(pulse + collapse * 0.045);
        }
    });

    return (
        <>
            <color attach="background" args={['#01030a']} />
            <fog attach="fog" args={['#01030a', 8, 30]} />
            <ambientLight intensity={0.2} color="#8bb7ff" />
            <pointLight position={[3.4, 2.2, 4.8]} intensity={8.8} color="#56d5ff" distance={25} />
            <pointLight position={[-2.7, -1.4, -3.9]} intensity={7.3} color="#7f73ff" distance={21} />

            <CameraRig interactive={interactive} />

            <group ref={groupRef}>
                <StarField count={starParticles} />

                <group rotation-y={Math.PI * 0.08}>
                    <AccretionDiskLayers
                        layers={diskLayers}
                        segments={diskSegments}
                        collapseRef={collapseRef}
                    />

                    <mesh ref={coreRef} renderOrder={20}>
                        <sphereGeometry args={[1.02, 72, 72]} />
                        <meshStandardMaterial
                            color="#01030a"
                            roughness={0.08}
                            metalness={0.26}
                            emissive="#03071c"
                            emissiveIntensity={0.78}
                        />
                    </mesh>

                    <LensShell collapseRef={collapseRef} />
                    <InfallParticles count={infallParticles} collapseRef={collapseRef} />
                    <SwirlParticles count={swirlParticles} collapseRef={collapseRef} />
                </group>
            </group>
        </>
    );
};

const BlackHoleScene = ({ quality, collapseRef, interactive }: BlackHoleSceneProps) => {
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
            }}
            performance={{ min: 0.45 }}
        >
            <SceneSystem
                collapseRef={collapseRef}
                diskLayers={preset.diskLayers}
                diskSegments={preset.diskSegments}
                swirlParticles={preset.swirlParticles}
                infallParticles={preset.infallParticles}
                starParticles={preset.starParticles}
                interactive={interactive}
            />
        </Canvas>
    );
};

export default memo(BlackHoleScene);
