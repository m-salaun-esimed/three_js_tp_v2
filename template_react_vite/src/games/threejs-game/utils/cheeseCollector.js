export class CheeseCollector {

    constructor(scene, physics) {
        this.scene = scene
        this.physics = physics

        this.cheeseScore = 0
        this.maxScore = 100
        this.cheeseValue = 20
        this.nearestCheese = null
        this.collectionDistance = 3

        this.cat = null
        this.cheeses = []

        this.onScoreUpdate = null
        this.onScoreComplete = null
    }

    setCat(cat) {
        this.cat = cat
    }

    addCheeses(cheeses) {
        this.cheeses = cheeses
        this.cheeses.forEach(cheese => {
            cheese.userData.collectable = true
        })
    }

    checkNearestCheese() {
        if (!this.cat || !this.cheeses) return null

        this.nearestCheese = null
        let minDistance = this.collectionDistance

        for (const cheese of this.cheeses) {
            if (!cheese.userData.collectable) continue

            const distance = this.cat.position.distanceTo(cheese.position)
            if (distance < minDistance) {
                minDistance = distance
                this.nearestCheese = cheese
            }
        }

        return this.nearestCheese
    }

    collectCheese(cheese) {
        if (!cheese || !cheese.userData.collectable) return

        this.scene.removeObject(cheese)
        this.physics.removeBody(cheese)
        cheese.userData.collectable = false

        this.cheeseScore += this.cheeseValue

        if (this.cheeseScore >= this.maxScore) {
            this.cheeseScore = 0
            if (this.onScoreComplete) {
                this.onScoreComplete()
            }
        }

        if (this.onScoreUpdate) {
            this.onScoreUpdate(this.cheeseScore, this.maxScore)
        }

        console.log(`Fromage collecté! Score: ${this.cheeseScore}/${this.maxScore}`)
    }

    resetScore() {
        this.cheeseScore = 0
    }

    getScore() {
        return this.cheeseScore
    }

    getMaxScore() {
        return this.maxScore
    }

}
