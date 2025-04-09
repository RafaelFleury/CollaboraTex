import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAnonymousLinks } from '@/hooks/useAnonymousLinks';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Loader2, Copy, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface AnonymousLinkModalProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AnonymousLinkModal({ documentId, isOpen, onClose }: AnonymousLinkModalProps) {
  const [permission, setPermission] = useState('read');
  const [expirationDays, setExpirationDays] = useState<string>('7');
  const [isCopied, setIsCopied] = useState(false);

  const {
    links,
    isLoading,
    error,
    revokingLinkId,
    deletingLinkId,
    isGenerating,
    generatedLink,
    generateLink,
    revokeLink,
    deleteLink,
    formatDate,
    getFullUrl,
    setGeneratedLink
  } = useAnonymousLinks(documentId);

  const handleGenerateLink = async () => {
    const link = await generateLink({
      permission,
      expiresInDays: expirationDays ? parseInt(expirationDays) : null
    });

    if (link) {
      toast.success('Link generated successfully');
    }
  };

  const handleCopyLink = async (token: string) => {
    const url = getFullUrl(token);
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback para ambientes não-HTTPS
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success('Link copied to clipboard');
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy link');
    }
  };

  const handleRevokeLink = async (linkId: string) => {
    const success = await revokeLink(linkId);
    if (success) {
      toast.success('Link revoked successfully');
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    const success = await deleteLink(linkId);
    if (success) {
      toast.success('Link deleted successfully');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Manage Anonymous Links
                </Dialog.Title>

                <div className="space-y-4">
                  {/* Generate new link section */}
                  <div className="space-y-4 border-b pb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Permission</Label>
                        <Select value={permission} onValueChange={setPermission}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="read">Read</SelectItem>
                            <SelectItem value="write">Write</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Expires in (days)</Label>
                        <Input
                          type="number"
                          value={expirationDays}
                          onChange={(e) => setExpirationDays(e.target.value)}
                          min="1"
                          placeholder="Days until expiration"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerateLink}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        'Generate Link'
                      )}
                    </Button>

                    {generatedLink && (
                      <div className="mt-2 flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Input value={generatedLink} readOnly />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopyLink(generatedLink)}
                        >
                          {isCopied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Existing links section */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Existing Links</h4>
                    
                    {isLoading ? (
                      <div className="flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : error ? (
                      <div className="text-red-500 text-center">{error}</div>
                    ) : links.length === 0 ? (
                      <div className="text-gray-500 text-center">No links generated yet</div>
                    ) : (
                      <div className="space-y-2">
                        {links.map((link) => (
                          <div
                            key={link.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {link.permission.charAt(0).toUpperCase() + link.permission.slice(1)}
                                </span>
                                {!link.is_active && (
                                  <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                                    Revoked
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                Created: {formatDate(link.created_at)}
                                {link.expires_at && (
                                  <> · Expires: {formatDate(link.expires_at)}</>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleCopyLink(link.access_token)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>

                              {link.is_active && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleRevokeLink(link.id)}
                                  disabled={revokingLinkId === link.id}
                                >
                                  {revokingLinkId === link.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <X className="h-4 w-4" />
                                  )}
                                </Button>
                              )}

                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDeleteLink(link.id)}
                                disabled={deletingLinkId === link.id}
                              >
                                {deletingLinkId === link.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <X className="h-4 w-4 text-red-500" />
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 