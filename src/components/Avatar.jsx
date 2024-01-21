import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useFBX, useAnimations, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMobile } from "../hooks/useMobile";

export function Avatar(props) {
  const { isMobile } = useMobile();
  const { nodes, materials } = useGLTF("/models/65915c319e1b858d3d34e4d9.glb");
  const { animations: idleAnimation } = useFBX(
    "/animations/Catwalk Idle To Twist R.fbx"
  );
  const { animations: walkAnimation } = useFBX(
    "/animations/Catwalk Walk Forward Crossed.fbx"
  );

  const group = useRef();
  idleAnimation[0].name = "Idle";
  walkAnimation[0].name = "Walk";

  const { actions } = useAnimations(
    [idleAnimation[0], walkAnimation[0]],
    group
  );
  const [animation, setAnimation] = useState("Idle");
  useEffect(() => {
    actions[animation].reset().fadeIn(0.5).play();
    return () => actions[animation].fadeOut(0.5);
  }, [animation]);

  const scrollData = useScroll();
  const lastScroll = useRef(0);

  useFrame(() => {
    const scrollDelta = scrollData.offset - lastScroll.current;
    let rotationTarget = 0;
    if (Math.abs(scrollDelta) > 0.00001) {
      setAnimation("Walk");
      if (scrollDelta > 0) {
        rotationTarget = isMobile ? Math.PI / 2 : 0;
      } else {
        rotationTarget = isMobile ? -Math.PI / 2 : Math.PI;
      }
    } else {
      setAnimation("Idle");
    }
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      rotationTarget,
      0.1
    );
    lastScroll.current = scrollData.offset;
  });
  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
    </group>
  );
}

useGLTF.preload("/models/65915c319e1b858d3d34e4d9.glb");
useFBX.preload("/animations/Catwalk Idle To Twist R.fbx");
useFBX.preload("/animations/Catwalk Walk Forward Crossed.fbx");
