import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Zap, 
  Binary, 
  Grid3X3, 
  Map as MapIcon, 
  ExternalLink,
  ShieldCheck,
  Trophy,
  History,
  Settings2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// --- Types ---
interface SubStep {
  id: string;
  label: string;
  detailed: string;
  speedrun: string;
}

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  steps: SubStep[];
}

// --- Data ---
const GUIDE_DATA: GuideSection[] = [
  {
    id: 'prerequisites',
    title: '1. Requisitos y Equipo',
    icon: <ShieldCheck className="w-6 h-6" />,
    steps: [
      {
        id: 'dlcs',
        label: 'Los 4 DLCs',
        detailed: 'Debes poseer "They Shall Not Pass", "In the Name of the Tsar", "Turning Tides" y "Apocalypse".',
        speedrun: 'Poseer todos los DLCs.'
      },
      {
        id: 'm1917',
        label: 'Arma M1917 MG',
        detailed: 'Desbloquea la M1917 MG completando su misión (DLC Turning Tides). Necesaria para el paso final.',
        speedrun: 'Tener la M1917 MG desbloqueada.'
      },
      {
        id: 'loadout',
        label: 'Equipo de Apoyo',
        detailed: 'Lleva: M1917 MG, Caja de Munición, Carga Limpet y herramienta de cuerpo a cuerpo (Cuchillo).',
        speedrun: 'Clase Apoyo + Limpet + Munición.'
      },
      {
        id: 'server',
        label: 'Filtros de Servidor',
        detailed: 'Conquista, Ranuras: Todo, Mapas específicos. Busca regiones con horario de madrugada (2AM-5AM) para evitar interrupciones.',
        speedrun: 'Servidor vacío (Filtro: Ranuras Todo).'
      }
    ]
  },
  {
    id: 'belly',
    title: "2. Belly of the Beast (Caporetto)",
    icon: <History className="w-6 h-6" />,
    steps: [
      {
        id: 'statues-caporetto',
        label: 'Destrucción de Estatuas',
        detailed: 'Cerca de B: 1. Limpet en base de estatua entrada. 2. Izquierda: Dispara solo a la cabeza. 3. Centro: Dispara al torso/brazo cruzado. 4. Derecha: Dispara punta de ala derecha. Luego pulsa botón oculto tras última estatua.',
        speedrun: 'Limpet (1), Cabeza (L), Torso (C), Ala (R) + Botón.'
      }
    ]
  },
  {
    id: 'angel',
    title: "3. An Angel Sighting (River Somme)",
    icon: <History className="w-6 h-6" />,
    steps: [
      {
        id: 'somme-factory',
        label: 'Fábrica y Chimenea',
        detailed: '1. Limpet en tierra de fábrica (Eco) para revelar Morse. 2. Introduce código 0627. 3. Activa interruptor en chimenea de granja (Apples). 4. Vuelve a fábrica e introduce segunda secuencia.',
        speedrun: 'Morse 0627 (Eco) -> Botón Chimenea (Apples) -> Morse 2.'
      }
    ]
  },
  {
    id: 'omen',
    title: "4. An Omen (Zeebrugge)",
    icon: <Binary className="w-6 h-6" />,
    steps: [
      {
        id: 'morse-omen',
        label: 'El Código de las 8 Letras',
        detailed: 'Sube a torre de agua (Apples) con kit Infiltrado. Escucha Morse de la frase "Dulce et decorum est pro patria mori". Identifica las 8 letras faltantes e introdúcelas en Estación 1 y 3.',
        speedrun: 'Identificar 8 letras faltantes -> Estación 1 (4) y 3 (4).'
      }
    ]
  },
  {
    id: 'conflict',
    title: "5. A Conflict (Soissons)",
    icon: <Grid3X3 className="w-6 h-6" />,
    steps: [
      {
        id: 'soissons-lights',
        label: 'Luces y Candelabros',
        detailed: '1. Rompe TODAS las luces del Chateau. 2. Resuelve puzzle de candelabros (7 etapas). 3. Mapea los 12 sacos de arena exteriores en la cuadrícula 8x8 interior usando los pilares.',
        speedrun: 'Romper luces -> Candelabros -> Cuadrícula 8x8 (12 luces).'
      }
    ]
  },
  {
    id: 'beginning',
    title: "6. A Beginning (Multi-mapa)",
    icon: <MapIcon className="w-6 h-6" />,
    steps: [
      {
        id: 'morse-9-stages',
        label: 'Las 9 Etapas de Morse',
        detailed: 'Encuentra auriculares -> Morse en MCOM -> Busca símbolo en mapa base. Repite 9 veces. La etapa 9 es en el molino de Giant\'s Shadow (espera 2 min por la paloma).',
        speedrun: 'Completar las 9 etapas de búsqueda de símbolos.'
      }
    ]
  },
  {
    id: 'escalation',
    title: "7. Skin: An Escalation (Albión)",
    icon: <Zap className="w-6 h-6" />,
    steps: [
      {
        id: 'albion-switches',
        label: 'Torre de Radio y Calavera',
        detailed: '1. Pulsa 9 interruptores en torre. 2. Pulsa calavera en casa (Freddy). 3. Pulsa 9 interruptores otra vez. 4. Pulsa calavera 4 veces. 5. Morse A-F. 6. Rompe 6 faroles y ajusta faro.',
        speedrun: 'Torre -> Calavera -> Torre -> Calavera (4) -> Morse -> Faro.'
      }
    ]
  },
  {
    id: 'descent',
    title: '8. El Descenso Final (Passchendaele)',
    icon: <Trophy className="w-6 h-6" />,
    steps: [
      {
        id: 'final-equip',
        label: 'Equipamiento Crítico',
        detailed: 'DEBES EQUIPAR: 1 Chapa Frontal Masterman, 1 Chapa Trasera (Angel/Belly/etc) y la M1917 MG con skin "An Escalation".',
        speedrun: 'Equipar Chapas Masterman + M1917 Skin Escalation.'
      },
      {
        id: 'labyrinth-pass',
        label: 'Mina y Laberinto',
        detailed: '1. Morse "UNKNOWABLE" en detonadores. 2. Direcciones: Oeste, Este, Sur, Oeste, Sureste, Oeste, Norte, Sur. Usa las trampillas para curarte.',
        speedrun: 'Morse UNKNOWABLE -> O, E, S, O, SE, O, N, S.'
      }
    ]
  }
];

