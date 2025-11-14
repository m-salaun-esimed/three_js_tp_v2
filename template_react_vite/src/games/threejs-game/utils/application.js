import * as THREE from 'three/webgpu'
import * as CANNON from 'cannon-es'
import { Scene } from './scene.js'
import { Camera } from './camera.js'
import { UI } from './ui.js'
import { PhysicsWorld } from './physics.js'
import { CheeseCollector } from './cheeseCollector.js'

export class Application {

    constructor(container = null) {
        this._isCleanedUp = false
        this.container = container || document.body
        this.renderer = new THREE.WebGPURenderer({ antialias: true })

        const width = this.container === document.body ? window.innerWidth : this.container.clientWidth
        const height = this.container === document.body ? window.innerHeight : this.container.clientHeight

        this.renderer.setSize(width, height)
        this.renderer.shadowMap.enabled = true
        this.container.appendChild(this.renderer.domElement)

        this.renderer.setAnimationLoop(this.render.bind(this))

        this.selectedObject = null
        this.selectedMesh = null
        this.selectedMeshMaterial = null
        this.raycaster = new THREE.Raycaster()
        this.pointer = new THREE.Vector2()
        this.moveSelectedObject = false

        this.initParams()

        this.sceneObj = new Scene()
        this.sceneObj.addAmbiantLight()
        this.sceneObj.addDirectionalLight()
        this.sceneObj.addSkybox(this.skyboxParams.file)
        this.sceneObj.addGround(this.groundParams.texture, this.groundParams.repeats)

        this.physics = new PhysicsWorld()
        this.cameraObj = new Camera(this.renderer)

        this.level = 1
        this.cheeseCollector = new CheeseCollector(this.sceneObj, this.physics)

        this.sceneObj.loadScene('/tp_three.js/scenes/scene_1.json').then(objects => {
            const cat = objects.find(obj => obj.userData.modelName === 'cat')
            if (cat) {
                cat.userData.manualRotation = true

                this.catBody = this.physics.addBox(cat, 5, {
                    sizeX: 0.6,
                    sizeY: 2.2,
                    sizeZ: 0.6,
                    friction: 0.1,
                    restitution: 0,
                    linearDamping: 0.01,
                })

                this.catBody.angularFactor = new CANNON.Vec3(0, 1, 0)
                this.catBody.updateMassProperties()

                this.cameraObj.setFollowTarget(cat)
                this.cameraObj.setPhysicsBody(this.catBody)
                this.cameraObj.setPhysicsWorld(this.physics)
                this.cameraObj.enableWASD()

                this.cheeseCollector.setCat(cat)
                console.log('Cat found and set as player character')
            }

            const cheeses = objects.filter(obj => obj.userData.modelName === 'cheese_wedge')
            cheeses.forEach(cheese => {
                this.physics.addBox(cheese, 0.5, {
                    friction: 0.4,
                    restitution: 0.3
                })
            })

            this.cheeseCollector.addCheeses(cheeses)
        })

        this.ui = new UI()


        this.cheeseCollector.onScoreUpdate = (score, maxScore) => {
        }
        this.cheeseCollector.onScoreComplete = () => {
            this.levelUp()
        }

        this.ui.addSkyboxUI(this.skyboxFiles, this.skyboxParams, this.sceneObj.addSkybox.bind(this.sceneObj))
        this.ui.addGroundUI(this.groundTextures, this.groundParams, this.sceneObj.changeGround.bind(this.sceneObj))
        this.ui.addSunUI(this.sceneObj.directionalLight)
        this.ui.addCameraControlsUI(this.cameraObj, this.renderer.domElement)
        this.ui.addObjectUI()
        this.ui.addDuplicateButton(() => {
            if (this.selectedObject) {
                const originalMesh = this.selectedMesh
                const originalMaterial = this.selectedMeshMaterial

                if (originalMesh && originalMaterial) {
                    originalMesh.material = originalMaterial
                }

                const duplicate = this.sceneObj.duplicateObject(this.selectedObject)

                if (originalMesh && originalMaterial) {
                    originalMesh.material = new THREE.MeshPhongMaterial({
                        color: 0xff0000,
                        emissive: 0xff0000,
                        emissiveIntensity: 0.5
                    })
                }

                if (duplicate) {
                    if (originalMesh && originalMaterial) {
                        originalMesh.material = originalMaterial
                    }

                    this.selectedObject = duplicate

                    duplicate.traverse(o => {
                        if (o.isMesh && o.userData.isSelectable) {
                            this.selectedMesh = o
                            this.selectedMeshMaterial = o.material

                            o.material = new THREE.MeshPhongMaterial({
                                color: 0xff0000,
                                emissive: 0xff0000,
                                emissiveIntensity: 0.5
                            })
                        }
                    })

                    this.ui.updateObjectUI(this.selectedObject)
                }
            }
        })
        this.ui.addDeleteButton(() => {
            if (this.selectedObject) {
                this.sceneObj.removeObject(this.selectedObject)
                if (this.selectedMesh && this.selectedMeshMaterial) {
                    this.selectedMesh.material = this.selectedMeshMaterial
                }
                this.selectedObject = null
                this.selectedMesh = null
                this.selectedMeshMaterial = null
                this.ui.updateObjectUI(null)
            }
        })

        const importInput = document.createElement('input')
        importInput.type = 'file'
        importInput.accept = '.json,application/json'
        importInput.style.display = 'none'
        document.body.appendChild(importInput)
        importInput.addEventListener('change', async (event) => {
            await this.sceneObj.importScene(event, {
                skybox: this.skyboxParams,
                ground: this.groundParams
            })
            importInput.value = ''
        })

        this.ui.addClearButton(() => {
            this.sceneObj.clearScene()
        })

        this.ui.addImportButton(() => {
            importInput.click()
        })

        this.ui.addExportButton(() => {
            this.sceneObj.exportScene({
                skybox: {
                    file: this.skyboxParams.file,
                },
                ground: {
                    texture: this.groundParams.texture,
                    repeats: this.groundParams.repeats
                }
            })
        })

        this.ui.addModelSelector(this.availableModels, async (modelName) => {
            const position = { x: 0, y: 0, z: 0 }

            if (this.cameraObj.camera) {
                const direction = new THREE.Vector3()
                this.cameraObj.camera.getWorldDirection(direction)
                position.x = this.cameraObj.camera.position.x + direction.x * 5
                position.z = this.cameraObj.camera.position.z + direction.z * 5
            }

            await this.sceneObj.addModel(modelName, position)
        })

        this.boundOnPointerClick = this.onPointerClick.bind(this)
        this.boundOnKeyDown = this.onKeyDown.bind(this)
        this.boundOnKeyUp = this.onKeyUp.bind(this)
        this.boundOnPointerMove = this.onPointerMove.bind(this)

        window.addEventListener('click', this.boundOnPointerClick)
        window.addEventListener('keydown', this.boundOnKeyDown)
        window.addEventListener('keyup', this.boundOnKeyUp)
        window.addEventListener('mousemove', this.boundOnPointerMove)

        this.boundPointerLockChange = () => {
            this.cameraObj.isMouseLocked = (document.pointerLockElement === this.renderer.domElement)
        }
        document.addEventListener('pointerlockchange', this.boundPointerLockChange)
    }

