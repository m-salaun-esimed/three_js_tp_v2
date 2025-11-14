import GUI from 'lil-gui'

export class UI {

    constructor() {
        this.gui = new GUI()
    }

    addSkyboxUI(files, params, onChange) {
        const folder = this.gui.addFolder('Skybox')
        folder.add(params, 'file', files).onChange(onChange)
        folder.close()
    }

    addGroundUI(textures, params, onChange) {
        const folder = this.gui.addFolder('Ground')
        folder.add(params, 'texture', textures).onChange(() => {
            onChange(params.texture, params.repeats)
        })
        folder.add(params, 'repeats', 1, 1000, 1).onChange(() => {
            onChange(params.texture, params.repeats)
        })
        folder.close()
    }

    addSunUI(light) {
        const folder = this.gui.addFolder('Sun')
        folder.add(light, 'intensity', 0, 5, 0.1)
        folder.add(light.position, 'x', -50, 50, 1)
        folder.add(light.position, 'z', -50, 50, 1)
        folder.addColor(light, 'color')
        folder.close()
    }

    addCameraControlsUI(cameraObj, canvas) {
        const folder = this.gui.addFolder('Camera Controls')

        const controlsParams = {
            wasdMode: true
        }

        folder.add(controlsParams, 'wasdMode').name('WASD Mode').onChange((value) => {
            if (value) {
                cameraObj.enableWASD()
                canvas.requestPointerLock()
            } else {
                cameraObj.disableWASD()
                if (document.pointerLockElement === canvas) {
                    document.exitPointerLock()
                }
            }
        })

        if (controlsParams.wasdMode) {
            cameraObj.enableWASD()
        }

        canvas.addEventListener('click', () => {
            if (cameraObj.wasdEnabled && document.pointerLockElement !== canvas) {
                canvas.requestPointerLock()
            }
        })

        folder.add(cameraObj, 'moveSpeed', 0.01, 1, 0.01).name('Move Speed')
        folder.add(cameraObj, 'lookSpeed', 0.0001, 0.01, 0.0001).name('Look Speed')
        folder.close()
    }

    addObjectUI() {
        this.objectFolder = this.gui.addFolder('Selected Object')

        this.objectInfo = {
            name: 'None',
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 0, y: 0, z: 0 }
        }

        this.currentObject = null

        this.objectFolder.add(this.objectInfo, 'name').disable().listen()

        const posFolder = this.objectFolder.addFolder('Position')
        posFolder.add(this.objectInfo.position, 'x', -100, 100, 0.1).listen().onChange((value) => {
            if (this.currentObject) {
                this.currentObject.position.x = value
            }
        })
        posFolder.add(this.objectInfo.position, 'y', 0, 50, 0.1).listen().onChange((value) => {
            if (this.currentObject) {
                this.currentObject.position.y = value
            }
        })
        posFolder.add(this.objectInfo.position, 'z', -100, 100, 0.1).listen().onChange((value) => {
            if (this.currentObject) {
                this.currentObject.position.z = value
            }
        })

        const rotFolder = this.objectFolder.addFolder('Rotation')
        rotFolder.add(this.objectInfo.rotation, 'x', -180, 180, 1).listen().onChange((value) => {
            if (this.currentObject) {
                this.currentObject.rotation.x = value * Math.PI / 180
            }
        })
        rotFolder.add(this.objectInfo.rotation, 'y', -180, 180, 1).listen().onChange((value) => {
            if (this.currentObject) {
                this.currentObject.rotation.y = value * Math.PI / 180
            }
        })
        rotFolder.add(this.objectInfo.rotation, 'z', -180, 180, 1).listen().onChange((value) => {
            if (this.currentObject) {
                this.currentObject.rotation.z = value * Math.PI / 180
            }
        })

        const scaleFolder = this.objectFolder.addFolder('Scale')
        scaleFolder.add(this.objectInfo.scale, 'x').disable().listen()
        scaleFolder.add(this.objectInfo.scale, 'y').disable().listen()
        scaleFolder.add(this.objectInfo.scale, 'z').disable().listen()

        this.objectInfo.uniformScale = 1.0
        scaleFolder.add(this.objectInfo, 'uniformScale', 0.1, 5, 0.1).name('Uniform Scale').listen().onChange((value) => {
            if (this.currentObject) {
                this.currentObject.scale.set(value, value, value)
                this.objectInfo.scale.x = value
                this.objectInfo.scale.y = value
                this.objectInfo.scale.z = value
            }
        })

