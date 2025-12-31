import React, { useState, useEffect, useRef } from 'react';
import { Upload, Shuffle, Check, RefreshCw, Minimize2 } from 'lucide-react';

/**
 * ESTILOS CSS (Injetados para funcionar sem Tailwind)
 */
const styles = `
  /* Reset básico e Fontes */
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }

  /* Layout Principal */
  .app-container {
    min-height: 100vh;
    background-color: #0f172a; /* Slate 900 */
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    overflow: hidden; /* Evita scroll da janela principal se possível */
  }

  /* Header */
  .header {
    width: 100%;
    max-width: 900px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 12px 24px;
    background-color: #1e293b; /* Slate 800 */
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  .title {
    font-size: 1.5rem;
    font-weight: bold;
    background: linear-gradient(to right, #60a5fa, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
  }

  .btn-secondary {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background-color: #334155;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .btn-secondary:hover { background-color: #475569; }

  /* Tela Inicial */
  .hero-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 48px;
    gap: 24px;
  }

  .icon-circle {
    width: 96px;
    height: 96px;
    background-color: #334155;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    color: #60a5fa;
  }

  .btn-primary {
    background-color: #2563eb;
    color: white;
    font-weight: bold;
    padding: 12px 32px;
    border-radius: 9999px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    transition: transform 0.2s, background 0.2s;
    display: inline-block;
  }
  .btn-primary:hover {
    background-color: #3b82f6;
    transform: scale(1.05);
  }

  /* Tela de Setup */
  .setup-card {
    background-color: #1e293b;
    padding: 32px;
    border-radius: 16px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    max-width: 500px;
    width: 100%;
    z-index: 10;
  }

  .preview-img {
    max-height: 250px;
    max-width: 100%;
    object-fit: contain;
    border-radius: 8px;
    border: 2px solid #475569;
  }

  .slider-container { width: 100%; }
  .slider-labels { display: flex; justify-content: space-between; font-size: 0.75rem; color: #94a3b8; margin-top: 4px; }
  
  .range-input {
    width: 100%;
    height: 8px;
    background: #334155;
    border-radius: 8px;
    outline: none;
    -webkit-appearance: none;
  }

  .btn-green {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    background-color: #16a34a;
    color: white;
    font-weight: bold;
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
  }
  .btn-green:hover { background-color: #22c55e; }
  .btn-green:disabled { background-color: #555; cursor: not-allowed; }

  /* Área do Jogo */
  .game-status-bar {
    width: 100%;
    max-width: 900px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    background-color: #1e293b;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 0.875rem;
    z-index: 10;
  }

  .game-container {
    position: relative;
    background-color: #162032; /* Fundo um pouco mais claro que o body para diferenciar a 'mesa' */
    border-radius: 12px;
    overflow: hidden;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
    border: 1px solid #334155;
    margin: 0 auto;
    touch-action: none; 
    user-select: none;
    /* Cursor de 'mover' para indicar que é a mesa */
    cursor: default;
  }

  /* Área onde o puzzle deve ser montado (o alvo) */
  .puzzle-board-area {
    position: absolute;
    /* Borda mais visível para marcar onde montar */
    border: 2px dashed rgba(255, 255, 255, 0.3);
    background-color: rgba(0, 0, 0, 0.2);
    box-shadow: inset 0 0 20px rgba(0,0,0,0.3);
    pointer-events: none;
  }
  
  .puzzle-board-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: rgba(255, 255, 255, 0.1);
    font-size: 1.5rem;
    font-weight: bold;
    pointer-events: none;
  }

  /* Card de Referência (Imagem Lateral) */
  .reference-card {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 350px;
    max-width: 40vw;
    background-color: #1e293b;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #475569;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    z-index: 5; /* Ajustado para 5: Acima do fundo (0), mas abaixo das peças soltas (10) */
    pointer-events: none; 
    opacity: 0.95;
    transition: opacity 0.3s;
  }
  .reference-card:hover { opacity: 0.2; }
  
  .reference-title {
    font-size: 0.875rem;
    color: #94a3b8;
    margin-bottom: 8px;
    text-align: center;
    font-weight: bold;
  }

  .reference-img {
    width: 100%;
    height: auto;
    border-radius: 4px;
    display: block;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  /* Peças */
  .puzzle-piece {
    position: absolute;
    user-select: none;
    transition: box-shadow 0.2s; 
  }

  .piece-img {
    width: 100%;
    height: 100%;
    pointer-events: none;
    display: block;
  }

  .piece-locked {
    z-index: 0 !important;
    filter: brightness(1);
    box-shadow: none !important; 
  }

  .piece-draggable {
    cursor: grab;
    filter: drop-shadow(4px 8px 8px rgba(0,0,0,0.6));
  }
  .piece-draggable:active {
    cursor: grabbing;
    filter: drop-shadow(8px 16px 12px rgba(0,0,0,0.5)) scale(1.02);
  }

  .piece-snapping {
    filter: drop-shadow(0 0 8px #60a5fa) brightness(1.2);
    z-index: 100;
  }

  .piece-error {
    filter: drop-shadow(0 0 8px #ef4444) sepia(1) hue-rotate(-50deg) saturate(3);
    z-index: 100;
  }

  .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    border: 3px solid #60a5fa;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    pointer-events: none;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
  }

  @keyframes spin { to { transform: translate(-50%, -50%) rotate(360deg); } }

  .victory-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    animation: fadeIn 0.5s ease-out;
    backdrop-filter: blur(4px);
  }
  
  .victory-card {
    background-color: #1e293b;
    padding: 32px;
    border-radius: 16px;
    border: 2px solid #22c55e;
    text-align: center;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .debug-panel {
    margin-top: 16px;
    width: 100%;
    max-width: 900px;
    background-color: #0f172a;
    border: 1px solid #334155;
    padding: 12px;
    border-radius: 8px;
    font-family: monospace;
    font-size: 0.75rem;
    color: #94a3b8;
    overflow-x: auto;
    z-index: 10;
  }
  .debug-cols { display: flex; gap: 16px; }
  .debug-col { width: 50%; }
  .debug-pre { 
    height: 100px; 
    overflow-y: auto; 
    background: #1e293b; 
    padding: 8px; 
    border-radius: 4px;
  }
`;

