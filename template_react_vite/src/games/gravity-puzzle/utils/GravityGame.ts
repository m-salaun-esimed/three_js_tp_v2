import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { LevelManager } from './LevelManager';

export class GravityGame {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private world: CANNON.World;
  private levelManager: LevelManager;
  private isMouseDown = false;
  private lastMouseX = 0;
  private lastMouseY = 0;
  private cameraAngleX = 0;
  private cameraAngleY = 0;
  private cameraDistance = 20;
  private ball: THREE.Mesh | null = null;
  private ballBody: CANNON.Body | null = null;

  private currentGravity: 'up' | 'down' | 'left' | 'right' = 'down';
  private moveCount: number = 0;
  private isAnimating: boolean = false;
  private isEditable: boolean = false;
  private boundKeyDown: ((e: KeyboardEvent) => void) | null = null;
  private _isCleanedUp: boolean = false;

  public onMoveCountUpdate: ((count: number) => void) | null = null;
  public onLevelComplete: (() => void) | null = null;
  public onNextLevel: (() => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a2e);
    this.scene.fog = new THREE.Fog(0x1a1a2e, 20, 50);

    const width = container.clientWidth;
    const height = container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(0, 15, 15);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.world = new CANNON.World();
    this.world.gravity.set(0, -10, 0);

    this.setupLights();

    this.levelManager = new LevelManager(this.scene, this.world);

    this.loadLevel(1);

