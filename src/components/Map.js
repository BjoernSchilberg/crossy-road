import * as THREE from "three";
import { generateRows } from './utilities/generateRows.js';
import { Grass } from './Grass.js';
import { Tree } from './Tree.js';
import { Car } from './Car.js';
import { Road } from './Road.js';
import { Truck } from './Truck.js';

export const metadata = [];

export const map = new THREE.Group();

// rowIndex (1-based) → THREE.Group; used for cleanup
const rowGroups = new Map();

// How many rows behind the player we keep alive
const KEEP_BEHIND = 10;

function disposeGroup(group) {
    group.traverse((obj) => {
        if (!obj.isMesh) return;
        obj.geometry.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => {
            // Only dispose textures that are NOT the shared car window textures.
            // Shared textures have multiple references; disposing them would break
            // other cars that are still visible.  We skip map textures here and
            // let them live for the process lifetime (they are tiny and few).
            m.dispose();
        });
    });
}

export function cleanupRows(currentRow) {
    const keepFrom = currentRow - KEEP_BEHIND;
    for (const [rowIndex, group] of rowGroups) {
        if (rowIndex >= keepFrom) continue;
        map.remove(group);
        disposeGroup(group);
        rowGroups.delete(rowIndex);
        // Null out vehicle refs so animateVehicles skips them
        const meta = metadata[rowIndex - 1];
        if (meta?.vehicles) meta.vehicles.forEach((v) => { v.ref = null; });
    }
}

export function initializeMap() {
    // Dispose and remove all tracked row groups
    for (const [, group] of rowGroups) {
        map.remove(group);
        disposeGroup(group);
    }
    rowGroups.clear();

    metadata.length = 0;
    // Remove any remaining children (e.g. starting grass rows)
    map.remove(...map.children);

    for (let rowIndex = 0; rowIndex > -5; rowIndex--) {
        const grass = Grass(rowIndex);
        map.add(grass);
    }
    addRows();
}

export function addRows() {
    const newMetadata = generateRows(20);

    const startIndex = metadata.length;
    metadata.push(...newMetadata);

    newMetadata.forEach((rowData, index) => {
        const rowIndex = startIndex + index + 1;

        if (rowData.type === 'forest') {
            const row = Grass(rowIndex);
            rowData.trees.forEach(({ tileIndex, height }) => {
                row.add(Tree(tileIndex, height));
            });
            map.add(row);
            rowGroups.set(rowIndex, row);
        }

        if (rowData.type === 'car') {
            const row = Road(rowIndex);
            rowData.vehicles.forEach((vehicle) => {
                const car = Car(vehicle.initialTileIndex, rowData.direction, vehicle.color);
                vehicle.ref = car;
                row.add(car);
            });
            map.add(row);
            rowGroups.set(rowIndex, row);
        }

        if (rowData.type === 'truck') {
            const row = Road(rowIndex);
            rowData.vehicles.forEach((vehicle) => {
                const truck = Truck(vehicle.initialTileIndex, rowData.direction, vehicle.color);
                vehicle.ref = truck;
                row.add(truck);
            });
            map.add(row);
            rowGroups.set(rowIndex, row);
        }
    });
}

