import { Card as RadixCard, Flex, Text, Heading, Avatar, Badge } from '@radix-ui/themes'

interface CardProps {
  title: string
  description?: string
  badge?: string
  avatarFallback?: string
  avatarSrc?: string
}

export function Card({ title, description, badge, avatarFallback, avatarSrc }: CardProps) {
  return (
    <RadixCard size="3" style={{ maxWidth: 360 }}>
      <Flex gap="3" align="start">
        {(avatarFallback || avatarSrc) && (
          <Avatar
            size="4"
            src={avatarSrc}
            fallback={avatarFallback ?? '?'}
            radius="full"
          />
        )}
        <Flex direction="column" gap="1" style={{ flex: 1 }}>
          <Flex align="center" justify="between" gap="2">
            <Heading size="4" style={{ color: 'var(--color-red-500)' }}>{title}</Heading>
            {badge && <Badge color="violet">{badge}</Badge>}
          </Flex>
          {description && (
            <Text size="2" color="gray">
              {description}
            </Text>
          )}
        </Flex>
      </Flex>
    </RadixCard>
  )
}