    onPointerClick(event) {
        if (this.cameraObj.wasdEnabled) {
            return
        }

        if (event.target.closest('.lil-gui')) {
            return
        }

        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

        this.raycaster.setFromCamera(this.pointer, this.cameraObj.camera)

        const intersects = this.raycaster.intersectObjects(this.sceneObj.scene.children, true)

        if (this.selectedMesh && this.selectedMeshMaterial) {
            this.selectedMesh.material = this.selectedMeshMaterial
        }

        this.selectedMesh = null
        this.selectedObject = null
        this.selectedMeshMaterial = null

        for (const intersect of intersects) {
            if (intersect.object.userData.isSelectable) {
                this.selectedMesh = intersect.object
                this.selectedObject = intersect.object.userData.object
                this.selectedMeshMaterial = this.selectedMesh.material

                this.selectedMesh.material = new THREE.MeshPhongMaterial({
                    color: 0xff0000,
                    emissive: 0xff0000,
                    emissiveIntensity: 0.5
                })

                console.log('Objet sélectionné:', this.selectedObject.name || 'Unnamed')
                break
            }
        }
        this.ui.updateObjectUI(this.selectedObject)
    }

    levelUp() {
        this.level++
        if (this.level >= 2) {
            const newSpeed = 8 + (this.level - 1) * 2
            this.cameraObj.increaseMoveSpeed(newSpeed)
            console.log(`NIVEAU ${this.level} ATTEINT! Nouvelle vitesse: ${newSpeed}`)
        } else {
            console.log(`NIVEAU ${this.level} ATTEINT!`)
        }
    }

