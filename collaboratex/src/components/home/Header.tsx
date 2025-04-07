"use client";

import HeaderLayout from '@/components/layout/header';
import { useAuth } from '@/hooks/use-auth';

export default function Header() {
  const { isLoggedIn } = useAuth();
  
  return <HeaderLayout showAuthButtons={true} />;
} 