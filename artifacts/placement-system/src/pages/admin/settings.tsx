import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Shield, Globe, Bell, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Platform Settings</h2>
        <p className="text-muted-foreground">Configure global system behavior.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" /> University Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm font-medium">Institution Name</span>
                <div className="p-2 border rounded bg-muted/50 text-sm">Demo University Institute of Technology</div>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium">Domain</span>
                <div className="p-2 border rounded bg-muted/50 text-sm">demo.university.edu</div>
              </div>
            </div>
            <Button variant="outline" className="mt-2" disabled>Edit Profile (Coming Soon)</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-500" /> AI Features & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium text-sm">Automated Readiness Scoring</h4>
                <p className="text-xs text-muted-foreground mt-1">Allow AI to score profiles continuously</p>
              </div>
              <div className="h-6 w-11 bg-primary rounded-full relative opacity-50 cursor-not-allowed">
                <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium text-sm">Public Portfolio Sharing</h4>
                <p className="text-xs text-muted-foreground mt-1">Students can generate public links for external recruiters</p>
              </div>
              <div className="h-6 w-11 bg-primary rounded-full relative opacity-50 cursor-not-allowed">
                <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}