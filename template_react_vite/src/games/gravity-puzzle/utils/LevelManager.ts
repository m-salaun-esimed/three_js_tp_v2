import * as THREE from 'three';
import * as CANNON from 'cannon-es';

interface LevelData {
  ballStart: { x: number; y: number; z: number };
  exit: { x: number; y: number; z: number };
  walls: Array<{
    position: { x: number; y: number; z: number };
    size: { x: number; y: number; z: number };
  }>;
}

export class LevelManager {
  private scene: THREE.Scene;
  private world: CANNON.World;
  private currentLevel: number = 1;
  private levelObjects: THREE.Mesh[] = [];
  private levelBodies: CANNON.Body[] = [];
  private exitMesh: THREE.Mesh | null = null;

  constructor(scene: THREE.Scene, world: CANNON.World) {
    this.scene = scene;
    this.world = world;
  }

  public loadLevel(levelNumber: number): LevelData {
    this.clearLevel();

    this.currentLevel = levelNumber;
    const levelData = this.getLevelData(levelNumber);

    levelData.walls.forEach(wall => {
      this.createWall(wall.position, wall.size);
    });

    this.createExit(levelData.exit);

    return levelData;
  }

  private getLevelData(levelNumber: number): LevelData {
    const levels: Record<number, LevelData> = {
      1: {
        ballStart: { x: -5, y: 0, z: 0 },
        exit: { x: 5, y: 0, z: 0 },
        walls: [
          { position: { x: 0, y: -1, z: 0 }, size: { x: 20, y: 1, z: 10 } },
        ],
      },
      2: {
        ballStart: { x: -5, y: 2, z: 0 },
        exit: { x: 5, y: 2, z: 0 },
        walls: [
          { position: { x: 0, y: -1, z: 0 }, size: { x: 20, y: 1, z: 10 } },
          { position: { x: 0, y: 2, z: 0 }, size: { x: 1, y: 5, z: 10 } }, 
        ],
      },
      3: {
        ballStart: { x: -6, y: 0, z: 0 },
        exit: { x: 6, y: 6, z: 0 },
        walls: [
          { position: { x: -6, y: -1, z: 0 }, size: { x: 3, y: 1, z: 10 } }, 
          { position: { x: -3, y: 0, z: 0 }, size: { x: 3, y: 1, z: 10 } }, 
          { position: { x: 0, y: 1, z: 0 }, size: { x: 3, y: 1, z: 10 } },
          { position: { x: 3, y: 2, z: 0 }, size: { x: 3, y: 1, z: 10 } },
          { position: { x: 6, y: 5, z: 0 }, size: { x: 3, y: 1, z: 10 } },
        ],
      },
      4: {
        ballStart: { x: -7, y: 0, z: 0 },
        exit: { x: 0, y: 5, z: 0 },
        walls: [
          { position: { x: -7, y: -1, z: 0 }, size: { x: 4, y: 1, z: 6 } },
          { position: { x: -3, y: 2, z: 0 }, size: { x: 1, y: 8, z: 6 } },
          { position: { x: 0, y: 4, z: 0 }, size: { x: 6, y: 1, z: 6 } },
        ],
      },
      5: {
        ballStart: { x: -8, y: 0, z: 0 },
        exit: { x: 8, y: 0, z: 0 },
        walls: [
          { position: { x: -8, y: -1, z: 0 }, size: { x: 3, y: 1, z: 6 } },
          { position: { x: -4, y: 2, z: 2 }, size: { x: 3, y: 1, z: 2 } },
          { position: { x: 0, y: 0, z: 0 }, size: { x: 3, y: 1, z: 6 } },
          { position: { x: 4, y: 2, z: -2 }, size: { x: 3, y: 1, z: 2 } },
          { position: { x: 8, y: -1, z: 0 }, size: { x: 3, y: 1, z: 6 } },
        ],
      },
    };

    return levels[levelNumber] || levels[1];
  }

  private createWall(
    position: { x: number; y: number; z: number },
    size: { x: number; y: number; z: number }
  ) {
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.8,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    this.levelObjects.push(mesh);

    const shape = new CANNON.Box(
      new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)
    );
    const body = new CANNON.Body({
      mass: 0,
      shape: shape,
      position: new CANNON.Vec3(position.x, position.y, position.z),
    });
    this.world.addBody(body);
    this.levelBodies.push(body);
  }

  private createExit(position: { x: number; y: number; z: number }) {
    const geometry = new THREE.CylinderGeometry(1, 1, 0.2, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: 0.8,
      metalness: 0.5,
      roughness: 0.2,
    });
    this.exitMesh = new THREE.Mesh(geometry, material);
    this.exitMesh.position.set(position.x, position.y, position.z);
    this.exitMesh.receiveShadow = true;
    this.scene.add(this.exitMesh);
    this.levelObjects.push(this.exitMesh);

    const light = new THREE.PointLight(0x00ff00, 1, 10);
    light.position.set(position.x, position.y + 2, position.z);
    this.scene.add(light);
  }

  private clearLevel() {
    this.levelObjects.forEach(obj => {
      this.scene.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => mat.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
    this.levelObjects = [];

    this.levelBodies.forEach(body => {
      this.world.removeBody(body);
    });
    this.levelBodies = [];

    this.exitMesh = null;
  }

  public getExitPosition(): { x: number; y: number; z: number } | null {
    if (!this.exitMesh) return null;
    return {
      x: this.exitMesh.position.x,
      y: this.exitMesh.position.y,
      z: this.exitMesh.position.z,
    };
  }

  public getCurrentLevel(): number {
    return this.currentLevel;
  }
}