/**
 * UTILS & HELPERS (Movido para fora do componente para evitar recriação)
 */

const randomRange = (min, max) => Math.random() * (max - min) + min;

const generateJigsawGrid = (rows, cols) => {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        top: r === 0 ? 0 : -grid[r - 1][c].bottom,
        right: c === cols - 1 ? 0 : Math.random() > 0.5 ? 1 : -1,
        bottom: r === rows - 1 ? 0 : Math.random() > 0.5 ? 1 : -1,
        left: c === 0 ? 0 : -row[c - 1].right,
      });
    }
    grid.push(row);
  }
  return grid;
};

const drawPuzzlePiecePath = (ctx, width, height, shape) => {
  const { top, right, bottom, left } = shape;
  const w = width;
  const h = height;
  const s = Math.min(w, h) / 4;

  ctx.beginPath();
  ctx.moveTo(0, 0);

  if (top !== 0) {
    ctx.lineTo(w / 2 - s, 0);
    ctx.bezierCurveTo(w / 2 - s, -s * top, w / 2 + s, -s * top, w / 2 + s, 0);
    ctx.lineTo(w, 0);
  } else { ctx.lineTo(w, 0); }

  if (right !== 0) {
    ctx.lineTo(w, h / 2 - s);
    ctx.bezierCurveTo(w + s * right, h / 2 - s, w + s * right, h / 2 + s, w, h / 2 + s);
    ctx.lineTo(w, h);
  } else { ctx.lineTo(w, h); }

  if (bottom !== 0) {
    ctx.lineTo(w / 2 + s, h);
    ctx.bezierCurveTo(w / 2 + s, h + s * bottom, w / 2 - s, h + s * bottom, w / 2 - s, h);
    ctx.lineTo(0, h);
  } else { ctx.lineTo(0, h); }

  if (left !== 0) {
    ctx.lineTo(0, h / 2 + s);
    ctx.bezierCurveTo(-s * left, h / 2 + s, -s * left, h / 2 - s, 0, h / 2 - s);
    ctx.lineTo(0, 0);
  } else { ctx.lineTo(0, 0); }

  ctx.closePath();
};

