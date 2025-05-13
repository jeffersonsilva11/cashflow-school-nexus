
import React from 'react';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { FormControl } from '../ui/form';

export type ParentOption = {
  id: string;
  name: string;
  email: string;
};

interface ParentsMultiSelectProps {
  options: ParentOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export const ParentsMultiSelect = ({
  options = [], // Provide default empty array to avoid undefined
  selectedValues = [], // Provide default empty array to avoid undefined
  onChange,
  placeholder = "Selecione os responsáveis..."
}: ParentsMultiSelectProps) => {
  const [open, setOpen] = React.useState(false);
  
  // Make sure we're filtering from a non-undefined array
  const selectedParents = Array.isArray(options) ? 
    options.filter(option => Array.isArray(selectedValues) && selectedValues.includes(option.id)) : [];
  
  const handleSelect = (currentValue: string) => {
    // Ensure we're working with arrays
    const newSelectedValues = Array.isArray(selectedValues) ?
      (selectedValues.includes(currentValue)
        ? selectedValues.filter(value => value !== currentValue)
        : [...selectedValues, currentValue]) : 
      [currentValue];
    
    onChange(newSelectedValues);
  };
  
  const handleRemove = (id: string) => {
    onChange(Array.isArray(selectedValues) ? 
      selectedValues.filter(value => value !== id) : []);
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between text-left h-auto min-h-10",
              Array.isArray(selectedValues) && selectedValues.length > 0 ? "px-3 py-2" : ""
            )}
            onClick={() => setOpen(!open)}
          >
            {Array.isArray(selectedValues) && selectedValues.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedParents.map(parent => (
                  <Badge 
                    key={parent.id} 
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    {parent.name}
                    <Button
                      variant="ghost"
                      className="h-auto w-auto p-0 ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(parent.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar responsável..." />
          <CommandEmpty>Nenhum responsável encontrado.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {Array.isArray(options) && options.map(parent => (
              <CommandItem
                key={parent.id}
                value={parent.id}
                onSelect={() => handleSelect(parent.id)}
                className="flex items-center gap-2 justify-between"
              >
                <div className="flex flex-col">
                  <span>{parent.name}</span>
                  <span className="text-xs text-muted-foreground">{parent.email}</span>
                </div>
                <div className="flex h-4 w-4 items-center justify-center">
                  {Array.isArray(selectedValues) && selectedValues.includes(parent.id) && (
                    <Check className="h-4 w-4" />
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
