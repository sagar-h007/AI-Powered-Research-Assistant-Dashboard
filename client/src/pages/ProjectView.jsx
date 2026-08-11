import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Sparkles, Plus } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const ProjectView = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // New document form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: '', content: '' });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const [projRes, docsRes] = await Promise.all([
          axiosClient.get(`/projects/${projectId}`),
          axiosClient.get(`/projects/${projectId}/documents`)
        ]);
        setProject(projRes.data);
        setDocuments(docsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [projectId]);

  const handleAddDocument = async (e) => {
    e.preventDefault();
    if (!newDoc.title || !newDoc.content) return;
    
    try {
      setAdding(true);
      const { data } = await axiosClient.post(`/projects/${projectId}/documents`, newDoc);
      setDocuments([data, ...documents]); // Add to top
      setNewDoc({ title: '', content: '' });
      setShowAddForm(false);
    } catch (err) {
      alert('Error adding document');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading project context...</div>;
  if (!project) return <div className="p-8 text-center text-red-500">Project not found</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="p-2 hover:bg-gray-100 dark:hover:bg-dark-card rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            {project.title}
            <span className="text-xs font-medium px-2 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 rounded-md">
              {project.status}
            </span>
          </h1>
          {project.description && (
            <p className="text-gray-500 dark:text-gray-400 mt-1">{project.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Documents List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-500" />
              Source Documents
            </h2>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-dark-card dark:hover:bg-dark-border rounded-md transition-colors text-gray-600 dark:text-gray-300"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showAddForm && (
            <div className="card p-4 border-primary-500 ring-1 ring-primary-500">
              <form onSubmit={handleAddDocument} className="space-y-3">
                <input
                  type="text"
                  placeholder="Document Title"
                  className="input-field text-sm py-1.5"
                  value={newDoc.title}
                  onChange={e => setNewDoc({...newDoc, title: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Paste context/content here for AI analysis..."
                  className="input-field text-sm py-1.5 h-24 resize-none"
                  value={newDoc.content}
                  onChange={e => setNewDoc({...newDoc, content: e.target.value})}
                  required
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAddForm(false)} className="text-xs px-3 py-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
                  <button type="submit" disabled={adding} className="btn-primary text-xs px-3 py-1.5">
                    {adding ? 'Processing...' : 'Analyze & Add'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {documents.length === 0 && !showAddForm ? (
              <div className="text-sm text-gray-500 text-center p-4 border border-dashed border-gray-300 dark:border-dark-border rounded-lg">
                No documents added yet. Add one to generate AI insights.
              </div>
            ) : (
              documents.map(doc => (
                <div key={doc._id} className="card p-4 hover:border-primary-500 cursor-pointer transition-colors group">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">{doc.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {doc.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: AI Insights (Kanban / Cards style) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI Synthesis & Insights
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map(doc => (
              <div key={`ai-${doc._id}`} className="card bg-gradient-to-br from-white to-purple-50/30 dark:from-dark-card dark:to-purple-900/10 border-purple-100 dark:border-purple-900/30 p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Sparkles className="w-16 h-16" />
                </div>
                <div className="relative z-10">
                  <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2">Analysis: {doc.title}</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {doc.aiSummary || 'AI is currently analyzing this document...'}
                  </p>
                </div>
              </div>
            ))}
            
            {documents.length === 0 && (
              <div className="col-span-full card p-8 text-center bg-gray-50/50 dark:bg-dark-card/50">
                <Sparkles className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Add documents to the project to view AI generated insights and summaries here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;
