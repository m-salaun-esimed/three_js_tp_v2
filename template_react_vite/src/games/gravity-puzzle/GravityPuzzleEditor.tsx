import { useEffect, useRef, useState } from 'react';
import { FaSave, FaFolderOpen, FaTrash, FaCube, FaMapMarkerAlt, FaDoorOpen, FaMousePointer, FaUndo, FaPlay } from 'react-icons/fa';
import * as THREE from 'three';
import { LevelEditor } from './utils/LevelEditor';

const GravityPuzzleEditor = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<LevelEditor | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<'select' | 'wall' | 'spawn' | 'exit'>('select');
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [placementHeight, setPlacementHeight] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = -20;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // Create editor
    const editor = new LevelEditor(scene, camera, renderer);
    editorRef.current = editor;

    editor.onModeChange = (newMode) => {
      console.log('Mode changed:', newMode);
    };

    editor.onObjectSelected = (object) => {
      setSelectedObject(object);
    };

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (editorRef.current) {
        editorRef.current.update();
      }

      renderer.render(scene, camera);
    };
    animate();

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      if (editorRef.current && renderer.domElement) {
        editorRef.current.handleMouseMove(e, renderer.domElement);
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (editorRef.current && renderer.domElement) {
        editorRef.current.handleClick(e, renderer.domElement);
      }
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('click', handleClick);

    setIsLoading(false);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('click', handleClick);

      if (editorRef.current) {
        editorRef.current.cleanup();
      }

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }

      renderer.dispose();
    };
  }, []);

  const handleModeChange = (newMode: 'select' | 'wall' | 'spawn' | 'exit') => {
    setMode(newMode);
    if (editorRef.current) {
      editorRef.current.setMode(newMode);
    }
  };

  const handleExport = () => {
    if (editorRef.current) {
      const levelData = editorRef.current.exportLevel();
      const dataStr = JSON.stringify(levelData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = `gravity-puzzle-level-${Date.now()}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const levelData = JSON.parse(event.target?.result as string);
          if (editorRef.current) {
            editorRef.current.importLevel(levelData);
          }
        } catch (error) {
          console.error('Error importing level:', error);
          alert('Erreur lors de l\'importation du niveau');
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };

  const handleClear = () => {
    if (confirm('Êtes-vous sûr de vouloir effacer tout le niveau ?')) {
      if (editorRef.current) {
        editorRef.current.clearLevel();
      }
    }
  };

  const handleDelete = () => {
    if (editorRef.current) {
      editorRef.current.deleteSelected();
      setSelectedObject(null);
    }
  };

  const handleRotate = (axis: 'x' | 'y' | 'z') => {
    if (editorRef.current) {
      editorRef.current.rotateSelected(axis, Math.PI / 4);

      // Force update of selected object state
      const obj = editorRef.current.getSelectedObject();
      if (obj) {
        setSelectedObject({
          type: obj.userData.type,
          position: { ...obj.position },
          scale: { ...obj.scale },
          rotation: { ...obj.rotation },
        });
      }
    }
  };

  const handleScale = (axis: 'x' | 'y' | 'z', delta: number) => {
    if (editorRef.current) {
      editorRef.current.scaleSelected(axis, delta);

      // Force update of selected object state
      const obj = editorRef.current.getSelectedObject();
      if (obj) {
        setSelectedObject({
          type: obj.userData.type,
          position: { ...obj.position },
          scale: { ...obj.scale },
          rotation: { ...obj.rotation },
        });
      }
    }
  };

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (editorRef.current && selectedObject) {
      const newPos = { ...selectedObject.position };
      newPos[axis] = value;
      editorRef.current.setSelectedPosition(newPos.x, newPos.y, newPos.z);

      // Force update of selected object state
      const obj = editorRef.current.getSelectedObject();
      if (obj) {
        setSelectedObject({
          type: obj.userData.type,
          position: { ...obj.position },
          scale: { ...obj.scale },
          rotation: { ...obj.rotation },
        });
      }
    }
  };

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (editorRef.current && selectedObject) {
      const newRot = { ...selectedObject.rotation };
      newRot[axis] = (value * Math.PI) / 180; // Convert degrees to radians
      editorRef.current.setSelectedRotation(newRot.x, newRot.y, newRot.z);

      // Force update of selected object state
      const obj = editorRef.current.getSelectedObject();
      if (obj) {
        setSelectedObject({
          type: obj.userData.type,
          position: { ...obj.position },
          scale: { ...obj.scale },
          rotation: { ...obj.rotation },
        });
      }
    }
  };

  const handleScaleChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (editorRef.current && selectedObject) {
      const newScale = { ...selectedObject.scale };
      newScale[axis] = value;
      editorRef.current.setSelectedScale(newScale.x, newScale.y, newScale.z);

      // Force update of selected object state
      const obj = editorRef.current.getSelectedObject();
      if (obj) {
        setSelectedObject({
          type: obj.userData.type,
          position: { ...obj.position },
          scale: { ...obj.scale },
          rotation: { ...obj.rotation },
        });
      }
    }
  };

  const handleMove = (axis: 'x' | 'y' | 'z', delta: number) => {
    if (editorRef.current) {
      editorRef.current.moveSelected(axis, delta);

      // Force update of selected object state
      const obj = editorRef.current.getSelectedObject();
      if (obj) {
        setSelectedObject({
          type: obj.userData.type,
          position: { ...obj.position },
          scale: { ...obj.scale },
          rotation: { ...obj.rotation },
        });
      }
    }
  };

  const handlePlacementHeightChange = (height: number) => {
    setPlacementHeight(height);
    if (editorRef.current) {
      editorRef.current.setPlacementHeight(height);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col">
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">Éditeur de Niveau</h1>

            {/* Mode buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleModeChange('select')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  mode === 'select'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <FaMousePointer />
                <span>Sélection</span>
              </button>
              <button
                onClick={() => handleModeChange('wall')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  mode === 'wall'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <FaCube />
                <span>Mur</span>
              </button>
              <button
                onClick={() => handleModeChange('spawn')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  mode === 'spawn'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <FaMapMarkerAlt />
                <span>Spawn</span>
              </button>
              <button
                onClick={() => handleModeChange('exit')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  mode === 'exit'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <FaDoorOpen />
                <span>Sortie</span>
              </button>
            </div>
          </div>

          {/* File actions */}
          <div className="flex gap-2">
            <button
              onClick={handleImport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FaFolderOpen />
              <span>Charger</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <FaSave />
              <span>Sauvegarder</span>
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <FaTrash />
              <span>Effacer</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 3D Canvas */}
        <div className="flex-1 relative" ref={containerRef}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-50">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                <p className="text-xl">Chargement de l'éditeur...</p>
              </div>
            </div>
          )}

          {/* Controls overlay */}
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 rounded-lg px-4 py-3 text-white text-sm">
            <div className="font-bold mb-2">Contrôles :</div>
            <ul className="space-y-1">
              <li>• Clic droit + Déplacer : Orbiter</li>
              <li>• Molette : Zoom</li>
              <li>• Clic gauche : {mode === 'select' ? 'Sélectionner' : 'Placer'}</li>
            </ul>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold text-white mb-4">Propriétés</h2>

          {/* Placement Height Control (visible when not in select mode) */}
          {mode !== 'select' && (
            <div className="mb-4 bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Hauteur de placement</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlacementHeightChange(placementHeight - 1)}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded"
                >
                  -
                </button>
                <input
                  type="number"
                  value={placementHeight}
                  onChange={(e) => handlePlacementHeightChange(Number(e.target.value))}
                  className="flex-1 bg-gray-600 text-white px-3 py-1 rounded text-center"
                />
                <button
                  onClick={() => handlePlacementHeightChange(placementHeight + 1)}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded"
                >
                  +
                </button>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Utilisez les boutons ou tapez pour ajuster la hauteur Y
              </div>
            </div>
          )}

          {selectedObject ? (
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Type</div>
                <div className="text-white font-bold capitalize">{selectedObject.type}</div>
              </div>

              {/* Position Controls */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-3">Position</div>
                <div className="space-y-2">
                  {(['x', 'y', 'z'] as const).map((axis) => (
                    <div key={axis} className="flex items-center gap-2">
                      <span className="text-white uppercase w-8">{axis}:</span>
                      <button
                        onClick={() => handleMove(axis, -1)}
                        className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        step="0.5"
                        value={selectedObject.position[axis].toFixed(1)}
                        onChange={(e) => handlePositionChange(axis, Number(e.target.value))}
                        className="flex-1 bg-gray-600 text-white px-2 py-1 rounded text-center text-sm"
                      />
                      <button
                        onClick={() => handleMove(axis, 1)}
                        className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm"
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scale Controls (walls only) */}
              {selectedObject.type === 'wall' && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-3">Échelle (taille)</div>
                  <div className="space-y-2">
                    {(['x', 'y', 'z'] as const).map((axis) => (
                      <div key={axis} className="flex items-center gap-2">
                        <span className="text-white uppercase w-8">{axis}:</span>
                        <button
                          onClick={() => handleScale(axis, -0.5)}
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          value={selectedObject.scale[axis].toFixed(1)}
                          onChange={(e) => handleScaleChange(axis, Number(e.target.value))}
                          className="flex-1 bg-gray-600 text-white px-2 py-1 rounded text-center text-sm"
                        />
                        <button
                          onClick={() => handleScale(axis, 0.5)}
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm"
                        >
                          +
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <FaTrash />
                <span>Supprimer</span>
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <p>Aucun objet sélectionné</p>
              <p className="text-sm mt-2">
                Cliquez sur un objet pour voir ses propriétés
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-bold text-white mb-3">Instructions</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>1. Sélectionnez un mode (Mur, Spawn, Sortie)</li>
              <li>2. Cliquez sur la grille pour placer des éléments</li>
              <li>3. Passez en mode Sélection pour modifier</li>
              <li>4. Utilisez Sauvegarder pour exporter votre niveau</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GravityPuzzleEditor;
