import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three-stdlib';

interface WallData {
  position: { x: number; y: number; z: number };
  size: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
}

interface EditorLevelData {
  ballStart: { x: number; y: number; z: number };
  exit: { x: number; y: number; z: number };
  walls: WallData[];
}

export class LevelEditor {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;

  private walls: THREE.Mesh[] = [];
  private ballStartMarker: THREE.Mesh | null = null;
  private exitMarker: THREE.Mesh | null = null;
  private selectedObject: THREE.Mesh | null = null;
  private gridHelper: THREE.GridHelper;

  private mode: 'wall' | 'spawn' | 'exit' | 'select' = 'select';
  private isPlacing: boolean = false;
  private placementPreview: THREE.Mesh | null = null;
  private previewHeight: number = 0;

  public onModeChange: ((mode: string) => void) | null = null;
  public onObjectSelected: ((object: any) => void) | null = null;

  constructor(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) {
    this.scene = scene;
    this.camera = camera;

    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 50;
    this.controls.maxPolarAngle = Math.PI / 2;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.gridHelper = new THREE.GridHelper(40, 40, 0x444444, 0x222222);
    this.scene.add(this.gridHelper);

    console.log('Level Editor initialized');
  }

  public update() {
    this.controls.update();
  }

  public setMode(mode: 'wall' | 'spawn' | 'exit' | 'select') {
    this.mode = mode;

    if (this.placementPreview) {
      this.scene.remove(this.placementPreview);
      this.placementPreview = null;
    }

    if (mode === 'wall') {
      this.createWallPreview();
    } else if (mode === 'spawn') {
      this.createSpawnPreview();
    } else if (mode === 'exit') {
      this.createExitPreview();
    }

    if (this.onModeChange) {
      this.onModeChange(mode);
    }
  }

