"use client";

import { Save } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsForm() {
  const [saved, setSaved] = useState(false);
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Travel defaults</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="home_city">Home city</Label>
            <Input id="home_city" defaultValue="Toronto" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="home_airport">Home airport</Label>
            <Input id="home_airport" defaultValue="YYZ" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Preferred currency</Label>
            <Input id="currency" defaultValue="CAD" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pace">Travel pace</Label>
            <Input id="pace" defaultValue="balanced" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="dietary">Dietary preferences</Label>
            <Input id="dietary" defaultValue="vegetarian" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="activities">Favorite activities</Label>
            <Input id="activities" defaultValue="photography, cultural places, scenic cafes" />
          </div>
        </div>
        <Button type="button" onClick={() => setSaved(true)}>
          <Save className="h-4 w-4" />
          Save preferences
        </Button>
        {saved ? <p className="text-sm text-primary">Preferences saved locally for this demo.</p> : null}
      </CardContent>
    </Card>
  );
}
