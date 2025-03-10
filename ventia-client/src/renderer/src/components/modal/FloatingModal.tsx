import { useEffect, useState } from 'react'
import { Phone, ArrowLeft, Settings, Clock, PhoneCall, PhoneMissed } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Call } from '@shared/types'
import { formatDistanceToNow, format } from 'date-fns'
import { es } from 'date-fns/locale'

const FloatingModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [activeTab, setActiveTab] = useState('dialpad')
  const [callHistory, setCallHistory] = useState<Call[]>([])

  const loadCallHistory = async () => {
    const history = await window.context.getCallHistory()
    const sortedHistory = (history || []).sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })
    setCallHistory(sortedHistory)
  }

  useEffect(() => {
    loadCallHistory()
  }, [])

  const handleOpen = async () => {
    await window.context.openFloatingModal()
    setIsOpen(true)
  }

  const handleClose = async () => {
    await window.context.closeFloatingModal()
    setIsOpen(false)
  }

  const handleKeyPress = (key: string) => {
    if (key === 'delete') {
      setPhoneNumber((prev) => prev.slice(0, -1))
    } else {
      setPhoneNumber((prev) => prev + key)
    }
  }

  const handleCall = async () => {
    if (!phoneNumber) return
    console.log('Calling:', phoneNumber)
    await window.context.setCallHistory({
      duration: 0,
      number: phoneNumber,
      timestamp: new Date().toISOString()
    })
    await loadCallHistory()
  }

  useEffect(() => {
    const handleKeyboardInput = (e) => {
      if (activeTab === 'dialpad') {
        const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '#']
        if (allowedKeys.includes(e.key)) {
          handleKeyPress(e.key)
        } else if (e.key === 'Backspace') {
          handleKeyPress('delete')
        }
      }
    }

    window.addEventListener('keydown', handleKeyboardInput)
    return () => window.removeEventListener('keydown', handleKeyboardInput)
  }, [activeTab])

  return (
    <div className="bg-black shadow-2xl w-full h-full flex flex-col justify-center items-center overflow-hidden">
      {!isOpen ? (
        <div className="grid grid-cols-2 gap-1.5 p-1.5 cursor-pointer" onClick={handleOpen}>
          <div className="bg-white h-[6px] w-[6px] rounded-full"></div>
          <div className="bg-white h-[6px] w-[6px] rounded-full"></div>
          <div className="bg-white h-[6px] w-[6px] rounded-full"></div>
          <div className="bg-white h-[6px] w-[6px] rounded-full"></div>
          <div className="bg-white h-[6px] w-[6px] rounded-full"></div>
          <div className="bg-white h-[6px] w-[6px] rounded-full"></div>
        </div>
      ) : (
        <div className="w-full h-full flex  bg-black">
          <div
            className="text-white bg-slate-800 flex items-center justify-center h-full"
            onClick={handleClose}
          >
            <div
              className="grid grid-cols-2 gap-1.5 cursor-pointer px-2 py-4 bg-black rounded-l-xl"
              onClick={handleOpen}
            >
              <div className="bg-white h-[6px] w-[6px] rounded-full"></div>
              <div className="bg-white h-[6px] w-[6px] rounded-full"></div>
              <div className="bg-white h-[6px] w-[6px] rounded-full"></div>
              <div className="bg-white h-[6px] w-[6px] rounded-full"></div>
              <div className="bg-white h-[6px] w-[6px] rounded-full"></div>
              <div className="bg-white h-[6px] w-[6px] rounded-full"></div>
            </div>
          </div>
          <Tabs
            defaultValue="dialpad"
            className="w-full h-full flex flex-col"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-3 bg-black border-b border-gray-800 rounded-none h-auto p-0 focus:outline-none ring-0">
              <TabsTrigger
                value="dialpad"
                className="data-[state=active]:bg-black data-[state=active]:text-white py-3 rounded-none"
              >
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Dialpad
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="recent"
                className="data-[state=active]:bg-black data-[state=active]:text-white py-3 rounded-none"
              >
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="config"
                className="data-[state=active]:bg-black data-[state=active]:text-white py-3 rounded-none"
              >
                <span className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Config
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dialpad" className="">
              {/* Phone number display */}
              <div className="p-6 flex justify-center">
                <h1 className="text-white text-3xl font-bold">{phoneNumber}</h1>
                {!phoneNumber && <p className="text-gray-500">Enter a phone number</p>}
              </div>

              {/* Keypad */}
              <div className="flex-1 p-4 grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((key) => (
                  <button
                    key={key}
                    className="bg-transparent border border-gray-500 rounded-lg py-4 text-white text-md font-medium"
                    onClick={() => handleKeyPress(key.toString())}
                  >
                    {key}
                  </button>
                ))}
              </div>

              {/* Action buttons */}
              <div className="p-4 flex justify-center space-x-4">
                <button
                  className="bg-green-500 rounded-full p-4 flex items-center justify-center"
                  onClick={() => {
                    handleCall()
                  }}
                >
                  <Phone className="text-white h-6 w-6" />
                </button>
                <button
                  className="bg-black rounded-full p-4 flex items-center justify-center border border-gray-800"
                  onClick={() => handleKeyPress('delete')}
                >
                  <ArrowLeft className="text-white h-6 w-6" />
                </button>
              </div>
            </TabsContent>

            <TabsContent value="recent" className="p-4 overflow-y-auto">
              {callHistory.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {callHistory.map((call, index) => {
                    const callDate = new Date(call.timestamp)
                    return (
                      <div
                        key={index}
                        className="flex flex-col gap-4 bg-gray-800/50 p-4 rounded-lg w-full hover:bg-gray-800/70 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between ">
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-700 p-2 rounded-full">
                              <PhoneCall className="h-3 w-3 text-green-500" />
                            </div>
                            <div>
                              <p className="text-white font-medium text-xl">{call.number}</p>
                            </div>
                          </div>
                          <button
                            className="text-green-500 hover:text-green-400 p-2"
                            onClick={() => {
                              setPhoneNumber(call.number)
                              setActiveTab('dialpad')
                            }}
                          >
                            <Phone className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="flex flex-row justify-between w-full">
                          <p className="text-gray-400 text-sm">
                            {call.duration} segundos ·{' '}
                            {formatDistanceToNow(callDate, { addSuffix: true, locale: es })}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {format(callDate, 'dd/MM/yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-white text-center mt-10">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-xl font-medium mb-2">Recent Calls</h3>
                  <p className="text-gray-500">No recent calls</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="config" className="">
              <div className="text-white text-center mt-10">
                <Settings className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-medium mb-2">Configuration</h3>
                <p className="text-gray-500">No settings available</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

export default FloatingModal
