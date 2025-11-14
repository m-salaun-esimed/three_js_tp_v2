import * as THREE from 'three/webgpu'
import { createStandardMaterial, loadGltf, textureloader } from './tools.js'

export class Scene {

    constructor() {
        this.scene = new THREE.Scene()
        this.loadedModels = {}
        this.ground = null
        this.directionalLight = null
    }

    addCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            flatShading: true,
        })
        const cube = new THREE.Mesh(geometry, material)
        cube.position.y = 1
        this.scene.add(cube)
    }

    addAmbiantLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
        this.scene.add(ambientLight)
    }

    addDirectionalLight() {
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 2.0)
        this.directionalLight.position.set(10, 100, 10)
        this.directionalLight.castShadow = true

        this.directionalLight.shadow.mapSize.width = 2048
        this.directionalLight.shadow.mapSize.height = 2048
        this.directionalLight.shadow.camera.left = -50
        this.directionalLight.shadow.camera.right = 50
        this.directionalLight.shadow.camera.top = 50
        this.directionalLight.shadow.camera.bottom = -50
        this.directionalLight.shadow.camera.near = 0
        this.directionalLight.shadow.camera.far = 100

        this.scene.add(this.directionalLight)

        const helper = new THREE.DirectionalLightHelper(this.directionalLight, 5)
        this.scene.add(helper)
    }

    addGround(texture, repeats) {
        const geometry = new THREE.PlaneGeometry(5000, 5000)
        const material = createStandardMaterial(texture, repeats)
        this.ground = new THREE.Mesh(geometry, material)
        this.ground.rotation.x = -Math.PI / 2
        this.ground.position.y = -0.5
        this.ground.receiveShadow = true
        this.scene.add(this.ground)
    }

    changeGround(texture, repeats) {
        if (this.ground) {
            const newMaterial = createStandardMaterial(texture, repeats)
            this.ground.material.dispose()
            this.ground.material = newMaterial
        }
    }

    addSkybox(filename) {
        const texture = textureloader.load(`/tp_three.js/skybox/${filename}`)
        texture.mapping = THREE.EquirectangularReflectionMapping
        this.scene.background = texture
    }

    async addModel(modelName, position = { x: 0, y: 0, z: 0 }) {
        try {
            if (!this.loadedModels[modelName]) {
                this.loadedModels[modelName] = await loadGltf(modelName)
            }

            const mesh = this.loadedModels[modelName].clone()
            mesh.position.set(position.x, position.y, position.z)
            mesh.userData.isExportable = true

            mesh.traverse(o => {
                if (o.isMesh) {
                    o.userData = {
                        isSelectable: true,
                        object: mesh,
                    }
                }
            })

            this.scene.add(mesh)
            console.log(`Added model: ${modelName}`)
            return mesh
        } catch (error) {
            console.error(`Error adding model ${modelName}:`, error)
            return null
        }
    }

    duplicateObject(object) {
        if (!object || !object.userData.isExportable) {
            console.warn('Cannot duplicate this object')
            return null
        }

        const savedUserData = []
        object.traverse((o) => {
            savedUserData.push(o.userData)
            o.userData = {}
        })

        const duplicate = object.clone(true)

        let index = 0
        object.traverse((o) => {
            o.userData = savedUserData[index++]
        })

        duplicate.position.copy(object.position)
        duplicate.position.x += 1
        duplicate.position.z += 1

        duplicate.rotation.copy(object.rotation)
        duplicate.scale.copy(object.scale)

        duplicate.userData = {
            isExportable: true
        }

        duplicate.traverse((o) => {
            if (o.isMesh) {
                if (o.material) {
                    o.material = o.material.clone()
                }

                o.userData = {
                    isSelectable: true,
                    object: duplicate,
                }
            }
        })

        this.scene.add(duplicate)
        console.log(`Duplicated object: ${object.name || 'Unnamed'}`)
        return duplicate
    }

    removeObject(object) {
        if (object && object.userData.isExportable) {
            this.scene.remove(object)
            object.traverse(child => {
                if (child.isMesh) {
                    if (child.geometry) child.geometry.dispose()
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(material => material.dispose())
                        } else {
                            child.material.dispose()
                        }
                    }
                }
            })
            console.log(`Removed object: ${object.name || 'Unnamed'}`)
            return true
        }
        return false
    }

    clearScene() {
        const objectsToRemove = []
        this.scene.traverse(object => {
            if (object.userData && object.userData.isExportable) {
                objectsToRemove.push(object)
            }
        })

        objectsToRemove.forEach(object => {
            this.scene.remove(object)
            object.traverse(child => {
                if (child.isMesh) {
                    if (child.geometry) child.geometry.dispose()
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(material => material.dispose())
                        } else {
                            child.material.dispose()
                        }
                    }
                }
            })
        })

        console.log(`Cleared ${objectsToRemove.length} objects from scene`)
    }

    async loadScene(url) {
        try {
            const response = await fetch(url)
            const data = await response.json()
            const loadedObjects = []

            for (const node of data.nodes) {
                if (!this.loadedModels[node.name]) {
                    this.loadedModels[node.name] = await loadGltf(node.name)
                }

                const mesh = this.loadedModels[node.name].clone()

                mesh.position.fromArray(node.position.split(',').map(Number))
                mesh.quaternion.fromArray(node.rotation.split(',').map(Number))
                mesh.scale.fromArray(node.scale.split(',').map(Number))

                mesh.userData.isExportable = true
                mesh.userData.modelName = node.name

                mesh.traverse(o => {
                    if (o.isMesh) {
                        o.userData = {
                            isSelectable: true,
                            object: mesh,
                        }
                    }
                })

                this.scene.add(mesh)
                loadedObjects.push(mesh)
            }

            console.log(`Scene loaded successfully from ${url}`)
            return loadedObjects
        } catch (error) {
            console.error(`Error loading scene from ${url}:`, error)
            return []
        }
    }

    async importScene(event, params) {
        try {
            const file = event.target.files[0]
            if (!file) return

            const reader = new FileReader()

            reader.onload = async (e) => {
                try {
                    const data = JSON.parse(e.target.result)

                    this.clearScene()

                    for (const node of data.nodes) {
                        if (!this.loadedModels[node.name]) {
                            this.loadedModels[node.name] = await loadGltf(node.name)
                        }

                        const mesh = this.loadedModels[node.name].clone()

                        mesh.position.fromArray(node.position.split(',').map(Number))
                        mesh.quaternion.fromArray(node.rotation.split(',').map(Number))
                        mesh.scale.fromArray(node.scale.split(',').map(Number))

                        mesh.userData.isExportable = true

                        mesh.traverse(o => {
                            if (o.isMesh) {
                                o.userData = {
                                    isSelectable: true,
                                    object: mesh,
                                }
                            }
                        })

                        this.scene.add(mesh)
                    }

                    if (data.params) {
                        if (data.params.skybox) {
                            params.skybox.file = data.params.skybox.file
                            this.addSkybox(data.params.skybox.file)
                        }
                        if (data.params.ground) {
                            params.ground.texture = data.params.ground.texture
                            params.ground.repeats = data.params.ground.repeats
                            this.changeGround(data.params.ground.texture, data.params.ground.repeats)
                        }
                    }

                    console.log('Scene imported successfully')
                } catch (parseError) {
                    console.error('Error parsing imported scene:', parseError)
                }
            }

            reader.readAsText(file)
        } catch (error) {
            console.error('Error importing scene:', error)
        }
    }

    exportScene(params) {
        const exportData = {
            params: {
                version: "1.0",
                skybox: params?.skybox || null,
                ground: params?.ground || null
            },
            nodes: []
        }

        this.scene.traverse(object => {
            if (object.userData && object.userData.isExportable) {
                const position = `${object.position.x},${object.position.y},${object.position.z}`
                const rotation = `${object.quaternion.x},${object.quaternion.y},${object.quaternion.z},${object.quaternion.w}`
                const scale = `${object.scale.x},${object.scale.y},${object.scale.z}`

                exportData.nodes.push({
                    name: object.name || 'unnamed',
                    position: position,
                    rotation: rotation,
                    scale: scale
                })
            }
        })

        const jsonStr = JSON.stringify(exportData, null, 2)

        const blob = new Blob([jsonStr], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'scene_export.json'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        console.log('Scene exported successfully')
    }

}