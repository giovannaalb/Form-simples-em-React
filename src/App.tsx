import './App.css'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { z } from 'zod'
// Representação de uma estrutura de dados
import { zodResolver } from '@hookform/resolvers/zod'

const createUserFormSchema = z.object({
  name: z.string()
    .nonempty('Nome obrigatório')
    .transform(name => {
      return name.trim().split(' ').map(word => {
        return word[0].toLocaleUpperCase().concat(word.substring(1))
      }).join(' ')
      // transforma apenas a primeira letra de cada nome ou sobrenome em maiúscula
    }),
  email: z.string()
    .nonempty('O email é obrigatório')
    .email('Formato de email inválido')
    .toLowerCase(),
  password: z.string()
    .min(6, 'A senha precisa ter no mínimo 6 caracteres'),
})

type createUserFormData = z.infer<typeof createUserFormSchema>
// infer é para determinar de forma automática

function App() {
  const [output, setOutput] = useState('')
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)

  const { register, handleSubmit, formState: { errors } } = useForm<createUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

  function createUser(data: any) {
    setOutput(JSON.stringify(data, null, 2))
    // salva o resultado como string/json, não podendo ser nulo
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit(createUser)}>
        <label htmlFor="name">Nome:</label>
        <input type="text" {...register('name')} /><br />
        {errors.name && <span>{errors.name.message}</span>}

        <label htmlFor="email">Email:</label>
        <input type="email" {...register('email')} /><br />
        {errors.email && <span>{errors.email.message}</span>}

        <label htmlFor="password">Senha:</label>
        <input type="password" {...register('password')} /><br />
        {errors.password && <span>{errors.password.message}</span>}
        {/* Aparecem os erros previstos acima */}

        <label htmlFor="image">Imagem</label>
        <input type="file" onChange={handleImageChange} /> <br />

        <button type='submit'>Salvar</button>
      </form>
      <pre>{output}</pre>

      {imagePreviewUrl && (
        <div>
          <img src={imagePreviewUrl} alt="Image Preview" style={{ width: '300px', height: '300px' }} />
        </div>
      )}
    </main>
  )
}

export default App
