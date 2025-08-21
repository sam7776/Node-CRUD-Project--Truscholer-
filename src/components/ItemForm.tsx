import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Item {
  id?: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
}

interface ItemFormProps {
  item?: Item;
  onSubmit: (item: Omit<Item, 'id'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ItemForm = ({ item, onSubmit, onCancel, isLoading }: ItemFormProps) => {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price || "",
    category: item?.category || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      description: formData.description || null,
      price: formData.price ? parseFloat(formData.price.toString()) : null,
      category: formData.category || null,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                className="transition-all duration-200 focus:scale-[1.02] bg-background border-border"
                placeholder="Enter item name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-foreground">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="transition-all duration-200 focus:scale-[1.02] bg-background border-border min-h-[80px]"
                placeholder="Enter item description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium text-foreground">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  className="transition-all duration-200 focus:scale-[1.02] bg-background border-border"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-foreground">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="transition-all duration-200 focus:scale-[1.02] bg-background border-border"
                  placeholder="Enter category"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button 
              type="submit" 
              disabled={isLoading || !formData.name.trim()}
              className="flex-1 hover-scale transition-all duration-200"
            >
              {isLoading ? "Saving..." : item ? "Update" : "Create"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1 hover-scale transition-all duration-200"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};