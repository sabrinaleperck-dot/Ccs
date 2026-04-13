import React, { useState } from 'react';
import { generateAudit } from './services/geminiService';
import ReactMarkdown from 'react-markdown';
import { 
  Search, 
  FileText, 
  AlertCircle, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  TrendingUp, 
  Eye, 
  Link as LinkIcon,
  Download,
  Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [links, setLinks] = useState<string[]>(['']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);

  const handleAddLink = () => {
    setLinks([...links, '']);
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleRemoveLink = (index: number) => {
    if (links.length > 1) {
      const newLinks = links.filter((_, i) => i !== index);
      setLinks(newLinks);
    }
  };

  const handleGenerate = async () => {
    const validLinks = links.filter(link => link.trim() !== '');
    if (validLinks.length === 0) {
      toast.error("Veuillez entrer au moins un lien valide.");
      return;
    }

    setIsGenerating(true);
    setAuditResult(null);
    
    try {
      const result = await generateAudit(validLinks, companyName, industry);
      setAuditResult(result || "Erreur lors de la génération de l'audit.");
      toast.success("Audit généré avec succès !");
    } catch (error) {
      toast.error("Une erreur est survenue lors de la génération.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#121212] text-zinc-200 font-sans selection:bg-emerald-500/30">
      <Toaster position="top-right" theme="dark" />
      
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Concept Com Stratégie</h1>
              <p className="text-xs text-emerald-500 font-medium uppercase tracking-widest">Audit de Présence Numérique</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {auditResult && (
              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 border-zinc-700 hover:bg-zinc-800">
                <Printer className="w-4 h-4" />
                Imprimer / PDF
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Search className="w-5 h-5 text-emerald-500" />
                    Analyse de Prospection
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Entrez les liens (Site web, Instagram, LinkedIn, etc.) pour générer un audit "électrochoc".
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Nom de l'entreprise</label>
                      <Input
                        placeholder="Ex: Ma Super Entreprise"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="bg-zinc-950 border-zinc-800 focus:ring-emerald-500 text-zinc-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Secteur d'activité</label>
                      <Input
                        placeholder="Ex: Immobilier, Restauration..."
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="bg-zinc-950 border-zinc-800 focus:ring-emerald-500 text-zinc-200"
                      />
                    </div>
                  </div>

                  <Separator className="bg-zinc-800 my-4" />

                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Liens à analyser</label>
                    {links.map((link, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="relative flex-1">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <Input
                            placeholder="https://..."
                            value={link}
                            onChange={(e) => handleLinkChange(index, e.target.value)}
                            className="pl-10 bg-zinc-950 border-zinc-800 focus:ring-emerald-500 text-zinc-200"
                          />
                        </div>
                        {links.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveLink(index)}
                            className="text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
                          >
                            <AlertCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleAddLink} 
                    className="w-full border-dashed border-zinc-700 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/50"
                  >
                    + Ajouter un lien
                  </Button>

                  <Separator className="bg-zinc-800 my-6" />

                  <Button 
                    onClick={handleGenerate} 
                    disabled={isGenerating}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-6 shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ANALYSE EN COURS...
                      </>
                    ) : (
                      <>
                        GÉNÉRER L'AUDIT ÉLECTROCHOC
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats / Info */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-zinc-900/50 border-zinc-800 p-4">
                <TrendingUp className="w-5 h-5 text-emerald-500 mb-2" />
                <h3 className="text-sm font-semibold text-white">Impact Direct</h3>
                <p className="text-xs text-zinc-500">Analyse du manque à gagner immédiat.</p>
              </Card>
              <Card className="bg-zinc-900/50 border-zinc-800 p-4">
                <Eye className="w-5 h-5 text-emerald-500 mb-2" />
                <h3 className="text-sm font-semibold text-white">Visibilité</h3>
                <p className="text-xs text-zinc-500">Score de présence sur les moteurs.</p>
              </Card>
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!auditResult && !isGenerating ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[500px] border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center p-12 text-center"
                >
                  <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                    <FileText className="w-10 h-10 text-zinc-700" />
                  </div>
                  <h2 className="text-xl font-semibold text-zinc-500 mb-2">En attente d'analyse</h2>
                  <p className="text-zinc-600 max-w-xs">
                    Remplissez les liens à gauche pour générer votre rapport stratégique complet.
                  </p>
                </motion.div>
              ) : isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[500px] bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center p-12 text-center"
                >
                  <div className="relative mb-8">
                    <div className="w-24 h-24 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                    <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Analyse Stratégique...</h2>
                  <div className="space-y-2 max-w-sm">
                    <p className="text-emerald-500 text-sm font-mono animate-pulse">Extraction des données...</p>
                    <p className="text-zinc-500 text-xs">Nous scannons la présence numérique pour identifier les failles critiques.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full"
                >
                  <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
                    <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/5">
                      RAPPORT GÉNÉRÉ
                    </Badge>
                    <span className="text-xs text-zinc-500 font-mono">
                      {new Date().toLocaleDateString('fr-FR')} - {new Date().toLocaleTimeString('fr-FR')}
                    </span>
                  </div>
                  <ScrollArea className="flex-1 p-8 md:p-12 print:p-0">
                    <div className="markdown-body prose prose-invert max-w-none">
                      <ReactMarkdown>{auditResult}</ReactMarkdown>
                    </div>
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 mt-12 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-zinc-600 text-sm">
            © {new Date().getFullYear()} Concept Com Stratégie. Outil d'audit confidentiel à usage interne.
          </p>
        </div>
      </footer>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; color: black !important; }
          header, footer, .lg\\:col-span-5, .badge, button { display: none !important; }
          .lg\\:col-span-7 { width: 100% !important; border: none !important; }
          .markdown-body { color: black !important; }
          .markdown-body h1 { color: #059669 !important; border-bottom: 2px solid #059669 !important; }
          .markdown-body h2 { color: #10b981 !important; }
          .markdown-body th { background: #f4f4f5 !important; color: black !important; border: 1px solid #d4d4d8 !important; }
          .markdown-body td { border: 1px solid #d4d4d8 !important; }
          .markdown-body hr { border-color: #d4d4d8 !important; }
          .markdown-body blockquote { border-color: #10b981 !important; color: #52525b !important; }
          .gauge-text { color: #059669 !important; }
        }
      `}} />
    </div>
  );
}
