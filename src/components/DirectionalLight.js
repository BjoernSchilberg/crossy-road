import * as THREE from "three";

export function DirectionalLight() {
    const dirLight = new THREE.DirectionalLight();
    dirLight.position.set(-100, -100, 200);
    dirLight.up.set(0, 0, 1);

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    // Renders the scene from the perspective of the light to calculate shadows.
    // The shadow camera is an orthographic camera, and its frustum is a box.
    dirLight.shadow.camera.up.set(0, 0, 1);
    // Shadows are only calculated within this box.
    dirLight.shadow.camera.left = -400;
    dirLight.shadow.camera.right = 400;
    dirLight.shadow.camera.top = 400;
    dirLight.shadow.camera.bottom = -400;
    dirLight.shadow.camera.near = 50
    dirLight.shadow.camera.far = 400;


    return dirLight;
}