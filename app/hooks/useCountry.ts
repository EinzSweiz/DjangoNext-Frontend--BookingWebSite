import countries from 'world-countries'

const formtatedCountries =  countries.map((country) => ({
    value: country.cca2,
    label: country.name.common
}))

const useCountries = () => {
    const getAll = () => formtatedCountries

    const getByValue = (value: string) => {
        return formtatedCountries.find((item) => item.value === value)
    }
    return {
        getAll,
        getByValue
    }
}

export default useCountries