import * as THREE from 'three/webgpu'
import * as CANNON from 'cannon-es'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

export class Camera {

    constructor(renderer) {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        this.defaultPosition()

        if (renderer) {
            this.controls = new OrbitControls(this.camera, renderer.domElement)
            this.controls.target.set(0, 0, 0)
            this.controls.update()
        }

        this.wasdEnabled = false
        this.moveSpeed = 0.1
        this.lookSpeed = 0.002

        this.moveState = {
            forward: false,
            backward: false,
            left: false,
            right: false
        }

        this.yaw = 0
        this.pitch = 0
        this.isMouseLocked = false

        this.followTarget = null
        this.physicsBody = null
        this.physics = null
        this.cameraDistance = 10
        this.cameraHeight = 4
        this.isGrounded = false
        this.jumpForce = 10
        this.baseMoveSpeed = 8
    }

    defaultPosition() {
        this.camera.position.set(0, 2, 5)
    }

    enableWASD() {
        this.wasdEnabled = true
        if (this.controls) {
            this.controls.enabled = false
        }
        this.isMouseLocked = false
        this.yaw = this.camera.rotation.y
        this.pitch = this.camera.rotation.x
    }

    disableWASD() {
        this.wasdEnabled = false
        if (this.controls) {
            this.controls.enabled = true
        }
        this.moveState = {
            forward: false,
            backward: false,
            left: false,
            right: false
        }
        this.isMouseLocked = false
    }

    handleKeyDown(event) {
        if (!this.wasdEnabled) return

        switch(event.key.toLowerCase()) {
            case 'w':
            case 'z':
                this.moveState.forward = true
                break
            case 's':
                this.moveState.backward = true
                break
            case 'a':
            case 'q':
                this.moveState.left = true
                break
            case 'd':
                this.moveState.right = true
                break
        }
    }

    handleKeyUp(event) {
        if (!this.wasdEnabled) return

        switch(event.key.toLowerCase()) {
            case 'w':
            case 'z':
                this.moveState.forward = false
                break
            case 's':
                this.moveState.backward = false
                break
            case 'a':
            case 'q':
                this.moveState.left = false
                break
            case 'd':
                this.moveState.right = false
                break
        }

        if (!this.wasdEnabled) return

        if (event.key === ' ' && this.physicsBody && this.isGrounded) {
            this.physicsBody.velocity.y = this.jumpForce
            this.isGrounded = false
        }
    }

    handleMouseMove(event) {
        if (!this.wasdEnabled || !this.isMouseLocked) return

        this.yaw -= event.movementX * this.lookSpeed
        this.pitch -= event.movementY * this.lookSpeed

        this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch))

        this.camera.rotation.order = 'YXZ'
        this.camera.rotation.y = this.yaw
        this.camera.rotation.x = this.pitch
    }

    setFollowTarget(target) {
        this.followTarget = target
    }

    setPhysicsBody(body) {
        this.physicsBody = body
    }

    setPhysicsWorld(physics) {
        this.physics = physics
    }

    increaseMoveSpeed(newSpeed) {
        this.baseMoveSpeed = newSpeed
    }

    update() {
        if (!this.wasdEnabled) return

        if (this.followTarget && this.physicsBody) {
            let targetRotation = this.followTarget.rotation.y
            const moveSpeed = this.baseMoveSpeed
            const rotationSpeed = 0.08

            if (this.moveState.left) {
                targetRotation += rotationSpeed
            }
            if (this.moveState.right) {
                targetRotation -= rotationSpeed
            }

            this.followTarget.rotation.y = targetRotation

            const quat = new CANNON.Quaternion()
            quat.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), targetRotation)
            this.physicsBody.quaternion.copy(quat)

            if (this.physics) {
                this.isGrounded = this.physics.isGrounded(this.followTarget, 2.5)
            } else {
                this.isGrounded = Math.abs(this.physicsBody.velocity.y) < 0.5 &&
                                 this.followTarget.position.y < 3
            }

            let moveX = 0
            let moveZ = 0

            if (this.moveState.forward) {
                moveX += Math.sin(targetRotation)
                moveZ += Math.cos(targetRotation)
            }
            if (this.moveState.backward) {
                moveX -= Math.sin(targetRotation)
                moveZ -= Math.cos(targetRotation)
            }

            const moveLength = Math.sqrt(moveX * moveX + moveZ * moveZ)
            if (moveLength > 0) {
                moveX = (moveX / moveLength) * moveSpeed
                moveZ = (moveZ / moveLength) * moveSpeed
            }
            
            this.physicsBody.velocity.x = moveX
            this.physicsBody.velocity.z = moveZ

            const offsetX = -Math.sin(targetRotation) * this.cameraDistance
            const offsetZ = -Math.cos(targetRotation) * this.cameraDistance

            this.camera.position.x = this.followTarget.position.x + offsetX
            this.camera.position.y = this.followTarget.position.y + this.cameraHeight
            this.camera.position.z = this.followTarget.position.z + offsetZ

            this.camera.lookAt(
                this.followTarget.position.x,
                this.followTarget.position.y + 1,
                this.followTarget.position.z
            )
        } else if (this.followTarget) {
            const moveVector = new THREE.Vector3()
            const targetRotation = this.followTarget.rotation.y

            if (this.moveState.forward) {
                moveVector.x += Math.sin(targetRotation) * this.moveSpeed
                moveVector.z += Math.cos(targetRotation) * this.moveSpeed
            }
            if (this.moveState.backward) {
                moveVector.x -= Math.sin(targetRotation) * this.moveSpeed
                moveVector.z -= Math.cos(targetRotation) * this.moveSpeed
            }
            if (this.moveState.left) {
                const newRotation = targetRotation + 0.05
                this.followTarget.rotation.y = newRotation
            }
            if (this.moveState.right) {
                const newRotation = targetRotation - 0.05
                this.followTarget.rotation.y = newRotation
            }

            this.followTarget.position.add(moveVector)

            const offsetX = -Math.sin(targetRotation) * this.cameraDistance
            const offsetZ = -Math.cos(targetRotation) * this.cameraDistance

            this.camera.position.x = this.followTarget.position.x + offsetX
            this.camera.position.y = this.followTarget.position.y + this.cameraHeight
            this.camera.position.z = this.followTarget.position.z + offsetZ

            this.camera.lookAt(
                this.followTarget.position.x,
                this.followTarget.position.y + 1,
                this.followTarget.position.z
            )
        } else {
            const direction = new THREE.Vector3()
            const right = new THREE.Vector3()

            this.camera.getWorldDirection(direction)
            right.crossVectors(this.camera.up, direction).normalize()

            const moveVector = new THREE.Vector3()

            if (this.moveState.forward) {
                moveVector.add(direction.clone().multiplyScalar(this.moveSpeed))
            }
            if (this.moveState.backward) {
                moveVector.add(direction.clone().multiplyScalar(-this.moveSpeed))
            }
            if (this.moveState.left) {
                moveVector.add(right.clone().multiplyScalar(this.moveSpeed))
            }
            if (this.moveState.right) {
                moveVector.add(right.clone().multiplyScalar(-this.moveSpeed))
            }

            this.camera.position.add(moveVector)
        }
    }

}