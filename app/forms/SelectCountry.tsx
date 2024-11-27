"use client"

import Select from 'react-select'
import useCountries from '../hooks/useCountry'


export type SelectCountryValue = {
    label: string
    value: string
}


interface SelectCountryTypeProps {
    value?: SelectCountryValue
    onChange: (value: SelectCountryValue) => void
}

const SelectCountry: React.FC<SelectCountryTypeProps> = ({
    value,
    onChange
}) => {
    const {getAll} = useCountries()
    return (
        <>
         <Select isClearable 
         className='text-black'
         placeholder="Anywhere" 
         options={getAll()} 
         value={value}
         onChange={(value) => onChange(value as SelectCountryValue)}
         />
        </>
    )
}

export default SelectCountry