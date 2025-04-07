"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';

export default function ProfilePage() {
  const { user, loading, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [loading, isLoggedIn, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getInitials = (email?: string): string => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Perfil do Usuário</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Informações Básicas */}
        <Card className="p-6">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback className="text-lg">{getInitials(user.email)}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold mb-2">{user.email}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Membro desde {new Date(user.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </Card>

        {/* Estatísticas */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Estatísticas</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Documentos Criados</p>
              <p className="text-2xl font-semibold">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Colaborações</p>
              <p className="text-2xl font-semibold">0</p>
            </div>
          </div>
        </Card>

        {/* Configurações */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Configurações</h2>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/profile/settings')}
            >
              Configurações da Conta
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/profile/security')}
            >
              Segurança
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/profile/notifications')}
            >
              Notificações
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
} 