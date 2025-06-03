import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { login, logout, register } from '../api/auth'

export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async(data) => {const res = await login(data);
      localStorage.setItem('token', res.data.token);
      return res;
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
      const token = localStorage.getItem('token')      
      if (!token) throw new Error('Not authenticated')
      return token 
    },
    retry: false,
    staleTime: Infinity,
  })
}

