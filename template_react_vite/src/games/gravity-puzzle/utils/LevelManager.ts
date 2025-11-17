import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import levelsData from '../levels/levels.json';

interface LevelData {
  ballStart: { x: number; y: number; z: number };
  exit: { x: number; y: number; z: number };
  walls: Array<{
    position: { x: number; y: number; z: number };
    size: { x: number; y: number; z: number };
  }>;
  checkpoints?: Array<{ x: number; y: number; z: number }>;
}

export class LevelManager {
  private scene: THREE.Scene;
  private world: CANNON.World;
  private currentLevel: number = 1;
  private levelObjects: THREE.Mesh[] = [];
  private levelBodies: CANNON.Body[] = [];
  private exitMesh: THREE.Mesh | null = null;
  private levels: Record<number, LevelData>;
  private checkpointMeshes: THREE.Mesh[] = [];
  private checkpointLights: THREE.PointLight[] = [];

  constructor(scene: THREE.Scene, world: CANNON.World) {
    this.scene = scene;
    this.world = world;
    this.levels = levelsData as Record<number, LevelData>;
  }

  public loadLevel(levelNumber: number): LevelData {
    this.clearLevel();

    this.currentLevel = levelNumber;
    const levelData = this.getLevelData(levelNumber);

    levelData.walls.forEach(wall => {
      this.createWall(wall.position, wall.size);
    });

    this.createExit(levelData.exit);

    if (levelData.checkpoints) {
      levelData.checkpoints.forEach(checkpoint => {
        this.createCheckpoint(checkpoint);
      });
    }

    return levelData;
  }

  private getLevelData(levelNumber: number): LevelData {
    return this.levels[levelNumber] || this.levels[1];
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

  private createCheckpoint(position: { x: number; y: number; z: number }) {
    const geometry = new THREE.SphereGeometry(0.7, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.5,
      metalness: 0.3,
      roughness: 0.4,
      transparent: true,
      opacity: 0.7,
    });
    const checkpoint = new THREE.Mesh(geometry, material);
    checkpoint.position.set(position.x, position.y, position.z);
    checkpoint.userData.activated = false;
    checkpoint.userData.type = 'checkpoint';
    this.scene.add(checkpoint);
    this.checkpointMeshes.push(checkpoint);
    this.levelObjects.push(checkpoint);

    const light = new THREE.PointLight(0xff0000, 0.5, 10);
    light.position.set(position.x, position.y, position.z);
    this.scene.add(light);
    this.checkpointLights.push(light);
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

    this.checkpointLights.forEach(light => {
      this.scene.remove(light);
    });
    this.checkpointLights = [];
    this.checkpointMeshes = [];

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

  public getCheckpoints(): THREE.Mesh[] {
    return this.checkpointMeshes;
  }

  public activateCheckpoint(index: number) {
    if (index >= 0 && index < this.checkpointMeshes.length) {
      const checkpoint = this.checkpointMeshes[index];
      const light = this.checkpointLights[index];

      if (!checkpoint.userData.activated) {
        checkpoint.userData.activated = true;

        // Change color to green
        const material = checkpoint.material as THREE.MeshStandardMaterial;
        material.color.setHex(0x00ff00);
        material.emissive.setHex(0x00ff00);

        light.color.setHex(0x00ff00);
      }
    }
  }

  public areAllCheckpointsActivated(): boolean {
    if (this.checkpointMeshes.length === 0) return true;
    return this.checkpointMeshes.every(cp => cp.userData.activated);
  }
}
