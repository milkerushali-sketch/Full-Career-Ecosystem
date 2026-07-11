import React, { useState } from 'react';
import { useListMyProjects, getListMyProjectsQueryKey, useAddProject, useUpdateProject, useDeleteProject, Project } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2, Code, Github, Globe, Calendar, Edit, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function StudentProjectsPage() {
  const { data: projects, isLoading } = useListMyProjects({
    query: { queryKey: getListMyProjectsQueryKey() }
  });
  
  const addProject = useAddProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [techStackInput, setTechStackInput] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: [] as string[],
    githubUrl: '',
    liveUrl: '',
    startDate: '',
    endDate: ''
  });

  const openAddDialog = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', techStack: [], githubUrl: '', liveUrl: '', startDate: '', endDate: '' });
    setTechStackInput('');
    setIsDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description || '',
      techStack: project.techStack || [],
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      startDate: project.startDate || '',
      endDate: project.endDate || ''
    });
    setTechStackInput((project.techStack || []).join(', '));
    setIsDialogOpen(true);
  };

  const handleTechStackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTechStackInput(e.target.value);
    setFormData({
      ...formData,
      techStack: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProject.mutate({ id: editingId, data: formData }, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Project updated' });
          queryClient.invalidateQueries({ queryKey: getListMyProjectsQueryKey() });
          setIsDialogOpen(false);
        },
        onError: () => toast({ title: 'Error', description: 'Failed to update project', variant: 'destructive' })
      });
    } else {
      addProject.mutate({ data: formData }, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Project added' });
          queryClient.invalidateQueries({ queryKey: getListMyProjectsQueryKey() });
          setIsDialogOpen(false);
        },
        onError: () => toast({ title: 'Error', description: 'Failed to add project', variant: 'destructive' })
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject.mutate({ id }, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Project deleted' });
          queryClient.invalidateQueries({ queryKey: getListMyProjectsQueryKey() });
        },
        onError: () => toast({ title: 'Error', description: 'Failed to delete project', variant: 'destructive' })
      });
    }
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-48" /><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Skeleton className="h-64 w-full" /><Skeleton className="h-64 w-full" /></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Showcase your practical experience and technical builds.</p>
        </div>
        <Button onClick={openAddDialog}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
      </div>

      {(!projects || projects.length === 0) ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-64 text-center">
            <Code className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No projects added yet</h3>
            <p className="text-muted-foreground max-w-sm mt-1">
              Add projects to demonstrate your practical skills to recruiters.
            </p>
            <Button variant="outline" className="mt-4" onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" /> Create first project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(project => (
            <Card key={project.id} className="flex flex-col overflow-hidden hover-elevate">
              <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl leading-tight line-clamp-2">{project.title}</CardTitle>
                  <div className="flex -mr-2 -mt-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)} className="h-8 w-8 text-muted-foreground">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {(project.startDate || project.endDate) && (
                  <div className="flex items-center text-xs text-muted-foreground mt-2 font-medium">
                    <Calendar className="h-3 w-3 mr-1" />
                    {project.startDate ? format(parseISO(project.startDate), 'MMM yyyy') : 'Unknown'} 
                    {' - '} 
                    {project.endDate ? format(parseISO(project.endDate), 'MMM yyyy') : 'Present'}
                  </div>
                )}
              </CardHeader>
              <CardContent className="pt-4 flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{project.description || 'No description provided.'}</p>
                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.techStack.map(tech => (
                      <span key={tech} className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-primary/10 text-primary border border-primary/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
              {(project.githubUrl || project.liveUrl) && (
                <CardFooter className="pt-3 pb-4 border-t border-border/50 flex gap-3">
                  {project.githubUrl && (
                    <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-3.5 w-3.5" /> Code
                      </a>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-3.5 w-3.5 text-primary" /> Live
                      </a>
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="techStack">Tech Stack (comma separated)</Label>
                <Input id="techStack" value={techStackInput} onChange={handleTechStackChange} placeholder="React, Node.js, PostgreSQL" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (leave empty if ongoing)</Label>
                  <Input id="endDate" type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub Repository URL</Label>
                  <Input id="githubUrl" type="url" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} placeholder="https://github.com/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="liveUrl">Live Demo URL</Label>
                  <Input id="liveUrl" type="url" value={formData.liveUrl} onChange={e => setFormData({...formData, liveUrl: e.target.value})} placeholder="https://..." />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={addProject.isPending || updateProject.isPending}>
                {(addProject.isPending || updateProject.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Project
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}