const regeneratePieceImages = (img, savedPieces, pDim) => {
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    
    const renderWidth = pDim.width;
    const renderHeight = pDim.height;
    
    let maxRow = 0, maxCol = 0;
    savedPieces.forEach(p => {
        if (p.row > maxRow) maxRow = p.row;
        if (p.col > maxCol) maxCol = p.col;
    });
    const rows = maxRow + 1;
    const cols = maxCol + 1;

    const pieceWidth = renderWidth / cols;
    const pieceHeight = renderHeight / rows;
    const tabSize = Math.min(pieceWidth, pieceHeight) / 3;

    return savedPieces.map(piece => {
      const { row: r, col: c, shapeInfo: shape } = piece;

      tempCanvas.width = pieceWidth + tabSize * 2;
      tempCanvas.height = pieceHeight + tabSize * 2;
      
      ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      ctx.save();
      ctx.translate(tabSize, tabSize);
      
      drawPuzzlePiecePath(ctx, pieceWidth, pieceHeight, shape);
      ctx.clip();

      ctx.drawImage(
        img,
        (c * img.width) / cols - (tabSize * (img.width / renderWidth)),
        (r * img.height) / rows - (tabSize * (img.height / renderHeight)),
        (img.width / cols) + (tabSize * 2 * (img.width / renderWidth)),
        (img.height / rows) + (tabSize * 2 * (img.height / renderHeight)),
        -tabSize,
        -tabSize,
        pieceWidth + tabSize * 2,
        pieceHeight + tabSize * 2
      );
      
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 2;
      drawPuzzlePiecePath(ctx, pieceWidth, pieceHeight, shape);
      ctx.stroke();
      
      ctx.restore();

      return {
        ...piece,
        imgUrl: tempCanvas.toDataURL()
      };
    });
};

/**
 * COMPONENTE PRINCIPAL
 */
