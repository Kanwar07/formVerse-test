
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Loader2, Package, Truck, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PrintingTechnique {
  id: string;
  name: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  leadTime: string;
  materials: Material[];
}

interface Material {
  id: string;
  name: string;
  price: number;
  properties: string[];
  color: string;
}

interface CadQuaPricingProps {
  modelId: string;
  modelName: string;
  fileUrl: string;
  onOrderPlaced?: (orderId: string) => void;
}

export const CadQuaPricing = ({ 
  modelId, 
  modelName, 
  fileUrl, 
  onOrderPlaced 
}: CadQuaPricingProps) => {
  const [loading, setLoading] = useState(true);
  const [techniques, setTechniques] = useState<PrintingTechnique[]>([]);
  const [selectedTechnique, setSelectedTechnique] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [ordering, setOrdering] = useState(false);
  const { toast } = useToast();

  // Mock CadQua API response - replace with actual API call
  useEffect(() => {
    const fetchPricingData = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data - replace with actual CadQua API response
      const mockTechniques: PrintingTechnique[] = [
        {
          id: "fdm",
          name: "FDM (Fused Deposition Modeling)",
          description: "Cost-effective for prototypes and functional parts",
          minPrice: 250,
          maxPrice: 800,
          leadTime: "2-3 days",
          materials: [
            { 
              id: "pla", 
              name: "PLA", 
              price: 320, 
              properties: ["Biodegradable", "Easy to print", "Low warping"],
              color: "#4ade80"
            },
            { 
              id: "abs", 
              name: "ABS", 
              price: 380, 
              properties: ["Strong", "Heat resistant", "Chemical resistant"],
              color: "#60a5fa"
            },
            { 
              id: "petg", 
              name: "PETG", 
              price: 420, 
              properties: ["Chemical resistant", "Transparent", "Food safe"],
              color: "#a78bfa"
            }
          ]
        },
        {
          id: "sla",
          name: "SLA (Stereolithography)",
          description: "High precision and smooth surface finish",
          minPrice: 450,
          maxPrice: 1200,
          leadTime: "3-4 days",
          materials: [
            { 
              id: "standard_resin", 
              name: "Standard Resin", 
              price: 580, 
              properties: ["High detail", "Smooth finish", "Brittle"],
              color: "#f59e0b"
            },
            { 
              id: "tough_resin", 
              name: "Tough Resin", 
              price: 720, 
              properties: ["Impact resistant", "Flexible", "Durable"],
              color: "#ef4444"
            },
            { 
              id: "clear_resin", 
              name: "Clear Resin", 
              price: 650, 
              properties: ["Transparent", "High detail", "UV stable"],
              color: "#06b6d4"
            }
          ]
        },
        {
          id: "sls",
          name: "SLS (Selective Laser Sintering)",
          description: "No support structures needed, great for complex geometries",
          minPrice: 800,
          maxPrice: 2500,
          leadTime: "5-7 days",
          materials: [
            { 
              id: "nylon_pa12", 
              name: "Nylon PA12", 
              price: 1200, 
              properties: ["Strong", "Flexible", "Chemical resistant"],
              color: "#8b5cf6"
            },
            { 
              id: "glass_filled_nylon", 
              name: "Glass-Filled Nylon", 
              price: 1450, 
              properties: ["Very strong", "Heat resistant", "Low creep"],
              color: "#64748b"
            }
          ]
        }
      ];
      
      setTechniques(mockTechniques);
      setSelectedTechnique(mockTechniques[0].id);
      setSelectedMaterial(mockTechniques[0].materials[0].id);
      setLoading(false);
    };

    fetchPricingData();
  }, [modelId, fileUrl]);

  // Calculate total price when selections change
  useEffect(() => {
    if (selectedTechnique && selectedMaterial) {
      const technique = techniques.find(t => t.id === selectedTechnique);
      const material = technique?.materials.find(m => m.id === selectedMaterial);
      if (material) {
        setTotalPrice(material.price * quantity);
      }
    }
  }, [selectedTechnique, selectedMaterial, quantity, techniques]);

  const handleOrder = async () => {
    setOrdering(true);
    
    try {
      // Simulate order placement - replace with actual CadQua API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderId = `cadqua_${Date.now()}`;
      
      toast({
        title: "Order placed successfully!",
        description: `Your 3D printing order ${orderId} has been submitted to CadQua.`,
      });
      
      onOrderPlaced?.(orderId);
    } catch (error) {
      toast({
        title: "Order failed",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setOrdering(false);
    }
  };

  const selectedTech = techniques.find(t => t.id === selectedTechnique);
  const selectedMat = selectedTech?.materials.find(m => m.id === selectedMaterial);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Getting 3D Printing Quotes...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mr-3" />
            <span>Fetching pricing from CadQua...</span>
          </div>
          <Progress value={60} className="mt-4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="h-5 w-5 mr-2" />
          3D Print with CadQua
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Get your "{modelName}" professionally 3D printed and delivered
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={selectedTechnique} onValueChange={setSelectedTechnique}>
          <TabsList className="grid w-full grid-cols-3">
            {techniques.map((technique) => (
              <TabsTrigger key={technique.id} value={technique.id} className="text-xs">
                {technique.name.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {techniques.map((technique) => (
            <TabsContent key={technique.id} value={technique.id} className="space-y-4">
              <div>
                <h4 className="font-medium">{technique.name}</h4>
                <p className="text-sm text-muted-foreground">{technique.description}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <Badge variant="outline">
                    <Truck className="h-3 w-3 mr-1" />
                    {technique.leadTime}
                  </Badge>
                  <span className="text-sm">₹{technique.minPrice} - ₹{technique.maxPrice}</span>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium mb-3">Select Material</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {technique.materials.map((material) => (
                    <div
                      key={material.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedMaterial === material.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedMaterial(material.id)}
                    >
                      <div className="flex items-center mb-2">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: material.color }}
                        />
                        <span className="font-medium text-sm">{material.name}</span>
                      </div>
                      <div className="text-lg font-semibold mb-2">₹{material.price}</div>
                      <div className="space-y-1">
                        {material.properties.slice(0, 2).map((prop, index) => (
                          <Badge key={index} variant="secondary" className="text-xs mr-1">
                            {prop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        {selectedMat && (
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium">Order Summary</h4>
                <p className="text-sm text-muted-foreground">{selectedTech?.name} • {selectedMat.name}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Quantity</div>
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-16 text-center border rounded px-2 py-1"
                />
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Unit Price:</span>
                <span>₹{selectedMat.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span>{quantity}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total:</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span>Quality guaranteed by CadQua</span>
              </div>
              <div className="flex items-center text-sm">
                <Truck className="h-4 w-4 text-blue-600 mr-2" />
                <span>Delivered in {selectedTech?.leadTime}</span>
              </div>
            </div>
            
            <Button 
              className="w-full mt-4" 
              onClick={handleOrder}
              disabled={ordering}
            >
              {ordering ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Placing Order...
                </>
              ) : (
                `Order 3D Print - ₹${totalPrice}`
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
