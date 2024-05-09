import { createContext, useReducer } from 'react';

export const EmployeeContext = createContext();

export const employeeReducer = (state, action) => {
    switch (action.type) {
        case 'SET_EMPLOYEES':
            return { employees: action.payload };

        case 'CREATE_EMPLOYEE':
            return {
                employees: [...state.employees, action.payload],
            };

            case 'UPDATE_EMPLOYEE':
                return {
                    employees: state.employees.map(employee => {
                        if (employee._id === action.payload._id) {
                            return action.payload;
                        }
                        return employee;
                    }),
                };
        
        case 'DELETE_EMPLOYEE':
            return {
                ...state,
                employees: state.employees.filter(employee => employee._id !== action.payload._id),
            };
        
        default:
            return state;
    }    
};

export const EmployeeContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(employeeReducer, {
        employees: [] // Initialize employees as an empty array
    });

    return (
        <EmployeeContext.Provider value={{ ...state, dispatch }}>
            {children}
        </EmployeeContext.Provider>
    );
};