    this.boundKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this.boundKeyDown);
    this.container.addEventListener('mousedown', this.onMouseDown);
    this.container.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    this.container.addEventListener('wheel', this.onMouseWheel);
    this.animate();

    console.log('Gravity Puzzle initialized');
  }

  private setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = -20;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    this.scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x4b0082, 0.3);
    fillLight.position.set(-10, 10, -10);
    this.scene.add(fillLight);
  }

  private loadLevel(levelNumber: number) {
    if (this.ball) {
      this.scene.remove(this.ball);
      this.ball = null;
    }
    if (this.ballBody) {
      this.world.removeBody(this.ballBody);
      this.ballBody = null;
    }

    const levelData = this.levelManager.loadLevel(levelNumber);

    this.createBall(levelData.ballStart);

    this.moveCount = 0;
    this.currentGravity = 'down';
    this.world.gravity.set(0, -10, 0);

    if (this.onMoveCountUpdate) {
      this.onMoveCountUpdate(this.moveCount);
    }
  }

  private createBall(position: { x: number; y: number; z: number }) {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
    });
    this.ball = new THREE.Mesh(geometry, material);
    this.ball.position.set(position.x, position.y, position.z);
    this.ball.castShadow = true;
    this.scene.add(this.ball);

    const shape = new CANNON.Sphere(0.5);
    this.ballBody = new CANNON.Body({
      mass: 1,
      shape: shape,
      position: new CANNON.Vec3(position.x, position.y, position.z),
      linearDamping: 0.3,
      angularDamping: 0.3,
    });
    this.world.addBody(this.ballBody);
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (this.isAnimating) return;

    const key = event.key.toLowerCase();

    if (key === 'r') {
      this.restartLevel();
      return;
    }

    let newGravity: 'up' | 'down' | 'left' | 'right' | 'forward' | 'backward' | null = null;

    if (key === 'arrowup' || key === 'z') {
      newGravity = 'up';
    } else if (key === 'arrowdown' || key === 's') {
      newGravity = 'down';
    } else if (key === 'arrowleft' || key === 'q') {
      newGravity = 'left';
    } else if (key === 'arrowright' || key === 'd') {
      newGravity = 'right';
    } else if (key === 'a') {
      newGravity = 'forward';
    } else if (key === 'e') {
      newGravity = 'backward';
    }

    if (newGravity && newGravity !== this.currentGravity) {
      this.changeGravity(newGravity);
    }
  }


  private changeGravity(direction: 'up' | 'down' | 'left' | 'right' | 'forward' | 'backward') {
    this.currentGravity = direction;
    this.moveCount++;

    if (this.onMoveCountUpdate) {
      this.onMoveCountUpdate(this.moveCount);
    }

    switch (direction) {
      case 'up':
        this.world.gravity.set(0, 10, 0);
        break;
      case 'down':
        this.world.gravity.set(0, -10, 0);
        break;
      case 'left':
        this.world.gravity.set(-10, 0, 0);
        break;
      case 'right':
        this.world.gravity.set(10, 0, 0);
        break;
      case 'forward':     // Z+
        this.world.gravity.set(0, 0, 10);
        break;
      case 'backward':    // Z-
        this.world.gravity.set(0, 0, -10);
        break;
    }
  }


  private checkWinCondition() {
    if (!this.ball || !this.ballBody) return;

    const exitPos = this.levelManager.getExitPosition();
    if (!exitPos) return;

    const ballPos = this.ballBody.position;
    const distance = Math.sqrt(
      Math.pow(ballPos.x - exitPos.x, 2) +
      Math.pow(ballPos.y - exitPos.y, 2) +
      Math.pow(ballPos.z - exitPos.z, 2)
    );

    if (distance < 1) {
      console.log('Niveau complété !');
      if (this.onLevelComplete) {
        this.onLevelComplete();
      }
    }
  }

  public restartLevel() {
    const currentLevel = this.levelManager.getCurrentLevel();
    this.loadLevel(currentLevel);
  }

  public nextLevel() {
    const nextLevelNumber = this.levelManager.getCurrentLevel() + 1;
    this.loadLevel(nextLevelNumber);

    if (this.onNextLevel) {
      this.onNextLevel();
    }
  }

  private animate = () => {
    if (this._isCleanedUp) return;

    requestAnimationFrame(this.animate);

    this.world.step(1 / 60);

    if (this.ball && this.ballBody) {
      this.ball.position.copy(this.ballBody.position as any);
      this.ball.quaternion.copy(this.ballBody.quaternion as any);
    }

    this.checkWinCondition();
    const target = new THREE.Vector3(0, 0, 0);

    const x = this.cameraDistance * Math.cos(this.cameraAngleY) * Math.sin(this.cameraAngleX);
    const y = this.cameraDistance * Math.sin(this.cameraAngleY);
    const z = this.cameraDistance * Math.cos(this.cameraAngleY) * Math.cos(this.cameraAngleX);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(target);
    this.renderer.render(this.scene, this.camera);
  };

  public cleanup() {
    this.container.removeEventListener('mousedown', this.onMouseDown);
    this.container.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.container.removeEventListener('wheel', this.onMouseWheel);
    if (this._isCleanedUp) {
      console.log('Already cleaned up, skipping...');
      return;
    }
    this._isCleanedUp = true;

    console.log('Cleaning up Gravity Game...');

    if (this.boundKeyDown) {
      window.removeEventListener('keydown', this.boundKeyDown);
      this.boundKeyDown = null;
    }

    if (this.renderer && this.renderer.domElement) {
      const canvas = this.renderer.domElement;
      if (canvas.parentNode && canvas.parentNode.contains(canvas)) {
        try {
          canvas.parentNode.removeChild(canvas);
          console.log('Canvas removed from DOM');
        } catch (e) {
          console.warn('Error removing canvas:', e);
        }
      }
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    while (this.world.bodies.length > 0) {
      this.world.removeBody(this.world.bodies[0]);
    }

    console.log('Gravity Game cleaned up successfully');
  }

  private onMouseDown = (e: MouseEvent) => {
    this.isMouseDown = true;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
  };

  private onMouseUp = () => {
    this.isMouseDown = false;
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isMouseDown) return;

    const dx = e.clientX - this.lastMouseX;
    const dy = e.clientY - this.lastMouseY;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;

    const sensitivity = 0.005;

    this.cameraAngleX -= dx * sensitivity;
    this.cameraAngleY -= dy * sensitivity;

    // Clamp vertical look
    this.cameraAngleY = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.cameraAngleY));
  };

  private onMouseWheel = (e: WheelEvent) => {
    this.cameraDistance += e.deltaY * 0.02;
    this.cameraDistance = Math.max(5, Math.min(60, this.cameraDistance));
  };

}
