import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Item {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

interface ItemInput {
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
}

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast({
        title: "Error",
        description: "Failed to load items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createItem = async (item: ItemInput) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      
      setItems(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Item created successfully",
      });
      return data;
    } catch (error) {
      console.error('Error creating item:', error);
      toast({
        title: "Error",
        description: "Failed to create item",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateItem = async (id: string, item: ItemInput) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .update(item)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setItems(prev => prev.map(i => i.id === id ? data : i));
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      return data;
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setItems(prev => prev.filter(i => i.id !== id));
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    isLoading,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchItems,
  };
};