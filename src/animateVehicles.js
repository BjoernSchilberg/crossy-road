import * as THREE from "three";

import { metadata as rows } from './components/Map.js';

import { minTileIndex, maxTileIndex, tileSize } from './constants.js';


const clock = new THREE.Clock();

export function animateVehicles() {
    const delta = clock.getDelta();

    rows.forEach((rowData) => {

        if (rowData.type == "car" || rowData.type == "truck") {
            const beginningOfRow = (minTileIndex - 2) * tileSize;
            const endOfRow = (maxTileIndex + 2) * tileSize;

            rowData.vehicles.forEach(({ ref }) => {
                if (!ref) return; // row has been disposed, skip
                if (rowData.direction) {
                    ref.position.x =
                        ref.position.x > endOfRow
                            ? beginningOfRow
                            : ref.position.x + rowData.speed * delta;

                } else {
                    ref.position.x =
                        ref.position.x < beginningOfRow
                            ? endOfRow
                            : ref.position.x - rowData.speed * delta;
                }
            })
        }

    })
}