  private createWallPreview() {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      wireframe: false,
    });
    this.placementPreview = new THREE.Mesh(geometry, material);
    this.placementPreview.visible = false;
    this.scene.add(this.placementPreview);
  }

  private createSpawnPreview() {
    const geometry = new THREE.SphereGeometry(0.5, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.7,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.5,
    });
    this.placementPreview = new THREE.Mesh(geometry, material);
    this.placementPreview.visible = false;
    this.scene.add(this.placementPreview);
  }

  private createExitPreview() {
    const geometry = new THREE.CylinderGeometry(1, 1, 0.2, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.7,
      emissive: 0x00ff00,
      emissiveIntensity: 0.5,
    });
    this.placementPreview = new THREE.Mesh(geometry, material);
    this.placementPreview.visible = false;
    this.scene.add(this.placementPreview);
  }

  public handleMouseMove(event: MouseEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    if (this.placementPreview && (this.mode !== 'select')) {
      this.updatePreviewPosition();
    }
  }

  private updatePreviewPosition() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -this.previewHeight);
    const intersectPoint = new THREE.Vector3();

    this.raycaster.ray.intersectPlane(plane, intersectPoint);

    if (intersectPoint && this.placementPreview) {
      intersectPoint.x = Math.round(intersectPoint.x);
      intersectPoint.y = this.previewHeight;
      intersectPoint.z = Math.round(intersectPoint.z);

      this.placementPreview.position.copy(intersectPoint);
      this.placementPreview.visible = true;
    }
  }

  public setPlacementHeight(height: number) {
    this.previewHeight = height;
    if (this.placementPreview) {
      this.updatePreviewPosition();
    }
  }

  public getPlacementHeight(): number {
    return this.previewHeight;
  }

  public handleClick(event: MouseEvent, canvas: HTMLCanvasElement) {
    console.log('handleClick called, current mode:', this.mode);
    const rect = canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    if (this.mode === 'wall') {
      this.placeWall();
    } else if (this.mode === 'spawn') {
      this.placeBallStart();
    } else if (this.mode === 'exit') {
      this.placeExit();
    } else if (this.mode === 'select') {
      this.selectObject();
    }
  }

  private placeWall() {
    if (!this.placementPreview) return;

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.8,
    });
    const wall = new THREE.Mesh(geometry, material);
    wall.position.copy(this.placementPreview.position);
    wall.castShadow = true;
    wall.receiveShadow = true;
    wall.userData.type = 'wall';

    this.scene.add(wall);
    this.walls.push(wall);

    console.log('Wall placed at', wall.position);
  }

  private placeBallStart() {
    if (!this.placementPreview) return;

    if (this.ballStartMarker) {
      this.scene.remove(this.ballStartMarker);
    }

    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
    });
    this.ballStartMarker = new THREE.Mesh(geometry, material);
    this.ballStartMarker.position.copy(this.placementPreview.position);
    this.ballStartMarker.castShadow = true;
    this.ballStartMarker.userData.type = 'spawn';

    this.scene.add(this.ballStartMarker);
    console.log('Ball start placed at', this.ballStartMarker.position);
  }

  private placeExit() {
    if (!this.placementPreview) return;

    if (this.exitMarker) {
      this.scene.remove(this.exitMarker);
    }

    const geometry = new THREE.CylinderGeometry(1, 1, 0.2, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: 0.8,
      metalness: 0.5,
      roughness: 0.2,
    });
    this.exitMarker = new THREE.Mesh(geometry, material);
    this.exitMarker.position.copy(this.placementPreview.position);
    this.exitMarker.receiveShadow = true;
    this.exitMarker.userData.type = 'exit';

    this.scene.add(this.exitMarker);

    const light = new THREE.PointLight(0x00ff00, 1, 10);
    light.position.set(
      this.exitMarker.position.x,
      this.exitMarker.position.y + 2,
      this.exitMarker.position.z
    );
    this.scene.add(light);

    console.log('Exit placed at', this.exitMarker.position);
  }

  private selectObject() {
    console.log('selectObject called, mode:', this.mode);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const selectableObjects = [...this.walls];
    if (this.ballStartMarker) selectableObjects.push(this.ballStartMarker);
    if (this.exitMarker) selectableObjects.push(this.exitMarker);

    console.log('Selectable objects count:', selectableObjects.length);

    const intersects = this.raycaster.intersectObjects(selectableObjects);
    console.log('Intersects found:', intersects.length);

    if (intersects.length > 0) {
      this.selectedObject = intersects[0].object as THREE.Mesh;

      this.highlightObject(this.selectedObject);

      console.log('Object selected:', this.selectedObject.userData.type, 'at position:', this.selectedObject.position);

      if (this.onObjectSelected) {
        this.onObjectSelected({
          type: this.selectedObject.userData.type,
          position: {
            x: this.selectedObject.position.x,
            y: this.selectedObject.position.y,
            z: this.selectedObject.position.z
          },
          scale: {
            x: this.selectedObject.scale.x,
            y: this.selectedObject.scale.y,
            z: this.selectedObject.scale.z
          },
          rotation: {
            x: this.selectedObject.rotation.x,
            y: this.selectedObject.rotation.y,
            z: this.selectedObject.rotation.z
          },
        });
      }
    } else {
      console.log('No object clicked, clearing selection');
      this.clearSelection();
    }
  }

  private highlightObject(object: THREE.Mesh) {
    const oldHelper = this.scene.getObjectByName('selection-helper');
    if (oldHelper) {
      this.scene.remove(oldHelper);
    }

    const box = new THREE.BoxHelper(object, 0xffff00);
    box.name = 'selection-helper';
    this.scene.add(box);
  }

  private clearSelection() {
    const helper = this.scene.getObjectByName('selection-helper');
    if (helper) {
      this.scene.remove(helper);
    }
    this.selectedObject = null;

    if (this.onObjectSelected) {
      this.onObjectSelected(null);
    }
  }

  public deleteSelected() {
    if (!this.selectedObject) return;

    const type = this.selectedObject.userData.type;

    if (type === 'wall') {
      const index = this.walls.indexOf(this.selectedObject);
      if (index > -1) {
        this.walls.splice(index, 1);
      }
    } else if (type === 'spawn') {
      this.ballStartMarker = null;
    } else if (type === 'exit') {
      this.exitMarker = null;
    }

    this.scene.remove(this.selectedObject);
    this.clearSelection();
    console.log('Object deleted');
  }

  public rotateSelected(axis: 'x' | 'y' | 'z', angle: number) {
    if (!this.selectedObject) return;

    if (axis === 'x') {
      this.selectedObject.rotation.x += angle;
    } else if (axis === 'y') {
      this.selectedObject.rotation.y += angle;
    } else if (axis === 'z') {
      this.selectedObject.rotation.z += angle;
    }

    console.log('Object rotated');
  }

  public scaleSelected(axis: 'x' | 'y' | 'z', delta: number) {
    if (!this.selectedObject || this.selectedObject.userData.type !== 'wall') return;

    if (axis === 'x') {
      this.selectedObject.scale.x = Math.max(0.5, this.selectedObject.scale.x + delta);
    } else if (axis === 'y') {
      this.selectedObject.scale.y = Math.max(0.5, this.selectedObject.scale.y + delta);
    } else if (axis === 'z') {
      this.selectedObject.scale.z = Math.max(0.5, this.selectedObject.scale.z + delta);
    }

    this.updateSelectionHelper();
    console.log('Object scaled');
  }

  public moveSelected(axis: 'x' | 'y' | 'z', delta: number) {
    if (!this.selectedObject) return;

    if (axis === 'x') {
      this.selectedObject.position.x += delta;
    } else if (axis === 'y') {
      this.selectedObject.position.y += delta;
    } else if (axis === 'z') {
      this.selectedObject.position.z += delta;
    }

    this.updateSelectionHelper();

    if (this.onObjectSelected) {
      this.onObjectSelected({
        type: this.selectedObject.userData.type,
        position: {
          x: this.selectedObject.position.x,
          y: this.selectedObject.position.y,
          z: this.selectedObject.position.z
        },
        scale: {
          x: this.selectedObject.scale.x,
          y: this.selectedObject.scale.y,
          z: this.selectedObject.scale.z
        },
        rotation: {
          x: this.selectedObject.rotation.x,
          y: this.selectedObject.rotation.y,
          z: this.selectedObject.rotation.z
        },
      });
    }

    console.log('Object moved');
  }

  public setSelectedPosition(x: number, y: number, z: number) {
    if (!this.selectedObject) return;

    this.selectedObject.position.set(x, y, z);
    this.updateSelectionHelper();

    if (this.onObjectSelected) {
      this.onObjectSelected({
        type: this.selectedObject.userData.type,
        position: {
          x: this.selectedObject.position.x,
          y: this.selectedObject.position.y,
          z: this.selectedObject.position.z
        },
        scale: {
          x: this.selectedObject.scale.x,
          y: this.selectedObject.scale.y,
          z: this.selectedObject.scale.z
        },
        rotation: {
          x: this.selectedObject.rotation.x,
          y: this.selectedObject.rotation.y,
          z: this.selectedObject.rotation.z
        },
      });
    }
  }

  public setSelectedRotation(x: number, y: number, z: number) {
    if (!this.selectedObject) return;

    this.selectedObject.rotation.set(x, y, z);
    this.updateSelectionHelper();

    if (this.onObjectSelected) {
      this.onObjectSelected({
        type: this.selectedObject.userData.type,
        position: {
          x: this.selectedObject.position.x,
          y: this.selectedObject.position.y,
          z: this.selectedObject.position.z
        },
        scale: {
          x: this.selectedObject.scale.x,
          y: this.selectedObject.scale.y,
          z: this.selectedObject.scale.z
        },
        rotation: {
          x: this.selectedObject.rotation.x,
          y: this.selectedObject.rotation.y,
          z: this.selectedObject.rotation.z
        },
      });
    }
  }

  public setSelectedScale(x: number, y: number, z: number) {
    if (!this.selectedObject || this.selectedObject.userData.type !== 'wall') return;

    this.selectedObject.scale.set(
      Math.max(0.5, x),
      Math.max(0.5, y),
      Math.max(0.5, z)
    );
    this.updateSelectionHelper();

    if (this.onObjectSelected) {
      this.onObjectSelected({
        type: this.selectedObject.userData.type,
        position: {
          x: this.selectedObject.position.x,
          y: this.selectedObject.position.y,
          z: this.selectedObject.position.z
        },
        scale: {
          x: this.selectedObject.scale.x,
          y: this.selectedObject.scale.y,
          z: this.selectedObject.scale.z
        },
        rotation: {
          x: this.selectedObject.rotation.x,
          y: this.selectedObject.rotation.y,
          z: this.selectedObject.rotation.z
        },
      });
    }
  }

  private updateSelectionHelper() {
    if (!this.selectedObject) return;

    const oldHelper = this.scene.getObjectByName('selection-helper');
    if (oldHelper) {
      this.scene.remove(oldHelper);
    }

    const box = new THREE.BoxHelper(this.selectedObject, 0xffff00);
    box.name = 'selection-helper';
    this.scene.add(box);
  }

  public getSelectedObject() {
    return this.selectedObject;
  }

  public exportLevel(): EditorLevelData {
    const levelData: EditorLevelData = {
      ballStart: this.ballStartMarker
        ? {
            x: this.ballStartMarker.position.x,
            y: this.ballStartMarker.position.y,
            z: this.ballStartMarker.position.z
          }
        : { x: 0, y: 0, z: 0 },
      exit: this.exitMarker
        ? {
            x: this.exitMarker.position.x,
            y: this.exitMarker.position.y,
            z: this.exitMarker.position.z
          }
        : { x: 5, y: 0, z: 0 },
      walls: this.walls.map(wall => ({
        position: {
          x: wall.position.x,
          y: wall.position.y,
          z: wall.position.z,
        },
        size: {
          x: wall.scale.x * 2,
          y: wall.scale.y * 2,
          z: wall.scale.z * 2,
        },
        rotation: {
          x: wall.rotation.x,
          y: wall.rotation.y,
          z: wall.rotation.z,
        },
      })),
    };

    console.log('Level exported:', levelData);
    return levelData;
  }

  public importLevel(levelData: EditorLevelData) {
    this.clearLevel();

    levelData.walls.forEach(wallData => {
      const geometry = new THREE.BoxGeometry(wallData.size.x, wallData.size.y, wallData.size.z);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.8,
      });
      const wall = new THREE.Mesh(geometry, material);
      wall.position.set(wallData.position.x, wallData.position.y, wallData.position.z);

      if (wallData.rotation) {
        wall.rotation.set(wallData.rotation.x, wallData.rotation.y, wallData.rotation.z);
      }

      wall.castShadow = true;
      wall.receiveShadow = true;
      wall.userData.type = 'wall';

      this.scene.add(wall);
      this.walls.push(wall);
    });

    const spawnGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const spawnMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.5,
    });
    this.ballStartMarker = new THREE.Mesh(spawnGeometry, spawnMaterial);
    this.ballStartMarker.position.set(
      levelData.ballStart.x,
      levelData.ballStart.y,
      levelData.ballStart.z
    );
    this.ballStartMarker.userData.type = 'spawn';
    this.scene.add(this.ballStartMarker);

    const exitGeometry = new THREE.CylinderGeometry(1, 1, 0.2, 32);
    const exitMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: 0.8,
    });
    this.exitMarker = new THREE.Mesh(exitGeometry, exitMaterial);
    this.exitMarker.position.set(levelData.exit.x, levelData.exit.y, levelData.exit.z);
    this.exitMarker.userData.type = 'exit';
    this.scene.add(this.exitMarker);

    console.log('Level imported');
  }

  public clearLevel() {
    this.walls.forEach(wall => {
      this.scene.remove(wall);
      if (wall.geometry) wall.geometry.dispose();
      if (wall.material) {
        if (Array.isArray(wall.material)) {
          wall.material.forEach(mat => mat.dispose());
        } else {
          wall.material.dispose();
        }
      }
    });
    this.walls = [];

    if (this.ballStartMarker) {
      this.scene.remove(this.ballStartMarker);
      this.ballStartMarker = null;
    }
    if (this.exitMarker) {
      this.scene.remove(this.exitMarker);
      this.exitMarker = null;
    }

    this.clearSelection();
    console.log('Level cleared');
  }

  public cleanup() {
    this.clearLevel();

    if (this.placementPreview) {
      this.scene.remove(this.placementPreview);
    }

    if (this.gridHelper) {
      this.scene.remove(this.gridHelper);
    }

    this.controls.dispose();
  }
}
