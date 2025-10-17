import React, { useState } from 'react';
import { FolderOpen, GitBranch, Users, Calendar, MoreVertical, Plus } from 'lucide-react';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);

  const handleNewProject = () => {
    const newProject = {
      id: Date.now(),
      name: `Project ${projects.length + 1}`,
      description: 'New project description...',
      status: 'Planning',
      statusColor: 'text-blue-500',
      team: 1,
      branches: 1,
      lastUpdated: 'Just now',
      progress: 0
    };
    setProjects([newProject, ...projects]);
  };

  const handleProjectClick = (projectId) => {
    console.log('Opening project:', projectId);
  };

  return (
    <div className="flex-1 bg-background-main p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Projects</h1>
            <p className="text-text-secondary">Manage your development projects</p>
          </div>
          <button onClick={handleNewProject} className="btn-primary">
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FolderOpen className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
              <p className="text-text-secondary mb-6">Create your first project to get started</p>
              <button onClick={handleNewProject} className="btn-primary">
                <Plus className="w-5 h-5" />
                Create First Project
              </button>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className="bg-primary-dark-gray rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FolderOpen className="w-6 h-6 text-accent-coral" />
                    <h3 className="text-lg font-semibold text-white group-hover:text-accent-coral transition-colors">{project.name}</h3>
                  </div>
                  <button className="p-1 hover:bg-primary-medium-gray rounded transition-colors">
                    <MoreVertical className="w-5 h-5 text-text-muted" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-text-secondary mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-muted">Progress</span>
                    <span className="text-sm text-text-primary">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-background-input rounded-full h-2">
                    <div
                      className="bg-accent-coral rounded-full h-2 transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Project Meta */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-text-muted">
                      <Users className="w-4 h-4" />
                      <span>{project.team}</span>
                    </div>
                    <div className="flex items-center gap-1 text-text-muted">
                      <GitBranch className="w-4 h-4" />
                      <span>{project.branches}</span>
                    </div>
                    <div className="flex items-center gap-1 text-text-muted">
                      <Calendar className="w-4 h-4" />
                      <span>{project.lastUpdated}</span>
                    </div>
                  </div>
                  <span className={`font-medium ${project.statusColor}`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
