import { Theme, Flex } from '@radix-ui/themes'
import { Card } from './components/Card'

function App() {
  return (
    <Theme accentColor="violet" radius="large" scaling="100%">
      <Flex direction="column" align="center" justify="center" gap="4" style={{ minHeight: '100vh' }}>
        <Card
          title="Franco Andrade"
          description="Designer at ZeroNorth. Building design systems with Radix UI."
          badge="Pro"
          avatarFallback="FA"
        />
        <Card
          title="Simple Card"
          description="A minimal card with no avatar or badge."
        />
        <Card
          title="Badge Only"
          badge="New"
        />
      </Flex>
    </Theme>
  )
}

export default App
