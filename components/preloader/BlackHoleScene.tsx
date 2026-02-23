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
    swirlParticles: number;
    starParticles: number;
    antialias: boolean;
};

const QUALITY_PRESETS: Record<SceneQuality, ScenePreset> = {
    low: {
        dpr: [1, 1.2],
        diskLayers: 3,
        swirlParticles: 520,
        starParticles: 600,
        antialias: false,
    },
    medium: {
        dpr: [1, 1.5],
        diskLayers: 5,
        swirlParticles: 900,
        starParticles: 980,
        antialias: true,
    },
    high: {
        dpr: [1.2, 2],
        diskLayers: 7,
        swirlParticles: 1300,
        starParticles: 1450,
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
    float pulse = sin(uTime * 1.5 + uLayer * 2.1) * 0.03;
    float sink = pow(clamp(uCollapse, 0.0, 1.0), 1.6);
    transformed.y += pulse * (1.0 - sink);
    transformed.xy *= 1.0 - sink * 0.85;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const DISK_FRAGMENT_SHADER = `
varying vec2 vUv;
uniform float uTime;
uniform float uLayer;
uniform float uCollapse;

vec3 warm = vec3(1.0, 0.53, 0.16);
vec3 cool = vec3(0.15, 0.82, 0.89);

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float radius = length(uv);
    float theta = atan(uv.y, uv.x);

    float inner = 0.36;
    float outer = 1.0;
    float ring = smoothstep(inner, inner + 0.07, radius) * (1.0 - smoothstep(outer - 0.12, outer, radius));

    float swirlA = sin(theta * 16.0 - uTime * 3.0 + radius * 34.0 + uLayer * 1.7) * 0.5 + 0.5;
    float swirlB = sin(theta * 8.0 + uTime * 1.8 + radius * 18.0 - uLayer * 2.3) * 0.5 + 0.5;
    float flicker = mix(swirlA, swirlB, 0.45);

    float sink = pow(clamp(uCollapse, 0.0, 1.0), 1.8);
    float fade = (1.0 - sink);
    float alpha = ring * mix(0.25, 1.0, flicker) * (0.38 + uLayer * 0.12) * fade;

    vec3 colorMix = mix(cool, warm, flicker);
    vec3 color = colorMix * (0.65 + ring * 0.8);

    gl_FragColor = vec4(color, alpha);
}
`;

const SWIRL_VERTEX_SHADER = `
attribute float aRadius;
attribute float aAngle;
attribute float aHeight;
attribute float aSpeed;
attribute float aSize;

uniform float uTime;
uniform float uCollapse;

varying float vAlpha;

void main() {
    float sink = pow(clamp(uCollapse, 0.0, 1.0), 1.55);
    float angle = aAngle + uTime * aSpeed;
    float radius = max(0.05, aRadius * (1.0 - sink * 0.92));

    float vertical = aHeight * (1.0 - sink) + sin(angle * 2.2 + uTime * 0.55) * 0.06 * (1.0 - sink);

    vec3 transformed = vec3(cos(angle) * radius, vertical, sin(angle) * radius);

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depthScale = clamp(1.5 / -mvPosition.z, 0.0, 2.8);
    gl_PointSize = (1.2 + aSize * 3.1) * depthScale;

    vAlpha = (1.0 - sink) * clamp(depthScale, 0.25, 1.0);
}
`;

const SWIRL_FRAGMENT_SHADER = `
varying float vAlpha;

void main() {
    vec2 centered = gl_PointCoord - vec2(0.5);
    float dist = length(centered);
    float glow = smoothstep(0.52, 0.0, dist);

    vec3 colorA = vec3(0.15, 0.83, 0.9);
    vec3 colorB = vec3(1.0, 0.55, 0.2);
    vec3 color = mix(colorA, colorB, glow * 0.75);

    gl_FragColor = vec4(color, glow * vAlpha * 0.55);
}
`;

const StarField = memo(({ count }: { count: number }) => {
    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i += 1) {
            const i3 = i * 3;
            const radius = THREE.MathUtils.randFloat(7.5, 23);
            const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
            const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.cos(phi) * 0.65;
            positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

            const tint = THREE.MathUtils.randFloat(0.7, 1);
            colors[i3] = 0.5 * tint;
            colors[i3 + 1] = 0.85 * tint;
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
        [geometry]
    );

    return (
        <points geometry={geometry}>
            <pointsMaterial
                size={0.038}
                sizeAttenuation
                transparent
                opacity={0.65}
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

            for (let i = 0; i < count; i += 1) {
                radius[i] = THREE.MathUtils.randFloat(1.9, 8.2) * Math.pow(Math.random(), 0.35);
                angle[i] = THREE.MathUtils.randFloat(0, Math.PI * 2);
                height[i] = THREE.MathUtils.randFloatSpread(0.65) * Math.pow(radius[i] / 8.2, 0.7);
                speed[i] = THREE.MathUtils.randFloat(0.65, 2.3) / (0.5 + radius[i] * 0.24);
                size[i] = THREE.MathUtils.randFloat(0.5, 1.55);
            }

            const buffer = new THREE.BufferGeometry();
            buffer.setAttribute('position', new THREE.BufferAttribute(position, 3));
            buffer.setAttribute('aRadius', new THREE.BufferAttribute(radius, 1));
            buffer.setAttribute('aAngle', new THREE.BufferAttribute(angle, 1));
            buffer.setAttribute('aHeight', new THREE.BufferAttribute(height, 1));
            buffer.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
            buffer.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
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
            []
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
            materialRef.current.opacity = 1 - collapseRef.current * 0.4;
        });

        return (
            <points geometry={geometry} frustumCulled={false}>
                <primitive object={material} attach="material" />
            </points>
        );
    }
);

