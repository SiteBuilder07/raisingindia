import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Headphones } from 'lucide-react';
import { toast } from 'sonner';
import PodcastEditor from './PodcastEditor';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

export default function AdminPodcastsTab() {
  const queryClient = useQueryClient();
  const [editingPodcast, setEditingPodcast] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: podcasts = [] } = useQuery({
    queryKey: ['admin-podcasts'],
    queryFn: () => base44.entities.Podcast.list('-published_date', 50),
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-podcasts'] });
    queryClient.invalidateQueries({ queryKey: ['podcasts-latest'] });
  };

  const deletePodcast = async (id) => {
    await base44.entities.Podcast.delete(id);
    invalidateAll();
    toast.success('Episode deleted');
  };

  const podcastToDelete = podcasts.find(p => p.id === deleteId);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-muted-foreground">Manage podcast episodes</p>
        <Button size="sm" className="gap-2" onClick={() => { setEditingPodcast(null); setShowEditor(true); }}>
          <Plus className="w-4 h-4" /> New Episode
        </Button>
      </div>

      {showEditor && (
        <div className="mb-4">
          <PodcastEditor
            podcast={editingPodcast}
            onSave={() => { setShowEditor(false); setEditingPodcast(null); invalidateAll(); }}
            onCancel={() => { setShowEditor(false); setEditingPodcast(null); }}
          />
        </div>
      )}

      <div className="space-y-3">
        {podcasts.map(ep => (
          <div key={ep.id} className="flex gap-4 items-center bg-card border border-border rounded-xl p-4">
            {ep.cover_image ? (
              <img src={ep.cover_image} alt={ep.title} className="w-12 h-12 rounded-xl object-cover flex-none" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-none">
                <Headphones className="w-5 h-5 text-accent" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {ep.is_latest && <Badge className="bg-accent text-white text-xs border-0">NEW</Badge>}
                {ep.episode_number && <span className="text-xs text-muted-foreground font-bold">Ep. {ep.episode_number}</span>}
              </div>
              <p className="font-semibold text-sm truncate">{ep.title}</p>
              {ep.duration && <p className="text-xs text-muted-foreground">{ep.duration}</p>}
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => { setEditingPodcast(ep); setShowEditor(true); }}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleteId(ep.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {podcasts.length === 0 && !showEditor && (
          <div className="text-center py-12 text-muted-foreground">No podcast episodes yet.</div>
        )}
      </div>

      <ConfirmDeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => { deletePodcast(deleteId); setDeleteId(null); }}
        title="Delete this episode?"
        description={podcastToDelete ? `"${podcastToDelete.title}" will be permanently removed.` : 'This action cannot be undone.'}
      />
    </div>
  );
}