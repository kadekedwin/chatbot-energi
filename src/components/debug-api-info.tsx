'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { API_URL } from '@/lib/api-client';
import { Badge } from '@/components/ui/badge';

export function DebugAPIInfo() {
  // Hide in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          🔧 Debug Info (Development Only)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-600">API Base URL:</span>
          <Badge variant="outline" className="font-mono">
            {API_URL}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Environment:</span>
          <Badge variant="outline">
            {process.env.NODE_ENV}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Window Location:</span>
          <Badge variant="outline" className="font-mono text-[10px]">
            {typeof window !== 'undefined' ? window.location.origin : 'SSR'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