// --- Components ---

const MorseHelper = () => {
  const [input, setInput] = useState('');
  const morseMap: Record<string, string> = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y', '--..': 'Z'
  };

  const translated = input.split(' ').map(code => morseMap[code] || '?').join('');

  return (
    <div className="bg-bf-gray/50 p-4 rounded-lg border border-bf-orange/30 mt-4">
      <h4 className="text-bf-orange mb-2 flex items-center gap-2">
        <Binary className="w-4 h-4" /> Calculadora Morse
      </h4>
      <div className="flex gap-2 mb-2">
        <button onClick={() => setInput(prev => prev + '.')} className="flex-1 py-2 bg-bf-gray hover:bg-bf-orange/20 border border-bf-orange/50 rounded">.</button>
        <button onClick={() => setInput(prev => prev + '-')} className="flex-1 py-2 bg-bf-gray hover:bg-bf-orange/20 border border-bf-orange/50 rounded">-</button>
        <button onClick={() => setInput(prev => prev + ' ')} className="flex-1 py-2 bg-bf-gray hover:bg-bf-orange/20 border border-bf-orange/50 rounded">Espacio</button>
        <button onClick={() => setInput('')} className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-500/50 rounded">C</button>
      </div>
      <div className="font-mono text-xl bg-black/40 p-2 rounded min-h-[3rem] break-all">
        {input || <span className="text-gray-600">... --- ...</span>}
      </div>
      <div className="mt-2 text-bf-orange font-bold">Traducción: {translated}</div>
    </div>
  );
};

const ConflictGrid = () => {
  const [grid, setGrid] = useState<boolean[][]>(Array(8).fill(null).map(() => Array(8).fill(false)));

  const toggleCell = (r: number, c: number) => {
    const newGrid = [...grid];
    newGrid[r] = [...newGrid[r]];
    newGrid[r][c] = !newGrid[r][c];
    setGrid(newGrid);
  };

  return (
    <div className="mt-4">
      <h4 className="text-bf-orange mb-2 flex items-center gap-2">
        <Grid3X3 className="w-4 h-4" /> Simulador de Cuadrícula (8x8)
      </h4>
      <div className="grid grid-cols-8 gap-1 max-w-[320px] mx-auto bg-bf-gray p-2 rounded border border-bf-orange/30">
        {grid.map((row, r) => row.map((cell, c) => (
          <button
            key={`${r}-${c}`}
            onClick={() => toggleCell(r, c)}
            className={cn(
              "w-full aspect-square border border-white/10 transition-colors",
              cell ? "bg-bf-orange shadow-[0_0_10px_rgba(255,102,0,0.5)]" : "bg-black/40 hover:bg-white/10"
            )}
          />
        )))}
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center italic">Marca los pilares que se elevan para encontrar el patrón.</p>
    </div>
  );
};

