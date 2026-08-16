import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import SpotlightEditor from './SpotlightEditor';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

export default function AdminSpotlightTab() {
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: spotlightItems = [] } = useQuery({
    queryKey: ['admin-spotlight'],
    queryFn: () => base44.entities.SpotlightItem.list('-created_date', 50),
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-spotlight'] });
    queryClient.invalidateQueries({ queryKey: ['spotlight-featured'] });
  };

  const approveSpotlight = async (item) => {
    await base44.entities.SpotlightItem.update(item.id, { status: 'approved', is_featured: true });
    invalidateAll();
    toast.success('Spotlight item approved & featured!');
  };

  const rejectSpotlight = async (item) => {
    await base44.entities.SpotlightItem.update(item.id, { status: 'rejected', is_featured: false });
    invalidateAll();
    toast.success('Spotlight item rejected');
  };

  const deleteSpotlight = async (id) => {
    await base44.entities.SpotlightItem.delete(id);
    invalidateAll();
    toast.success('Deleted');
  };

  const itemToDelete = spotlightItems.find(i => i.id === deleteId);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground font-semibold">
          Approve submissions to feature them on the homepage. ⭐ = currently featured.
        </p>
        <Button size="sm" className="gap-2" onClick={() => { setEditingItem(null); setShowEditor(true); }}>
          <Plus className="w-4 h-4" /> New Item
        </Button>
      </div>

      {showEditor && (
        <div className="mb-4">
          <SpotlightEditor
            item={editingItem}
            onSave={() => { setShowEditor(false); setEditingItem(null); invalidateAll(); }}
            onCancel={() => { setShowEditor(false); setEditingItem(null); }}
          />
        </div>
      )}

      <div className="space-y-3">
        {spotlightItems.map(item => (
          <div key={item.id} className="flex gap-4 items-center bg-card border border-border rounded-xl p-4">
            {item.image_url && (
              <img src={item.image_url} alt={item.title} className="w-14 h-14 rounded-xl object-cover flex-none" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Badge variant={item.status === 'approved' ? 'default' : item.status === 'rejected' ? 'destructive' : 'secondary'} className="text-xs">
                  {item.status}
                </Badge>
                {item.is_featured && <Badge className="bg-accent text-white text-xs border-0">⭐ Featured</Badge>}
              </div>
              <p className="font-semibold text-sm truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                By {item.author_name}{item.author_age ? `, Age ${item.author_age}` : ''}{item.author_city ? `, ${item.author_city}` : ''}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              {item.status !== 'approved' && (
                <Button variant="ghost" size="icon" onClick={() => approveSpotlight(item)} title="Approve & Feature">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </Button>
              )}
              {item.status !== 'rejected' && (
                <Button variant="ghost" size="icon" onClick={() => rejectSpotlight(item)} title="Reject">
                  <XCircle className="w-4 h-4 text-destructive" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => { setEditingItem(item); setShowEditor(true); }}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {spotlightItems.length === 0 && !showEditor && (
          <div className="text-center py-12 text-muted-foreground">No submissions yet.</div>
        )}
      </div>

      <ConfirmDeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => { deleteSpotlight(deleteId); setDeleteId(null); }}
        title="Delete this spotlight item?"
        description={itemToDelete ? `"${itemToDelete.title}" will be permanently removed.` : 'This action cannot be undone.'}
      />
    </div>
  );
}