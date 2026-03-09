import { Theme, Button, Flex, Text, Heading } from '@radix-ui/themes'
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Theme accentColor="violet" radius="large" scaling="100%">
      <Flex direction="column" align="center" justify="center" gap="4" style={{ minHeight: '100vh' }}>
        <Heading size="8">Radix + React</Heading>
        <Text size="3" color="gray">Your app is ready. Start building.</Text>
        <Button size="3" onClick={() => setCount((c) => c + 1)}>
          Count is {count}
        </Button>
      </Flex>
    </Theme>
  )
}

export default App
