import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useNavigate } from "react-router-dom";
import { EngagementGate } from "@/components/buyer/EngagementGate";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Clock, Users } from "lucide-react";

const BuyerInterface = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const navigate = useNavigate();

  // Mock data for 3D models
  const [models, setModels] = useState([
    {
      id: "1",
      name: "Industrial Gear Assembly",
      description: "A complex gear system for heavy machinery.",
      image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      category: "Industrial",
      price: 1999,
      creator: "FormVerse Designs",
      downloads: 325,
      uploadDate: "2 days ago",
      isFeatured: true,
      isNew: true,
      printabilityScore: 92
    },
    {
      id: "2",
      name: "Futuristic Desk Organizer",
      description: "A sleek and modern organizer for your workspace.",
      image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      category: "Art & Design",
      price: 499,
      creator: "Studio Ghiberti",
      downloads: 580,
      uploadDate: "5 days ago",
      isFeatured: false,
      isNew: false,
      printabilityScore: 88
    },
    {
      id: "3",
      name: "Ergonomic Phone Stand",
      description: "An adjustable stand for comfortable phone viewing.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560ba3e51c?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      category: "Electronics",
      price: 299,
      creator: "PixelPrint",
      downloads: 812,
      uploadDate: "1 week ago",
      isFeatured: false,
      isNew: false,
      printabilityScore: 95
    },
    {
      id: "4",
      name: "Modular Tool Holder",
      description: "A customizable holder for organizing your tools.",
      image: "https://images.unsplash.com/photo-1542291726-7a3494492f1c?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      category: "Tools",
      price: 0,
      creator: "MakerSpace",
      downloads: 1245,
      uploadDate: "2 weeks ago",
      isFeatured: true,
      isNew: false,
      printabilityScore: 90
    },
    {
      id: "5",
      name: "Fantasy Castle Miniature",
      description: "A detailed miniature of a fantasy castle for gaming.",
      image: "https://images.unsplash.com/photo-1589652717521-10c0d34a3762?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
      category: "Gaming",
      price: 799,
      creator: "DragonForge",
      downloads: 678,
      uploadDate: "1 month ago",
      isFeatured: false,
      isNew: false,
      printabilityScore: 85
    }
  ]);

  // Filter models based on search query, category, and price range
  const filteredModels = models.filter((model) => {
    const searchMatch =
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.creator.toLowerCase().includes(searchQuery.toLowerCase());

    const categoryMatch =
      selectedCategory === "all" || model.category === selectedCategory;

    let priceMatch = true;
    if (selectedPriceRange === "free") {
      priceMatch = model.price === 0;
    } else if (selectedPriceRange === "under-500") {
      priceMatch = model.price > 0 && model.price <= 500;
    } else if (selectedPriceRange === "500-2000") {
      priceMatch = model.price > 500 && model.price <= 2000;
    } else if (selectedPriceRange === "above-2000") {
      priceMatch = model.price > 2000;
    }

    return searchMatch && categoryMatch && priceMatch;
  });

  // Track user interactions
  const trackInteraction = (action: string, modelId: string, metadata?: any) => {
    const interaction = {
      action,
      modelId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      sessionId: sessionStorage.getItem('session_id') || Date.now().toString(),
      ...metadata
    };

    // Store interaction data
    const existingInteractions = JSON.parse(localStorage.getItem('user_interactions') || '[]');
    existingInteractions.push(interaction);
    localStorage.setItem('user_interactions', JSON.stringify(existingInteractions));

    console.log('Tracked interaction:', interaction);
  };

  const handleCardClick = (model: any) => {
    trackInteraction('model_click', model.id, {
      modelName: model.name,
      category: model.category,
      timeOnPage: Date.now() - (parseInt(sessionStorage.getItem('page_load_time') || '0'))
    });
    navigate(`/model/${model.id}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value) {
      trackInteraction('search', 'search_query', { query: value });
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    trackInteraction('filter_change', 'filter', { filterType, value });
    
    if (filterType === 'category') {
      setSelectedCategory(value);
    } else if (filterType === 'price') {
      setSelectedPriceRange(value);
    }
  };

  // Track page load
  React.useEffect(() => {
    sessionStorage.setItem('page_load_time', Date.now().toString());
    trackInteraction('page_load', 'buyer_interface');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <div className="container py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Discover 3D Models</h1>
          <p className="text-muted-foreground">
            Find high-quality, print-ready 3D models with AI-powered recommendations and detailed metadata.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search models, tags, or creators..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Select value={selectedCategory} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="automotive">Automotive</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="tools">Tools & Accessories</SelectItem>
                <SelectItem value="art">Art & Design</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPriceRange} onValueChange={(value) => handleFilterChange('price', value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="under-500">Under ₹500</SelectItem>
                <SelectItem value="500-2000">₹500 - ₹2000</SelectItem>
                <SelectItem value="above-2000">Above ₹2000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModels.map((model) => (
            <Card key={model.id} className="group hover:shadow-lg transition-all duration-200">
              <div className="relative">
                {/* Watermarked Preview */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={model.image} 
                    alt={model.name}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                  />
                  {/* Watermark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute bottom-2 right-2 text-white/70 text-xs font-mono">
                    FormVerse Preview
                  </div>
                  
                  {/* Engagement tracking on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 flex items-center justify-center"
                    onMouseEnter={() => trackInteraction('model_hover', model.id, { modelName: model.name })}
                  >
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        trackInteraction('preview_click', model.id);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Quick Preview
                    </Button>
                  </div>
                </div>

                {/* Model badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {model.isFeatured && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                      Featured
                    </Badge>
                  )}
                  {model.isNew && (
                    <Badge variant="secondary">New</Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold line-clamp-2">{model.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{model.description}</p>
                  
                  {/* Metadata badges */}
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {model.category}
                    </Badge>
                    {model.printabilityScore && (
                      <Badge variant="outline" className="text-xs">
                        {model.printabilityScore}/100 Print Score
                      </Badge>
                    )}
                  </div>

                  {/* Creator and stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>by {model.creator}</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {model.downloads || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {model.uploadDate}
                      </span>
                    </div>
                  </div>

                  {/* Price and actions */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-semibold">
                      {model.price === 0 ? 'Free' : `₹${model.price}`}
                    </span>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(model);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Engagement Gate for downloads */}
                  <EngagementGate
                    modelId={model.id}
                    modelName={model.name}
                    previewImage={model.image}
                    onEngagement={(data) => {
                      trackInteraction('engagement_gate', model.id, data);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load more button */}
        {filteredModels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No models found matching your criteria.</p>
          </div>
        )}
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default BuyerInterface;
