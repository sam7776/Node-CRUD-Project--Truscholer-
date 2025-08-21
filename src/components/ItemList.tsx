import { Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Item {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

interface ItemListProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  isLoading?: boolean;
}

export const ItemList = ({ items, onEdit, onDelete, onAdd, isLoading }: ItemListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading items...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center animate-fade-in">
        <h2 className="text-3xl font-bold text-foreground">Items</h2>
        <Button onClick={onAdd} className="flex items-center gap-2 hover-scale transition-all duration-200">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="animate-fade-in">
          <CardContent className="py-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg text-muted-foreground">No items found. Create your first item!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, index) => (
            <Card 
              key={item.id} 
              className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 animate-fade-in hover-scale border-border/50 hover:border-primary/30"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                    {item.name}
                  </CardTitle>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(item)}
                      className="h-8 w-8 p-0 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(item.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-all duration-200"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                )}
                
                <div className="flex justify-between items-center pt-2 border-t border-border/50">
                  {item.price !== null ? (
                    <span className="font-bold text-lg text-primary">
                      ${item.price.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">No price</span>
                  )}
                  {item.category && (
                    <Badge variant="secondary" className="text-xs px-2 py-1 animate-scale-in">
                      {item.category}
                    </Badge>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground pt-2 border-t border-border/30">
                  Created: {new Date(item.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};