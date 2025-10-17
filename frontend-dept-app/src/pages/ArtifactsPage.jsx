import React, { useState } from 'react';
import { Grid3x3, Code, Image, FileText, Package, Download, Eye, Share2, MoreVertical } from 'lucide-react';

const ArtifactsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [artifacts, setArtifacts] = useState([]);

  const categories = [
    { id: 'all', label: 'All', count: artifacts.length },
    { id: 'code', label: 'Code', icon: Code, count: artifacts.filter(a => a.type === 'code').length },
    { id: 'images', label: 'Images', icon: Image, count: artifacts.filter(a => a.type === 'images').length },
    { id: 'documents', label: 'Documents', icon: FileText, count: artifacts.filter(a => a.type === 'documents').length },
    { id: 'packages', label: 'Packages', icon: Package, count: artifacts.filter(a => a.type === 'packages').length },
  ];

  const handleNewArtifact = () => {
    const types = ['code', 'images', 'documents', 'packages'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const newArtifact = {
      id: Date.now(),
      type: randomType,
      title: `New ${randomType} artifact`,
      description: 'Description for new artifact...',
      size: '1.2 KB',
      created: 'Just now',
    };
    setArtifacts([newArtifact, ...artifacts]);
  };

  const handleArtifactAction = (action, artifactId) => {
    console.log(`${action} artifact:`, artifactId);
    alert(`${action} feature coming soon!`);
  };

  const getIcon = (type) => {
    switch(type) {
      case 'code': return <Code className="w-5 h-5" />;
      case 'images': return <Image className="w-5 h-5" />;
      case 'documents': return <FileText className="w-5 h-5" />;
      case 'packages': return <Package className="w-5 h-5" />;
      default: return <Grid3x3 className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'code': return 'text-blue-500';
      case 'images': return 'text-green-500';
      case 'documents': return 'text-yellow-500';
      case 'packages': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const filteredArtifacts = selectedCategory === 'all' 
    ? artifacts 
    : artifacts.filter(a => a.type === selectedCategory);

  return (
    <div className="flex-1 bg-background-main p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Artifacts</h1>
            <p className="text-text-secondary">Your generated content and resources</p>
          </div>
          <button onClick={handleNewArtifact} className="btn-primary">
            <Grid3x3 className="w-5 h-5" />
            Create Artifact
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200 whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-accent-coral text-white'
                  : 'bg-primary-medium-gray text-text-secondary hover:bg-primary-light-gray'
              }`}
            >
              {category.icon && <category.icon className="w-4 h-4" />}
              <span>{category.label}</span>
              <span className="ml-1 px-2 py-0.5 bg-black/20 rounded-full text-xs">
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Artifacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtifacts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Grid3x3 className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {artifacts.length === 0 ? 'No artifacts yet' : 'No artifacts found'}
              </h3>
              <p className="text-text-secondary mb-6">
                {artifacts.length === 0 
                  ? 'Create your first artifact to get started' 
                  : 'Try selecting a different category'
                }
              </p>
              {artifacts.length === 0 && (
                <button onClick={handleNewArtifact} className="btn-primary">
                  <Grid3x3 className="w-5 h-5" />
                  Create First Artifact
                </button>
              )}
            </div>
          ) : (
            filteredArtifacts.map((artifact) => (
            <div
              key={artifact.id}
              className="bg-primary-dark-gray rounded-lg p-6 hover:shadow-lg transition-all duration-200 group"
            >
              {/* Artifact Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-md bg-background-input ${getTypeColor(artifact.type)}`}>
                  {getIcon(artifact.type)}
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-primary-medium-gray rounded transition-all duration-200">
                  <MoreVertical className="w-4 h-4 text-text-muted" />
                </button>
              </div>

              {/* Artifact Info */}
              <h3 className="text-white font-medium mb-2 truncate">{artifact.title}</h3>
              <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                {artifact.description}
              </p>

              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-text-muted mb-4">
                <span>{artifact.size}</span>
                <span>{artifact.created}</span>
              </div>

              {/* Additional Info */}
              {artifact.language && (
                <div className="mb-4">
                  <span className="text-xs px-2 py-1 bg-background-input rounded text-text-secondary">
                    {artifact.language}
                  </span>
                </div>
              )}
              {artifact.dimensions && (
                <div className="mb-4">
                  <span className="text-xs px-2 py-1 bg-background-input rounded text-text-secondary">
                    {artifact.dimensions}
                  </span>
                </div>
              )}
              {artifact.version && (
                <div className="mb-4">
                  <span className="text-xs px-2 py-1 bg-background-input rounded text-text-secondary">
                    v{artifact.version}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-primary-medium-gray">
                <button 
                  onClick={() => handleArtifactAction('View', artifact.id)}
                  className="flex-1 px-3 py-2 bg-primary-medium-gray hover:bg-primary-light-gray rounded text-sm text-text-secondary transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button 
                  onClick={() => handleArtifactAction('Download', artifact.id)}
                  className="flex-1 px-3 py-2 bg-primary-medium-gray hover:bg-primary-light-gray rounded text-sm text-text-secondary transition-all duration-200 flex items-center justify-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button 
                  onClick={() => handleArtifactAction('Share', artifact.id)}
                  className="p-2 bg-primary-medium-gray hover:bg-primary-light-gray rounded text-text-secondary transition-all duration-200"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtifactsPage;
