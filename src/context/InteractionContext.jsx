import { createContext, useContext, useState } from 'react'

const InteractionContext = createContext()

export const useInteraction = () => {
  const context = useContext(InteractionContext)
  if (!context) {
    throw new Error('useInteraction must be used within an InteractionProvider')
  }
  return context
}

export const InteractionProvider = ({ children }) => {
  const [activeElement, setActiveElement] = useState(null)

  const setActive = (elementId) => {
    setActiveElement(elementId)
  }

  const clearActive = () => {
    setActiveElement(null)
  }

  const isActive = (elementId) => {
    return activeElement === elementId
  }

  return (
    <InteractionContext.Provider value={{
      activeElement,
      setActive,
      clearActive,
      isActive
    }}>
      {children}
    </InteractionContext.Provider>
  )
}