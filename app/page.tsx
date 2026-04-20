"use client";

import React, { useState, useEffect } from 'react';
import { UploadCloud, DollarSign, Settings, Percent, MessageCircle, Smartphone } from 'lucide-react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

export default function DoraWoodPro() {
  const [result, setResult] = useState<{ volume: number, weight: number } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [material, setMaterial] = useState('Pino');
  const [unitPrice, setUnitPrice] = useState(45); 
  const [hourlyRate, setHourlyRate] = useState(150); 
  const [margin, setMargin] = useState(30); 
  const [totalPrice, setTotalPrice] = useState(0);

  const materiales = {
    'Pino': 45, 'Cedro': 95, 'Caoba': 150, 'MDF 18mm': 28, 'Roble': 130
  };

  useEffect(() => {
    setUnitPrice(materiales[material as keyof typeof materiales]);
  }, [material]);

  useEffect(() => {
    if (result) {
      const materialCost = (result.volume / 100) * unitPrice;
      const estimatedHours = (result.volume / 50) + 0.5; 
      const laborCost = estimatedHours * hourlyRate;
      const subtotal = materialCost + laborCost;
      const profit = subtotal * (margin / 100);
      setTotalPrice(subtotal + profit);
    }
  }, [result, unitPrice, hourlyRate, margin]);

  const irAPagoStripe = () => {
    const stripeLink = "https://buy.stripe.com/TU_LINK_DE_STRIPE_AQUI";
    window.open(stripeLink, "_blank");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const contents = e.target?.result;
        const loader = new STLLoader();
        const geometry = loader.parse(contents as ArrayBuffer);
        let volume = 0;
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 9) {
          const v1 = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
          const v2 = new THREE.Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5]);
          const v3 = new THREE.Vector3(vertices[i + 6], vertices[i + 7], vertices[i + 8]);
          volume += v1.dot(v2.cross(v3)) / 6;
        }
        const volCm3 = Math.abs(volume) / 1000;
        setResult({ volume: volCm3, weight: volCm3 * 0.6 });
      } catch (error) {
        alert("Error al analizar el diseño");
      } finally { setIsAnalyzing(false); }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] text-stone-900 font-sans overflow-x-hidden">
      <nav className="bg-white border-b-4 border-[#8b5e3c] p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-[#8b5e3c] p-2 rounded-lg text-white"><Settings size={18}/></div>
            <span className="text-lg md:text-2xl font-black tracking-tighter uppercase">CG<span className="text-[#8b5e3c]">MAKET</span></span>
          </div>
          <button className="bg-stone-900 text-white px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest">PRO V1.0</button>
        </div>
      </nav>

      <header className="py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-stone-950 mb-4 tracking-tighter leading-tight uppercase">
            Cotizador <br className="md:hidden"/><span className="text-[#8b5e3c]">de Madera</span>
          </h1>
          <p className="text-sm md:text-lg text-stone-600 mb-8 font-medium px-4 tracking-tight">Presupuestos instantáneos analizando tus archivos STL.</p>

          <div className="flex flex-col items-center gap-6">
            <label className="w-full max-w-sm group relative flex flex-col items-center gap-4 bg-stone-950 text-white p-8 md:p-12 rounded-3xl font-bold cursor-pointer hover:bg-stone-800 transition-all shadow-xl border-b-8 border-[#5d3a24] active:border-b-0 active:translate-y-1">
              <UploadCloud size={40} className="text-[#8b5e3c]" />
              <div className="text-center">
                <span className="text-xl md:text-2xl block tracking-tighter uppercase">{isAnalyzing ? "Analizando..." : "Subir Archivo STL"}</span>
                <span className="text-stone-400 font-normal text-xs uppercase tracking-widest mt-1">Cálculo de madera real</span>
              </div>
              <input type="file" accept=".stl" onChange={handleFileUpload} className="hidden" />
            </label>

            {result && (
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 animate-in fade-in slide-in-from-bottom-8">
                <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-lg border border-stone-100 text-left">
                  <h3 className="text-lg font-black mb-6 flex items-center gap-2 text-stone-800 uppercase">
                    <Settings className="text-[#8b5e3c]" size={20} /> Variables
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 block">Tipo de Madera</label>
                      <select value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full p-3 bg-stone-50 border-2 border-stone-100 rounded-xl font-bold text-base outline-none">
                        {Object.keys(materiales).map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 block">Mano de Obra/Hr</label>
                        <div className="relative">
                          <DollarSign size={14} className="absolute left-3 top-3.5 text-stone-400"/>
                          <input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))} className="w-full p-3 pl-8 bg-stone-50 border-2 border-stone-100 rounded-xl font-bold text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 block">% Margen</label>
                        <div className="relative">
                          <Percent size={14} className="absolute left-3 top-3.5 text-stone-400"/>
                          <input type="number" value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full p-3 pl-8 bg-stone-50 border-2 border-stone-100 rounded-xl font-bold text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#8b5e3c] p-8 md:p-10 rounded-[2rem] text-white shadow-xl flex flex-col justify-between border-b-8 border-[#5d3a24]">
                  <div>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest tracking-[0.2em]">Total Sugerido</span>
                    <h2 className="text-5xl md:text-7xl font-black mt-2 leading-none">${totalPrice.toFixed(2)}</h2>
                    <p className="text-stone-200 font-bold uppercase text-[10px] mt-2 tracking-widest">MXN • STRIPE MEXICO</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
                    <div>
                      <p className="text-white/40 text-[9px] font-black uppercase">Volumen</p>
                      <p className="text-lg md:text-xl font-bold">{result.volume.toFixed(2)} cm³</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-[9px] font-black uppercase">Peso Est.</p>
                      <p className="text-lg md:text-xl font-bold">{result.weight.toFixed(2)} kg</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="py-16 bg-stone-100 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12 uppercase tracking-tighter">Planes de Suscripción</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'GRATIS', price: '$0', desc: '5 análisis mensuales para pruebas rápidas.' },
              { name: 'PRO TALLER', price: '$299', desc: 'Análisis ilimitados y atención personalizada vía WhatsApp.', featured: true },
              { name: 'INDUSTRIAL', price: '$450', desc: 'Acceso desde 3 dispositivos y reportes detallados.' }
            ].map((plan, i) => (
              <div key={i} className={`p-8 rounded-[2rem] bg-white border-2 flex flex-col justify-between transition-all hover:shadow-lg ${plan.featured ? 'border-[#8b5e3c] scale-105 shadow-xl relative overflow-hidden' : 'border-stone-200'}`}>
                {plan.featured && <div className="absolute top-0 right-0 bg-[#8b5e3c] text-white px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-bl-lg">El más popular</div>}
                <div className="mb-8">
                  <h3 className="font-black text-lg mb-1 uppercase tracking-tighter">{plan.name}</h3>
                  <p className="text-4xl font-black text-stone-950">{plan.price}<span className="text-[10px] font-normal text-stone-400 block tracking-widest mt-1">PESOS / MES</span></p>
                  <p className="text-stone-500 text-xs mt-6 leading-relaxed flex items-start gap-2 italic">
                    {plan.name === 'PRO TALLER' && <MessageCircle size={14} className="text-[#8b5e3c] shrink-0" />}
                    {plan.name === 'INDUSTRIAL' && <Smartphone size={14} className="text-[#8b5e3c] shrink-0" />}
                    {plan.desc}
                  </p>
                </div>
                <button 
                  onClick={plan.name !== 'GRATIS' ? irAPagoStripe : undefined}
                  className={`w-full py-4 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${plan.featured ? 'bg-[#8b5e3c] text-white shadow-lg active:scale-95' : 'bg-stone-950 text-white'}`}
                >
                  {plan.name === 'GRATIS' ? 'Comenzar' : 'Suscribirse'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-stone-950 text-stone-600 py-16 px-4 text-center border-t-8 border-[#8b5e3c]">
        <p className="font-black text-white text-xl tracking-tighter mb-2 uppercase tracking-[0.2em]">CG<span className="text-[#8b5e3c]">MAKET</span></p>
        <p className="text-[9px] font-black uppercase tracking-widest tracking-[0.3em]">Tepic • Nayarit • México</p>
      </footer>
    </div>
  );
}