    onKeyDown(event) {
        this.cameraObj.handleKeyDown(event)

        if (this.cameraObj.wasdEnabled && (event.key === 'e' || event.key === 'E')) {
            const nearestCheese = this.cheeseCollector.checkNearestCheese()
            if (nearestCheese) {
                this.cheeseCollector.collectCheese(nearestCheese)
            }
        }

        if (!this.cameraObj.wasdEnabled) {
            if (event.key === 'g' || event.key === 'G') {
                if (this.selectedObject) {
                    this.moveSelectedObject = !this.moveSelectedObject
                    console.log('Mode déplacement:', this.moveSelectedObject ? 'activé' : 'désactivé')
                }
            }
        }
        if (!this.cameraObj.wasdEnabled) {
            if (event.key === 'd' || event.key === "D") {
                if (this.selectedObject) {
                    const originalMesh = this.selectedMesh
                    const originalMaterial = this.selectedMeshMaterial

                    if (originalMesh && originalMaterial) {
                        originalMesh.material = originalMaterial
                    }

                    const duplicate = this.sceneObj.duplicateObject(this.selectedObject)

                    if (duplicate) {
                        if (originalMesh && originalMaterial) {
                            originalMesh.material = originalMaterial
                        }

                        this.selectedObject = duplicate

                        duplicate.traverse(o => {
                            if (o.isMesh && o.userData.isSelectable) {
                                this.selectedMesh = o
                                this.selectedMeshMaterial = o.material

                                o.material = new THREE.MeshPhongMaterial({
                                    color: 0xff0000,
                                    emissive: 0xff0000,
                                    emissiveIntensity: 0.5
                                })
                            }
                        })

                        this.ui.updateObjectUI(this.selectedObject)
                        console.log('Objet dupliqué avec succès')
                    }
                }
            }
        }
    }

    onKeyUp(event) {
        this.cameraObj.handleKeyUp(event)
    }

    onPointerMove(event) {
        this.cameraObj.handleMouseMove(event)

        if (!this.cameraObj.wasdEnabled && this.selectedObject && this.moveSelectedObject) {
            this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
            this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

            this.raycaster.setFromCamera(this.pointer, this.cameraObj.camera)

            const intersects = this.raycaster.intersectObject(this.sceneObj.ground)

            if (intersects.length > 0) {
                const point = intersects[0].point
                this.selectedObject.position.x = point.x
                this.selectedObject.position.z = point.z

                this.ui.updateObjectUI(this.selectedObject)
            }
        }
    }

    initParams() {
        this.groundTextures = [
            'aerial_grass_rock',
            'brown_mud_leaves_01',
            'forest_floor',
            'forrest_ground_01',
            'gravelly_sand'
        ]

        this.skyboxFiles = [
            'DaySkyHDRI019A_2K-TONEMAPPED.jpg',
            'DaySkyHDRI050A_2K-TONEMAPPED.jpg',
            'NightSkyHDRI009_2K-TONEMAPPED.jpg'
        ]

        this.availableModels = [
            'birch1',
            'bush1',
            'bush2',
            'cat',
            'cheese_wedge',
            'flowers1',
            'grass1',
            'log1',
            'oak1',
            'oak2',
            'oak3',
            'pine1',
            'rat',
            'spruce1',
            'stone1',
            'stone2',
            'stump1'
        ]

        this.skyboxParams = {
            file: this.skyboxFiles[2]
        }

        this.groundParams = {
            texture: this.groundTextures[0],
            repeats: 100
        }
    }

    render() {
        this.physics.update(1 / 60)
        this.cameraObj.update()
        this.renderer.render(this.sceneObj.scene, this.cameraObj.camera)
    }

    cleanup() {
        if (this._isCleanedUp) {
            console.log('Already cleaned up, skipping...')
            return
        }
        this._isCleanedUp = true

        console.log('Starting game cleanup...')


        if (this.renderer) {
            this.renderer.setAnimationLoop(null)
        }

        if (this.boundOnPointerClick) {
            window.removeEventListener('click', this.boundOnPointerClick)
            this.boundOnPointerClick = null
        }
        if (this.boundOnKeyDown) {
            window.removeEventListener('keydown', this.boundOnKeyDown)
            this.boundOnKeyDown = null
        }
        if (this.boundOnKeyUp) {
            window.removeEventListener('keyup', this.boundOnKeyUp)
            this.boundOnKeyUp = null
        }
        if (this.boundOnPointerMove) {
            window.removeEventListener('mousemove', this.boundOnPointerMove)
            this.boundOnPointerMove = null
        }
        if (this.boundPointerLockChange) {
            document.removeEventListener('pointerlockchange', this.boundPointerLockChange)
            this.boundPointerLockChange = null
        }

        if (this.renderer && this.renderer.domElement) {
            const canvas = this.renderer.domElement
            if (canvas.parentNode && canvas.parentNode.contains(canvas)) {
                try {
                    canvas.parentNode.removeChild(canvas)
                    console.log('Canvas removed from DOM')
                } catch (e) {
                    console.warn('Error removing canvas:', e)
                }
            } else {
                console.log('Canvas already removed from DOM')
            }
        }

        // Nettoyer l'UI (lil-gui)
        if (this.ui) {
            try {
                this.ui.destroy()
            } catch (e) {
                console.warn('Error destroying UI:', e)
            }
            this.ui = null
        }

        if (this.sceneObj) {
            try {
                this.sceneObj.clearScene()
            } catch (e) {
                console.warn('Error clearing scene:', e)
            }
        }

        if (this.renderer) {
            try {
                this.renderer.dispose()
            } catch (e) {
                console.warn('Error disposing renderer:', e)
            }
            this.renderer = null
        }

        console.log('Game cleaned up successfully')
    }

}