SwirlParticles.displayName = 'SwirlParticles';

const AccretionDiskLayers = memo(
    ({ layers, collapseRef }: { layers: number; collapseRef: React.MutableRefObject<number> }) => {
        const materialRefs = useRef<THREE.ShaderMaterial[]>([]);

        const layerConfigs = useMemo(
            () =>
                Array.from({ length: layers }).map((_, index) => {
                    const spread = layers <= 1 ? 0 : index / (layers - 1);
                    const yOffset = THREE.MathUtils.lerp(-0.22, 0.22, spread);
                    const scale = THREE.MathUtils.lerp(0.84, 1.13, spread);

                    const material = new THREE.ShaderMaterial({
                        uniforms: {
                            uTime: { value: 0 },
                            uLayer: { value: spread + 0.15 },
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
            [layers]
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
            <group rotation-x={Math.PI * 0.48}>
                {layerConfigs.map((layer, index) => {
                    return (
                        <mesh
                            key={layer.key}
                            position={[0, layer.yOffset, 0]}
                            scale={[layer.scale, 1, layer.scale]}
                            renderOrder={index + 1}
                        >
                            <ringGeometry args={[1.35, 3.7, 192, 1]} />
                            <primitive object={layer.material} attach="material" />
                        </mesh>
                    );
                })}
            </group>
        );
    }
);

AccretionDiskLayers.displayName = 'AccretionDiskLayers';

const CameraRig = ({ interactive }: { interactive: boolean }) => {
    useFrame((state, delta) => {
        const baseX = interactive ? state.pointer.x * 0.6 : 0;
        const baseY = interactive ? 0.38 + state.pointer.y * 0.32 : 0.38;
        const damp = 1 - Math.exp(-delta * 3.6);

        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, baseX, damp);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, baseY, damp);
        state.camera.lookAt(0, 0, 0);
    });

    return null;
};

const SceneSystem = ({
    collapseRef,
    diskLayers,
    swirlParticles,
    starParticles,
    interactive,
}: {
    collapseRef: React.MutableRefObject<number>;
    diskLayers: number;
    swirlParticles: number;
    starParticles: number;
    interactive: boolean;
}) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        const collapse = collapseRef.current;
        groupRef.current.rotation.y += delta * (0.14 + (1 - collapse) * 0.05);
        groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.28) * 0.04;

        const scale = 1 - collapse * 0.28;
        groupRef.current.scale.setScalar(scale);
    });

    return (
        <>
            <color attach="background" args={['#030305']} />
            <fog attach="fog" args={['#030305', 8, 28]} />
            <ambientLight intensity={0.26} color="#99f2ff" />
            <pointLight position={[3.2, 2.5, 4.5]} intensity={9.5} color="#68d7ff" distance={26} />
            <pointLight position={[-2.4, -1.3, -3.8]} intensity={7.2} color="#ff9f4f" distance={19} />

            <CameraRig interactive={interactive} />

            <group ref={groupRef}>
                <StarField count={starParticles} />

                <group rotation-y={Math.PI * 0.08}>
                    <AccretionDiskLayers layers={diskLayers} collapseRef={collapseRef} />

                    <mesh castShadow receiveShadow>
                        <sphereGeometry args={[1.05, 72, 72]} />
                        <meshStandardMaterial
                            color="#030305"
                            roughness={0.22}
                            metalness={0.42}
                            emissive="#040a0b"
                            emissiveIntensity={0.74}
                        />
                    </mesh>

                    <mesh scale={[1.72, 1.72, 1.72]}>
                        <sphereGeometry args={[1.06, 40, 40]} />
                        <meshBasicMaterial
                            color="#2bd0ff"
                            transparent
                            opacity={0.1}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                        />
                    </mesh>

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
            camera={{ position: [0, 0.38, 6.9], fov: 44, near: 0.1, far: 45 }}
            gl={{
                antialias: preset.antialias,
                alpha: false,
                powerPreference: 'high-performance',
                stencil: false,
                depth: true,
            }}
            performance={{ min: 0.55 }}
        >
            <SceneSystem
                collapseRef={collapseRef}
                diskLayers={preset.diskLayers}
                swirlParticles={preset.swirlParticles}
                starParticles={preset.starParticles}
                interactive={interactive}
            />
        </Canvas>
    );
};

export default memo(BlackHoleScene);
