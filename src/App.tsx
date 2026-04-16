import { useState } from "react";
import { GameData } from "./types";
// On importera les données ici quand on les aura créées
// import { gen1Data } from "./data/gen1";
// import { gen4Data } from "./data/gen4";

export default function App() {
  const [activeGen, setActiveGen] = useState<GameData | null>(null);

  // Écran de sélection de la génération
  if (!activeGen) {
    return (
      <div style={{height:"100dvh", background:"#2C3E50", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Courier New', monospace", color:"#FFF"}}>
        <h1 style={{textShadow:"2px 2px 0 #000", marginBottom: 40, textAlign:"center"}}>POKÉMON RANDOMIZER<br/><span style={{fontSize: 16, color:"#F1C40F"}}>Choisis ta génération</span></h1>
        
        <div style={{display:"flex", gap: 20, flexWrap: "wrap", justifyContent: "center"}}>
          <button 
            // onClick={() => setActiveGen(gen1Data)} 
            disabled // Désactivé en attendant qu'on ajoute les données
            style={{padding: "20px 40px", fontSize: 20, fontWeight: "bold", cursor: "pointer", background: "#3498DB", color: "#FFF", border: "4px solid #F0ECD6", borderRadius: 12, boxShadow: "0 6px 0 #1A252F"}}>
            Kanto (Génération 1)
          </button>

          <button 
            // onClick={() => setActiveGen(gen4Data)}
            disabled // Désactivé en attendant qu'on ajoute les données
            style={{padding: "20px 40px", fontSize: 20, fontWeight: "bold", cursor: "pointer", background: "#E3350D", color: "#FFF", border: "4px solid #F0ECD6", borderRadius: 12, boxShadow: "0 6px 0 #1A252F"}}>
            Sinnoh (Génération 4)
          </button>
        </div>
      </div>
    );
  }

  // Ici on placera tout le code du jeu (qui est dans ton App.tsx actuel) 
  // en utilisant activeGen.STORY au lieu de STORY, etc.
  return (
    <div style={{color: "#FFF", textAlign:"center", padding: 50}}>
      Jeu chargé pour : {activeGen.name}
    </div>
  );
}
