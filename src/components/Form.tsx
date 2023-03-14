import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import logo from '../assets/logo.png';
import useFetch from '../hooks/useFetch';
import './Form.css';

const POKEMONS_URL = 'https://pokeapi.co/api/v2/pokemon?limit=151&offset=0'
const POST_URL = 'src/data/fakeAPI.json'

type Inputs = {
  trainerName: string,
  pokemon: string,
};

const Form = () => {
  const { data, isLoading, error } = useFetch(POKEMONS_URL)
  const { fetcher, isLoading: postIsLoading, error: postError } = useFetch()
  const { register, handleSubmit, formState: { errors }, resetField } = useForm<Inputs>();
  const [showStatus, setShowStatus] = useState(false)

  const clearForm = () => {
    resetField('pokemon')
    resetField('trainerName')
  }

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setShowStatus(true)
    fetcher(POST_URL, 'POST', data, clearForm)
  }

  const pokemonSelect = () => {
    if (isLoading) return <>Loading...</>
    if (error) return <>Something went wrong</>
    return <>
      <select
        {...register('pokemon', { required: true })}
        placeholder='Your pokemon'
      >
        <option value='' disabled>Select your pokemon</option>
        {data.map(({ name }) =>
          <option
            key={name}
            value={name}
          >
            {name}
          </option>
        )}
      </select>
      {errors.pokemon && <span className='error'>This field is required</span>}
    </>
  }

  return (
    <div className='form-container'>
      <img src={logo} width='200px' className='logo' />
      <form onSubmit={handleSubmit(onSubmit)} className='form'>
        <input {...register('trainerName', { required: true, minLength: 3 })} placeholder={`Trainer\'s name`} onChange={() => setShowStatus(false)} />
        {errors.trainerName?.type === 'required' && <span className='error'>This field is required</span>}
        {errors.trainerName?.type === 'minLength' && <span className='error'>The name should be at least 3 characters long</span>}
        {pokemonSelect()}
        <input type='submit' value='Go!' className='button' />
      </form>
      {showStatus && postIsLoading && <p className='status-info'>Sending data...</p>}
      {showStatus && postError && <p className='status-info'>Something's wrong. Try again</p>}
      {showStatus && postError === null && <p className='status-info'>The data has been sent.</p>}
    </div>
  );
}

export default Form