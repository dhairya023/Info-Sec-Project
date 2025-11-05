import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export function ComingSoon({ name }: { name: string }) {
  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 p-8">
          <Construction className="w-16 h-16 text-primary" />
          <p className="text-2xl font-medium">Coming Soon!</p>
          <p className="text-muted-foreground">
            This algorithm is currently under development. Please check back later!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
