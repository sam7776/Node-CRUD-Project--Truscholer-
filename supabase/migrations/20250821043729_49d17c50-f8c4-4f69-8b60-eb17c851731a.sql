-- Create items table for CRUD operations
CREATE TABLE public.items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no auth required for this CRUD app)
CREATE POLICY "Items are viewable by everyone" 
ON public.items 
FOR SELECT 
USING (true);

CREATE POLICY "Items can be created by everyone" 
ON public.items 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Items can be updated by everyone" 
ON public.items 
FOR UPDATE 
USING (true);

CREATE POLICY "Items can be deleted by everyone" 
ON public.items 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON public.items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();