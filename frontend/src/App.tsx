import { Center, MantineProvider, Text } from '@mantine/core';
import '@mantine/core/styles.css';

function App() {
  return (
    <MantineProvider>
      <Center>
        <Text>Hello world!</Text>
      </Center>
    </MantineProvider>
  )
}

export default App