export default function PuzzleApp() {
  const [image, setImage] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [puzzleDim, setPuzzleDim] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const [gameStatus, setGameStatus] = useState('idle'); 
  const [difficulty, setDifficulty] = useState(3);
  
  // FIX: Inicialização inteligente do loading no useState
  // Verifica se há dados válidos no localStorage ANTES de montar o componente
  const [loading, setLoading] = useState(() => {
    const saved = localStorage.getItem('puzzle-save-v1');
    if (!saved) return false;
    try {
      const parsed = JSON.parse(saved);
      // Só inicia carregando se o status for de jogo ativo
      return parsed.gameStatus === 'playing' || parsed.gameStatus === 'won';
    } catch {
      return false;
    }
  });
  
  const dragItem = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const pendingLocks = useRef({});
  const containerRef = useRef(null);
  const isInitialized = useRef(false);

  // Refs para segurar a lógica mais atual dos eventos
  const handleMouseMoveRef = useRef(() => {});
  const handleMouseUpRef = useRef(() => {});

  // --- LÓGICA DE SALVAMENTO E CARREGAMENTO ---

  useEffect(() => {
    const savedData = localStorage.getItem('puzzle-save-v1');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.gameStatus === 'playing' || parsed.gameStatus === 'won') {
           // Se entrou aqui, loading já é true (definido no useState)
           // Iniciamos o carregamento assíncrono da imagem
           const img = new Image();
           img.src = parsed.imageSrc;
           img.onload = () => {
             setImage(img);
             setDifficulty(parsed.difficulty);
             setCanvasSize(parsed.canvasSize);
             setPuzzleDim(parsed.puzzleDim);
             setGameStatus(parsed.gameStatus);
             
             const restoredPieces = regeneratePieceImages(img, parsed.pieces, parsed.puzzleDim);
             setPieces(restoredPieces);
             
             setLoading(false); // Aqui é seguro chamar, pois é assíncrono
             isInitialized.current = true;
           };
           // Retorna para evitar cair na marcação de isInitialized síncrona abaixo
           return;
        }
      } catch (e) {
        console.error("Erro ao carregar jogo salvo:", e);
      }
    } 
    
    // Caminho síncrono (sem save ou inválido)
    // Não chamamos setLoading(false) aqui porque o useState já cuidou disso
    isInitialized.current = true;
  }, []);

  useEffect(() => {
    if (!isInitialized.current) return;
    if (gameStatus !== 'playing' && gameStatus !== 'won') return;
    if (!image) return;

    const piecesToSave = pieces.map(p => {
        const copy = { ...p };
        delete copy.imgUrl; 
        return copy;
    });
    
    const gameState = {
      imageSrc: image.src,
      pieces: piecesToSave,
      difficulty,
      canvasSize,
      puzzleDim,
      gameStatus
    };

    try {
      localStorage.setItem('puzzle-save-v1', JSON.stringify(gameState));
    } catch (e) {
      console.warn("Falha ao salvar (provavelmente imagem muito grande):", e);
    }
  }, [pieces, gameStatus, difficulty, canvasSize, puzzleDim, image]);

  const resetGame = () => {
    localStorage.removeItem('puzzle-save-v1');
    setGameStatus('idle');
    setPieces([]);
    setImage(null);
    isInitialized.current = true;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          setImage(img);
          setGameStatus('setup');
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // --- LÓGICA DO JOGO ---

  const finalizeVerification = (id) => {
    setPieces(prev => {
        const newPieces = prev.map(p => {
            if (p.id === id) {
                const dist = Math.sqrt(
                  Math.pow(p.currentX - p.correctX, 2) + 
                  Math.pow(p.currentY - p.correctY, 2)
                );

                if (dist < 50) {
                    return { 
                        ...p, 
                        currentX: p.correctX, 
                        currentY: p.correctY,
                        isLocked: true, 
                        isSnapping: false,
                        isError: false,
                        zIndex: 0 
                    };
                } else {
                    return {
                        ...p,
                        isSnapping: false,
                        isError: true,
                        zIndex: 10
                    }
                }
            }
            return p;
        });

        const allLocked = newPieces.every(p => p.isLocked);
        if (allLocked) setGameStatus('won');
        
        return newPieces;
    });
    
    delete pendingLocks.current[id];
  };

  const startVerification = (id) => {
    setPieces(prev => prev.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          isSnapping: true, 
          isError: false,
          zIndex: 50
        };
      }
      return p;
    }));

    const timerId = setTimeout(() => {
      finalizeVerification(id);
    }, 5000);

    pendingLocks.current[id] = timerId;
  };

  const generatePuzzle = () => {
    if (!image) return;
    setLoading(true);
    setGameStatus('playing');

    const padding = 20; 
    const uiHeight = 180;
    const availableW = window.innerWidth - padding;
    const availableH = window.innerHeight - uiHeight;
    const containerW = availableW;
    const containerH = availableH;
    const maxPuzzleW = containerW * 0.65;
    const maxPuzzleH = containerH * 0.75;

    let renderWidth = image.width;
    let renderHeight = image.height;
    const ratio = image.width / image.height;

    if (renderWidth > maxPuzzleW) {
      renderWidth = maxPuzzleW;
      renderHeight = renderWidth / ratio;
    }
    if (renderHeight > maxPuzzleH) {
      renderHeight = maxPuzzleH;
      renderWidth = renderHeight * ratio;
    }

    const boardOffsetX = (containerW - renderWidth) / 2;
    const boardOffsetY = (containerH - renderHeight) / 2;

    const newCanvasSize = { width: containerW, height: containerH };
    const newPuzzleDim = { width: renderWidth, height: renderHeight, x: boardOffsetX, y: boardOffsetY };

    setCanvasSize(newCanvasSize);
    setPuzzleDim(newPuzzleDim);

    const rows = difficulty;
    const cols = Math.round(difficulty * ratio);
    const pieceWidth = renderWidth / cols;
    const pieceHeight = renderHeight / rows;

    const shapesGrid = generateJigsawGrid(rows, cols);
    const newPieces = [];

    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');

    const tabSize = Math.min(pieceWidth, pieceHeight) / 3;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const shape = shapesGrid[r][c];
        
        tempCanvas.width = pieceWidth + tabSize * 2;
        tempCanvas.height = pieceHeight + tabSize * 2;
        
        ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        ctx.save();
        ctx.translate(tabSize, tabSize);
        
        drawPuzzlePiecePath(ctx, pieceWidth, pieceHeight, shape);
        ctx.clip();

        ctx.drawImage(
          image,
          (c * image.width) / cols - (tabSize * (image.width / renderWidth)),
          (r * image.height) / rows - (tabSize * (image.height / renderHeight)),
          (image.width / cols) + (tabSize * 2 * (image.width / renderWidth)),
          (image.height / rows) + (tabSize * 2 * (image.height / renderHeight)),
          -tabSize,
          -tabSize,
          pieceWidth + tabSize * 2,
          pieceHeight + tabSize * 2
        );
        
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 2;
        drawPuzzlePiecePath(ctx, pieceWidth, pieceHeight, shape);
        ctx.stroke();
        
        ctx.restore();

        const correctX = boardOffsetX + (c * pieceWidth) - tabSize;
        const correctY = boardOffsetY + (r * pieceHeight) - tabSize;

        const maxInitialX = containerW - (pieceWidth + tabSize*2);
        const maxInitialY = containerH - (pieceHeight + tabSize*2);
        
        const initialX = randomRange(0, Math.max(0, maxInitialX));
        const initialY = randomRange(0, Math.max(0, maxInitialY));

        newPieces.push({
          id: `${r}-${c}`,
          imgUrl: tempCanvas.toDataURL(),
          width: pieceWidth + tabSize * 2,
          height: pieceHeight + tabSize * 2,
          currentX: initialX,
          currentY: initialY,
          correctX: correctX,
          correctY: correctY,
          zIndex: 10,
          isLocked: false,
          isSnapping: false,
          isError: false,
          shapeInfo: shape,
          row: r,
          col: c
        });
      }
    }

    setPieces(newPieces);
    setLoading(false);
    isInitialized.current = true;
  };

  const handleMouseDown = (e, id) => {
    const pieceIndex = pieces.findIndex(p => p.id === id);
    if (pieceIndex === -1 || pieces[pieceIndex].isLocked) return;

    const updatedPieces = [...pieces];
    updatedPieces.forEach(p => {
        if (!p.isLocked) p.zIndex = 10;
    });
    updatedPieces[pieceIndex].zIndex = 50;
    
    updatedPieces[pieceIndex].isError = false;

    if (pendingLocks.current[id]) {
        clearTimeout(pendingLocks.current[id]);
        delete pendingLocks.current[id];
        updatedPieces[pieceIndex].isSnapping = false;
    }

    setPieces(updatedPieces);

    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    dragItem.current = id;
    dragOffset.current = {
      x: clientX - pieces[pieceIndex].currentX,
      y: clientY - pieces[pieceIndex].currentY
    };
  };

  // Funções definidas aqui, encapsuladas posteriormente no useEffect
  const handleMouseMove = (e) => {
    if (!dragItem.current) return;

    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    let newX = clientX - dragOffset.current.x;
    let newY = clientY - dragOffset.current.y;

    setPieces(prev => prev.map(p => {
      if (p.id === dragItem.current) {
        return { ...p, currentX: newX, currentY: newY };
      }
      return p;
    }));
  };

  const handleMouseUp = () => {
    if (!dragItem.current) return;

    const id = dragItem.current;
    dragItem.current = null;
    
    startVerification(id);
  };

  // FIX: Atualiza refs DENTRO do useEffect para evitar side-effects no render
  useEffect(() => {
    handleMouseMoveRef.current = handleMouseMove;
    handleMouseUpRef.current = handleMouseUp;
  }); // Executa a cada render para manter closures frescas

  const gatherPieces = () => {
    setPieces(prev => prev.map(p => {
      if (p.isLocked) return p;
      
      const maxW = canvasSize.width - p.width;
      const maxH = canvasSize.height - p.height;
      
      return {
        ...p,
        currentX: randomRange(0, maxW),
        currentY: randomRange(0, maxH),
        isError: false, 
        isSnapping: false,
        zIndex: 10
      };
    }));
  };

  // FIX: Event Listeners Estáveis (usando Refs para chamar a lógica mais recente)
  useEffect(() => {
    const onMove = (e) => handleMouseMoveRef.current(e);
    const onUp = (e) => handleMouseUpRef.current(e);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, []); // Array vazio garante que listeners sejam criados apenas uma vez

  // RENDERIZAÇÃO
  return (
    <div className="app-container">
      {/* INJEÇÃO DE ESTILOS */}
      <style>{styles}</style>

      {/* HEADER */}
      <header className="header">
        <h1 className="title">Jogo da Memória da minha Lyra
        </h1>
        {gameStatus !== 'idle' && (
          <button 
            onClick={resetGame}
            className="btn-secondary"
          >
            <RefreshCw size={18} /> Novo Jogo
          </button>
        )}
      </header>

      {/* ÁREA PRINCIPAL */}
      <main style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
        
        {/* TELA INICIAL */}
        {gameStatus === 'idle' && (
          <div className="hero-section">
            <div className="icon-circle">
                <Upload size={40} />
            </div>
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Crie seu Quebra-Cabeça</h2>
              <p style={{ color: '#94a3b8', maxWidth: '400px' }}>
                  Carregue qualquer imagem. Seu progresso será salvo automaticamente.
              </p>
            </div>
            
            <label className="btn-primary">
              Escolher Imagem
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </label>
          </div>
        )}

        {/* SETUP */}
        {gameStatus === 'setup' && image && (
          <div className="setup-card">
            <img src={image.src} alt="Preview" className="preview-img" />
            
            <div className="slider-container">
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.875rem' }}>
                  Dificuldade (Linhas): {difficulty}
                </label>
                <input 
                    type="range" 
                    min="2" 
                    max="8" 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(parseInt(e.target.value))}
                    className="range-input"
                />
                <div className="slider-labels">
                    <span>Fácil (2)</span>
                    <span>Difícil (8)</span>
                </div>
            </div>

            <button 
                onClick={generatePuzzle}
                disabled={loading}
                className="btn-green"
            >
                {loading ? 'Processando...' : <><Shuffle size={20} /> Iniciar Jogo</>}
            </button>
          </div>
        )}

        {/* JOGO */}
        {(gameStatus === 'playing' || gameStatus === 'won') && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                {/* Status Bar */}
                <div className="game-status-bar">
                    <span style={{ color: '#4ade80', fontWeight: 'bold' }}>
                        {pieces.filter(p => p.isLocked).length} / {pieces.length} Peças
                    </span>
                    
                    <button 
                        onClick={gatherPieces}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', marginRight: 'auto', marginLeft: '16px' }}
                        title="Espalhar peças na mesa"
                    >
                        <Minimize2 size={16} /> Espalhar peças
                    </button>

                    <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                        ℹ️ Progresso salvo automaticamente.
                    </span>
                </div>

                {/* MESA DE JOGO (Canvas) */}
                <div 
                    ref={containerRef}
                    className="game-container"
                    style={{ width: canvasSize.width, height: canvasSize.height }}
                >
                    {/* ÁREA DO PUZZLE (Apenas borda, sem imagem de fundo) */}
                    <div 
                      className="puzzle-board-area"
                      style={{
                        left: puzzleDim.x,
                        top: puzzleDim.y,
                        width: puzzleDim.width,
                        height: puzzleDim.height
                      }}
                    >
                        <div className="puzzle-board-label">Montar Aqui</div>
                    </div>

                    {/* IMAGEM DE REFERÊNCIA (Card Lateral) */}
                    <div className="reference-card">
                        <div className="reference-title">Referência</div>
                        <img src={image.src} alt="Referência" className="reference-img" />
                    </div>

                    {pieces.map((piece) => (
                        <div
                            key={piece.id}
                            onMouseDown={(e) => handleMouseDown(e, piece.id)}
                            onTouchStart={(e) => handleMouseDown(e, piece.id)}
                            className={`puzzle-piece ${
                                piece.isLocked ? 'piece-locked' : 'piece-draggable'
                            } ${
                                piece.isSnapping ? 'piece-snapping' : 
                                piece.isError ? 'piece-error' : ''
                            }`}
                            style={{
                                left: piece.currentX,
                                top: piece.currentY,
                                width: piece.width,
                                height: piece.height,
                                zIndex: piece.zIndex,
                                transition: piece.isLocked || piece.isSnapping ? 'left 0.3s ease-out, top 0.3s ease-out' : 'none',
                            }}
                        >
                            <img src={piece.imgUrl} alt="piece" className="piece-img" />
                            
                            {/* Loading Spinner */}
                            {piece.isSnapping && !piece.isLocked && <div className="spinner"></div>}
                        </div>
                    ))}
                    
                    {/* Vitória */}
                    {gameStatus === 'won' && (
                        <div className="victory-overlay">
                            <div className="victory-card">
                                <Check size={64} color="#22c55e" style={{ margin: '0 auto 16px' }} />
                                <h2 style={{ fontSize: '2rem', margin: '0 0 8px', color: 'white' }}>Parabéns!</h2>
                                <p style={{ color: '#cbd5e1', marginBottom: '24px' }}>Você completou o quebra-cabeça.</p>
                                <button 
                                    onClick={resetGame}
                                    className="btn-green"
                                    style={{ width: 'auto', padding: '12px 32px' }}
                                >
                                    Jogar Novamente
                                </button>
                            </div>
                        </div>
                    )}
                </div>


            </div>
        )}
      </main>
    </div>
  );
}