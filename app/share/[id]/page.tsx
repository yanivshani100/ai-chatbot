import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { formatDate } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { FooterText } from '@/components/footer'

interface SharePageProps {
  params: {
    id: string
  }
}
