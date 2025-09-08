import { useState } from "react";
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Tag, 
  MoreHorizontal,
  Folder,
  FileText,
  Image,
  Box,
  Clock,
  Star
} from "lucide-react";

interface Asset {
  id: string;
  name: string;
  type: 'model' | 'texture' | 'image' | 'project';
  thumbnail?: string;
  size?: string;
  date: string;
  tags: string[];
  starred?: boolean;
}

export const AssetSidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data - in real app this would come from API/database
  const assets: Asset[] = [
    {
      id: "1",
      name: "Robot Model v2",
      type: "model",
      size: "2.4 MB",
      date: "2024-01-15",
      tags: ["robot", "futuristic", "mechanical"],
      starred: true
    },
    {
      id: "2", 
      name: "Metal Texture Pack",
      type: "texture",
      size: "8.1 MB",
      date: "2024-01-14",
      tags: ["metal", "material", "pbr"]
    },
    {
      id: "3",
      name: "Concept Sketch",
      type: "image", 
      size: "1.2 MB",
      date: "2024-01-13",
      tags: ["sketch", "concept", "reference"]
    },
    {
      id: "4",
      name: "Vehicle Project",
      type: "project",
      date: "2024-01-12",
      tags: ["vehicle", "car", "automotive"]
    }
  ];

  const categories = [
    { id: "all", label: "All Assets", count: assets.length },
    { id: "model", label: "3D Models", count: assets.filter(a => a.type === 'model').length },
    { id: "texture", label: "Textures", count: assets.filter(a => a.type === 'texture').length },
    { id: "image", label: "Images", count: assets.filter(a => a.type === 'image').length },
    { id: "project", label: "Projects", count: assets.filter(a => a.type === 'project').length }
  ];

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'model': return Box;
      case 'texture': return Image;
      case 'image': return FileText;
      case 'project': return Folder;
      default: return FileText;
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || asset.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Sidebar className="w-80 border-r border-border bg-card/50">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Asset Manager</h2>
          <Button size="sm" variant="outline">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Categories */}
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => (
                <SidebarMenuItem key={category.id}>
                  <SidebarMenuButton
                    onClick={() => setSelectedCategory(category.id)}
                    isActive={selectedCategory === category.id}
                    className="flex items-center justify-between"
                  >
                    <span>{category.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Assets List */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>Recent Assets</span>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2 pr-2">
                {filteredAssets.map((asset) => {
                  const IconComponent = getAssetIcon(asset.type);
                  return (
                    <Card key={asset.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          {/* Asset Icon/Thumbnail */}
                          <div className="w-10 h-10 rounded-md bg-muted/50 flex items-center justify-center flex-shrink-0">
                            {asset.thumbnail ? (
                              <img 
                                src={asset.thumbnail} 
                                alt={asset.name}
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <IconComponent className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          
                          {/* Asset Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-1">
                              <h3 className="text-sm font-medium truncate text-foreground">
                                {asset.name}
                              </h3>
                              {asset.starred && (
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <Clock className="w-3 h-3" />
                              <span>{asset.date}</span>
                              {asset.size && (
                                <>
                                  <span>•</span>
                                  <span>{asset.size}</span>
                                </>
                              )}
                            </div>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-2">
                              {asset.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                                  {tag}
                                </Badge>
                              ))}
                              {asset.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  +{asset.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <Download className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <Tag className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};