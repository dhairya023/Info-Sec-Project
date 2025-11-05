"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronUp, ChevronDown, Play, Pause, FastForward, Rewind, ZoomIn } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function VisualizationPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-t">
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between p-2 cursor-pointer bg-card/50 hover:bg-muted">
          <h3 className="font-headline text-lg ml-2">Visualization</h3>
          <Button variant="ghost" size="icon">
            {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
            <span className="sr-only">Toggle Visualization Panel</span>
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
        <div className="p-4 bg-muted/20 h-64 flex flex-col items-center justify-center text-center">
            <ZoomIn className="h-12 w-12 text-muted-foreground mb-4" />
          <h4 className="text-xl font-semibold text-muted-foreground">Interactive Visualization</h4>
          <p className="text-muted-foreground">Animations will appear here to show how the algorithm works step-by-step.</p>
           <div className="flex items-center gap-4 mt-4">
            <Button variant="outline" size="icon" disabled><Rewind className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" disabled><Pause className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" disabled><Play className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" disabled><FastForward className="h-4 w-4" /></Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
