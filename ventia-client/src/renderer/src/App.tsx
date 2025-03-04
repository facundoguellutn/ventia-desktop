import { Button } from "./components/ui/button"


function App(): JSX.Element {

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-blue-500">Ventia</h1>
      <Button variant="outline">Click me</Button>
    </div>
  )
}

export default App
