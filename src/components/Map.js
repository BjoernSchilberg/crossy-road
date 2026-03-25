import * as THREE from "three";
import { Grass } from "./Grass";
import { Tree } from "./Tree";
import { Car } from "./Car";
import { Road } from "./Road";
import { Truck } from "./Truck";

export const metadata = [
    {
        type: "car",
        // false = left, true = right
        direction: false,
        // how many tiles per second
        speed: 2,
        vehicles: [{ initialTileIndex: 2, color: "#ff0000" }]
    },
    {
        type: "forest",
        trees: [
            { tileIndex: -3, heights: 50 },
            { tileIndex: 2, heights: 30 },
            { tileIndex: 5, heights: 50 },
        ]
    },
    {
        type: "truck",
        // false = left, true = right
        direction: true,
        // how many tiles per second
        speed: 2,
        vehicles: [{ initialTileIndex: -1, color: "#00ff00" }]
    },
]

export const map = new THREE.Group();

export function initialzeMap() {
    // add grass rows behind the player
    for (let rowIndex = 0; rowIndex > -5; rowIndex--) {
        const grass = Grass(rowIndex)
        map.add(grass)
    }
    addRows()
}

export function addRows() {
    metadata.forEach((rowData, index) => {
        const rowIndex = index + 1;
        if (rowData.type === "forest") {
            const row = Grass(rowIndex)

            rowData.trees.forEach(({ tileIndex, heights }) => {
                const tree = Tree(tileIndex, heights)
                row.add(tree)
            })
            map.add(row)
        }
        if (rowData.type === "car") {
            const road = Road(rowIndex)
            rowData.vehicles.forEach((vehicle) => {
                const car = Car(
                    vehicle.initialTileIndex,
                    rowData.direction,
                    vehicle.color);

                vehicle.ref = car;
                road.add(car)
            });
            map.add(road)
        }
        if (rowData.type === "truck") {
            const row = Road(rowIndex)
            rowData.vehicles.forEach((vehicle) => {
                const truck = Truck(
                    vehicle.initialTileIndex,
                    rowData.direction,
                    vehicle.color
                );
                vehicle.ref = truck;
                row.add(truck)
            })
            map.add(row)
        }
    })
}