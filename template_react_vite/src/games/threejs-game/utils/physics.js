import * as CANNON from 'cannon-es'

export class PhysicsWorld {

    constructor() {
        this.world = new CANNON.World()
        this.world.gravity.set(0, -20, 0)

        this.world.broadphase = new CANNON.NaiveBroadphase()
        this.world.solver.iterations = 10

        this.bodies = new Map()

        this.addGround()
    }

    addGround() {
        const groundShape = new CANNON.Plane()
        const groundBody = new CANNON.Body({
            mass: 0,
            material: new CANNON.Material({ friction: 0.1 })
        })
        groundBody.addShape(groundShape)
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
        groundBody.position.y = -0.5
        this.world.addBody(groundBody)

        return groundBody
    }

    addBox(mesh, mass = 1, options = {}) {
        const sizeX = options.sizeX !== undefined ? options.sizeX : 1.0
        const sizeY = options.sizeY !== undefined ? options.sizeY : 1.0
        const sizeZ = options.sizeZ !== undefined ? options.sizeZ : 1.0

        const halfExtents = new CANNON.Vec3(
            (sizeX * mesh.scale.x) / 2,
            (sizeY * mesh.scale.y) / 2,
            (sizeZ * mesh.scale.z) / 2
        )

        const shape = new CANNON.Box(halfExtents)

        const body = new CANNON.Body({
            mass: mass,
            position: new CANNON.Vec3(
                mesh.position.x,
                mesh.position.y,
                mesh.position.z
            ),
            quaternion: new CANNON.Quaternion(
                mesh.quaternion.x,
                mesh.quaternion.y,
                mesh.quaternion.z,
                mesh.quaternion.w
            ),
            shape: shape,
            material: new CANNON.Material({
                friction: options.friction || 0.3,
                restitution: options.restitution || 0.3
            }),
            linearDamping: options.linearDamping || 0.1,
            angularDamping: options.angularDamping || 0.1
        })

        this.world.addBody(body)
        this.bodies.set(mesh, body)

        return body
    }

    addSphere(mesh, mass = 1, radius = 1, options = {}) {
        const shape = new CANNON.Sphere(radius)

        const body = new CANNON.Body({
            mass: mass,
            position: new CANNON.Vec3(
                mesh.position.x,
                mesh.position.y,
                mesh.position.z
            ),
            shape: shape,
            material: new CANNON.Material({
                friction: options.friction || 0.3,
                restitution: options.restitution || 0.5
            })
        })

        this.world.addBody(body)
        this.bodies.set(mesh, body)

        return body
    }

    getBody(mesh) {
        return this.bodies.get(mesh)
    }

    removeBody(mesh) {
        const body = this.bodies.get(mesh)
        if (body) {
            this.world.removeBody(body)
            this.bodies.delete(mesh)
        }
    }

    update(deltaTime = 1/60) {
        this.world.step(deltaTime)

        this.bodies.forEach((body, mesh) => {
            mesh.position.copy(body.position)
            if (!mesh.userData.manualRotation) {
                mesh.quaternion.copy(body.quaternion)
            }
        })
    }

    applyForce(mesh, force) {
        const body = this.bodies.get(mesh)
        if (body) {
            body.applyForce(
                new CANNON.Vec3(force.x, force.y, force.z),
                body.position
            )
        }
    }

    setVelocity(mesh, velocity) {
        const body = this.bodies.get(mesh)
        if (body) {
            body.velocity.set(velocity.x, velocity.y, velocity.z)
        }
    }

    isGrounded(mesh, rayDistance = 0.2) {
        const body = this.bodies.get(mesh)
        if (!body) return false

        const from = new CANNON.Vec3(
            body.position.x,
            body.position.y,
            body.position.z
        )

        const to = new CANNON.Vec3(
            body.position.x,
            body.position.y - rayDistance,
            body.position.z
        )

        const result = new CANNON.RaycastResult()
        this.world.raycastClosest(from, to, {}, result)

        return result.hasHit && Math.abs(body.velocity.y) < 0.5
    }

}
