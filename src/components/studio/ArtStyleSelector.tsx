import { useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { artStyles, type ArtStyle } from "@/constants/artStyles";

interface ArtStyleSelectorProps {
  selectedStyle?: string;
  onStyleChange: (styleId: string) => void;
}

export const ArtStyleSelector = ({ selectedStyle, onStyleChange }: ArtStyleSelectorProps) => {
  const [open, setOpen] = useState(false);
  
  const selectedStyleData = artStyles.find(style => style.id === selectedStyle);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Art Style</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-background/50 hover:bg-background"
          >
            {selectedStyleData ? (
              <div className="flex items-center gap-2">
                <span className="text-lg">{selectedStyleData.preview}</span>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{selectedStyleData.name}</span>
                  <span className="text-xs text-muted-foreground">{selectedStyleData.description}</span>
                </div>
              </div>
            ) : (
              <span className="text-muted-foreground">Select art style...</span>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search art styles..." 
              className="h-9" 
            />
            <CommandEmpty>No art style found.</CommandEmpty>
            <CommandList className="max-h-[300px]">
              <CommandGroup heading="Realistic">
                {artStyles
                  .filter(style => style.category === "realistic")
                  .map((style) => (
                    <CommandItem
                      key={style.id}
                      value={style.id}
                      onSelect={() => {
                        onStyleChange(style.id === selectedStyle ? "" : style.id);
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 cursor-pointer"
                    >
                      <span className="text-xl">{style.preview}</span>
                      <div className="flex-1">
                        <div className="font-medium">{style.name}</div>
                        <div className="text-sm text-muted-foreground">{style.description}</div>
                      </div>
                      <Check
                        className={`ml-auto h-4 w-4 ${
                          selectedStyle === style.id ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </CommandItem>
                  ))
                }
              </CommandGroup>
              
              <CommandGroup heading="Stylized">
                {artStyles
                  .filter(style => style.category === "stylized") 
                  .map((style) => (
                    <CommandItem
                      key={style.id}
                      value={style.id}
                      onSelect={() => {
                        onStyleChange(style.id === selectedStyle ? "" : style.id);
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 cursor-pointer"
                    >
                      <span className="text-xl">{style.preview}</span>
                      <div className="flex-1">
                        <div className="font-medium">{style.name}</div>
                        <div className="text-sm text-muted-foreground">{style.description}</div>
                      </div>
                      <Check
                        className={`ml-auto h-4 w-4 ${
                          selectedStyle === style.id ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </CommandItem>
                  ))
                }
              </CommandGroup>
              
              <CommandGroup heading="Geometric">
                {artStyles
                  .filter(style => style.category === "geometric")
                  .map((style) => (
                    <CommandItem
                      key={style.id}
                      value={style.id}
                      onSelect={() => {
                        onStyleChange(style.id === selectedStyle ? "" : style.id);
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 cursor-pointer"
                    >
                      <span className="text-xl">{style.preview}</span>
                      <div className="flex-1">
                        <div className="font-medium">{style.name}</div>
                        <div className="text-sm text-muted-foreground">{style.description}</div>
                      </div>
                      <Check
                        className={`ml-auto h-4 w-4 ${
                          selectedStyle === style.id ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </CommandItem>
                  ))
                }
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedStyleData && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {selectedStyleData.category.charAt(0).toUpperCase() + selectedStyleData.category.slice(1)}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Model preview will update with {selectedStyleData.name.toLowerCase()} style
          </span>
        </div>
      )}
    </div>
  );
};