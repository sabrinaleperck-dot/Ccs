import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateAudit(links: string[], companyName: string, industry: string) {
  const prompt = `
Tu es un Expert en Audit Stratégique de "Concept Com Stratégie". 
Ta mission est de générer un audit "électrochoc" instantané pour la prospection.

INFORMATIONS CLIENT :
- Entreprise : ${companyName}
- Secteur : ${industry}
- Liens analysés : ${links.join(", ")}

STRUCTURE DU RAPPORT (À RESPECTER STRICTEMENT EN MARKDOWN) :
1. EN-TÊTE : "# Concept Com Stratégie - Audit de Présence Numérique pour ${companyName}"
2. TABLEAU DE DONNÉES : Récapitulatif des chiffres extraits (simule des données réalistes basées sur l'analyse si les liens sont fournis, sinon utilise des placeholders percutants).
3. JAUGES DE SANTÉ : Cohérence, Engagement, Visibilité. Utilise le format [▓▓▓░░░] pour les jauges.
4. ANALYSE DES SERVICES FANTÔMES : Incohérences et offres manquantes spécifiques au secteur ${industry}.
5. MANQUE À GAGNER : Analyse qualitative sur la rupture de confiance client et l'impact financier estimé pour une entreprise de ce secteur.
6. PLAN D'ACTION : 3 recommandations stratégiques prioritaires pour ${companyName}.

DIRECTIVES DE TON :
- Professionnel, expert et percutant.
- Utilise un ton "électrochoc" pour faire réagir le prospect.
- Le Markdown doit être optimisé pour un export PDF (séparateurs horizontaux, tableaux).

ANALYSE :
Analyse les sites/réseaux sociaux fournis. Si tu ne peux pas accéder en temps réel, base-toi sur les types de sites (ex: si c'est un lien Instagram, analyse la stratégie social media type).
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating audit:", error);
    throw error;
  }
}
