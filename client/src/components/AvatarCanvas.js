import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Suspense, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Loader, OrthographicCamera, useAnimations, useFBX, useGLTF, useTexture } from '@react-three/drei';
import { LineBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, Vector2 } from 'three';
import { LinearSRGBColorSpace, SRGBColorSpace } from 'three';
import * as THREE from 'three';
import _ from 'lodash';
// @ts-ignore
import createAnimation from '../lib/converter';
import blinkData from '../lib/blendDataBlink.json';
function Avatar({ speakingBlendData, playing }) {
    const gltf = useGLTF('/model.glb');
    let morphTargetDictionaryBody = null;
    let morphTargetDictionaryLowerTeeth = null;
    const [bodyTexture, eyesTexture, teethTexture, bodyRoughnessTexture, bodyNormalTexture, teethNormalTexture, hairTexture, tshirtDiffuseTexture, tshirtNormalTexture, tshirtRoughnessTexture, hairAlphaTexture, hairNormalTexture, hairRoughnessTexture] = useTexture([
        '/images/body.webp', '/images/eyes.webp', '/images/teeth_diffuse.webp', '/images/body_roughness.webp', '/images/body_normal.webp', '/images/teeth_normal.webp', '/images/h_color.webp', '/images/tshirt_diffuse.webp', '/images/tshirt_normal.webp', '/images/tshirt_roughness.webp', '/images/h_alpha.webp', '/images/h_normal.webp', '/images/h_roughness.webp'
    ]);
    // Only color textures should use sRGB. Data maps (normal/roughness/alpha)
    // must remain linear, otherwise materials can render too dark or incorrect.
    _.each([bodyTexture, eyesTexture, teethTexture, hairTexture, tshirtDiffuseTexture], (t) => {
        t.colorSpace = SRGBColorSpace;
        t.flipY = false;
    });
    _.each([teethNormalTexture, bodyRoughnessTexture, bodyNormalTexture, tshirtNormalTexture, tshirtRoughnessTexture, hairAlphaTexture, hairNormalTexture, hairRoughnessTexture], (t) => {
        t.colorSpace = LinearSRGBColorSpace;
        t.flipY = false;
    });
    gltf.scene.traverse((node) => {
        if (node.type === 'Mesh' || node.type === 'SkinnedMesh') {
            node.castShadow = true;
            node.receiveShadow = true;
            node.frustumCulled = false;
            if (node.name.includes('Body')) {
                node.material = new MeshPhysicalMaterial({ map: bodyTexture, roughness: 1, roughnessMap: bodyRoughnessTexture, normalMap: bodyNormalTexture, normalScale: new Vector2(0.6, 0.6) });
                morphTargetDictionaryBody = node.morphTargetDictionary;
            }
            if (node.name.includes('Eyes'))
                node.material = new MeshStandardMaterial({ map: eyesTexture, roughness: 0.1 });
            if (node.name.includes('Brows'))
                node.material = new LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 });
            if (node.name.includes('Teeth'))
                node.material = new MeshStandardMaterial({ map: teethTexture, normalMap: teethNormalTexture, roughness: 0.1 });
            if (node.name.includes('Hair'))
                node.material = new MeshStandardMaterial({ map: hairTexture, alphaMap: hairAlphaTexture, normalMap: hairNormalTexture, roughnessMap: hairRoughnessTexture, transparent: true, depthWrite: false, side: 2 });
            if (node.name.includes('TSHIRT'))
                node.material = new MeshStandardMaterial({ map: tshirtDiffuseTexture, roughnessMap: tshirtRoughnessTexture, normalMap: tshirtNormalTexture });
            if (node.name.includes('TeethLower'))
                morphTargetDictionaryLowerTeeth = node.morphTargetDictionary;
        }
    });
    const mixer = useMemo(() => new THREE.AnimationMixer(gltf.scene), [gltf.scene]);
    const idleFbx = useFBX('/idle.fbx');
    const { clips: idleClips } = useAnimations(idleFbx.animations);
    useEffect(() => {
        const idleTrack = idleClips[0];
        idleTrack.tracks = idleTrack.tracks.filter((track) => track.name.includes('Head') || track.name.includes('Neck') || track.name.includes('Spine2'));
        idleTrack.tracks = idleTrack.tracks.map((track) => {
            if (track.name.includes('Head'))
                track.name = 'head.quaternion';
            if (track.name.includes('Neck'))
                track.name = 'neck.quaternion';
            if (track.name.includes('Spine'))
                track.name = 'spine2.quaternion';
            return track;
        });
        mixer.clipAction(idleTrack).play();
        mixer.clipAction(createAnimation(blinkData, morphTargetDictionaryBody, 'HG_Body')).play();
    }, [idleClips, mixer]);
    useEffect(() => {
        if (!playing || !speakingBlendData?.length)
            return;
        const bodyClip = createAnimation(speakingBlendData, morphTargetDictionaryBody, 'HG_Body');
        const teethClip = createAnimation(speakingBlendData, morphTargetDictionaryLowerTeeth, 'HG_TeethLower');
        [bodyClip, teethClip].forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.reset();
            action.setLoop(THREE.LoopOnce, 1);
            action.play();
        });
    }, [playing, speakingBlendData, mixer]);
    useFrame((_, delta) => mixer.update(delta));
    return _jsx("primitive", { object: gltf.scene });
}
export function AvatarCanvas(props) {
    return (_jsxs("div", { className: "h-[360px] rounded-box overflow-hidden bg-base-300", children: [_jsxs(Canvas, { dpr: 2, shadows: true, gl: { antialias: true, outputColorSpace: SRGBColorSpace, toneMappingExposure: 1.2 }, children: [_jsx(OrthographicCamera, { makeDefault: true, zoom: 2000, position: [0, 1.65, 1] }), _jsxs(Suspense, { fallback: null, children: [_jsx("ambientLight", { intensity: 0.55 }), _jsx("hemisphereLight", { intensity: 0.45, groundColor: "#3a3a3a" }), _jsx("directionalLight", { position: [1.2, 2.4, 2.2], intensity: 1.3, castShadow: true }), _jsx("directionalLight", { position: [-1.5, 1.2, 1.8], intensity: 0.5 }), _jsx(Environment, { background: false, files: "/images/photo_studio_loft_hall_1k.hdr" }), _jsx(Avatar, { ...props })] })] }), _jsx(Loader, {})] }));
}
useGLTF.preload('/model.glb');
