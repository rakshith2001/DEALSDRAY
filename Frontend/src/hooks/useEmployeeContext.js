import { EmployeeContext} from '../context/EmployeeContext'
import { useContext } from 'react'

export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext)

  if (!context) {
    throw Error('useWorkoutsContext must be used inside an EmployeeContextProvider')
  }
4
  return context
}