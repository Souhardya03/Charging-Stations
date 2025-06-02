import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { login, logout, register } from '../api/auth'
import Cookies from 'js-cookie'

export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      const response = await login(data)
      // Set cookie manually after successful login
      if (response && response.token) {
        Cookies.set('token', response.token, { secure: true, sameSite: 'strict' })
      }
      return response
    },
    
    onSuccess: () => {
      queryClient.invalidateQueries(['login'])
    },
  })
}

export const useRegisterMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => register(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['register'])
    },
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.invalidateQueries(['logout'])
    },
  })
}

export function useAuthQuery() {
  return useQuery({
    queryKey: ['auth'],
    queryFn: () => {
      const token = Cookies.get('token')
      if (!token) throw new Error('Not authenticated')
      return { token }
    },
    retry: false,
    staleTime: Infinity,
  })
}

