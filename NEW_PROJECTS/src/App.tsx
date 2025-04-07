import React, { useState } from 'react';
import { Upload, Database, FileJson, FileSpreadsheet, FileCode, AlertCircle, Download } from 'lucide-react';

interface AnalysisResult {
  tables: string[];
  queries: string[];
  forms: string[];
  dependencies: Array<{from: string, to: string}>;
}

function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.name.match(/\.(accdb|mdb)$/)) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Format de fichier non valide. Veuillez déposer un fichier .accdb ou .mdb");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.name.match(/\.(accdb|mdb)$/)) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Format de fichier non valide. Veuillez sélectionner un fichier .accdb ou .mdb");
    }
  };

  const analyzeFile = async () => {
    setLoading(true);
    // Simulation d'analyse - à remplacer par l'appel API réel
    setTimeout(() => {
      setResult({
        tables: ['Clients', 'Commandes', 'Produits'],
        queries: ['RequêteVentes', 'RequêteStock'],
        forms: ['FormulairePrincipal', 'FormulaireCommande'],
        dependencies: [
          {from: 'RequêteVentes', to: 'Clients'},
          {from: 'RequêteVentes', to: 'Commandes'},
          {from: 'RequêteStock', to: 'Produits'}
        ]
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-12">
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
            Analyseur de Base Access
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Analysez les dépendances de votre base de données Access (.accdb/.mdb).
            Visualisez les relations entre tables, requêtes et formulaires.
          </p>
        </header>

        {!file && (
          <div
            className={`border-4 border-dashed rounded-lg p-6 sm:p-12 text-center transition-colors
              ${isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-white'}
              ${error ? 'border-red-300' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-400" />
            <p className="text-lg sm:text-xl mb-3 sm:mb-4">
              Glissez-déposez votre fichier Access ici
            </p>
            <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">ou</p>
            <label className="inline-block">
              <input
                type="file"
                accept=".accdb,.mdb"
                onChange={handleFileSelect}
                className="hidden"
              />
              <span className="bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors">
                Sélectionner un fichier
              </span>
            </label>
            {error && (
              <p className="text-red-500 mt-4 text-sm sm:text-base flex items-center justify-center">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {error}
              </p>
            )}
          </div>
        )}

        {file && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6">
              <div className="flex items-center">
                <Database className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 mr-2 sm:mr-3 flex-shrink-0" />
                <span className="text-base sm:text-lg font-medium truncate max-w-[200px] sm:max-w-none">
                  {file.name}
                </span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={analyzeFile}
                  disabled={loading}
                  className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg text-white text-sm sm:text-base transition-colors
                    ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  {loading ? 'Analyse en cours...' : 'Analyser'}
                </button>
                {result && (
                  <button
                    className="flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors text-sm sm:text-base"
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    Exporter
                  </button>
                )}
              </div>
            </div>

            {loading && (
              <div className="text-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-sm sm:text-base text-gray-600">Analyse des dépendances en cours...</p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3 flex items-center text-sm sm:text-base">
                      <FileCode className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" />
                      Tables
                    </h3>
                    <ul className="space-y-2 text-sm sm:text-base">
                      {result.tables.map(table => (
                        <li key={table} className="text-gray-600">{table}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3 flex items-center text-sm sm:text-base">
                      <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" />
                      Requêtes
                    </h3>
                    <ul className="space-y-2 text-sm sm:text-base">
                      {result.queries.map(query => (
                        <li key={query} className="text-gray-600">{query}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3 flex items-center text-sm sm:text-base">
                      <FileJson className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" />
                      Formulaires
                    </h3>
                    <ul className="space-y-2 text-sm sm:text-base">
                      {result.forms.map(form => (
                        <li key={form} className="text-gray-600">{form}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8">
                  <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Dépendances</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {result.dependencies.map((dep, index) => (
                        <li key={index} className="flex items-center text-sm sm:text-base text-gray-600">
                          <span className="font-medium">{dep.from}</span>
                          <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          <span>{dep.to}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;