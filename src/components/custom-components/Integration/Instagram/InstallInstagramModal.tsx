'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { IntegrationService } from '@/services/integration/IntegrationService';

type InstallInstagramModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

type Page = {
  id: string;
  name: string;
  description: string;
  connected: boolean;
};

const InstallInstagramModal: React.FC<InstallInstagramModalProps> = ({
  open,
  setOpen,
}) => {
  const [pages, setPages] = React.useState<Page[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setLoading(true);
      IntegrationService.getInstagramIntegration()
        .then((response) => {
          const pagesArray = response.data || [];
          const formattedPages = pagesArray.map((page: any) => ({
            id: page.id || '1',
            name: page.page_name || 'Page',
            description: page.category || 'No category available',
            connected: page.instagram_flag || false,
          }));
          setPages(formattedPages);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [open]);

  const handleToggle = async (pageId: string, nextChecked: boolean) => {
    setLoading(true);
    setError(null);
    try {
      await IntegrationService.postInstagramDetails({ facebookPageId: pageId });

      setPages((prev) =>
        prev.map((page) =>
          page.id === pageId ? { ...page, connected: nextChecked } : page,
        ),
      );
    } catch (err: any) {
      setError(err.message || 'Failed to connect page');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[374px]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">
            Install Instagram
          </DialogTitle>
        </DialogHeader>

        <p className="pb-4.5 text-base font-medium">Select page for Oauth</p>

        <div className="flex flex-col gap-16.5 pb-14">
          {loading ? (
            <p className="text-theme-text-primary text-sm">Loading pages...</p>
          ) : pages.length > 0 ? (
            pages.map((page) => (
              <div key={page.id} className="flex items-center justify-between">
                <div>
                  <Label htmlFor={page.id} className="text-base font-normal">
                    {page.name}
                  </Label>
                  <p className="text-theme-text-primary text-sm">
                    {page.description}
                  </p>
                </div>
                <Switch
                  id={page.id}
                  checked={page.connected}
                  onCheckedChange={(nextChecked) =>
                    handleToggle(page.id, nextChecked)
                  }
                />
              </div>
            ))
          ) : (
            <p className="text-theme-text-primary text-sm">No pages found</p>
          )}
        </div>
        {error && <p className="text-alert-prominent">{error}</p>}
      </DialogContent>
    </Dialog>
  );
};

export default InstallInstagramModal;