export default function App() {
  const [completed, setCompleted] = useState<string[]>(() => {
    const saved = localStorage.getItem('bf1-peacekeeper-progress');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSpeedrun, setIsSpeedrun] = useState(false);
  const [expanded, setExpanded] = useState<string | null>('prerequisites');

  useEffect(() => {
    localStorage.setItem('bf1-peacekeeper-progress', JSON.stringify(completed));
  }, [completed]);

  const toggleStep = (id: string) => {
    setCompleted(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const totalSteps = GUIDE_DATA.reduce((acc, section) => acc + section.steps.length, 0);
  const progressPercent = Math.round((completed.length / totalSteps) * 100);

  return (
    <div className="min-h-screen pb-20">
      {/* Header & Progress */}
      <header className="sticky top-0 z-50 bg-bf-dark/95 backdrop-blur border-b border-bf-orange/30 shadow-xl">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex justify-between items-end mb-2">
            <div>
              <h1 className="text-3xl font-bold text-white leading-none">PEACEKEEPER</h1>
              <p className="text-bf-orange text-xs tracking-widest font-bold">MASTERMAN GUIDE</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-display text-bf-orange">{progressPercent}%</span>
            </div>
          </div>
          <div className="h-2 bg-bf-gray rounded-full overflow-hidden border border-white/5">
            <motion.div 
              className="h-full bg-bf-orange shadow-[0_0_15px_rgba(255,102,0,0.6)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-6 space-y-4">
        {/* Settings Toggle */}
        <div className="flex justify-end items-center gap-3 mb-6">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
            <Info className={cn("w-4 h-4", !isSpeedrun && "text-bf-orange")} />
            <span>DETALLADO</span>
          </div>
          <button 
            onClick={() => setIsSpeedrun(!isSpeedrun)}
            className="relative w-12 h-6 bg-bf-gray rounded-full border border-bf-orange/30"
          >
            <motion.div 
              className="absolute top-1 left-1 w-4 h-4 bg-bf-orange rounded-full"
              animate={{ x: isSpeedrun ? 24 : 0 }}
            />
          </button>
          <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
            <span>SPEEDRUN</span>
            <Zap className={cn("w-4 h-4", isSpeedrun && "text-bf-orange")} />
          </div>
        </div>

        {/* Guide Sections */}
        <div className="space-y-4">
          {GUIDE_DATA.map((section) => (
            <div 
              key={section.id} 
              className="border border-white/10 rounded-lg overflow-hidden bg-bf-gray/30 backdrop-blur-sm"
            >
              <button 
                onClick={() => setExpanded(expanded === section.id ? null : section.id)}
                className="w-full flex items-center justify-between p-4 bg-bf-gray/50 hover:bg-bf-gray/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-bf-orange">{section.icon}</div>
                  <h2 className="text-lg text-white">{section.title}</h2>
                </div>
                {expanded === section.id ? <ChevronUp /> : <ChevronDown />}
              </button>

              <AnimatePresence>
                {expanded === section.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-4 paper-texture">
                      {section.steps.map((step) => (
                        <div key={step.id} className="flex gap-3 group">
                          <button 
                            onClick={() => toggleStep(step.id)}
                            className={cn(
                              "mt-1 flex-shrink-0 w-6 h-6 rounded border transition-all flex items-center justify-center",
                              completed.includes(step.id) 
                                ? "bg-green-600 border-green-400 text-white" 
                                : "border-bf-orange/50 hover:border-bf-orange"
                            )}
                          >
                            {completed.includes(step.id) && <CheckCircle2 className="w-4 h-4" />}
                          </button>
                          <div className="flex-1">
                            <h3 className={cn(
                              "font-bold transition-colors",
                              completed.includes(step.id) ? "text-green-400 line-through opacity-50" : "text-white"
                            )}>
                              {step.label}
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed mt-1">
                              {isSpeedrun ? step.speedrun : step.detailed}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Interactive Tools per Section */}
                      {section.id === 'omen' && <MorseHelper />}
                      {section.id === 'conflict' && <ConflictGrid />}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Resources Section */}
        <section className="mt-12 p-6 border border-bf-orange/20 rounded-lg bg-black/40 metal-texture">
          <h2 className="text-xl text-bf-orange mb-4 flex items-center gap-2">
            <Settings2 className="w-5 h-5" /> Recursos Externos
          </h2>
          <div className="grid gap-3">
            <a 
              href="https://discord.gg/bfee" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-bf-gray/50 hover:bg-bf-orange/10 rounded border border-white/5 transition-all group"
            >
              <span className="font-bold">BFEE Discord Community</span>
              <ExternalLink className="w-4 h-4 group-hover:text-bf-orange" />
            </a>
            <a 
              href="https://bfee.co/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-bf-gray/50 hover:bg-bf-orange/10 rounded border border-white/5 transition-all group"
            >
              <span className="font-bold">BFEE Official Website</span>
              <ExternalLink className="w-4 h-4 group-hover:text-bf-orange" />
            </a>
            <a 
              href="https://www.audacityteam.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-bf-gray/50 hover:bg-bf-orange/10 rounded border border-white/5 transition-all group"
            >
              <span className="font-bold">Audacity (Para Morse)</span>
              <ExternalLink className="w-4 h-4 group-hover:text-bf-orange" />
            </a>
          </div>
        </section>

        <footer className="text-center text-gray-600 text-xs py-8">
          <p>Desarrollado para la comunidad de Battlefield 1.</p>
          <p className="mt-1">No oficial. Todos los derechos a EA/DICE.</p>
        </footer>
      </main>
    </div>
  );
}
