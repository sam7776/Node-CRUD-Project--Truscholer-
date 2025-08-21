import { useState } from "react";
import { ItemList } from "@/components/ItemList";
import { ItemForm } from "@/components/ItemForm";
import { useItems } from "@/hooks/useItems";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Item {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

const Index = () => {
  const { items, isLoading, createItem, updateItem, deleteItem } = useItems();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await deleteItem(id);
    }
  };

  const handleSubmit = async (itemData: Omit<Item, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsSubmitting(true);
      if (editingItem) {
        await updateItem(editingItem.id, itemData);
      } else {
        await createItem(itemData);
      }
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (error) {
      // Error handled in useItems hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Truscholer
          </h1>
          <p className="text-xl text-muted-foreground">Simple CRUD Application</p>
        </div>

        <ItemList
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          isLoading={isLoading}
        />

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-md animate-scale-in">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Item" : "Add New Item"}
              </DialogTitle>
            </DialogHeader>
            <ItemForm
              item={editingItem}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