        this.objectFolder.close()
        this.objectFolder.hide()
    }

    addDuplicateButton(duplicateCallback) {
        const duplicateParams = {
            duplicateObject: () => {
                duplicateCallback()
            }
        }
        this.objectFolder.add(duplicateParams, 'duplicateObject').name('Duplicate (D)')
    }

    addDeleteButton(deleteCallback) {
        const deleteParams = {
            deleteObject: () => {
                deleteCallback()
            }
        }
        this.objectFolder.add(deleteParams, 'deleteObject').name('Delete Object')
    }

    updateObjectUI(object) {
        if (object) {
            this.currentObject = object
            this.objectFolder.show()
            this.objectFolder.open()

            this.objectInfo.name = object.name || 'Unnamed'
            this.objectInfo.position.x = parseFloat(object.position.x.toFixed(2))
            this.objectInfo.position.y = parseFloat(object.position.y.toFixed(2))
            this.objectInfo.position.z = parseFloat(object.position.z.toFixed(2))
            this.objectInfo.rotation.x = parseFloat((object.rotation.x * 180 / Math.PI).toFixed(2))
            this.objectInfo.rotation.y = parseFloat((object.rotation.y * 180 / Math.PI).toFixed(2))
            this.objectInfo.rotation.z = parseFloat((object.rotation.z * 180 / Math.PI).toFixed(2))
            this.objectInfo.scale.x = parseFloat(object.scale.x.toFixed(2))
              this.objectInfo.scale.y = parseFloat(object.scale.y.toFixed(2))
            this.objectInfo.scale.z = parseFloat(object.scale.z.toFixed(2))
            this.objectInfo.uniformScale = parseFloat(object.scale.x.toFixed(2))
        } else {
            this.currentObject = null
            this.objectFolder.close()
            this.objectFolder.hide()

            this.objectInfo.name = 'None'
            this.objectInfo.position.x = 0
            this.objectInfo.position.y = 0
            this.objectInfo.position.z = 0
            this.objectInfo.rotation.x = 0
            this.objectInfo.rotation.y = 0
            this.objectInfo.rotation.z = 0
            this.objectInfo.scale.x = 0
            this.objectInfo.scale.y = 0
            this.objectInfo.scale.z = 0
            this.objectInfo.uniformScale = 1.0
        }
    }

    addClearButton(clearCallback) {
        const clearParams = {
            clearScene: () => {
                clearCallback()
            }
        }
        this.gui.add(clearParams, 'clearScene').name('Clear Scene')
    }

    addImportButton(importCallback) {
        const importParams = {
            importScene: () => {
                importCallback()
            }
        }
        this.gui.add(importParams, 'importScene').name('Import Scene')
    }

    addExportButton(exportCallback) {
        const exportParams = {
            exportScene: () => {
                exportCallback()
            }
        }
        this.gui.add(exportParams, 'exportScene').name('Export Scene')
    }

    addModelSelector(models, addModelCallback) {
        const folder = this.gui.addFolder('Add Model')

        const modelParams = {
            selectedModel: models[0],
            addModel: () => {
                addModelCallback(modelParams.selectedModel)
            }
        }

        folder.add(modelParams, 'selectedModel', models).name('Model')
        folder.add(modelParams, 'addModel').name('Add to Scene')
    }

    createScoreUI() {
        const container = document.createElement('div')
        container.style.position = 'fixed'
        container.style.top = '20px'
        container.style.left = '50%'
        container.style.transform = 'translateX(-50%)'
        container.style.zIndex = '1000'
        container.style.fontFamily = 'Arial, sans-serif'
        container.style.textAlign = 'center'

        this.levelDisplay = document.createElement('div')
        this.levelDisplay.style.color = 'white'
        this.levelDisplay.style.fontSize = '24px'
        this.levelDisplay.style.fontWeight = 'bold'
        this.levelDisplay.style.marginBottom = '10px'
        this.levelDisplay.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)'
        this.levelDisplay.textContent = 'Niveau 1'
        container.appendChild(this.levelDisplay)

        const barContainer = document.createElement('div')
        barContainer.style.width = '300px'
        barContainer.style.height = '30px'
        barContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
        barContainer.style.border = '2px solid white'
        barContainer.style.borderRadius = '15px'
        barContainer.style.overflow = 'hidden'
        barContainer.style.position = 'relative'

        this.progressBar = document.createElement('div')
        this.progressBar.style.width = '0%'
        this.progressBar.style.height = '100%'
        this.progressBar.style.backgroundColor = '#ffd700'
        this.progressBar.style.transition = 'width 0.3s ease'
        barContainer.appendChild(this.progressBar)

        this.scoreText = document.createElement('div')
        this.scoreText.style.position = 'absolute'
        this.scoreText.style.top = '50%'
        this.scoreText.style.left = '50%'
        this.scoreText.style.transform = 'translate(-50%, -50%)'
        this.scoreText.style.color = 'white'
        this.scoreText.style.fontSize = '16px'
        this.scoreText.style.fontWeight = 'bold'
        this.scoreText.style.textShadow = '1px 1px 2px rgba(0,0,0,0.8)'
        this.scoreText.textContent = '0 / 100'
        barContainer.appendChild(this.scoreText)

        container.appendChild(barContainer)

        this.cheeseIndicator = document.createElement('div')
        this.cheeseIndicator.style.color = 'white'
        this.cheeseIndicator.style.fontSize = '18px'
        this.cheeseIndicator.style.marginTop = '10px'
        this.cheeseIndicator.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)'
        this.cheeseIndicator.style.opacity = '0'
        this.cheeseIndicator.style.transition = 'opacity 0.3s'
        this.cheeseIndicator.textContent = 'Appuyez sur E pour manger le fromage'
        container.appendChild(this.cheeseIndicator)

        document.body.appendChild(container)
    }

    updateScoreUI(score, maxScore, level) {
        const percentage = (score / maxScore) * 100
        this.progressBar.style.width = `${percentage}%`
        this.scoreText.textContent = `${score} / ${maxScore}`
        this.levelDisplay.textContent = `Niveau ${level}`
    }

    showCheeseIndicator(show) {
        if (this.cheeseIndicator) {
            this.cheeseIndicator.style.opacity = show ? '1' : '0'
        }
    }

    animateLevelUp() {
        this.levelDisplay.style.fontSize = '32px'
        this.levelDisplay.style.color = '#ffd700'
        setTimeout(() => {
            this.levelDisplay.style.fontSize = '24px'
            this.levelDisplay.style.color = 'white'
        }, 500)
    }

    destroy() {
        // Détruire le GUI lil-gui
        if (this.gui) {
            this.gui.destroy()
            this.gui = null
        }
    }
}